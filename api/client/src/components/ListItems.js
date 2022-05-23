import React, {
  useEffect,
  useState,
  useCallback,
  useRef,
  useContext,
} from "react";
import { AdminContext, WishListIdContext, LanguageContext } from "../context";
import Confirmation from "./Confirmation";
import "./ListItems.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGift, faEye } from "@fortawesome/free-solid-svg-icons";
import AddEditlistItem from "./AddEditListItem";
import { axiosInstance } from "../config";
import { io } from "socket.io-client";
import lang from "../translation";

export default function ListItems() {
  //states
  const [wishListItems, setWishListItems] = useState([]);
  const [confirmationId, setConfirmationId] = useState("");
  const [showAdmin, setShowAdmin] = useState(false);
  const [isDelete, setIsDelete] = useState(false);
  const [editData, setEditData] = useState(null);

  //context states
  const [isAdmin, setIsAdmin] = useContext(AdminContext);
  const [wishListId] = useContext(WishListIdContext);
  const [language] = useContext(LanguageContext);

  //elements
  const adminKeyElement = useRef(null);
  const toggleButtonElement = useRef(null);
  const copyButtonElement = useRef(null);
  const mounted = useRef(false);
  const addItemContainerElement = useRef(null);
  const itemNameElement = useRef(null);
  const itemUrlElement = useRef(null);
  const pictureUrlElement = useRef(null);
  const itemDescElement = useRef(null);
  const addItemWindowElement = useRef(null);

  const displayAddEditItemWindow = (data) => {
    if (data) {
      setEditData(data);
      itemNameElement.current.value = data.itemName;
      itemUrlElement.current.value = data.itemUrl;
      pictureUrlElement.current.value = data.pictureUrl;
      itemDescElement.current.value = data.itemDesc;
    } else if (editData) {
      setEditData(null);
      itemNameElement.current.value = "";
      itemUrlElement.current.value = "";
      pictureUrlElement.current.value = "";
      itemDescElement.current.value = "";
    }
    addItemContainerElement.current.style.display = "flex";
    addItemWindowElement.current.classList.add("appear");
    document.body.style.overflow = "hidden";
    addItemContainerElement.current.addEventListener("click", (e) => {
      if (e.target.className === "add-item-container") {
        addItemContainerElement.current.style.display = "none";
        addItemWindowElement.current.classList.remove("appear");
        document.body.style.overflow = "scroll";
      }
    });
  };

  //store mounted state to prevent late firestore snapshot calls, causing render on unmounted component
  useEffect(() => {
    mounted.current = true;
    return () => {
      mounted.current = false;
    };
  }, []);
  const handleCopytoClipboard = () => {
    navigator.clipboard.writeText(wishListId);
    copyButtonElement.current.classList.add("copied");

    setTimeout(() => {
      copyButtonElement.current.classList.remove("copied");
    }, 2000);
  };

  const displayError = (element, text) => {
    element.setCustomValidity(text);
    element.reportValidity();
  };

  const handlePasswordVisibility = (ref) => {
    ref.current.type === "password"
      ? (ref.current.type = "text")
      : (ref.current.type = "password");
  };

  const handleReserve = async (listItemId, reserved, bought) => {
    try {
      const token = localStorage.getItem("token");
      await axiosInstance.put(
        `/wishList/${wishListId}/item/${listItemId}/status`,
        {
          reserved,
          bought,
        },
        {
          headers: {
            token: "Bearer " + token,
          },
        }
      );
    } catch (error) {
      console.log(error);
    }
  };

  //admin login switch for already logged in user
  const checkAdminPassword = async (e) => {
    e.preventDefault();
    if (adminKeyElement.current.validity.valueMissing) {
      displayError(
        adminKeyElement.current,
        "You need to provide an admin password!"
      );
      return;
    }
    const token = localStorage.getItem("token");
    try {
      const response = await axiosInstance.post(
        "/auth/adminlogin/" + wishListId,
        {
          adminPassword: adminKeyElement.current.value,
        },
        {
          headers: {
            token: "Bearer " + token,
          },
        }
      );
      localStorage.setItem("token", response.data.token);
      setIsAdmin(true);
      setShowAdmin(false);
    } catch (error) {
      console.log(error);
    }
  };

  //toggle admin login
  useEffect(() => {
    if (isAdmin) {
      toggleButtonElement.current.checked = true;
    }
    toggleButtonElement.current.addEventListener("click", () => {
      if (toggleButtonElement.current.checked) {
        setShowAdmin(true);
      } else {
        setShowAdmin(false);
        setIsAdmin(false);
      }
    });
  });

  //real-time list data updating
  const fetchItems = useCallback(() => {
    const token = localStorage.getItem("token");
    const socket = io(process.env.NODE_ENV === "development"
      ? "http://localhost:8800"
      : "https://paether-wishlistapp.herokuapp.com", {
      auth: { token },
      query: {
        wishListId: wishListId,
      },
    });

    socket.on("message", (msg) => {
      if (mounted.current) {
        setWishListItems(msg);
      }
    });

    return () => {
      socket.disconnect();
    };
  }, [wishListId]);

  useEffect(() => {
    fetchItems();
  }, [fetchItems]);

  return (
    <div className="list-area">
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

      <div className="list-items-container">
        {showAdmin && (
          <div className="admin-login-container">
            <form className="admin-login-window">
              <h2>{lang[language].list_admin_mode}</h2>
              <div className="input-container">
                <label htmlFor="admin_key">{lang[language].list_admin}</label>
                <div className="input-flex">
                  <input
                    className="access-input"
                    type="password"
                    name="admin_key"
                    ref={adminKeyElement}
                    onChange={(e) => {
                      e.target.setCustomValidity("");
                    }}
                    id="admin_key"
                    autoComplete="off"
                    required
                  />
                  <FontAwesomeIcon
                    onClick={() => handlePasswordVisibility(adminKeyElement)}
                    icon={faEye}
                  />
                </div>
              </div>
              <div className="access-button-container">
                <button className="access-button" onClick={checkAdminPassword}>
                  {lang[language].list_acces}
                </button>
                <button
                  onClick={() => {
                    toggleButtonElement.current.checked = false;
                    setShowAdmin(false);
                  }}
                  className="access-button cancel"
                >
                  {lang[language].list_cancel}
                </button>
              </div>
            </form>
          </div>
        )}

        <div className="list-items">
          {wishListItems.map((listItem) => {
            return (
              <div key={listItem.id} className="grid-item-container">
                {isAdmin && (
                  <div className="admin-buttons-container">
                    <button
                      onClick={() => {
                        setIsDelete(true);
                        setConfirmationId(listItem.id);
                      }}
                      className="select-button"
                    >
                      {lang[language].list_delete}
                    </button>
                    <button
                      onClick={() => {
                        displayAddEditItemWindow(listItem);
                      }}
                      className="select-button"
                    >
                      {lang[language].list_edit}
                    </button>
                  </div>
                )}
                {confirmationId === listItem.id && (
                  <Confirmation
                    setConfirmationId={setConfirmationId}
                    listItem={listItem}
                    isDelete={isDelete}
                  />
                )}
                {listItem.reserved && (
                  <span className="label-reserved">
                    {lang[language].list_reserved}
                  </span>
                )}
                {listItem.bought && (
                  <span className="label-bought">
                    {lang[language].list_bought}
                  </span>
                )}

                <div
                  data-key={listItem.id}
                  className={
                    "list-item-container " +
                    (listItem.reserved || listItem.bought ? "blur" : "")
                  }
                >
                  {listItem.pictureUrl ? (
                    <img
                      className="item-picture"
                      src={listItem.pictureUrl}
                      alt=""
                    />
                  ) : (
                    <FontAwesomeIcon className="item-picture" icon={faGift} />
                  )}
                  <div className="list-item-details">
                    <div className="list-item-name"> {listItem.itemName}</div>
                    <a href={listItem.itemUrl} rel="noreferrer" target="_blank">
                      {lang[language].list_link}
                    </a>
                    <div className="list-item-description">
                      {listItem.itemDesc}
                    </div>
                  </div>
                </div>
                <div
                  className={
                    "item-status-button-container " +
                    (listItem.bought ? "bought" : "")
                  }
                >
                  <button
                    className={
                      "select-button " + (listItem.reserved ? "reserved" : "")
                    }
                    onClick={() =>
                      handleReserve(
                        listItem.id,
                        !listItem.reserved,
                        listItem.bought
                      )
                    }
                    disabled={listItem.bought}
                  >
                    {listItem.reserved
                      ? lang[language].list_unreserve
                      : lang[language].list_reserve}
                  </button>
                  <button
                    className={
                      "select-button " + (listItem.bought ? "bought" : "")
                    }
                    onClick={() => {
                      setIsDelete(false);
                      setConfirmationId(listItem.id);
                    }}
                    disabled={listItem.bought}
                  >
                    {lang[language].list_buy}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
      <button
        className="add-new-item-btn copy"
        data-tool-tip={lang[language].list_copied}
        onClick={() => handleCopytoClipboard()}
        ref={copyButtonElement}
      >
        {lang[language].list_copy}
      </button>
      <div className="admin-toggle"></div>
      {isAdmin && (
        <AddEditlistItem
          {...{
            addItemContainerElement,
            displayAddEditItemWindow,
            itemNameElement,
            itemUrlElement,
            pictureUrlElement,
            itemDescElement,
            editData,
            addItemWindowElement,
          }}
        />
      )}
    </div>
  );
}
