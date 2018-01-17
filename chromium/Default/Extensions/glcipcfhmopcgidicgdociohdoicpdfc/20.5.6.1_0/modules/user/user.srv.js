(function() {
    userService.$inject = ['$q', '$timeout', '$rootScope', '$http', 'trackService', 'storage', 'server', 'promoteLoginDays', 'promoteLoginRegisteredDays', 'promoteLoginDaysMax'];

    function versionCompare(v1, v2, options) {
        var lexicographical = options && options.lexicographical,
            zeroExtend = options && options.zeroExtend,
            v1parts = v1.split('.'),
            v2parts = v2.split('.');

        function isValidPart(x) {
            return (lexicographical ? /^\d+[A-Za-z]*$/ : /^\d+$/).test(x);
        }

        if (!v1parts.every(isValidPart) || !v2parts.every(isValidPart)) {
            return NaN;
        }

        if (zeroExtend) {
            while (v1parts.length < v2parts.length) v1parts.push("0");
            while (v2parts.length < v1parts.length) v2parts.push("0");
        }

        if (!lexicographical) {
            v1parts = v1parts.map(Number);
            v2parts = v2parts.map(Number);
        }

        for (var i = 0; i < v1parts.length; ++i) {
            if (v2parts.length == i) {
                return 1;
            }

            if (v1parts[i] == v2parts[i]) {
                continue;
            }
            else if (v1parts[i] > v2parts[i]) {
                return 1;
            }
            else {
                return -1;
            }
        }

        if (v1parts.length != v2parts.length) {
            return -1;
        }

        return 0;
    }

    function userService($q, $timeout, $rootScope, $http, trackService, storage, server, promoteLoginDays, promoteLoginRegisteredDays, promoteLoginDaysMax) {
        var loggedIn = !!storage.getSync('token');
        var userPromise;
        reLoadUser();

        $rootScope.$on('http:401', http401);
        $rootScope.$on('userError', userError);

        return {
            fetch: fetch,
            login: login,
            logOut: logOut,
            reLoadUser: reLoadUser,
            setData: setData,
            getData: getData,
            getFavorites: getFavorites,
            setFavorite: setFavorite,
            rerequest: rerequest,
            checkPromoteLogin: checkPromoteLogin,
            clearFavorites: clearFavorites,
            fetchSocialHandler: fetchSocialHandler,
            fetchNotifications: fetchNotifications,
            markReadNotifications: markReadNotifications,
            markReadAlert: markReadAlert,
        };

        function reLoadUser() {
            userPromise = fetchUser();
        }

        function setData(data, skipCacheFetch) {
            var promise = $q.when();
            if (data.halfView != null || data.theme != null || data.default_search != null || data.homeSwitched != null || data.topSitesDisabled != null) {
                var set = {};
                if (data.topSitesDisabled != null) {
                    set.topSitesDisabled = data.topSitesDisabled;
                }
                if (data.halfView != null) {
                    set.halfView = data.halfView;
                }
                if (data.theme != null) {
                    set.theme = data.theme;
                }
                if (data.homeSwitched != null) {
                    set.homeSwitched = data.homeSwitched;
                }
                if (data.default_search != null) {
                    set.default_search = data.default_search;
                }

                storage.set(set)
            }

            return $q.all([promise, userPromise.then(function(user) {
                var body = {
                    data: data
                };

                if (user.anonymous) {
                    body.userId = user.id;
                }

                return $http({
                    method: 'POST',
                    url: server + '/user/data',
                    data: body
                }).then(function(res) {
                    localStorage.setItem('lastUserUpdate', new Date());
                    if (!skipCacheFetch) {
                        userPromise = fetchUser();
                    }
                    return res;
                });
            })]);
        }

        function getData() {
            return userPromise.catch(function() {
                userPromise = fetchUser();
                return userPromise;
            });
        }

        function fetchUser() {
            return (loggedIn ? $q.when({}) : trackService.getGuid(storage)).then(function(UUID) {
                return { userId: UUID };
            }).then(function(params) {
                return $http({
                    method: 'GET',
                    url: server + '/user',
                    params: params
                }).then(function(res) {
                    return res.data;
                });
            });
        }

        function fetchNotifications(params) {

            //Sume ugly hack to parse installDate
            function sliceDate(dateString) {

                var slicedDate = dateString.slice(0, 2) + ' ';
                slicedDate += dateString.slice(2, 4) + ' ';
                slicedDate += dateString.slice(4, 8);

                return new Date(slicedDate);
            };

            var deferred = $q.defer();
            var getUser;

            params.installDate = Math.max(sliceDate($rootScope.installDate), sliceDate($rootScope.updateDate));

            if (loggedIn) {
                getUser = $q.when({});
            } else {
                getUser = trackService.getGuid(storage);
            }

            getUser.then(function(UUID) {

                params.userId = UUID;
                params.version = window.muzli.getDetails().version;

                $http.get(server + '/notifications', {
                    params: params
                }).then(function (response) {

                    response.data = response.data.filter(function(notification) {

                        //Filter the notifications that was pushed before user installed/updated the extension
                        if (new Date(notification.pushedAt) < params.installDate) {
                            return false;
                        };

                        //Pass notifications if they don't have specified version
                        if (!notification.versionFrom) {
                            console.log(notification.content)
                            return true;
                        }

                        //Filter notification that require later version
                        if (versionCompare(params.version, notification.versionFrom) < 0) {

                            var index = $rootScope.user.unread_notifications.indexOf(notification.id);

                            if (index > 0) {
                                $rootScope.user.unread_notifications.splice(index, 1);
                            }

                            return false;
                        }

                        return true;
                    });

                    $rootScope.blocker = response.data.find(function(notification) {
                        return notification.type === 'blocker' && !!notification.versionFrom;
                    })

                    $rootScope.alerts = response.data.filter(function(notification) {

                        //If notification is already read, skip alert
                        if (!$rootScope.user.unread_alerts) {
                            return false;
                        }

                        if ($rootScope.user.unread_alerts.indexOf(notification.id) === -1) {
                            return false;
                        }

                        return notification.alert;
                    })

                    deferred.resolve(response.data.filter(function(notification) {
                        return !notification.alert;
                    }));
                })
            });


            return deferred.promise;
        }

        function markReadNotifications(params) {

            var deferred = $q.defer();

            $http.post(server + '/notifications/mark-read', params).then(function (response) {
                deferred.resolve(response.data);
            })

            return deferred.promise;
        }

        function markReadAlert(params) {

            var deferred = $q.defer();

            $http.post(server + '/alerts/mark-read', params).then(function (response) {
                deferred.resolve(response.data);
            })

            return deferred.promise;
        }

        function fetch() {
            return userPromise.then(function(user) {

                if (user.anonymous) {
                    return $q.reject(user);
                }

                user.favoriteCount = user.favoriteCount || 0;
                user.name = user.name || (function() {
                    var split = user.displayName.split(' ');

                    return {
                        givenName: split[0],
                        familyName: split[1]
                    };
                })();

                return user;
            }).catch(function(response) {

                //If user fetch fails, resolve user a false, to hide controls
                if (response.status === -1) {
                    return $q.reject(false);
                }

                return $q.reject(response);
            });
        }

        function getFavorites() {

            return $http({
                method: 'GET',
                url: server + '/user/favorites'
            }).then(function(res) {
                return res.data;
            });
        }

        function setFavorite(item, setFavorite) {

            return userPromise.then(function(user) {
                if (user.anonymous) {
                    trackService.track({
                        category: 'SignIn',
                        action: 'Favorite Click'
                    });

                    $rootScope.vm.showSignInDialog = (!setFavorite ? '-' : '') + item.id;
                    return null;
                }

                if (user.provider && user.provider.toLowerCase() === 'facebook' && !user.email) {
                    rerequest(item.id);
                    return null;
                }

                item.favorite = !item.favorite;

                trackService.track({
                    category: 'Feed',
                    action: setFavorite ? 'Add to favorite' : 'Remove from favorite'
                });

                $("header .favorites").addClass("zboing");
                setTimeout(function() {
                    $("header .favorites").removeClass("zboing");
                }, 1800);

                if (!setFavorite) {
                    return $http({
                        method: 'DELETE',
                        url: server + '/user/favorites/' + encodeURIComponent(item.id)
                    }).then(function() {
                        return user;
                    });
                } else {
                    return $http({
                        method: 'POST',
                        url: server + '/user/favorites',
                        data: {
                            id: item.id,
                            link: item.link,
                            vimeo: item.vimeo,
                            youtube: item.youtube,
                            title: item.title,
                            gif: item.gif,
                            image: item.image,
                            source: item.source.name
                        }
                    }).then(function() {
                        return user;
                    });
                }
            }).then(function(user) {

                if (!user) {
                    return;
                }

                if (setFavorite) {
                    $rootScope.user.favoriteCount++;
                } else {
                    $rootScope.user.favoriteCount--;
                }

                if (item.source.name === 'muzli') {
                    $rootScope.$broadcast('muzli:update:favorite', { id: user.id, favorite: setFavorite });
                }
            }).catch(function(err) {
                item.favorite = !item.favorite;

                if (err.status !== 401) {
                    $rootScope.$broadcast('userError', 'general_error');
                }
            });
        }

        function clearFavorites() {
            trackService.track({
                category: 'Feed',
                action: 'Remove all favorites'
            });

            $rootScope.$broadcast('muzli:clear:favorite');

            $http({
                method: 'DELETE',
                url: server + '/user/favorites'
            });
        }

        function clearUser() {
            userPromise = $q.reject();
            loggedIn = false;
            return storage.remove(['token']);
        }

        function login(type, isSocialShare) {

            clearUser(isSocialShare);

            trackService.getGuid(storage).then(function(UUID) {

                var location = server + '/auth/' + type + '?clientId=' + UUID + '&redirect=' + window.muzli.reloadLocation;

                if (typeof $rootScope.vm.showSignInDialog === 'string') {

                    if ($rootScope.vm.showSignInDialog === 'sources') {
                        location += '&sync=true';
                    } else if ($rootScope.vm.showSignInDialog === 'sourceFeedPromo') {
                        location += '&sourceFeedPromo=true';
                    } else if ($rootScope.vm.showSignInDialog === 'past_user_login') {
                        location += '&past_user_login=true';
                    } else {
                        location += ('&favorite=' + $rootScope.vm.showSignInDialog);
                    }
                }

                if (type === 'twitter' && isSocialShare) {
                    location += '&twitter=true';
                }

                if (type === 'google' && isSocialShare) {
                    location += '&twitter=true';
                }

                window.location = location;
            });
        }

        function logOut() {
            trackService.track({
                category: 'Settings menu',
                action: 'Logout'
            });

            $http({
                method: 'POST',
                url: server + '/logout'
            }).then(function() {

                //Clear auth cookie
                document.cookie = 'muzli_t' + '=; expires=Thu, 01 Jan 1970 00:00:01 GMT;';

                clearUser();

                //clear local storage
                storage.remove(['social_handler', 'theme', 'halfView', 'homeSwitched', 'topSitesDisabled', 'default_search']).then(function() {
                    window.location.reload();
                }).finally(function() {
                    $timeout(function() {
                        $rootScope.user = null;
                    }, 1000);
                })
                
            });

        }

        function http401() {
            clearUser();
            $rootScope.$broadcast('userError', '401');
        }

        function rerequest(favorite) {
            storage.remove('user').then(function() {
                window.location = server + '/auth/facebook/rerequest?extension=' + window.muzli.getRuntime().id + '&favorite=' + (favorite || 'rerequest');
            });
        }

        function userError(event, value) {
            $rootScope.userError = value;
            $rootScope.hideUserError = false;
        }

        function checkPromoteLogin() {

            return storage.get(['last_prompt_login', 'installTime']).then(function(res) {

                var timeStamp = new Date().getTime();
                var installTime = res.installTime;
                var lastOpenTimeStamp = res.last_prompt_login;

                var day = 1000 * 60 * 60 * 24;
                var pastLoginDays = timeStamp > (Number(lastOpenTimeStamp) + day * promoteLoginDays);
                var pastMaxLoginDays = timeStamp > (Number(lastOpenTimeStamp) + day * promoteLoginDays * promoteLoginDaysMax);
                var pastInstallTime = timeStamp > (Number(installTime) + day * promoteLoginRegisteredDays);

                if ((lastOpenTimeStamp && pastLoginDays && !pastMaxLoginDays) || (!lastOpenTimeStamp && installTime && pastInstallTime)) {
                    return timeStamp;
                }

                return $q.reject("Last Login " + lastOpenTimeStamp);

            });
        }

        function fetchSocialHandler() {
            return userPromise.then(function(user) {
                if (user && user.provider === 'twitter') {
                    return user.socialHandler;
                } else {
                    return $q.reject();
                }
            }).catch(function() {
                return storage.get('social_handler').then(function(res) {
                    return res.social_handler;
                });
            });
        }
    }

    angular.module('user')
        .constant('promoteLoginDays', 7)
        .constant('promoteLoginDaysMax', 4)
        .constant('promoteLoginRegisteredDays', 0.2)
        .factory('userService', userService);
})();
