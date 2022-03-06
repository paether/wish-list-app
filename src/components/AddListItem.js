import { useEffect } from "react";
import { addWishListItem } from "../firebase";
import "./AddListItem.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGift } from "@fortawesome/free-solid-svg-icons";

export default function AddlistItem({ wishListId }) {
  useEffect(() => {}, []);

  const displayNewItemWindow = () => {
    const addItemContainer = document.querySelector(".add-item-container");
    addItemContainer.style.display = "flex";
    addItemContainer.addEventListener("click", (e) => {
      if (e.target.className === "add-item-container") {
        addItemContainer.style.display = "none";
      }
    });
  };

  const addItem = async (e) => {
    e.preventDefault();

    const itemName = document.getElementById("new_item_name").value;
    const itemUrl = document.getElementById("new_item_url").value;

    try {
      await addWishListItem(itemName, wishListId, itemUrl);
    } catch (error) {
      alert(error);
    }
  };

  return (
    <form name="addListItemForm">
      <h3>I want...</h3>
      <input
        type="text"
        name="item_desc"
        id="list_item"
        placeholder="item name.."
        autoComplete="off"
      />
      <button
        className="add-new-item-btn"
        type="button"
        onClick={displayNewItemWindow}
      >
        Add new item
      </button>
      <div className="add-item-container">
        <div className="add-item-window">
          <div className="new-item-container">
            <FontAwesomeIcon icon={faGift} />
            <div className="new-item-details">
              <div className="new-item-name-container">
                <label htmlFor="new_item_name">Gift name</label>
                <input type="text" name="new_item_name" id="new_item_name" />
              </div>
              <div className="new-item-link-container">
                <label htmlFor="new_item_url">Link to the gift</label>
                <input type="text" name="new_item_url" id="new_item_url" />
              </div>
            </div>
          </div>
          <button className="add-new-item-btn" type="submit" onClick={addItem}>
            Add new item
          </button>
        </div>
      </div>
    </form>
  );
}
