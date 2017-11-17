Accounts.onCreateUser(function(options, user) {
    user.ownedLeagues = options.ownedLeagues || [];
    return user;
});