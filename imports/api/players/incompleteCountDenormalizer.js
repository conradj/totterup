import { _ } from 'meteor/underscore';
import { check } from 'meteor/check';

import { Players } from './players.js';
import { Leagues } from '../leagues/leagues.js';

const incompleteCountDenormalizer = {
  _updateLeague(leagueId) {
    // Recalculate the correct incomplete count direct from MongoDB
    const incompleteCount = Players.find({
      leagueId,
      checked: false,
    }).count();

    Leagues.update(leagueId, { $set: { incompleteCount } });
  },
  afterInsertPlayer(player) {
    this._updateLeague(player.leagueId);
  },
  afterUpdatePlayer(selector, modifier) {
    // We only support very limited operations on players
    check(modifier, { $set: Object });

    // We can only deal with $set modifiers, but that's all we do in this app
    if (_.has(modifier.$set, 'checked')) {
      Players.find(selector, { fields: { leagueId: 1 } }).forEach((player) => {
        this._updateLeague(player.leagueId);
      });
    }
  },
  // Here we need to take the league of players being removed, selected *before* the update
  // because otherwise we can't figure out the relevant league id(s) (if the player has been deleted)
  afterRemovePlayers(players) {
    players.forEach(player => this._updateLeague(player.leagueId));
  },
};

export default incompleteCountDenormalizer;
