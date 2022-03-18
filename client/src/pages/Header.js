import "./Header.css";
import { useNavigate, useEffect } from "react-router-dom";

export default function Header({ wishListId }) {
  const navigate = useNavigate();

  const handleClick = (e, path) => {
    navigate(path);
    const headerItems = [...document.querySelectorAll(".header-item")];
    headerItems
      .find((item) => item.classList.contains("active"))
      ?.classList.remove("active");

    e.target.classList.add("active");
  };

  return (
    <div className="header">
      <div className="header-container ">
        <div className="logo">Logo</div>
        <ul>
          <li
            onClick={(e) => handleClick(e, "/wish-list-app")}
            className="header-item home active"
          >
            Home
          </li>
          <li
            onClick={(e) =>
              handleClick(
                e,
                wishListId
                  ? `/wish-list-app/wishList?listId=${wishListId}`
                  : "/wish-list-app/wishList"
              )
            }
            className="header-item open-list"
          >
            Open
          </li>
          <li
            onClick={(e) => handleClick(e, "/wish-list-app/create")}
            className="header-item create-list"
          >
            Create
          </li>
          <li
            onClick={(e) => handleClick(e, "/wish-list-app/about")}
            className="header-item about"
          >
            About
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
