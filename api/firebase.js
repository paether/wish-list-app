const dotenv = require("dotenv");
dotenv.config();
const { v4: uuidv4 } = require("uuid");

const { initializeApp } = require("firebase/app");
const {
  getFirestore,
  query,
  orderBy,
  onSnapshot,
  collection,
  getDoc,
  setDoc,
  getDocs,
  addDoc,
  updateDoc,
  doc,
  serverTimestamp,
  arrayUnion,
  deleteDoc,
} = require("firebase/firestore");
const { getAuth, signInAnonymously } = require("firebase/auth");

const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const authenticateAnonymously = () => {
  return signInAnonymously(getAuth(app));
};

const createWishList = (userId, whishListName, secretKey, adminSecretKey) => {
  const wishListRefCol = collection(db, "wishLists");
  return addDoc(wishListRefCol, {
    created: serverTimestamp(),
    locked: false,
    secretKey,
    adminSecretKey,
    listName: whishListName,
    createdBy: userId,
  });
};

const getWishLists = () => {
  const wishListsRefDoc = collection(db, "wishLists");
  return wishListsRefDoc;
};

const getWishList = (wishListId) => {
  const wishListRefDoc = doc(db, "wishLists", wishListId);
  return getDoc(wishListRefDoc);
};

const getWishListItems = (wishListId) => {
  const wishListRefCol = collection(db, "wishLists", wishListId, "items");
  return getDocs(wishListRefCol);
};

const streamWishListItems = (wishListId, snapshot, error) => {
  const itemsColRef = collection(db, "wishLists", wishListId, "items");
  const itemsQuery = query(itemsColRef, orderBy("created"));
  return onSnapshot(itemsQuery, snapshot, error);
};

const addUserWishList = (wishListId, userId) => {
  const wishListRefDoc = doc(db, "wishLists", wishListId);
  return updateDoc(wishListRefDoc, {
    users: arrayUnion({
      userId: userId,
    }),
  });
};

const updateWishListStatus = (wishListId, locked) => {
  const wishListRefDoc = doc(db, "wishLists", wishListId);
  return updateDoc(
    wishListRefDoc,
    {
      locked,
    },
    { merge: true }
  );
};

const updateWishListItemName = (wishListId, listItemId, name) => {
  const listItemRef = doc(db, "wishLists", wishListId, "items", listItemId);
  return (
    updateDoc(listItemRef, {
      name,
    }),
    { merge: true }
  );
};

const updateWishListItemStatus = async (
  wishListId,
  listItemId,
  reserved,
  bought
) => {
  const listItemRef = doc(db, "wishLists", wishListId, "items", listItemId);
  const listItemDoc = await getDoc(listItemRef);

  if (listItemDoc.data().bought === false) {
    return updateDoc(
      listItemRef,
      {
        reserved,
        bought,
      },
      { merge: true }
    );
  }
};

const deleteWishListItem = (wishListId, listItemId) => {
  const listItemRef = doc(db, "wishLists", wishListId, "items", listItemId);
  return deleteDoc(listItemRef);
};

const addWishListItem = async (
  itemName,
  itemDesc,
  wishListId,
  itemUrl,
  pictureUrl
) => {
  // const querySnapshot = await getWishListItems(wishListId);
  // const wishListItems = querySnapshot.docs;
  // const matchingItem = wishListItems.find(
  //   (wishListItem) =>
  //     wishListItem.data().itemName.toLowerCase() === itemName.toLowerCase()
  // );
  // if (!matchingItem) {
  const id = uuidv4();
  const itemsColRef = doc(db, "wishLists", wishListId, "items", id);
  return setDoc(itemsColRef, {
    id,
    reserved: false,
    bought: false,
    itemName,
    itemDesc,
    itemUrl,
    pictureUrl,
    created: serverTimestamp(),
  });
  // }
};

module.exports = {
  authenticateAnonymously,
  createWishList,
  getWishList,
  getWishListItems,
  streamWishListItems,
  addUserWishList,
  addWishListItem,
  getWishLists,
  deleteWishListItem,
  updateWishListItemStatus,
  updateWishListItemName,
  updateWishListStatus,
};
