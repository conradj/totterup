import { Meteor } from 'meteor/meteor';
import React from 'react';
import { Link } from 'react-router';
import i18n from 'meteor/universe:i18n';
import BaseComponent from '../components/BaseComponent.jsx';

import AuthPage from './AuthPage.jsx';

export default class ForgotPasswordPage extends BaseComponent {
  constructor(props) {
    super(props);
    this.state = Object.assign(this.state, { errors: {} });
    this.onSubmit = this.onSubmit.bind(this);
  }

  onSubmit(event) {
    event.preventDefault();
    const email = this.email.value;
    const errors = {};

    if (!email) {
      errors.email = i18n.__('pages.forgotPassword.emailRequired');
    }
    
    this.setState({ errors });
    if (Object.keys(errors).length) {
      return;
    }
    const options = {
      email: email
    };
    Accounts.forgotPassword(options, (err) => {
      if (err) {
        this.setState({
          errors: { none: err.reason },
        });
      } else {
        console.log('Email Sent. Check your mailbox.');
        alert('Email Sent. Check your mailbox.');
      }
    });
  }

  render() {
    const { errors } = this.state;
    const errorMessages = Object.keys(errors).map(key => errors[key]);
    const errorClass = key => errors[key] && 'error';

    const content = (
      <div className="wrapper-auth">
        <h1 className="title-auth">
          {i18n.__('pages.forgotPassword.resetPassword')}
        </h1>
        <p className="subtitle-auth">
          {i18n.__('pages.forgotPassword.emailReason')}
        </p>
        <form onSubmit={this.onSubmit}>
          <div className="list-errors">
            {errorMessages.map(msg => (
              <div className="list-item" key={msg}>{msg}</div>
            ))}
          </div>
          <div className={`input-symbol ${errorClass('email')}`}>
            <input
              type="email"
              name="email"
              ref={(c) => { this.email = c; }}
              placeholder={i18n.__('pages.forgotPassword.yourEmail')}
            />
            <span
              className="icon-email"
              title={i18n.__('pages.forgotPassword.yourEmail')}
            />
          </div>
          <button type="submit" className="btn-primary">
            {i18n.__('pages.forgotPassword.sendResetLink')}
          </button>
        </form>
      </div>
    );

    const link = (
      <Link to="/join" className="link-auth-alt">
        {i18n.__('pages.authPageJoin.haveAccountSignIn')}
      </Link>
    );

    return <AuthPage content={content} link={link} />;
  }
}

ForgotPasswordPage.contextTypes = {
  router: React.PropTypes.object,
};
