const router = require("express").Router();
const jwt = require("jsonwebtoken");

const { v4: uuidv4 } = require("uuid");
const {
  createWishList,
  authenticateAnonymously,
  getWishList,
} = require("../firebase");
const bcrypt = require("bcryptjs");

router.post("/create", async (req, res) => {
  try {
    const listId = uuidv4();
    const userCred = await authenticateAnonymously();
    const docref = await createWishList(
      listId,
      userCred.user.uid,
      req.body.listName,
      bcrypt.hashSync(req.body.password, bcrypt.genSaltSync()),
      bcrypt.hashSync(req.body.adminPassword, bcrypt.genSaltSync())
    );
    const token = jwt.sign(
      { listId, listName: req.body.listName },
      process.env.REACT_APP_JWT_PRIVATE_KEY,
      {
        expiresIn: "1d",
      }
    );

    res.json({ listId: docref.id, token });
  } catch (error) {
    res.json(error);
  }
});

router.post("/login", async (req, res) => {
  try {
    const userCred = await authenticateAnonymously();

    const wishListDoc = await getWishList(req.body.listId);
    if (!wishListDoc.data()) {
      return res.status(404).json("This list ID does not exist!");
    } else {
      if (
        !bcrypt.compareSync(req.body.password, wishListDoc.data().secretKey)
      ) {
        res.status(401).json("Bad password!");
      }
      if (req.adminPassword) {
        if (
          !bcrypt.compareSync(
            req.body.adminPassword,
            wishListDoc.data().adminSecretKey
          )
        ) {
          res.status(401).json("Bad admin password!");
        }
      }
    }
    const token = jwt.sign(
      { listId: req.body.listId, listName: wishListDoc.data().listName },
      process.env.REACT_APP_JWT_PRIVATE_KEY,
      {
        expiresIn: "1d",
      }
    );
    const { secretKey, adminSecretKey, ...data } = wishListDoc.data();
    res.status(200).json({ ...data, token });
  } catch (error) {
    console.log(error);
  }
});

module.exports = router;
