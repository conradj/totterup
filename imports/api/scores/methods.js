import { Meteor } from 'meteor/meteor';
import { _ } from 'meteor/underscore';
import { ValidatedMethod } from 'meteor/mdg:validated-method';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';
import { DDPRateLimiter } from 'meteor/ddp-rate-limiter';
import { Scores } from './scores.js';
import { Games } from '../games/games.js';
import { Leagues } from '../leagues/leagues.js';

export const insert = new ValidatedMethod({
  name: 'scores.insert',
  validate: new SimpleSchema({
    gameId: { type: String },
    playerId: { type: String },
    score: { type: Number },
  }).validator(),
  run({ gameId, playerId, score }) {
    // const game = Games.findOne(gameId);

    // if (league.isPrivate() && league.userId !== this.userId) {
    //   throw new Meteor.Error('api.games.insert.accessDenied',
    //     'Cannot add games to a private league that is not yours');
    // }

    const newScore = {
      gameId,
      playerId,
      score,
      createdAt: new Date(),
    };
    
    return Scores.insert(newScore);
  },
});

export const updateScore = new ValidatedMethod({
  name: 'score.updateScore',
  validate: new SimpleSchema({
    scoreId: { type: String },
    newScore: { type: Number },
  }).validator(),
  run({ scoreId, newScore }) {
    // This is complex auth stuff - perhaps denormalizing a userId onto games
    // would be correct here?
    //const score = Score.findOne(scoreId);

    // if (!game.editableBy(this.userId)) {
    //   throw new Meteor.Error('api.games.updateText.accessDenied',
    //     'Cannot edit games in a private league that is not yours');
    // }

    Scores.update(scoreId, {
      $set: { score: newScore },
    });
  },
});

export const remove = new ValidatedMethod({
  name: 'score.remove',
  validate: new SimpleSchema({
    scoreId: { type: String },
  }).validator(),
  run({ scoreId }) {
    // const game = Games.findOne(gameId);

    // if (!game.editableBy(this.userId)) {
    //   throw new Meteor.Error('api.games.remove.accessDenied',
    //     'Cannot remove games in a private league that is not yours');
    // }

    Scores.remove(scoreId);
  },
});

// Get list of all method names on Scores
const SCORES_METHODS = _.pluck([
  insert,
  updateScore,
  remove,
], 'name');

if (Meteor.isServer) {
  // Only allow 5 score operations per connection per second
  DDPRateLimiter.addRule({
    name(name) {
      return _.contains(SCORES_METHODS, name);
    },

    // Rate limit per connection ID
    connectionId() { return true; },
  }, 5, 1000);
}