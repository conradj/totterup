/* eslint-disable prefer-arrow-callback */

import { Meteor } from 'meteor/meteor';

import { Leagues } from '../leagues.js';

Meteor.publish('leagues.public', function leaguesPublic() {
  return Leagues.find({
    userId: { $exists: false },
  }, {
    fields: Leagues.publicFields,
  });
});

Meteor.publish('leagues.private', function leaguesPrivate() {
  if (!this.userId) {
    return this.ready();
  }

  return Leagues.find({
    userId: this.userId,
  }, {
    fields: Leagues.publicFields,
  });
});
