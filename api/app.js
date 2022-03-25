const express = require('express');
const http = require('http');
const cors = require('cors');
const helmet = require('helmet');
const jwt = require('jsonwebtoken');

// eslint-disable-next-line global-require
if (process.env.NODE_ENV !== 'production') require('dotenv').config();

const port = process.env.PORT;
const app = express();

const server = http.createServer(app);
const io = require('socket.io')(server, {
  cors: { origin: 'http://localhost:3000' },
});
const {
  authenticateAnonymously,
  streamWishListItems,
} = require('./firebase');

const authRouter = require('./routes/auth');
const wishListRouter = require('./routes/wishList');

io.on('connection', async (socket) => {
  let error = true;
  jwt.verify(
    socket.handshake.auth.token,
    process.env.REACT_APP_JWT_PRIVATE_KEY,
    (err, decoded) => {
      if (err) {
        socket.emit('message', { status: 'Not authorized' });
      } else {
        error = false;
      }
    },
  );
  if (!error) {
    try {
      await authenticateAnonymously();
      const subscribe = streamWishListItems(
        socket.handshake.query.wishListId,
        (querySnapshot) => {
          const updatedWishListItems = querySnapshot.docs.map((docSnapshot) => docSnapshot.data());
          socket.emit('message', updatedWishListItems);
        },
      );
    } catch (dberror) {
      console.log(dberror);
    }
  }
});

app.use(express.json());
app.use(cors());
app.use(helmet());

app.use('/api/auth', authRouter);
app.use('/api/wishList', wishListRouter);

app.get('/', (req, res) => {
  res.send('Hello World!');
});

server.listen(port, () => {
  console.log(`Express server listening on: ${port}`);
});

module.exports = app;
