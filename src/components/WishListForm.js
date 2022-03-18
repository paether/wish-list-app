import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleQuestion, faEye } from "@fortawesome/free-solid-svg-icons";
import "./WishListForm.css";
import { useEffect, useState } from "react";
let toggleButton;
export default function WishListForm({ submitButtonAction, isCreate }) {
  const [showAdmin, setShowAdmin] = useState(false);

  useEffect(() => {
    if (!isCreate) {
      toggleButton = document.querySelector(".switch-button-checkbox");
      toggleButton.addEventListener("click", () => {
        if (toggleButton.checked) {
          setShowAdmin(true);
        } else {
          setShowAdmin(false);
        }
      });
    }
  });

  const handlePasswordVisibility = (elementId) => {
    const inputElement = document.getElementById(elementId);
    inputElement.type === "password"
      ? (inputElement.type = "text")
      : (inputElement.type = "password");
  };
  return (
    <form className="wish-list-form-container">
      {!isCreate && (
        <div className="switch-button">
          <input className="switch-button-checkbox" type="checkbox"></input>
          <label className="switch-button-label" htmlFor="">
            <span className="switch-button-label-span">User</span>
          </label>
        </div>
      )}
      <div className="input-container">
        <label htmlFor="list_id_name">
          {isCreate ? "Wish List Name" : "Wish List ID"}
        </label>
        <div className="input-item-container">
          <input
            className="form-input"
            type="text"
            name="list_id_name"
            id="list_id_name"
            autoComplete="off"
            onChange={(e) => {
              e.target.setCustomValidity("");
            }}
          />
          <span
            className="tooltip"
            data-tool-tip={
              isCreate
                ? "The name of your Wish List. Name it just as you want!"
                : "The ID of your list. You can provide the full URL or just the ID itself."
            }
          >
            <FontAwesomeIcon icon={faCircleQuestion} />
          </span>
        </div>
      </div>
      <div className="input-container">
        <label htmlFor="secret_key">Wish List Password</label>
        <div className="input-item-container">
          <input
            className="form-input"
            type="password"
            name="secret_key"
            id="secret_key"
            autoComplete="off"
            onChange={(e) => {
              e.target.setCustomValidity("");
            }}
          />
          <FontAwesomeIcon
            onClick={() => handlePasswordVisibility("secret_key")}
            icon={faEye}
          />
          <span
            className="tooltip"
            data-tool-tip="The password of your list. This has to be shared with others in order to access it and pick their items."
          >
            <FontAwesomeIcon className="icon" icon={faCircleQuestion} />
          </span>
        </div>
      </div>
      {(showAdmin || isCreate) && (
        <div className="input-container">
          <label htmlFor="admin_key">Wish List Admin Password</label>
          <div className="input-item-container">
            <input
              className="form-input"
              type="password"
              name="admin_key"
              id="admin_key"
              autoComplete="off"
              onChange={(e) => {
                e.target.setCustomValidity("");
              }}
            />
            <FontAwesomeIcon
              onClick={() => handlePasswordVisibility("admin_key")}
              className="icon-eye"
              icon={faEye}
            />
            <span
              className="tooltip"
              data-tool-tip="With this password you will be able to add/delete/lock the list."
            >
              <FontAwesomeIcon className="icon" icon={faCircleQuestion} />
            </span>
          </div>
        </div>
      )}

      <button
        className="submit-button-form"
        id="submitBtn"
        type="button"
        onClick={submitButtonAction}
      >
        {isCreate ? "Create list" : "Open list"}
      </button>
    </form>
  );
}
