import React from 'react';
import { Link } from 'react-router';
import i18n from 'meteor/universe:i18n';
import BaseComponent from '../components/BaseComponent.jsx';
import LeagueHeader from '../components/LeagueHeader.jsx';
import PlayerSubHeader from '../components/PlayerSubHeader.jsx';
import PlayerItem from '../components/PlayerItem.jsx';
import NotFoundPage from '../pages/NotFoundPage.jsx';
import Message from '../components/Message.jsx';

export default class LeaguePage extends BaseComponent {
  constructor(props) {
    super(props);
    this.state = Object.assign(this.state, { editingPlayer: null });
    this.onEditingChange = this.onEditingChange.bind(this);
  }

  onEditingChange(id, editing) {
    this.setState({
      editingPlayer: editing ? id : null,
    });
  }

  render() {
    const { league, leagueExists, loading, players } = this.props;
    const { editingPlayer } = this.state;

    if (!leagueExists) {
      return <NotFoundPage />;
    }

    let Players;
    if (!players || !players.length) {
      Players = (
        <Message
          title={i18n.__('pages.leaguePage.noPlayers')}
          subtitle={i18n.__('pages.leaguePage.addAbove')}
        />
      );
    } else {
      Players = players.map(player => (
        <PlayerItem
          player={player}
          key={player._id}
          editing={player._id === editingPlayer}
          onEditingChange={this.onEditingChange}
        />
      ));
    }

    let Games;

    Games = (
      <Message
        title={i18n.__('pages.leaguePage.noGames')}
        subtitle={i18n.__('pages.leaguePage.addAbove')}
        />
    );

    return (
      <div className="page leagues-show">
        <LeagueHeader league={league} />
        <nav className="league-header">
          <div class="user-menu">
            <Link
                to={`/leagues/${league._id}/games`}
                key={league._id}
                title={league.name}
                activeClassName="active"
                className="btn-secondary"
              >
              Games
              </Link>
            </div>
        </nav>
        <div className="content-scrollable league-items">
          {loading
            ? <Message title={i18n.__('pages.leaguePage.loading')} />
            : Players }
          {loading
            ? <Message title={i18n.__('pages.leaguePage.loading')} />
            : Games }
          <PlayerSubHeader league={this.props.league} />
        </div>
      </div>
    );
  }
}

LeaguePage.propTypes = {
  league: React.PropTypes.object,
  players: React.PropTypes.array,
  loading: React.PropTypes.bool,
  leagueExists: React.PropTypes.bool,
};
