import { Mongo } from 'meteor/mongo';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';
import { Factory } from 'meteor/factory';
import i18n from 'meteor/universe:i18n';
import { Players } from '../players/players.js';
import { Games } from '../games/games.js';
import { Scores } from '../scores/scores.js';

class LeaguesCollection extends Mongo.Collection {
  insert(league, callback, locale = 'en') {
    const ourLeague = league;
    if (!ourLeague.name) {
      const defaultName = i18n.__(
        'api.leagues.insert.league',
        null,
        { _locale: locale }
      );
      let nextLetter = 'A';
      ourLeague.name = `${defaultName} ${nextLetter}`;

      while (this.findOne({ name: ourLeague.name })) {
        // not going to be too smart here, can go past Z
        nextLetter = String.fromCharCode(nextLetter.charCodeAt(0) + 1);
        ourLeague.name = `${defaultName} ${nextLetter}`;
      }
    }

    return super.insert(ourLeague, callback);
  }
  remove(selector, callback) {
    Players.remove({ leagueId: selector });
    return super.remove(selector, callback);
  }
}

export const Leagues = new LeaguesCollection('Leagues');

// Deny all client-side updates since we will be using methods to manage this collection
Leagues.deny({
  insert() { return true; },
  update() { return true; },
  remove() { return true; },
});

Leagues.schema = new SimpleSchema({
  name: {
    type: String,
    max: 100,
  }
});

Leagues.attachSchema(Leagues.schema);

// This represents the keys from Leagues objects that should be published
// to the client. If we add secret properties to league objects, don't list
// them here to keep them private to the server.
Leagues.publicFields = {
  name: 1,
};

Factory.define('league', Leagues, {});

Leagues.helpers({
  editableBy() {
    if(Meteor.user()) {
      return Meteor.user().ownedLeagues.includes(this._id);
    }
    return false;
  },
  players() {
    return Players.find({ leagueId: this._id }, { sort: { createdAt: -1 } });
  },
  games() {
    return Games.find({ leagueId: this._id }, { sort: { createdAt: -1 } });
  },
  scores() {
    return Scores.find({ leagueId: this._id }, { sort: { createdAt: -1 } });
  },
});
