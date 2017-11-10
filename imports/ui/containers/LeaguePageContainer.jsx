import { Meteor } from 'meteor/meteor';
import React from 'react';
import { Leagues } from '../../api/leagues/leagues.js';
import LeaguePage from '../pages/LeaguePage.jsx';
import { withTracker } from 'meteor/react-meteor-data';

export default LeaguePageContainer = withTracker(({ params: { id } }) => {
  const playersHandle = Meteor.subscribe('players.inLeague', { leagueId: id });
  const gamesHandle = Meteor.subscribe('games.inLeague', { leagueId: id });
  const scoresLeagueHandle = Meteor.subscribe('scores.forLeague', { leagueId: id });
  let scoresHandle = [];
  const loading = !playersHandle.ready() || !gamesHandle.ready() || !scoresLeagueHandle.ready();
  const league = Leagues.findOne(id);
  const leagueExists = !loading && !!league;
  const players = leagueExists ? league.players().fetch() : [];
  const leagueScores = leagueExists ? league.scores().fetch() : [];

  return {
    loading: loading,
    league,
    leagueExists,
    players: leagueExists ? league.players().fetch() : [],
    games: leagueExists ? league.games().fetch() : [],
    scores: leagueExists ? league.scores().fetch() : [],
  };
}) (LeaguePage);