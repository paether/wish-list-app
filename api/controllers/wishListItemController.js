/* eslint-disable camelcase */
const {
  authenticateAnonymously,
  updateWishListItemStatus,
  deleteWishListItem,
  updateWishListItem,
} = require('../firebase');

const id_status_put = async (req, res) => {
  if (req.params.id === req.listId) {
    try {
      await authenticateAnonymously();
      await updateWishListItemStatus(
        req.params.id,
        req.params.itemid,
        req.body.reserved,
        req.body.bought,
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

const id_delete = async (req, res) => {
  if (req.params.id === req.listId && req.isAdmin) {
    try {
      await authenticateAnonymously();
      await deleteWishListItem(req.params.id, req.params.itemid);
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
const id_put = async (req, res) => {
  if (req.params.id === req.listId && req.isAdmin) {
    try {
      await authenticateAnonymously();
      await updateWishListItem(
        req.params.id,
        req.params.itemid,
        req.body.itemName,
        req.body.itemDesc,
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
  id_status_put,
  id_delete,
  id_put,
};
