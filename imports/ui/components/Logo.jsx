import React from "react";
import i18n from "meteor/universe:i18n";
import BaseComponent from "./BaseComponent.jsx";
import { Link } from "react-router";

class Logo extends BaseComponent {
  render() {
    const { showTitle, showStrapline } = this.props;
    return (
      <Link to={"/hi"}>
        <div className="logo-container">
          <img
            src="/logo-totterup.svg"
            className="logo-image"
            alt="TotterUp logo"
          />
          {showTitle ? (
            <h1 className="logo-title">
              <span>
                totterUp<i>!</i>
              </span>
            </h1>
          ) : null}
          {showTitle ? (
            <p className="logo-strapline">{i18n.__("general.strapline")}</p>
          ) : null}
        </div>
      </Link>
    );
  }
}

Logo.propTypes = {
  showTitle: React.PropTypes.bool,
  showStrapline: React.PropTypes.bool
};

// Logo.defaultProps = {
//   showTitle: true,
//   showStrapline: true
// };

export default Logo;
