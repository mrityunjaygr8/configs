// =========================================================
// Force the main Newsfeed to the Most Recent view
// =========================================================
X.ready( 'most_recent', function() {
	FX.add_option('auto_switch_to_recent_stories', {"title": 'Automatically Switch to Most Recent view of the main Newsfeed', "description": "Facebook defaults to Top Stories. This option detects this view and automatically switches you to the chronological Most Recent view.", "default": false});
    FX.add_option('auto_switch_hide_message', {"section":"Advanced", "title": 'Hide Most Recent switch messages', "description": "When automatically switched to the Most Recent news feed, hide the message that appears to inform you of the switch.", "default": false});
	FX.add_option('redirect_home_links', {"section": "User Interface", "title": 'Home Links', "description": 'Force the F logo and Home link in the blue header bar to reload the page so Social Fixer features continue to work.', "default": true});
	FX.on_options_load(function () {
		// Redirect F logo home link
		var recent_href = function(old_href, addend) {
			if (/[&?]sk=h_chr/.test(old_href)) {
				return old_href;
			}
			addend = 'sk=h_chr' + (addend ? '&' + addend : '');
			if (/[&?]sk=h_nor/.test(old_href)) {
				return old_href.replace(/sk=h_nor/, addend);
			}
			var frag = '';
			if (/#/.test(old_href)) {
				/([^#]*)(#.*)/.test(old_href);
				frag = RegExp.$2;
				old_href = RegExp.$1;
			}
			return old_href + (/\?/.test(old_href) ? '&' : '?') + addend + frag;
		};
		var already_most_recent = function(href) {
			if (/sk=h_chr/.test(href)) {
				return true;
			}
			var uiIconTextTxt = X('.uiIconText').text();
			// English-only test
			if (uiIconTextTxt && /Viewing most recent stories/.test(uiIconTextTxt)) {
				return true;
			}
			// All-languages test, as long as classes don't change
			var c24Txt = X('._c24').text();
			if (c24Txt && uiIconTextTxt && c24Txt == uiIconTextTxt && c24Txt.length > 0) {
				return true;
			}
			return false;
		};
		if (FX.option('redirect_home_links')) {
			var capture = function ($a) {
				X.capture($a, 'click', function (e) {
					if (FX.option('auto_switch_to_recent_stories')) {
						$a.attr('href', recent_href($a.attr('href')));
					}
					e.stopPropagation();
				});
			};
			FX.on_page_load(function () {
				X.when('h1[data-click="bluebar_logo"] a', capture);
				X.when('div[data-click="home_icon"] a', capture);
			});
		}
		// Force Most Recent
		FX.on_content_loaded(function () {
			if (FX.option('auto_switch_to_recent_stories')) {
				var redirect = false;
				var href = window.location.href;
                if (/sfx_switch=true/.test(href)) {
                    if (!FX.option('auto_switch_hide_message')) {
                        var note = sticky_note(X('#sfx_badge')[0], 'left', 'Auto-switched to Most Recent', {close: false});
                        setTimeout(function () {
                            note.remove();
                        }, 3.0 * X.seconds);
                    }
                    return;
                }
				if (already_most_recent(href)) {
					return;
				}
				var redirect_now = function () {
					// Failsafe in case redirect doesn't cause reload
					setTimeout(function () {
						X(document.body).css('opacity', '1');
					}, 2.0 * X.seconds);
					X(document.body).css('opacity', '.2');
					setTimeout(function () {
						window.location.href = recent_href(href, 'sfx_switch=true');
					}, 0.2 * X.seconds);
				};
				if (/sk=h_nor/.test(href)) {
					redirect_now();
				}
				else if (!/sk=h_chr/.test(href)) {
					X.poll(function (count) {
						if (!X.find('div[id^="topnews_main_stream"]')) {
							return false;
						}
						redirect_now();
					}, 200, 20);
				}
			}
		});
	});
});
