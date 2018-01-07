/* global alert */

import React from "react";
import { Link } from "react-router";
import i18n from "meteor/universe:i18n";
import BaseComponent from "./BaseComponent.jsx";
//import { Games } from '../../api/games/games.js';

export default class GameList extends BaseComponent {
  constructor(props) {
    super(props);
  }

  render() {
    const { games } = this.props;
    const GameList = games.map(
      game =>
          <Link
            to={`/games/${game._id}`}
            key={game._id}
            title={game.name}
            className="league-game"
            activeClassName="active"
          >
            {game.name} won by {game.winner() ? game.winner().text : "no one"}
          </Link>
    );

    return <div className="league-games">{GameList}</div>;
  }
}

GameList.propTypes = {
  games: React.PropTypes.array
};

GameList.contextTypes = {
  router: React.PropTypes.object
};
