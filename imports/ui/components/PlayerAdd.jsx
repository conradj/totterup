/* global confirm */

import React from "react";
import i18n from "meteor/universe:i18n";
import BaseComponent from "./BaseComponent.jsx";
import { displayError } from "../helpers/errors.js";

import { insert } from "../../api/players/methods.js";

export default class PlayerAdd extends BaseComponent {
  constructor(props) {
    super(props);

    this.createPlayer = this.createPlayer.bind(this);
    this.focusPlayerInput = this.focusPlayerInput.bind(this);
  }

  createPlayer(event) {
    event.preventDefault();
    const input = this.newPlayerInput;
    if (input.value.trim()) {
      const result = insert.call({
        leagueId: this.props.league._id,
        text: input.value
      });
      input.value = "";
    }
  }

  focusPlayerInput() {
    this.newPlayerInput.focus();
  }

  render() {
    const leaguePlayerCount = this.props.players.length;
    let placeHolder = i18n.__("components.leagueHeader.typeToAdd");
    if (leaguePlayerCount < 2) {
      placeHolder = placeHolder + " before playing a game!";
    }
    return (
      <div className="player-new-container">
        <form className="player-new input-symbol" onSubmit={this.createPlayer}>
          <input
            maxLength="100"
            className="player-new-textbox"
            type="text"
            ref={c => {
              this.newPlayerInput = c;
            }}
            placeholder={placeHolder}
          />
          <span className="icon-add" onClick={this.focusPlayerInput} />
        </form>
      </div>
    );
  }
}

PlayerAdd.propTypes = {
  league: React.PropTypes.object,
  players: React.PropTypes.array
};

PlayerAdd.contextTypes = {
  router: React.PropTypes.object
};
