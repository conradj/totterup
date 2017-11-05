import React from 'react';
import { Router, Route, browserHistory } from 'react-router';
import i18n from 'meteor/universe:i18n';

// route components
import AppContainer from '../../ui/containers/AppContainer.jsx';
import PlayerPageContainer from '../../ui/containers/PlayerPageContainer.jsx';
import LeaguePageContainer from '../../ui/containers/LeaguePageContainer.jsx';
import GamePageContainer from '../../ui/containers/GamePageContainer.jsx';
import AuthPageSignIn from '../../ui/pages/AuthPageSignIn.jsx';
import AuthPageJoin from '../../ui/pages/AuthPageJoin.jsx';
import NotFoundPage from '../../ui/pages/NotFoundPage.jsx';

i18n.setLocale('en');

export const renderRoutes = () => (
  <Router history={browserHistory}>
    <Route path="/" component={AppContainer}>
      <Route path="leagues/:id" component={LeaguePageContainer} />
      <Route path="leagues/:id/players" component={LeaguePageContainer} />
      <Route path="leagues/:leagueId/players/:playerId" component={PlayerPageContainer} />
      <Route path="leagues/:id/game" component={GamePageContainer} />
      <Route path="games/:id" component={GamePageContainer} />
      <Route path="signin" component={AuthPageSignIn} />
      <Route path="join" component={AuthPageJoin} />
      <Route path="*" component={NotFoundPage} />
    </Route>
  </Router>
);
