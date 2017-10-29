/* eslint-disable prefer-arrow-callback */

import { Meteor } from 'meteor/meteor';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';

import { Scores } from '../scores.js';
import { Games } from '../../games/games.js';

Meteor.publishComposite('scores.inGame', function scoresInGame(params) {
  new SimpleSchema({
    gameId: { type: String },
  }).validate(params);

  const { gameId } = params;
  const userId = this.userId;

  return {
    find() {
      const query = {
        _id: gameId,
        $or: [{ userId: { $exists: false } }, { userId }],
      };

      // We only need the _id field in this query, since it's only
      // used to drive the child queries to get the games
      const options = {
        fields: { _id: 1 },
      };

      return Games.find(query, options);
    },

    children: [{
      find(game) {
        return Scores.find({ gameId: game._id }, { fields: Scores.publicFields });
      },
    }],
  };
});

// maybe split to get all scores for a game, player and league
Meteor.publish('scores', function scores() {
  if (!this) {
    return this.ready();
  }

  return Scores.find({}, {
    fields: Scores.publicFields,
  });
});
