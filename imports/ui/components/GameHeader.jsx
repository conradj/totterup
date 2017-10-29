/* global confirm */

import React from 'react';
import i18n from 'meteor/universe:i18n';
import { Link } from 'react-router';
import BaseComponent from './BaseComponent.jsx';
import MobileMenu from './MobileMenu.jsx';
import { displayError } from '../helpers/errors.js';
import Message from "../components/Message.jsx";

import {
  updateName
} from '../../api/games/methods.js';

export default class GameHeader extends BaseComponent {
  constructor(props) {
    super(props);
    this.editGame = this.editGame.bind(this);
    this.onGameFormSubmit = this.onGameFormSubmit.bind(this);
    this.onGameInputKeyUp = this.onGameInputKeyUp.bind(this);
    this.onGameInputBlur = this.onGameInputBlur.bind(this);
    this.cancelEdit = this.cancelEdit.bind(this);
    this.saveGame = this.saveGame.bind(this);
    
    // this.focusPlayerInput = this.focusGameInput.bind(this);
  }

  editGame() {
    this.setState({ editing: true }, () => {
      this.gameNameInput.focus();
    });
  }

  onGameFormSubmit(event) {
    event.preventDefault();
    this.saveGame();
  }

  onGameInputKeyUp(event) {
    if (event.keyCode === 27) {
      this.cancelEdit();
    }
  }

  onGameInputBlur() {
    if (this.state.editing) {
      this.saveGame();
    }
  }

  cancelEdit() {
    this.setState({ editing: false });
  }

  saveGame() {
    this.setState({ editing: false });
    updateName.call({
      gameId: this.props.game._id,
      newName: this.gameNameInput.value,
    }, displayError);
  }

  renderDefaultHeader() {
    const { game } = this.props;
    return (
      <div>
        <h1 className="title-page" onClick={this.editGame}>
          <span className="title-wrapper">{game.name}</span>
          <span className="title-wrapper">
            <Link
              to={`/leagues/${game.leagueId}`}
              title={game.league().name}
              activeClassName="active"
            >
              {game.league().name}
            </Link>
          </span>
        </h1>
      </div>
    );
  }

  renderEditingHeader() {
    const { game } = this.props;
    return (
      <form className="league-edit-form" onSubmit={this.onGameFormSubmit}>
        <input
          type="text"
          name="name"
          autoComplete="off"
          ref={(c) => { this.gameNameInput = c; }}
          defaultValue={game.name}
          onKeyUp={this.onGameInputKeyUp}
          onBlur={this.onGameInputBlur}
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

GameHeader.propTypes = {
  game: React.PropTypes.object,
};

GameHeader.contextTypes = {
  router: React.PropTypes.object,
};
