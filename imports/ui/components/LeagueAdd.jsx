/* global confirm */

import React from "react";
import i18n from "meteor/universe:i18n";
import { Session } from "meteor/session";
import BaseComponent from "./BaseComponent.jsx";
import { displayError } from "../helpers/errors.js";

import { insert } from "../../api/leagues/methods.js";

export default class LeagueAdd extends BaseComponent {
  constructor(props) {
    super(props);
    this.createNewLeague = this.createNewLeague.bind(this);
  }

  createNewLeague() {
    const { router } = this.context;
    const leagueId = insert.call({ locale: i18n.getLocale() }, err => {
      if (err) {
        router.push("/");
        /* eslint-disable no-alert */
        alert(i18n.__("components.leagueList.newLeagueError"));
      }
    });
    router.push(`/leagues/${leagueId}`);
    Session.set("menuOpen", false);
  }

  render() {
    return (
      <div>
        {Meteor.userId() ? (
          <a className="link-league-new" onClick={this.createNewLeague}>
            <span className="icon-plus" />
            {i18n.__("components.leagueList.newLeague")}
          </a>
        ) : null}
      </div>
    );
  }
}

LeagueAdd.contextTypes = {
  router: React.PropTypes.object
};
