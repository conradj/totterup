import React from "react";
import i18n from "meteor/universe:i18n";
import { Link } from "react-router";
import BaseComponent from "../components/BaseComponent.jsx";
import LeagueHeader from "../components/LeagueHeader.jsx";
import GameHeader from "../components/GameHeader.jsx";
import ScoreList from "../components/ScoreList.jsx";
import PlayerItem from "../components/PlayerItem.jsx";
import NotFoundPage from "../pages/NotFoundPage.jsx";
import Message from "../components/Message.jsx";
import NewGameButton from "../components/NewGameButton.jsx";
import { insert } from "../../api/games/methods.js";

export default class GamePage extends BaseComponent {
  constructor(props) {
    super(props);
    this.state = Object.assign(this.state, { editingGame: null });
  }

  onEditingChange(id, editing) {
    this.setState({
      editingGame: editing ? id : null
    });
  }

  render() {
    const { loading, game, gameExists, scores, players } = this.props;
    const { editingGame } = this.state;

    if (loading) {
      return <Message title={i18n.__("components.loading.loading")} />;
    }

    if (!gameExists) {
      return <NotFoundPage />;
    }

    let Game;

    if (!game) {
      Game = "<p>No players!</p>";
    } else {
      Game = "<p>players!</p>";
    }

    return (
      <div className="page leagues-show">
        {<GameHeader game={game} />}
        <div className="content-scrollable list-items">
          <ScoreList scores={scores} players={players} />
          <NewGameButton leagueId={game.leagueId} players={players} />
        </div>
      </div>
    );
  }
}

GamePage.propTypes = {
  loading: React.PropTypes.bool,
  game: React.PropTypes.object,
  gameExists: React.PropTypes.bool,
  scores: React.PropTypes.array,
  players: React.PropTypes.array
};
