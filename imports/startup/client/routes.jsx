import React from "react";
import { Router, Route, browserHistory } from "react-router";

import i18n from "meteor/universe:i18n";
// route components
import AppContainer from "../../ui/containers/AppContainer.jsx";
import PlayerPageContainer from "../../ui/containers/PlayerPageContainer.jsx";
import LeaguePageContainer from "../../ui/containers/LeaguePageContainer.jsx";
import GamePageContainer from "../../ui/containers/GamePageContainer.jsx";
import AuthPageSignIn from "../../ui/pages/AuthPageSignIn.jsx";
import AuthPageJoin from "../../ui/pages/AuthPageJoin.jsx";
import LandingPage from "../../ui/pages/LandingPage.jsx";
import AuthPageForgotPassword from "../../ui/pages/AuthPageForgotPassword.jsx";
import NotFoundPage from "../../ui/pages/NotFoundPage.jsx";
import LeagueJoinPage from "../../ui/pages/LeagueJoinPage.jsx";

i18n.setLocale("en");

function requireAuth(nextState, replace) {
  if (!Meteor.userId()) {
    replace({
      pathname: "/hi"
    });
  }
}

export const renderRoutes = () => (
  <Router history={browserHistory}>
    <Route path="hi" component={LandingPage} />
    <Route path="/" component={AppContainer} onEnter={requireAuth}>
      <Route
        path="leagues/join"
        component={LeagueJoinPage}
        onEnter={requireAuth}
      />
      <Route
        path="leagues/:id"
        component={LeaguePageContainer}
        onEnter={requireAuth}
      />
      <Route
        path="leagues/:id/players"
        component={LeaguePageContainer}
        onEnter={requireAuth}
      />
      <Route
        path="leagues/:leagueId/players/:playerId"
        component={PlayerPageContainer}
        onEnter={requireAuth}
      />
      <Route
        path="leagues/:id/game"
        component={GamePageContainer}
        onEnter={requireAuth}
      />
      <Route
        path="games/:id"
        component={GamePageContainer}
        onEnter={requireAuth}
      />
    </Route>
    <Route path="signin" component={AuthPageSignIn} />
    <Route path="join" component={AuthPageJoin} />
    <Route path="forgotpassword" component={AuthPageForgotPassword} />
    <Route path="*" component={NotFoundPage} />
  </Router>
);
