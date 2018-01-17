(function() {

    feedController.$inject = ['$scope', '$rootScope', '$stateParams', 'sources', 'serverPageSize', 'feedFetcher'];

    function feedController($scope, $rootScope, $stateParams, sources, serverPageSize, feedFetcher) {
        
        window.muzli.pageChange();
        
        $rootScope.$broadcast('muzliMoveToFullView');
        $rootScope.initScrollTracking($scope);

        var sourceName = $stateParams.name;
        var sort = $stateParams.sort;

        $scope.sponsored = {};

        feedFetcher.fetchSponsoredPost().then(function(sponsored) {
            $scope.sponsored = sponsored;
        });

        feedFetcher.fetch(sourceName, sort, serverPageSize).then(function(res) {
            var posts = res.data;
            var latest = res.latest;

            $scope.items = posts;

            // sync source as read to sources service
            if (sourceName === $rootScope.muzli.name) {
                $rootScope.muzli.read = true;
                $rootScope.muzli.latest = latest;
                sources.syncMuzli($rootScope.muzli, true);
            } else {
                var source = $rootScope.sources.filter(function(_source) {
                    return sourceName == _source.name;
                })[0];

                if (source) {
                    source.read = true;
                    source.latest = latest;
                    sources.sync($rootScope.sources);
                }
            }
        }).catch(function(error) {
            console.error(error);
            $rootScope.setError($scope, 'error');
        });
    }

    sourcesController.$inject = ['$scope', '$stateParams', '$rootScope', 'serverPageSize', 'feedFetcher'];

    function sourcesController($scope, $stateParams, $rootScope, serverPageSize, feedFetcher) {
        window.muzli.pageChange();
        $rootScope.$broadcast('muzliMoveToFullView');

        var sort = $stateParams.sort;

        $scope.sponsored = {};

        feedFetcher.fetchSponsoredPost().then(function(sponsored) {
            $scope.sponsored = sponsored;
        });

        feedFetcher.fetch(null, sort, serverPageSize).then(function(res) {
            $scope.items = res.data.map(function(item) {
                item.pick = item.source && item.source.name === 'muzli';
                return item;
            });
        }).catch(function(error) {
            console.error(error);
            $rootScope.setError($scope, 'error');
        });
    }

    config.$inject = ["$stateProvider"];

    function config($stateProvider) {
        $stateProvider.state('feed', {
            directSource: true,
            params: {
                name: 'muzli',
                sort: 'created'
            },
            templateUrl: 'modules/feed/feed.html',
            controller: feedController
        });

        $stateProvider.state('sources', {
            templateUrl: 'modules/feed/user-sources.html',
            params: {
                sort: 'created'
            },
            controller: sourcesController
        });
    }

    angular.module('infinite-scroll').value('THROTTLE_MILLISECONDS', window.muzli.paging.throttle);
    angular.module('feed', ['ngAnimate', 'sources', 'infinite-scroll'])
        .constant('localPageSize', window.muzli.paging.local)
        .constant('serverPageSize', window.muzli.paging.server)
        .config(config);

})();
