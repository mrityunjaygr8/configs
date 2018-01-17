(function() {

    feedFetcher.$inject = ['R', '$rootScope', '$http', '$timeout', '$q', '$sce', 'sources', 'userService', 'trackService', 'server', 'storage', 'socialService'];

    function feedFetcher(R, $rootScope, $http, $timeout, $q, $sce, sources, userService, trackService, server, storage, socialService) {
        var gifTest = /\.(gif)/i;
        var youtube = 'https://www.youtube.com/embed/{id}?rel=0&amp;showinfo=0&autoplay=true';
        var vimeo = 'https://player.vimeo.com/video/{id}?title=0&byline=0&portrait=0&autoplay=true';
        var youtubeThumbnail = 'http://img.youtube.com/vi/{id}/mqdefault.jpg';
        var fetchedMuzliFeed;
        var cancelers = {};
        var sub_sources = {
            '1st_web_designer': '1stWebDesigner',
            'alex_Ikonn': 'Alex Ikonn',
            'basti_hansen': 'Basti Hansen',
            'brent_galloway': 'Brent Galloway',
            'casey_neistat': 'Casey Neistat',
            'charli_marie_tv': 'CharliMarieTV',
            'citizine': 'Citizine',
            'dann_petty': 'Dann Petty',
            'dev_tips': 'DevTips',
            'flux': 'Flux',
            'joshua_pomeroy': 'Joshua Pomeroy',
            'mackenzie_child': 'Mackenzie Child',
            'roberto_blake': 'Roberto Blake',
            'sara_dietschy': 'Sara Dietschy',
            'the_skool_network': 'The Futur',
            'tim_kellner': 'Tim Kellner',
            'tobias_van_schneider': 'Tobias van Schneider',
            'will_paterson': 'Will Paterson',
            'design_inc': 'Design Inc',
            'gary_vaynerchuk': 'Gary Vaynerchuk',
            'matt_d_smith': 'Matt D. Smith',
            'timmy_ham': 'Timmy Ham',
            'high_resolution': 'High Resolution',
            'mike_locke': 'Mike Locke',
            'ux_hacker': 'UX Hacker'
        };

        var transforms = {
            dribbble: function(post) {
                return {
                    stats: {
                        comments: post.comments_count,
                        likes: post.likes_count,
                        views: post.views_count
                    }
                }
            },
            producthunt: function(post) {
                return {
                    stats: {
                        likes: post.likes_count
                    }
                }
            },
            muzli: function(post) {
                var source = post.link.replace('http://', '').replace('https://', '').replace('www.', '').split(/[/?#]/)[0];

                return {
                    source: {
                        title: source,
                        name: 'muzli'
                    }
                }
            },
            art_station: function(post) {
                return {
                    image: post.image.replace(/https:\/\/artstation.com\/assets\/emoji\/(.*)/, window.muzli.imageLocation + '/images/artstation_bg.png')
                }
            },
            npr: generateImageFallbackFunction('facebook-default.jpg', 'npr_bg.png'),
            hacker_news: generateImageFallbackFunction('forbes_1200x1200.jpg', 'hn_bg.png'),
            forbes: generateImageFallbackFunction('forbes_1200x1200.jpg', 'forbes_bg.png'),
            swiss_miss: generateImageFallbackFunction('blank.jpg', 'swiss-miss_bg.png'),
            fox_news: generateImageFallbackFunction('og-fn-foxnews.jpg', 'fox_news_bg.png'),
            kottke: generateImageFallbackFunction('apple-touch-icon.png', 'kottke_bg.png'),
            quipsologies: generateImageFallbackFunction(null, 'underconsideration_bg.png'),
            designer_news: generateImageFallbackFunction(null, 'dn_bg.png'),
            alistapart: generateImageFallbackFunction(null, 'alistapart_bg.png'),
            sidebar: generateImageFallbackFunction(null, 'sidebar_bg.png'),
            cnn: generateImageFallbackFunction('cnn_bg.jpg', 'cnn_bg.png'),
            abc_news: generateImageFallbackFunction(null, 'abc_bg.png'),
            nytimes: generateImageFallbackFunction(null, 'nytime_bg.png'),
            its_nice_that: generateImageFallbackFunction(null, 'itsnicethat_bg.png'),
            brandnew: generateImageFallbackFunction(null, 'brandnew_bg.png'),
            astcodesign: generateImageFallbackFunction(null, 'astcodesign_bg.png'),
            designspiration: generateImageFallbackFunction(null, 'designspiration_bg.png'),
            recode: generateImageFallbackFunction(null, 'recode_bg.png'),
            product_hunt: generateImageFallbackFunction(null, 'product_hunt_bg.png'),
            fastcompany: generateImageFallbackFunction(null, 'fastcompany_bg.png'),
            adweek: generateImageFallbackFunction(null, 'adweek_bg.png'),
            entrepreneur: generateImageFallbackFunction(null, 'entrepreneur_bg.png'),
            'default': function() {
                return {}
            }
        };

        var fetchPromotion = $http({
            method: 'GET',
            url: window.MUZLI_AD_SERVER + '/page/ad'
        }).then(function(res) {
            var ad = res.data

            return {
                active: false,
                beacon: ad.beacon,
                image: ad.image,
                link: ad.link,
                name: ad.name,
                channel: 'sponsored'
            };
        });

        $rootScope.$on('muzli:update:favorite', function(event, params) {
            if (!fetchedMuzliFeed) {
                return;
            }
            fetchedMuzliFeed.then(function(muzli) {
                muzli.feed.forEach(function(item) {
                    if (item.id === params.id) {
                        item.favorite = params.favorite;
                    }
                });

                return setCache(muzli);
            });
        });

        $rootScope.$on('muzli:clear:favorite', function() {
            if (!fetchedMuzliFeed) {
                return;
            }
            fetchedMuzliFeed.then(function(muzli) {
                muzli.feed.forEach(function(item) {
                    item.favorite = false;
                });

                return setCache(muzli);
            });
        });

        function generateImageFallbackFunction(name, image) {

            return function(post) {

                var fallbackImage = !post.image || (name && post.image.indexOf(name) > 0);

                return {
                    image: fallbackImage ? (window.muzli.imageLocation + '/images/' + image) : post.image,
                    fallbackImage: fallbackImage,
                    fallbackImageSrc: window.muzli.imageLocation + '/images/' + image,
                }
            }
        }

        function extractDomain(url) {

            var domain;

            //find & remove protocol (http, ftp, etc.) and get domain
            if (url.indexOf("://") > -1) {
                domain = url.split('/')[2];
            } else if (url.indexOf('/') === -1) {
                return null;
            } else {
                domain = url.split('/')[0];
            }

            //find & remove port number
            domain = domain.split(':')[0];

            if (domain.indexOf('.') === -1) {
                return null;
            }

            return domain;
        }

        function transformImage(item) {

            var image = item.image;

            if (!image || typeof image !== 'string') {
                return {
                    image: ''
                }
            }

            if (image[0] === '/' && image[1] === '/') {
                image = 'http:' + image;
            }

            if (!extractDomain(image)) {

                var url = item.external_url || item.link;
                var domain = image[0] === '/' ? extractDomain(url) : url;

                if (domain[domain.length - 1] !== '/') {
                    domain = domain + '/';
                }

                image = domain + image;
            }

            if (!/^https?:\/\//i.test(image)) {
                image = 'http://' + image;
            }

            return {
                image: image
            }
        }

        function transformVideo(item) {

            if (item.youtube) {
                return {
                    thumbnail: (item.image && item.image.indexOf('ytimg') > -1) ? item.image : youtubeThumbnail.replace('{id}', item.youtube),
                    video: $sce.trustAsResourceUrl(youtube.replace('{id}', item.youtube)),
                    videoId: item.youtube
                }
            }

            if (item.vimeo) {
                return {
                    video: $sce.trustAsResourceUrl(vimeo.replace('{id}', item.vimeo)),
                    videoId: item.vimeo
                }
            }


            if (item.source && item.source.name === 'vlogs') {
                return {
                    thumbnail: (item.image && item.image.indexOf('ytimg') > -1) ? item.image : youtubeThumbnail.replace('{id}', item.id),
                    video: $sce.trustAsResourceUrl(youtube.replace('{id}', item.id)),
                    videoId: item.id
                }
            }

            return {};
        }

        function transformSource(item) {
            var res = {
                source: sources.findByName(item.source)
            };

            if (item.sub_source) {
                res.sub_source = {
                    title: sub_sources[item.sub_source] || item.sub_source,
                    name: item.sub_source
                }
            }

            return res;
        }

        function transformAnimation(item) {
            var res = {};
            var isGif = item.gif || gifTest.test(item.image) && item.source && item.source.name !== 'behance';
            if (isGif) {
                res.isGif = true;
                res.animated = true;
            }
            return res;
        }

        function transformVirality(item, virality) {
            var isViral = item.virality > 1 && item.virality >= virality[item.source] * 1.7;
            return isViral ? {
                viralTimes: Math.ceil(item.virality / (virality[item.source] || 1))
            } : {};
        }

        function transformFetch(data, virality, proxy_server) {
            data = _dedupeData(data);

            return data.filter(function(item) {
                return !!item.link;
            }).map(function(post) {
                var transform = (post.source && transforms[post.source]) ? transforms[post.source] : transforms['default'];
                post = angular.extend(post, transformVirality(post, virality));
                post = angular.extend(post, transformImage(post));
                post = angular.extend(post, transformSource(post));
                post = angular.extend(post, transformVideo(post));
                post = angular.extend(post, transformAnimation(post));
                post = angular.extend(post, transform(post));

                var url = (post.source && post.source.name === 'designer_news') ? (post.external_url || post.link) : post.link;
                if (proxy_server) {
                    post.link_out = proxy_server + '/go?link=' + encodeURIComponent(url)
                    post.link_out_direct = proxy_server + '/go?link=' + encodeURIComponent(post.link)

                    if (post.source && post.source.name) {
                        post.link_out += ('&source=' + post.source.name)
                        post.link_out_direct += ('&source=' + post.source.name)
                    }
                    if (post.id) {
                        post.link_out += ('&post=' + post.id)
                        post.link_out_direct += ('&post=' + post.id)
                    }
                } else {
                    post.link_out = url;
                    post.link_out_direct = post.link;
                }

                if (post.source) {
                    post.tooltip = 'More from ' + (post.source.name === 'muzli' ? 'our picks' : post.source.title);
                }

                post.title = post.title || '';
                post.viralTimesText = !!post.viralTimes ? ('At least ' + post.viralTimes + ' times more shares than usual') : ((post.virality || 0).toLocaleString('en') + ' shares');

                return post;
            });
        }

        function setCache(data) {
            if (data && data.feed && data.feed.length) {
                storage.set({ 'cachedFeed': data });
                fetchedMuzliFeed = $q(function(resolve) {
                    resolve(angular.copy(data));
                });
            } else {
                storage.remove('cachedFeed');
            }
        }

        function fetchFromCache() {
            fetchedMuzliFeed = storage.get("cachedFeed", true).then(function(obj) {
                if (obj && obj.cachedFeed && obj.cachedFeed.feed) {
                    if (obj.cachedFeed.feed.length) {
                        return obj.cachedFeed;
                    } else {
                        return $q.reject('Muzli Feed Cache Is Empty');
                    }
                } else {
                    return $q.reject('No Muzli Feed Cache');
                }
            });

            return fetchedMuzliFeed.then(function(res) {
                return angular.copy(res);
            });
        }

        function fetchFromServer(name, sort, limit, skip) {
            var cancelerName = name ? 'source' : 'all';
            if (cancelers[cancelerName]) {
                cancelers[cancelerName].resolve();
            }

            var params = {
                sort: sort
            };

            if (limit) {
                params.limit = limit;
            }

            if (skip) {
                params.skip = skip;
            }

            var weights = name ? $q.when(null) : sources.getWeightedSources();
            var selectedBundle = name ? $q.when(null) : userService.getData().then(function(user) {
                return user.anonymous && user.selectedBundle
            }).catch(function() {
                return null;
            })

            return $q.all([selectedBundle, weights]).then(function(res) {
                var selectedBundle = res[0];
                var weightedSources = res[1];

                if (weightedSources && weightedSources.length) {
                    weightedSources.forEach(function(source) {
                        params[source.name] = source.weight;
                    });
                }

                if (selectedBundle) {
                    params.bundle_type = selectedBundle
                }

                var canceler = cancelers[cancelerName] = $q.defer();

                $timeout(function() {
                    canceler.resolve();
                }, 1000 * 10);

                return $http({
                    method: 'GET',
                    url: server + '/feed/' + (name || ''),
                    params: params,
                    timeout: canceler.promise
                }).then(function(res) {
                    const data = res.data;
                    const similarSources = data.topSimilarSources;
                    const skip = 15;

                    if (similarSources) {
                        similarSources.forEach(function(item, index) {
                            const post = Math.floor(Math.random() * 4) + (index * 4) + (skip * index);

                            item.promotion = true;
                            data.feed.splice(post, 0, item);
                        });
                    }

                    return data;
                });
            });
        }

        function countClick(id) {
            if (!MUZLI_APP || !id) {
                return;
            }

            return $http({
                method: 'POST',
                url: MUZLI_APP + '/clicks/' + id
            });
        }

        function fetchAndCachePromise(name, sort, limit) {

            function fetchAndCache() {
                var fetch = fetchFromServer(name, sort, limit, 0);
                fetch.then(setCache);
                return fetch
            }

            if (name === 'muzli') {
                var fetch = fetchAndCache();

                return $q(function(resolve, reject) {
                    fetch.then(resolve);
                    $timeout(reject, 500);
                }).catch(fetchFromCache).catch(function() {
                    return fetch;
                });

            } else if (name === 'favorites') {
                return userService.getFavorites();
            } else {
                return fetchFromServer(name, sort, limit);
            }
        }

        function _dedupeData(data) {
            data = R.uniqBy(function(item) {
                return item.id ? item.id : item.link;
            }, data);

            return R.uniqBy(function(item) {
                return item.id ? (item.id + ':' + item.link) : item.link;
            }, data);
        }

        function openSlack(url, item) {

            window.muzliOpenWindow(url, 'Post To Slack');

            trackService.track({
                category: 'Feed',
                action: 'Share',
                label: 'slack',
            });
        }

        return {
            transformFetch: transformFetch,

            fetchFromServer: function(source, serverPageSize, current) {

                var req = {
                    sources: null,
                    home: null,
                    'all': null,
                    'home-muzli': 'muzli',
                    'all-muzli': 'muzli'
                }[source];

                if (req === undefined) {
                    req = source;
                }

                return fetchFromServer(req, 'date', serverPageSize, current).then(function(res) {
                    if (res.proxy_server) {
                        window.MUZLI_APP = res.proxy_server;
                    }
                    return transformFetch(res.feed, res.viralityMedian, res.proxy_server);
                })

            },
            fetch: function(name, sort, limit) {
                return fetchAndCachePromise(name, sort, limit).then(function(res) {
                    if (res.proxy_server) {
                        window.MUZLI_APP = res.proxy_server;
                    }
                    return {
                        data: transformFetch(res.feed, res.viralityMedian, res.proxy_server),
                        latest: res.latest
                    }
                });
            },
            fetchSponsoredPost: function() {
                return fetchPromotion;
            },
            constants: {
                playerVars: {
                    rel: 0,
                    controls: 0,
                    showinfo: 0
                }
            },
            event: {
                sendSlack: function(e, item) {
                    e.preventDefault();
                    e.stopImmediatePropagation();

                    //Add promo flag to distinquish if share was triggered via promotion
                    if (item.displaySharePromo) {
                        item.displaySharePromo = false;
                        $('.tooltipsy').remove();
                    }

                    storage.set({
                        slack_send: {
                            link: item.link,
                            title: item.title,
                            image: item.image
                        }
                    });
                    var url = window.muzli.slackLocation;
                    if (window.muzli.isSafari) {
                        url += ('?slack_link=' + encodeURIComponent(link));
                    }

                    openSlack(url, item);
                },
                openSharer: function(e, channel, post) {

                    e.preventDefault();
                    e.stopImmediatePropagation();

                    socialService.share(channel, post.link, post.title, 'usemuzli design inspiration');

                    //Add promo flag to distinquish if share was triggered via promotion
                    if (post.displaySharePromo) {
                        channel += '-promo';
                        post.displaySharePromo = false;
                        $('.tooltipsy').remove();
                    }

                    trackService.track({
                        category: 'Feed',
                        action: 'Share',
                        label: channel,
                    });
                },
                postClick: function(post, event, type) {

                    //Ignore all mouse buttons except primary and middle
                    if (event.button !== 0 && event.button !== 1) {
                        return;
                    };

                    //Ognore click if share promo is activated
                    if (post.displaySharePromo) {
                        event.preventDefault();
                        return;
                    }

                    //Experimental feture to promote shares
                    if ($rootScope.recentlyClickedPost) {
                        $rootScope.recentlyClickedPost.displaySharePromo = false;
                    }

                    $rootScope.recentlyClickedPost = post;

                    if (!post.video) {
                        $(window).one('focus', function() {
                            $timeout(function() {
                                post.displaySharePromo = true;
                            }, 1000);
                        });
                    }


                    return trackService.track({
                        category: 'Feed',
                        action: 'Click',
                        label: post.link
                    });
                },
                videoClick: function(post, type) {
                    countClick(post.id);

                    return trackService.track({
                        category: 'Feed',
                        action: 'Play Video',
                        label: post.title
                    });
                },
                sourceClick: function(e, source) {

                    e.stopImmediatePropagation();

                    trackService.track({
                        category: 'Feed',
                        action: 'Filter',
                        label: source
                    });
                },
                promotionClick: function() {
                    trackService.track({
                        category: 'Promoted',
                        action: 'Click'
                    });
                },
                toggleFavorite: function(event, item) {
                    event.preventDefault();
                    event.stopPropagation();

                    userService.setFavorite(item, !item.favorite);
                },
                markNSFW: function(item) {

                    var params = {
                        id: item.id
                    };

                    return $http.post(server + '/feed/mark/nsfw', params).then(function (response) {
                        item.userNSFW = true;
                        item.showMenu = false;
                    })
                },
                unmarkNSFW: function(item) {

                    var params = {
                        id: item.id
                    };

                    return $http.post(server + '/feed/unmark/nsfw', params).then(function (response) {
                        item.userNSFW = false;
                        item.showMenu = false;
                    })
                },
                markHidden: function(item) {

                    var params = {
                        id: item.id
                    };

                    return $http.post(server + '/feed/mark/hidden', params);
                },
            }
        }
    }

    angular.module('feed')
        .factory('feedFetcher', feedFetcher);

})();
