const jwt = require('jsonwebtoken');
const {
  authenticateAnonymously,
  streamWishListItems,
} = require('./firebase');

const streamData = async (socket) => {
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
};

const socketAuth = (socket, next) => {
  jwt.verify(
    socket.handshake.auth.token,
    process.env.REACT_APP_JWT_PRIVATE_KEY,
    // eslint-disable-next-line consistent-return
    (err, decoded) => {
      if (err) return next(new Error('Authentication error'));
      next();
    },
  );
};

module.exports = { streamData, socketAuth };
