const router = require("express").Router();
const jwt = require("jsonwebtoken");
const {
  createWishList,
  authenticateAnonymously,
  getWishList,
} = require("../firebase");
const bcrypt = require("bcryptjs");

//create list and log user in
router.post("/create", async (req, res) => {
  try {
    const userCred = await authenticateAnonymously();
    const docref = await createWishList(
      userCred.user.uid,
      req.body.listName,
      bcrypt.hashSync(req.body.password, bcrypt.genSaltSync()),
      bcrypt.hashSync(req.body.adminPassword, bcrypt.genSaltSync())
    );
    const token = jwt.sign(
      { listId: docref.id, isAdmin: true },

      process.env.REACT_APP_JWT_PRIVATE_KEY,
      {
        expiresIn: "1d",
      }
    );
    res.status(200).json({ listId: docref.id, token });
  } catch (error) {
    res.status(500).json(error);
  }
});
//login for the specific list
router.post("/login", async (req, res) => {
  try {
    let isAdmin = false;
    await authenticateAnonymously();
    const wishListDoc = await getWishList(req.body.listId);
    if (!wishListDoc.data()) {
      return res.status(404).json("This list ID does not exist!");
    } else {
      if (
        !bcrypt.compareSync(req.body.password, wishListDoc.data().secretKey)
      ) {
        return res.status(401).json("Bad password!");
      }
      if (req.body.adminPassword) {
        isAdmin = true;
        if (
          !bcrypt.compareSync(
            req.body.adminPassword,
            wishListDoc.data().adminSecretKey
          )
        ) {
          return res.status(401).json("Bad admin password!");
        }
      }
    }
    const token = jwt.sign(
      { listId: req.body.listId, isAdmin },
      process.env.REACT_APP_JWT_PRIVATE_KEY,
      {
        expiresIn: "1d",
      }
    );
    const { secretKey, adminSecretKey, ...data } = wishListDoc.data();
    res.status(200).json({ ...data, token });
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
});

//ad-hoc admin login for already logged in user
router.post("/adminlogin/:id", async (req, res) => {
  try {
    await authenticateAnonymously();
    const wishListDoc = await getWishList(req.body.listId);
    if (
      !bcrypt.compareSync(
        req.body.adminPassword,
        wishListDoc.data().adminSecretKey
      )
    ) {
      return res.status(401).json("Bad admin password!");
    }

    const token = jwt.sign(
      { listId: req.body.listId, isAdmin: true },
      process.env.REACT_APP_JWT_PRIVATE_KEY,
      {
        expiresIn: "1d",
      }
    );
    const { secretKey, adminSecretKey, ...data } = wishListDoc.data();
    res.status(200).json({ ...data, token });
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
});

module.exports = router;
