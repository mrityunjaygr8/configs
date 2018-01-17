// =========================================================
// "Stealth" Mode
// =========================================================
X.ready('stealth_mode', function() {
	FX.add_option('stealth_mode', {"title": 'Stealth Mode', "description": 'Stealth Mode is a simple toggle in the wrench menu that hides or shows things you might accidentally click on when you don\'t mean to. It hides "Like" and "Add Friend" links and buttons, "Comment" fields, etc. Enabling this makes the wrench menu item appear.', "default": true});
    FX.add_option('stealth_mode_active', {"hidden":true, "default": false});

	FX.on_option('stealth_mode',function () {
		var menu_item = {"html": 'Enable "Stealth Mode"', "message": "stealth/toggle", "tooltip": "Hide comment input, Like buttons, Add Friend buttons, and other controls so you don't accidentally click on them."};
		X.publish("menu/add", {"section": "actions", "item": menu_item});

		var set_active = function() {
            menu_item.html = stealth_mode_active ? '<b>Disable "Stealth Mode"</b>' : 'Enable "Stealth Mode"';
            X('html').toggleClass("sfx_stealth_mode", stealth_mode_active);
        };
        var stealth_mode_active = FX.option('stealth_mode_active');
        set_active();

		X.subscribe("stealth/toggle", function () {
            stealth_mode_active = !stealth_mode_active;
            set_active();

			FX.option('stealth_mode_active',stealth_mode_active);
		});
	});
});
