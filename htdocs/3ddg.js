function API(app_id,server){
	this.app_id = app_id;
	this.name = server;
	this.server = 'http://' + server + '.3ddg.net';
	this.img = 'http://img.3ddg.net/' + server;
	this.icon = 'img/icon';//this.img + '/img/icon';
	this.picture = 'img/picture';//this.img + '/img/picture';
	this.symbol = 'img/symbol';//this.img + '/img/symbol';
}
API.prototype.error = function(r){
	error_message = $.parseJSON(r);
	build.hideMask();
	build.alert(error_message.message,function(){
		build.showMask();
		//oso().view('canvas');
		parent.location.href = 'http://mixi.jp/run_appli.pl?id=' + api.app_id;
	});
};
API.prototype.fmap = function(){
	for(var i = 0; i < privates.length; i++){
		data = privates[i];
		fmap[data.user] = fmap[data.user] || {num: 0, clear: 0, failed: 0, not: 0};
		fmap[data.user].num ++;
		if(goals[data.id] && goals[data.id][viewer.user]){
			if(goals[data.id][viewer.user].goal) fmap[data.user].clear ++;
			else if(goals[data.id][viewer.user].start) fmap[data.user].failed ++;
		}
		else fmap[data.user].not ++;
	}
};
API.prototype.loadLocalStrage = function(key){
	console.log('Load ' + key);
	if(('localStorage' in window) && (window.localStorage !== null)) {
		if (localStorage[key]) {
			window[key] = JSON.parse(localStorage[key]);
		}
	}
};
API.prototype.saveLocalStrage = function(key){
	console.log('Save ' + key);
	if(('localStorage' in window) && (window.localStorage !== null)) {
		localStorage[key] = JSON.stringify(window[key]);
	}
};
API.prototype.load = function(){
	build.showMask();
	oso.ajax({
		url: this.server + '/load',
		method: 'GET',
		content_type: 'JSON',
		auth_type: 'SIGNED'
	}, function(r){
		if (r) {
			api.loadLocalStrage('playdata');
			viewer = playdata.viewer;
			friends = playdata.friends;
			publics = playdata.publics;
			privates = playdata.privates;
			works = playdata.works;
			goals = playdata.goals;
			api.fmap();
			build.viewer();
			build.ranking();
			build.publics();
			build.privates();
			build.works();
			build.hideMask();
		} else {
			build.hideMask();
			//var keys = '';
			//for(var key in this)
			//	keys += ' ' + key;
			//alert($.toJSON(this.rc));
			if(this.rc == '403')
				this.text = 'セッションタイムアウト<br />再読み込みします。';
			build.alert(this.text,function(){
				build.showMask();
				//oso().view('canvas');
				parent.location.href = 'http://mixi.jp/run_appli.pl?id=' + api.app_id;
			});
		}
	});
};
API.prototype.loadPrivate = function(){
	build.showMask();
	$('.title-logo-top').fadeOut('fast',function(){
		$(this).fadeIn('fast')
		.removeClass('title-logo-top').addClass('title-logo-contents');
	});
	$('.contents:visible').fadeOut('fast',function(){
		$('#private-list').fadeIn('fast');
	});
	oso.ajax({
		url: this.server + '/loadPrivate',
		method: 'GET',
		content_type: 'JSON',
		auth_type: 'SIGNED'
	}, function(r){
		if (r) {
			privates = this.data.privates;
			for(var i = 0; i < privates.length; i++){//更新チェック 更新されてる場合はmapsから削除し再読み込みされるようにする
				if(maps[privates[i].id] && maps[privates[i].id].modified != privates[i].modified){
					delete(maps[privates[i].id]);
				}
			}
			goals = this.data.goals;
			build.privates();
			build.hideMask();
		} else {
			build.hideMask();
			if(this.rc == '403')
				this.text = 'セッションタイムアウト<br />再読み込みします。';
			build.alert(this.text,function(){
				build.showMask();
				parent.location.href = 'http://mixi.jp/run_appli.pl?id=' + api.app_id;
			});
		}
	});
};
API.prototype.updateMap = function(map_data){
	build.showMask();
	oso.ajax({
		url: this.server + '/updateMap',
		method: 'POST',
		content_type: 'JSON',
		auth_type: 'SIGNED',
		post_data: {
			map_data: Base64.encode($.toJSON(map_data))
		}
	}, function(r){
		if (r) {
			//map = new Map(this.data.map.detail,$("#map"));
			//map.draw();
			this.data.map = api.decode(this.data.map);
			maps[this.data.map.id] = this.data.map;
			build.map(this.data.map.id);
			works = this.data.works;
			build.works();
			build.hideMask();
		} else {
			api.error(this.text);
		}
	});	
};
API.prototype.clearPublic = function(map_id){
	build.showMask();
	var _items = {};
	var _flgs = {};
	for(var key in game.items){
		if(viewer.detail.items[key]);
		else 
			_items[key] = game.items[key]
	}
	for(var key in game.flgs){
		if(viewer.detail.flgs[key]);
		else 
			_flgs[key] = game.flgs[key]
	}
	oso.ajax({
		url: this.server + '/clearPublic',
		method: 'POST',
		content_type: 'JSON',
		auth_type: 'SIGNED',
		post_data: {
			map_data: Base64.encode($.toJSON({
				map_id: map_id,
				start: local.start,
				detail: local.log,
				flgs: _flgs,
				items: _items
			}))
		}
		/*post_data: {
			map_id: map_id,
			start: local.start,
			detail: Base64.encode($.toJSON(local.log)),
			flgs: Base64.encode($.toJSON(flgs_)),
			items: Base64.encode($.toJSON(items_))
		}*/
	}, function(r){
		if (r) {
			if (maps[map_id].time) {
				maps[map_id].time = 'second';
			} else {
				maps[map_id].time = 'first';
				playdata.viewer.exp += maps[map_id].exp;
				playdata.goals[map_id] = {};
				playdata.goals[map_id][playdata.viewer.user] = {};
				playdata.goals[map_id][playdata.viewer.user].goal = true;
			}
			api.saveLocalStrage('playdata');
			viewer = playdata.viewer;
			publics = playdata.publics;
			goals = playdata.goals;
			game.gi = playdata.gi;
			//friends[viewer.user].exp = viewer.exp;
			build.viewer();
			build.ranking();
			build.publics();
			build.retry('sc',maps[map_id].time/*this.data.time*/);
			build.hideMask();
		} else {
			api.error(this.text);
		}
	});	
};
API.prototype.clearPrivate = function(map_id){
	build.showMask();
	oso.ajax({
		url: this.server + '/clearPrivate',
		method: 'POST',
		content_type: 'JSON',
		auth_type: 'SIGNED',
		post_data: {
			map_data: Base64.encode($.toJSON({
				map_id: map_id,
				start: local.start,
				detail: local.log
			}))
		}
	}, function(r){
		if (r) {
			//maps[this.data.map.id] = this.data.map;
			//build.map(this.data.map.id);
			//privates = this.data.privates;
			goals = this.data.goals;
			api.fmap();
			build.privates();
			build.retry('sc',this.data.time);
			build.hideMask();
		} else {
			api.error(this.text);
		}
	});	
};
API.prototype.updateMapStatus = function(map_id){
	build.showMask();
	oso.ajax({
		url: this.server + '/updateMapStatus',
		method: 'POST',
		content_type: 'JSON',
		auth_type: 'SIGNED',
		post_data: {
			map_data: Base64.encode($.toJSON({
				map_id: map_id,
				start: local.start,
				detail: local.log				
			}))
		}
	}, function(r){
		if (r) {
			this.data.map = api.decode(this.data.map);
			maps[this.data.map.id] = this.data.map;
			build.map(this.data.map.id);
			works = this.data.works;
			build.works();
			build.retry('sc',this.data.time);
			build.hideMask();
		} else {
			api.error(this.text);
		}
	});
};
API.prototype.loadMap = function(map_id){
	if(maps[map_id]){
		build.map(map_id);
		return;
	}
	build.showMask();
	oso.ajax({
		url: this.server + '/loadMap?map_id=' + map_id,
		method: 'GET',
		content_type: 'JSON',
		auth_type: 'SIGNED'
	}, function(r){
		if (r) {
			this.data.map = api.decode(this.data.map);
			maps[this.data.map.id] = this.data.map;
			build.map(this.data.map.id);
			build.hideMask();
		} else {
			api.error(this.text);
		}
	});	
};
API.prototype.decode = function(map){
	var _text = '';
	for(var i = 1; i < str.length - 1; i+=2){
		code = '0x' + str.charAt(i) + str.charAt(i+1);
		_text += String.fromCharCode(code);
	}
	return $.parseJSON(_text);
	//map.symbols = JSON.parse(map.symbols);
	//map.detail = JSON.parse(map.detail);
	return map;
};
API.prototype.tryMap = function(map_id){
	if(maps[map_id]){
		build.stage(map_id);
		return;
	}
	build.showMask();
	oso.ajax({
		url: this.server + '/loadMap?map_id=' + map_id,
		method: 'GET',
		content_type: 'JSON',
		auth_type: 'SIGNED'
	}, function(r){
		if (r) {
			//this.data.map = api.decode(this.data.map);
			maps[map_id] = playdata.publics.filter(map => map.id == map_id)[0];
			build.stage(map_id);
			if (!playdata.goals[map_id]) {
				playdata.goals[map_id] = {};
				playdata.goals[map_id][playdata.viewer.user] = {};
			}
			api.saveLocalStrage('playdata');
		} else {
			api.error(this.text);
		}
	});	
};
API.prototype.createMap = function(){
	build.showMask();
	oso.ajax({
		url: this.server + '/createMap',
		method: 'GET',
		content_type: 'JSON',
		auth_type: 'SIGNED'
	}, function(r){
		if (r) {
			works = this.data.works;
			build.works();
			build.hideMask();
		} else {
			api.error(this.text);
		}
	});	
};
API.prototype.deleteMap = function(map_id){
	build.showMask();
	oso.ajax({
		url: this.server + '/deleteMap',
		method: 'POST',
		content_type: 'JSON',
		auth_type: 'SIGNED',
		post_data: {
			map_id: map_id
		}
	}, function(r){
		if (r) {
			works = this.data.works;
			build.works();
			$('.contents:visible').hide();
			$('#work-list').show();
			//gadgets.window.adjustHeight();
			build.hideMask();
		} else {
			api.error(this.text);
		}
	});	
};

