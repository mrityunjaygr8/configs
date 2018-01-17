X.ready('tip_page_notifications', function() {
    FX.add_option('tip_page_notifications',
        {
            "section": "Tips",
            "title": 'Get Notified When Pages Post',
            "description": 'Facebook has a built-in feature that sends you a Notification whenever a Page that you choose makes a post, so you never miss anything important. Click the button to be shown how to subscribe to Social Fixer Page notifications.',
            "type": "link",
            "url": "https://www.facebook.com/socialfixer?sfx_notifications=true"
        }
    );
    FX.on_content_loaded(function () {
        if (/socialfixer\?sfx_notifications=true/.test(location.href)) {
            var likedButtonSelector = '.likedButton';
            var followingButtonSelector = '._55pi[data-testid="page_timeline_followed_button_test_id"]';

            X.when(`${likedButtonSelector}, ${followingButtonSelector}`, function () {
                // Try the following button first
                var button = X(followingButtonSelector);
                if (!button) {
                    button = X(likedButtonSelector);
                }
                button = button.first();
                button.parent().css('outline', '3px solid yellow');
                setTimeout(function () {
                    X.ui.click(button);
                    setTimeout(function () {
                        var notif = X('a[ajaxify^="/pages/get_notification/?tab=notif"]').closest('li').next();
                        notif.css('outline', '3px solid yellow');
                    }, 500);
                }, 1000);
            });
        }
    });
});
