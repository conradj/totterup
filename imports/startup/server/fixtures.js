import { Meteor } from 'meteor/meteor';
import { Leagues } from '../../api/leagues/leagues.js';
import { Players } from '../../api/players/players.js';
import { Games } from '../../api/games/games.js';

// if the database is empty on server start, create some sample data.
Meteor.startup(() => {
  if (Leagues.find().count() === 0) {
    const data = [
      {
        name: 'The Lifelong League',
        items: [
          'Amy',
          'Conrad',
          'Laura',
          'Markie',
        ],
        games: [
          'New Game Fix 1',
          'New Game Fix 2'
        ]
      },
      {
        name: 'Mahjong Northen League',
        items: [
          'Laura',
          'Markie',
          'Neighbour 1',
          'Neighbour 2',
        ],
        games: [
          'New Game Fix 1',
          'New Game Fix 2'
        ],
      },
      {
        name: 'The English Premier League',
        items: [
          'Brighton',
          'Stoke',
          'Watford',
          'Liverpool',
          'Bristol',
          'Wycombe Wanderers',
        ],
        games: [
          'New Game Fix 1',
          'New Game Fix 2'
        ],
      },
    ];

    let timestamp = (new Date()).getTime();

    data.forEach((league) => {
      const leagueId = Leagues.insert({
        name: league.name,
      });

      league.items.forEach((text) => {
        Players.insert({
          leagueId,
          text,
          createdAt: new Date(timestamp),
        });

        timestamp += 1; // ensure unique timestamp.
      });

      league.games.forEach((text) => {
        Games.insert({
          leagueId,
          text,
          createdAt: new Date(timestamp),
        });

        timestamp += 1; // ensure unique timestamp.
      });
    });
  }
});
