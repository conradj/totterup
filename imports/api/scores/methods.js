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
    leagueId: { type: String },
    gameId: { type: String },
    playerId: { type: String },
    score: { type: Number },
  }).validator(),
  run({ leagueId, gameId, playerId, score }) {
    const league = Leagues.findOne(leagueId);
    
    if (!league.editableBy()) {
      throw new Meteor.Error('api.score.insertScore.accessDenied',
        'Cannot insert score in a league that is not yours');
    }

    const newScore = {
      leagueId,
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
    
    const score = Scores.findOne(scoreId);
    
    if (!score.editableBy()) {
      throw new Meteor.Error('api.score.updateScore.accessDenied',
        'Cannot edit score in a league that is not yours');
    }

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
    const score = Score.findOne(scoreId);
    
    if (!score.editableBy()) {
      throw new Meteor.Error('api.games.remove.accessDenied',
        'Cannot remove scores in a league that is not yours');
    }

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
  // Only allow 50 score operations per connection per second
  DDPRateLimiter.addRule({
    name(name) {
      return _.contains(SCORES_METHODS, name);
    },

    // Rate limit per connection ID
    connectionId() { return true; },
  }, 50, 1000);
}