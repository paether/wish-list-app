const router = require("express").Router();
const verifyToken = require("../verifyToken");
const {
  addWishListItem,
  authenticateAnonymously,
  getWishList,
  streamWishListItems,
} = require("../firebase");

//real-time updating
router.get("/subscribe/:id", verifyToken, async (req, res, next) => {
  if (req.params.id === req.listId) {
    try {
      await authenticateAnonymously();
      const subscribe = streamWishListItems(req.listId, (querySnapshot) => {
        updatedWishListItems = querySnapshot.docs.map((docSnapshot) => {
          return docSnapshot.data();
        });
        res.status(200).json(updatedWishListItems);
        next(subscribe());
      });
    } catch (error) {
      console.log(error);
      res.status(500).json(error);
    }
  } else {
    res.status(403).json("You are not authorized to access this Wish List!");
  }
});

//get list data

router.get("/:id", verifyToken, async (req, res) => {
  if (req.params.id === req.listId) {
    try {
      await authenticateAnonymously();
      const returnedWishList = await getWishList(req.listId);
      res.status(200).json(returnedWishList.data().listName);
    } catch (error) {
      res.status(500).json(error);
    }
  } else {
    res.status(403).json("You are not authorized to access this Wish List!");
  }
});

//add item to  list
router.post("/:id", verifyToken, async (req, res) => {
  if (req.params.id === req.listId && req.isAdmin === true) {
    try {
      await authenticateAnonymously();
      await addWishListItem(
        req.body.itemName,
        req.body.itemDesc,
        req.params.id,
        req.body.itemUrl,
        req.body.pictureUrl
      );

      res.status(200).json({ status: "ok" });
    } catch (error) {
      res.status(500).json(error);
    }
  } else {
    res
      .status(403)
      .json("You are not authorized to add an item to this Wish List!");
  }
});

module.exports = router;
