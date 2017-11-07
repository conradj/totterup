import React from 'react';
import i18n from 'meteor/universe:i18n';
import BaseComponent from './BaseComponent.jsx';
import Logo from './Logo.jsx';

class Loading extends BaseComponent {
  render() {
    return (
      <Logo />
    );
  }
}

export default Loading;
