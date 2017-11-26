import React from 'react';
import MobileMenu from '../components/MobileMenu.jsx';
import AccountsUIWrapper from '../layouts/AccountsUIWrapper.jsx';

// a common layout wrapper for auth pages
const AuthPage = ({ content, link }) => (
  <div className="page auth">
    <nav>
      <MobileMenu />
    </nav>
    <div className="content-scrollable">
      <AccountsUIWrapper />
      {content}
      {link}
    </div>
  </div>
);

AuthPage.propTypes = {
  content: React.PropTypes.element,
  link: React.PropTypes.element,
};

export default AuthPage;
