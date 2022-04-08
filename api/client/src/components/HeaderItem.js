import React, { useMemo } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import "./HeaderItem.css";

const HeaderItem = ({ path, children }) => {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const className = useMemo(
    () => `header-item${pathname === path ? " active" : ""}`,
    [path, pathname]
  );

  return React.Children.map(children, (child) =>
    React.cloneElement(child, {
      className,
      onClick: () => navigate(path),
    })
  );
};

export default HeaderItem;
