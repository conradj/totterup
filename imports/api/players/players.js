import { Mongo } from "meteor/mongo";
import { Factory } from "meteor/factory";
import faker from "faker";
import { SimpleSchema } from "meteor/aldeed:simple-schema";

import { Leagues } from "../leagues/leagues.js";
import { Scores } from "../scores/scores.js";

class PlayersCollection extends Mongo.Collection {
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
    const players = this.find(selector).fetch();
    const result = super.remove(selector);
    return result;
  }
}

export const Players = new PlayersCollection("Players");

// Deny all client-side updates since we will be using methods to manage this collection
Players.deny({
  insert() {
    return true;
  },
  update() {
    return true;
  },
  remove() {
    return true;
  }
});

Players.schema = new SimpleSchema({
  leagueId: {
    type: String,
    regEx: SimpleSchema.RegEx.Id,
    denyUpdate: true
  },
  text: {
    type: String,
    max: 100
  },
  createdAt: {
    type: Date,
    denyUpdate: true
  },
  checked: {
    type: Boolean,
    defaultValue: false
  },
  avatar: {
    type: String,
    optional: true,
    max: 2048
  },
  userId: {
    type: String,
    regEx: SimpleSchema.RegEx.Id,
    optional: true
  }
});

Players.attachSchema(Players.schema);

// This represents the keys from Leagues objects that should be published
// to the client. If we add secret properties to league objects, don't list
// them here to keep them private to the server.
Players.publicFields = {
  leagueId: 1,
  text: 1,
  createdAt: 1,
  checked: 1,
  avatar: 1,
  userId: 1
};

// TODO This factory has a name - do we have a code style for this?
//   - usually I've used the singular, sometimes you have more than one though, like
//   'player', 'emptyPlayer', 'checkedPlayer'
Factory.define("player", Players, {
  leagueId: () => Factory.get("league"),
  text: () => faker.name.firstName(),
  createdAt: () => new Date()
});

Players.helpers({
  league() {
    return Leagues.findOne(this.leagueId);
  },
  editableBy() {
    return this.league().editableBy() || this.userId === Meteor.user()._id;
  },
  scores() {
    return Scores.find({ playerId: this._id }, { sort: { createdAt: -1 } });
  }
});
