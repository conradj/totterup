/* global alert */

import React from "react";
import { Session } from "meteor/session";
import { Link } from "react-router";
import i18n from "meteor/universe:i18n";
import BaseComponent from "./BaseComponent.jsx";
import LeagueAdd from "./LeagueAdd.jsx";

export default class LeagueList extends BaseComponent {
  constructor(props) {
    super(props);
  }

  render() {
    const { leagues } = this.props;

    return (
      <div className="league-players">
        <Link
          to={"/leagues/join"}
          title="Join another League"
          className="league-join"
          activeClassName="active"
        >
          <span className="icon-user-add" />{i18n.__("components.leagueList.joinLeague")}
        </Link>
        <LeagueAdd />
        {leagues.map(league => (
          <Link
            to={`/leagues/${league._id}`}
            key={league._id}
            title={league.name}
            className="league-player"
            activeClassName="active"
          >
            {league.userId ? <span className="icon-lock" /> : null}
            {league.name}
          </Link>
        ))}
      </div>
    );
  }
}

LeagueList.propTypes = {
  leagues: React.PropTypes.array
};

LeagueList.contextTypes = {
  router: React.PropTypes.object
};
