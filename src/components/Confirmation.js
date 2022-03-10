import { useEffect } from "react";
import { updateWishListItemStatus } from "../firebase";
import "./Confirmation.css";

export default function Confirmation(props) {
  const handleBuyConfirmation = () => {
    updateWishListItemStatus(props.wishListId, props.listItem.id, false, true);
    props.setConfirmationId(null);
  };

  useEffect(() => {
    const removeConfirmationWindow = (e) => {
      if (e.target.className === "confirm-buy-container") {
        props.setConfirmationId(null);
      }
    };

    document.addEventListener("click", (e) => {
      removeConfirmationWindow(e);
    });

    return document.removeEventListener("click", (e) => {
      removeConfirmationWindow(e);
    });
  });

  return (
    <div className="confirm-buy-container">
      <div className="confirm-buy-window">
        <h2>Please confirm that you have bought this item:</h2>
        <div className="confirm-item">{props.listItem.itemName}</div>
        <div className="confirm-button-container">
          <button
            onClick={() => handleBuyConfirmation()}
            className="confirm-button"
          >
            Confirm
          </button>
          <button
            onClick={() => props.setConfirmationId(null)}
            className="confirm-button cancel"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
