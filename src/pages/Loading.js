import language from "../language";
import "./Loading.css";

export default function Loading({ isLoading }) {
  return (
    <div className="loading-container">
      <div className="loading-ring">
        {/* these empty divs are required for the loading animation */}
        <div></div>
        <div></div>
        <div></div>
        <div></div>
      </div>
      {/* <div className="loading-text">{language[props.language].loading}</div> */}
      {!isLoading && (
        <div className="loading-error">
          Cannot load this list. Please make sure the list ID is provided
          correctly!
        </div>
      )}
    </div>
  );
}
