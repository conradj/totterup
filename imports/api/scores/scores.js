import { Mongo } from 'meteor/mongo';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';
import { Factory } from 'meteor/factory';
import faker from 'faker';
import { Leagues } from '../leagues/leagues.js';
import { Games } from '../games/games.js';
import { Players } from '../players/players.js';

class ScoresCollection extends Mongo.Collection {
  insert(doc, callback) {
    const ourDoc = doc;
    ourDoc.createdAt = ourDoc.createdAt || new Date();
    const result = super.insert(ourDoc, callback);
    return result;
  }
  update(selector, modifier) {
    const result = super.update(selector, modifier);
    return result;
  }
  remove(selector) {
    const scores = this.find(selector).fetch();
    const result = super.remove(selector);
    return result;
  }
}

export const Scores = new ScoresCollection('Scores');

// Deny all client-side updates since we will be using methods to manage this collection
Scores.deny({
  insert() { return true; },
  update() { return true; },
  remove() { return true; },
});

Scores.schema = new SimpleSchema({
  leagueId: {
    type: String,
    regEx: SimpleSchema.RegEx.Id,
    denyUpdate: true,
  },
  gameId: {
    type: String,
    regEx: SimpleSchema.RegEx.Id,
    denyUpdate: true,
  },
  playerId: {
    type: String,
    regEx: SimpleSchema.RegEx.Id,
    denyUpdate: true,
  },
  score: {
    type: Number,
    defaultValue: 0
  },
  createdAt: {
    type: Date,
    denyUpdate: true,
  },
});

Scores.attachSchema(Scores.schema);

// This represents the keys from Scores objects that should be published
// to the client. If we add secret properties to scores objects, don't list
// them here to keep them private to the server.
Scores.publicFields = {
  leagueId: 1,
  gameId: 1,
  playerId: 1,
  score: 1,
  createdAt: 1,
};

// TODO This factory has a name - do we have a code style for this?
//   - usually I've used the singular, sometimes you have more than one though, like
//   'game', 'emptyGame', 'checkedGame'
Factory.define('score', Scores, {
  leagueId: () => Factory.get('league'),
  gameId: () => Factory.get('game'),
  playerId: () => Factory.get('player'),
  score: () => 99999,
  createdAt: () => new Date(),
});

Scores.helpers({
  editableBy() {
    return this.league().editableBy();
  },
  league() {
    return Leagues.findOne(this.leagueId);
  },
  game() {
    return Games.findOne(this.gameId);
  },
  player() {
    return Players.findOne(this.playerId);
  },
});