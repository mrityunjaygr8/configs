(function () {
  var $window = $(window);
  var scrollStart = false;
  var emptyImage = window.muzli.emptyImage;

  function setImage ($self, src) {
    if ($self.is("img")) {
      $self.attr("src", src);
    } else {
      $self.css("background-image", "url('" + src + "')");
    }
  }

  function loadImage (config) {
    
    config = config || {};

    var self = this;
    var $self = $(this);
    var useLoadedClass = config.useLoadedClass
    var src = config.image;
    var gif = config.gif;
    var isGif = config.isGif;
    var useEffect = config.useEffect;
    var currentSrc = $self.attr('src');

    if (!src) {
      src = $self.attr('muzli-lazy');
      gif = $self.attr('muzli-gif');
      isGif = $self.attr('muzli-is-gif');
    }

    if (currentSrc === src) {
      return;
    }

    if (useEffect) {
      $self.css({'opacity': '0'});
    }

    $('<img src="' + src + '"/>')
      .bind("error", function () {

        var parentTopLi = $self.parents('li');
        
        if (useLoadedClass) {
          $self.parents('.tile').addClass('imgLoaded');
        }

        $self.parents('.tile').addClass("image-error");
        $self.css({'opacity': '1'});

        if (config.fallbackImageSrc){
          $self.attr('src', config.fallbackImageSrc);
        } else {
          $self.attr('src', emptyImage);
        }

        parentTopLi.css({ 'background-image': 'none'});
      })
      .bind("load", function () {

        setImage($self, this.src);
        
        if (useLoadedClass) {
          $self.parents('.tile').addClass('imgLoaded');
        }

        if (useEffect) {
          $self.animate({'opacity': '1'}, 300);
        }

        if (gif && gif !== src) {

          var parent = $self.parents('.postPhoto');
          var parentTopLi = $self.parents('li');
          var cacheImage = new Image();
          cacheImage.src = gif;

          $(parentTopLi).mouseenter(function () {
            parent.addClass('loading-gif');
            parentTopLi.addClass('loading-gif');
            setImage($self, gif);
            $self.one('load', function () {
              parent.removeClass('loading-gif');
              parentTopLi.removeClass('loading-gif');
            });
          });

          $(parentTopLi).mouseleave(function () {
            $self.attr('src', src);
          });
        }

        else if (isGif) {

          if (!self.parentNode) {
            return;
          }

          var parentTopLi = $self.parents('li .tile');
          var parent = $self.parents('.tile .postPhoto');
          var canvas = document.createElement('canvas');

          var width = self.parentNode.offsetWidth;
          var height = self.parentNode.offsetHeight;

          canvas.width = width;
          canvas.height = height;

          parent.append(canvas);
          canvas.getContext('2d').drawImage(self, 0, 0, width, height);

          $self.remove();

          $(parentTopLi).mouseenter(function () {
            $self.attr('src', src);
            parent.append($self);
            $self.one('load', function () {
              $(canvas).hide();
            });
          });

          $(parentTopLi).mouseleave(function () {
            $self.attr('src', emptyImage);
            $self.remove();
            $(canvas).show();
          });
        }

      });
  }

  window.muzli.pageChange = function () {
    $('.tooltipsy').remove();
    $window.scrollTop(0);
    setTimeout(function () {
      scrollStart = false;
    }, 0);
  }

  lazyImage.$inject = ['$rootScope', '$timeout'];

  // For handling initial loading only the rest is handled by the $(window).on('resize scroll').
  function lazyImage ($rootScope, $timeout) {
    return {
      restrict: 'A',
      link: function (scope, elm) {

        // scope.thumbnail - video post
        // scope.item - regular post
        // !scope.thumbnail && !scope.item - promoted post

        //Set element's offset from top, to track it's position
        if (!$rootScope.feedVisibleClass) {
          $rootScope.$watch('feedVisibleClass', function(value) {
            if (value) {
              $timeout(function() {
                scope.item.offsetTop = elm.parents('li').offset().top;
              });
            }
          });
        } else {
          scope.item.offsetTop = elm.parents('li').offset().top;
        }

        //If window resizes, recalculate item position
        $(window).on('resize', function() {
          scope.item.offsetTop = elm.parents('li').offset().top;
        });

        if (!scope.thumbnail && !scope.item) {
          config.useEffect = true;
          setTimeout(function () {
            loadImage.call(elm[0], config)
          }, 0)
          return;
        }

        if (!scope.item.thumbnail && scope.item.vimeo) {
          return;
        }

        loadImage.call(elm[0], {
          scope: scope,
          useLoadedClass: !!elm.parents('#sticky').length,
          useEffect: !scope.numberOfServerPageLoads || scope.numberOfServerPageLoads < 2,
          image: scope.item.thumbnail  ? scope.item.thumbnail : scope.item.image,
          fallbackImageSrc: scope.item.fallbackImageSrc,
          gif: scope.item.thumbnail ? false : scope.item.gif,
          isGif: scope.item.thumbnail ? false : scope.item.isGif,
        });
      }
    };
  }

  angular.module('feed').directive('muzliLazy', lazyImage);

})();
