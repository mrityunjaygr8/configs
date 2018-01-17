(function() {

    searchController.$inject = ['$scope', '$rootScope', '$stateParams', '$state', 'searchService'];

    function searchController($scope, $rootScope, $stateParams, $state, searchService) {

        window.muzli.pageChange();

        $("#searchBox").focus();

        var data;
        var q = $stateParams.q;
        var sources = getCurrentSources();

        function getCurrentSources() {
            return [];
        }

        $rootScope.feedVisibleClass = 'halfView';
        $rootScope.initialLoading = 'loading-complete';

        var initialLoad = searchService.fetch(q, sources).then(function(_data) {
            data = _data;
            $scope.items = _data;
        });

        initialLoad.catch(function() {
            $rootScope.setError($scope, 'error');
        });

        $scope.$on('muzli:search:filter', function() {

            var newSources = getCurrentSources();
            if (newSources.length > sources.length) {
                $state.go('search', { q: q }, { reload: true });
            }

            initialLoad.then(function() {
                $scope.items = data.filter(function(item) {
                    return $rootScope.searchFilters.sources[item.source.name];
                });
            });
        });
    }

    config.$inject = ['$stateProvider'];

    function config($stateProvider) {

        $stateProvider.state('search', {
            params: {
                q: ''
            },
            templateUrl: 'modules/search/search.html',
            controller: searchController
        });
    }

    run.$inject = ['$rootScope', '$state', 'trackService', 'userService', 'storage'];

    function run($rootScope, $state, trackService, userService, storage) {

        storage.get('default_search').then(function(res) {
            setSearch(res);
            userService.getData().then(function(user) {
                if (user.default_search) {
                    setSearch(user);
                    storage.set({ default_search: user.default_search });
                }
            });
        });

        $rootScope.setDefaultSearch = setDefaultSearch;
        $rootScope.search = search;

        $rootScope.searchFilters = {
            sources: {
                dribbble: true,
                muzli: true
            }
        };

        $rootScope.toggleSearchSource = function(name) {
            $rootScope.searchFilters.sources[name] = !$rootScope.searchFilters.sources[name];
            $rootScope.$broadcast('muzli:search:filter');
        };

        function setSearch(res) {
            $rootScope.defaultSearch = res.default_search || 'google';
            $rootScope.activeSearch = $rootScope.defaultSearch;
        }

        function setDefaultSearch(type) {
            $rootScope.defaultSearch = type;
            $rootScope.activeSearch = $rootScope.defaultSearch;
            userService.setData({ default_search: type });

            trackService.track({
                category: 'Settings',
                action: 'Change search provider',
                label: type
            });
        }

        function search(text, event, searchType) {

            var element;

            if (event) {
              element = $(event.target).find('input');
            } else {
              element = $rootScope.focusedSearchInput;
            };

            if (!text) {
                $(element).focus();
                return;
            }

            $(element).blur();

            searchType = searchType || $rootScope.activeSearch;

            $rootScope.searchText = text;

            if (searchType === 'muzli') {
                $rootScope.activeSearch = searchType;
                $('main').off("wheel scroll");
            }

            trackService.track({
                category: 'Search',
                action: 'Submit ' + (searchType || 'google'),
                label: text
            });

            if (text.indexOf("http://") > -1 || text.indexOf("https://") > -1) {
                document.location = text;
            } else if (searchType === 'muzli') {
                if (event) {
                    event.preventDefault();
                    event.stopPropagation();
                }

                $state.go('search', { q: text }, { reload: true });

            } else if (searchType === 'google') {
                document.location = "http://google.com/search?q=" + encodeURIComponent(text);
            }
        }

        function escapeRegExp(string) {
            return string.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"); // $& means the whole matched string
        }

        $.ui.autocomplete.prototype._renderItem = function(ul, item) {
            var urlClass;
            var t = String(item.value).replace(
                new RegExp(escapeRegExp(this.term), "gi"),
                "<span class='ui-state-highlight'>$&</span>");
            if (t.indexOf("http://") != -1 || t.indexOf("https://") != -1) {
                urlClass = 'url'
            }
            return $("<li class=" + urlClass + "></li>")
                .data("item.autocomplete", item)
                .append("<a>" + t + "</a>")
                .appendTo(ul);
        };
    }


    angular.module('search', [])
        .config(config)
        .run(run);

})();
