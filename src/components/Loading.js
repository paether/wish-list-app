import language from "../language";
import "./Loading.css";

export default function Loading(props) {
  return (
    <div className="loading-container">
      <div className="loading-ring">
        {/* these empty divs are required for the loading animation */}
        <div></div>
        <div></div>
        <div></div>
        <div></div>
      </div>
      <div className="loading-text">{language[props.language].loading}</div>
    </div>
  );
}
