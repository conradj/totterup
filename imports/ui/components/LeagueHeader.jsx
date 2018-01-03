/* global confirm */

import React from "react";
import i18n from "meteor/universe:i18n";
import BaseComponent from "./BaseComponent.jsx";
import LeagueSettings from "./LeagueSettings.jsx";
import MobileMenu from "./MobileMenu.jsx";
import { displayError } from "../helpers/errors.js";

import {
  updateName,
  makePublic,
  makePrivate,
  remove
} from "../../api/leagues/methods.js";

import { insert } from "../../api/players/methods.js";

export default class LeagueHeader extends BaseComponent {
  constructor(props) {
    super(props);
    this.state = Object.assign(this.state, { editing: true });
    this.onLeagueFormSubmit = this.onLeagueFormSubmit.bind(this);
    this.onLeagueInputFocus = this.onLeagueInputFocus.bind(this);
    this.onLeagueInputKeyUp = this.onLeagueInputKeyUp.bind(this);
    this.onLeagueInputBlur = this.onLeagueInputBlur.bind(this);
    this.onLeagueDropdownAction = this.onLeagueDropdownAction.bind(this);
    this.editLeague = this.editLeague.bind(this);
    this.cancelEdit = this.cancelEdit.bind(this);
    this.saveLeague = this.saveLeague.bind(this);
    this.deleteLeague = this.deleteLeague.bind(this);
    this.toggleLeaguePrivacy = this.toggleLeaguePrivacy.bind(this);
    this.onLeagueMaxScoreFormSubmit = this.onLeagueMaxScoreFormSubmit.bind(
      this
    );
    this.onLeagueMaxScoreInputKeyUp = this.onLeagueMaxScoreInputKeyUp.bind(
      this
    );
    this.onLeagueMaxScoreInputBlur = this.onLeagueMaxScoreInputBlur.bind(this);
    this.deleteLeague = this.deleteLeague.bind(this);
    this.toggleLeaguePrivacy = this.toggleLeaguePrivacy.bind(this);
  }

  onLeagueFormSubmit(event) {
    event.preventDefault();
    this.saveLeague();
  }

  onLeagueInputKeyUp(event) {
    if (event.keyCode === 27) {
      this.cancelEdit();
    }
  }

  onLeagueInputFocus(event) {
    event.target.select();
  }

  onLeagueInputBlur() {
    if (this.state.editing) {
      this.saveLeague();
    }
  }

  onLeagueDropdownAction(event) {
    if (event.target.value === "delete") {
      this.deleteLeague();
    } else {
      this.toggleLeaguePrivacy();
    }
  }

  editLeague(selectText) {
    if (this.props.league.editableBy()) {
      this.setState({ editing: true }, () => {
        this.leagueNameInput.focus();
        if (selectText) {
          this.leagueNameInput.select();
        }
      });
    }
  }

  cancelEdit() {
    this.setState({ editing: false });
  }

  saveLeague() {
    updateName.call(
      {
        leagueId: this.props.league._id,
        newName: this.leagueNameInput.value
      },
      displayError
    );
  }

  deleteLeague() {
    const league = this.props.league;
    const message = `${i18n.__("components.leagueHeader.deleteConfirm")} ${
      league.name
    }?`;

    if (confirm(message)) {
      // eslint-disable-line no-alert
      remove.call({ leagueId: league._id }, displayError);
      this.context.router.push("/");
    }
  }

  toggleLeaguePrivacy() {
    const league = this.props.league;
    if (league.userId) {
      makePublic.call({ leagueId: league._id }, displayError);
    } else {
      makePrivate.call({ leagueId: league._id }, displayError);
    }
  }

  onLeagueMaxScoreFormSubmit() {}

  onLeagueMaxScoreInputKeyUp() {}

  onLeagueMaxScoreInputBlur() {}

  renderDefaultHeader() {
    const { league } = this.props;
    let titlePageAttributes;
    if (league.editableBy()) {
      titlePageAttributes = { cursor: "pointer", onClick: this.editLeague };
    }
    return (
      <div>
        <MobileMenu />
        <h1 className="title-page" {...titlePageAttributes}>
          <span className="title-wrapper">{league.name}</span>
        </h1>
        {league.editableBy() ? (
          <div className="nav-group right">
            <div className="nav-item">
              <span className="icon-cog" onClick={this.editLeague} />
            </div>
          </div>
        ) : null}
      </div>
    );
  }

  renderEditingHeader() {
    const { league } = this.props;
    return (
      <div>
        <MobileMenu />
        <h1 className="title-page">
          <span className="title-wrapper">
            {i18n.__("components.leagueHeader.editTitle")} {league.name}
          </span>
        </h1>
        <div className="nav-group right">
          <a
            className="nav-item"
            onMouseDown={this.cancelEdit}
            onClick={this.cancelEdit}
          >
            <span
              className="icon-close"
              title={i18n.__("components.leagueHeader.cancel")}
            />
          </a>
        </div>
        <div className="league-settings-container list-items">
          <div className="list-item">
            <form
              className="league-edit-form"
              onSubmit={this.onLeagueFormSubmit}
            >
              <div className="instructions">
                {i18n.__("components.leagueHeader.instructions")}
              </div>
              <input
                type="text"
                name="name"
                autoComplete="off"
                autoFocus={league.name === i18n.__("api.leagues.insert.league")}
                onFocus={this.onLeagueInputFocus}
                ref={c => {
                  this.leagueNameInput = c;
                }}
                defaultValue={league.name}
                onKeyUp={this.onLeagueInputKeyUp}
                onBlur={this.onLeagueInputBlur}
                placeholder={i18n.__("components.leagueHeader.placeholder")}
              />
            </form>
          </div>
          <div className="list-item">
            <form
              className="league-edit-form"
              onSubmit={this.onLeagueMaxScoreFormSubmit}
            >
              <div className="instructions">
                {i18n.__("components.leagueSettings.maxScoreInstructions")}
              </div>
              <input
                type="text"
                name="maxScore"
                autoComplete="off"
                ref={c => {
                  this.leagueMaxScoreInput = c;
                }}
                // defaultValue={league.maxScore}
                onKeyUp={this.onLeagueMaxScoreInputKeyUp}
                onBlur={this.onLeagueMaxScoreInputBlur}
              />
            </form>
          </div>
          <div className="list-item">
            <a className="delete-link" onClick={this.deleteLeague}>
              {i18n.__("components.leagueHeader.deleteLeague")}
            </a>
          </div>
        </div>
      </div>
    );
  }

  render() {
    const { editing } = this.state;
    return (
      <nav className="league-header">
        {editing ? this.renderEditingHeader() : this.renderDefaultHeader()}
      </nav>
    );
  }

  componentDidMount() {
    if (this.props.league.name !== i18n.__("api.leagues.insert.league")) {
      this.setState({ editing: false });
    }
  }
}

LeagueHeader.propTypes = {
  league: React.PropTypes.object
};

LeagueHeader.contextTypes = {
  router: React.PropTypes.object
};
