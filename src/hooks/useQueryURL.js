import { useState, useCallback } from "react";

export default function useQueryURL(id) {
  const [param, setParam] = useState(
    new URLSearchParams(window.location.search).get(id)
  );

  const updateQueryStringWithoutReload = (queryString, newPath) => {
    const { protocol, host } = window.location;
    const newUrl = `${protocol}//${host}${newPath}?${queryString}`;
    window.history.pushState({ path: newUrl }, "", newUrl);
  };

  const onSetQueryString = useCallback(
    (newParam, newPath) => {
      setParam(newParam);
      updateQueryStringWithoutReload(
        newParam ? `${id}=${newParam}` : "",
        newPath
      );
    },
    [id, setParam]
  );

  return [param, onSetQueryString];
}
