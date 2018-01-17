(function() {
    angular.module('muzli').factory('experiments', ['$q' ,'storage', function($q, storage) {

        var experiments;
        var resolveExperiments = $q.defer();

        storage.get('experiments', true).then(function (response) {
            experiments = response.experiments || [];
            resolveExperiments.resolve(experiments);
        });

        return {
            generateVariant: function(experimentName, variations) {

                var variant;

                if (!experimentName) {
                    console.error('No experiment name provided');
                    return;
                };

                if (!variations) {
                    variations = 2;
                };

                variant = Math.floor((Math.random() * variations) + 1);

                experiments.push({
                    name: experimentName,
                    variant: variant
                });

                storage.set({
                    experiments: experiments
                });

                return variant;

            },
            getExperiment: function(experimentName) {

                var _this = this;
                var experiment;

                return resolveExperiments.promise.then(function() {

                    //Lookup experiment
                    for (var i = experiments.length - 1; i >= 0; i--) {
                        if (experiments[i].name === experimentName) {
                            experiment = experiments[i];
                            break;
                        }
                    }

                    if (!experiment) {
                        return {
                            name: experimentName,
                            variant: _this.generateVariant(experimentName)
                        }
                    } 

                    return experiment;
                })
            }
        };
    }]);

})();
