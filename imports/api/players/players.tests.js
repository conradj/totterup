/* eslint-env mocha */

import { Meteor } from 'meteor/meteor';
import { Factory } from 'meteor/factory';
import { PublicationCollector } from 'meteor/publication-collector';
import { chai, assert } from 'meteor/practicalmeteor:chai';
import { Random } from 'meteor/random';
import { _ } from 'meteor/underscore';

import { Players } from './players.js';

if (Meteor.isServer) {
  // eslint-disable-next-line import/no-unresolved
  import './server/publications.js';

  describe('players', () => {
    describe('mutators', () => {
      it('builds correctly from factory', () => {
        const player = Factory.create('player');
        assert.typeOf(player, 'object');
        assert.typeOf(player.createdAt, 'date');
      });
    });

    it('leaves createdAt on update', () => {
      const createdAt = new Date(new Date() - 1000);
      let player = Factory.create('player', { createdAt });

      const text = 'some new text';
      Players.update(player, { $set: { text } });

      player = Players.findOne(player._id);
      assert.equal(player.text, text);
      assert.equal(player.createdAt.getTime(), createdAt.getTime());
    });

    describe('publications', () => {
      let publicLeague;
      let privateLeague;
      let userId;

      before(() => {
        userId = Random.id();
        publicLeague = Factory.create('league');
        privateLeague = Factory.create('league', { userId });

        _.times(3, () => {
          Factory.create('player', { leagueId: publicLeague._id });
          // TODO get rid of userId, https://github.com/meteor/todos/pull/49
          Factory.create('player', { leagueId: privateLeague._id, userId });
        });
      });

      describe('players.inLeague', () => {
        it('sends all players for a public league', (done) => {
          const collector = new PublicationCollector();
          collector.collect(
            'players.inLeague',
            { leagueId: publicLeague._id },
            (collections) => {
              chai.assert.equal(collections.Players.length, 3);
              done();
            }
          );
        });

        it('sends all players for a public league when logged in', (done) => {
          const collector = new PublicationCollector({ userId });
          collector.collect(
            'players.inLeague',
            { leagueId: publicLeague._id },
            (collections) => {
              chai.assert.equal(collections.Players.length, 3);
              done();
            }
          );
        });

        it('sends all players for a private league when logged in as owner', (done) => {
          const collector = new PublicationCollector({ userId });
          collector.collect(
            'players.inLeague',
            { leagueId: privateLeague._id },
            (collections) => {
              chai.assert.equal(collections.players.length, 3);
              done();
            }
          );
        });

        it('sends no players for a private leagie when not logged in', (done) => {
          const collector = new PublicationCollector();
          collector.collect(
            'players.inLeague',
            { leagueId: privateLeague._id },
            (collections) => {
              chai.assert.isUndefined(collections.Players);
              done();
            }
          );
        });

        it('sends no players for a private league when logged in as another user', (done) => {
          const collector = new PublicationCollector({ userId: Random.id() });
          collector.collect(
            'players.inLeague',
            { leagueId: privateLeague._id },
            (collections) => {
              chai.assert.isUndefined(collections.Players);
              done();
            }
          );
        });
      });
    });
  });
}
