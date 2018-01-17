/* global YT */
angular.module('feed')
  .directive('muzliVideo', ['$http', function ($http) {

    return {
      restrict: 'EA',
      template: '<div ng-click="::imageClicked()" ng-class="{ thumbnail: showThumbnail }" class="angular-youtube-wrapper">' +
        '<img ng-if="showThumbnail && item.thumbnail" src="' + window.muzli.emptyImage + '" muzli-lazy="{{::item.thumbnail}}">' +
        '<div ng-if="showThumbnail && item.thumbnail" class="player-image"></div>' +
        '<iframe ng-if="!showThumbnail" ng-src="{{::item.video}}" frameborder="0" allowfullscreen webkitallowfullscreen mozallowfullscreen>' +
      '</div>',
      link: function (scope, el) {
        scope.showThumbnail = true;
        scope.item.isPlaying = false;

        scope.imageClicked = function () {
          scope.showThumbnail = false;
          scope.item.isPlaying = true;
        };

        if (!scope.item.thumbnail && scope.item.vimeo) {
          $http.get('https://vimeo.com/api/v2/video/' + scope.item.videoId + '.json', {
            skipAuth: true
          }).then(function (res) {
            scope.item.thumbnail = res.data[0].thumbnail_large;
          }).catch(function(){
            el.parents('.postPhoto').addClass('image-error');
          })
        }
      }
    }
  }]);
