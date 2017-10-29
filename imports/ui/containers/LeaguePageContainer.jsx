import { Meteor } from 'meteor/meteor';
import { createContainer } from 'meteor/react-meteor-data';
import { Leagues } from '../../api/leagues/leagues.js';
import LeaguePage from '../pages/LeaguePage.jsx';

const LeaguePageContainer = createContainer(({ params: { id } }) => {
  const playersHandle = Meteor.subscribe('players.inLeague', { leagueId: id });
  const gamesHandle = Meteor.subscribe('games.inLeague', { leagueId: id });
  const loading = !playersHandle.ready() || !gamesHandle.ready();
  const league = Leagues.findOne(id);
  const leagueExists = !loading && !!league;
  console.log("LeaguePageContainer", league);
  return {
    loading,
    league,
    leagueExists,
    players: leagueExists ? league.players().fetch() : [],
    games: leagueExists ? league.games().fetch() : [],
  };
}, LeaguePage);

export default LeaguePageContainer;
