import { useCallback, useContext } from "react";
import { useNavigate } from "react-router-dom";

import "./Header.css";
import lang from "../translation";
import { WishListIdContext, LanguageContext } from "../context";
import HeaderItem from "../components/HeaderItem";

export default function Header() {
  const [wishListId] = useContext(WishListIdContext);
  const [language, setLanguage] = useContext(LanguageContext);
  const navigate = useNavigate();

  const createFlagClassName = useCallback(
    (languageClass) =>
      ["flag", languageClass, language === languageClass ? "active" : ""].join(
        " "
      ),
    [language]
  );

  return (
    <div className="header">
      <div className="header-container ">
        <div className="logo" onClick={() => navigate("/")}></div>
        <ul>
          <li className="flag-container">
            <div
              className={createFlagClassName("hu")}
              onClick={() => setLanguage("hu")}
            ></div>
            <div
              className={createFlagClassName("en")}
              onClick={() => setLanguage("en")}
            ></div>
          </li>
          <HeaderItem path="/">
            <li>{lang[language].header_home}</li>
          </HeaderItem>
          <HeaderItem
            path={wishListId ? `/wishList?listId=${wishListId}` : "/wishList"}
          >
            <li> {lang[language].header_open}</li>
          </HeaderItem>
          <HeaderItem path="/create">
            <li> {lang[language].header_create}</li>
          </HeaderItem>
          <HeaderItem path="/about">
            <li> {lang[language].header_about}</li>
          </HeaderItem>
        </ul>
      </div>
      <div className="custom-shape-divider-top-1646235534">
        <svg
          data-name="Layer 1"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 1200 200"
          preserveAspectRatio="none"
        >
          <path
            d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z"
            className="shape-fill"
          ></path>
        </svg>
      </div>
    </div>
  );
}
