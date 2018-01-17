X.ready('debug_post_update_tracking', function() {
    FX.add_option('debug_post_update_tracking', {"section":"Debug", "title": 'Track Post Updates', "description": "Track how often a post receives DOM updates and display the timing", "default": false});
    FX.on_option('debug_post_update_tracking', function() {
        X.subscribe(['post/add','post/update'], function(msg,data) {
            var now = X.now();
            //var data = {"id": id, "dom": $post, "sfx_id": sfx_id};
            var $post = data.dom;
            var size = $post.innerText().length;

            if (msg=="post/add") {
                $post.attr('sfx_update_count','0');
                $post.attr('sfx_update_start',now);
                $post.attr('sfx_update_size',size);
                $post.attr('sfx_update_tracking','');
            }
            else if (msg=="post/update") {
                var count = +$post.attr('sfx_update_count');
                $post.attr('sfx_update_count',++count);
                var time = +$post.attr('sfx_update_start');
                var elapsed = (now-time);
                var original_size = $post.attr('sfx_update_size');
                var size_delta = size - original_size;

                $post.attr('sfx_update_tracking', $post.attr('sfx_update_tracking')+` @${elapsed}ms : ${data.inserted_tag}#${data.inserted_id||'null'} ${size_delta} bytes`);
            }
        });
    });
});

