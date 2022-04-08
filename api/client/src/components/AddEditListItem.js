import { useContext } from "react";
import "./AddEditListItem.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGift, faXmark } from "@fortawesome/free-solid-svg-icons";
import { WishListIdContext, LanguageContext } from "../context";
import lang from "../translation";
import { axiosInstance } from "../config";

export default function AddlistItem({
  itemNameElement,
  itemUrlElement,
  pictureUrlElement,
  itemDescElement,
  editData,
  addItemContainerElement,
  displayAddEditItemWindow,
  addItemWindowElement,
}) {
  const [wishListId] = useContext(WishListIdContext);
  const [language] = useContext(LanguageContext);

  const isValidUrl = (url) => {
    try {
      new URL(url);
    } catch (e) {
      console.error(e);
      return false;
    }
    return true;
  };

  const closeAddItemWindow = () => {
    addItemContainerElement.current.style.display = "none";
    document.body.style.overflow = "scroll";
  };

  const displayError = (element, text) => {
    element.setCustomValidity(text);
    element.reportValidity();
  };

  const addItem = async (e) => {
    e.preventDefault();

    if (itemNameElement.current.validity.valueMissing) {
      displayError(itemNameElement.current, lang[language].error_name);
      return;
    }

    if (itemUrlElement.current.validity.valueMissing) {
      displayError(itemUrlElement.current, lang[language].error_url);
      return;
    } else if (!isValidUrl(itemUrlElement.current.value)) {
      displayError(itemUrlElement.current, lang[language].error_url_invalid);
      return;
    }
    if (
      pictureUrlElement.current.value.length > 0 &&
      !isValidUrl(pictureUrlElement.current.value)
    ) {
      displayError(pictureUrlElement.current, lang[language].error_url_invalid);
      return;
    }
    try {
      const token = localStorage.getItem("token");

      const data = {
        itemName: itemNameElement.current.value,
        itemDesc: itemDescElement.current.value,
        pictureUrl: pictureUrlElement.current.value,
        itemUrl: itemUrlElement.current.value,
      };
      const header = {
        headers: {
          token: "Bearer " + token,
        },
      };

      if (!editData) {
        await axiosInstance.post("/wishList/" + wishListId, data, header);
        itemNameElement.current.value = "";
        itemUrlElement.current.value = "";
        pictureUrlElement.current.value = "";
        itemDescElement.current.value = "";
      } else {
        await axiosInstance.put(
          `/wishList/${wishListId}/item/${editData.id}`,
          data,
          header
        );
        closeAddItemWindow();
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <form name="addListItemForm">
      <button
        className="add-new-item-btn"
        type="button"
        onClick={() => displayAddEditItemWindow(null)}
      >
        {lang[language].list_add_new}
      </button>
      <div className="add-item-container" ref={addItemContainerElement}>
        <div className="add-item-window" ref={addItemWindowElement}>
          <FontAwesomeIcon
            onClick={closeAddItemWindow}
            className="close-button"
            icon={faXmark}
          />

          <div className="new-item-container">
            {editData ? (
              <img
                className="fa-gift"
                src={editData.pictureUrl}
                alt="gift icon"
              />
            ) : (
              <FontAwesomeIcon icon={faGift} />
            )}
            <div className="new-item-details">
              <div className="new-item-input-container">
                <label htmlFor="new_item_name">
                  {lang[language].list_add_name}
                </label>
                <input
                  onChange={(e) => {
                    e.target.setCustomValidity("");
                  }}
                  type="text"
                  ref={itemNameElement}
                  name="new_item_name"
                  id="new_item_name"
                  placeholder=" "
                  required
                />
              </div>
              <div className="new-item-input-container">
                <label htmlFor="new_item_desc">
                  {lang[language].list_add_desc}
                </label>
                <input
                  onChange={(e) => {
                    e.target.setCustomValidity("");
                  }}
                  type="text"
                  name="new_item_desc"
                  id="new_item_desc"
                  ref={itemDescElement}
                  placeholder=" "
                />
              </div>
              <div className="new-item-input-container">
                <label htmlFor="new_item_url">
                  {lang[language].list_add_link}
                </label>
                <input
                  onChange={(e) => {
                    e.target.setCustomValidity("");
                  }}
                  type="text"
                  name="new_item_url"
                  id="new_item_url"
                  ref={itemUrlElement}
                  placeholder=" "
                  required
                />
              </div>
              <div className="new-item-input-container">
                <label htmlFor="new_item_picture">
                  {lang[language].list_add_pic_link}
                </label>
                <input
                  onChange={(e) => {
                    e.target.setCustomValidity("");
                  }}
                  type="text"
                  name="new_item_picture"
                  id="new_item_picture"
                  ref={pictureUrlElement}
                  placeholder=" "
                />
              </div>
            </div>
          </div>
          <button className="add-new-item-btn" onClick={addItem}>
            {editData ? lang[language].list_edit : lang[language].list_add_new}
          </button>
        </div>
      </div>
    </form>
  );
}
