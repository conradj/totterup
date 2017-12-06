import { BrowserPolicy } from "meteor/browser-policy-common";
BrowserPolicy.content.allowOriginForAll("totterup.com");
BrowserPolicy.content.allowOriginForAll("totterupapp.azurewebsites.net");
BrowserPolicy.content.allowOriginForAll("*.google-analytics.com");
BrowserPolicy.content.allowOriginForAll("fonts.gstatic.com");
BrowserPolicy.content.allowImageOrigin("lh3.googleusercontent.com");
BrowserPolicy.content.allowImageOrigin("images.unsplash.com");
BrowserPolicy.content.allowImageOrigin("source.unsplash.com");
