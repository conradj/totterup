import { Meteor } from 'meteor/meteor';
import { _ } from 'meteor/underscore';
import { ValidatedMethod } from 'meteor/mdg:validated-method';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';
import { DDPRateLimiter } from 'meteor/ddp-rate-limiter';

import { Games } from './games.js';
import { Leagues } from '../leagues/leagues.js';

export const insert = new ValidatedMethod({
  name: 'games.insert',
  validate: new SimpleSchema({
    leagueId: { type: String },
    name: { type: String },
  }).validator(),
  run({ leagueId, name }) {
    const league = Leagues.findOne(leagueId);

    if (!league.editableBy()) {
      throw new Meteor.Error(
        'api.games.insert.accessDenied',
        'Cannot add games to a league that is not yours'
      );
    }

    const game = {
      leagueId,
      name: `Game ${Games.find({ leagueId }).count() + 1}`,
      createdAt: new Date(),
    };

    const gameId = Games.insert(game);

    return gameId;
  },
});

export const updateName = new ValidatedMethod({
  name: 'games.updateName',
  validate: new SimpleSchema({
    gameId: { type: String },
    newName: { type: String },
  }).validator(),
  run({ gameId, newName }) {
    // This is complex auth stuff - perhaps denormalizing a userId onto games
    // would be correct here?
    const game = Games.findOne(gameId);

    if (!game.editableBy()) {
      throw new Meteor.Error(
        'api.games.updateName.accessDenied',
        'Cannot edit a game in a league that is not yours'
      );
    }

    Games.update(gameId, {
      $set: { name: newName },
    });
  },
});

export const remove = new ValidatedMethod({
  name: 'games.remove',
  validate: new SimpleSchema({
    gameId: { type: String },
  }).validator(),
  run({ gameId }) {
    const game = Games.findOne(gameId);
    if (!game.editableBy()) {
      throw new Meteor.Error(
        'api.games.remove.accessDenied',
        'Cannot remove a game in a league that is not yours'
      );
    }
    Games.remove(gameId);
  },
});

// Get list of all method names on Games
const GAMES_METHODS = _.pluck([insert, updateName, remove], 'name');

if (Meteor.isServer) {
  // Only allow 5 game operations per connection per second
  DDPRateLimiter.addRule(
    {
      name(name) {
        return _.contains(GAMES_METHODS, name);
      },

      // Rate limit per connection ID
      connectionId() {
        return true;
      },
    },
    5,
    1000
  );
}
