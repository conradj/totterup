import React from "react";
import i18n from "meteor/universe:i18n";
import BaseComponent from "./BaseComponent.jsx";
import { Link } from "react-router";

class Logo extends BaseComponent {
  render() {
    return (
      <Link to={"/hi"}>
        <div className="logo-container">
          <img
            src="/logo-totterup.svg"
            className="logo-image"
            alt="TotterUp logo"
          />
          <h1 className="logo-title">
            <span>
              totterUp<i>!</i>
            </span>
          </h1>
        </div>
      </Link>
    );
  }
}

export default Logo;
