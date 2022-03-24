import "./Header.css";
import lang from "../translation";
import { useContext, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { WishListIdContext, LanguageContext } from "../context";

export default function Header() {
  const [wishListId] = useContext(WishListIdContext);
  const [language, setLanguage] = useContext(LanguageContext);

  const huFlag = useRef(null);
  const gbFlag = useRef(null);
  const home = useRef(null);
  const open = useRef(null);
  const create = useRef(null);
  const about = useRef(null);

  const navigate = useNavigate();

  const handleClick = (ref, path) => {
    home.current.classList.remove("active");
    open.current.classList.remove("active");
    create.current.classList.remove("active");
    about.current.classList.remove("active");

    navigate(path);
    ref.current.classList.add("active");
  };

  useEffect(() => {
    const currentLoc = window.location.href;
    if (currentLoc.includes("/wishList")) {
      open.current.classList.add("active");
    } else if (currentLoc.includes("/create")) {
      create.current.classList.add("active");
    } else if (currentLoc.includes("/about")) {
      about.current.classList.add("active");
    } else {
      home.current.classList.add("active");
    }
  }, []);

  useEffect(() => {
    if (language === "en") {
      gbFlag.current.classList.add("active");
      huFlag.current.classList.remove("active");
    } else {
      huFlag.current.classList.add("active");
      gbFlag.current.classList.remove("active");
    }
  }, [language]);

  const changeLang = (lang) => {
    setLanguage(lang);
  };

  return (
    <div className="header">
      <div className="header-container ">
        <div
          className="logo"
          onClick={() => handleClick(home, "/wish-list-app")}
        ></div>
        <ul>
          <li className="flag-container">
            <div
              className="flag hu"
              ref={huFlag}
              onClick={() => changeLang("hu")}
            ></div>
            <div
              className="flag gb"
              ref={gbFlag}
              onClick={() => changeLang("en")}
            ></div>
          </li>
          <li
            onClick={() => handleClick(home, "/wish-list-app")}
            className="header-item home"
            ref={home}
          >
            {lang[language].header_home}
          </li>
          <li
            onClick={() =>
              handleClick(
                open,
                wishListId
                  ? `/wish-list-app/wishList?listId=${wishListId}`
                  : "/wish-list-app/wishList"
              )
            }
            ref={open}
            className="header-item open-list"
          >
            {lang[language].header_open}
          </li>
          <li
            onClick={() => handleClick(create, "/wish-list-app/create")}
            className="header-item create-list"
            ref={create}
          >
            {lang[language].header_create}
          </li>
          <li
            onClick={() => handleClick(about, "/wish-list-app/about")}
            className="header-item about"
            ref={about}
          >
            {lang[language].header_about}
          </li>
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
