/* eslint-disable prefer-arrow-callback */

import { Meteor } from "meteor/meteor";

import { Leagues } from "../leagues.js";

Meteor.publishComposite("leagues.owned", function leaguesPublic() {
  const userId = this.userId;

  return {
    find() {
      return Meteor.users.find(
        { _id: userId },
        { fields: { ownedLeagues: 1 } }
      );
    },
    children: [
      {
        find(user) {
          return Leagues.find({
            _id: { $in: user.ownedLeagues }
          });
        }
      }
    ]
  };
});

Meteor.publishComposite("leagues.in", function leaguesIn() {
  const userId = this.userId;

  return {
    find() {
      return Meteor.users.find({ _id: userId }, { fields: { inLeagues: 1 } });
    },
    children: [
      {
        find(user) {
          return Leagues.find({
            _id: { $in: user.inLeagues }
          });
        }
      }
    ]
  };
});
