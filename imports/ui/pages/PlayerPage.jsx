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