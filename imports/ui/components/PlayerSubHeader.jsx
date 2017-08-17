/* global confirm */

import React from 'react';
import i18n from 'meteor/universe:i18n';
import BaseComponent from './BaseComponent.jsx';
import MobileMenu from './MobileMenu.jsx';
import { displayError } from '../helpers/errors.js';

import {
  insert,
} from '../../api/players/methods.js';

export default class PlayerSubHeader extends BaseComponent {
  constructor(props) {
    super(props);
    
    this.createPlayer = this.createPlayer.bind(this);
    this.focusPlayerInput = this.focusPlayerInput.bind(this);
  }

  createPlayer(event) {
    event.preventDefault();
    const input = this.newPlayerInput;
    if (input.value.trim()) {
      insert.call({
        leagueId: this.props.league._id,
        text: input.value,
      }, displayError);
      input.value = '';
    }
  }

  focusPlayerInput() {
    this.newPlayerInput.focus();
  }

  render() {
    return (
      <form className="player-new input-symbol" onSubmit={this.createPlayer}>
        <input
          type="text"
          ref={(c) => { this.newPlayerInput = c; }}
          placeholder={i18n.__('components.leagueHeader.typeToAdd')}
        />
        <span className="icon-add" onClick={this.focusPlayerInput} />
      </form>
    );
  }
}

PlayerSubHeader.propTypes = {
  league: React.PropTypes.object,
};

PlayerSubHeader.contextTypes = {
  router: React.PropTypes.object,
};
