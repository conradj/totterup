/* eslint-env mocha */

import { Meteor } from 'meteor/meteor';
import { Factory } from 'meteor/factory';
import React from 'react';
import { shallow } from 'enzyme';
import { chai } from 'meteor/practicalmeteor:chai';
import { sinon } from 'meteor/practicalmeteor:sinon';
import PlayerItem from './PlayerItem.jsx';

import {
  setCheckedStatus,
  updateName,
  remove,
} from '../../api/players/methods.js';

if (Meteor.isClient) {
  describe('PlayerItem', () => {
    it('should render', () => {
      const player = Factory.create('player', { text: 'testing', checked: true });
      const item = shallow(<PlayerItem player={player} />);
      chai.assert(item.hasClass('league-item'));
      chai.assert(item.hasClass('checked'));
      chai.assert.equal(item.find('input[type="text"]').prop('defaultValue'), 'testing');
    });

    describe('interaction', () => {
      let item = null;
      let player = null;
      beforeEach(() => {
        player = Factory.create('player', { text: 'testing' });
        item = shallow(<PlayerItem player={player} />);
      });

      it('should update text when edited', () => {
        sinon.stub(updateName, 'call');

        item.find('input[type="text"]').simulate('change', {
          target: { value: 'tested' },
        });

        sinon.assert.calledWith(updateName.call, {
          playerId: player._id,
          newText: 'tested',
        });

        updateName.call.restore();
      });

      it('should update status when checked', () => {
        sinon.stub(setCheckedStatus, 'call');

        item.find('input[type="checkbox"]').simulate('change', {
          target: { checked: true },
        });

        sinon.assert.calledWith(setCheckedStatus.call, {
          playerId: player._id,
          newCheckedStatus: true,
        });

        setCheckedStatus.call.restore();
      });

      it('should delete when trash is clicked', () => {
        sinon.stub(remove, 'call');

        item.find('.delete-item').simulate('click');

        sinon.assert.calledOnce(remove.call);

        remove.call.restore();
      });
    });
  });
}
