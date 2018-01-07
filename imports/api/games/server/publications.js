/* eslint-disable prefer-arrow-callback */
import { Meteor } from "meteor/meteor";
import { SimpleSchema } from "meteor/aldeed:simple-schema";

import { Games } from "../games.js";
import { Leagues } from "../../leagues/leagues.js";

Meteor.publishComposite("games", function games() {
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
          return Games.find(
            {
              $or: [
                {
                  leagueId: { $in: user.ownedLeagues }
                },
                {
                  leagueId: { $in: user.inLeagues }
                }
              ]
            },
            { fields: Games.publicFields }
          );
        }
      }
    ]
  };
});
