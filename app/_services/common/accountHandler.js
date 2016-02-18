(function () {
    'use strict';

    angular.module(globals.appName + globals.services).factory('accountHandler', [
        'dataService',
        '$localStorage',
        '$sessionStorage',
        '$rootScope',
        '$location',
        '$interval',
        'messageService',
        'configModel',
        '$q',
        'repoService',
        'paths',
        function (dataService,
            $localStorage,
            $sessionStorage,
            $rootScope,
            $location,
            $interval,
            messageService,
            configModel,
            $q,
            repoService,
            paths) {
            /* Functions */
            function getUser() {
                if (!$sessionStorage.signedIn) {
                    return $q.when();
                }

                if ($sessionStorage.user) {
                    return $q.when($sessionStorage.user);
                } else {
                    return dataService.get(configModel.getUrl().user, null, { overrideMock: true }).then(function (response) {
                        var user = response && response.data && response.data.user ? response.data.user : null;

                        if (user && user.image === null) {
                            user.image = paths.defaultImage;
                        }
                        return user;
                    });
                }
            }

            function getAllUsers() {
                return repoService
					.withFunction(repoService.repositories.user, 'getAllUsers')
					.exec({
					    topic: 'account.getAllUsers',
					    skipBroadcast: true
					}).then(function (response) {
					    _.forEach(response.users, function (user) {
					        user.image = user.image ? user.image : paths.defaultImage;
					    });

					    $rootScope.$broadcast('account.getAllUsers.done', response.users);

					    return response.users;
					});
            }

            function updateUserData(userData) {
                $sessionStorage.user = userData;
            }

            function register(data) {
                return dataService.post('/api/account/', data).success(function (response) {
                    return signIn({ username: data.username, password: data.password });
                }).error(function (response, status) {
                    return status + ': ' + response.Message;
                });
            }

            function signIn(data) {
                return dataService.post(configModel.getUrl().signIn, 'grant_type=password&username=' + data.username + '&password=' + data.password, {
                    headers: { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' },
                    overrideMock: true
                }).success(function (response) {
	                // Set common auth header
                    $localStorage.tokenObj = response;
                    $sessionStorage.signedIn = true;

                    getUser().then(function (user) {
                        $sessionStorage.user = user;
                        // Listeners: settingsController
                        $rootScope.$broadcast('accountHandler.signIn.done', user);

                        // Set timer to refresh token when token expires
                        // Resolved issue#AEP-237, it only works in first time due to always old refresh token even if after refreshed.
                        // Solution is getting latest token from localstorage to instead of passing in.
                        refreshTokenTimer();

                        // Redirect
                        $location.path('/home');
                        return response;
                    }, function () {
                        delete $localStorage.tokenObj;
                        $sessionStorage.signedIn = false;
                    });

                }).error(function (response, status) {
                    messageService.error('Något gick fel.', 'Någon av dina uppgifter var felaktiga');
                    console.log(response.error + ': ' + response.Message);

                    delete $localStorage.tokenObj;
                    $sessionStorage.signedIn = false;
                    return status + ': ' + response.Message;
                });
            }

            function signOut() {
                delete $localStorage.tokenObj;
                delete $sessionStorage.user;
                $sessionStorage.signedIn = false;
                stopRefreshInterval();

                // Listeners: settingsController
                $rootScope.$broadcast('accountHandler.signOut.done');

                // Redirect
                $location.path('/signin');
            }

            function getSignedIn() {
                return $sessionStorage.signedIn;
            }

            var intervalPromise;
            function refreshTokenTimer() {
                var data = getToken();
                intervalPromise = $interval(function () {
                    refreshToken();
                }, (data.expires_in * 1000) - 60000);
            }

            function stopRefreshInterval() {
                if (angular.isDefined(intervalPromise)) {
                    $interval.cancel(intervalPromise);
                    intervalPromise = undefined;
                }
            }

            function refreshToken() {
                var data = getToken();
                dataService.post(configModel.getUrl().signIn, 'grant_type=refresh_token&username=' + data.username + '&refresh_token=' + data.refresh_token,
					{ headers: { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' } }).success(function (response) {
						$localStorage.tokenObj = response;
					});
            }

            function getToken() {
                return $localStorage.tokenObj;
            }

            function getCurrentInstance() {
                var instances = getInstances();
                if (_.isUndefined(instances) || _.isNull(instances) || _.isUndefined(instances[0]) || !_.isNumber(instances[0].instance))
                    return 0;

                return getInstances()[0].instance;
            }

            function getInstances() {
                return angular.fromJson(getToken().instances);
            }

            function init() {
                if (!getSignedIn()) {
                    stopRefreshInterval();
                    // Redirect
                    $location.path('/signin');
                } else {
	                refreshTokenTimer();
                }
            }

            init();

            // Subscriptions
            $rootScope.$on('authenticationInterceptor.error.unauthorized', function (event, data) {
                signOut();
            });

            return {
                signIn: signIn,
                signOut: signOut,
                register: register,

                token: getToken,
                currentInstance: getCurrentInstance,
                instances: getInstances,

                signedIn: getSignedIn,
                getUser: getUser,
                getAllUsers: getAllUsers,
                updateUserData: updateUserData,

                refreshToken: refreshToken
            };
        }
    ]);
}());