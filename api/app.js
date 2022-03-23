const express = require('express');
const http = require('http');
const cors = require('cors');

const port = 8800;
const dotenv = require('dotenv');
const jwt = require('jsonwebtoken');

dotenv.config();

const app = express();
app.use(cors());
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

app.use('/api/auth', authRouter);
app.use('/api/wishList', wishListRouter);

app.get('/', (req, res) => {
  res.send('Hello World!');
});

server.listen(port, () => {
  console.log(`Express server listening on: ${port}`);
});

module.exports = app;
