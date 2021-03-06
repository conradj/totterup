import React from "react";
import { Link } from "react-router";
import i18n from "meteor/universe:i18n";
import BaseComponent from "../components/BaseComponent.jsx";
import PlayerHeader from "../components/PlayerHeader.jsx";
import NotFoundPage from "../pages/NotFoundPage.jsx";
import Message from "../components/Message.jsx";
import { displayError } from "../helpers/errors.js";
import { updateAvatar, updateUserId } from "../../api/players/methods.js";

export default class PlayerPage extends BaseComponent {
  constructor(props) {
    super(props);
    this.onAvatarFormSubmit = this.onAvatarFormSubmit.bind(this);
    this.onLinkPlayerUserFormSubmit = this.onLinkPlayerUserFormSubmit.bind(
      this
    );
  }

  onAvatarFormSubmit(event) {
    event.preventDefault();
    this.saveAvatar();
  }

  onLinkPlayerUserFormSubmit(event) {
    event.preventDefault();
    this.savePlayerUser();
  }

  saveAvatar() {
    const { player } = this.props.player;
    const file = this.avatarFile.value;
    updateAvatar.call(
      {
        playerId: this.props.player._id,
        newAvatar: file
      },
      displayError
    );
  }

  savePlayerUser() {
    const { player } = this.props.player;
    const userId = this.playerUserId.value;
    updateUserId.call(
      {
        playerId: this.props.player._id,
        userId: userId
      },
      displayError
    );
  }

  render() {
    const { player, playerExists, loading } = this.props;

    if (loading) {
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
            <div className="list-item">
              <div className="avatar-container">
                <div className="avatar">
                  <form
                    className="player-avatar-form"
                    onSubmit={this.onAvatarFormSubmit}
                  >
                    <input
                      type="text"
                      name="avatarFile"
                      autoComplete="off"
                      onChange={this.onAvatarFormSubmit}
                      ref={c => {
                        this.avatarFile = c;
                      }}
                      defaultValue={player.avatar}
                    />
                  </form>
                </div>
              </div>
            </div>
            <div className="list-item">Things that could go here:</div>
            <div className="list-item">
              <div className="link-player-container">
                <div className="link-player">
                  <form
                    className="link-player-user-form"
                    onSubmit={this.onLinkPlayerUserFormSubmit}
                  >
                    <input
                      type="text"
                      name="playerUserId"
                      autoComplete="off"
                      onChange={this.onLinkPlayerUserFormSubmit}
                      ref={c => {
                        this.playerUserId = c;
                      }}
                      defaultValue={player.userId}
                    />
                  </form>
                </div>
              </div>
            </div>
            <div className="list-item">
              Linking player to facebook/google/twitter logins
            </div>
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
  router: React.PropTypes.object
};
