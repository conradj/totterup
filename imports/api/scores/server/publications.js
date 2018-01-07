/* eslint-disable prefer-arrow-callback */

import { Meteor } from "meteor/meteor";
import { SimpleSchema } from "meteor/aldeed:simple-schema";

import { Scores } from "../scores.js";
import { Leagues } from "../../leagues/leagues.js";
import { Players } from "../../players/players.js";
import { Games } from "../../games/games.js";

Meteor.publishComposite("scores", function games() {
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
          return Scores.find(
            { leagueId: { $in: user.ownedLeagues.concat(user.inLeagues) } },
            { fields: Scores.publicFields }
          );
        }
      }
    ]
  };
});