function waiter(){
	for(var key in imgs){
		if(imgs[key].complete);
		else return;
	}
	for(var key in map.symbols){
		if(map.symbols[key].imgs){
			for(var i = 0; i < map.symbols[key].imgs.length; i++){
				if(map.symbols[key].imgs[i].complete);
				else return;
			}
		}
	}

	clearInterval(waitTimer);
	scene.draw();
	$('#stage').fadeIn('slow');
	local.start = new Date() / 1000 | 0;		
	//build.bind();
	build.hideMask();
	var start = map.symbols['start'];
	start.meet();
}
function setLoader(src){
	var img = new Image();
	img.src = src;
	if(loader[src] || img.complete)
		return img;
	loader[src] = false;
	$(img).load(function(){
		loader[this.src] = true;
	});
	return img;
}
function controller(keyCode){
	//if(!$('#notice:animated').length)
	//	$('#notice:visible').fadeOut(500);
	if(keyCode == '40') return;
	if(keyCode == '32'){
		res = map.openDoor(game.key.length);
		if(res == 1){
			game.key.pop();
			build.removeKey();
			build.popup('鍵を開けた');
		}
		if(res == 2){
			build.popup('鍵がかかっている');
		}
		if(key = map.hit()){
			map.symbols[key].hit();
		}
	}
	if(forward = local.move(keyCode)){
		map.forward();
		local.forward(keyCode);
		map.forward(true);
		local.pushLog();
	}else if(keyCode == '38' || keyCode == '40'){
		build.popup('Ouch!');
	}else{
		//build.compass();
		//alert(keyCode + ' d: ' + local.d);
	}
	//map.draw(true);
	scene.draw();
	if(forward){
		if(map.crash()) return;
		_symbols = map.meet();
		while(key = _symbols.pop()){
			if((keyCode != '38' && keyCode != '40') && map.symbols[key].fo);
			else
				map.symbols[key].meet();
		}
	}
}

