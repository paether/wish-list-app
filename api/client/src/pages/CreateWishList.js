import { useCallback, useRef, useContext } from "react";
import Loading from "./Loading";
import "./CreateWishList.css";
import WishListForm from "../components/WishListForm";
import { useNavigate } from "react-router-dom";
import {axiosInstance} from "../config"
import { LanguageContext } from "../context";
import lang from "../translation";

export default function CreateWishList({ onWhishListCreation, isLoading }) {
  const navigate = useNavigate();

  const [language] = useContext(LanguageContext);

  const listIdName = useRef(null);
  const secretKeyElement = useRef(null);
  const adminKeyElement = useRef(null);

  const displayError = (element, text) => {
    element.setCustomValidity(text);
    element.reportValidity();
  };

  const createWishList = useCallback(
    async (e) => {
      e.preventDefault();

      if (listIdName.current.validity.valueMissing) {
        displayError(listIdName.current, lang[language].error_name);
        return;
      }
      if (secretKeyElement.current.validity.valueMissing) {
        displayError(secretKeyElement.current, lang[language].error_password);
        return;
      }
      if (adminKeyElement.current.validity.valueMissing) {
        displayError(adminKeyElement.current, lang[language].error_admin);
        return;
      }

      try {
        const response = await axiosInstance.post(
          "/auth/create",
          {
            listName: listIdName.current.value,
            password: secretKeyElement.current.value,
            adminPassword: adminKeyElement.current.value,
          }
        );

        onWhishListCreation(response.data.listId, response.data.token);
        navigate("/wishList?listId=" + response.data.listId);
      } catch (error) {
        console.log(error);
      }
    },
    [navigate, onWhishListCreation, language]
  );

  return (
    <div className="create-wish-list-container">
      <h2 className="create-wish-list-headline">
        {lang[language].create_header1}
        <br /> <span>{lang[language].create_no}</span> <br />
        {lang[language].create_header2}
      </h2>

      {!isLoading ? (
        <WishListForm
          submitButtonAction={createWishList}
          isCreate={true}
          listIdRef={listIdName}
          secretKeyElementRef={secretKeyElement}
          adminKeyElementRef={adminKeyElement}
        />
      ) : (
        <Loading />
      )}
    </div>
  );
}
