/* eslint-disable camelcase */
const router = require('express').Router();
const verifyToken = require('../verifyToken');
const wishList_controller = require('../controllers/wishListController');
const wishListItem_controller = require('../controllers/wishListItemController');

// ------WishList-------
// real-time updating
router.get('/subscribe/:id', verifyToken, wishList_controller.subscribe_id_get);

// get list data
router.get('/:id', verifyToken, wishList_controller.id_get);

// add item to  list
router.post('/:id', verifyToken, wishList_controller.id_post);

// -------WishList Items-------
// delete list item
router.delete(
  '/:id/item/:itemid',
  verifyToken,
  wishListItem_controller.id_delete,
);

// update list
router.put(
  '/:id/item/:itemid',
  verifyToken,
  wishListItem_controller.id_put,
);

// update list item status
router.put(
  '/:id/item/:itemid/status',
  verifyToken,
  wishListItem_controller.id_status_put,
);
module.exports = router;
