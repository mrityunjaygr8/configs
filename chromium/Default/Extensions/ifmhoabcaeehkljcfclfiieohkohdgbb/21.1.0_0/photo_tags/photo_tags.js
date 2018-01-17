X.ready( 'photo_tags', function() {
	FX.add_option('photo_tags', {
		"section": "User Interface"
		, "title": "Show Photo Tags"
		, "description": "Display the tags that Facebook automatically puts on photos when you hover over them."
		, "default": false
	});
	FX.on_option('photo_tags', function() {
		FX.on_selector('img[alt^="Image may contain:"]', function($img) {
			$img.closest('a').attr('sfx_photo_tags',$img.attr('alt')).addClass('sfx_photo_tags');
		});
	});
});
