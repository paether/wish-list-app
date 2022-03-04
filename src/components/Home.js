import "./Home.css";
import KUTE from "kute.js";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Loading from "./Loading";

export default function Home({ isLoading, language }) {
  const navigate = useNavigate();
  useEffect(() => {
    const headline = document.querySelector(".headline");
    headline.classList.add("loaded");

    const blobAnimate = KUTE.fromTo(
      "#blob1",
      {
        path: "#blob1",
      },
      {
        path: "#blob2",
      },
      { duration: 3000, repeat: 1000, yoyo: true }
    );
    blobAnimate.start();
  }, []);

  return (
    <div className="home-container">
      <h1 className="headline">
        <span>
          Welcome to your favorite
          <br /> Wish List website!
        </span>
      </h1>
      <div className="home-options-container">
        <button
          onClick={() => navigate("/create")}
          className="home-button create"
          role={{ role: "button" }}
        >
          Create your Wish List
        </button>

        <div className="or">Or</div>

        <button className="home-button open" role={{ role: "button" }}>
          Open an existing Wish List
        </button>
      </div>
      <section className="svg-container">
        <svg
          id="visual"
          viewBox="0 0 900 600"
          xmlns="http://www.w3.org/2000/svg"
          version="1.1"
        >
          <g transform="translate(417.13908012560756 283.50870364543385)">
            <path
              id="blob1"
              d="M177.1 -178.3C212.8 -141.4 213.4 -70.7 204.4 -9C195.5 52.8 176.9 105.6 141.3 154.9C105.6 204.3 52.8 250.1 5.5 244.6C-41.7 239.1 -83.4 182.1 -108.4 132.8C-133.4 83.4 -141.7 41.7 -143.3 -1.5C-144.8 -44.8 -139.6 -89.6 -114.6 -126.4C-89.6 -163.2 -44.8 -192.1 13 -205.1C70.7 -218 141.4 -215.1 177.1 -178.3"
              fill="#00A9BB"
            ></path>
          </g>
          <g
            transform="translate(443.55880059868855 270.4090455384676)"
            style={{ visibility: "hidden", color: "#00A9BB" }}
          >
            <path
              id="blob2"
              d="M147.1 -122.1C197.1 -97.1 248.6 -48.6 246.8 -1.8C245 45 190 90 140 131.5C90 173 45 211 2.1 208.9C-40.8 206.8 -81.6 164.6 -128.6 123.1C-175.6 81.6 -228.8 40.8 -233.6 -4.8C-238.4 -50.4 -194.9 -100.9 -147.9 -125.9C-100.9 -150.9 -50.4 -150.4 -0.9 -149.5C48.6 -148.6 97.1 -147.1 147.1 -122.1"
              fill="#00A9BB"
            ></path>
          </g>
        </svg>
      </section>
    </div>
  );
}
