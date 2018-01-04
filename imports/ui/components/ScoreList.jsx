/* global alert */

import React from "react";
import { Link } from "react-router";
import i18n from "meteor/universe:i18n";
import BaseComponent from "./BaseComponent.jsx";
import Score from "../components/Score.jsx";

export default class ScoreList extends BaseComponent {
  constructor(props) {
    super(props);
  }

  render() {
    const { scores, players } = this.props;

    return (
      <div className="scores list-items">
        {scores.map(
          score =>
            score.player() ? (
              <Score key={score._id} score={score} players={players} />
            ) : null
        )}
      </div>
    );
  }
}

ScoreList.propTypes = {
  scores: React.PropTypes.array,
  players: React.PropTypes.array
};

ScoreList.contextTypes = {
  router: React.PropTypes.object
};
