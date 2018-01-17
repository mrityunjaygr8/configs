angular.module('muzli-template', [])
  .run(['$templateCache', function($templateCache) {
    $templateCache.put('modules/feed/feed.drv.html',
    '<section id="feed"><!-- Feed posts -->\n' +
    '\n' +
    '<ul class="cf"\n' +
    '	infinite-scroll=\'::loadMore()\'\n' +
    '	infinite-scroll-distance=\'::infiniteScrollDistance\'\n' +
    '	infinite-scroll-immediate-check=\'false\'\n' +
    '	infinite-scroll-disabled=\'!feed.length\'>\n' +
    '\n' +
    '	<li class=\'sponsored\' ng-if="feed.length && sponsored">\n' +
    '\n' +
    '		<div class="tile">\n' +
    '			<a target=\'_blank\' class="feedLink" ng-href="{{::sponsored.link}}" ng-click="::promotionClick()">\n' +
    '				<div class="postPhoto">\n' +
    '					<img ng-if="!sponsored.image || !sponsored.active" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAMAAAAoyzS7AAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAAZQTFRFAAAAAAAApWe5zwAAAAF0Uk5TAEDm2GYAAAAMSURBVHjaYmAACDAAAAIAAU9tWeEAAAAASUVORK5CYII=" alt=""/>\n' +
    '					<img ng-if="sponsored.image && sponsored.active" ng-src="{{::sponsored.image}}" alt=""/>\n' +
    '					<img class="beacon" style="visibility: hidden;" ng-src="{{::sponsored.beacon}}" alt=""/>\n' +
    '				</div>\n' +
    '				<div class="postInfo">\n' +
    '					<h3>{{::sponsored.name}}</h3>\n' +
    '					<h4>PROMOTED</h4>\n' +
    '				</div>\n' +
    '\n' +
    '			</a>\n' +
    '		</div>\n' +
    '	</li>\n' +
    '\n' +
    '	<li feed-item ng-repeat="item in feed track by (item.id || item.link)"\n' +
    '	ng-class="::{\n' +
    '		article: item.source.article && !item.video,\n' +
    '		visited: item.visited,\n' +
    '		viral: !!item.viralTimes,\n' +
    '		hasStats: item.hasStats, pick: item.pick,\n' +
    '		animated: !!item.animated,\n' +
    '		video: !!item.video,\n' +
    '		playing: item.isPlaying,\n' +
    '		vlog: !!item.sub_source,\n' +
    '		nsfw: !!item.nsfw || !!item.userNSFW,\n' +
    '		feedSuggest: !!item.promotion,\n' +
    '		fallbackImage: item.fallbackImage,\n' +
    '		showSharePromo: item.displaySharePromo,\n' +
    '		outside: item.isOutside,\n' +
    '		showMenu: item.showMenu,\n' +
    '		}"\n' +
    '	class="angular-animate"\n' +
    '	data-muzli-id="{{::item.id}}">\n' +
    '\n' +
    '		<div class="tile">\n' +
    '\n' +
    '			<a target="_blank" ng-href="{{::item.link_out}}" class="feedLink" ng-mousedown="::postClick(item, $event)">\n' +
    '\n' +
    '				<div class="postPhoto" >\n' +
    '\n' +
    '					<img ng-if="::!item.video" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAMAAAAoyzS7AAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAAZQTFRFAAAAAAAApWe5zwAAAAF0Uk5TAEDm2GYAAAAMSURBVHjaYmAACDAAAAIAAU9tWeEAAAAASUVORK5CYII=" muzli-lazy="{{::item.image}}" muzli-gif="{{::item.gif}}" muzli-is-gif="{{::item.isGif}}" src="" alt="" />\n' +
    '\n' +
    '					<muzli-video ng-if="::item.video" ng-click="::videoClick(item, $event)"></muzli-video>\n' +
    '\n' +
    '					<div class="share-promo" ng-if="item.displaySharePromo">\n' +
    '						<div class="share">\n' +
    '							<h4>Nice! Maybe your friends will also enjoy this?</h4>\n' +
    '							<span class="facebook icon-facebook" ng-click="::openSharer($event, \'facebook\', item)" title="Share on Facebook"></span>\n' +
    '							<span class="twitter icon-twitter" ng-click="::openSharer($event, \'twitter\', item)" title="Share on Twitter"></span>\n' +
    '							<span class="linkedin icon-linkedin" ng-click="::openSharer($event, \'linkedin\', item)" title="Share on LinkedIn"></span>\n' +
    '							<span class="slack icon-slack" ng-click="::sendSlack($event, item)" title="Share on Slack"></span>\n' +
    '						</div>\n' +
    '					</div>\n' +
    '\n' +
    '					<span class="viral-badge" title="That\'s hot"></span>\n' +
    '				</div>\n' +
    '\n' +
    '				<div class="postInfo">\n' +
    '\n' +
    '					<div class="source-wrapper">\n' +
    '						<span class="source _{{::item.source.name}}" title="{{::item.tooltip}}" ui-sref="feed(::{ name: item.source.name })" ng-click="::sourceClick($event, item.source.name)" title="::item.source.title"></span>\n' +
    '						<span ng-if="::item.sub_source" class="vlogUser _{{::item.sub_source.name}}" data-name="{{::item.sub_source.title}}"></span>\n' +
    '					</div>\n' +
    '\n' +
    '					<h3 ng-bind="::item.title"></h3>\n' +
    '				</div>\n' +
    '			</a>\n' +
    '\n' +
    '			<div class="postMeta">\n' +
    '\n' +
    '				<div class="details angular-animate" ng-if="!item.showControls">\n' +
    '\n' +
    '					<span class="favorite icon-fav" ng-click="::toggleFavorite($event, item)" ng-if="::showFavorite" ng-class="{ active: item.favorite }" title="Save item" title-top="true"></span>\n' +
    '\n' +
    '					<span class="remove" ng-click="::removeFavorite($event, $index, item)" ng-if="::showRemove" title="Remove" title-top="true"></span>\n' +
    '\n' +
    '					<div class="post-menu" ng-if="user && !user.anonymous && !showRemove">\n' +
    '\n' +
    '						<i class="icon-menu" title="More options" title-top="true" ng-click="item.showMenu = !item.showMenu"></i>\n' +
    '\n' +
    '						<ul class="dropdown" ng-if="item.showMenu" click-outside="item.showMenu = false">\n' +
    '							<li ng-if="!item.nsfw && !item.userNSFW"><a href="" ng-click="::markNSFW(item)">Report NSFW</a></li>\n' +
    '							<li ng-if="item.userNSFW"><a href="" ng-click="::unmarkNSFW(item)">Mark as SFW</a></li>\n' +
    '							<li><a href="" ng-click="::markHidden(item)">Hide from My feed</a></li>\n' +
    '						</ul>\n' +
    '					</div>\n' +
    '\n' +
    '					<div class="stats pull-right">\n' +
    '						<span class="action" ng-click="::openDNlink($event, item.link_out_direct)" ng-if="item.source.name == \'designer_news\' && item.external_url" title="Open discussion" title-top="true">\n' +
    '							<span class="icon-chat"></span>\n' +
    '						</span>\n' +
    '\n' +
    '						<span title="Votes" title-top="true" ng-if="::item.source.name === \'dribbble\'">\n' +
    '							<span class="icon-dribbble"></span>\n' +
    '							<span>{{::item.stats.likes || 0 | thousandSuffix:1}}</span>\n' +
    '						</span>\n' +
    '\n' +
    '						<span title="Votes" title-top="true" ng-if="::item.source.name === \'producthunt\'">\n' +
    '							<span class="icon-ph"></span>\n' +
    '							<span>{{::item.stats.likes || 0 | thousandSuffix:1}}</span>\n' +
    '						</span>\n' +
    '\n' +
    '						<span title="Views" title-top="true">\n' +
    '							<span class="icon-view"></span>\n' +
    '							<span>{{::item.clicks || 0 | thousandSuffix:1}}</span>\n' +
    '						</span>\n' +
    '						<span class="action" title="Share this" title-top="true" ng-click="item.showControls = !item.showControls">\n' +
    '							<span class="icon-share"></span>\n' +
    '							<span>{{::item.virality || 0 | thousandSuffix:1}}</span>\n' +
    '						</span>\n' +
    '	                </div>\n' +
    '\n' +
    '	            </div>\n' +
    '\n' +
    '				<div class="controls angular-animate" ng-if="item.showControls">\n' +
    '					<div class="share">\n' +
    '						<span class="facebook icon-facebook" ng-click="::openSharer($event, \'facebook\', item)" title="Share on Facebook" title-top="true"></span>\n' +
    '						<span class="twitter icon-twitter" ng-click="::openSharer($event, \'twitter\', item)" title="Share on Twitter" title-top="true"></span>\n' +
    '						<span class="linkedin icon-linkedin" ng-click="::openSharer($event, \'linkedin\', item)" title="Share on LinkedIn" title-top="true"></span>\n' +
    '						<span class="slack icon-slack" ng-click="::sendSlack($event, item)" title="Share on Slack" title-top="true"></span>\n' +
    '					</div>\n' +
    '					<div class="close icon-close" ng-click="item.showControls = !item.showControls"></div>\n' +
    '				</div>\n' +
    '			</div>\n' +
    '		</div>\n' +
    '\n' +
    '	</li>\n' +
    '</ul>\n' +
    '\n' +
    '<div ng-show="feed && !feed.length && !blockEmpty" ng-transclude="no-data">\n' +
    '</div>\n' +
    '\n' +
    '<ul class="dummy" ng-show="!feed">\n' +
    '	<li></li>\n' +
    '	<li></li>\n' +
    '	<li></li>\n' +
    '	<li></li>\n' +
    '	<li></li>\n' +
    '	<li></li>\n' +
    '	<li></li>\n' +
    '	<li></li>\n' +
    '	<li></li>\n' +
    '	<li></li>\n' +
    '</ul>\n' +
    '\n' +
    '</section>\n' +
    '')
  $templateCache.put('modules/feed/feed.html',
    '<div class="cf">\n' +
    '\n' +
    '  <h2 ng-cloak ng-if="currentSource.name">\n' +
    '    <span title="{{currentSource.description}}">{{currentSource.title}}</span>\n' +
    '    <a ng-if="currentSource.name != \'vlogs\'" title="Go to {{currentSource.title}}\'s website" href="http://app.muz.li/go?link=http://{{currentSource.url}}" class="titleLink"></a>\n' +
    '  </h2>\n' +
    '\n' +
    '  <div class="feedSorters pull-right" ng-if="[\'search\', \'favorites\'].indexOf(currentSource) === -1 && [\'vlogs\', \'dribbble\', \'producthunt\'].indexOf(currentSource.name) === -1" ng-cloak>\n' +
    '    <a ng-click="::sortFeed(\'virality\')" ng-class="{ active: currentFeedSort === \'virality\' }" href="#" title="Sort by popularity"><i class="icon-hot"></i></a>\n' +
    '    <a ng-click="::sortFeed()"ng-class="{ active: currentFeedSort !== \'virality\' }" href="#" title="Sort by date"><i class="icon-time"></i></a>\n' +
    '  </div>\n' +
    '\n' +
    '</div>\n' +
    '\n' +
    '<scrollable-feed items="items" ng-hide="errors.length" sponsored="sponsored" load-on-sort show-favorite show-virality>\n' +
    '  <scrollable-feed-no-data>\n' +
    '    <div id="oops">No items yet today <a href="#" ng-click="::reload()">Try again</a>.</div>\n' +
    '  </scrollable-feed-no-data>\n' +
    '</scrollable-feed>\n' +
    '')
  $templateCache.put('modules/feed/user-sources.html',
    '<div class="cf">\n' +
    '  \n' +
    '  <h2>All your feeds</h2>\n' +
    '\n' +
    '  <div class="feedSorters pull-right" ng-if="[\'search\', \'favorites\'].indexOf(currentSource) === -1 && [\'vlogs\', \'dribbble\', \'producthunt\'].indexOf(currentSource.name) === -1" ng-cloak>\n' +
    '    <a ng-click="::sortFeed(\'virality\')" ng-class="{ active: currentFeedSort === \'virality\' }" href="#" title="Sort by popularity"><i class="icon-hot"></i></a>\n' +
    '    <a ng-click="::sortFeed()"ng-class="{ active: currentFeedSort !== \'virality\' }" href="#" title="Sort by date"><i class="icon-time"></i></a>\n' +
    '  </div>\n' +
    '  \n' +
    '</div>\n' +
    '\n' +
    '<scrollable-feed items="items" sponsored="sponsored" ng-hide="errors.length" load-on-sort="viralTimes" show-favorite show-virality></scrollable-feed>\n' +
    '')
  $templateCache.put('modules/muzli/home.html',
    '<div class="home-overlay cf angular-animate" ng-hide="errors.length" ng-if="!feedVisibleClass">\n' +
    '\n' +
    '	<section id="quickAccess" class="max minimized angular-animate" ng-if="!feedVisibleClass" ng-class="{\n' +
    '		\'min\': showEnableAuthRecentSites === false && !recentSites,\n' +
    '		\'max\': showEnableAuthRecentSites || recentSites,\n' +
    '		\'visible\': !isSwitchedToHalfView && feedVisibleClass !== \'halfView\'\n' +
    '		}">\n' +
    '		<div class="search">\n' +
    '			<form ng-submit="::search(searchText, $event)" id="searchForm">\n' +
    '				<div class="input {{defaultSearch}}">\n' +
    '					<input tabindex="1" maxlength="50" type="text" ng-model="searchText" id="searchBox" placeholder="Search Google or Muzli" name="q" lookahead/>\n' +
    '\n' +
    '					<div class="searchOptions">\n' +
    '						<i class="icon-search"></i>\n' +
    '						<a href="#" ng-class="{ default: defaultSearch === \'muzli\', active: activeSearch === \'muzli\' }" class="muzli icon-muzli" title="Muzli search" ng-click="search(searchText, $event, \'muzli\')"></a>\n' +
    '						<a href="#" ng-class="{ default: defaultSearch === \'google\', active: activeSearch === \'google\' }" class="google icon-google" title="Google search" ng-click="search(searchText, $event, \'google\')"></a>\n' +
    '					</div>\n' +
    '\n' +
    '				</div>\n' +
    '			</form>\n' +
    '		</div>\n' +
    '		<div class="clock">\n' +
    '			<span class="time">{{currentTime | date:\'h:mm a\'}}</span>\n' +
    '			<span class="date">{{currentTime | date:\'EEEE, MMMM d\'}}</span>\n' +
    '		</div>\n' +
    '	</section>\n' +
    '\n' +
    '	<section id="sticky">\n' +
    '\n' +
    '		<ul class="home" ng-if="muzliFeed.length">\n' +
    '			<li ng-repeat="item in muzliFeed track by (item.id || item.link)" ng-class="::{\n' +
    '					viral: item.viral,\n' +
    '					video: !!item.video,\n' +
    '					playing: item.playing,\n' +
    '					animated: !!item.animated,\n' +
    '					nsfw: !!item.nsfw || !!item.userNSFW,\n' +
    '					showSharePromo: item.displaySharePromo,\n' +
    '					showMenu: item.showMenu,\n' +
    '					}"\n' +
    '					class="angular-animate"\n' +
    '					data-muzli-id="{{::item.id}}" check-visibility>\n' +
    '\n' +
    '					<div class="tile">\n' +
    '\n' +
    '						<a target="_blank" href="{{::item.link_out}}" class="feedLink" ng-mousedown="::postClick(item, $event)">\n' +
    '							<div class="postPhoto">\n' +
    '								<img ng-if="::!item.video && !item.youtube" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAMAAAAoyzS7AAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAAZQTFRFAAAAAAAApWe5zwAAAAF0Uk5TAEDm2GYAAAAMSURBVHjaYmAACDAAAAIAAU9tWeEAAAAASUVORK5CYII=" muzli-lazy="{{::item.image}}" muzli-gif="{{::item.gif}}" muzli-is-gif="{{::item.isGif}}" alt="" />\n' +
    '								<muzli-video ng-if="::item.video"></muzli-video>\n' +
    '\n' +
    '								<div class="share-promo" ng-if="item.displaySharePromo">\n' +
    '									<div class="share">\n' +
    '										<h4>Nice! Maybe your friends will also enjoy this?</h4>\n' +
    '										<span class="facebook icon-facebook" ng-click="::openSharer($event, \'facebook\', item)" title="Share on Facebook"></span>\n' +
    '										<span class="twitter icon-twitter" ng-click="::openSharer($event, \'twitter\', item)" title="Share on Twitter"></span>\n' +
    '										<span class="linkedin icon-linkedin" ng-click="::openSharer($event, \'linkedin\', item)" title="Share on LinkedIn"></span>\n' +
    '										<span class="slack icon-slack" ng-click="::sendSlack($event, item)" title="Share on Slack"></span>\n' +
    '									</div>\n' +
    '								</div>\n' +
    '\n' +
    '							</div>\n' +
    '						</a>\n' +
    '\n' +
    '						<div class="postMeta" ng-class="{\'fix-controls\': item.showControls}">\n' +
    '\n' +
    '							<div class="postInfo">\n' +
    '								<h3 ng-bind="::item.title"></h3>\n' +
    '								<span class="source" ng-bind="::item.source.title"></span>\n' +
    '							</div>\n' +
    '\n' +
    '							<div class="details angular-animate" ng-if="!item.showControls">\n' +
    '\n' +
    '								<span class="favorite icon-fav" ng-click="::toggleFavorite($event, item)" ng-class="{ active: item.favorite }" title="Save item" title-top="true"></span>\n' +
    '\n' +
    '								<div class="post-menu" ng-if="user && !user.anonymous">\n' +
    '\n' +
    '									<i class="icon-menu" title="More options" title-top="true" ng-click="item.showMenu = !item.showMenu"></i>\n' +
    '\n' +
    '									<ul class="dropdown" ng-if="item.showMenu" click-outside="item.showMenu = false">\n' +
    '										<li ng-if="!item.nsfw && !item.userNSFW"><a href="" ng-click="::markNSFW(item)">Report NSFW</a></li>\n' +
    '										<li ng-if="item.userNSFW"><a href="" ng-click="::unmarkNSFW(item)">Mark as SFW</a></li>\n' +
    '										<li><a href="" ng-click="::markHidden(item)">Hide from My feed</a></li>\n' +
    '									</ul>\n' +
    '								</div>\n' +
    '\n' +
    '								<div class="stats pull-right">\n' +
    '									<span class="action" ng-click="::openDNlink($event, item.link_out_direct)" ng-if="item.source.name == \'designer_news\' && item.external_url" title="Open discussion" title-top="true">\n' +
    '										<span class="icon-chat"></span>\n' +
    '									</span>\n' +
    '\n' +
    '									<span title="Votes" title-top="true" ng-if="::item.source.name === \'dribbble\'">\n' +
    '										<span class="icon-dribbble"></span>\n' +
    '										<span>{{::item.stats.likes || 0 | thousandSuffix:1}}</span>\n' +
    '									</span>\n' +
    '\n' +
    '									<span title="Votes" title-top="true" ng-if="::item.source.name === \'producthunt\'">\n' +
    '										<span class="icon-ph"></span>\n' +
    '										<span>{{::item.stats.likes || 0 | thousandSuffix:1}}</span>\n' +
    '									</span>\n' +
    '\n' +
    '									<span title="Views" title-top="true">\n' +
    '										<span class="icon-view"></span>\n' +
    '										<span>{{::item.clicks || 0 | thousandSuffix:1}}</span>\n' +
    '									</span>\n' +
    '									<span class="action" title="Share this" title-top="true" ng-click="item.showControls = !item.showControls">\n' +
    '										<span class="icon-share"></span>\n' +
    '										<span>{{::item.virality || 0 | thousandSuffix:1}}</span>\n' +
    '									</span>\n' +
    '				                </div>\n' +
    '							</div>\n' +
    '\n' +
    '							<div class="controls angular-animate" ng-if="item.showControls">\n' +
    '								<div class="share">\n' +
    '									<span class="facebook icon-facebook" ng-click="::openSharer($event, \'facebook\', item)" title="Share on Facebook" title-top="true"></span>\n' +
    '									<span class="twitter icon-twitter" ng-click="::openSharer($event, \'twitter\', item)" title="Share on Twitter" title-top="true"></span>\n' +
    '									<span class="linkedin icon-linkedin" ng-click="::openSharer($event, \'linkedin\', item)" title="Share on LinkedIn" title-top="true"></span>\n' +
    '									<span class="slack icon-slack" ng-click="::sendSlack($event, item)" title="Share on Slack" title-top="true"></span>\n' +
    '								</div>\n' +
    '								<div class="close icon-close" ng-click="item.showControls = !item.showControls"></div>\n' +
    '							</div>\n' +
    '						</div>\n' +
    '					</div>\n' +
    '			</li>\n' +
    '		</ul>\n' +
    '\n' +
    '		<ul ng-hide="muzliFeed.length || errors.indexOf(\'all-error\') > -1">\n' +
    '			<li></li>\n' +
    '			<li></li>\n' +
    '			<li></li>\n' +
    '			<li></li>\n' +
    '			<li></li>\n' +
    '			<li></li>\n' +
    '			<li></li>\n' +
    '		</ul>\n' +
    '	</section>\n' +
    '\n' +
    '</div>\n' +
    '\n' +
    '<div class="home-content angular-animate" ng-hide="!feedVisibleClass" ng-hide="errors.indexOf(\'all-error\') > -1">\n' +
    '\n' +
    '	<div class="our-picks">\n' +
    '\n' +
    '		<div class="cf">\n' +
    '			<h2 class="latest-stories">From our picks</h2>\n' +
    '		</div>\n' +
    '\n' +
    '		<section id="sticky">\n' +
    '\n' +
    '			<!-- Sticky posts -->\n' +
    '			<ul class="picks cf" ng-if="muzliFeed.length">\n' +
    '\n' +
    '				<li ng-repeat="item in muzliFeed | filterVisible track by (item.id || item.link)" ng-class="::{\n' +
    '				viral: item.viral,\n' +
    '				video: !!item.video,\n' +
    '				playing: item.playing,\n' +
    '				animated: !!item.animated,\n' +
    '				nsfw: !!item.nsfw || !!item.userNSFW,\n' +
    '				showSharePromo: item.displaySharePromo,\n' +
    '				showMenu: item.showMenu,\n' +
    '				}"\n' +
    '				class="angular-animate"\n' +
    '				data-muzli-id="{{::item.id}}">\n' +
    '\n' +
    '					<div class="tile">\n' +
    '						<a target="_blank" href="{{::item.link_out}}" class="feedLink" ng-mousedown="::postClick(item, $event)">\n' +
    '							<div class="postPhoto">\n' +
    '								<img ng-if="::!item.video && !item.youtube" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAMAAAAoyzS7AAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAAZQTFRFAAAAAAAApWe5zwAAAAF0Uk5TAEDm2GYAAAAMSURBVHjaYmAACDAAAAIAAU9tWeEAAAAASUVORK5CYII=" muzli-lazy="{{::item.image}}" muzli-gif="{{::item.gif}}" muzli-is-gif="{{::item.isGif}}" alt="" />\n' +
    '								<muzli-video ng-if="::item.video"></muzli-video>\n' +
    '\n' +
    '								<div class="share-promo" ng-if="item.displaySharePromo">\n' +
    '									<div class="share">\n' +
    '										<h4>Nice! Maybe your friends will also enjoy this?</h4>\n' +
    '										<span class="facebook icon-facebook" ng-click="::openSharer($event, \'facebook\', item)" title="Share on Facebook"></span>\n' +
    '										<span class="twitter icon-twitter" ng-click="::openSharer($event, \'twitter\', item)" title="Share on Twitter"></span>\n' +
    '										<span class="linkedin icon-linkedin" ng-click="::openSharer($event, \'linkedin\', item)" title="Share on LinkedIn"></span>\n' +
    '										<span class="slack icon-slack" ng-click="::sendSlack($event, item)" title="Share on Slack"></span>\n' +
    '									</div>\n' +
    '								</div>\n' +
    '							</div>\n' +
    '						</a>\n' +
    '\n' +
    '						<div class="postMeta" ng-class="{\'fix-controls\': item.showControls}">\n' +
    '\n' +
    '							<div class="postInfo">\n' +
    '								<h3 ng-bind="::item.title"></h3>\n' +
    '								<span class="source" ng-bind="::item.source.title"></span>\n' +
    '							</div>\n' +
    '\n' +
    '							<div class="details angular-animate" ng-if="!item.showControls">\n' +
    '\n' +
    '								<span class="favorite icon-fav" ng-click="::toggleFavorite($event, item)" ng-class="{ active: item.favorite }" title="Save item" title-top="true"></span>\n' +
    '\n' +
    '								<div class="post-menu" ng-if="user && !user.anonymous">\n' +
    '\n' +
    '									<i class="icon-menu" title="More options" title-top="true" ng-click="item.showMenu = !item.showMenu"></i>\n' +
    '\n' +
    '									<ul class="dropdown" ng-if="item.showMenu" click-outside="item.showMenu = false">\n' +
    '										<li ng-if="!item.nsfw && !item.userNSFW"><a href="" ng-click="::markNSFW(item)">Report NSFW</a></li>\n' +
    '										<li ng-if="item.userNSFW"><a href="" ng-click="::unmarkNSFW(item)">Mark as SFW</a></li>\n' +
    '										<li><a href="" ng-click="::markHidden(item)">Hide from My feed</a></li>\n' +
    '									</ul>\n' +
    '								</div>\n' +
    '\n' +
    '								<div class="stats pull-right">\n' +
    '									<span class="action" ng-click="::openDNlink($event, item.link_out_direct)" ng-if="::item.source.name == \'designer_news\' && item.external_url" title="Open discussion" title-top="true">\n' +
    '										<span class="icon-chat"></span>\n' +
    '									</span>\n' +
    '\n' +
    '									<span title="Votes" title-top="true" ng-if="::item.source.name === \'dribbble\'">\n' +
    '										<span class="icon-dribbble"></span>\n' +
    '										<span>{{::item.stats.likes || 0 | thousandSuffix:1}}</span>\n' +
    '									</span>\n' +
    '\n' +
    '									<span title="Votes" title-top="true" ng-if="::item.source.name === \'producthunt\'">\n' +
    '										<span class="icon-ph"></span>\n' +
    '										<span>{{::item.stats.likes || 0 | thousandSuffix:1}}</span>\n' +
    '									</span>\n' +
    '\n' +
    '									<span title="Views" title-top="true">\n' +
    '										<span class="icon-view"></span>\n' +
    '										<span>{{::item.clicks || 0 | thousandSuffix:1}}</span>\n' +
    '									</span>\n' +
    '									<span class="action" title="Share this" title-top="true" ng-click="::item.showControls = !item.showControls">\n' +
    '										<span class="icon-share"></span>\n' +
    '										<span>{{::item.virality || 0 | thousandSuffix:1}}</span>\n' +
    '									</span>\n' +
    '				                </div>\n' +
    '							</div>\n' +
    '\n' +
    '							<div class="controls angular-animate" ng-if="item.showControls">\n' +
    '								<div class="share">\n' +
    '									<span class="facebook icon-facebook" ng-click="::openSharer($event, \'facebook\', item)" title="Share on Facebook" title-top="true"></span>\n' +
    '									<span class="twitter icon-twitter" ng-click="::openSharer($event, \'twitter\', item)" title="Share on Twitter" title-top="true"></span>\n' +
    '									<span class="linkedin icon-linkedin" ng-click="::openSharer($event, \'linkedin\', item)" title="Share on LinkedIn" title-top="true"></span>     <span class="slack icon-slack" ng-click="::sendSlack($event, item)" title="Share on Slack" title-top="true"></span>\n' +
    '								</div>\n' +
    '								<div class="close icon-close" ng-click="::item.showControls = !item.showControls"></div>\n' +
    '							</div>\n' +
    '						</div>\n' +
    '					</div>\n' +
    '\n' +
    '				</li>\n' +
    '			</ul>\n' +
    '\n' +
    '			<ul ng-hide="muzliFeed.length || errors.indexOf(\'all-error\') > -1">\n' +
    '				<li></li>\n' +
    '				<li></li>\n' +
    '				<li></li>\n' +
    '				<li></li>\n' +
    '				<li></li>\n' +
    '				<li></li>\n' +
    '				<li></li>\n' +
    '			</ul>\n' +
    '		</section>\n' +
    '	</div>\n' +
    '\n' +
    '	<div class="cf" ng-if="allFeed.length" ng-cloak>\n' +
    '		<h2 class="latest-stories pull-left" ng-hide="errors.indexOf(\'all-error\') > -1">Latest Stories</h2>\n' +
    '		<div class="feedSorters pull-right">\n' +
    '			<a ng-click="::sortFeed(\'virality\')" ng-class="{ active: currentFeedSort === \'virality\' }" href="#" title="Sort by popularity"><i class="icon-hot"></i></a>\n' +
    '    		<a ng-click="::sortFeed()"ng-class="{ active: currentFeedSort !== \'virality\' }" href="#" title="Sort by date"><i class="icon-time"></i></a>\n' +
    '		</div>\n' +
    '	</div>\n' +
    '\n' +
    '	<scrollable-feed items="allFeed" sponsored="sponsored" ng-hide="errors.length" load-on-sort="viralTimes" show-favorite show-virality></scrollable-feed>\n' +
    '</div>\n' +
    '')
  $templateCache.put('modules/search/search.html',
    '<div class="cf">\n' +
    '  <h2 class="resultsHeading">Found {{items.length}} results for <span>{{searchText}}</span></h2>\n' +
    '</div>\n' +
    '\n' +
    '<scrollable-feed items="items" ng-hide="errors.length" show-favorite>\n' +
    '  <scrollable-feed-no-data>\n' +
    '    <div id="oops" class="emptySearch">Nothing found</div>\n' +
    '  </scrollable-feed-no-data>\n' +
    '</scrollable-feed>\n' +
    '')
  $templateCache.put('modules/user/favorites.html',
    '<div class="cf">\n' +
    '  <h2>Your Saved Items <span ng-show="user && user.favoriteCount">| <a href="#" ng-hide="showFavoritesClearAll" class="clearAllStarred" ng-click="showFavoritesClearAll = true">Delete all</a><div class="confirm" ng-show="showFavoritesClearAll">Are you sure you want to delete all your saved items? <span class="true" ng-click="clearAllFavorites()">Yes</span> or <span class="false" ng-click="showFavoritesClearAll = false">Cancel</span></div></span></h2>\n' +
    '</div>\n' +
    '\n' +
    '<scrollable-feed items="items" ng-hide="errors.length" load-on-sort show-remove check-delete-length>\n' +
    '  <scrollable-feed-no-data>\n' +
    '    <div class="noFavs">\n' +
    '      <h5>You have no items you like yet</h5>\n' +
    '    </div>\n' +
    '  </scrollable-feed-no-data>\n' +
    '</scrollable-feed>\n' +
    '')

  }]);
