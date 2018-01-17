/*
    FX.on_selector(".uiContextualLayerPositioner", function($layer) {
        var profile_link = $layer.find('a[href*="ref=hovercard"]').first().attr('href');
        if (profile_link) {
            // Don't process this hovercard more than once
            if ($layer.attr("sfx_processed")) { return; }
            $layer.attr("sfx_processed",true);

            var id = X.match(profile_link,/\/([^\/\?]+)\?/);

            var $attrs = $layer.find("table .uiList");
            $attrs.append(`<li><b>UserID: </b>${id}</li>`);
            $attrs.append(`<li><div style="float:left;display:inline-block;font-weight:bold;">Comment: </div><div style="display:inline-block;float:left;border:1px solid #ccc;padding:2px;" contenteditable="true">This is a custom editable comment</div></li>`);
            $attrs.append(`<li style="clear:both;font-weight:bold;">Custom attribute 2</li>`);
        }
    })
*/
X.ready('friend_manager', function() {
	FX.add_option('friend_tracker', {"title": 'Friend Manager', "description": "Enable Friend Manager (Unfriend Tracker)", "default": true});

	FX.add_option('friend_tracker_alert_unfriend', {"hidden":true, "default":true});
  FX.add_option('friend_tracker_alert_name_change', {"hidden":true, "default":true});
	FX.add_option('friend_tracker_update_frequency', {"hidden":true, "default": 1 });

	// Load the friends pref
	var friends = X.clone(FX.storage('friends'));
	var custom_fields = FX.option('friend_custom_fields');

	X.subscribe("friends/options", function(msg,d) {
		// Render the friends dialog content
		var sections = [
			{"key":"alerts", "name":"Alerts"}
			,{"key":"options", "name":"Options"}
			,{"key":"list", "name":"Friend List"}
			,{"key":"details", "name":"Friend Details"}
			,{"key":"data", "name":"Raw Data"}
		];
		var dialog = `<div id="sfx_friend_dialog" class="sfx_dialog flex-column" style="transition: height .01s;">
	<div id="sfx_options_dialog_header" class="sfx_dialog_title_bar" style="cursor:move;" @click="collapse">
		Friend Manager - Social Fixer
		<div id="sfx_options_dialog_actions" draggable="false" >
			<input draggable="false" type="button" class="sfx_button secondary" @click.stop="close" value="Close">
		</div>
	</div>
	<div id="sfx_options_dialog_body" class="flex-row" draggable="false">
		<div id="sfx_options_dialog_sections">
			<div v-for="section in sections" @click="select_section(section.key)" class="sfx_options_dialog_section {{selected_section==section.key?'selected':''}}">{{section.name}}</div>
		</div>
		<div id="sfx_options_dialog_content">
			<div class="sfx_options_dialog_content_section">
				<div v-show="selected_section=='options'" style="line-height:32px;">
					<div><sfx-checkbox key="friend_tracker_alert_unfriend"></sfx-checkbox> Track and alert when someone unfriends or re-friends me</div>
					<div><sfx-checkbox key="friend_tracker_alert_name_change"></sfx-checkbox> Track and alert when a friend changes their name</div>
					<div>Check for friend changes after this many hours: <input type="number" min="1" max="99" v-model="frequency" @change="update_frequency()"/></div>
					<div>Update your friends list and check for changes immediately: <input type="button" @click="check_now()" class="sfx_button" value="Check Now"></div>
				</div>
				<div v-show="selected_section=='alerts'" id="sfx_friend_alerts"></div>
				<div v-show="selected_section=='list'">
					<div v-if="!list_loaded">Loading...</div>
					<div v-if="list_loaded">
						<div style="margin-bottom:3px;">
                            <b>Filter: </b><input type="text" v-model="filter">
                            <b>Show:</b>
                            <a @click.prevent="set_limit(10)" class="sfx_link">10</a>
                            <a @click.prevent="set_limit(50)" class="sfx_link">50</a>
                            <a @click.prevent="set_limit(250)" class="sfx_link">250</a>
                            <a @click.prevent="set_limit(500)" class="sfx_link">500</a>
                            <a @click.prevent="set_limit(9999)" class="sfx_link">all</a>
                            friends per page
                            <div v-show="limit<9999">
                                Showing {{limit}} friends per page.
                                <b>Current Page: </b> <a @click.prevent="set_page(-1)" class="sfx_link">&lt;&lt;</a> {{page+1}} <a @click.prevent="set_page(1)" class="sfx_link">&gt;&gt;</a>
                            </div>
                        </div>
						<table class="sfx_data_table">
							<thead>
								<tr>
									<th>&nbsp;</th>
									<th class="sortable" @click="order('name')">Name</th>
									<th class="sortable" @click="order('first')">First</th>
									<th class="sortable" @click="order('last')">Last</th>
									<th class="sortable" @click="order('id')">ID</th>
									<th class="sortable" @click="order('tracker.status')">Status</th>
									<th v-for="field in custom_fields">{{field}}</th>
									<th class="sortable" @click="order('id')">Added</th>
								</tr>
							</thead>
							<tbody>
								<tr v-for="f in friends | filterBy filter | orderBy orderkey sortorder | limitBy limit (page*limit)">
									<td><img src="{{f.photo}}" style="height:48px;width:48px;"></td>
									<td class="sfx_hover_link" style="font-weight:bold;" @click="select_user(f.id)">{{f.name}}</td>
									<td>{{f.first}}</td>
									<td>{{f.last}}</td>
									<td>{{f.id}}</td>
									<td>{{f.tracker.status}}</td>
									<td v-for="field in custom_fields">{{f.data[field]}}</td>
									<td>{{f.tracker.added_on | date}}</td>
								</tr>
							</tbody>
						</table>
					</div>
				</div>
				<div v-show="selected_section=='details'">
					<div v-if="!selected_user">
						Click on a friend in the "List" section.
					</div>
					<div v-else>
						<img src="{{selected_user.photo}}" style="float:left;margin-right:20px;"><span style="font-size:120%;font-weight:bold;">{{selected_user.name}}</span>
						<br style="clear:both;">

						This section will be used for future functionality that will enhance your friends list even more!

						<!--
						<b>Custom Fields</b> : Fields below are created by you and maintained in the Options tab. You can define any fields, and any value in those fields per user.
						<div v-for="field in custom_fields" style="margin:10px;border:1px solid #ccc;padding:10px;">
							<b>{{field}}</b>: <input v-model="selected_user.data[field]">
						</div>
						-->
					</div>
				</div>
				<div v-show="selected_section=='data'" style="white-space:pre;font-family:monospace;">{{friends | json}}</div>
			</div>
		</div>
	</div>
</div>
`;
		var data = {
			"sections": sections
			,"selected_section":"alerts"
			,"friends": friends
			,"list_loaded":false
			,"orderkey":"name"
			,"sortorder":1
			,"filter":""
			,"selected_user":null
			,"custom_fields":X.clone(custom_fields)
			,"frequency":FX.option("friend_tracker_update_frequency")
      ,"limit":50
      ,"page":0
		};
		if (d&&d.selected) {
			data.selected_section=d.selected;
    }
    // Count friends

		var actions= {
			"select_section": function (key) {
				this.selected_section=key;
				var self = this;
				if (key=="list") {
					// Lazy load the list for better performance
					setTimeout(function() {
						Vue.nextTick(function () {
							self.list_loaded = true;
						});
					},100);
				}
			},
			"select_user": function(id) {
				this.selected_user = friends[id];
				this.select_section('details');
			},
			"order": function(key) {
				this.sortorder = (this.orderkey == key) ? -1*this.sortorder : 1;
				this.orderkey = key;
			},
			"close": function() {
				X('#sfx_friend_dialog').remove();
			},
			"check_now": function() {
				X.publish("friends/update");
			},
			"update_frequency":function(val) {
				alert(this.frequency);
			},
      "set_limit":function(l) {
			this.limit=l;
			this.page=0;
      },
      "set_page":function(p) {
			this.page += p;
			if (this.page<0) { this.page=0; }
      }
		};
		template(document.body, dialog, data, actions).ready(function () {
			X.draggable('#sfx_friend_dialog');
			Vue.nextTick(function() {
				var alerts = find_alerts(friends);
				render_alerts(alerts, "just now", false, X('#sfx_friend_alerts'));
				if (!alerts || alerts.length==0) {
					actions.select_section("list");
				}
			});
		});

	});

	var retrieve_friends = function(cb) {
		X.ajax(`https://www.facebook.com/ajax/typeahead/first_degree.php?viewer=${userid}&filter[0]=user&options[0]=friends_only&__a=1&t=${X.now()}`, function(content) {
			try {
				var json = JSON.parse(content.replace(/^[^{]*/, ''));
				cb(json.payload.entries);
			} catch(e) {
				cb(null);
			}
		});
	};

	var update_friends = function(cb) {
		// Retrieve friends list
		var now = X.now();
		retrieve_friends(function(list) {
			if (list==null) {
				return cb(null);
			}

			var i, f, uid, sfx_friend;
			// For each friend, create the default record if needed
			for (i=0; i<list.length; i++) {
				f = list[i];
				uid = f.uid;
				sfx_friend = friends[uid];
				if (typeof sfx_friend == "undefined" || typeof sfx_friend.tracker=="undefined") {
					sfx_friend = {
						"id":f.uid
						,"name":f.text
						,"first":f.firstname
						,"last":f.lastname
						,"photo":f.photo
						,"tracker": {
							"added_on":now
							,"status":"friend"
							,"updated_on":now
							,"acknowledged_on":null
						}
					};
					friends[uid] = sfx_friend;
				}
				// check for updated photo and name
				if (f.text!=sfx_friend.name) {
					sfx_friend.old_name = sfx_friend.name;
					sfx_friend.name = f.text;
					sfx_friend.dirty = true;
				}
				if (sfx_friend.photo != f.photo) {
					sfx_friend.dirty = true;
				}
				sfx_friend.photo = f.photo;
				sfx_friend.checked_on = now;
			}

			// Loop over friends to check for changes
			for (uid in friends) {
				f = friends[uid];
				var tracker = f.tracker;

				// NEW Friend
				if (tracker.added_on==now) {
					f.dirty = true;
				}

				// RE-FRIENDED
				else if (now == f.checked_on && tracker.status!="friend") {
					tracker.status = "refriend";
					tracker.updated_on=now;
					tracker.acknowledged_on=null;
					f.dirty = true;
				}

				// REMOVED Friend
				// (Not found in new list, but they existed in old list)
				else if (now !== f.checked_on && (tracker.status=="friend" || tracker.status=="refriend")) {
					tracker.status="unfriended";
					tracker.updated_on=now;
					tracker.acknowledged_on=null;
					tracker.blocked=null;
					f.dirty = true;
				}

				// Update this friend record?
				if (f.dirty) {
					delete f.dirty;
					X.storage.set( "friends",uid,f,null,false );
				}
			}

			// Persist the updated friends list
			X.storage.save("friends", null, function(){ if (typeof cb=="function") { cb(); } });
		});
	};

	var find_alerts = function(friends) {
		var i;
		var alerts = [];
		var friend_tracker_alert_unfriend = FX.option('friend_tracker_alert_unfriend');
		var friend_tracker_alert_name_change = FX.option('friend_tracker_alert_name_change');

		for (i in friends) {
			var f = X.clone(friends[i]);
			if (!f || !f.tracker) { continue; }
			var t = f.tracker;
			var u = t.updated_on;
			var ack = t.acknowledged_on;

			if (friend_tracker_alert_unfriend) {
        // Unfriend
        if (t.status == "unfriended" && (!ack || ack < u)) {
          alerts.push({"type": "unfriend", "friend": f});
          // Fire off an ajax request to see if this person's account is still there?
					(function(friend_ref){
						X.ajax("https://m.facebook.com/"+friend_ref.id, function(content,status) {
              if (status==404) {
                friend_ref.removed = true;
              }
            });
          })(f);
        }
        // Re-friend
        if (t.status == "refriend") {
          alerts.push({"type": "refriend", "friend": f});
          // TODO: Check if blocked?
        }
      }
      if (friend_tracker_alert_name_change) {
        // name change
        if (f.old_name) {
          alerts.push({"type": "name_change", "friend": f});
        }
      }
		}
		return alerts;
	};

	var update_jewel_count = function(alerts) {
		if (!alerts) { return; }
		var count = alerts.length;
		// If only unfriend alerts exist, make it negative
		if (alerts.every( function(e){e.type=='unfriend';} )) {
			count = 0-count;
		}
		var el = document.getElementById('sfx_friend_jewel_count');
		if (el) {
			if (count==0) { X(el).remove(); }
			else { X(el).find('span').text(count); }
		}
		else {
			var $c = X('#requestsCountValue');
			var $clone = X($c.parent()[0].cloneNode(true)).addClass("sfx_jewelCount");
			$clone.find('*[id]').removeAttr('id');
			$clone.attr('id', 'sfx_friend_jewel_count');
			$clone.find('span').text(count).removeClass('hidden_elem');
			var $container = $c.closest('.jewelButton');
			$container.css('opacity', 1).append($clone);
		}
	};

	var show_alerts = function(ago) {
		if (!ago) { ago="just now"; }
		var alerts = find_alerts(friends);
		if (alerts && alerts.length>0) {
			X.when('#requestsCountValue', function($c) {
				update_jewel_count(alerts);
			});

			// Watch for an inner selector to load since it is async, then attach to an outer container
			FX.on_selector('.requestsJewelLinks', function () {
				if (document.getElementById('sfx_friend_changes')) { return; }
				render_alerts(alerts, ago, true, X('#fbRequestsList_wrapper'));
			});
		}
	};

	var render_alerts = function(alerts, ago, show_header, $prependTo) {
		try {
			var data = {
				"alerts": alerts
				,"ago":ago
				,"show_header":show_header
			};
			var t = `<div id="sfx_friend_changes" style="max-height:300px;overflow:auto;border-bottom:1px solid rgb(221,223,226);">
	<div v-if="show_header" style="padding:8px 12px 6px 12px;border-bottom:1px solid rgb(221,223,226);">
		<a @click.prevent="settings" style="float:right;">Settings</a>
		<div><span style="font-size:12px;font-weight:bold;">Friend Changes</span> <span style="font-size:11px;font-style:italic;">(via Social Fixer, updated {{ago}})</span></div>
	</div>
	<div v-if="alerts && alerts.length" v-for="a in alerts" style="padding:6px 12px;border-bottom:1px solid rgb(221,223,226);">
		<div style="float:right;height:50px;vertical-align:middle;line-height:50px;">
			<span @click="ok(a)" style="padding:5px 8px;font-size:12px;font-weight:bold;background-color:rgb(246, 247, 249);border:1px solid rgb(206, 208, 212);border-radius:2px;cursor:pointer;">Okay</span>
		</div>
		<img src="{{a.friend.photo}}" style="height:48px;margin-right:10px;display:inline-block;">
		<div style="display:inline-block;height:50px;overflow:hidden;">
			<template v-if="a.type=='name_change'">
				{{a.friend.old_name}}<br>
				is now known as<br>
				<a href="/{{a.friend.id}}" style="font-weight:bold;">{{a.friend.name}}</a><br>
			</template>
			<template v-if="a.type=='unfriend'">
				<a href="/{{a.friend.id}}" style="font-weight:bold;">{{a.friend.name}}</a><br>
				is no longer your friend. <span v-show="a.friend.removed" style="color:red;text-decoration:underline;cursor:help;" v-tooltip="This account is not available. This person has either disabled or removed their account, blocked you, or this is a result of a Facebook glitch (which is not uncommon). If they are still your friend but their profile is temporarily unavailable, they will appear as re-friended when it returns.">Account Not Found!</span><br>
				<i>{{a.friend.tracker.updated_on | ago}}</i>
			</template>
			<template v-if="a.type=='refriend'">
				<a href="/{{a.friend.id}}" style="font-weight:bold;">{{a.friend.name}}</a><br>
				is now your friend again! <br>
				<i>{{a.friend.tracker.updated_on | ago}}</i>
			</template>
		</div>
	</div>
	<div v-if="!alerts || alerts.length==0" style="line-height:50px;vertical-align:middle;color:rgb(117,117,117);background-color:rgb(246,247,249);text-align:center;">
		No changes
	</div>
</div>
`;
			var actions = {
				"ok": function(a) {
					var f = friends[a.friend.id];
					// Resolve based on the type of the alert
					if (a.type=="unfriend") {
						f.tracker.acknowledged_on=X.now();
					}
					else if (a.type=="refriend") {
						f.tracker.status="friend";
					}
					else if (a.type=="name_change") {
						delete f.old_name;
					}
					// Update and persist
					X.storage.set( "friends",f.id,f,function() {
						// Remove the alert
						var i = data.alerts.indexOf(a);
						data.alerts.splice(i,1);
						update_jewel_count(data.alerts);
					} );
				}
				,"settings": function() {
					X.publish("friends/options",{"selected":"options"});
				}
			};
			var $v = template(null, t, data, actions);
			$prependTo.prepend( $v.fragment );
		} catch (e) {
			alert(e);
		}
	};

	FX.on_options_load(function() {
		if (FX.option('friend_tracker')) {
      // Add wrench menu item
			X.publish("menu/add", {"section": "options", "item": {'html': 'Friend Manager', 'message': 'friends/options'}});

			// Update friends list and check for changes
			X.task('friend_update', FX.option('friend_tracker_update_frequency') * X.hours, function () {
				update_friends(show_alerts);
			}, function (run_on) {
				show_alerts(X.ago(run_on, null, true, true));
			});

			X.subscribe('friends/update', function () {
				update_friends(function () {
					show_alerts();
					alert("Update Complete");
				});
			});
		}
	});
});
