import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleQuestion, faEye } from "@fortawesome/free-solid-svg-icons";
import "./WishListForm.css";

export default function WishListForm(props) {
  const handlePasswordVisibility = (elementId) => {
    const inputElement = document.getElementById(elementId);
    inputElement.type === "password"
      ? (inputElement.type = "text")
      : (inputElement.type = "password");
  };
  return (
    <form className="wish-list-form-container">
      <div className="input-container">
        <label htmlFor="username">Wish List Name</label>
        <div className="input-item-container">
          <input
            className="form-input"
            type="text"
            name="list_name"
            id="list_name"
            autoComplete="off"
          />
          <span
            className="tooltip"
            data-tool-tip="The name of your Wish List. Name it just as you want!"
          >
            <FontAwesomeIcon icon={faCircleQuestion} />
          </span>
        </div>
      </div>
      <div className="input-container">
        <label htmlFor="username">Wish List Password</label>
        <div className="input-item-container">
          <input
            className="form-input"
            type="password"
            name="secret_key"
            id="secret_key"
            autoComplete="off"
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
      <div className="input-container">
        <label htmlFor="username">Wish List Admin Password</label>
        <div className="input-item-container">
          <input
            className="form-input"
            type="password"
            name="admin_key"
            id="admin_key"
            autoComplete="off"
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
      <button
        className="submit-button-form"
        id="submitBtn"
        type="button"
        onClick={props.createWishList}
      >
        {props.buttonName}
      </button>
    </form>
  );
}
