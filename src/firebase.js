import { initializeApp } from "firebase/app";
import uniqid from "uniqid";
import {
  getFirestore,
  query,
  orderBy,
  onSnapshot,
  collection,
  getDoc,
  getDocs,
  addDoc,
  updateDoc,
  doc,
  serverTimestamp,
  arrayUnion,
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

const createWishList = (userId, whishListName, listSecretKey) => {
  const wishListRefCol = collection(db, "wishLists");
  return addDoc(wishListRefCol, {
    created: serverTimestamp(),
    secretKey: listSecretKey,
    listName: whishListName,
    id: uniqid(),
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

const addWishListItem = async (item, wishListId) => {
  const querySnapshot = await getWishListItems(wishListId);
  const wishListItems = querySnapshot.docs;
  const matchingItem = wishListItems.find(
    (wishListItem) =>
      wishListItem.data().name.toLowerCase() === item.toLowerCase()
  );
  if (!matchingItem) {
    const itemsColRef = collection(db, "wishLists", wishListId, "items");
    return addDoc(itemsColRef, {
      name: item,
      id: uniqid(),
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
