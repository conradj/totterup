/* eslint-env mocha */

import { Factory } from 'meteor/factory';
import { PublicationCollector } from 'meteor/publication-collector';
import { chai, assert } from 'meteor/practicalmeteor:chai';
import { Random } from 'meteor/random';
import { Meteor } from 'meteor/meteor';
import { _ } from 'meteor/underscore';
import { DDP } from 'meteor/ddp-client';

import { Leagues } from './leagues.js';
import { insert, makePublic, makePrivate, updateName, remove } from './methods.js';
import { Players } from '../players/players.js';
import '../../../i18n/en.i18n.json';

if (Meteor.isServer) {
  // eslint-disable-next-line import/no-unresolved
  import './server/publications.js';

  describe('leagues', () => {
    describe('mutators', () => {
      it('builds correctly from factory', () => {
        const league = Factory.create('league');
        assert.typeOf(league, 'object');
        assert.match(league.name, /League /);
      });
    });

    describe('publications', () => {
      const userId = Random.id();

      // TODO -- make a `leagueWithPlayers` factory
      const createLeague = (props = {}) => {
        const league = Factory.create('league', props);
        _.times(3, () => {
          Factory.create('player', { leagueId: league._id });
        });
      };

      before(() => {
        Leagues.remove({});
        _.times(3, () => createLeague());
        _.times(2, () => createLeague({ userId }));
        _.times(2, () => createLeague({ userId: Random.id() }));
      });


      describe('leagues.public', () => {
        it('sends all public leagues', (done) => {
          const collector = new PublicationCollector();
          collector.collect('leagues.public', (collections) => {
            chai.assert.equal(collections.Leagues.length, 3);
            done();
          });
        });
      });

      describe('leagues.private', () => {
        it('sends all owned leagues', (done) => {
          const collector = new PublicationCollector({ userId });
          collector.collect('leagues.private', (collections) => {
            chai.assert.equal(collections.Leagues.length, 2);
            done();
          });
        });
      });
    });

    describe('methods', () => {
      let leagueId;
      let playerId;
      let otherLeagueId;
      let userId;

      beforeEach(() => {
        // Clear
        Leagues.remove({});
        Players.remove({});

        // Create a league and a player in that league
        leagueId = Factory.create('league')._id;
        playerId = Factory.create('player', { leagueId })._id;

        // Create throwaway league, since the last public league can't be made private
        otherLeagueId = Factory.create('league')._id;

        // Generate a 'user'
        userId = Random.id();
      });

      describe('makePrivate / makePublic', () => {
        function assertLeagueAndPlayerArePrivate() {
          assert.equal(Leagues.findOne(leagueId).userId, userId);
          assert.isTrue(Leagues.findOne(leagueId).isPrivate());
          assert.isTrue(Players.findOne(playerId).editableBy(userId));
          assert.isFalse(Players.findOne(playerId).editableBy(Random.id()));
        }

        it('makes a league private and updates the players', () => {
          // Check initial state is public
          assert.isFalse(Leagues.findOne(leagueId).isPrivate());

          // Set up method arguments and context
          const methodInvocation = { userId };
          const args = { leagueId };

          // Making the league private adds userId to the player
          makePrivate._execute(methodInvocation, args);
          assertLeagueAndPlayerArePrivate();

          // Making the league public removes it
          makePublic._execute(methodInvocation, args);
          assert.isUndefined(Players.findOne(playerId).userId);
          assert.isTrue(Players.findOne(playerId).editableBy(userId));
        });

        it('only works if you are logged in', () => {
          // Set up method arguments and context
          const methodInvocation = { };
          const args = { leagueId };

          assert.throws(() => {
            makePrivate._execute(methodInvocation, args);
          }, Meteor.Error, /leagues.makePrivate.notLoggedIn/);

          assert.throws(() => {
            makePublic._execute(methodInvocation, args);
          }, Meteor.Error, /leagues.makePublic.notLoggedIn/);
        });

        it('only works if it\'s not the last public league', () => {
          // Remove other league, now we're the last public league
          Leagues.remove(otherLeagueId);

          // Set up method arguments and context
          const methodInvocation = { userId };
          const args = { leagueId };

          assert.throws(() => {
            makePrivate._execute(methodInvocation, args);
          }, Meteor.Error, /leagues.makePrivate.lastPublicLeague/);
        });

        it('only makes the league public if you made it private', () => {
          // Set up method arguments and context
          const methodInvocation = { userId };
          const args = { leagueId };

          makePrivate._execute(methodInvocation, args);

          const otherUserMethodInvocation = { userId: Random.id() };

          // Shouldn't do anything
          assert.throws(() => {
            makePublic._execute(otherUserMethodInvocation, args);
          }, Meteor.Error, /leagues.makePublic.accessDenied/);

          // Make sure things are still private
          assertLeagueAndPlayerArePrivate();
        });
      });

      describe('updateName', () => {
        it('changes the name, but not if you don\'t have permission', () => {
          updateName._execute({}, {
            leagueId,
            newName: 'new name',
          });

          assert.equal(Leagues.findOne(leagueId).name, 'new name');

          // Make the league private
          makePrivate._execute({ userId }, { leagueId });

          // Works if the owner changes the name
          updateName._execute({ userId }, {
            leagueId,
            newName: 'new name 2',
          });

          assert.equal(League.findOne(leagueId).name, 'new name 2');

          // Throws if another user, or logged out user, tries to change the name
          assert.throws(() => {
            updateName._execute({ userId: Random.id() }, {
              leagueId,
              newName: 'new name 3',
            });
          }, Meteor.Error, /leagues.updateName.accessDenied/);

          assert.throws(() => {
            updateName._execute({}, {
              leagueId,
              newName: 'new name 3',
            });
          }, Meteor.Error, /leagues.updateName.accessDenied/);

          // Confirm name didn't change
          assert.equal(Leagues.findOne(leagueId).name, 'new name 2');
        });
      });

      describe('remove', () => {
        it('does not delete the last public league', () => {
          const methodInvocation = { userId };

          // Works fine
          remove._execute(methodInvocation, { leagueId: otherLeagueId });

          // Should throw because it is the last public league
          assert.throws(() => {
            remove._execute(methodInvocation, { leagueId });
          }, Meteor.Error, /leagues.remove.lastPublicLeague/);
        });

        it('does not delete a private league you don\'t own', () => {
          // Make the league private
          makePrivate._execute({ userId }, { leagueId });

          // Throws if another user, or logged out user, tries to delete the league
          assert.throws(() => {
            remove._execute({ userId: Random.id() }, { leagueId });
          }, Meteor.Error, /leagues.remove.accessDenied/);

          assert.throws(() => {
            remove._execute({}, { leagueId });
          }, Meteor.Error, /leagues.remove.accessDenied/);
        });
      });

      describe('rate limiting', () => {
        it('does not allow more than 5 operations rapidly', () => {
          const connection = DDP.connect(Meteor.absoluteUrl());

          _.times(5, () => {
            connection.call(insert.name, { locale: 'en' });
          });

          assert.throws(() => {
            connection.call(insert.name, {});
          }, Meteor.Error, /too-many-requests/);

          connection.disconnect();
        });
      });
    });
  });
}
