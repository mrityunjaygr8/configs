angular.module('muzli').controller('headerController', ['$scope', '$state', '$rootScope', '$timeout', 'userService', 'storage', 'trackService',
    function ($scope, $state, $rootScope, $timeout, userService, storage, trackService) {

        //Private functions
        var getFetchParams = function () {
            return {
                offset: $scope.page * $scope.pageSize,
                limit: $scope.pageSize
            };
        };

        $rootScope.markRead = function (notification) {
            userService.markReadNotifications({
                id: notification.id
            }).then(function(response) {

                notification.isUnread = false;

                $rootScope.user.unread_notifications = response;
            });
        };

        $scope.markAllRead = function () {

            if (!$rootScope.user.anonymous) {

                userService.markReadNotifications({
                    markAllRead: true
                }).then(function(response) {
                    
                    $scope.notifications.forEach(function(notification) {
                        notification.isUnread = false;
                    });

                    $rootScope.user.unread_notifications = response;
                });

                
            } else {
                
                $scope.notifications.forEach(function(notification) {
                    notification.isUnread = false;
                });

                $rootScope.user.unread_notifications = [];
            }

            //Mark all static notifications as read in local storage
            storage.set({
                readStaticNotifications: $scope.notifications.filter(function(notification) {
                    return !!notification.static;
                }).map(function(notification) {
                    return notification.id;
                })
            });
        };

        $scope.toggleNotifications = function() {
            
            $scope.areNotificationsOpen = !$scope.areNotificationsOpen;

            if ($scope.areNotificationsOpen) {
                trackService.track({
                    category: 'Notification center',
                    action: 'Open'
                });
            }

            if (!$scope.areNotificationsOpen) {
                $scope.markAllRead();
            }
        };

        $scope.showAllNotifications = function () {
            $scope.notificationDisplayLimit = $scope.notifications.length;
            $scope.$broadcast('initScrollEvents');

            $('.messages').animate({scrollTop:170}, 500, 'swing');
        };

        $scope.logNotificationCta = function(notification, $event) {

            if (!$($event.target).is('a')) {
                return;
            }

            trackService.track({
                category: 'Notification center',
                action: 'CTA click',
                label: $($event.target).text() + ' | ' + notification.content,
            });
        };

        $scope.collapseSearch = function (searchText) {

            $rootScope.searchText = searchText;

            if (!searchText) {
                $scope.isSearchOpen = false;
            }
        };

        /*==============================================
        =            GET user notifications            =
        ==============================================*/

        $scope.loadNotifications = function (fetchParams) {

            if ($scope.fechingInProgress) {
                return;
            };

            if ($scope.lastItemLoaded) {
                return;
            }

            $scope.fechingInProgress = true;

            return userService.fetchNotifications(fetchParams).then(function (notifications) {
                
                //Sume ugly hack to parse installDate
                function sliceDate(dateString) {

                    var slicedDate = dateString.slice(0, 2) + ' ';
                    slicedDate += dateString.slice(2, 4) + ' ';
                    slicedDate += dateString.slice(4, 8);

                    return new Date(slicedDate);
                };

                $scope.count = notifications.count;
                $scope.notifications.push.apply($scope.notifications, notifications);

                //Increase list render limit to show all notifications
                if ($scope.page > 1) {
                    $scope.notificationDisplayLimit = $scope.notifications.length;
                }

                //Set empty notifications flag if user doesn't have any notifications yet
                if (!$scope.notifications.length) {
                    $scope.notificationListEmpty = true;
                }

                //Set flag for last item loaded
                if (!notifications || !notifications.length || notifications.length < $scope.pageSize) {

                    var updateDate = Math.max(sliceDate($rootScope.installDate), sliceDate($rootScope.updateDate));
                    var tomorrow = new Date(updateDate);

                    tomorrow.setDate(tomorrow.getDate() + 1);

                    $scope.lastItemLoaded = true;

                    //TODO: move to service
                    if (!$rootScope.user || $rootScope.user.anonymous) {
                        $scope.notifications.push({
                            id: 'login',
                            static: true,
                            isUnread: $rootScope.user.unread_notifications.indexOf('login') !== -1,
                            content: 'Please create an account to take full advantage of Muzli & save your preferences. Sign in with <a href="#" ng-click="loginGoogle()">Google</a>, <a href="#" ng-click="loginTwitter()">Twitter</a> or <a href="#" ng-click="loginFacebook()">Facebook</a>',
                            cta: '<a href="#" ng-click="::signIn()"">Sign Up</a>',
                            sender: 'Muzli Team',
                            pushedAt: updateDate,
                        })
                    }

                    if ($rootScope.user && $rootScope.hive.neverOpened) {
                        $scope.notifications.push({
                            id: 'customize',
                            static: true,
                            isUnread: $rootScope.user.unread_notifications.indexOf('customize') !== -1,
                            content: 'Welcome to Muzli friend! You can add or remove feeds by customizing Muzli, we have over 130 awesome feeds to choose from.',
                            cta: '<a href="#" ng-click="hive.show($event)">Customize</a>',
                            sender: 'Muzli Team',
                            pushedAt: updateDate,
                        })
                    }

                    if (tomorrow < new Date()) {
                        $scope.notifications.push({
                            id: 'share',
                            static: true,
                            isUnread: $rootScope.user.unread_notifications.indexOf('share') !== -1,
                            content: 'If you like what we do, please tell your friends and share the love for Muzli.',
                            cta: '<a href="#" ng-click="::shareAfterLogin(\'twitter\')" class="twitter">Twitter</a> <a href="#" class="facebook" ng-click="::shareAfterLogin(\'facebook\')">Facebook</a>',
                            sender: 'Muzli Team',
                            pushedAt: tomorrow,
                        })
                    }

                    $scope.notificationDisplayLimit++;
                }

                //Set flag indicating initial loading is complete
                $scope.loadingComplete = true;
                $scope.page++;

                $timeout(function () {
                    $scope.fechingInProgress = false;
                    $scope.$broadcast('checkScrollPosition');
                });

                return notifications;

            }).then(function(notifications) {

                storage.get(['readStaticNotifications']).then(function (res) {

                    $scope.notifications.forEach(function(notification) {

                        if ($rootScope.user.unread_notifications.indexOf(notification.id) !== -1) {
                            notification.isUnread = true;
                        }

                        if (notification.static) {
                            if (!res.readStaticNotifications || res.readStaticNotifications.indexOf(notification.id) === -1 ) {
                                $rootScope.user.unread_notifications.push(notification);
                                notification.isUnread = true;
                            }
                        }

                    })
                });
  
            });
        };

        $scope.initList = function () {
            $scope.lastItemLoaded = false;
            $scope.notificationListEmpty = false;
            $scope.enableInfiniteScroll = true;
            $scope.notificationDisplayLimit = 4; //Use for prealoading more data than it is rendered
            $scope.page = 0;
            $scope.notifications = [];
        };


        $scope.isSearchOpen = false;
        $scope.areNotificationsOpen = false;
        $scope.fechingInProgress = false;
        $scope.loadingComplete = false;
        $scope.pageSize = 10;

        $scope.$on('scrollAtBottom', function () {
            if ($scope.enableInfiniteScroll) {
                $scope.loadNotifications(getFetchParams());
            }
        });

        $rootScope.resolveUser.promise.then(function(user) {
            $scope.initList();
            $scope.loadNotifications(getFetchParams());
        })

        $scope.$watch('isSearchOpen', function(value) {
            if (!value) {
                return;
            }

            if (value) {
                $scope.killSearchAnimation = true;
            }
        })

        $scope.$on('$stateChangeSuccess', function (event, state, toParams) {
            if (state.name === 'search') {
                $scope.isSearchOpen = true;
            } else {
                $scope.isSearchOpen = false;
                $rootScope.searchText = '';
            }
        });


    }]);