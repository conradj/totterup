/* globals App */
/* eslint-disable quote-props */

App.info({
  id: "com.totterup.lifelongleague.app",
  name: "TotterUp!",
  description: "For Life Long Leagues",
  author: "Totterup",
  email: "dev@conradj.co.uk",
  website: "https://totterup.com",
  version: "0.0.2"
});

App.icons({
  // iOS
  iphone: "resources/icons/icon-60x60.png",
  iphone_2x: "resources/icons/icon-60x60@2x.png",
  ipad: "resources/icons/icon-76x76.png",
  ipad_2x: "resources/icons/icon-76x76@2x.png",

  // Android
  android_ldpi: "resources/icons/icon-36x36.png",
  android_mdpi: "resources/icons/icon-48x48.png",
  android_hdpi: "resources/icons/icon-72x72.png",
  android_xhdpi: "resources/icons/icon-96x96.png",
  android_xxhdpi: "resources/icons/icon-144x144.png",
  android_xxxhdpi: "resources/icons/icon-192x192.png"
});

App.launchScreens({
  // iOS
  iphone: "resources/splash/splash-320x480.png",
  iphone_2x: "resources/splash/splash-320x480@2x.png",
  iphone5: "resources/splash/splash-320x568@2x.png",
  ipad_portrait: "resources/splash/splash-768x1024.png",
  ipad_portrait_2x: "resources/splash/splash-768x1024@2x.png",
  ipad_landscape: "resources/splash/splash-1024x768.png",
  ipad_landscape_2x: "resources/splash/splash-1024x768@2x.png",

  // Android
  android_hdpi_portrait: "resources/splash/splash-480x800.png",
  android_hdpi_landscape: "resources/splash/splash-800x480.png",
  android_xhdpi_portrait: "resources/splash/splash-720x1280.png",
  android_xhdpi_landscape: "resources/splash/splash-1280x720.png",
  android_xxhdpi_portrait: "resources/splash/splash-960x1600.png",
  android_xxhdpi_landscape: "resources/splash/splash-1600x960.png",
  android_xxxhdpi_portrait: "resources/splash/splash-1280x1920.png",
  android_xxxhdpi_landscape: "resources/splash/splash-1920x1280.png"
});
App.setPreference("SplashScreen", "CDVSplashScreen");
App.setPreference("SplashScreenDelay", "0");
App.setPreference("StatusBarOverlaysWebView", "false");
App.setPreference("StatusBarBackgroundColor", "#000000");
App.setPreference("android-minSdkVersion", "23");
App.setPreference("android-targetSdkVersion", "26");
App.accessRule("http://totterup.com/*");
App.accessRule("http://www.totterup.com/*");
App.accessRule("https://www.totterup.com/*");
App.accessRule("https://totterup.com/*");
App.accessRule("http://totterupapp.azurewebsites.net/*");
App.accessRule("https://totterupapp.azurewebsites.net/*");
App.accessRule("https://lh3.googleusercontent.com/*");
App.accessRule("https://fonts.gstatic.com/*");
App.accessRule("https://*.google-analytics.com/*");
