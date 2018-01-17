(function() {

    var $window = $(window);

    // Returns a function, that, as long as it continues to be invoked, will not
    // be triggered. The function will be called after it stops being called for
    // N milliseconds. If `immediate` is passed, trigger the function on the
    // leading edge, instead of the trailing.
    function debounce (func, wait, immediate) {

        var timeout;

        return function () {

            var context = this;
            var args = arguments;

            var later = function () {
                timeout = null;
                if (!immediate) func.apply(context, args);
            };

            var callNow = immediate && !timeout;

            clearTimeout(timeout);

            timeout = setTimeout(later, wait);

            if (callNow) func.apply(context, args);
        };
    }

    scrollableFeed.$inject = ['$rootScope', '$timeout', 'trackService', 'localPageSize', 'serverPageSize', 'userService', 'feedFetcher', 'sources'];

    function scrollableFeed($rootScope, $timeout, trackService, localPageSize, serverPageSize, userService, feedFetcher, sources) {

        return {
            restrict: 'E',
            scope: {
                items: '=',
                sponsored: '=',
            },
            transclude: {
                'no-data': '?scrollableFeedNoData'
            },
            templateUrl: 'modules/feed/feed.drv.html',

            link: function(scope, el, attrs) {

                var data;
                var current;
                var feed;
                var checkDeleteLength = angular.isDefined(attrs.checkDeleteLength);
                var source = $rootScope.currentSource.name || $rootScope.currentSource;
                var loadComplete = false;
                var loadingFromServer = false;

                scope.loading = false;
                scope.numberOfServerPageLoads = 0;
                scope.infiniteScrollDistance = window.muzli.paging.scrollDistance;
                scope.showFavorite = angular.isDefined(attrs.showFavorite);
                scope.showRemove = angular.isDefined(attrs.showRemove);
                scope.showVirality = angular.isDefined(attrs.showVirality);

                function init() {
                    data = scope.items;
                    current = 0;
                    feed = scope.feed = [];

                    userService.getData().then(function(user) {
                        scope.user = user;
                    })
                }

                function insertItems() {

                    scope.loadingItems = true;

                    //Slice data array according to local pagination
                    var feedPage = data.slice(current, Math.min(current + localPageSize, data.length));
                    current += localPageSize;

                    //Ad page to feed
                    feed.push.apply(feed, feedPage);

                    setTimeout(function() {
                        scope.loadingItems = false;
                    }, 0)
                }

                function loadMore() {

                    var past = current > data.length - 1;

                    if (past && source && !loadingFromServer && !loadComplete) {

                        if ($rootScope.currentFeedSort === 'virality') {
                            return;
                        }

                        loadingFromServer = true;

                        feedFetcher.fetchFromServer(source, serverPageSize, current).then(function(res) {

                            if (!res.length) {
                                loadComplete = true;
                                return;
                            }

                            Array.prototype.push.apply(data, res.filter(function(item) {
                                return !data.filter(function(_item) {
                                    return _item.id === item.id;
                                }).length
                            }));

                            insertItems();
                            scope.numberOfServerPageLoads++
                            loadingFromServer = false;
                        });
                    }

                    if (past) {
                        return;
                    }

                    insertItems();
                }

                scope.loadMore = loadMore;

                scope.playerVars = feedFetcher.constants.playerVars;
                scope.postClick = feedFetcher.event.postClick;
                scope.openSharer = feedFetcher.event.openSharer;
                scope.sendSlack = feedFetcher.event.sendSlack;
                scope.sourceClick = feedFetcher.event.sourceClick;
                scope.promotionClick = feedFetcher.event.promotionClick;
                scope.toggleFavorite = feedFetcher.event.toggleFavorite;
                scope.markNSFW = feedFetcher.event.markNSFW;
                scope.unmarkNSFW = feedFetcher.event.unmarkNSFW;
                
                scope.markHidden = function(item) {
                    feedFetcher.event.markHidden(item).then(function(response) {
                        var index = scope.feed.indexOf(item);

                        if (index > -1) {
                            scope.feed.splice(index, 1);
                        }
                    }); 
                }

                scope.videoClick = function(post, event) {
                    event.stopPropagation();
                    event.preventDefault();

                    feedFetcher.event.videoClick(post);
                };

                scope.openDNlink = function(e, link) {
                    e.stopPropagation();
                    e.preventDefault();
                    window.open(link);
                };

                scope.removeFavorite = function(event, index, item) {
                    event.preventDefault();
                    event.stopPropagation();

                    userService.setFavorite(item, false);

                    feed.splice(index, 1);
                    setTimeout(function() {
                        window.muzli.TriggerImageUpdate();
                    }, 0)
                };

                scope.addFeed = function(item, $event) {
                    $event.preventDefault();
                    $event.stopPropagation();

                    trackService.track({
                        category: 'SignIn',
                        action: 'Feed promo button click'
                    });

                    $rootScope.sources.filter(function(_item) {
                        return item.source.name === _item.name;
                    })[0]._enabled = true;

                    sources.sync($rootScope.sources.map(function(item) {
                        return {
                            name: item.name,
                            enabled: item._enabled,
                            lastRead: item.lastRead
                        };
                    }), true).then(function() {
                        $rootScope.vm.showSignInDialog = 'sourceFeedPromo';
                    });
                };

                if (checkDeleteLength) {
                    scope.$watch('feed.length', function(value, oldValue) {
                        if (value === 0 && oldValue) {
                            scope.blockEmpty = true;
                            $timeout(function() {
                                scope.blockEmpty = false;
                            }, 600);
                        }
                    });
                }

                var triggerImageUpdate = debounce(function () {

                    var viewPortThreshold = window.muzli.lazyLoading.viewPortThreshold;
                    var windowScroll = $window.scrollTop();

                    //Do not trigger offset hiding until user scrolls down to 10k px
                    if (windowScroll < 10000 && !scope.hideOutboundItems) {
                        return;
                    } else {
                        scope.hideOutboundItems = true;
                    }

                    scope.feed.forEach(function(item) {
                        if (windowScroll > item.offsetTop + viewPortThreshold) {
                            item.isOutside = true;
                        } else {
                            item.isOutside = false
                        }
                    })

                }, window.muzli.lazyLoading.imageDebounce);

                $(window).on('resize scroll', triggerImageUpdate);

                scope.$on("$destroy", function() {
                    $(window).off('resize scroll', triggerImageUpdate);
                })

                scope.$watch('items', function(items) {
                    if (items) {
                        init();
                        loadMore();
                    }
                });

                scope.$on('$stateChangeStart', function() {
                    scope.loadMore = null;
                });
            }
        };
    }

    angular.module('feed')
        .directive('scrollableFeed', scrollableFeed)
        .directive('muzliPlaceholder', ['$rootScope', function($rootScope) {
            return {
                restrict: 'A',
                scope: {
                    placeholder: '=ngPlaceholder'
                },
                link: function(scope, elem) {
                    $rootScope.$watch('activeSearch', function(value) {
                        if (!value) {
                            return;
                        }
                        elem[0].placeholder = value === 'muzli' ? 'Inspiration search' : 'Search Google or type URL';
                    });
                }
            }
        }]);

})();
