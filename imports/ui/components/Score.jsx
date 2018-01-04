/* global alert */

import React from "react";
import { Link } from "react-router";
import i18n from "meteor/universe:i18n";
import BaseComponent from "./BaseComponent.jsx";
import { displayError } from "../helpers/errors.js";
import Message from "../components/Message.jsx";
import { updateScore } from "../../api/scores/methods.js";

export default class Score extends BaseComponent {
  constructor(props) {
    super(props);
    this.onScoreFormSubmit = this.onScoreFormSubmit.bind(this);
    this.onScoreInputBlur = this.onScoreInputBlur.bind(this);
    this.onScoreInputChange = this.onScoreInputChange.bind(this);
    this.saveScore = this.saveScore.bind(this);
  }

  onScoreFormSubmit(event) {
    event.preventDefault();
    this.saveScore();
  }

  onScoreInputBlur() {
    this.saveScore();
  }

  onScoreInputChange() {
    this.saveScore();
  }

  saveScore() {
    const { score } = this.props;
    updateScore.call(
      {
        scoreId: score._id,
        newScore: parseInt(this.scoreInput.value)
      },
      displayError
    );
  }

  render() {
    const { score, players } = this.props;
    const player = score.player();
    const league = score.league();
    const maxScore = league.maxScore || players.length; // default max slider value to the number of players
    const backgroundStyle = { backgroundImage: `url(${player.avatar})` };
    const sliderImageClassName = `score-slider-${player.text}`;
    const sliderClassNames = `score-slider ${sliderImageClassName}`;
    return (
      <form className="league-edit-form" onSubmit={this.onScoreFormSubmit}>
        <div className="score-container list-item">
          <div className="score-player-name">
            {player.text} {score.score} {score.score == 1 ? `point` : `points`}
          </div>
          <div className="score-player-score-slider">
            <style
              dangerouslySetInnerHTML={{
                __html: `
            input[type=range].${sliderImageClassName}::-webkit-slider-thumb
            { background-color: #2cc5d2;
              background-image: url(${player.avatar}); }

            input[type=range].${sliderImageClassName}::-moz-range-thumb
            { background-color: #2cc5d2;
              background-image: url(${player.avatar}); }
          `
              }}
            />
            <input
              type="range"
              className={sliderClassNames}
              max={maxScore}
              defaultValue={score.score}
              ref={c => {
                this.scoreInput = c;
              }}
              name="score"
              onBlur={this.onScoreInputBlur}
              onChange={this.onScoreInputChange}
            />
          </div>
        </div>
      </form>
    );
  }
}

Score.propTypes = {
  score: React.PropTypes.object,
  players: React.PropTypes.array
};

Score.contextTypes = {
  router: React.PropTypes.object
};
