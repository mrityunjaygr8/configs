(function() {

    favoritesController.$inject = ['$scope', '$rootScope', 'feedFetcher', 'userService', 'trackService'];

    function favoritesController($scope, $rootScope, feedFetcher, userService, trackService) {

        window.muzli.pageChange();
        $rootScope.initScrollTracking($scope);

        trackService.track({
            category: 'Sidebar',
            action: 'Click',
            label: 'Source: favorites'
        });

        $rootScope.feedVisibleClass = 'halfView';
        $rootScope.initialLoading = 'loading-complete';

        feedFetcher.fetch('favorites', 300).then(function(res) {
            $scope.items = res.data;
        }).catch(function(error) {
            console.error(error);
            $rootScope.setError($scope, 'error');
        });

        $rootScope.clearAllFavorites = function() {
            userService.clearFavorites();
            $scope.items = [];
            $rootScope.user.favoriteCount = 0;
        }
    }

    config.$inject = ['$httpProvider', '$stateProvider'];

    function config($httpProvider, $stateProvider) {

        $stateProvider.state('favorites', {
            templateUrl: 'modules/user/favorites.html',
            controller: favoritesController
        });

        $httpProvider.interceptors.push(['$q', 'server', '$rootScope', 'storage',
          function($q, server, $rootScope, storage) {

            var token = storage.getSync('token');

            return {

                request: function(config) {
                    if (config.skipAuth || !token || config.url.indexOf(server) !== 0) {
                        return config;
                    }

                    if (config.method === "GET") {
                        config.params = config.params || {};
                        config.params.Authorization = 'Bearer ' + token;
                    } else {
                        config.headers.Authorization = 'Bearer ' + token;
                    }

                    return config;
                },

                responseError: function(rejection) {
                    if (rejection.status === 401) {
                        $rootScope.$broadcast('http:401');
                    }

                    return $q.reject(rejection);
                }
            };
        }]);
    }

    run.$inject = ['$state', 'trackService', 'userService', '$rootScope', '$timeout', '$q', 'storage', 'socialService'];

    function run($state, trackService, userService, $rootScope, $timeout, $q, storage, socialService) {

        $rootScope.resolveUser = $q.defer();
        $rootScope.vm = $rootScope.vm || {};
        $rootScope.vm.showSignInDialog = false;



        /*=============================================
        =            Resolve user from API            =
        =============================================*/

        userService.fetch().then(function(user) {

            if (user) {

                $rootScope.user = user;

                $rootScope.resolveUser.resolve(user);
                $rootScope.isUserResolved = true;

                if (user.provider && user.provider.toLowerCase() === 'facebook' && !user.email) {
                    $rootScope.$broadcast('userError', 'missing_email');
                } else if (window.REGISTERED) {
                    $rootScope.vm.showThanksYouSignInDialog = true;
                }
            }

        }).catch(function(anonymousUser) {

            $rootScope.user = anonymousUser;

            $rootScope.resolveUser.resolve(anonymousUser);
            $rootScope.isUserResolved = true;

            return userService.checkPromoteLogin().then(function(timeStamp) {
                $timeout(function() {
                    if (!$rootScope.vm.showSignInDialog) {
                        storage.set({
                            'last_prompt_login': timeStamp
                        });
                        $rootScope.vm.showSignInDialog = true;
                    }
                }, 7000);
            });

        }).catch(function() {

            storage.get(['showedBundles']).then(function(res) {
                if (!res.showedBundles) {
                    storage.set({
                        showedBundles: true
                    }).then(function() {
                        $rootScope.vm.showWelcome = true;
                    });
                }
            });
        });


        /*======================================
        =            User functions            =
        ======================================*/

        $rootScope.shareAfterLogin = function(channel) {
            socialService.share(channel, {
                'twitter': 'http://bit.ly/1MpxFig',
                'facebook': 'http://bit.ly/1qj6Em5',
                'linkedin': 'http://bit.ly/1Q32LqE'
            }[channel], "Lovin' Muzli! Design inspiration on tap. Check it out.");

            trackService.track({
                category: 'Share Promote Dialog',
                action: 'Share',
                label: channel
            });
        };

        $rootScope.clickOutsideBubble = function() {
            if ($rootScope.userError) {
                $rootScope.hideUserError = true;
            }
        };

        $rootScope.signIn = function() {
            $rootScope.vm.showSignInDialog = true;

            trackService.track({
                category: 'SignIn',
                action: 'Button Click'
            });
        };

        $rootScope.clickUser = function() {
            var user = $rootScope.user;
            if (user.provider && user.provider.toLowerCase() === 'facebook' && !user.email) {
                userService.rerequest();
            } else {
                $state.go('favorites', {}, { reload: true });
            }
        };

        $rootScope.logOut = function() {
            userService.logOut();
        };

        $rootScope.loginFacebook = function(from) {
            if (from) {
                trackService.track({
                    category: 'SignIn',
                    action: from,
                    label: 'facebook'
                });
            }
            userService.login('facebook');
        };

        $rootScope.loginTwitter = function(from) {
            if (from) {
                trackService.track({
                    category: 'SignIn',
                    action: from,
                    label: 'twitter'
                });
            }
            userService.login('twitter');
        };

        $rootScope.loginGoogle = function(from) {
            if (from) {
                trackService.track({
                    category: 'SignIn',
                    action: from,
                    label: 'google'
                });
            }
            userService.login('google');
        };

        function syncLocalToUserData() {
            userService.getData().then(function(user) {

                $('body').removeClass('theme');
                $rootScope.theme = user.theme;
                $rootScope.homeSwitched = user.homeSwitched;

                var update = {};
                if (user.halfView != null) {
                    update.halfView = user.halfView;
                }
                if (user.homeSwitched != null) {
                    update.homeSwitched = user.homeSwitched;
                }
                if (user.theme != null) {
                    update.theme = user.theme;
                }
                if (user.default_search != null) {
                    update.default_search = user.default_search;
                }
                if (user.topSitesDisabled != null) {
                    update.topSitesDisabled = user.topSitesDisabled;
                }

                storage.set(update).then(function() {
                    if (update.halfView != null) {
                        $rootScope.$broadcast('muzliSetView');
                    }
                    if (update.topSitesDisabled != null) {
                        $rootScope.$broadcast('muzliLoadSites');
                    }
                })

            });
        }

        syncLocalToUserData();
    }

    angular.module('user', []).config(config).run(run);

})();
