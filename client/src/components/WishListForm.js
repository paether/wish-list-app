import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleQuestion, faEye } from "@fortawesome/free-solid-svg-icons";
import "./WishListForm.css";
import { useState, useRef, useCallback, useContext } from "react";
import { LanguageContext } from "../context";
import lang from "../translation";
export default function WishListForm({
  submitButtonAction,
  isCreate,
  secretKeyElementRef,
  listIdRef,
  adminKeyElementRef,
}) {
  const [showAdmin, setShowAdmin] = useState(false);
  const toggleButtonElement = useRef(null);
  const [language] = useContext(LanguageContext);

  const onCheckboxClick = useCallback(
    ({ target: { checked } }) => {
      if (isCreate) return;

      if (checked) {
        setShowAdmin(true);
      } else {
        setShowAdmin(false);
      }
    },
    [isCreate]
  );

  const handlePasswordVisibility = (ref) => {
    ref.current.type === "password"
      ? (ref.current.type = "text")
      : (ref.current.type = "password");
  };
  return (
    <form className="wish-list-form-container">
      {!isCreate && (
        <div className="switch-button">
          <input
            className="switch-button-checkbox"
            type="checkbox"
            onClick={onCheckboxClick}
            ref={toggleButtonElement}
          ></input>
          <label className="switch-button-label" htmlFor="">
            {lang[language].form_user}
            <span className="switch-button-label-span"></span>
          </label>
        </div>
      )}
      <div className="input-container">
        <label htmlFor="list_id_name">
          {isCreate ? lang[language].form_name : lang[language].form_id}
        </label>
        <div className="input-item-container">
          <input
            className="form-input"
            type="text"
            name="list_id_name"
            id="list_id_name"
            ref={listIdRef}
            autoComplete="off"
            onChange={(e) => {
              e.target.setCustomValidity("");
            }}
          />
          <span
            className="tooltip"
            data-tool-tip={
              isCreate
                ? lang[language].form_tooltip_name
                : lang[language].form_tooltip_id
            }
          >
            <FontAwesomeIcon icon={faCircleQuestion} />
          </span>
        </div>
      </div>
      <div className="input-container">
        <label htmlFor="secret_key">{lang[language].form_password}</label>
        <div className="input-item-container">
          <input
            className="form-input"
            type="password"
            name="secret_key"
            ref={secretKeyElementRef}
            id="secret_key"
            autoComplete="off"
            onChange={(e) => {
              e.target.setCustomValidity("");
            }}
          />
          <FontAwesomeIcon
            onClick={() => handlePasswordVisibility(secretKeyElementRef)}
            icon={faEye}
          />
          <span
            className="tooltip"
            data-tool-tip={lang[language].form_tooltip_password}
          >
            <FontAwesomeIcon className="icon" icon={faCircleQuestion} />
          </span>
        </div>
      </div>
      {(showAdmin || isCreate) && (
        <div className="input-container">
          <label htmlFor="admin_key">{lang[language].form_admin}</label>
          <div className="input-item-container">
            <input
              className="form-input"
              type="password"
              name="admin_key"
              id="admin_key"
              autoComplete="off"
              ref={adminKeyElementRef}
              onChange={(e) => {
                e.target.setCustomValidity("");
              }}
            />
            <FontAwesomeIcon
              onClick={() => handlePasswordVisibility(adminKeyElementRef)}
              className="icon-eye"
              icon={faEye}
            />
            <span
              className="tooltip"
              data-tool-tip={lang[language].form_tooltip_admin}
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
        onClick={(e) => submitButtonAction(e, showAdmin)}
      >
        {isCreate ? lang[language].form_create : lang[language].form_open}
      </button>
    </form>
  );
}
