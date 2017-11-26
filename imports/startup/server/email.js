process.env.MAIL_URL = 'smtp://' + encodeURIComponent(Meteor.settings.smtp.username) 
    + ':' + encodeURIComponent(Meteor.settings.smtp.password) 
    + '@' + encodeURIComponent(Meteor.settings.smtp.server) 
    + ':' + Meteor.settings.smtp.port;