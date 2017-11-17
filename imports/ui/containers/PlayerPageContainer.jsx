import { Meteor } from 'meteor/meteor';
import React from 'react';
import { Players } from '../../api/players/players.js';
import PlayerPage from '../pages/PlayerPage.jsx';
import { withTracker } from 'meteor/react-meteor-data';

export default PlayerPageContainer = withTracker(({ params: { leagueId, playerId } }) => {
  const playersHandle = Meteor.subscribe('players');
  const loading = !playersHandle.ready()
  const player = Players.findOne(playerId);
  const playerExists = !loading && !!player;
  return {
    player,
    playerExists,
    loading
  };
}) (PlayerPage);