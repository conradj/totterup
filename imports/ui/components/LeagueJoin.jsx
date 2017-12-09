/* global confirm */

import React from "react";
import i18n from "meteor/universe:i18n";
import { Session } from "meteor/session";
import BaseComponent from "./BaseComponent.jsx";
import { displayError } from "../helpers/errors.js";

import { insert, useInvite } from "../../api/leagues/methods.js";

export default class LeagueJoin extends BaseComponent {
  constructor(props) {
    super(props);
    this.joinLeague = this.joinLeague.bind(this);
    this.onInviteFormSubmit = this.onInviteFormSubmit.bind(this);
    this.onInviteInputBlur = this.onInviteInputBlur.bind(this);
  }

  onInviteFormSubmit() {
    this.joinLeague();
  }

  onInviteInputBlur() {
    this.joinLeague();
  }

  joinLeague() {
    const { router } = this.context;
    const invite = useInvite.call(
      {
        inviteCode: this.inviteCode.value
      },
      err => {
        if (err) {
          console.log(err);
        }
      }
    );
    
    if (invite.inviteValid) {
      Session.set("menuOpen", false);
      router.push(
        `/leagues/${invite.player.leagueId}/players/${invite.player._id}`
      );
    }
  }

  render() {
    return (
      <div>
        {Meteor.userId() ? (
          <form className="user-invite-form" onSubmit={this.onInviteFormSubmit}>
            <input
              type="text"
              name="inviteCode"
              autoComplete="off"
              ref={c => {
                this.inviteCode = c;
              }}
              onKeyUp={this.onInviteInputKeyUp}
              onBlur={this.onInviteInputBlur}
              placeholder={i18n.__(
                "components.leagueList.inviteCodePlaceholder"
              )}
            />
          </form>
        ) : null}
      </div>
    );
  }
}

LeagueJoin.contextTypes = {
  router: React.PropTypes.object
};
