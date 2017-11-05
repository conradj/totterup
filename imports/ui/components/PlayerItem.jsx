import React from 'react';
import { _ } from 'meteor/underscore';
import classnames from 'classnames';
import i18n from 'meteor/universe:i18n';
import { Link } from "react-router";
import BaseComponent from './BaseComponent.jsx';
import { displayError } from '../helpers/errors.js';

export default class PlayerItem extends BaseComponent {
  constructor(props) {
    super(props);
  }

  nth(n) {
    if(n>3 && n<21) return 'th'; // thanks kennebec
    switch (n % 10) {
          case 1:  return "st";
          case 2:  return "nd";
          case 3:  return "rd";
          default: return "th";
      }
  } 

  render() {
    const { player, editing, score, linkUrl, position } = this.props;
    const positionClassName = `player-container position${position}`;
    
    const playerComponent =
      <div className="player-item">
        <div className={positionClassName}>
          <div className="player-image"></div>
          <div className="player-position"><span>{ position }{ this.nth(position) }</span></div>
          <div className="player-name"><span>{ player.text }</span></div>
          <div className="player-score"><span>{ score } points</span></div>
        </div>
      </div>
        
    return (
      <div className="list-item">
        { linkUrl
          ? <Link
            to={linkUrl}
            key={player._id}
            title={player.text}
            className="league-player"
            activeClassName="active"
          >{ playerComponent }</Link>
          : playerComponent }
      </div>
    );
  }
}

PlayerItem.propTypes = {
  linkUrl: React.PropTypes.string, 
  player: React.PropTypes.object,
  position: React.PropTypes.number, 
  score: React.PropTypes.number,
  editing: React.PropTypes.bool
};
