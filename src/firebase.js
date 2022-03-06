import { initializeApp } from "firebase/app";
import uniqid from "uniqid";
import {
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
} from "firebase/firestore";
import { getAuth, signInAnonymously } from "firebase/auth";

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
    users: [
      {
        userId: userId,
      },
    ],
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

export const updateWishListStatus = (wishListId, locked) => {
  const wishListRefDoc = doc(db, "wishLists", wishListId);
  return updateDoc(
    wishListRefDoc,
    {
      locked,
    },
    { merge: true }
  );
};

export const updateWishListItemName = (wishListId, listItemId, name) => {
  const listItemRef = doc(db, "wishLists", wishListId, "items", listItemId);
  return (
    updateDoc(listItemRef, {
      name,
    }),
    { merge: true }
  );
};

export const updateWishListItemStatus = (wishListId, listItemId, checked) => {
  const listItemRef = doc(db, "wishLists", wishListId, "items", listItemId);
  return updateDoc(
    listItemRef,
    {
      checked,
    },
    { merge: true }
  );
};

export const deleteWishListItem = (wishListId, listItemId) => {
  const listItemRef = doc(db, "wishLists", wishListId, "items", listItemId);
  return deleteDoc(listItemRef);
};

const addWishListItem = async (itemName, wishListId, link) => {
  const querySnapshot = await getWishListItems(wishListId);
  const wishListItems = querySnapshot.docs;
  const matchingItem = wishListItems.find(
    (wishListItem) =>
      wishListItem.data().name.toLowerCase() === itemName.toLowerCase()
  );
  if (!matchingItem) {
    const id = uniqid();
    const itemsColRef = doc(db, "wishLists", wishListId, "items", id);
    return setDoc(itemsColRef, {
      id,
      checked: false,
      name: itemName,
      link,
      created: serverTimestamp(),
    });
  }
  throw new Error("duplicate-item-error");
};

export {
  authenticateAnonymously,
  createWishList,
  getWishList,
  getWishListItems,
  streamWishListItems,
  addUserWishList,
  addWishListItem,
  getWishLists,
};
