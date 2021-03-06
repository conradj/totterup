import React from "react";
import i18n from "meteor/universe:i18n";
import BaseComponent from "../components/BaseComponent.jsx";
import LeagueHeader from "../components/LeagueHeader.jsx";
import PlayerAdd from "../components/PlayerAdd.jsx";
import GameList from "../components/GameList.jsx";
import PlayerItem from "../components/PlayerItem.jsx";
import LeagueInvite from "../components/LeagueInvite.jsx";
import NotFoundPage from "../pages/NotFoundPage.jsx";
import Message from "../components/Message.jsx";
import NewGameButton from "../components/NewGameButton.jsx";

export default class LeaguePage extends BaseComponent {
  constructor(props) {
    super(props);
  }

  render() {
    const { league, leagueExists, loading, players, games } = this.props;

    if (loading) {
      return <Message title={i18n.__("components.loading.loading")} />;
    }

    if (!leagueExists) {
      return <NotFoundPage />;
    }

    const playersByScore = [];
    players.forEach(player => {
      const loadedPlayer = player;
      loadedPlayer.score = player
        .scores()
        .fetch()
        .reduce((sum, score) => sum + score.score, 0);
      playersByScore.push(loadedPlayer);
    });

    playersByScore.sort((p, p2) => {
      if (p.score > p2.score) {
        return -1;
      } else if (p.score < p2.score) {
        return 1;
      }

      if (p.text < p2.text) {
        return -1;
      } else if (p.text > p2.text) {
        return 1;
      } else {
        // nothing to split them
        return 0;
      }
    });

    const PlayersComponent = (
      <div className="league-standings">
        {playersByScore.map((player, index) => (
          <PlayerItem
            linkUrl={`/leagues/${league._id}/players/${player._id}`}
            position={index + 1}
            player={player}
            score={player.score}
            key={player._id}
          />
        ))}
      </div>
    );

    let GameButton;

    if (players.length > 1) {
      GameButton = (
        <div className="-league-new-game">
          <div className="user-menu">
            <a className="link-game-new" onClick={this.playGame}>
              <span className="icon-plus" />
              {i18n.__("pages.leaguePage.playGame")}
            </a>
          </div>
        </div>
      );
    }

    return (
      <div className="page leagues-show">
        <LeagueHeader league={league} />
        <div className="content-scrollable list-items">
          {loading ? (
            <Message title={i18n.__("pages.leaguePage.loading")} />
          ) : (
            PlayersComponent
          )}
          {league.editableBy() ? <PlayerAdd league={league} players={players} /> : null}
          {league.editableBy() && players.length > 1 ? (
            <NewGameButton leagueId={league._id} players={players} />
          ) : null}
          <GameList games={games} />
          <LeagueInvite league={league} />
        </div>
      </div>
    );
  }
}

LeaguePage.propTypes = {
  league: React.PropTypes.object,
  players: React.PropTypes.array,
  games: React.PropTypes.array,
  loading: React.PropTypes.bool,
  leagueExists: React.PropTypes.bool
};

LeaguePage.contextTypes = {
  router: React.PropTypes.object
};
