import React from "react";
import i18n from "meteor/universe:i18n";
import BaseComponent from "../components/BaseComponent.jsx";
import LeagueHeader from "../components/LeagueHeader.jsx";
import PlayerAdd from "../components/PlayerAdd.jsx";
import GameList from "../components/GameList.jsx";
import PlayerItem from "../components/PlayerItem.jsx";
import NotFoundPage from "../pages/NotFoundPage.jsx";
import Message from "../components/Message.jsx";
import NewGameButton from "../components/NewGameButton.jsx";

export default class LeaguePage extends BaseComponent {
  constructor(props) {
    super(props);
  }

  render() {
    const { league, leagueExists, loading, players } = this.props;

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

    let Instructions;
    let GameButton;

    if (players.length == 0) {
      Instructions = (
        <Message
          title={i18n.__("pages.leaguePage.noPlayers")}
          subtitle={i18n.__("pages.leaguePage.addAbove")}
        />
      );
    }

    if (players.length == 1) {
      Instructions = (
        <Message
          title={i18n.__("pages.leaguePage.needMorePlayers")}
          subtitle={i18n.__("pages.leaguePage.addAbove")}
        />
      );
    }

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
    let inviteBgStyle = "";
    let inviteTextStyle = "";
    if (league.inviteCode) {
      inviteBgStyle = { backgroundColor: `#${league.inviteCode}` };
      inviteTextStyle = { color: `#${league.inviteCode}` };
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
          {league.editableBy() ? <PlayerAdd league={league} /> : null}
          {league.editableBy() && players.length > 1 ? (
            <NewGameButton leagueId={league._id} players={players} />
          ) : null}
          {Instructions}
          {league.inviteCode ? (
            <div className="league-invite-container">
              <span>This is your league invite code.</span>
              <div className="league-invite-code" style={inviteBgStyle}>
                <span style={inviteTextStyle}>{league.inviteCode}</span>
              </div>
              <div className="league-invite-description">
                You can give it to other TotterUp users so they can join your
                league!
              </div>
              <div className="league-invite-subdescription">
                You can create players that aren't already TotterUp users
                yourself, but then you'll need to link their account later on if
                they sign up.
              </div>
            </div>
          ) : null}
          <GameList games={this.props.games} />
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
