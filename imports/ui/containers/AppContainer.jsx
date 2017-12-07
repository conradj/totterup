import { Meteor } from "meteor/meteor";
// XXX: Session
import { Session } from "meteor/session";
import { withTracker } from "meteor/react-meteor-data";

import { Leagues } from "../../api/leagues/leagues.js";
import App from "../layouts/App.jsx";

export default (AppContainer = withTracker(() => {
  const ownedHandle = Meteor.subscribe("leagues.owned");
  const inHandle = Meteor.subscribe("leagues.in");

  return {
    user: Meteor.user(),
    loading: !ownedHandle.ready() || !inHandle.ready(),
    connected: Meteor.status().connected,
    menuOpen: Session.get("menuOpen"),
    leagues: Leagues.find().fetch()
  };
})(App));
