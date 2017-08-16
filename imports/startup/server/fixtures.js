import { Meteor } from 'meteor/meteor';
import { Leagues } from '../../api/leagues/leagues.js';
import { Players } from '../../api/players/players.js';

// if the database is empty on server start, create some sample data.
Meteor.startup(() => {
  if (Leagues.find().count() === 0) {
    const data = [
      {
        name: 'Meteor Principles',
        items: [
          'Data on the Wire',
          'One Language',
          'Database Everywhere',
          'Latency Compensation',
          'Full Stack Reactivity',
          'Embrace the Ecosystem',
          'Simplicity Equals Productivity',
        ],
      },
      {
        name: 'Languages',
        items: [
          'Lisp',
          'C',
          'C++',
          'Python',
          'Ruby',
          'JavaScript',
          'Scala',
          'Erlang',
          '6502 Assembly',
        ],
      },
      {
        name: 'Favorite Scientists',
        items: [
          'Ada Lovelace',
          'Grace Hopper',
          'Marie Curie',
          'Carl Friedrich Gauss',
          'Nikola Tesla',
          'Claude Shannon',
        ],
      },
    ];

    let timestamp = (new Date()).getTime();

    data.forEach((league) => {
      const leagueId = Leagues.insert({
        name: league.name,
        incompleteCount: league.items.length,
      });

      league.items.forEach((text) => {
        Players.insert({
          leagueId,
          text,
          createdAt: new Date(timestamp),
        });

        timestamp += 1; // ensure unique timestamp.
      });
    });
  }
});
