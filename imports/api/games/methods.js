import { Meteor } from 'meteor/meteor';
import { _ } from 'meteor/underscore';
import { ValidatedMethod } from 'meteor/mdg:validated-method';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';
import { DDPRateLimiter } from 'meteor/ddp-rate-limiter';

import { Games } from './games.js';
import { Scores } from '../scores/scores.js';
import { Leagues } from '../leagues/leagues.js';

export const insert = new ValidatedMethod({
  name: 'games.insert',
  validate: new SimpleSchema({
    leagueId: { type: String },
    name: { type: String },
  }).validator(),
  run({ leagueId, name }) {
    const league = Leagues.findOne(leagueId);

    if (league.isPrivate() && league.userId !== this.userId) {
      throw new Meteor.Error('api.games.insert.accessDenied',
        'Cannot add games to a private league that is not yours');
    }

    name = 'Game ' + (Games.find({ leagueId: leagueId }).count() + 1);

    const game = {
      leagueId: leagueId,
      name: name,
      isFinished: false,
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

    if (!game.editableBy(this.userId)) {
      throw new Meteor.Error('api.games.updateText.accessDenied',
        'Cannot edit games in a private league that is not yours');
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
    if (!game.editableBy(this.userId)) {
      throw new Meteor.Error('api.games.remove.accessDenied',
        'Cannot remove games in a private league that is not yours');
    }
    Games.remove(gameId);
  },
});

// Get list of all method names on Games
const GAMES_METHODS = _.pluck([
  insert,
  updateName,
  remove,
], 'name');

if (Meteor.isServer) {
  // Only allow 5 game operations per connection per second
  DDPRateLimiter.addRule({
    name(name) {
      return _.contains(GAMES_METHODS, name);
    },

    // Rate limit per connection ID
    connectionId() { return true; },
  }, 5, 1000);
}