//@ts-check

import { Meteor } from 'meteor/meteor';
import React from 'react';
import { merge } from 'react-komposer';
import container from '../../modules/container.js';

import { Leagues } from '../../api/leagues/leagues.js';
import LeaguePage from '../pages/LeaguePage.jsx';

// Creates a container composer with necessary data for component
// const LeaguePageContainer = ( props, onData ) => {
//   console.log("composer", props.id);
//   const playersHandle = Meteor.subscribe('players.inLeague', { leagueId: props.id });
//   const gamesHandle = Meteor.subscribe('games.inLeague', { leagueId: props.id });

//   if (playersHandle.ready() && gamesHandle.ready()) {
//     const league = Leagues.findOne(props.id);
//     const leagueExists = !!league;
//     const players = leagueExists ? league.players().fetch() : [];
//     const games = leagueExists ? league.games().fetch() : [];
    
//     let scoresHandle = [];
//     if(!!league && !!players) {
//       players.map((player, index) => { 
//         console.log("hello", player, index);
//         scoresHandle[index] = Meteor.subscribe('scores.forPlayer', { playerId: player._id });
//       });
//     }
//     const loading = leagueExists && scoresHandle.every(scoreHandle => scoreHandle.ready())
//     console.log("scoresLoading", loading);

//     LeaguePageContainer.displayName = 'LeaguePageContainer';
//     onData(null, { loading, leagueExists, players, games});
//   }
// };



// export default merge(
//     compose(dataLoader1),
//     compose(dataLoader2),
//     compose(dataLoader3),
// )(LeaguePage);

// Creates the container component and links to Meteor Tracker
//export default container(LeaguePageContainer)(LeaguePage);

import { withTracker } from 'meteor/react-meteor-data';
import { createContainer } from 'meteor/react-meteor-data';

export default LeaguePageContainer = withTracker(({ params: { id } }) => {
//const LeaguePageContainer = withTracker(({ params: { id } }) => {
  const playersHandle = Meteor.subscribe('players.inLeague', { leagueId: id });
  const gamesHandle = Meteor.subscribe('games.inLeague', { leagueId: id });
  const scoresLeagueHandle = Meteor.subscribe('scores.forLeague', { leagueId: id });
  let scoresHandle = [];
  const loading = !playersHandle.ready() || !gamesHandle.ready() || !scoresLeagueHandle.ready();
  const league = Leagues.findOne(id);
  const leagueExists = !loading && !!league;
  const players = leagueExists ? league.players().fetch() : [];
  const leagueScores = leagueExists ? league.scores().fetch() : [];

  // console.log("leagueScores", leagueScores);


  // // if(leagueExists && players) {
  // //   players.map((player, index) => { 
  // //     console.log("hello", player, index);
  // //     scoresHandle[index] = Meteor.subscribe('scores.forPlayer', { playerId: player._id });
  // //   });
  // // }

  // const scoresLoading = !scoresHandle.every(scoreHandle => scoreHandle.ready())
  // console.log("scoresLoading", scoresLoading);
  return {
    loading: loading,
    league,
    leagueExists,
    players: leagueExists ? league.players().fetch() : [],
    games: leagueExists ? league.games().fetch() : [],
    scores: leagueExists ? league.scores().fetch() : [],
  };
}) (LeaguePage);

//export default LeaguePageContainer;