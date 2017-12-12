import { Meteor } from "meteor/meteor";
import { _ } from "meteor/underscore";
import { ValidatedMethod } from "meteor/mdg:validated-method";
import { SimpleSchema } from "meteor/aldeed:simple-schema";
import { DDPRateLimiter } from "meteor/ddp-rate-limiter";

import { Players } from "./players.js";
import { Leagues } from "../leagues/leagues.js";

export const insert = new ValidatedMethod({
  name: "players.insert",
  validate: new SimpleSchema({
    leagueId: { type: String },
    text: { type: String },
    userId: { type: String, optional: true }
  }).validator(),
  run({ leagueId, text, userId }) {
    const league = Leagues.findOne(leagueId);
    const addingAsInvite = (userId && userId === this.userId) || false;

    if (!addingAsInvite && !league.editableBy()) {
      throw new Meteor.Error(
        "api.players.insert.accessDenied",
        "Cannot add players to league that is not yours"
      );
    }
    let player = {
      leagueId,
      text,
      checked: false,
      createdAt: new Date()
    };
    if (addingAsInvite) {
      Meteor.users.update(this.userId, {
        $addToSet: {
          inLeagues: leagueId
        }
      });
      // only add 1 player with that user Id to the league
      const existingPlayerIdForUser = Players.findOne(
        {
          userId: userId,
          leagueId: leagueId
        },
        { fields: { _id: 1 } }
      );
      if (existingPlayerIdForUser) {
        return existingPlayerIdForUser;
      }
      player.userId = this.userId;
    }
    return Players.insert(player);
  }
});

export const updateName = new ValidatedMethod({
  name: "players.updateName",
  validate: new SimpleSchema({
    playerId: { type: String },
    newName: { type: String }
  }).validator(),
  run({ playerId, newName }) {
    // This is complex auth stuff - perhaps denormalizing a userId onto players
    // would be correct here?
    const player = Players.findOne(playerId);

    if (!player.editableBy()) {
      throw new Meteor.Error(
        "api.players.updateName.accessDenied",
        "Cannot edit players in league that is not yours"
      );
    }

    Players.update(playerId, {
      $set: { text: newName }
    });
  }
});

export const updateAvatar = new ValidatedMethod({
  name: "players.updateAvatar",
  validate: new SimpleSchema({
    playerId: { type: String },
    newAvatar: { type: String }
  }).validator(),
  run({ playerId, newAvatar }) {
    // This is complex auth stuff - perhaps denormalizing a userId onto players
    // would be correct here?
    const player = Players.findOne(playerId);

    if (!player.editableBy()) {
      throw new Meteor.Error(
        "api.players.updateAvatar.accessDenied",
        "Cannot edit players in a league that is not yours"
      );
    }

    Players.update(playerId, {
      $set: { avatar: newAvatar }
    });
  }
});

export const updateUserId = new ValidatedMethod({
  name: "players.updateUserId",
  validate: new SimpleSchema({
    playerId: { type: String },
    userId: { type: String }
  }).validator(),
  run({ playerId, userId }) {
    const player = Players.findOne(playerId);

    if (!player.editableBy()) {
      throw new Meteor.Error(
        "api.players.updateUserId.accessDenied",
        "Cannot edit players in a league that is not yours"
      );
    }

    Players.update(playerId, {
      $set: { userId: userId }
    });

    Meteor.users.update(userId, {
      $addToSet: {
        inLeagues: player.leagueId
      }
    });
  }
});

export const remove = new ValidatedMethod({
  name: "players.remove",
  validate: new SimpleSchema({
    playerId: { type: String }
  }).validator(),
  run({ playerId }) {
    const player = Players.findOne(playerId);

    if (!player.editableBy()) {
      throw new Meteor.Error(
        "api.players.remove.accessDenied",
        "Cannot remove players in a league that is not yours"
      );
    }

    if (player.userId) {
      Meteor.users.update(this.userId, {
        $pull: {
          inLeagues: player.leagueId
        }
      });
    }

    Players.remove(playerId);
  }
});

// Get list of all method names on Players
const PLAYERS_METHODS = _.pluck([insert, updateName, remove], "name");

if (Meteor.isServer) {
  // Only allow 5 player operations per connection per second
  DDPRateLimiter.addRule(
    {
      name(name) {
        return _.contains(PLAYERS_METHODS, name);
      },

      // Rate limit per connection ID
      connectionId() {
        return true;
      }
    },
    5,
    1000
  );
}
