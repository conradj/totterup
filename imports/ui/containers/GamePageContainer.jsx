import { Meteor } from 'meteor/meteor';
import { createContainer } from 'meteor/react-meteor-data';
import { Leagues } from '../../api/leagues/leagues.js';
import { Games } from '../../api/games/games.js';
import GamePage from '../pages/GamePage.jsx';

const GamePageContainer = createContainer(({ params: { id } }) => {
  
  const handle = Meteor.subscribe('games');
  const handleScore = Meteor.subscribe('scores');
  const handlePlayers = Meteor.subscribe('players');
  const loading = !handle.ready() || !handleScore.ready() || !handlePlayers.ready();
  const game = Games.findOne(id);
  const gameExists = (!loading && !!game);
  
  console.log(Games);
  console.log("GamePageContainer", id, loading, game, gameExists);
  
  return {
    loading,
    game,
    gameExists,
    scores : gameExists ? game.scores().fetch() : [],
    players : gameExists ? game.players().fetch() : []
  };
}, GamePage);

export default GamePageContainer;