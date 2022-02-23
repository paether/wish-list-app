import { useState, useCallback } from "react";

export default function useQueryURL(id) {
  const [param, setParam] = useState(
    new URLSearchParams(window.location.search).get(id)
  );

  const updateQueryStringWithoutReload = (queryString) => {
    const { protocol, host, pathname } = window.location;
    const newUrl = `${protocol}//${host}${pathname}?${queryString}`;
    window.history.pushState({ path: newUrl }, "", newUrl);
  };

  const onSetQueryString = useCallback(
    (newParam) => {
      setParam(newParam);
      updateQueryStringWithoutReload(newParam ? `${id}=${newParam}` : "");
    },
    [id, setParam]
  );

  return [param, onSetQueryString];
}
