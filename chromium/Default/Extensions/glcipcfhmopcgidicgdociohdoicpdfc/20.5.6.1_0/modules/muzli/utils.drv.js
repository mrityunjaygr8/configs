(function() {

    function muzliTooltip($timeout) {

        function hideToolTip(jEl) {
            var tooltip = jEl.data('tooltipsy');

            if (jEl.not(':visible')) {
                jEl.pauseTooltip = true;

                if (tooltip) {
                    tooltip.hide();
                }
            }

            $timeout(function() {
                jEl.pauseTooltip = false;
                if (tooltip) {
                    tooltip.hide();
                }
            }, 400);
        }

        return {
            restrict: 'A',
            link: function(scope, el, attributes) {

                var offset = [0, 10];

                if (attributes.titleTop) {
                    offset = [0, -10];
                }

                setTimeout(function() {
                    var jEl = $(el);
                    if (jEl.length) {
                        
                        jEl.tooltipsy({ 
                            offset: offset,
                            className: attributes.titleTop ? 'tooltipsy top' : 'tooltipsy',
                            show: function (e, $el) {
                                if (!jEl.pauseTooltip) {
                                    $el.show();
                                }
                            } 
                        })
                        .on('click', hideToolTip.bind(this, jEl));
                    }
                }, 0);
            }
        };
    }

    angular.module('muzli').directive('title', ['$timeout', muzliTooltip]);

    angular.module('muzli').directive('autofocus', ['$timeout', function($timeout) {
        return {
            restrict: 'A',
            link: function($scope, $element, $attributes) {
                $timeout(function() {
                    $element[0].focus();
                }, $attributes.autofocus || 0);
            }
        }
    }]);

    angular.module('muzli').directive('clickCopy', [function() {
        return {
            restrict: 'A',
            link: function($scope, $element, $attributes) {

                $element.click(function() {

                    document.oncopy = function(event) {
                        event.clipboardData.setData('text/plain', $attributes.clickCopy);
                        event.preventDefault();
                        
                        $scope.copySuccess = true;

                        setTimeout(function() {
                            $scope.copySuccess = false;
                        }, 1000);
                    };

                    document.execCommand("Copy", false, null);
                })
            }
        }
    }]);

    angular.module('muzli').directive('scrollEvents', ['$timeout', function($timeout) {
        return {
            restrict: 'A',
            link: function($scope, $element, $attributes) {

                var preloadOffsetRatio = 2;
                var customScrollbar = false;
                var scrollTimeout;
                var wheelTimeout;
                var wrapper;
                var container;
                var customScrollbarContainer;

                var _initScrollEvents = function() {

                    $(wrapper).scroll(function(event) {

                        if (!!scrollTimeout) {
                            clearTimeout(scrollTimeout);
                        }

                        scrollTimeout = setTimeout(function() {
                            $scope.checkScrollPosition();
                        }, 200);
                    });

                    $(wrapper).bind('mousewheel', function(event) {

                        if (!!scrollTimeout) {
                            clearTimeout(scrollTimeout);
                        }

                        if (event.originalEvent.wheelDelta / 120 < 0) {

                            if (!wheelTimeout) {

                                $scope.checkScrollPosition();

                                wheelTimeout = setTimeout(function() {
                                    clearTimeout(wheelTimeout);
                                    wheelTimeout = false;
                                }, 500);
                            }
                        }
                    });
                };

                $scope.checkScrollPosition = function() {

                    var scrolledOffset = (wrapper === window) ? window.scrollY : container.scrollTop
                    var offsetBottom = container.scrollHeight - container.clientHeight;

                    //Compensate for scrolled distance
                    offsetBottom -= scrolledOffset;

                    //Compensate for custom scrollbar working with absolute positioning
                    offsetBottom += customScrollbarContainer ? customScrollbarContainer.position().top : 0;

                    if (offsetBottom < preloadOffsetRatio * container.clientHeight) {
                        $scope.$emit('scrollAtBottom');
                    }
                };

                $scope.initScrollEvents = function() {
                    _initScrollEvents();
                };


                /*============================
                =            Init            =
                ============================*/

                //Manual init
                if ($attributes.scrollEventsInit === 'manual') {

                    $scope.$on('initScrollEvents', function () {

                        container = $element.parent().get(0);
                        wrapper = container;

                        _initScrollEvents();
                    });

                    $scope.$on('checkScrollPosition', function () {

                        if (!container) {
                            return;
                        }

                        $scope.checkScrollPosition();
                    });

                    return;
                };

                //Window level scroll
                if ($attributes.scrollEventsInit === 'window') {
                    
                    wrapper = window;
                    container = $('body').get(0);

                    _initScrollEvents();

                    return;
                };

                //Auto init
                container = $element.parent().get(0);

                if ($(container).is('body')) {
                    wrapper = window;
                } else {
                    wrapper = container;
                }

                _initScrollEvents();
                
            }
        }
    }]);

    angular.module('muzli').directive('bindHtmlCompile', ['$compile', function ($compile) {
        return {
            restrict: 'A',
            link: function (scope, element, attrs) {
                scope.$watch(function () {
                    return scope.$eval(attrs.bindHtmlCompile);
                }, function (value) {
                    element.html(value);
                    $compile(element.contents())(scope);
                });
            }
        };
    }]);

    angular.module('muzli').directive('checkVisibility', ['$timeout', function($timeout) {
        return {
            restrict: 'A',
            link: function($scope, $element, $attributes) {
                if ($element.is(':visible')) {
                    $scope.item.isVisible = true;
                }
            }
        }
    }]);

    angular.module('muzli').filter('filterVisible', [function() {
        return function(items) {
            return items.filter(function(item) {
                return !item.isVisible;
            })
        }
    }]);

    angular.module('muzli').filter('thousandSuffix', [function () {
        return function (input, decimals) {

            var suffixes = ['k', 'M', 'G', 'T', 'P', 'E'];
            var rounded;
            var exp;

            if (window.isNaN(input)) {
                return null;
            }

            if (input < 1000) {
                return input;
            }

            exp = Math.floor(Math.log(input) / Math.log(1000));

            return (input / Math.pow(1000, exp)).toFixed(decimals) + suffixes[exp - 1];
        };
    }]);

    angular.module('muzli').directive('selectOnClick', [function () {
        return {
            restrict: 'A',
            link: function (scope, element) {
                element.bind('click', function () {
                    this.select();
                });
            }
        };
    }]);

})();