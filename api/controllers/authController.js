/* eslint-disable consistent-return */
/* eslint-disable camelcase */
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const {
  createWishList,
  authenticateAnonymously,
  getWishList,
} = require('../firebase');

const create_post = async (req, res) => {
  try {
    const saltRounds = 10;
    const password = await bcrypt.hash(req.body.password, saltRounds);
    const adminPassword = await bcrypt.hash(req.body.adminPassword, saltRounds);
    const userCred = await authenticateAnonymously();
    const docref = await createWishList(
      userCred.user.uid,
      req.body.listName,
      password,
      adminPassword,
    );
    const token = jwt.sign(
      { listId: docref.id, isAdmin: true },
      process.env.REACT_APP_JWT_PRIVATE_KEY,
      {
        expiresIn: '1d',
      },
    );
    res.status(200).json({ listId: docref.id, token });
  } catch (error) {
    res.status(500).json(error);
  }
};

const login_post = async (req, res) => {
  try {
    let isAdmin = false;
    await authenticateAnonymously();
    const wishListDoc = await getWishList(req.body.listId);
    if (!wishListDoc.data()) {
      return res.status(404).json('This list ID does not exist!');
    }
    const password = await bcrypt.compare(req.body.password, wishListDoc.data().secretKey);
    if (!password) {
      return res.status(401).json('Bad password!');
    }
    if (req.body.adminPassword) {
      isAdmin = true;
      const adminPassword = await bcrypt.compare(
        req.body.adminPassword,
        wishListDoc.data().adminSecretKey,
      );
      if (!adminPassword) {
        return res.status(401).json('Bad password!');
      }
    }

    const token = jwt.sign(
      { listId: req.body.listId, isAdmin },
      process.env.REACT_APP_JWT_PRIVATE_KEY,
      {
        expiresIn: '1d',
      },
    );
    const { secretKey, adminSecretKey, ...data } = wishListDoc.data();
    res.status(200).json({ ...data, token });
  } catch (error) {
    res.status(500).json(error);
  }
};

const adminlogin_post = async (req, res) => {
  if (req.params.id === req.listId) {
    try {
      await authenticateAnonymously();
      const wishListDoc = await getWishList(req.listId);
      const adminPassword = await bcrypt.compare(
        req.body.adminPassword,
        wishListDoc.data().adminSecretKey,
      );
      if (!adminPassword) {
        return res.status(401).json('Bad admin password!');
      }

      const token = jwt.sign(
        { listId: req.listId, isAdmin: true },
        process.env.REACT_APP_JWT_PRIVATE_KEY,
        {
          expiresIn: '1d',
        },
      );
      const { secretKey, adminSecretKey, ...data } = wishListDoc.data();
      res.status(200).json({ ...data, token });
    } catch (error) {
      res.status(500).json(error);
    }
  } else {
    res.status(403).json('You are not authorized to access this Wish List!');
  }
};

module.exports = {
  create_post,
  login_post,
  adminlogin_post,
};
