import { Meteor } from 'meteor/meteor';
import { createContainer } from 'meteor/react-meteor-data';
import { Leagues } from '../../api/leagues/leagues.js';
import GamePage from '../pages/GamePage.jsx';

  const GamePageContainer = createContainer(({ params: { id } }) => {
  const playersHandle = Meteor.subscribe('players.inLeague', { leagueId: id });
  const loading = !playersHandle.ready();
  const league = Leagues.findOne(id);
  const leagueExists = !loading && !!league;
  return {
    loading,
    league,
    leagueExists,
    players: leagueExists ? league.players().fetch() : [],
  };
}, GamePage);

export default GamePageContainer;
