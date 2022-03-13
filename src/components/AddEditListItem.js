import { useEffect } from "react";
import { addWishListItem } from "../firebase";
import "./AddEditListItem.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGift, faXmark } from "@fortawesome/free-solid-svg-icons";

let addItemContainer;

export default function AddlistItem({ wishListId, editData }) {
  const isValidUrl = (url) => {
    try {
      new URL(url);
    } catch (e) {
      console.error(e);
      return false;
    }
    return true;
  };

  useEffect(() => {
    addItemContainer = document.querySelector(".add-item-container");
  }, []);

  const closeAddItemWindow = () => {
    addItemContainer.style.display = "none";
  };

  const displayAddItemWindow = () => {
    addItemContainer.style.display = "flex";
    addItemContainer.addEventListener("click", (e) => {
      if (e.target.className === "add-item-container") {
        addItemContainer.style.display = "none";
      }
    });
  };

  const displayError = (element, text) => {
    element.setCustomValidity(text);
    element.reportValidity();
  };

  const addItem = async (e) => {
    e.preventDefault();

    const itemName = document.getElementById("new_item_name");
    const itemUrl = document.getElementById("new_item_url");
    const pictureUrl = document.getElementById("new_item_picture");
    const itemDesc = document.getElementById("new_item_desc");

    if (itemName.validity.valueMissing) {
      displayError(itemName, "You need to provide a gift name!");
      return;
    }

    if (itemUrl.validity.valueMissing) {
      displayError(itemUrl, "You need to provide an URL to the gift!");
      return;
    } else if (!isValidUrl(itemUrl.value)) {
      displayError(itemUrl, "The URL provided is not valid!");
      return;
    }
    if (pictureUrl.value.length > 0 && !isValidUrl(pictureUrl.value)) {
      displayError(pictureUrl, "The URL provided is not valid!");
      return;
    }
    try {
      await addWishListItem(
        itemName.value,
        itemDesc.value,
        wishListId,
        itemUrl.value,
        pictureUrl.value
      );
    } catch (error) {
      alert(error);
    }

    itemName.value = "";
    itemUrl.value = "";
    pictureUrl.value = "";
    itemDesc.value = "";
  };

  return (
    <form name="addListItemForm">
      <button
        className="add-new-item-btn"
        type="button"
        onClick={displayAddItemWindow}
      >
        Add new item
      </button>
      <div className="add-item-container">
        <div className="add-item-window">
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
                <label htmlFor="new_item_name">Gift name</label>
                <input
                  onChange={(e) => {
                    e.target.setCustomValidity("");
                  }}
                  type="text"
                  name="new_item_name"
                  id="new_item_name"
                  placeholder=" "
                  required
                />
              </div>
              <div className="new-item-input-container">
                <label htmlFor="new_item_desc">Gift description</label>
                <input
                  onChange={(e) => {
                    e.target.setCustomValidity("");
                  }}
                  type="text"
                  name="new_item_desc"
                  id="new_item_desc"
                  placeholder=" "
                />
              </div>
              <div className="new-item-input-container">
                <label htmlFor="new_item_url">Link to the gift</label>
                <input
                  onChange={(e) => {
                    e.target.setCustomValidity("");
                  }}
                  type="text"
                  name="new_item_url"
                  id="new_item_url"
                  placeholder=" "
                  required
                />
              </div>
              <div className="new-item-input-container">
                <label htmlFor="new_item_picture">
                  Link to the picture of the gift (optional)
                </label>
                <input
                  onChange={(e) => {
                    e.target.setCustomValidity("");
                  }}
                  type="text"
                  name="new_item_picture"
                  id="new_item_picture"
                  placeholder=" "
                />
              </div>
            </div>
          </div>
          <button className="add-new-item-btn" onClick={addItem}>
            Add new item
          </button>
        </div>
      </div>
    </form>
  );
}
