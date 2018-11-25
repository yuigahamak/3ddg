function Build(){
	this.pageNum = 8;
	this.rankingNum = 5;
}
Build.prototype.escape = function(text){
	if(!text) return "";
	text = text.replace(/</gi,'&lt;');//<変換
	text = text.replace(/>/gi,'&gt;');//>変換
	text = text.replace(/\n/g,'\n');//改行削除
	text = text.replace(/ +/g,' ');//連続したスペース削除
	text = $.trim(text);
	return text;
};
Build.prototype.escape_npbr = function(text){
	//pタグを残す＆改行をbrに変換
	if(!text) return "";
	text = text.replace(/</gi,'&lt;');//<変換
	text = text.replace(/>/gi,'&gt;');//>変換
	text = text.replace(/&lt;p&gt;/gi,'<p>');//<p>復活
	text = text.replace(/&lt;\/p&gt;/gi,'</p>');//</p>復活
	text = text.replace(/&lt;h3&gt;/gi,'<h3>');//<h3>復活
	text = text.replace(/&lt;\/h3&gt;/gi,'</h3>');//</h3>復活
	text = text.replace(/\n+/g,'\n');//連続した改行削除
	text = text.replace(/ +/g,' ');//連続したスペース削除
	text = $.trim(text);
	text = text.replace(/\n/g,'<br />');//改行をbrに変換	
	return text;
};
Build.prototype.showMask = function(){
	$('#ajax-mask').show();
	$('#ajax-loader').show();
};
Build.prototype.hideMask = function(){
	$('#ajax-mask').hide();
	$('#ajax-loader').hide();
};
Build.prototype.alert = function(text,callback){
	$('#ajax-mask').show();
	$('#alert .text').html(text);
	$('#alert').show();
	$('#alert button').focus().one('click',function(){
		$('#ajax-mask').hide();
		$('#alert').hide();
		if(typeof(callback) == 'function')
			callback.call();
	});
};
Build.prototype.confirm = function(text,ok,cancel){
	$('#ajax-mask').show();
	$('#confirm .text').html(text);
	$('#confirm').show();
	$('#confirm button:eq(1)').focus();
	$('#confirm button').one('click',function(){
		$('#confirm button').unbind('click');
		$('#ajax-mask').hide();
		$('#confirm').hide();
		if($(this).attr("confirm") == "ok" && typeof(ok) == 'function')
			ok.call();
		if($(this).attr("confirm") == "cancel" && typeof(cancel) == 'function')
			cancel.call();
	});
};
Build.prototype.viewer = function(){
	var level = new Level(viewer.exp);		
	$('#myinfo .level span:eq(0)').html(level.level);
	$('#myinfo .level span:eq(1)').html(viewer.exp);
	$('#myinfo .info .title').html(level.param.title);
	$('#myinfo .info .name').html(viewer.name);
	var src = api.picture + '/' + level.param.src.m;
	$('#myinfo img').attr('src',src);
	$('#myinfo').attr('level',level.level);
};
Build.prototype.ranking = function(page){
	var rank = 0;
	var diff = 1;
	var be = null;//before exp

	page = page || 0;
	
	var ranking = $('#ranking');
	$(ranking).empty();
	var i = 0;
	for(var key in friends){
		var level = new Level(friends[key].exp);		
		if(friends[key].exp == be)
			diff++;
		else{
			rank += diff;
			diff = 1;
			be = friends[key].exp;
		}
		
		i++;
		if(i > (page + 1) * this.rankingNum) continue;
		else if(i <= page * this.rankingNum) continue;

		var ranktext = document.createElement('div');
		$(ranktext).addClass('rank').html(rank + '位');

		var title = document.createElement('div');
		$(title).addClass('title').html(level.param.title);

		var name = document.createElement('div');
		$(name).addClass('name').html(friends[key].name);

		//var dg = document.createElement('div');
		//$(dg).addClass('normal').addClass('center');
		//var status = document.createElement('div');
		//$(status).addClass('normal').addClass('center');
		//if(fmap[key]){
			//$(dg).html(fmap[key].num + 'つの迷路で君の挑戦を待っている');
			/*var clear = fmap[key].clear ? '攻略済み <span>' + fmap[key].clear + '</span>' : '';
			var failed = fmap[key].failed ? '失敗 <span>' + fmap[key].failed + '</span>' : '';
			var not = fmap[key].not ? '未挑戦 <span>' + fmap[key].not + '</span>' : '';
			$(status).html(clear + ' ' + failed + ' ' + not);*/
		//}

		var thum = document.createElement('img');
		var src = friends[key].thumbnail.replace(/s\.jpg$/,'m.jpg');
		src = src.replace(/76\.gif$/,'40.gif');
		$(thum).addClass('thum').attr('src',src);

		src = api.picture + '/' + level.param.src.s;
		var img = document.createElement('img');
		$(img).addClass('pic').attr('src',src);

		var lv = document.createElement('div');
		$(lv).attr('class','level').html('LEVEL ' + level.level);

		var div = document.createElement('div');		
		$(div).attr('class','row');
		$(div).append(img).append(thum).append(lv);
		$(div).append(ranktext).append(title).append(name)/*.append(status)*/;
		$(ranking).append(div);
	}
	this.rankingNavi(i, page);
};
Build.prototype.rankingNavi = function(n,page){
	$('.pageNavi','#top .navi').remove();
	if(n <= this.rankingNum) return;
	for(var i = 0; i < n / this.rankingNum; i++){
		var span = document.createElement('span');		
		$(span).addClass('pageNavi').html(i + 1)
		.click(function(){
			build.ranking($(this).html() - 1);
		});
		if(page == i)
			$(span).addClass('now');
		$('#top .navi').append(span);
	}
};
Build.prototype.pageNavi = function(n,el,page,name){
	$('.pageNavi',el).remove();
	//n = 50;
	if(n <= this.pageNum) return;
	for(var i = 0; i < n / this.pageNum; i++){
		var span = document.createElement('span');		
		$(span).addClass('pageNavi').html(i + 1)
		.click(function(){
			build[name]($(this).html() - 1);
		});
		if(page == i)
			$(span).addClass('now');
		$(el).append(span);
		//$(span).insertBefore($('.return',el));
	}
};
Build.prototype.publics = function(page){
	page = page || 0;
	var length = publics.filter(public => public.require <= playdata.viewer.exp).length;
	this.pageNavi(length, $('#public-list .navi'), page, 'publics');
	var list = $('#public-list .list');
	$(list).attr('page',page).empty();
	for(var i = page * this.pageNum; i < length && i < (page + 1) * this.pageNum; i++){
		row = publics[i];
		var name = document.createElement('div');		
		$(name).addClass('map-name').html(this.escape(row.name));
		//var size = document.createElement('div');		
		//$(size).html(row.name);
		
		/*var status = document.createElement('div');
		if(goals[row.id] && goals[row.id][viewer.user]){
			if(goals[row.id][viewer.user].goal)
				str = "クリア済み " + goals[row.id][viewer.user].goal;
			else
				str = "失敗 " + goals[row.id][viewer.user].start;
		}
		else
			str = '未挑戦';
		$(status).html(str);*/

		var src = api.icon + '/' + level_icon[row.level];
		var img = document.createElement('img');
		$(img).attr('src',src).addClass('level-img');
		var level = document.createElement('div');
		$(level).attr('class','level').html('LEVEL ' + (row.level - 1));
		var div = document.createElement('div');		
		$(div).attr('map_id',row.id).attr('class','row')
		.click(function(){
			api.tryMap($(this).attr('map_id'));
		});
		$(div).append(img).append(level).append(name);
		if(goals[row.id] && goals[row.id][viewer.user]){
			if(goals[row.id][viewer.user].goal)
				src = api.picture + '/clear.png';
			else
				src = api.picture + '/failed.png';
			var status = document.createElement('img');
			$(status).attr('src',src).addClass('status-img');
			$(div).append(status);
		}
		$(list).append(div);
	}
};
Build.prototype.privates = function(page){
	page = page || 0;
	this.pageNavi(privates.length, $('#private-list .navi'), page, 'privates');
	var list = $('#private-list .list');
	$(list).attr('page',page).empty();
	if(privates.length == 0){
		var p = document.createElement('p');
		$(p).html('友人の作った迷路はありません');
		$(list).append(p);
	}
	for(var i = page * this.pageNum; i < privates.length && i < (page + 1) * this.pageNum; i++){
		row = privates[i];
		var name = document.createElement('div');		
		$(name).addClass('map-name').html(this.escape(row.name));
		var auth = document.createElement('div');		
		$(auth).addClass('auth').html('作者 ' + friends[row.user].name);
		
		var src = api.icon + '/' + level_icon[row.level];
		var img = document.createElement('img');
		$(img).attr('src',src).addClass('level-img');
		var level = document.createElement('div');
		$(level).attr('class','level').html('LEVEL ' + (row.level - 1));
		var div = document.createElement('div');		
		$(div).attr('map_id',row.id).attr('class','row')
		.click(function(){
			api.tryMap($(this).attr('map_id'));
		});
		$(div).append(img).append(level).append(name).append(auth);
		if(goals[row.id] && goals[row.id][viewer.user]){
			if(goals[row.id][viewer.user].goal)
				src = api.picture + '/clear.png';
			else
				src = api.picture + '/failed.png';
			var status = document.createElement('img');
			$(status).attr('src',src).addClass('status-img');
			$(div).append(status);
		}
		$(list).append(div);
	}
};
Build.prototype.works = function(page){
	page = page || 0;
	this.pageNavi(works.length, $('#work-list .navi'), page, 'works');
	var list = $('#work-list .list');
	$(list).attr('page',page).empty();
	for(var i = page * this.pageNum; i < works.length && i < (page + 1) * this.pageNum; i++){
		row = works[i];
		var name = document.createElement('div');		
		$(name).addClass('map-name').html(this.escape(row.name));
		
		var status = document.createElement('div');
		if(row.status == 1)
			str = "公開中";
		else
			str = "作成中";
		$(status).html(str);

		var src = api.icon + '/' + level_icon[row.level];
		var img = document.createElement('img');
		$(img).attr('src',src).addClass('level-img');
		var level = document.createElement('div');
		$(level).attr('class','level').html('LEVEL ' + (row.level - 1));
		var div = document.createElement('div');		
		$(div).attr('to','editor').attr('map_id',row.id).addClass('row').addClass('link')
		.click(function(){
			api.loadMap($(this).attr('map_id'));
		});
		$(div).append(img).append(level).append(name).append(status);
		$(list).append(div);
	}

	return;
	ul = $('#work-list ul');
	$(ul).empty();
	for(var i = 0; i < works.length; i++){
		row = works[i];
		var li = document.createElement('li');		
		$(li).attr('to','editor').attr('map_id',row.id)
		.addClass('link').html(row.name + ' ' + row.modified)
		.click(function(){
			api.loadMap($(this).attr('map_id'));
		});
		$(ul).append(li);
	}
};
Build.prototype.symbols = function(){
	$('#symbols').empty();
	var level = new Level(viewer.exp);
	for(var i = 0; i < level.param.symbols.length; i++){
		var key = level.param.symbols[i];
		if(map.symbols[key]) continue;
		var img = document.createElement('img');
		var src = api.icon + '/' + symbols[key].icon;
		$(img).attr('src',src);
		$(img).attr('key',key);
		$(img).attr('title',symbols[key].title);
		if(key == 'msg'){
			$(img).draggable(map.symbolDrag);
			var msg_num = document.createElement('div');
			var count = level.param.msg;
			$(msg_num).attr('id','msg-num').html(count);
			for(var key2 in map.symbols){
				if(map.symbols[key2].type == 'msg'){
					count--;
				}
				$(msg_num).html(count);
			}
			$('#symbols').append(img);
			$('#symbols').append(msg_num);
		}
		else{
			$(img).draggable({
				revert: "invalid"
			});
			$('#symbols').append(img);
		}
	}
	//以下はpublicsをエディットするとき用。一般ユーザには表示されない
	for(var i = 0; i < publics.length; i++){
		if(publics[i].id == map.id){
			var keys = {'event': 1};
			for(var key in keys){
				var img = document.createElement('img');
				var src = api.icon + '/' + symbols[key].icon;
				$(img).attr('src',src);
				$(img).attr('key',key);
				$(img).attr('title',symbols[key].title);
				$(img).draggable({
					revert: "invalid"
				});
				$('#symbols').append(img);
			}
		}
	}
};
Build.prototype.map = function(map_id){
	$('#map').attr('map_id',map_id);
	$('#map_name').val(maps[map_id].name);
	$('#map_status').html(maps[map_id].status == 1 ? '公開中' : '作成中');
	if(maps[map_id].status == 1){
		$('#recruit').attr('disabled',false);
	}else{
		$('#recruit').attr('disabled',true);
	}
	map = new Map(maps[map_id].symbols,maps[map_id].detail,$("#map"),map_id);
	map.draw();

	this.symbols();
};
Build.prototype.stage = function(map_id){
	if(maps[map_id]);
	else return false;
	
	location.href="#body";

	game.key = [];
	game.items = playdata.viewer.detail.items;
	game.flgs = playdata.viewer.detail.flgs;
	game.log = [];
	game.gi = null;
	build.items();
	$('#keys').empty();
	
	from = $('.contents:visible').attr('id') == 'stage' ? from : $('.contents:visible').attr('id');

	$('#notice,#pop-up').hide();
	$('.contents:visible').hide();
	//gadgets.window.adjustHeight();
	
	map = new Map(maps[map_id].symbols,maps[map_id].detail,$("#map"),map_id);
	
	imgs.wall = setLoader(api.symbol + '/wall.png');
	imgs.door = setLoader(api.symbol + '/door.png');
	imgs.door2 = setLoader(api.symbol + '/door2.png');
	imgs.door3 = setLoader(api.symbol + '/door3.png');
	imgs.key = setLoader(api.icon + '/k.png');
	/*imgs.compass_0 = setLoader(api.picture + '/compass_0.png');
	imgs.compass_1 = setLoader(api.picture + '/compass_1.png');
	imgs.compass_2 = setLoader(api.picture + '/compass_2.png');
	imgs.compass_3 = setLoader(api.picture + '/compass_3.png');*/
	
	var start = map.symbols['start'];
	var self = new Symbol('self',{
		name: 'self',
		//src: api.picture + '/dummy',
		//src: 'dummy',
		x: start.x,
		y: 0,
		z: start.z,
		d: start.d,
		size_x: 0,
		size_y: 0,
		pos_y: 0,
		alg: 'selfAlg'
	});
	map.symbols['self'] = self;
	local = map.symbols.self.location;
	scene.location = map.symbols.self.location;
	scene.map = map;
	this.unbind();
	this.showMask();
	waitTimer = setInterval('waiter()', 200);
	
};
Build.prototype.levelup = function(level){
	$('#level-up img').attr('src',api.picture + '/' + level.param.src.m);
	$('#level-up .level span:eq(0)').html(level.level);
	$('#level-up .level span:eq(1)').html(level.param.title);
	$('#level-up').show();
};
Build.prototype.retry = function(i,time){
	this.publics();
	$('#level-up').hide();
	$('#retry-title').empty();
	var msg = document.createElement('div');
	var img = document.createElement('img');
	$(img).attr('class','cl');
	if(i == 'sc'){
		$('#retry li:eq(0)').hide();
		if(time == 'first'){
			$(img).attr('src',api.picture + '/clear0.png');
			$('#retry-title').append(img);
		}
		if(game.gi){
			var item_img = document.createElement('img');
			$(item_img).attr('height','40px').attr('width','40px')
			.attr('src',api.icon + '/' + items[game.gi].src);
			$(msg).html('君は' + this.escape(maps[map.id].name) + 'から生還し<br />' + items[game.gi].name);
			$(msg).append(item_img);
			$(msg).append('を手に入れた！');
		}
		else
			$(msg).html('君は' + this.escape(maps[map.id].name) + 'から生還した！');
		$('#retry-title').append(msg);
		var exp = time == 'first' ? maps[map.id].exp : 0;
		exp = exp - 0 + ((game.gi && items[game.gi].exp) ? items[game.gi].exp : 0);
		if(exp){
			var div = document.createElement('div');
			$(div).addClass('exp').html('EXP +' + exp);
			$('#retry-title').append(div);
			var before = new Level(viewer.exp - exp);
			var after = new Level(viewer.exp);
			if(before.level - 0 < after.level - 0)
				this.levelup(after);
		}
	}
	if(i == 'go'){
		$('#retry li:eq(0)').show();
		$(img).attr('src',api.picture + '/failed0.png');
		$('#retry-title').append(img);
		$(msg).html('君は' + this.escape(maps[map.id].name) + 'に敗北した・・・');
		$('#retry-title').append(msg);
	}
	
	$('#retry li:eq(1)').attr('to',from).attr('map_id',map.id);
	$('#retry li:eq(1)').html(menuName[from]);
	$('#black-out img').hide();
	$('#black-out').fadeIn(function(){
		$('#retry').fadeIn();
		if(i == 'go'){
			$('#go').css('right','-300px').show().animate({right: '760px'},6000,'linear');
			go = setInterval(function(){
				$('#go').css('right','-150px').show().animate({right: '760px'},6000,'linear');
			},7000);
		}
		if(i == 'sc'){
			$('#sc').fadeIn('slow');
		}
	});
};
Build.prototype.items = function(){
	$('#items').empty();
	for(var key in game.items){
		this.addItem(key);
	}
};
Build.prototype.addItem = function(cd){
	var item = items[cd];
	var img = document.createElement('img');
	var src = api.icon + '/' + item.src;
	$(img).attr('src',src).attr('title',item.name).attr('itemCode',cd);
	$("#items").append(img);
};
Build.prototype.removeItem = function(cd){
	var item = items[cd];
	$("#items [itemCode=" + cd + "]").remove();
};
Build.prototype.addKey = function(){
	if($('#keys img').length < game.key.length){
		var key = $(imgs.key).clone();
		$(key).css('width',0).css('height',0);
		$('#keys').append(key);
		$(key).animate({
			width: '60px',
			height: '60px',
			left: '-=30px',
			top: '+=20px'
		},300);
	}
};
Build.prototype.removeKey = function(){
	var key = $('#keys img:last');
	$(key).animate({opacity: 0},800,function(){
		$(key).remove();
	});
};
Build.prototype.compass = function(){
	$('#compass img').remove();
	var compass = 'compass_' + local.d;
	$('#compass').append(imgs[compass]);
	$('#compass img').show().fadeOut(500);
};
Build.prototype.popup = function(text){
	$('#pop-up').empty();
	$('#pop-up').stop();
	$('#pop-up').css('opacity',1);
	$('#pop-up').html("<p>" + text + "</p>").show();
	$('#pop-up').fadeOut(2000);
};
Build.prototype.text = function(text,ret,no_escape){
	text = no_escape ? text : this.escape_npbr(text);
	$('#notice').empty();
	$('#notice').stop();
	$('#notice').css('opacity',1);
	$('#notice').html(text + (ret ? '<div>&crarr;</div>' : '')).show();
};
function once_k(){
	$('#notice:visible').fadeOut(500);
	$(document).unbind('keydown', once_k);
	$(document).unbind('click', once_c);
	build.bind();
	return false;
};
//IE対応のため関数(once_notice)外だし
function once_notice(){
	$('#notice:visible').fadeOut(500);
	$(document).unbind('keydown click', once_notice);
	build.bind();
	return false;
};
Build.prototype.notice = function(text){
	if(!text) return false;
	this.unbind();
	//text = text || '<p>特に変わったところは無いようだ</p>';
	this.text(text,true);
	//IE対応のため関数(once_notice)外だし
	$(document).bind('keydown click',once_notice);
};
Build.prototype.unbind = function(){
	$(document).unbind('keydown');
	$('#controller area,#space-bar,#retire').unbind('click');
	//$('#screen').unbind('mousemove');
};
Build.prototype.bind = function(){
	$(document).keydown(function(e){
		if(e.keyCode == '32' || e.keyCode == '37' || e.keyCode == '38' || e.keyCode == '39' || e.keyCode == '40'){
			//$('#controller:visible').fadeOut('fast');
			controller(e.keyCode);
			return false;
		}
	});
	$('#controller area,#space-bar').click(function(){
		controller($(this).attr('value'));
		return false;
	});
	/*$('#screen').mousemove(function(){
		$('#controller:hidden').fadeIn('fast');
	});*/
	$('#retire').click(function(){
		build.confirm('<p>迷路をやめてメニューに戻ります。</p>',function(){
			build.unbind();
			build.retry('go');
		});
	});
};
