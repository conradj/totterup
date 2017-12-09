/* eslint-disable prefer-arrow-callback */

import { Meteor } from "meteor/meteor";
import { SimpleSchema } from "meteor/aldeed:simple-schema";

import { Players } from "../players.js";
import { Leagues } from "../../leagues/leagues.js";

Meteor.publishComposite("players", function players() {
  const userId = this.userId;

  return {
    find() {
      return Meteor.users.find(
        { _id: userId },
        { fields: { ownedLeagues: 1, inLeagues: 1 } }
      );
    },
    children: [
      {
        find(user) {
          return Players.find(
            {
              $or: [
                {
                  leagueId: { $in: user.ownedLeagues }
                },
                {
                  userId: this.userId
                }
              ]
            },
            { fields: Players.publicFields }
          );
        }
      }
    ]
  };
});

Meteor.publish("playersInLeague", function(leagueId) {
  check(leagueId, String);
  return Players.find({ leagueId: leagueId }, { fields: Players.publicFields });
});
