/* global confirm */

import React from 'react';
import i18n from 'meteor/universe:i18n';
import BaseComponent from './BaseComponent.jsx';
import MobileMenu from './MobileMenu.jsx';
import { displayError } from '../helpers/errors.js';

import {
  updateName,
  makePublic,
  makePrivate,
  remove,
} from '../../api/leagues/methods.js';

import {
  insert,
} from '../../api/players/methods.js';

export default class LeagueHeader extends BaseComponent {
  constructor(props) {
    super(props);
    this.state = Object.assign(this.state, { editing: false });
    this.onLeagueFormSubmit = this.onLeagueFormSubmit.bind(this);
    this.onLeagueInputKeyUp = this.onLeagueInputKeyUp.bind(this);
    this.onLeagueInputBlur = this.onLeagueInputBlur.bind(this);
    this.onLeagueDropdownAction = this.onLeagueDropdownAction.bind(this);
    this.editLeague = this.editLeague.bind(this);
    this.cancelEdit = this.cancelEdit.bind(this);
    this.saveLeague = this.saveLeague.bind(this);
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

  onLeagueInputBlur() {
    if (this.state.editing) {
      this.saveLeague();
    }
  }

  onLeagueDropdownAction(event) {
    if (event.target.value === 'delete') {
      this.deleteLeague();
    } else {
      this.toggleLeaguePrivacy();
    }
  }

  editLeague() {
    this.setState({ editing: true }, () => {
      this.leagueNameInput.focus();
    });
  }

  cancelEdit() {
    this.setState({ editing: false });
  }

  saveLeague() {
    this.setState({ editing: false });
    updateName.call({
      leagueId: this.props.league._id,
      newName: this.leagueNameInput.value,
    }, displayError);
  }

  deleteLeague() {
    const league = this.props.league;
    const message =
      `${i18n.__('components.leagueHeader.deleteConfirm')} ${league.name}?`;

    if (confirm(message)) { // eslint-disable-line no-alert
      remove.call({ leagueId: league._id }, displayError);
      this.context.router.push('/');
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

  renderDefaultHeader() {
    const { league } = this.props;
    return (
      <div>
        <MobileMenu />
        <h1 className="title-page" onClick={this.editLeague}>
          <span className="title-wrapper">{league.name}</span>
          <span className="count-league">{league.incompleteCount}</span>
        </h1>
        <div className="nav-group right">
          <div className="nav-item options-mobile">
            <select
              className="mobile-edit"
              defaultValue="default"
              onChange={this.onLeagueDropdownAction}
            >
              <option disabled value="default">
                {i18n.__('components.leagueHeader.selectAction')}
              </option>
              {league.userId
                ? <option value="public">
                  {i18n.__('components.leagueHeader.makePublic')}
                </option>
                : <option value="private">
                  {i18n.__('components.leagueHeader.makePrivate')}
                </option>}
              <option value="delete">
                {i18n.__('components.leagueHeader.delete')}
              </option>
            </select>
            <span className="icon-cog" />
          </div>
          <div className="options-web">
            <a className="nav-item" onClick={this.toggleLeaguePrivacy}>
              {league.userId
                ? <span
                  className="icon-lock"
                  title={i18n.__('components.leagueHeader.makeLeaguePublic')}
                />
                : <span
                  className="icon-unlock"
                  title={i18n.__('components.leagueHeader.makeLeaguePrivate')}
                />}
            </a>
            <a className="nav-item trash" onClick={this.deleteLeague}>
              <span
                className="icon-trash"
                title={i18n.__('components.leagueHeader.deleteLeague')}
              />
            </a>
          </div>
        </div>
      </div>
    );
  }

  renderEditingHeader() {
    const { league } = this.props;
    return (
      <form className="league-edit-form" onSubmit={this.onLeagueFormSubmit}>
        <input
          type="text"
          name="name"
          autoComplete="off"
          ref={(c) => { this.leagueNameInput = c; }}
          defaultValue={league.name}
          onKeyUp={this.onLeagueInputKeyUp}
          onBlur={this.onLeagueInputBlur}
        />
        <div className="nav-group right">
          <a
            className="nav-item"
            onMouseDown={this.cancelEdit}
            onClick={this.cancelEdit}
          >
            <span
              className="icon-close"
              title={i18n.__('components.leagueHeader.cancel')}
            />
          </a>
        </div>
      </form>
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
}

LeagueHeader.propTypes = {
  league: React.PropTypes.object,
};

LeagueHeader.contextTypes = {
  router: React.PropTypes.object,
};
