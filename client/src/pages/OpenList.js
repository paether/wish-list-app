import "./OpenList.css";
import WishListForm from "../components/WishListForm";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import lang from "../translation";

import {
  AdminContext,
  AuthorizedContext,
  WishListIdContext,
  LanguageContext,
} from "../context";
import { useContext, useCallback, useRef } from "react";

export default function OpenList() {
  const navigate = useNavigate();
  const [, setIsAdmin] = useContext(AdminContext);
  const [, setIsAuthorized] = useContext(AuthorizedContext);
  const [, setWishListId] = useContext(WishListIdContext);
  const [language] = useContext(LanguageContext);

  const listIdInput = useRef(null);
  const secretKeyElement = useRef(null);
  const adminKeyElement = useRef(null);

  const displayError = (element, text) => {
    element.setCustomValidity(text);
    element.reportValidity();
  };

  const openWishList = useCallback(
    async (e, isOpenAsAdmin) => {
      e.preventDefault();
      let listId;
      let adminKeyElementValue = false;

      if (isOpenAsAdmin) {
        if (adminKeyElement.current.validity.valueMissing) {
          displayError(adminKeyElement.current, lang[language].error_admin);
          return;
        }
        adminKeyElementValue = adminKeyElement.current.value;
      }

      if (secretKeyElement.current.validity.valueMissing) {
        displayError(secretKeyElement.current, lang[language].error_password);
        return;
      }

      if (listIdInput.current.validity.valueMissing) {
        displayError(listIdInput.current, lang[language].error_id);
        return;
      }

      if (listIdInput.current.value.includes("listId")) {
        listId = listIdInput.current.value.match(/(?<=listId=).*/)[0];
      } else {
        listId = listIdInput.current.value;
      }

      try {
        const response = await axios.post(
          "http://localhost:8800/api/auth/login",
          {
            listId: listId,
            password: secretKeyElement.current.value,
            adminPassword: adminKeyElementValue,
          }
        );
        localStorage.setItem("token", response.data.token);
        setIsAuthorized(true);
        if (adminKeyElementValue) {
          setIsAdmin(true);
        }
        setWishListId(listId);
        navigate(`/wish-list-app/wishList?listId=${listId}`);
      } catch (error) {
        console.log(error);
      }
    },
    [navigate, setIsAdmin, setIsAuthorized, setWishListId, language]
  );

  return (
    <div className="open-list-container">
      <WishListForm
        submitButtonAction={openWishList}
        isCreate={false}
        listIdRef={listIdInput}
        secretKeyElementRef={secretKeyElement}
        adminKeyElementRef={adminKeyElement}
      />
    </div>
  );
}
