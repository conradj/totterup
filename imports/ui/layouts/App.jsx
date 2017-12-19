import React from "react";
import ReactCSSTransitionGroup from "react-addons-css-transition-group";
import { Meteor } from "meteor/meteor";
import { Session } from "meteor/session"; // XXX: SESSION
import { Leagues } from "../../api/leagues/leagues.js";
import UserMenu from "../components/UserMenu.jsx";
import LeagueList from "../components/LeagueList.jsx";
import LanguageToggle from "../components/LanguageToggle.jsx";
import ConnectionNotification from "../components/ConnectionNotification.jsx";
import Loading from "../components/Loading.jsx";
import Logo from "../components/Logo.jsx";

const CONNECTION_ISSUE_TIMEOUT = 5000;

export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      menuOpen: false,
      showConnectionIssue: false
    };
    this.toggleMenu = this.toggleMenu.bind(this);
    this.logout = this.logout.bind(this);
  }

  componentDidMount() {
    setTimeout(() => {
      /* eslint-disable react/no-did-mount-set-state */
      this.setState({ showConnectionIssue: true });
    }, CONNECTION_ISSUE_TIMEOUT);
  }

  componentWillReceiveProps({ loading, children }) {
    // // redirect / to a list once lists are ready
    if (!loading && !children) {
      const league = Leagues.findOne();
      if (league) {
        this.context.router.replace(`/leagues/${league._id}`);
      } else {
        Session.set("menuOpen", true);
      }
    }
  }

  toggleMenu(menuOpen = !Session.get("menuOpen")) {
    Session.set({ menuOpen });
  }

  logout() {
    Meteor.logout(() => this.context.router.replace("/signin"));
  }

  render() {
    const { showConnectionIssue } = this.state;
    const {
      user,
      connected,
      loading,
      leagues,
      menuOpen,
      children,
      location
    } = this.props;

    // eslint-disable-next-line react/jsx-no-bind
    const closeMenu = this.toggleMenu.bind(this, false);
    // clone route components with keys so that they can
    // have transitions
    const clonedChildren =
      children &&
      React.cloneElement(children, {
        key: location.pathname
      });

    return (
      <div id="container" className={menuOpen ? "menu-open" : ""}>
        <section id="menu">
          <Logo showTitle={true} showStrapline={true} />
          <UserMenu user={user} logout={this.logout} />
          <LanguageToggle />
          <LeagueList leagues={leagues} />
        </section>
        {showConnectionIssue && !connected ? <ConnectionNotification /> : null}
        <div className="content-overlay" onClick={closeMenu} />
        <div id="content-container">
          <ReactCSSTransitionGroup
            transitionName="fade"
            transitionEnterTimeout={200}
            transitionLeaveTimeout={200}
          >
            {!loading ? clonedChildren : null}
            <div className="welcome">{loading && <Loading />}</div>
          </ReactCSSTransitionGroup>
        </div>
      </div>
    );
  }
}

App.propTypes = {
  user: React.PropTypes.object, // current meteor user
  connected: React.PropTypes.bool, // server connection status
  loading: React.PropTypes.bool, // subscription status
  menuOpen: React.PropTypes.bool, // is side menu open?
  leagues: React.PropTypes.array, // all leagues visible to the current user
  children: React.PropTypes.element, // matched child route component
  location: React.PropTypes.object, // current router location
  params: React.PropTypes.object // parameters of the current route
};

App.contextTypes = {
  router: React.PropTypes.object
};
