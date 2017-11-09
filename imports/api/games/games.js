import { Mongo } from 'meteor/mongo';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';
import { Factory } from 'meteor/factory';
import faker from 'faker';
import { Leagues } from '../leagues/leagues.js';
import { Scores } from '../scores/scores.js';
import { Players } from '../players/players.js';

class GamesCollection extends Mongo.Collection {
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
    const games = this.find(selector).fetch();
    const result = super.remove(selector);
    return result;
  }
}

export const Games = new GamesCollection('Games');

// Deny all client-side updates since we will be using methods to manage this collection
Games.deny({
  insert() { return true; },
  update() { return true; },
  remove() { return true; },
});

Games.schema = new SimpleSchema({
  leagueId: {
    type: String,
    regEx: SimpleSchema.RegEx.Id,
    denyUpdate: true,
  },
  name: {
    type: String,
    max: 100,
  },
  isFinished: {
    type: Boolean,
    defaultValue: false,
  },
  createdAt: {
    type: Date,
    denyUpdate: true,
  },
});

Games.attachSchema(Games.schema);

// This represents the keys from Leagues objects that should be published
// to the client. If we add secret properties to league objects, don't list
// them here to keep them private to the server.
Games.publicFields = {
  leagueId: 1,
  name: 1,
  isFinished: 1,
  createdAt: 1,
};

// TODO This factory has a name - do we have a code style for this?
//   - usually I've used the singular, sometimes you have more than one though, like
//   'game', 'emptyGame', 'checkedGame'
Factory.define('game', Games, {
  leagueId: () => Factory.get('league'),
  text: () => faker.name.firstName(),
  createdAt: () => new Date(),
});

Games.helpers({
  editableBy(userId) {
    // TODO, make sure user is a player in the league
    return true;
  },
  league() {
    return Leagues.findOne(this.leagueId);
  },
  scores() {
    return Scores.find({ gameId: this._id }, { sort: { createdAt: -1 } });
  },
  players() {
    return Players.find({leagueId: this.leagueId});
  }
});