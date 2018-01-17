X.ready('tip_timeline_posts', function() {
    FX.add_option('tip_timeline_posts',
        {
            "section": "Tips",
            "title": 'Restrict Posts To Your Timeline',
            "description": `If you want to prevent friends and others from writing on your Timeline (which may show up in other friends' Newsfeeds), you can restrict permissions to Only Me so no one can write on your wall.`,
            "type": "link",
            "url": "https://www.facebook.com/settings?tab=timeline&section=posting&view&sfx_write_timeline=true"
        }
    );
    FX.on_content_loaded(function () {
        if (/sfx_write_timeline=true/.test(location.href)) {
            var selector = '._55pi[data-testid="privacy_selector_10153940308610734"]';
            X.when(selector, function (item) {
                item.css('outline', '3px solid yellow');
                setTimeout(function () {
                    X.ui.click(item);
                }, 1000);
            });
        }
    });
});
