/* eslint-disable camelcase */
const {
  authenticateAnonymously,
  getWishList,
  streamWishListItems,
  addWishListItem,
} = require('../firebase');

const subscribe_id_get = async (req, res, next) => {
  if (req.params.id === req.listId) {
    try {
      await authenticateAnonymously();
      const subscribe = streamWishListItems(req.listId, (querySnapshot) => {
        const updatedWishListItems = querySnapshot.docs.map((docSnapshot) => docSnapshot.data());
        res.status(200).json(updatedWishListItems);
        next(subscribe());
      });
    } catch (error) {
      res.status(500).json(error);
    }
  } else {
    res.status(403).json('You are not authorized to access this Wish List!');
  }
};

const id_get = async (req, res) => {
  if (req.params.id === req.listId) {
    try {
      await authenticateAnonymously();
      const returnedWishList = await getWishList(req.listId);
      res.status(200).json(returnedWishList.data().listName);
    } catch (error) {
      res.status(500).json(error);
    }
  } else {
    res.status(403).json('You are not authorized to access this Wish List!');
  }
};

const id_post = async (req, res) => {
  if (req.params.id === req.listId && req.isAdmin) {
    try {
      await authenticateAnonymously();
      await addWishListItem(
        req.body.itemName,
        req.body.itemDesc,
        req.params.id,
        req.body.itemUrl,
        req.body.pictureUrl,
      );

      res.status(200).json({ status: 'ok' });
    } catch (error) {
      res.status(500).json(error);
    }
  } else {
    res
      .status(403)
      .json('You are not authorized to add an item to this Wish List!');
  }
};

module.exports = {
  subscribe_id_get,
  id_get,
  id_post,
};
