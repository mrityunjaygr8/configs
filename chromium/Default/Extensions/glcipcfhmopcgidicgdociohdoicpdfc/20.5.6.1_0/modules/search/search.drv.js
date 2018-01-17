angular.module('search').directive('lookahead', ['$rootScope', function ($rootScope) {
    return {
        restrict: 'A',
        link: function (scope, element) {
            
            element.autocomplete({
                classes: {
                    'ui-autocomplete': element.parents('header').length ? 'header-autocomplete' : ''
                },
                appendTo: element.parents('header').length ? 'body' : '#quickAccess .search',
                source: function(request, response) {
                    $.ajax({
                        url: "https://suggestqueries.google.com/complete/search?client=chrome&q=",
                        dataType: "jsonp",
                        data: {
                            q: request.term
                        },
                        success: function(data) {
                            response(data[1].splice(0, 15));
                        }
                    });
                },
                minLength: 1,
                select: function(event, ui) {

                    var value = ui.item.label;
                    $rootScope.searchText = value;
                    $rootScope.focusedSearchInput = element;

                    $rootScope.search(value);
                }
            });
        }
    };
}]);
