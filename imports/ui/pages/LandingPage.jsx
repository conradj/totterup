import React from "react";
import { Link } from "react-router";
import i18n from "meteor/universe:i18n";
import BaseComponent from "../components/BaseComponent.jsx";
import UserMenu from "../components/UserMenu.jsx";
import LanguageToggle from "../components/LanguageToggle.jsx";
import Loading from "../components/Loading.jsx";
import Logo from "../components/Logo.jsx";

export default class LandingPage extends BaseComponent {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className="landing-container">
        <div className="login-bar">
          <Link to="/signin" className="btn-secondary">
            {i18n.__("pages.landing.signIn")}
          </Link>
        </div>
        <header>Lifelong leagues, saved forever</header>
        <Link to="/join" className="btn-primary">
          {i18n.__("pages.landing.signUp")}
        </Link>
        <img src="lll1.png" />
        <header>Never lose your league scores again</header>
        <Link to="/join" className="btn-primary">
          {i18n.__("pages.landing.signUp")}
        </Link>
        <img src="lll2.png" />
        <header>Shared with all of your players, immediately</header>
        <Link to="/join" className="btn-primary">
          {i18n.__("pages.landing.signUp")}
        </Link>
        {/* <div className="hero">
          <div className="img-group">
            <div className="img-container1">
              <img src="lll1.png" />
            </div>
            <Link to="/join" className="btn-primary">
              {i18n.__("pages.landing.signUp")}
            </Link>
            <header>Never lose your league scores again</header>
            <div className="img-container2">
              <img src="lll2.png" />
            </div>
          </div>
          <Link to="/join" className="btn-primary">
            {i18n.__("pages.landing.signUp")}
          </Link>
        </div>
        <header>Shared with all of your players, immediately</header>
        <div className="description">
          Run your offline gaming league without worrying about losing your
          notepad or phone. Share your league with all of the players securely.
          League standings in the cloud, available on all of your devices.
          <Link to="/join" className="btn-primary">
            {i18n.__("pages.landing.signUp")}
          </Link>
        </div>
        <div className="pricing">
          <div>
            Free for casual gamers!<Link to="/join" className="btn-primary">
              {i18n.__("pages.landing.signUp")}
            </Link>
          </div>
          <div>
            Serious Gamers, pay £6 per year<Link
              to="/join"
              className="btn-primary"
            >
              {i18n.__("pages.landing.signUp")}
            </Link>
          </div>
          <div>Want a custom version for your game? Contact us!</div>
        </div> */}
        <Logo />
        <LanguageToggle />
      </div>
    );
  }
}

LandingPage.contextTypes = {
  router: React.PropTypes.object
};
