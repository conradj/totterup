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

    const emailSubject = i18n.__("components.leagueInvite.emailSubject");
    const emailBody =
      i18n.__("components.leagueInvite.emailBodyPart1") +
      league.name +
      i18n.__("components.leagueInvite.emailBodyPart2") +
      league.inviteCode +
      i18n.__("components.leagueInvite.emailBodyPart3") +
      i18n.__("general.email.signature") +
      "totterUp! " + i18n.__("general.strapline");

    return (
      <div className="league-invite-container">
        {league.inviteCode ? (
          <div className="league-invite" style={inviteBgStyle}>
            <div
              className="league-invite-code-container"
              style={inviteTextStyle}
            >
              <span className="league-invite-title">
                {i18n.__("components.leagueInvite.code")}:
              </span>
              <br />
              <div className="league-invite-code">
                {league.inviteCode}
                &nbsp;
                <a href={`mailto:?subject=${emailSubject}&body=${emailBody}`}>
                  <span
                    className="icon-email"
                    style={inviteTextStyle}
                    title={i18n.__("components.leagueInvite.emailInstructions")}
                  />
                </a>
              </div>
            </div>
          </div>
        ) : null}
        {league.editableBy() ? (
          <a
            className="league-invite-reset-link"
            onClick={this.resetLeagueInviteCode}
          >
            reset league invite code
          </a>
        ) : null}
      </div>
    );
  }
}

LeagueInvite.propTypes = {
  league: React.PropTypes.object
};
