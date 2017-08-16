// This file will be auto-imported in the app-test context, ensuring the method is always available

import { Meteor } from 'meteor/meteor';
import { Factory } from 'meteor/factory';
import { resetDatabase } from 'meteor/xolvio:cleaner';
import { Random } from 'meteor/random';
import { Promise } from 'meteor/promise';
import { _ } from 'meteor/underscore';

const createLeague = (userId) => {
  const league = Factory.create('league', { userId });
  _.times(3, () => Factory.create('player', { leagueId: league._id }));
  return league;
};

Meteor.methods({
  generateFixtures() {
    resetDatabase();

    // create 3 public leagues
    _.times(3, () => createLeague());

    // create 3 private leagues
    _.times(3, () => createLeague(Random.id()));
  },
});

let generateData;
if (Meteor.isClient) {
  // Create a second connection to the server to use to call test data methods
  // We do this so there's no contention w/ the currently tested user's connection
  const testConnection = Meteor.connect(Meteor.absoluteUrl());

  generateData = Promise.denodeify((cb) => {
    testConnection.call('generateFixtures', cb);
  });
}

const generateDataExport = generateData;

export { generateDataExport };
