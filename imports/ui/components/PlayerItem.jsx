import React from 'react';
import { _ } from 'meteor/underscore';
import classnames from 'classnames';
import i18n from 'meteor/universe:i18n';
import BaseComponent from './BaseComponent.jsx';
import { displayError } from '../helpers/errors.js';

export default class PlayerItem extends BaseComponent {
  constructor(props) {
    super(props);
  }

  render() {
    const { player, editing, score } = this.props;
    const playerClass = classnames({
      'list-item': true
    });

    return (
      <div className={playerClass}>
        <div className="player-name">
          <span>{ player.text }</span>
        </div>
        <div className="player-score"><span>{ score }</span></div>
      </div>
    );
  }
}

PlayerItem.propTypes = {
  player: React.PropTypes.object,
  score: React.PropTypes.number,
  editing: React.PropTypes.bool,
  onEditingChange: React.PropTypes.func,
};
