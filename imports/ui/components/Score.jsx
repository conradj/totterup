/* global alert */

import React from 'react';
import { Link } from 'react-router';
import i18n from 'meteor/universe:i18n';
import BaseComponent from './BaseComponent.jsx';
import { displayError } from '../helpers/errors.js';
import Message from "../components/Message.jsx";
import {
  updateScore
} from '../../api/scores/methods.js';


export default class Score extends BaseComponent {
  constructor(props) {
    super(props);
    this.onScoreFormSubmit = this.onScoreFormSubmit.bind(this);
    this.onScoreInputBlur = this.onScoreInputBlur.bind(this);
    this.saveScore = this.saveScore.bind(this);
  }

  onScoreFormSubmit(event) {
    event.preventDefault();
    this.saveScore();
  }

  onScoreInputBlur() {
    this.saveScore();
  }

  saveScore() {
    const { score } = this.props;
    updateScore.call({
      scoreId: score._id,
      newScore: parseInt(this.scoreInput.value),
    }, displayError);
  }

  render() {
    const { score } = this.props;
    
    return (
      <div className="score list-item">
          <span>{ score.player().text }</span>
          <span>
            <form className="league-edit-form" onSubmit={this.onScoreFormSubmit}>
              <input
              ref={(c) => { this.scoreInput = c; }}
              type="number"
              defaultValue={score.score}
              name="score"
              onBlur={this.onScoreInputBlur}
            />
            </form>
          </span>
      </div>
    );
  }
}

Score.propTypes = {
  score: React.PropTypes.object,
};

Score.contextTypes = {
  router: React.PropTypes.object,
};