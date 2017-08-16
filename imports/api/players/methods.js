import { Meteor } from 'meteor/meteor';
import { _ } from 'meteor/underscore';
import { ValidatedMethod } from 'meteor/mdg:validated-method';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';
import { DDPRateLimiter } from 'meteor/ddp-rate-limiter';

import { Players } from './players.js';
import { Leagues } from '../leagues/leagues.js';

export const insert = new ValidatedMethod({
  name: 'players.insert',
  validate: new SimpleSchema({
    leagueId: { type: String },
    text: { type: String },
  }).validator(),
  run({ leagueId, text }) {
    const league = Leagues.findOne(leagueId);

    if (league.isPrivate() && league.userId !== this.userId) {
      throw new Meteor.Error('api.players.insert.accessDenied',
        'Cannot add players to a private league that is not yours');
    }

    const player = {
      leagueId,
      text,
      checked: false,
      createdAt: new Date(),
    };

    Players.insert(player);
  },
});

export const setCheckedStatus = new ValidatedMethod({
  name: 'players.makeChecked',
  validate: new SimpleSchema({
    playerId: { type: String },
    newCheckedStatus: { type: Boolean },
  }).validator(),
  run({ playerId, newCheckedStatus }) {
    const player = Players.findOne(playerId);

    if (player.checked === newCheckedStatus) {
      // The status is already what we want, let's not do any extra work
      return;
    }

    if (!player.editableBy(this.userId)) {
      throw new Meteor.Error('api.players.setCheckedStatus.accessDenied',
        'Cannot edit checked status in a private league that is not yours');
    }

    Players.update(playerId, { $set: {
      checked: newCheckedStatus,
    } });
  },
});

export const updateText = new ValidatedMethod({
  name: 'players.updateText',
  validate: new SimpleSchema({
    playerId: { type: String },
    newText: { type: String },
  }).validator(),
  run({ playerId, newText }) {
    // This is complex auth stuff - perhaps denormalizing a userId onto players
    // would be correct here?
    const player = Players.findOne(playerId);

    if (!player.editableBy(this.userId)) {
      throw new Meteor.Error('api.players.updateText.accessDenied',
        'Cannot edit players in a private league that is not yours');
    }

    Players.update(playerId, {
      $set: { text: newText },
    });
  },
});

export const remove = new ValidatedMethod({
  name: 'players.remove',
  validate: new SimpleSchema({
    playerId: { type: String },
  }).validator(),
  run({ playerId }) {
    const player = Players.findOne(playerId);

    if (!player.editableBy(this.userId)) {
      throw new Meteor.Error('api.players.remove.accessDenied',
        'Cannot remove players in a private league that is not yours');
    }

    Players.remove(playerId);
  },
});

// Get list of all method names on Players
const PLAYERS_METHODS = _.pluck([
  insert,
  setCheckedStatus,
  updateText,
  remove,
], 'name');

if (Meteor.isServer) {
  // Only allow 5 player operations per connection per second
  DDPRateLimiter.addRule({
    name(name) {
      return _.contains(PLAYERS_METHODS, name);
    },

    // Rate limit per connection ID
    connectionId() { return true; },
  }, 5, 1000);
}