var game = {};
game.addItem = function(itemCode){
	this.items[itemCode] = {x:local.x,y:local.y,z:local.z};
	build.addItem(itemCode);
};
game.useItem = function(itemCode){
	delete(this.items[itemCode]);
	build.removeItem(itemCode);
};

var viewer,friends;
var publics,privates,works,goals;
var api = new API('33996','m99');
var build = new Build();

var canvas, ctx;
var canvasWidth, halfCanvasWidth;
var canvasHeight, halfCanvasHeight;
var readyCanvas/*,readyImage*/;
var unitWidth = 210, unitHeight = 420;
var distance = 0.5;

var map,local;
var maps = {};

var from;
var loader = {};
var imgs = {};
var fmap = {};
var go,sc;
var message = {};

function xcanvas(){
	canvas = document.getElementById("canvas");
    ctx = canvas.getContext("2d");
	canvasWidth = canvas.width;
	canvasHeight = canvas.height;
	halfCanvasWidth = canvasWidth * 0.5;
	halfCanvasHeight = canvasHeight * 0.5 - 25;
    readyCanvas = true;	
}

$(function(){

	xcanvas();
	//alert($.toJSON(uu.ver));
	//scene.depth = 2;
	
	/*if(uu.ver.ie && uu.ver.silverlight == 0){
		build.alert(
			'<p>InternetExplorerで動作させるにはSilverlightをインストールする必要があります。</p><p>動作環境をご確認ください。</p>',
			function(){
				location.href = 'http://mixi.jp/view_appli.pl?id=' + api.app_id;
			}
		);
		return false;
	}*/
	
	$('#recruit').click(function(){
		//oso.activity('3Dダンジョン迷路「' + maps[map.id].name + '」をつくりました！挑戦者募集中！','HIGH',function(){});
		oso.request({
			join: 'BOTH',
			url: 'http://mixi.jp/run_appli.pl?id=33996',
			text: '3Dダンジョン迷路「' + maps[map.id].name + '」をつくりました！挑戦者募集中！'
		});
	});

	$('#invite').click(function(){
		oso.shareApp(function(){});
		/*oso.request({
			'join': 'BOTH',
			'url': 'http://mixi.jp/run_appli.pl?id=' + api.app_id + '&appParams=' + 'aaabbbccc',
			'text': 'てつおのテスト',
			'desc': 'おかにあがったカッパのテスト'
		});*/
	});
	
	$('#help').click(function(){
		url = 'http://mixi.jp/navigate_to_external_site_from_appli.pl?app_id=' + api.app_id + '&url=http%3A%2F%2F3ddg.net%2Fhelp%2F&site_type=general&owner_uid=' + viewer.user;
		window.open(url,'new');
	});

	$('#help-editor span').click(function(){
		url = 'http://mixi.jp/navigate_to_external_site_from_appli.pl?app_id=' + api.app_id + '&url=http%3A%2F%2F3ddg.net%2Fhelp%2F%234&site_type=general&owner_uid=' + viewer.user;
		window.open(url,'new');
	});

	$('#myinfo').click(function(){
		var level = new Level(viewer.exp);
		var now = $(this).attr('level');
		var next = level.level - 0 > now - 0 ? now - 0 + 1 : 1;
		var src = api.picture + '/' + level_data[next].src.m;
		$('.title',this).html(level_data[next].title);
		$('img',this).attr('src',src);
		$(this).attr('level',next);
	});
	
	$('#save').click(function(){
		var sd = {};//symbol data
		for(var name in map.symbols){
			sd[name] = {};
			var symbol = map.symbols[name];
			for(var key in symbol){
				if(symbol[key] == undefined || symbol[key] === '');
				else if(typeof(symbol[key]) == 'function');
				else if(typeof(symbol[key]) == 'object' && key != 'text');
				else if(symbols[symbol.type][key] == symbol[key] && symbol[key] != 0);
				else{
					symbol[key] = symbol[key] == 'true' ? true : symbol[key];
					symbol[key] = symbol[key] == 'false' ? false : symbol[key];
					sd[name][key] = symbol[key];
				}
			}
			if(symbol['src']){
				/*
				 * デフォルトデータと比較して差があればsdに値をセット
				 * 配列になってるけど値がすべて同じやつは配列じゃなくして値をセット
				 */
				if(symbol['src'] + "" == symbols[symbol.type]['src'] + "");
				else {
					if(typeof(symbol['src']) == 'object'){
						_src = symbol['src'][0];
						for(var i = 1; i < symbol['src'].length; i++){
							if(_src == symbol['src'][i])
								sd[name]['src'] = symbol['src'][i];								
							else {
								sd[name]['src'] = symbol['src'];
								break;
							};
						}
					}else{
						sd[name]['src'] = symbol['src'];
					}
					if(sd[name]['src'] == symbols[symbol.type]['src']){
						delete(sd[name]['src']);
					}
				}
			}
			//alert(name + ": " + $.toJSON(sd[name]));
		}
		api.updateMap({
			map_id: $('#map').attr('map_id'),
			name: $('#map_name').val(),
			symbols: sd,
			detail: map.data
		});
	});

	$('#create').click(function(){
		var level = new Level(viewer.exp);
		if(level.param.max == 0){
			build.alert('<p>レベルが上がるまで、迷路は作れません。</p>');
		}
		else if(level.param.max <= works.length){
			build.alert('<p>今のレベルでは、これ以上迷路を作れません。</p>');
		}
		else
			api.createMap();
	});

	$('#delete').click(function(){
		build.confirm(
			"<p>" + build.escape(maps[$('#map').attr('map_id')].name) + " を削除します。</p>",
			function(){
				api.deleteMap($('#map').attr('map_id'));
			}
		);
	});
	
	$('#try').click(function(){
		if(err_msg = map.check())
			build.alert(err_msg);
		else
			build.stage($('#map').attr('map_id'));
	});
	
	$('#retry li:eq(0)').click(function(){
		clearInterval(go);
		build.stage(map.id);
		$('#black-out').fadeOut();
		$('#retry').fadeOut();
	});
	
	$('[to=private-list]').click(function(){
		api.loadPrivate();
	});

	$('.link').live('click',function(){
		var to = $(this).attr('to');
		el = $('#' + to);
		if(to == 'editor' && $(this).attr('id') == 'retry-return'){//編集画面に戻るの時
			map_id = map.id;
			map = new Map(maps[map_id].symbols,maps[map_id].detail,$("#map"),map_id);
			map.draw();
		}
		if(to == 'top'){
			$('.title-logo-contents').fadeOut('fast',function(){
				$(this).fadeIn('fast')
				.removeClass('title-logo-contents').addClass('title-logo-top');
			});
		}
		else{
			$('.title-logo-top').fadeOut('fast',function(){
				$(this).fadeIn('fast')
				.removeClass('title-logo-top').addClass('title-logo-contents');
			});
		}
		$('.contents:visible').fadeOut('fast',function(){
			$(el).fadeIn('fast');
		});

		$('#retry:visible').fadeOut();
		$('#black-out:visible').fadeOut();
		clearInterval(go);
		clearInterval(sc);
		//gadgets.window.adjustHeight();
	});
	
	$('#symbols').droppable({
		//activeClass: "hover-symbol",
		hoverClass: "hover-symbol",
		drop: function( event, ui ) {
			var key = $(ui.draggable).attr('key');
			if(!map.symbols[key]){
				ui.draggable.css('left','').css('top','');
				return false;
			}
			if(map.symbols[key].type == 'msg'){
				ui.draggable.remove();
				$('#msg-num').html($('#msg-num').html() - 0 + 1);
			}else if(map.symbols[key].type == 'event'){
				ui.draggable.remove();
			}else{
				$(this).append(ui.draggable);
				ui.draggable.css('left',0).css('top',0);
			}
			delete(map.symbols[key]);
		}
	});
	
	$('#msg-editor-ok').click(function(){
		var key = $('#msg-editor').attr('key');
		var text = $('#msg-editor textarea').val();
		text = text.replace(/\n+/g,'\n');//連続した改行削除
		text = text.replace(/ +/g,' ');//連続したスペース削除
		map.symbols[key].text = $.trim(text);
		$('#msg-editor').fadeOut('fast');
		$('#mask-editor').hide();
	});

	$('#event-editor-ok').click(function(){
		var key = $('#event-editor').attr('key');
		var flgkey = $('#event-editor [name=name]').val();
		if(flgkey != key){
			map.symbols[flgkey] = map.symbols[key];
			delete(map.symbols[key]);
			$('.cell img[key=' + key + ']',map.el).remove();
		}
		$('#event-editor input').each(function(){
			map.symbols[flgkey][$(this).attr('name')] = $(this).val();
		});
		map.symbols[flgkey]['callback'] = $('#event-editor textarea[name=callback]').val();
		var text = $('#event-editor textarea[name=text]').val();
		text = $.trim(text).split(',');
		text = text.length === 1 ? text[0] : text;
		map.symbols[flgkey]['text'] = text;
		var src = $('#event-editor [name=src]').val();
		src = $.trim(src).split(',');
		src = src.length === 1 ? src[0] : src;
		map.symbols[flgkey]['src'] = src;
		//alert($.toJSON(map.symbols[flgkey]));
		$('#event-editor').fadeOut('fast');
		$('#mask-editor').hide();
		map.draw(true);
		//alert($.toJSON(map.symbols[flgkey]));
	});
	
	$('#mask-editor').click(function(){
		$('#msg-editor:visible,#event-editor:visible').fadeOut('fast');
		$('#mask-editor').hide();
	});

	//setInterval(function() { gadgets.window.adjustHeight(); }, 1000);
	//gadgets.window.adjustHeight();
	
	api.load();

	oso.reqParam = {
		persons: [
			{name: "viewer"}/*,
			{name: "viewer_friends", has_app: true}*/
		],
		profile: ["url", "age", "birthday", "gender"]
	};

	oso.init(function(){
		if(oso('viewer').profile('has_app') == 'false')
			parent.location.href = 'http://mixi.jp/view_appli.pl?id=' + api.app_id;
		/*else{
			readyOSO = setInterval(function(){
				if(privates && friends){
					build.privates();
					build.ranking();
					clearInterval(readyOSO);
				}
			},100);
		}*/
	});
	
	$('#top').show();
	//gadgets.window.adjustHeight();
	
});
