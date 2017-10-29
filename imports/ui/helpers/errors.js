/* global alert */

import i18n from 'meteor/universe:i18n';

export const displayError = (error) => {
  if (error) {
    // It would be better to not alert the error here but inform the user in some
    // more subtle way
    console.log(i18n.__(error.error)); // eslint-disable-line no-alert

    if (error.error === 'validation-error') {
      console.dir(error, 'error ')
    }
  }
};
