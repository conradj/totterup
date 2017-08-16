/* global window */
/* eslint-env mocha */

import { Meteor } from 'meteor/meteor';
import { Factory } from 'meteor/factory';
import React from 'react';
import { mount } from 'enzyme';
import { chai } from 'meteor/practicalmeteor:chai';
import { sinon } from 'meteor/practicalmeteor:sinon';
import { Random } from 'meteor/random';
import LeagueHeader from './LeagueHeader.jsx';

import {
  updateName,
  remove,
} from '../../api/leagues/methods.js';

import {
  insert,
} from '../../api/players/methods.js';

if (Meteor.isClient) {
  describe('LeagueHeader', () => {
    let league = null;
    let header = null;
    let router = null;

    beforeEach(() => {
      league = Factory.create('league', { userId: Random.id(), name: 'testing' });
      router = { push: sinon.stub() };
      header = mount(<LeagueHeader league={league} />, {
        context: { router },
      });
    });

    describe('any state', () => {
      it('should create a new player when user submits', () => {
        sinon.stub(insert, 'call');

        header.instance().newPlayerInput.value = 'new player';
        header.find('.player-new').simulate('submit');

        sinon.assert.calledWith(insert.call, { leagueId: league._id, text: 'new player' });

        insert.call.restore();
      });

      it('should delete league and navigate home when user clicks trash', () => {
        sinon.stub(remove, 'call');
        sinon.stub(window, 'confirm').returns(true);

        header.find('.trash').simulate('click');

        sinon.assert.calledWith(remove.call, { leagueId: league._id });
        sinon.assert.calledWith(router.push, '/');

        remove.call.restore();
        window.confirm.restore();
      });
    });

    describe('non-editing state', () => {
      it('should render title and player creation form', () => {
        chai.assert.equal(header.find('.title-wrapper').text(), 'testing');
        chai.assert(header.find('.player-new').length);
        chai.assert(!header.find('.league-edit-form').length);
      });
    });

    describe('editing state', () => {
      beforeEach(() => {
        header.setState({ editing: true });
      });

      it('should render edit and player creation forms', () => {
        chai.assert(header.find('.league-edit-form').length);
        chai.assert(header.find('.player-new').length);
        chai.assert(!header.find('.title-page').length);
      });

      it('should rename the league when user edits', () => {
        sinon.stub(updateName, 'call');

        header.instance().leagueNameInput.value = 'renamed';
        header.find('.league-edit-form').simulate('submit');
        sinon.assert.calledWith(updateName.call, {
          leagueId: league._id,
          newName: 'renamed',
        });
        updateName.call.restore();
      });
    });
  });
}
