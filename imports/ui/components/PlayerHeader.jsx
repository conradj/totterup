/* global confirm */

import React from "react";
import i18n from "meteor/universe:i18n";
import { Link } from "react-router";
import BaseComponent from "./BaseComponent.jsx";
import MobileMenu from "./MobileMenu.jsx";
import { displayError } from "../helpers/errors.js";

import { updateName, remove, insert } from "../../api/players/methods.js";

export default class PlayerHeader extends BaseComponent {
  constructor(props) {
    super(props);
    this.state = Object.assign(this.state, { editing: false });
    this.onPlayerFormSubmit = this.onPlayerFormSubmit.bind(this);
    this.onPlayerInputKeyUp = this.onPlayerInputKeyUp.bind(this);
    this.onPlayerInputBlur = this.onPlayerInputBlur.bind(this);
    this.onPlayerDropdownAction = this.onPlayerDropdownAction.bind(this);
    this.editPlayer = this.editPlayer.bind(this);
    this.cancelEdit = this.cancelEdit.bind(this);
    this.savePlayer = this.savePlayer.bind(this);
    this.deletePlayer = this.deletePlayer.bind(this);
  }

  onPlayerFormSubmit(event) {
    event.preventDefault();
    this.savePlayer();
  }

  onPlayerInputKeyUp(event) {
    if (event.keyCode === 27) {
      this.cancelEdit();
    }
  }

  onPlayerInputBlur() {
    if (this.state.editing) {
      this.savePlayer();
    }
  }

  onPlayerDropdownAction(event) {
    if (event.target.value === "delete") {
      this.deletePlayer();
    }
  }

  editPlayer(selectText) {
    this.setState({ editing: true }, () => {
      this.playerNameInput.focus();
      if (selectText) {
        this.playerNameInput.select();
      }
    });
  }

  cancelEdit() {
    this.setState({ editing: false });
  }

  savePlayer() {
    this.setState({ editing: false });
    updateName.call(
      {
        playerId: this.props.player._id,
        newName: this.playerNameInput.value
      },
      displayError
    );
  }

  deletePlayer() {
    const player = this.props.player;
    const leagueId = player.leagueId;
    const message = `${i18n.__("components.playerHeader.deleteConfirm")} ${
      player.text
    }?`;

    if (confirm(message)) {
      // eslint-disable-line no-alert
      remove.call({ playerId: player._id }, displayError);
      this.context.router.push(`/leagues/${leagueId}`);
    }
  }

  renderDefaultHeader() {
    const { player } = this.props;
    return (
      <div>
        <MobileMenu />
        <h1 className="title-page" onClick={this.editPlayer}>
          <span className="title-wrapper">{player.text}</span>
          <span className="title-wrapper">
            <Link
              to={`/leagues/${player.leagueId}`}
              title={player.league().name}
              activeClassName="active"
            >
              {player.league().name}
            </Link>
          </span>
        </h1>
        <div className="nav-group right">
          <div className="nav-item options-mobile">
            <select
              className="mobile-edit"
              defaultValue="default"
              onChange={this.onPlayerDropdownAction}
            >
              <option disabled value="default">
                {i18n.__("components.playerHeader.selectAction")}
              </option>
              <option value="delete">
                {i18n.__("components.playerHeader.delete")}
              </option>
            </select>
            <span className="icon-cog" />
          </div>
          <div className="options-web">
            <a className="nav-item trash" onClick={this.deletePlayer}>
              <span
                className="icon-trash"
                title={i18n.__("components.playerHeader.deletePlayer")}
              />
            </a>
          </div>
        </div>
      </div>
    );
  }

  renderEditingHeader() {
    const { player } = this.props;
    return (
      <form className="player-edit-form" onSubmit={this.onPlayerFormSubmit}>
        <input
          type="text"
          name="name"
          autoComplete="off"
          ref={c => {
            this.playerNameInput = c;
          }}
          defaultValue={player.text}
          onKeyUp={this.onPlayerInputKeyUp}
          onBlur={this.onPlayerInputBlur}
        />
        <div className="nav-group right">
          <a
            className="nav-item"
            onMouseDown={this.cancelEdit}
            onClick={this.cancelEdit}
          >
            <span
              className="icon-close"
              title={i18n.__("components.playerHeader.cancel")}
            />
          </a>
        </div>
        <div className="player-header title-page instructions">
          {i18n.__("components.playerHeader.instructions")}
        </div>
      </form>
    );
  }

  render() {
    const { editing } = this.state;
    return (
      <nav className="player-header">
        {editing ? this.renderEditingHeader() : this.renderDefaultHeader()}
      </nav>
    );
  }

  componentDidMount() {
    if (
      this.props.player.text ===
      i18n.__("api.players.insert.defaultName", null, {
        _locale: "en"
      })
    ) {
      this.editPlayer(true);
    }
  }
}

PlayerHeader.propTypes = {
  player: React.PropTypes.object
};

PlayerHeader.contextTypes = {
  router: React.PropTypes.object
};
