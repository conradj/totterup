import { Meteor } from 'meteor/meteor';
import { ValidatedMethod } from 'meteor/mdg:validated-method';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';
import { DDPRateLimiter } from 'meteor/ddp-rate-limiter';
import { _ } from 'meteor/underscore';

import { Leagues } from './leagues.js';

const LEAGUE_ID_ONLY = new SimpleSchema({
  leagueId: { type: String },
}).validator();

export const insert = new ValidatedMethod({
  name: 'leagues.insert',
  validate: new SimpleSchema({
    locale: {
      type: String,
    },
  }).validator(),
  run({ locale }) {
    return Leagues.insert({}, null, locale);
  },
});

export const makePrivate = new ValidatedMethod({
  name: 'leagues.makePrivate',
  validate: LEAGUE_ID_ONLY,
  run({ leagueId }) {
    if (!this.userId) {
      throw new Meteor.Error('api.leagues.makePrivate.notLoggedIn',
        'Must be logged in to make private leagues.');
    }

    const league = Leagues.findOne(leagueId);

    if (league.isLastPublicLeague()) {
      throw new Meteor.Error('api.leagues.makePrivate.lastPublicLeague',
        'Cannot make the last public league private.');
    }

    Leagues.update(leagueId, {
      $set: { userId: this.userId },
    });
  },
});

export const makePublic = new ValidatedMethod({
  name: 'leagues.makePublic',
  validate: LEAGUE_ID_ONLY,
  run({ leagueId }) {
    if (!this.userId) {
      throw new Meteor.Error('api.leagues.makePublic.notLoggedIn',
        'Must be logged in.');
    }

    const league = Leagues.findOne(leagueId);

    if (!league.editableBy(this.userId)) {
      throw new Meteor.Error('api.leagues.makePublic.accessDenied',
        'You don\'t have permission to edit this league.');
    }

    // XXX the security check above is not atomic, so in theory a race condition could
    // result in exposing private data
    Leagues.update(leagueId, {
      $unset: { userId: true },
    });
  },
});

export const updateName = new ValidatedMethod({
  name: 'leagues.updateName',
  validate: new SimpleSchema({
    leagueId: { type: String },
    newName: { type: String },
  }).validator(),
  run({ leagueId, newName }) {
    const league = Leagues.findOne(leagueId);

    if (!league.editableBy(this.userId)) {
      throw new Meteor.Error('api.leagues.updateName.accessDenied',
        'You don\'t have permission to edit this league.');
    }

    // XXX the security check above is not atomic, so in theory a race condition could
    // result in exposing private data

    Leagues.update(leagueId, {
      $set: { name: newName },
    });
  },
});

export const remove = new ValidatedMethod({
  name: 'leagues.remove',
  validate: LEAGUE_ID_ONLY,
  run({ leagueId }) {
    const league = Leagues.findOne(leagueId);

    if (!league.editableBy(this.userId)) {
      throw new Meteor.Error('api.leagues.remove.accessDenied',
        'You don\'t have permission to remove this league.');
    }

    // XXX the security check above is not atomic, so in theory a race condition could
    // result in exposing private data

    if (league.isLastPublicLeague()) {
      throw new Meteor.Error('api.leagues.remove.lastPublicLeague',
        'Cannot delete the last public league.');
    }

    Leagues.remove(leagueId);
  },
});

// Get list of all method names on Leagues
const LEAGUES_METHODS = _.pluck([
  insert,
  makePublic,
  makePrivate,
  updateName,
  remove,
], 'name');

if (Meteor.isServer) {
  // Only allow 5 league operations per connection per second
  DDPRateLimiter.addRule({
    name(name) {
      return _.contains(LEAGUES_METHODS, name);
    },

    // Rate limit per connection ID
    connectionId() { return true; },
  }, 5, 1000);
}
