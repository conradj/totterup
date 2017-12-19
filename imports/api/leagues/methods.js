import { Meteor } from "meteor/meteor";
import { ValidatedMethod } from "meteor/mdg:validated-method";
import { SimpleSchema } from "meteor/aldeed:simple-schema";
import { DDPRateLimiter } from "meteor/ddp-rate-limiter";
import { _ } from "meteor/underscore";

import { Leagues } from "./leagues.js";
import { insert as insertPlayer } from "../players/methods.js";

const LEAGUE_ID_ONLY = new SimpleSchema({
  leagueId: { type: String }
}).validator();

export const insert = new ValidatedMethod({
  name: "leagues.insert",
  validate: new SimpleSchema({
    locale: {
      type: String
    }
  }).validator(),
  run({ locale }) {
    if (!this.userId) {
      throw new Meteor.Error(
        "api.leagues.insert.notLoggedIn",
        "Must be logged in to make leagues."
      );
    }

    const inviteCode = generateUniqueInviteCode();

    const newLeagueId = Leagues.insert(
      { inviteCode: inviteCode },
      null,
      locale,
      this.userId
    );

    Meteor.users.update(this.userId, {
      $addToSet: {
        ownedLeagues: newLeagueId
      }
    });
    return newLeagueId;
  }
});

function generateUniqueInviteCode() {
  let inviteCode = "000000".replace(/0/g, function() {
    return (~~(Math.random() * 16)).toString(16);
  });

  if (Leagues.find({ inviteCode: inviteCode }).count() > 0) {
    console.log("generateUniqueInviteCode found a live one!", inviteCode);
    inviteCode = generateUniqueInviteCode();
  }

  return inviteCode;
}

export const makePrivate = new ValidatedMethod({
  name: "leagues.makePrivate",
  validate: LEAGUE_ID_ONLY,
  run({ leagueId }) {
    const league = Leagues.findOne(leagueId);
    if (!league.editableBy()) {
      throw new Meteor.Error(
        "api.leagues.makePrivate.notAuthorised",
        "Must be a league owner to make a league private."
      );
    }

    throw new Meteor.Error(
      "api.leagues.makePrivate.notSupported",
      "Make a league private not currently supported"
    );
  }
});

export const makePublic = new ValidatedMethod({
  name: "leagues.makePublic",
  validate: LEAGUE_ID_ONLY,
  run({ leagueId }) {
    const league = Leagues.findOne(leagueId);

    if (!league.editableBy()) {
      throw new Meteor.Error(
        "api.leagues.makePublic.accessDenied",
        "You don't have permission to edit this league."
      );
    }

    throw new Meteor.Error(
      "api.leagues.makePrivate.notSupported",
      "Make a league public not currently supported"
    );

    // XXX the security check above is not atomic, so in theory a race condition could
    // result in exposing private data
  }
});

export const updateName = new ValidatedMethod({
  name: "leagues.updateName",
  validate: new SimpleSchema({
    leagueId: { type: String },
    newName: { type: String }
  }).validator(),
  run({ leagueId, newName }) {
    const league = Leagues.findOne(leagueId);

    if (!league.editableBy()) {
      throw new Meteor.Error(
        "api.leagues.updateName.accessDenied",
        "You don't have permission to edit this league."
      );
    }

    // XXX the security check above is not atomic, so in theory a race condition could
    // result in exposing private data

    Leagues.update(leagueId, {
      $set: { name: newName }
    });
  }
});

export const remove = new ValidatedMethod({
  name: "leagues.remove",
  validate: LEAGUE_ID_ONLY,
  run({ leagueId }) {
    const league = Leagues.findOne(leagueId);

    if (!league.editableBy()) {
      throw new Meteor.Error(
        "api.leagues.remove.accessDenied",
        "You don't have permission to remove this league."
      );
    }

    // XXX the security check above is not atomic, so in theory a race condition could
    // result in exposing private data
    Meteor.users.update(this.userId, {
      $pull: {
        ownedLeagues: leagueId
      }
    });

    Leagues.remove(leagueId);
  }
});

export const useInvite = new ValidatedMethod({
  name: "leagues.useInvite",
  validate(args) {
    new SimpleSchema({
      inviteCode: { type: String }
    }).validate(args);
  },
  run({ inviteCode }) {
    const league = Leagues.findOne({ inviteCode: inviteCode });

    if (league) {
      const playerId = insertPlayer.call({
        leagueId: league._id,
        text: "Your league nickname",
        userId: this.userId
      });
      return { inviteValid: true, leagueId: league._id, playerId: playerId };
    } else {
      return { inviteValid: false };
    }
  }
});

export const resetInviteCode = new ValidatedMethod({
  name: "leagues.resetInviteCode",
  validate(args) {
    new SimpleSchema({
      leagueId: { type: String }
    }).validate(args);
  },
  run({ leagueId }) {
    const league = Leagues.findOne(leagueId);

    if (!league.editableBy()) {
      throw new Meteor.Error(
        "api.leagues.resetInviteCode.accessDenied",
        "You don't have permission to edit this league."
      );
    }

    // XXX the security check above is not atomic, so in theory a race condition could
    // result in exposing private data
    if(Meteor.isServer) {
      Leagues.update(leagueId, {
        $set: { inviteCode: generateUniqueInviteCode() }
      });
    }
  }
});

// Get list of all method names on Leagues
const LEAGUES_METHODS = _.pluck(
  [
    insert,
    makePublic,
    makePrivate,
    updateName,
    remove,
    useInvite,
    resetInviteCode
  ],
  "name"
);

if (Meteor.isServer) {
  // Only allow 5 league operations per connection per second
  DDPRateLimiter.addRule(
    {
      name(name) {
        return _.contains(LEAGUES_METHODS, name);
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
