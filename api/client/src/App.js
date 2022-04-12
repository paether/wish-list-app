import { useEffect, useCallback, useContext } from "react";
import { Routes, Route, BrowserRouter } from "react-router-dom";

import "./App.css";
import {
  AdminContext,
  AuthorizedContext,
  WishListIdContext,
  LanguageContext,
  LoadingContext,
} from "./context";
import CreateWishList from "./pages/CreateWishList";
import Header from "./pages/Header";
import Footer from "./pages/Footer";
import Home from "./pages/Home";
import Loading from "./pages/Loading";
import OpenList from "./pages/OpenList";
import WishListMenu from "./components/WishListMenu";

function App() {
  const [wishListId, setWishListId] = useContext(WishListIdContext);
  const [, setIsAuthorized] = useContext(AuthorizedContext);
  const [isLoading, setIsLoading] = useContext(LoadingContext);
  const [, setIsAdmin] = useContext(AdminContext);
  // const [error, setError] = useState(null);
  const [language] = useContext(LanguageContext);
  useEffect(() => {
    localStorage.setItem("language", JSON.stringify(language));
  }, [language]);

  const onWhishListCreation = useCallback(
    (wishListId, token) => {
      setIsLoading(true);
      localStorage.setItem("token", token);
      localStorage.setItem("listId", wishListId);
      setWishListId(wishListId);
      setIsAuthorized(true);
      setIsAdmin(true);
      setIsLoading(false);
    },
    [setIsAdmin, setIsAuthorized, setIsLoading, setWishListId]
  );

  useEffect(() => {
    if (!wishListId) {
      const storageWishListId = localStorage.getItem("listId");

      if (storageWishListId) {
        setWishListId(wishListId);
      }
    }
  }, [setWishListId, wishListId]);

  return (
    <BrowserRouter>
      <Header />
      <Routes>
        <Route path="/" element={<Home {...{ language }} />} />
        <Route
          path="/create"
          element={<CreateWishList {...{ onWhishListCreation }} />}
        />
        <Route
          path="/wishList"
          // element={
          //   wishListId && !isLoading ? (
          //     <WishListMenu
          //       {...{
          //         isLoading,
          //       }}
          //     />
          //   ) : isLoading ? (
          //     <Loading />
          //   ) : (
          //     <OpenList />
          //   )
          // }
          element={
            wishListId ? (
              <WishListMenu
                {...{
                  isLoading,
                }}
              />
            ) : (
              <OpenList />
            )
          }
        />
      </Routes>
      <Footer />
    </BrowserRouter>
  );
}

export default App;
