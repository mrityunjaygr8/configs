// =========================================================
// Fix timestamps
// =========================================================
X.ready( 'fix_timestamps', function() {
	FX.add_option('fix_timestamps', {"title": 'Fix Post Timestamps', "description": 'Change post and comment timestamps from relative times (1hr) to absolute date/time.', "default": true});
    FX.add_option('fix_timestamps_short', {"title": 'Fix Post Timestamps', "description": 'Use short date/time format', "default": false});

	FX.on_options_load(function () {
		var use_short = FX.option('fix_timestamps_short');
		FX.on_content_loaded(function () {
			if (FX.option('fix_timestamps')) {
				X('html').addClass("sfx_fix_timestamps");

				var remove_current_year = new RegExp(", " + (new Date()).getFullYear());
				//<abbr class="_35 timestamp" data-utime="1369109136.835" title="Today">11:05pm</abbr>
				//<abbr class="timestamp livetimestamp" data-utime="1369109191" title="Monday, May 20, 2013 at 11:06pm">3 minutes ago</abbr>
				function fix_timestamps(o) {
					if (X.find('#MessagingDashboard')) {
						return;
					}
					o.find('abbr[data-utime][title]').each(function (i, a) {
						a = X(a);
						// If the timestamp is already in long form, don't apply the conversion
						if (/at/.test(a.html())) {
							a.addClass('sfx_no_fix_timestamp');
						}

						if (use_short) {
                            var utime = new Date(a.attr('data-utime')*1000);
                            if (utime) {
                                a.attr('title',utime.toLocaleString());
							}
						}
						else {
                            var title = a.attr('title') || "";
                            a.attr('title', title.replace(remove_current_year, ""));
						}
					});
				}

				fix_timestamps(X(document.body));

				X.subscribe(["post/add", "post/update"], function (msg, data) {
					fix_timestamps(data.dom);
				});

			}
		});
	});
});