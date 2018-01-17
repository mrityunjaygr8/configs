(function() {

    var details = window.muzli.getDetails();

    trackService.$inject = ['$window'];

    function trackService($window) {

        var guidPromise;

        return {
            getGuid: getGuid,
            onLoad: onLoad,
            track: track,
            trackError: trackError,
            setDimension: setDimension,
        };

        function getGuid(storage) {
            guidPromise = guidPromise || storage.get("UUID").then(function(obj) {
                var uuid = obj.UUID;
                if (!uuid) {
                    uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
                        var r = crypto.getRandomValues(new Uint8Array(1))[0] % 16 | 0,
                            v = c == 'x' ? r : (r & 0x3 | 0x8);
                        return v.toString(16);
                    });

                    storage.set({ 'UUID': uuid });
                }
                return uuid;
            });

            return guidPromise;
        }

        function onLoad(storage, sources_list, sites) {

            getGuid(storage).then(function(uuid) {
                _sendGAOnLoad({ label: 'User ID', value: uuid });
            });

            [
                { label: 'State', value: window.openedFromButton ? 'icon' : 'newtab' }
            ].forEach(_sendGAOnLoad);

            sites.authRecent().catch(function() {
                return false;
            }).then(function(value) {
                _sendGAOnLoad({
                    label: 'Most Visited',
                    value: value === false ? 'disabled' : 'enabled'
                });
            });

            if (!$window.localStorage.getItem('sentSideBarTacking')) {
                $window.localStorage.setItem('sentSideBarTacking', "yes");
                sources_list.forEach(function(source) {
                    _sendGA({
                        category: 'Sidebar',
                        action: 'Change',
                        label: 'Source: ' + source.name,
                        value: 1
                    });
                });
            }
        }

        function track(config) {
            _sendGA(config);
        }

        function setDimension(dimension, value) {

            if (dimension === 'dimension1') {
                console.error('Error: dimension1 is reserved for version tracking only');
                return;
            }

            try {
                window.ga('set', dimension, value);
            } catch (err) {
                console.error("Google analytics error", err);
            }
        }

        /**
         *
         * @param exception
         * @returns {boolean} should delegate to console
         */
        function trackError(exception, log) {
            // if ($window.trackJs) {
            //   if (typeof exception === 'string') {
            //     exception = new Error(exception);
            //   }
            //   $window.trackJs.track(exception);
            // }

            if (log) {
                console.error(exception);
            }

            return true; //!window._trackJs || (window._trackJs.enabled === false);
        }

        function _sendGA(config) {

            var category = config.category;
            var action = config.action;
            var label = config.label;
            var value = config.value;

            if (value) {
                ga('send', 'event', category, action, label, value);
            } else {
                ga('send', 'event', category, action, label);
            }

        }

        function _sendGAOnLoad(config) {
            config.category = 'App';
            config.action = 'Load';
            _sendGA(config);
        }
    }

    angular.module('muzli').factory('trackService', trackService);

})();
