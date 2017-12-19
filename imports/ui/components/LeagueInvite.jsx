import React from "react";
import { _ } from "meteor/underscore";
import classnames from "classnames";
import i18n from "meteor/universe:i18n";
import { Link } from "react-router";
import BaseComponent from "./BaseComponent.jsx";
import { displayError } from "../helpers/errors.js";

export default class LeagueInvite extends BaseComponent {
  constructor(props) {
    super(props);
  }

  render() {
    const { league } = this.props;
    let inviteBgStyle = {};
    let inviteTextStyle = {};
    if (league.inviteCode) {
      inviteBgStyle = { backgroundColor: `#${league.inviteCode}` };
      inviteTextStyle = { color: `#${league.inviteCode}` };
    }

    return (
      <div className="league-invite-container">
        <div className="league-invite" style={inviteBgStyle}>
          {league.inviteCode ? (
            <a
              href={`mailto:?subject=TotterUp League Invite!&body=Hi! You've been invited to join the TotterUp league "${
                league.text
              }"! Login at https://totterup.com and join league using the code ${
                league.inviteCode
              }.`}
            >
              <div
                className="league-invite-code-container"
                style={inviteTextStyle}
              >
                <span className="league-invite-title">
                  {i18n.__("pages.leaguePage.inviteCode")}:
                </span>
                <br />
                <span className="league-invite-code">{league.inviteCode}</span>
              </div>
            </a>
          ) : null}
        </div>
        {league.inviteCode ? (
          <a className="league-invite-reset-link">reset league invite code</a>
        ) : (
          <button className="btn-secondary">Create league invite code</button>
        )}
      </div>
    );
  }
}

LeagueInvite.propTypes = {
  league: React.PropTypes.object
};
