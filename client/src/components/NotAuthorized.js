import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye } from "@fortawesome/free-solid-svg-icons";
import "./NotAuthorized.css";
import { useContext } from "react";
import lang from "../translation";
import { LanguageContext } from "../context";

export default function NotAuthorized({
  adminKeyElement,
  toggleButtonElement,
  secretKeyElement,
  showAdmin,
  handleLogin,
}) {
  const handlePasswordVisibility = (ref) => {
    ref.current.type === "password"
      ? (ref.current.type = "text")
      : (ref.current.type = "password");
  };
  const [language] = useContext(LanguageContext);

  return (
    <div className="not-authorized-container">
      <form className="not-authorized-form">
        <div className="switch-button">
          <input
            className="switch-button-checkbox"
            type="checkbox"
            ref={toggleButtonElement}
          ></input>
          <label className="switch-button-label" htmlFor="">
            <span className="switch-button-label-span">
              {lang[language].form_user}
            </span>
          </label>
        </div>
        <div className="not-authorized-headline">
          <h1>{lang[language].error_access}</h1>
        </div>

        <div className="input-container">
          <label htmlFor="secret_key">{lang[language].form_password}</label>
          <div className="input-flex">
            <input
              className="access-input"
              type="password"
              onChange={(e) => {
                e.target.setCustomValidity("");
              }}
              name="secret_key"
              ref={secretKeyElement}
              id="secret_key"
              autoComplete="password"
              required
            />
            <FontAwesomeIcon
              onClick={() => handlePasswordVisibility(secretKeyElement)}
              icon={faEye}
            />
          </div>
        </div>
        {showAdmin && (
          <div className="input-container">
            <label htmlFor="admin_key">{lang[language].form_admin}</label>
            <div className="input-flex">
              <input
                className="access-input"
                type="password"
                name="admin_key"
                onChange={(e) => {
                  e.target.setCustomValidity("");
                }}
                id="admin_key"
                ref={adminKeyElement}
                autoComplete="off"
                required
              />
              <FontAwesomeIcon
                onClick={() => handlePasswordVisibility(adminKeyElement)}
                icon={faEye}
              />
            </div>
          </div>
        )}

        <button className="access-button" onClick={handleLogin}>
          {lang[language].list_acces}
        </button>
      </form>
    </div>
  );
}
