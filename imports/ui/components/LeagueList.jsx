/* global alert */

import React from 'react';
import { Link } from 'react-router';
import i18n from 'meteor/universe:i18n';
import BaseComponent from './BaseComponent.jsx';
import { insert } from '../../api/leagues/methods.js';

export default class LeagueList extends BaseComponent {
  constructor(props) {
    super(props);
    this.createNewLeague = this.createNewLeague.bind(this);
  }

  createNewLeague() {
    const { router } = this.context;
    const leagueId = insert.call({ locale: i18n.getLocale() }, (err) => {
      if (err) {
        router.push('/');
        /* eslint-disable no-alert */
        alert(i18n.__('components.leagueList.newLeagueError'));
      }
    });
    router.push(`/leagues/${leagueId}`);
  }

  render() {
    const { leagues } = this.props;
    return (
      <div className="league-players">
        <a className="link-league-new" onClick={this.createNewLeague}>
          <span className="icon-plus" />
          {i18n.__('components.leagueList.newLeague')}
        </a>
        {leagues.map(league => (
          <Link
            to={`/games/${league._id}`}
            key={league._id}
            title={league.name}
            className="league-player"
            activeClassName="active"
          >
            {league.userId
              ? <span className="icon-lock" />
              : null}
            {league.incompleteCount
              ? <span className="count-league">{league.incompleteCount}</span>
              : null}
            {league.name}
          </Link>
        ))}
      </div>
    );
  }
}

LeagueList.propTypes = {
  league: React.PropTypes.array,
};

LeagueList.contextTypes = {
  router: React.PropTypes.object,
};