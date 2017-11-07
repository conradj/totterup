import React from 'react';
import i18n from 'meteor/universe:i18n';
import BaseComponent from './BaseComponent.jsx';

class Logo extends BaseComponent {
  render() {
    return (
      <div className="logo-container">
        <img
          src="/logo-totterup.svg"
          className="logo-image"
          alt="TotterUp logo"
        />
          <h1 className="logo-title"><span>totterUp<i>!</i></span></h1>
        </div>
    );
  }
}

export default Logo;
