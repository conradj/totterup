import React from "react";
import { Link } from "react-router";
import i18n from "meteor/universe:i18n";
import BaseComponent from "../components/BaseComponent.jsx";
import PlayerHeader from "../components/PlayerHeader.jsx";
import NotFoundPage from "../pages/NotFoundPage.jsx";
import Message from "../components/Message.jsx";

export default class PlayerPage extends BaseComponent {
  constructor(props) {
    super(props);

  }

  render() {
    const { player, playerExists, loading } = this.props;
    
    if(loading) {
      return <Message title={i18n.__("components.loading.loading")} />;
    }

    if (!playerExists) {
      return <NotFoundPage />;
    }

    return (
      <div className="page players-show">
        <PlayerHeader player={player} />
        <div className="content-scrollable list-items">
          <div className="list-items things">
            <div className="list-item">Things that could go here:</div>
            <div className="list-item">Player photos</div>
            <div className="list-item">Linking player to facebook/google/twitter logins</div>
            <div className="list-item">View all player leages</div>
            <div className="list-item">View all player games</div>
          </div>
        </div>
      </div>
    );
  }
}

PlayerPage.propTypes = {
  player: React.PropTypes.object,
  playerExists: React.PropTypes.bool,
  loading: React.PropTypes.bool
};

PlayerPage.contextTypes = {
  router: React.PropTypes.object,
};