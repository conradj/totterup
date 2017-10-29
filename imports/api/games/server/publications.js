/* eslint-disable prefer-arrow-callback */

import { Meteor } from 'meteor/meteor';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';

import { Games } from '../games.js';
import { Leagues } from '../../leagues/leagues.js';

Meteor.publishComposite('games.inLeague', function gamesInLeague(params) {
  new SimpleSchema({
    leagueId: { type: String },
  }).validate(params);

  const { leagueId } = params;
  const userId = this.userId;

  return {
    find() {
      const query = {
        _id: leagueId,
        $or: [{ userId: { $exists: false } }, { userId }],
      };

      // We only need the _id field in this query, since it's only
      // used to drive the child queries to get the games
      const options = {
        fields: { _id: 1 },
      };

      return Leagues.find(query, options);
    },

    children: [{
      find(league) {
        return Games.find({ leagueId: league._id }, { fields: Games.publicFields });
      },
    }],
  };
});

Meteor.publish('games', function games() {
  if (!this) {
    return this.ready();
  }

  return Games.find({}, {
    fields: Games.publicFields,
  });
});
