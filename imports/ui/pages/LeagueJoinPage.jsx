/* global confirm */

import React from "react";
import i18n from "meteor/universe:i18n";
import { Session } from "meteor/session";
import BaseComponent from "../components/BaseComponent.jsx";
import MobileMenu from "../components/MobileMenu.jsx";
import { insert, useInvite } from "../../api/leagues/methods.js";

export default class LeagueJoinPage extends BaseComponent {
  constructor(props) {
    super(props);
    this.joinLeague = this.joinLeague.bind(this);
    this.onInviteFormSubmit = this.onInviteFormSubmit.bind(this);
    this.onInviteInputKeyUp = this.onInviteInputKeyUp.bind(this);
    this.state = { validCode: true, checking: false, message: "" };
  }

  onInviteFormSubmit(event) {
    this.setState({
      checking: true,
      message: i18n.__("pages.leagueInvitePage.checkingCode")
    });
    this.joinLeague(event);
  }

  onInviteInputKeyUp(event) {
    // clear validation message when start typing
    if (event.keyCode !== 13) {
      this.setState({ validCode: true, message: "" });
    }
  }

  joinLeague(event) {
    const { router } = this.context;
    event.preventDefault();

    useInvite.call(
      {
        inviteCode: this.inviteCode.value
      },
      (err, invite) => {
        this.setState({ checking: false });
        if (err) {
          console.log(err);
          this.setState({
            validCode: false,
            message: i18n.__("pages.leagueInvitePage.exception")
          });
        } else {
          if (invite.inviteValid) {
            this.setState({
              message: i18n.__("pages.leagueInvitePage.success")
            });
            Session.set("menuOpen", false);
            router.push(
              `/leagues/${invite.leagueId}`
            );
          } else {
            this.setState({
              validCode: false,
              message: i18n.__("pages.leagueInvitePage.invalidCode")
            });
          }
        }
      }
    );
  }

  render() {
    const { checking, validCode, message } = this.state;
    return (
      <div className="page leagues-invite">
        {Meteor.userId() ? (
          <form className="user-invite-form" onSubmit={this.onInviteFormSubmit}>
            <nav className="leagues-invite-header">
              <MobileMenu />
              <h1 className="title-page">
                <span className="title-wrapper">
                  {i18n.__("pages.leagueInvitePage.inviteHeader")}
                </span>
              </h1>
            </nav>

            <div className="league-invite-container">
              <div className="league-invite-title">
                {i18n.__("pages.leagueInvitePage.inviteInstructions")}:
              </div>
              <div className="league-invite-form-container">
                <input
                  className="invite-form-input"
                  type="text"
                  name="inviteCode"
                  autoComplete="off"
                  ref={c => {
                    this.inviteCode = c;
                  }}
                  onKeyUp={this.onInviteInputKeyUp}
                  placeholder={i18n.__(
                    "pages.leagueInvitePage.inviteCodePlaceholder"
                  )}
                />
              </div>
              <div className="league-invite-action">
                <button type="submit" className="btn-primary">
                  {i18n.__("pages.leagueInvitePage.joinAction")}
                </button>
              </div>
              <div
                className={
                  validCode
                    ? "league-invite-message"
                    : "league-invite-message error"
                }
              >
                {message}
              </div>
            </div>
          </form>
        ) : null}
      </div>
    );
  }
}

LeagueJoinPage.contextTypes = {
  router: React.PropTypes.object
};
