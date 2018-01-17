X.ready('unread_filtered_messages', function() {
    FX.add_option('check_unread_filtered_messages', {
        "title": "Check For Filtered Messages"
        , "description": "Facebook hides Messages from people outside your network and doesn't alert you. This feature alerts you if there are any unread messages that Facebook has filtered."
        , "default": true
    });
    FX.on_option('check_unread_filtered_messages', function () {
        X.ajax_dom("https://mbasic.facebook.com/messages/?folder=other", function($dom) {
            var count = $dom.find('h3 > strong').length;
            if (count) {
                X.when('#mercurymessagesCountValue', function($o) {
                    var $clone = X($o.parent()[0].cloneNode(true)).addClass("sfx_jewelCount");
                    $clone.find('*[id]').removeAttr('id');
                    $clone.find('span').text(count).removeClass('hidden_elem');
                    var $container = $o.closest('.jewelButton');
                    $container.css('opacity',1).append( $clone );

                    // Is this the new Messenger format?
                    var isMessenger = $container.parent().find('a[href*="/messages/t/"]').length>0; // !!/\/t\//.test($container.parent().find('.seeMore').attr('href'));
                    var mailbox = isMessenger ? "/filtered/" : "/other?action=recent-messages";

                    // Add a message to the flyout
                    var tooltip = "When you receive Messages from people Facebook doesn't think you know, it filters them and doesn't inform you. Social Fixer adds this notification so you don't miss messages. This feature can be disabled in Options.";
                    var msg = `You have <span class="count">${count}</span> unread <a href="/messages${mailbox}">Filtered Message${count>1?'s':''}</a>`;
                    msg += ` <span style="margin-left:5px;" class="sfx_whats_this" data-hover="tooltip" data-tooltip-content="${tooltip}">(What's this?)</span>`;
                    var $msg = X('<div>').addClass("sfx_unread_filtered_message").safe_html(msg);
                    $container.parents('.uiToggle').find('.jewelHeader').append($msg);

                });
            }
        });
    });
});
