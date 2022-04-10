const express = require('express');
const http = require('http');
const cors = require('cors');
const helmet = require('helmet');
const path = require('path');
// eslint-disable-next-line global-require
if (process.env.NODE_ENV !== 'production') require('dotenv').config();

const app = express();
const server = http.createServer(app);
const io = require('socket.io')(server, {
  cors: { origin: 'https://paether-wishlistapp.herokuapp.com' },
});

const { streamData, socketAuth } = require('./socket');
const authRouter = require('./routes/auth');
const wishListRouter = require('./routes/wishList');

const port = process.env.PORT || 8800;

io.use(socketAuth).on('connection', streamData);

app.use(express.json());
app.use(cors());
app.use(helmet());

app.use('/api/auth', authRouter);
app.use('/api/wishList', wishListRouter);

app.use(express.static(path.join(__dirname, '/client/build')));

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '/client/build', 'index.html'));
});

server.listen(port, () => {
  console.log(`Express server listening on: ${port}`);
});

module.exports = { app, io };
