import { BrowserPolicy } from 'meteor/browser-policy-common';
BrowserPolicy.content.allowOriginForAll('*.google-analytics.com');
BrowserPolicy.content.allowOriginForAll( 'fonts.gstatic.com' );
BrowserPolicy.content.allowImageOrigin("lh3.googleusercontent.com");