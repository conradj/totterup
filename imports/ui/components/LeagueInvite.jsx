import React from "react";
import { _ } from "meteor/underscore";
import classnames from "classnames";
import i18n from "meteor/universe:i18n";
import { Link } from "react-router";
import BaseComponent from "./BaseComponent.jsx";
import { displayError } from "../helpers/errors.js";
import { resetInviteCode } from "../../api/leagues/methods.js";

export default class LeagueInvite extends BaseComponent {
  constructor(props) {
    super(props);
    this.resetLeagueInviteCode = this.resetLeagueInviteCode.bind(this);
    // some early leagues dont have invites, so create for them
    if (!this.props.league.inviteCode) {
      this.resetLeagueInviteCode();
    }
  }

  resetLeagueInviteCode() {
    resetInviteCode.call(
      {
        leagueId: this.props.league._id
      },
      (err, res) => {
        if (err) {
          console.log("resetLeagueInviteCode err", err);
        }
        if (res) {
          console.log("resetLeagueInviteCode res", res);
        }
      }
    );
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
        {league.inviteCode ? (
          <div className="league-invite" style={inviteBgStyle}>
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
          </div>
        ) : null}
        <a
          className="league-invite-reset-link"
          onClick={this.resetLeagueInviteCode}
        >
          reset league invite code
        </a>
      </div>
    );
  }
}

LeagueInvite.propTypes = {
  league: React.PropTypes.object
};
