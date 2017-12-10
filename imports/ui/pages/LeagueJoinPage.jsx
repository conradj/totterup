import React from "react";
import i18n from "meteor/universe:i18n";
import BaseComponent from "../components/BaseComponent.jsx";
import MobileMenu from "../components/MobileMenu.jsx";
import LeagueJoin from "../components/LeagueJoin.jsx";

class LeagueJoinPage extends BaseComponent {
  render() {
    return (
      <div>
        <MobileMenu />
        <LeagueJoin />
      </div>
    );
  }
}

export default LeagueJoinPage;
