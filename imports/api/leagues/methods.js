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
    if (!this.userId) {
      throw new Meteor.Error('api.leagues.insert.notLoggedIn',
        'Must be logged in to make leagues.');
    }

    const newLeagueId = Leagues.insert({}, null, locale, this.userId);

    Meteor.users.update(this.userId, {
      $addToSet: {
        ownedLeagues: newLeagueId
      }
    });
    return newLeagueId;
  },
});

export const makePrivate = new ValidatedMethod({
  name: 'leagues.makePrivate',
  validate: LEAGUE_ID_ONLY,
  run({ leagueId }) {
    const league = Leagues.findOne(leagueId);
    if (!league.editableBy()) {
      throw new Meteor.Error('api.leagues.makePrivate.notAuthorised',
        'Must be a league owner to make a league private.');
    }

    throw new Meteor.Error('api.leagues.makePrivate.notSupported',
      'Make a league private not currently supported');
  },
});

export const makePublic = new ValidatedMethod({
  name: 'leagues.makePublic',
  validate: LEAGUE_ID_ONLY,
  run({ leagueId }) {
    const league = Leagues.findOne(leagueId);

    if (!league.editableBy()) {
      throw new Meteor.Error('api.leagues.makePublic.accessDenied',
        'You don\'t have permission to edit this league.');
    }

    throw new Meteor.Error('api.leagues.makePrivate.notSupported',
      'Make a league public not currently supported');

    // XXX the security check above is not atomic, so in theory a race condition could
    // result in exposing private data
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

    if (!league.editableBy()) {
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

    if (!league.editableBy()) {
      throw new Meteor.Error('api.leagues.remove.accessDenied',
        'You don\'t have permission to remove this league.');
    }

    // XXX the security check above is not atomic, so in theory a race condition could
    // result in exposing private data
    Meteor.users.update(this.userId, {
      $pull: {
        ownedLeagues: leagueId
      }
    });

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
