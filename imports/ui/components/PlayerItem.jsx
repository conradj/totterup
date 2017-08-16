import React from 'react';
import { _ } from 'meteor/underscore';
import classnames from 'classnames';
import i18n from 'meteor/universe:i18n';
import BaseComponent from './BaseComponent.jsx';
import { displayError } from '../helpers/errors.js';

import {
  setCheckedStatus,
  updateText,
  remove,
} from '../../api/players/methods.js';

export default class PlayerItem extends BaseComponent {
  constructor(props) {
    super(props);
    this.throttledUpdate = _.throttle((value) => {
      if (value) {
        updateText.call({
          playerId: this.props.player._id,
          newText: value,
        }, displayError);
      }
    }, 300);

    this.setPlayerCheckStatus = this.setPlayerCheckStatus.bind(this);
    this.updatePlayer = this.updatePlayer.bind(this);
    this.deletePlayer = this.deletePlayer.bind(this);
    this.onFocus = this.onFocus.bind(this);
    this.onBlur = this.onBlur.bind(this);
  }

  onFocus() {
    this.props.onEditingChange(this.props.player._id, true);
  }

  onBlur() {
    this.props.onEditingChange(this.props.player._id, false);
  }

  setPlayerCheckStatus(event) {
    setCheckedStatus.call({
      playerId: this.props.player._id,
      newCheckedStatus: event.target.checked,
    });
  }

  updatePlayer(event) {
    this.throttledUpdate(event.target.value);
  }

  deletePlayer() {
    remove.call({ playerId: this.props.player._id }, displayError);
  }

  render() {
    const { player, editing } = this.props;
    const playerClass = classnames({
      'league-item': true,
      checked: player.checked,
      editing,
    });

    return (
      <div className={playerClass}>
        <label className="checkbox" htmlFor={this.props.player._id}>
          <input
            id={this.props.player._id}
            type="checkbox"
            checked={player.checked}
            name="checked"
            onChange={this.setPlayerCheckStatus}
          />
          <span className="checkbox-custom" />
        </label>
        <input

          type="text"
          defaultValue={player.text}
          placeholder={i18n.__('components.playerItem.playerName')}
          onFocus={this.onFocus}
          onBlur={this.onBlur}
          onChange={this.updatePlayer}
        />
        <a
          className="delete-item"
          href="#delete"
          onClick={this.deletePlayer}
          onMouseDown={this.deletePlayer}
        >
          <span className="icon-trash" />
        </a>
      </div>
    );
  }
}

PlayerItem.propTypes = {
  player: React.PropTypes.object,
  editing: React.PropTypes.bool,
  onEditingChange: React.PropTypes.func,
};
