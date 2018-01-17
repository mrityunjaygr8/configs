X.ready('tip_friends_privacy', function() {
    FX.add_option('tip_friends_privacy',
        {
            "section": "Tips",
            "title": 'Make Your Friends List Private',
            "description": 'Hackers often create fake accounts using your publicly-available name and profile picture. Then they send friend requests to all your friends, pretending to be you and saying that you had to create a new account. You can prevent this kind of attack by not making your Friends list visible to these hackers.\nChange your Friends List privacy to "Friends" (or Custom).',
            "type": "link",
            "url": "https://www.facebook.com/settings/?tab=privacy&section=friendlist&view&sfx_tip_friends_privacy=true"
        }
    );
    FX.on_content_loaded(function () {
        if (/sfx_tip_friends_privacy=true/.test(location.href)) {
            var selector = '._55pi[data-testid="privacy_selector_8787365733"]';
            X.when(selector, function (item) {
                item.css('outline', '3px solid yellow');
                setTimeout(function () {
                    X.ui.click(item);
                }, 1000);
            });
        }
    });
});
