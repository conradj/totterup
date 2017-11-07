import React from 'react';
import i18n from 'meteor/universe:i18n';
import BaseComponent from './BaseComponent.jsx';
import { insert as insertGame } from "../../api/games/methods.js";
import { insert as insertScore } from "../../api/scores/methods.js";


class NewGameButton extends BaseComponent {
  constructor(props) {
    super(props);
    this.playGame = this.playGame.bind(this);
  }

  componentDidMount() {
    
  }

  playGame() {
    const { router } = this.context;
    const { leagueId, players } = this.props;
    const gameId = insertGame.call(
      {
        leagueId: leagueId,
        name: "new game"
      },
      err => {
        if (err) {
          //router.push('/');
          /* eslint-disable no-alert */
          console.log(err);
          alert(i18n.__("components.leagueGame.newGameError"));
        }
      }
    );
    
    players.map(player => {
      insertScore.call(
        {
          leagueId: leagueId,
          gameId: gameId,
          playerId: player._id,
          score: 0
        },
        err => {
          if (err) {
            //router.push('/');
            /* eslint-disable no-alert */
            console.log(err);
            alert(i18n.__("components.leagueGame.newGameScoreError"));
          }
        }
      )
    });

    router.push(`/games/${gameId}`);
  }

  render() {
    return (
      <div className="-league-new-game">
          <div className="user-menu">
            <a className="link-game-new" onClick={this.playGame}>
                <span className="icon-plus" />
                {i18n.__("pages.leaguePage.playGame")}
            </a>
          </div>
      </div>
    );
  }
}

export default NewGameButton;

NewGameButton.propTypes = {
  leagueId: React.PropTypes.string,
  players: React.PropTypes.array
};

NewGameButton.contextTypes = {
  router: React.PropTypes.object,
};
