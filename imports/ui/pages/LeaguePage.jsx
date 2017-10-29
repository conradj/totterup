import React from "react";
import { Link } from "react-router";
import i18n from "meteor/universe:i18n";
import BaseComponent from "../components/BaseComponent.jsx";
import LeagueHeader from "../components/LeagueHeader.jsx";
import PlayerSubHeader from "../components/PlayerSubHeader.jsx";
import GameList from "../components/GameList.jsx";
import PlayerItem from "../components/PlayerItem.jsx";
import NotFoundPage from "../pages/NotFoundPage.jsx";
import Message from "../components/Message.jsx";
import NewGameButton from "../components/NewGameButton.jsx";

export default class LeaguePage extends BaseComponent {
  constructor(props) {
    super(props);
    this.state = Object.assign(this.state, { editingPlayer: null });
    this.onEditingChange = this.onEditingChange.bind(this);
  }

  onEditingChange(id, editing) {
    this.setState({
      editingPlayer: editing ? id : null
    });
  }

  render() {
    const { league, leagueExists, loading, players } = this.props;
    const { editingPlayer } = this.state;

    if (!leagueExists) {
      return <NotFoundPage />;
    }

    const Players = players.map(player =>
      <PlayerItem
        player={player}
        key={player._id}
        editing={player._id === editingPlayer}
        onEditingChange={this.onEditingChange}
      />
    );
    
    let Instructions;
    let GameButton;

    if( players.length == 0 ) {
      Instructions = (
        <Message
          title={i18n.__("pages.leaguePage.noPlayers")}
          subtitle={i18n.__("pages.leaguePage.addAbove")}
        />
      );
    }

    if( players.length == 1 ) {
      Instructions = (
        <Message
          title={i18n.__("pages.leaguePage.needMorePlayers")}
          subtitle={i18n.__("pages.leaguePage.addAbove")}
        />
      );
    }

    if( players.length > 1 ) {
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
          {loading
            ? <Message title={i18n.__("pages.leaguePage.loading")} />
            : Players}
          <PlayerSubHeader league={league} />
          { players.length > 1 
            ? <NewGameButton leagueId={league._id} players={players}/> 
            : null }
          { Instructions }
          <GameList games={this.props.games } />
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
  router: React.PropTypes.object,
};
