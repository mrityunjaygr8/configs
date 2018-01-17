(function(){Registry.require(["promise"],function(){var f=rea.FEATURES,d=Registry.get("promise"),z=[],k=!0,u=function(){var a=[f.CONSTANTS.STORAGE.VERSION,f.CONSTANTS.STORAGE.TYPE],b={};a.forEach(function(a){b[a]=!0});return{keys:a,has:function(a){return!!b[a]}}}(),m=f.HTML5.LOCALSTORAGE,A=function(){return rea.other.openDatabase("tmStorage","1.0","TM Storage",31457280)},B=function(a){return a},v=function(a,b){if(!a)return b;var c=a[0];a=a.substring(1);switch(c){case "b":return"true"==a;case "n":return Number(a);
case "o":try{return JSON.parse(a)}catch(d){console.error("Storage: getValue ERROR: "+d.message)}return b;default:return a}},w=function(a){var b=(typeof a)[0];switch(b){case "o":try{a=b+JSON.stringify(a)}catch(c){console.error("Storage: setValue ERROR: "+c.message);return}break;default:a=b+a}return a},q=function(a,b){var c=d(),e=Array.prototype.slice.call(arguments,2),g;"string"==typeof a?a==f.DB.USE&&"clean"==b?console.warn("Storage: can't clean currently active storage"):g=h.implementations[a][b]:
g=a[b];if(g)if(e=g.apply(this,e),"object"===typeof e&&e.then)e.then(function(){c.resolve.apply(this,arguments)},function(a){c.reject()});else return e;else c.resolve();return c.promise()},x=function(a,b){var c=d(),e=[];Object.getOwnPropertyNames(b).forEach(function(c){void 0!==b[c]&&e.push(q(a,"setValue",c,b[c]))});d.when(e).done(function(){c.resolve()});return c.promise()},y=function(a,b){var c={};b.forEach(function(b){c[b]=q(a,"getValue",b)});return c},h={implementations:{localStorage:function(){var a=
{setValue:function(a,c){var e=d(),g=w(c);k&&m.setItem(a,g);e.resolve();return e.promise()},getValue:function(a,c){return v(m.getItem(a,c),c)},deleteAll:function(){var b=d();k&&a.listValues().forEach(function(a){u.has(a)||m.removeItem(a)});b.resolve();return b.promise()},deleteValue:function(a){var c=d();k&&m.removeItem(a);c.resolve();return c.promise()},listValues:function(){for(var a=[],c=0;c<m.length;c++)a.push(B(m.key(c)));return a}};return{options:{},methods:a}}(),sql:function(){var a=null,b=
null,c=function(){var a=d();b.db.transaction(function(c){c.executeSql("CREATE TABLE IF NOT EXISTS config(ID INTEGER PRIMARY KEY ASC, name TEXT, value TEXT)",[],a.resolve,b.onError)});return a.promise()},e=function(){var a=d();b={db:A(),onSuccess:function(a,b){},onError:function(a,b){console.error("webSQL: localDB Error ",b)}};b.db?c().done(a.resolve):(b=null,a.reject());return a.promise()},g={setValue:function(c,n){var p=d(),e=w(n);k&&(a[c]?b.db.transaction(function(a){a.executeSql("UPDATE config SET value=? WHERE name=?",
[e,c],function(){rea.runtime.lastError&&console.warn(rea.runtime.lastError);p.resolve()},b.onError)}):b.db.transaction(function(a){a.executeSql("INSERT INTO config(name, value) VALUES (?,?)",[c,e],function(){rea.runtime.lastError&&console.warn(rea.runtime.lastError);p.resolve()},b.onError)}));a[c]=e;k||p.resolve();return p.promise()},getValue:function(b,c){return v(a[b],c)},deleteAll:function(){var e=d(),n=y(g,u.keys);a=n;k?b.db.transaction(function(a){a.executeSql("DROP TABLE config",[],function(){c().done(function(){x(g,
n).done(e.resolve)})},b.onError)}):e.resolve();return e.promise()},deleteValue:function(c){var n=d();delete a[c];k?b.db.transaction(function(a){a.executeSql("DELETE FROM config WHERE name=?",[c],n.resolve,b.onError)}):n.resolve();return n.promise()},listValues:function(){var b=[];Object.getOwnPropertyNames(a).forEach(function(a){b.push(a)});return b},isWorking:function(){return d.Pledge()}};return{init:function(){var c=d(),n=function(b,l){a={};if(l)for(var r=0;r<l.rows.length;r++)a[l.rows.item(r).name]=
l.rows.item(r).value;c.resolve()},p=function(){a?c.resolve():b.db.transaction(function(a){a.executeSql("SELECT * FROM config",[],n,b.onError)})};b?p():e().done(p).fail(c.reject);return c.promise()},clean:function(){a=null;return d.Pledge()},options:{},methods:g}}(),chromeStorage:function(){var a=null,b=!1,c=!1,e=rea.extension.inIncognitoContext?"incognito":"normal",g=function(b,d){k&&c&&"local"==d&&b&&Object.keys(b).forEach(function(c){var l=b[c];l.newValue?l.newValue.origin!==e&&(a[c]=l.newValue.value,
h.notifyDifferentOriginChangeListeners(c,l.newValue)):delete a[c]})},f={setValue:function(b,c){var g=d();a[b]=c;if(k){var l={};l[b]={origin:e,value:c};rea.storage.local.set(l,g.resolve)}else g.resolve();return g.promise()},getValue:function(b,c){return void 0===a[b]?c:a[b]},deleteAll:function(){var b=d(),c=y(f,u.keys);a=c;k?rea.storage.local.clear(function(){x(f,c).done(b.resolve)}):b.resolve();return b.promise()},deleteValue:function(b){var c=d();delete a[b];k?rea.storage.local.remove(b,c.resolve):
c.resolve();return c.promise()},listValues:function(){var b=[];Object.getOwnPropertyNames(a).forEach(function(a){b.push(a)});return b},setTemporary:function(a){k=!a;c=!0},isSupported:function(){return d.Pledge()},isWorking:function(){var a=d(),b=0,c=Date.now(),l={};l.foo=c;var r=function(c){5>=++b?(console.warn("storage:",c?c:"storage set/get test failed!"),window.setTimeout(e,b*b*100)):(console.warn("storage: storage set/get test finally failed!"),t&&(window.clearTimeout(t),t=null,a.reject()))},
t=window.setTimeout(function(){t=null},18E4),e=function(){console.debug("Storage: test -> start");var b=Date.now();rea.storage.local.set(l,function(){console.debug("Storage: test -> set after "+(Date.now()-b)+"ms");rea.storage.local.get("foo",function(l){console.debug("Storage: test -> get after "+(Date.now()-b)+"ms");if(l){if(l.foo!==c)return r("read value is different "+JSON.stringify(l.foo)+" != "+JSON.stringify(c));if(rea.runtime.lastError)return r(rea.runtime.lastError&&rea.runtime.lastError.message||
"lastError is set")}else return r("read value is"+l);rea.storage.local.remove("foo",function(){console.debug("Storage: test -> remove after "+(Date.now()-b)+"ms");t&&(window.clearTimeout(t),t=null,a.resolve())})})})};e();return a.promise()}};return{init:function(){var c=d();a?c.resolve():rea.storage.local.get(null,function(d){a={};d&&Object.keys(d).forEach(function(b){var c=d[b];a[b]=c&&c.hasOwnProperty("origin")&&c.hasOwnProperty("value")?c.value:c});b||(rea.storage.onChanged.addListener(g),b=!0);
c.resolve()});return c.promise()},clean:function(){var b=d();a=null;b.resolve();return b.promise()},options:{},methods:f}}(),file:function(){var a=null,b=null,c=function(){var a=d(),c=function(b){console.warn("fileStorage: listFiles() error:",b);a.reject()};b.root.getDirectory("data",{create:!0},function(b){var d=b.createReader(),e=[],g=function(){d.readEntries(function(b){b.length?(e=e.concat(b),g()):a.resolve(e)},c)};g()},c);return a.promise()},e=function(a,c){var e=d(),g=function(b){console.warn("fileStorage: writeFileData(",
a,") error:",b);e.reject()};b.root.getDirectory("data",{create:!0},function(b){b.getFile(a,{create:!0},function(a){a.createWriter(function(a){a.onwriteend=function(b){a.onwriteend=function(a){e.resolve()};a.onerror=g;b=new Blob([c],{type:"text/plain"});a.write(b)};a.truncate(0)},g)},g)},g);return e.promise()},g=function(a){var c=d(),e=function(b){console.warn("fileStorage: getFileData(",a,") error:",b);c.reject()},g=function(a){var b=new FileReader;b.onloadend=function(){c.resolve(this.result)};b.onerror=
e;b.onabort=e;b.readAsText(a)};b.root.getDirectory("data",{create:!0},function(b){b.getFile(a,{},function(a){a.file(function(a){g(a)},e)},e)},e);return c.promise()},f=function(a){var c=d(),e=function(b){console.warn("fileStorage: deleteFile(",a,") error:",b);c.reject()};b.root.getDirectory("data",{create:!0},function(b){b.getFile(a,{create:!1},function(a){a.remove(c.resolve,e)},e)},e);return c.promise()},h=function(){var a=d(),c=function(b){console.warn("fileStorage: removeDir() error:",b);a.reject()};
b.root.getDirectory("data",{create:!0},function(b){b.removeRecursively(a.resolve,c)},c);return a.promise()},p=function(){var b=d();a={};var e=[];c().done(function(c){c.forEach(function(b){"string"!==typeof b&&(b=b.name);e.push(g(b).always(function(c){a[b]=c}))});d.when(e).always(function(){b.resolve()})}).fail(b.resolve);return b.promise()},m={isSupported:function(){var a=d();window.File&&window.FileReader&&window.FileList&&window.Blob?a.resolve():a.reject();return a.promise()},isWorking:function(){return d.Pledge()},
setValue:function(b,c){var g=d(),f=w(c);a[b]=f;k?e(b,f).always(g.resolve):g.resolve();return g.promise()},getValue:function(b,c){return v(a[b],c)},deleteAll:function(){var b=d(),c=y(m,u.keys);a=c;k?h().always(function(){x(m,c).always(b.resolve)}):b.resolve();return b.promise()},deleteValue:function(b){var c=d();delete a[b];k?f(b).always(c.resolve):c.resolve();return c.promise()},listValues:function(){var b=[];Object.getOwnPropertyNames(a).forEach(function(a){b.push(a)});return b}};return{init:function(){var c=
d();a?c.resolve():rea.other.requestFileSystem(window.PERSISTENT,31457280,function(a){b=a;p().done(c.resolve)},function(a){a&&console.warn("fileStorage: ",a);c.reject()});return c.promise()},clean:function(){a=null;return d.Pledge()},options:{},methods:m}}()},migrate:function(a,b,c){var e=d(),g=h.implementations[a],f=h.implementations[b];c=c||{};g&&f?q(a,"init").then(function(){return q(b,"init")}).then(function(){var a=d(),b=[];g.methods.listValues().forEach(function(a){var e=g.methods.getValue(a);
c.drop&&b.push(g.methods.deleteValue(a));b.push(f.methods.setValue(a,e))});d.when(b).done(function(){a.resolve()});return a.promise()}).then(function(){return q(b,"clean")}).then(function(){return q(a,"clean")}).done(function(){e.resolve()}).fail(function(){e.reject()}):(console.error("Migration: unknown storage implementation(s) ",a,b),e.reject());return e.promise()},isSupported:function(){return d.Pledge()},isWorking:function(){return d.Pledge()},setTemporary:function(a){k=!a},init:function(){console.debug("Storage: use "+
f.DB.USE);Object.getOwnPropertyNames(h.implementations[f.DB.USE].methods).forEach(function(a){h.__defineGetter__(a,function(){return h.implementations[f.DB.USE].methods[a]})});return h.implementations[f.DB.USE].init?h.implementations[f.DB.USE].init():d.Pledge()},getValues:function(a,b){var c={};b||(b={});Object.getOwnPropertyNames(a).forEach(function(a){c[a]=h.implementations[f.DB.USE].getValue(a,b[a])});return c},factoryReset:function(){m.removeItem(f.CONSTANTS.STORAGE.LEGACY_VERSION);return h.deleteAll()},
isWiped:function(){if("localStorage"===f.DB.USE)return d.Pledge(!1);var a=d(),b=h.getValue(f.CONSTANTS.STORAGE.VERSION),c=!1;m.getItem(f.CONSTANTS.STORAGE.LEGACY_VERSION)&&!b&&(h.listValues().length?console.warn("storage: unable to find version information"):c=!0);a.resolve(c);return a.promise()},setVersion:function(a,b){var c=d();k?(m.setItem(f.CONSTANTS.STORAGE.LEGACY_VERSION,a),h.setValue(f.CONSTANTS.STORAGE.VERSION,a).then(function(){return b?h.setValue(f.CONSTANTS.STORAGE.SCHEMA,b):d.Pledge()}).always(c.resolve)):
c.resolve();return c.promise()},getVersion:function(a){var b=d(),c=h.getValue(f.CONSTANTS.STORAGE.VERSION)||h.getValue(f.CONSTANTS.STORAGE.LEGACY_VERSION)||m.getItem(f.CONSTANTS.STORAGE.LEGACY_VERSION);c?b.resolve(c):q("sql","init").then(function(b){c=h.implementations.sql.methods.getValue(f.CONSTANTS.STORAGE.LEGACY_VERSION)||a;return q("sql","clean")}).always(function(){b.resolve(c||a)});return b.promise()},getSchemaVersion:function(){return h.getValue(f.CONSTANTS.STORAGE.SCHEMA,"3.5")},addDifferentOriginChangeListener:function(a,
b){z.push({search:a,cb:b})},notifyDifferentOriginChangeListeners:function(a,b){z.forEach(function(c){0==a.search(c.search)&&c.cb(a,b)})},recover:function(a,b){"string"===typeof a&&(a={method:a,storages:["sql","chromeStorage"]});var c={};a.storages.forEach(function(a){c[a]=!0});if("log"==a.method){var e=null,d,f,h=[{method:"sql",fn:function(a){console.debug("check sql storage for data...");try{f=A();if(rea.runtime.lastError||!f)return e=rea.runtime.lastError,a();f.transaction(function(b){b.executeSql("CREATE TABLE IF NOT EXISTS config(ID INTEGER PRIMARY KEY ASC, name TEXT, value TEXT)",
[],function(){console.debug("sql table found/created");a()},function(b,c){e=c;a()})})}catch(b){e=b,window.setTimeout(a,1)}}},{method:"sql",fn:function(a){var b={};f.transaction(function(c){c.executeSql("SELECT * FROM config",[],function(c,e){if(e)for(var f=0;f<e.rows.length;f++)b[e.rows.item(f).name]=e.rows.item(f).value;d=b;window.setTimeout(a,1)},function(b,c){e=c;a()})})}},{method:"sql",fn:function(a){var b=d?Object.getOwnPropertyNames(d):[];d&&b.length?(console.debug("found values:"),b.forEach(function(a){console.debug("    ",
a,d[a]&&30<d[a].length?d[a].substr(0,30):d[a])})):(console.warn("no data found"),c.sql=!1);window.setTimeout(a,1)}},{method:"chromeStorage",fn:function(a){console.debug("check chromeStorage for data...");rea.storage.local.get(null,function(b){d=b;a()})}},{method:"chromeStorage",fn:function(a){var b=d?Object.getOwnPropertyNames(d):[];d&&b.length?(console.debug("found values:"),b.forEach(function(a){console.debug("    ",a,d[a]&&30<d[a].length?d[a].substr(0,30):d[a])})):(console.warn("no data found"),
c.chromeStorage=!1,window.setTimeout(a,1))}}],k=0,m=function(){if(e)console.warn("error:",e);else for(;h[k];){if(c[h[k].method]){h[k].fn(m);k++;return}k++}b&&b()};m()}}};Registry.register("storage","5549",function(){return h})})})();
