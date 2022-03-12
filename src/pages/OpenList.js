import "./OpenList.css";
import WishListForm from "../components/WishListForm";
import { useNavigate } from "react-router-dom";
import { getWishList } from "../firebase";

import bcrypt from "bcryptjs";

export default function OpenList({
  setIsAdmin,
  setIsAuthorized,
  updateSessionData,
  setWishListId,
}) {
  const navigate = useNavigate();

  const openWishList = async (e, isOpenAsAdmin) => {
    e.preventDefault();

    const listIdInput = document.getElementById("list_id_name");
    const secretKeyElement = document.getElementById("secret_key");
    let listId;
    let adminAllowed = false;

    if (listIdInput.value.includes("listId")) {
      listId = listIdInput.value.match(/(?<=listId=).*/);
    } else {
      listId = listIdInput.value;
    }
    const wishListDoc = await getWishList(listId);
    if (!wishListDoc.data()) {
      listIdInput.setCustomValidity("This Wish List ID does not exist!");
      listIdInput.reportValidity();
    }

    if (
      bcrypt.compareSync(secretKeyElement.value, wishListDoc.data().secretKey)
    ) {
      if (isOpenAsAdmin) {
        const adminKeyElement = document.getElementById("admin_key");
        if (
          bcrypt.compareSync(
            adminKeyElement.value,
            wishListDoc.data().adminSecretKey
          )
        ) {
          setIsAdmin(true);
          adminAllowed = true;
        } else {
          adminKeyElement.setCustomValidity(
            "Wish List Admin Password is wrong!"
          );
          adminKeyElement.reportValidity();
          return;
        }
      }
      navigate(`/wishList?listId=${listId}`);
      setIsAuthorized(true);
      setWishListId(listId, "/wishList");
      updateSessionData(listId, adminAllowed);
    } else {
      secretKeyElement.setCustomValidity("Wish List Password is wrong!");
      secretKeyElement.reportValidity();
    }
  };
  return (
    <div className="open-list-container">
      <WishListForm submitButtonAction={openWishList} isCreate={false} />
    </div>
  );
}
