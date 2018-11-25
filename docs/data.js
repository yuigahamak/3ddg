var level_icon = {
	"2": "g13.png",
	"3": "g23.png",
	"4": "k.png",
	"5": "g33.png",
	"6": "k_right.png",
	"7": "g43.png",
	"8": "g53.png",
	"9": "g61.png",
	"10": "c01.jpg",
	"11": "c02b.png",
	"12": "i07.png"
};

var level_exp = {
	"1": 30,
	"2": 45,
	"3": 70,
	"4": 110,
	"5": 170,
	"6": 250,
	"7": 330,
	"8": 450,
	"9": 600,
	"10": 800,
	"11": 1366,
	"12": 9999
};

var level_data = {
	"1": {max: 0, map_size: 0, "msg": 0, symbols:[], "title": "迷子の仔猫", "src": {"m": "l1.jpg","s": "l1s.jpg"}},
	"2": {max: 1, map_size: 5, "msg": 1, symbols: ["msg","start","goal","ghost1"],  "title": "犬のおまわりさん","src": {"m": "l2.jpg","s": "l2s.jpg"}},
	"3": {max: 2, map_size: 7, "msg": 2, symbols: ["msg",'start','goal','ghost1','ghost2'],"title": "迷探偵","src": {"m": "l3.jpg","s": "l3s.jpg"}},
	"4": {max: 3, map_size: 9, "msg": 2, symbols: ["msg",'start','goal','key','ghost1','ghost2'], "title": "地下鉄の怪人","src": {"m": "l4.jpg","s": "l4s.jpg"}},
	"5": {max: 3, map_size: 9, "msg": 3, symbols: ["msg",'start','goal','key','ghost1','ghost2','ghost3'], "title": "地底人","src": {"m": "l5.jpg","s": "l5s.jpg"}},
	"6": {max: 4, map_size: 11, "msg": 3, symbols: ["msg",'start','goal','key','moveKey','ghost1','ghost2','ghost3'], "title": "迷路探検家","src": {"m": "l6.jpg","s": "l6s.jpg"}},
	"7": {max: 4, map_size: 11, "msg": 4, symbols: ["msg",'start','goal','key','moveKey','ghost1','ghost2','ghost3','ghost4'], "title": "3D忍者","src": {"m": "l7.jpg","s": "l7s.jpg"}},
	"8": {max: 5, map_size: 13, "msg": 4, symbols: ["msg",'start','goal','key','moveKey','ghost1','ghost2','ghost3','ghost4','ghost5'], "title": "陰武者","src": {"m": "l8.jpg","s": "l8s.jpg"}},
	"9": {max: 5, map_size: 13, "msg": 5, symbols: ["msg",'start','goal','key','moveKey','ghost1','ghost2','ghost3','ghost4','ghost5','ghost6'], "title": "闇勇者","src": {"m": "l9.jpg","s": "l9s.jpg"}},
	"10": {max: 6, map_size: 15, "msg": 5, symbols: ["msg",'start','goal','key','moveKey','ghost1','ghost2','ghost3','ghost4','ghost5','ghost6'], "title": "迷宮魔術師","src": {"m": "l10.jpg","s": "l10s.jpg"}},
	"11": {max: 6, map_size: 15, "msg": 6, symbols: ["msg",'start','goal','key','moveKey','ghost1','ghost2','ghost3','ghost4','ghost5','ghost6'], "title": "地下仙人","src": {"m": "l11.jpg","s": "l11s.jpg"}},
	"12": {max: 7, map_size: 19, "msg": 7, symbols: ["msg",'start','goal','key','moveKey','ghost1','ghost2','ghost3','ghost4','ghost5','ghost6'], "title": "ダンジョンキング","src": {"m": "l12.jpg","s": "l12s.jpg"}}
};

function Level(exp){
	for(var key in level_exp){
		if(level_exp[key] > exp)
			break;
	}
	this.param = level_data[key];
	this.level = key;
};

var menuName = {
	top: 'メニュー',
	"public-list": '他の迷路に挑戦する',
	"private-list": '他の迷路に挑戦する',
	"work-list": "他の迷路を編集する",
	editor: '編集画面に戻る',
	stage: 'ステージ'
};

var items = {
	i01: {name: "虹色石", src: "i01.png"},
	i02: {name: "黒瑪瑙", src: "i02.png"},
	i03: {name: "翠玉", src: "i03.png"},
	i04: {name: "黄玉", src: "i04.png"},
	i05: {name: "蒼玉", src: "i05.png"},
	i06: {name: "紅玉", src: "i06.png"},
	i07: {name: "叡智の冠", src: "i07.png", exp: 120}
};
var birds = {
	hawk: 'タカ',
	eagle: 'ワシ',
	falcon: 'ハヤブサ',
	owl: 'フクロウ',
	crow: 'カラス'
};

var symbols = {
	start: {
		title: 'スタート地点',
		icon: 'start.png',
		//src: 'start.png',
		frame: 0.75,
		icons: ['s0.png','s1.png','s2.png','s3.png'],
		//src: ['start.png','start.png','start.png','start.png'],
		size_x: 1,
		size_y: 1,
		pos_y: 0,
		x: 0,
		z: 0,
		d: 0,
		alg: 'static',
		fo: true,//first on 最初に乗った時だけ
		meetName: 'start'		
	},
	goal: {
		title: 'ゴール',
		icon: 'goal.png',
		src: 'goal.png',
		frame_pos: 'ceil',
		frame: 0.75,
		//src: ['goal.png','goal.png','goal.png','goal.png'],
		size_x: 1,
		size_y: 1,
		pos_y: 0,
		x: 0,
		z: 0,
		d: 2,
		alg: 'static',
		meetName: 'goal'
	},
	msg: {
		title: 'メッセージ',
		icon: 'msg.png',
		frame: 0.75,
		x: 0,
		z: 0,
		d: 2,
		alg: 'static',
		fo: true,
		meetName: 'msg'
	},
	event: {
		name: 'event',
		title: 'イベント',
		icon: 'c02b.png',
		x: 0,
		z: 0,
		d: 2,
		alg: 'static'
	},
	/*hiddenMsg: {
		title: '隠しメッセージ',
		icon: 'hidden.png',
		x: 0,
		z: 0,
		d: 2,
		alg: 'static',
		hitName: "msg"
	},*/
	hidden: {
		title: '隠しイベント',
		icon: 'hidden.png',
		x: 0,
		z: 0,
		d: 2,
		alg: 'static',
		hitName: "event"
	},
	key: {
		title: '鍵',
		icon: 'k.png',
		src: 'k.png',
		size_x: 0.2,
		size_y: 0.1,
		pos_y: -0.02,
		x: 0,
		z: 0,
		d: 2,
		alg: 'static',
		meetName: 'getKey'
	},
	moveKey: {
		title: '動く鍵',
		icon: 'k_right.png',
		icons: ['k_back.png','k_right.png','k_front.png','k_left.png'],
		src: ['k_back.png','k_right.png','k_front.png','k_left.png'],
		size_x: 0.3,
		size_y: 0.15,
		pos_y: 0,
		roll: 0.1,
		x: 0,
		z: 0,
		d: 1,
		alg: 'away',
		after: true,
		meetName: 'getKey'
	},
	ghost1: {
		title: 'ゴースト（左回転）',
		icon: 'g13.png',
		icons: ["g10.png","g11.png","g12.png","g13.png"],
		src: ["g10.png","g11.png","g12.png","g13.png"],
		size_x: 1,
		size_y: 0.5,
		pos_y: 0.15,
		pitch: 0.07,
		roll: 0.02,
		x: 0,
		z: 0,
		d: 3,
		alg: 'rotateLeft',
		meetName: 'crash'
	},
	ghost2: {
		title: 'ゴースト（右回転）',
		icon: 'g23.png',
		icons: ["g20.png","g21.png","g22.png","g23.png"],
		src: ["g20.png","g21.png","g22.png","g23.png"],
		size_x: 1,
		size_y: 0.5,
		pos_y: 0.15,
		pitch: 0.07,
		roll: 0.02,
		x: 0,
		z: 0,
		d: 3,
		alg: 'rotateRight',
		meetName: 'crash'
	},
	ghost3: {
		title: 'ゴースト（左折）',
		icon: 'g33.png',
		icons: ["g30.png","g31.png","g32.png","g33.png"],
		src: ["g30.png","g31.png","g32.png","g33.png"],
		size_x: 1,
		size_y: 0.5,
		pos_y: 0.15,
		pitch: 0.07,
		roll: 0.02,
		x: 0,
		z: 0,
		d: 3,
		alg: 'turnLeft',
		meetName: 'crash'
	},
	ghost4: {
		title: 'ゴースト（右折）',
		icon: 'g43.png',
		icons: ["g40.png","g41.png","g42.png","g43.png"],
		src: ["g40.png","g41.png","g42.png","g43.png"],
		size_x: 1,
		size_y: 0.5,
		pos_y: 0.15,
		pitch: 0.07,
		roll: 0.02,
		x: 0,
		z: 0,
		d: 3,
		alg: 'turnRight',
		meetName: 'crash'
	},
	ghost5: {
		title: 'ゴースト（追跡）',
		icon: 'g53.png',
		icons: ["g50.png","g51.png","g52.png","g53.png"],
		src: ["g50.png","g51.png","g52.png","g53.png"],
		size_x: 1,
		size_y: 0.5,
		pos_y: 0.15,
		pitch: 0.07,
		roll: 0.02,
		x: 0,
		z: 0,
		d: 3,
		alg: 'chase',
		meetName: 'crash'
	},
	ghost6: {
		title: 'ゴースト（逃避）',
		icon: 'g63.png',
		icons: ["g60.png","g61.png","g62.png","g63.png"],
		src: ["g60.png","g61.png","g62.png","g63.png"],
		size_x: 1,
		size_y: 0.5,
		pos_y: 0.15,
		pitch: 0.07,
		roll: 0.02,
		x: 0,
		z: 0,
		d: 3,
		alg: 'away',
		after: true,
		meetName: 'crash'
	}
};

var phantom = [
	{text: "<p>君の目の前に黒い影がたたずんでいる。亡霊だろうか？おぼろげだが人の形を保っているようだ。しかし表情は読み取れない。</p>", to: 1},
	{text: "<p>君はこの黒い影に</p>", select: [{text: "話しかけてみる", to: 3},{text: "気にせず立ち去る", to: 2}]},
	{text: "<p>君は黒い影にはかまわずに立ち去ることにした。</p>"},
	{text: "<p>「ワ・・・ワ・・・ワガ・・・」</p><p>君が声をかけようとすると、かすかに人の声のようなものが聴こえて来た。</p>", to: 4},
	{text: "<p>コ・・・コワ・・・ワガ・・・アルジ・・・ノ・・・ネムルハカ・・・</p><p>ワ・・・ワタシハイツカラココニイルノカ・・・ジ・・・ジブンノナマエモオモイダセナイガ・・・</p>", to: 5},
	{text: "<p>ワ・・ガ・・アルジノコトハワスレテイナイ・・・コ・・コカラハナレルコトハデキナイ・・・</p><p>ジ・・・ジブンノイシナノカ・・・ナニ・・カ・・ニシバラレテイルノカ・・・</p>", to: 6},
	{text: "<p>亡霊の声は聴きづらく何を言っているのかわからないが話は長くなりそうだ。君はまだ彼の話を</p>",select:[{text:"聴く", to: 8},{text:"聴かない",to: 7}]},
	{text: "<p>亡霊はまだ何か話しているようだが君はここから立ち去ることにした。</p>"}
];
var owl = [
	{to: 6, callback:"this.times=0;this.flgs={};", text: "<p>君の足下に奇妙な鳥（フクロウのようだ）が静かに立っている。こんな所にいるからには普通の鳥ではないのだろう。</p>"},
	{},{},{},{},{},
	/*{text: "<p>「汝、力ヲ 求メル 者カ？」</p>", select: [{text: "「そうだ」と答える", to: 3},{text: "「ちがう」と答える", to: 2},{text: "無視して立ち去る", to: 7}]},
	{text: "<p>「デハ 去レ」</p><p>奇妙な鳥はそう言い残すと、音もなく飛び去ってしまった。</p>", callback: "delete(map.symbols[this.name]);scene.draw();"},
	{text: "<p>「汝、智慧ヲ 求メル 者カ？」</p>", select: [{text: "「そうだ」と答える", to: 4},{text: "「ちがう」と答える", to: 2}]},
	{text: "<p>「汝、真実ヲ 求メル 者カ？」</p>", select: [{text: "「そうだ」と答える", to: 5},{text: "「ちがう」と答える", to: 2}]},
	{text: "<p>「汝、冠ヲ 求メル 者カ？」</p>", select: [{text: "「そうだ」と答える", to: 6},{text: "「ちがう」と答える", to: 2}]},*/
	{text: "<p>君はこの奇妙な鳥に</p>", select: [{text: "何かたずねてみる", to: 11},{text: "気にせず立ち去る", to: 7}]},
	{text: "<p>奇妙な鳥は君が立ち去るよりも先に、音もなく飛び去ってしまった。</p>", callback: "delete(map.symbols[this.name]);scene.draw();"},
	{text: "<p>奇妙な鳥は君の質問に答えると、音もなく飛び去ってしまった。</p>", callback: "delete(map.symbols[this.name]);scene.draw();"},
	{text: "<p>どうやら君の質問に答えてくれたようだ。</p>",select:[{text: "他にも何かたずねてみる", to: 11},{text: "礼を言って立ち去る", to: 10}]},
	{text: "<p>君が礼を言うと、奇妙な鳥は音もなく飛び去ってしまった。</p>", callback: "delete(map.symbols[this.name]);scene.draw();"},
	{text: "<p>何を訊いてみようか</p>", select: [
		{text: "このダンジョンについて", to: 13, require: "!this.flgs.a"},
		{text: "冠について", to: 14, require: "!this.flgs.b&&this.flgs.bc"},
		{text: "六つの石について", to: 15, require: "!this.flgs.c"},
		{text: "王について", to: 16, require: "!this.flgs.d&&this.flgs.dc"},
		{text: "古の魔法使いについて", to: 17, require: "!this.flgs.e&&this.flgs.ec"},
		/*{text: "彼（彼女？）について", to: 18, require: "!this.flgs.f"},*/
		{text: "封印について", to: 19, require: "!this.flgs.g&&this.flgs.gc"},
		{text: "王についてもっと訊く", to: 20, require: "!this.flgs.h&&this.flgs.hc"},
		{text: "古の魔法使いについてもっと訊く", to: 21, require: "!this.flgs.i&&this.flgs.ic"}
	]},
	{require: "this.times >= 3", yes: 8, no: 9},
	{to: 12, callback: "this.times++;this.flgs.a=true;this.flgs.ec=true;this.flgs.dc=true;", text: "<p>「コノ 遺跡ハ 古ノ 魔法使イ ガ 遺シタ モノ。王ノ 墓ダ。」</p>"},
	{to: 12, callback: "this.times++;this.flgs.b=true;this.flgs.ec=true;this.flgs.dc=true;this.flgs.gc=true;", text: "<p>「古ノ 魔法使イ ガ 王ニ 与エタモノ。『叡智ノ冠』 ト イウ。『王タチノ冠』 トモ 呼バレタ。今ハ コノ 遺跡ニ 封印サレテ イル。」</p>"},
	{to: 12, callback: "this.times++;this.flgs.c=true;this.flgs.gc=true;", text: "<p>「六ツノ 石ハ 封印ヲ 解ク タメノ 鍵。コノ 遺跡ノ ドコカニ 隠サレテ イル。」</p>"},
	{to: 12, callback: "this.times++;this.flgs.d=true;this.flgs.hc=true;", text: "<p>「コノ 国ノ 最初ノ 王。コノ 国ヲ ツクッタ 者。『王タチノ王』 ト 呼バレタ。」</p>"},
	{to: 12, callback: "this.times++;this.flgs.e=true;this.flgs.ic=true;", text: "<p>「私ノ 主。遠イ 昔ニモ 古ト 呼バレテ イタ。叡智ヲ 手ニシタ 者。」</p>"},
	{to: 12, callback: "this.times++;this.flgs.f=true;this.flgs.ec=true;", text: "<p>「私ノ 名ハ ルコ。カツテ 古ノ 魔法使イ ノ 僕デ アッタ。今ハ コノ 遺跡ノ 番ヲ シテイル。」</p>"},
	{to: 12, callback: "this.times++;this.flgs.g=true;this.flgs.ec=true;this.flgs.dc=true;this.flgs.bc=true;", text: "<p>「封印ハ ヤガテ 解カレル。六ツノ 石ヲ 集メ 王ノ 魂ト 冠ヲ 解放スル 者ガ 現ワレルト 古ノ 魔法使イ ハ 言イ 残シタ。」</p>"},
	{to: 12, callback: "this.times++;this.flgs.h=true;", text: "<p>「アル時 古ノ 魔法使イ ノ 元ヘ 小サナ 少年ガ ヤッテ 来タ。『虹の王子』ト 呼バレテ イタ。『虹の王子』ハ 古ノ 魔法使イ ノ 助ケヲ 得テ 国ヲ ツクッタ。」</p>"},
	{to: 12, callback: "this.times++;this.flgs.i=true;", text: "<p>「他ノ 魔術師トハ 違ッテイタ。人ノ 世ヲ 救ウ 法ヲ 求メ 王ニ 冠ヲ 与エタ。」</p>"}
];
var psCheck = function(){//ps = pedal stone
	if(map.symbols.ps1.set && map.symbols.ps2.set && map.symbols.ps3.set){
		var symbol = map.symbols.i06;
		symbol.meetName = 'event';
		symbol.updateImage('i06.png');
		symbol.pos_y = 0;
	}
};
var pedal = [
	{to: 1, text: "<p>君は足下の床から石が数センチ飛び出しているのに気がついた。ちょうど片足ぐらいの大きさの長方形だ。</p>"},
	{text: "<p>君はこの飛び出た石を</p>",select: [{text:"踏んで見る",to:3},{text:"何もしない",to:2}]},
	{text: "<p>君は何もしないで立ち去ることにした。</p>"},
	{
		text: "<p>君が足を乗せて体重をかけると「コトン」と小気味よい音がして飛び出ていた石は沈み、床は平らになった。</p>",
		callback: "delete(this.frame);delete(this.meetName);this.set=true;psCheck();scene.draw();"
	}
];
var topaz = [
	{to: 1, text: "<p>君は意を決して炎の中に飛び込んだ！</p>"},
	{to: 2, text: "<p>・・・今、君は炎に包まれている。しかし予想していたような熱さは無い。呼吸も出来るようだ。</p>"},
	{to: 3, text: "<p>君を包む炎は次第に弱くなっていく。炎が形作っていた歪んだ表情は消え、小さい黄色い石となって君の足下に落ちた。</p>"},
	{text: "<p>黄玉を手に入れた。</p>", callback: "game.addItem(this.name);game.flgs[this.name]={x:local.x,y:local.y,z:local.z};delete(map.symbols[this.name]);scene.draw();"}
];
var slot = function(){
	if(game.flgs.i03) return;
	var sap = map.symbols.i03;
	var symbol = map.symbols.numbers;
	if(symbol.set == '244'){
		sap.meetName = 'event';
		sap.updateImage('i03.png');
		scene.draw();
	}
};
var numbers = [
	{
		to: 11,
		text: "<p>正面の壁に凹んだ部分があり、その中に五角柱の石が3つ並んでいる。5つの面それぞれに数字が書いてあり、回転させることが出来るようだ。数字合わせの錠に似ている。</p>"
	},
	{to:"this.goto;",callback:"this.set+=(''+1);"},
	{to:"this.goto;",callback:"this.set+=(''+2);"},
	{to:"this.goto;",callback:"this.set+=(''+3);"},
	{to:"this.goto;",callback:"this.set+=(''+4);"},
	{to:"this.goto;",callback:"this.set+=(''+5);"},
	{to:"this.goto;",callback:"this.set+=(''+6);"},
	{to:"this.goto;",callback:"this.set+=(''+7);"},
	{to:"this.goto;",callback:"this.set+=(''+8);"},
	{to:"this.goto;",callback:"this.set+=(''+9);"},
	{to:"this.goto;",callback:"this.set+=(''+0);"},
	{
		text: "<p>数字は<span></span>に合わせてある。</p><p>君は数字を</p>",	
		callback: "$('#notice span').html(this.set || '764');",
		select: [{"text": "変えてみる", to: 13},{"text": "何もしない", to: 12}]
	},
	{text: "<p>君は数字を変えずそのままにしておいた。</p>"},
	{
		text: "<p>左から1桁目の数字を選べ。選べる数字は0、2、5、6、7だ。</p>",
		select:[{text:"0",to:10},{text:"2",to:2},{text:"5",to:5},{text:"6",to:6},{text:"7",to:7}],
		callback:"this.set='';this.goto='14';"
	},
	{
		text: "<p>2桁目の数字を選べ。選べる数字は1、2、4、6、8だ。</p>",
		select:[{text:"1",to:1},{text:"2",to:2},{text:"4",to:4},{text:"6",to:6},{text:"8",to:8}],
		callback:"this.goto='15';"
	},
	{
		text: "<p>3桁目の数字を選べ。選べる数字は1、3、4、8、9だ。</p>",
		select:[{text:"1",to:1},{text:"3",to:3},{text:"4",to:4},{text:"8",to:8},{text:"9",to:9}],
		callback:"this.goto='16';"
	},
	{
		text: "<p>君は<span></span>に数字を合わせた。</p>",
		callback:"$('#notice span').html(this.set);delete(this.goto);slot();"
	}
];
var libra = {
	set: function(){
		var symbol = map.symbols.balance;
		symbol.right = symbol.right || {A: 1, C: 1, D: 1};
		symbol.left = symbol.left || {C: 1, D: 1, F: 1};
		symbol.right_ = $.parseJSON($.toJSON(symbol.right));
		symbol.self_ = $.parseJSON($.toJSON(symbol.self));
	},
	rename: function(){
		var symbol = map.symbols.balance;
		var i = 0;
		for(var key in symbol.left){
			$('#notice .left').eq(i).html(libra.scale[key].name);
			i++;
		}
		i = 0;
		for(var key in symbol.right){
			$('#notice .right').eq(i).html(libra.scale[key].name);
			i++;
		}
		$('#notice .select').each(function(){
			$(this).html(libra.scale[$(this).attr('key')].name);
		});
	},
	rename2: function(){
		//説明のとこ
		$('#notice span').each(function(){
			if($(this).attr('key'))
				$(this).html(libra.scale[$(this).attr('key')].name);
		});
	},
	rest: function(str){
		str = str || 'が';
		var symbol = map.symbols.balance;
		var text = "";
		for(var key in symbol.self){
			text += libra.scale[key].name + str + symbol.self[key] + '個、';
		}
		$('#notice .rest').html(text);
	},
	compare: function(){
		var symbol = map.symbols.balance;
		symbol.sumLeft = this.sum(symbol.left);
		symbol.sumRight = this.sum(symbol.right);
		symbol.sumSelf = this.sum(symbol.self);
		if(symbol.sumRight > symbol.sumLeft){
			symbol.right = $.parseJSON($.toJSON(symbol.right_));
			symbol.self = $.parseJSON($.toJSON(symbol.self_));
		}
	},
	sum: function(obj){
		var sum = 0;
		for(var key in obj){
			sum += obj[key] * this.scale[key].weight;
		}
		return sum;
	},
	scale: {
		A: {weight: 1, name: "円柱"},
		B: {weight: 3, name: "円錐"},
		C: {weight: 5, name: "球"},
		D: {weight: 10, name: "立方体"},
		E: {weight: 12, name: "三角柱"},
		F: {weight: 15, name: "三角錐"}
	}
};
var golem = [
	{require: "game.flgs.i05 || map.symbols.balance.set", yes: 1, no: 2},
	{text: "<p>奇妙な形をした石人形が置いてある。もう動かないようだ。</p>"},
	{to: 3, callback: "this.count=0;map.symbols.balance.self={};", text: "<p>奇妙な形をした石人形が置いてある。君が近づくと石人形が話しだした。</p>"},
	{to: 4, text: "<p>「コノ フロアノ 何処カニ、天秤ガ アリマス。</p><p>天秤ノ 左右ノ 皿ヲ、同ジ 重サニ シテクダサイ。」</p>"},
	{to: 5, text: "<p>「既ニ 皿ニ 乗ッテイル 重リハ、動カセマセン。</p><p>重リヲ 乗セテ イイノハ、右ノ 皿ダケデス。」</p>"},
	{to: 6, text: "<p>「持ッテ行ク 重リヲ 3ツ 選ンデ クダサイ。</p><p>重リハ 何回デモ ココデ 交換 デキマス。」</p>"},
	{text: "<p>君は重りを</p>", select: [
		{to: 7, text: "持って行く"},
		{to: 10, text: "持って行かない"}
	]},
	{text: "<p>「重リヲ 3ツ 選ンデ クダサイ。」</p><span class=\"rest\"></span>つ目<br /><br />", select: [
		{to: 14, text: '<span key="D"></span>'},
		{to: 15, text: '<span key="E"></span>'},
		{to: 16, text: '<span key="F"></span>'},
		{to: 12, text: '<span key="B"></span>'},
		{to: 11, text: '<span key="A"></span>'},
		{to: 13, text: '<span key="C"></span>'}
	], callback: 'libra.rename2();$("#notice .rest").html(this.count+1);'},
	{require: "this.count>=3;", yes: 9, no: 7},
	{callback: "libra.rest('の重りを');map.symbols.balance.ready=true;", text: "<p>君は、<span class=\"rest\"></span>石人形から受け取った。</p>"},
	{text: "<p>君は石人形を無視して、先を急ぐことにした。</p>"},
	{to:8,callback:"this.count++;symbol=map.symbols.balance;symbol.self.A=symbol.self.A?symbol.self.A+1:1;"},
	{to:8,callback:"this.count++;symbol=map.symbols.balance;symbol.self.B=symbol.self.B?symbol.self.B+1:1;"},
	{to:8,callback:"this.count++;symbol=map.symbols.balance;symbol.self.C=symbol.self.C?symbol.self.C+1:1;"},
	{to:8,callback:"this.count++;symbol=map.symbols.balance;symbol.self.D=symbol.self.D?symbol.self.D+1:1;"},
	{to:8,callback:"this.count++;symbol=map.symbols.balance;symbol.self.E=symbol.self.E?symbol.self.E+1:1;"},
	{to:8,callback:"this.count++;symbol=map.symbols.balance;symbol.self.F=symbol.self.F?symbol.self.F+1:1;"}
];
var balance_exp1 = [
	{to: 1, text: "<p>足下に何か書いてある。</p>"},
	{
		callback: "libra.rename2();",
		text: '<p><span key="E"></span> + <span key="B"></span> = <span key="F"></span></p>'
			+ '<p><span key="D"></span> + <span key="A"></span> × 2 = <span key="E"></span></p>'
	}
];
var balance_exp2 = [
	{to: 1, text: "<p>足下に何か書いてある。</p>"},
	{
		callback: "libra.rename2();",
		text: '<p><span key="A"></span> × 2 + <span key="B"></span> = <span key="C"></span></p>'
			+ '<p><span key="B"></span> × 3 + <span key="A"></span> = <span key="D"></span></p>'
	}
];
var balance_exp3 = [
	{to: 1, text: "<p>足下に何か書いてある。</p>"},
	{
		callback: "libra.rename2();",
		text: '<p><span key="C"></span> × 2 = <span key="D"></span></p>'
			+ '<p><span key="B"></span> × 4 = <span key="E"></span></p>'
	}
];
var balance = [
	{require: "this.set", yes: 1, no: 2},
	{text: "<p>台座の上に、天秤が置いてある。天秤の皿には、様々な形と大きさの重りが乗っている。左右の皿は、バランスが取れているようだ。</p>"},
	{require: "this.ready", yes: 4, no: 3},
	{callback: "libra.rename();", text: "<p>台座の上に、天秤が置いてある。天秤の皿には、様々な形と大きさの重りが乗っている。左の皿の方が重いようだ。</p><p>左の皿には、<span class=\"left\"></span>、<span class=\"left\"></span>、<span class=\"left\"></span>、の重りが1つずつ乗っている。右の皿には、<span class=\"right\"></span>、<span class=\"right\"></span>、<span class=\"right\"></span>、の重りが1つずつ乗っている。</p>"},
	{to: 5, callback: "libra.rename();", text: "<p>台座の上に、天秤が置いてある。天秤の皿には、様々な形と大きさの重りが乗っている。左の皿の方が重いようだ。</p><p>左の皿には、<span class=\"left\"></span>、<span class=\"left\"></span>、<span class=\"left\"></span>、の重りが1つずつ乗っている。右の皿には、<span class=\"right\"></span>、<span class=\"right\"></span>、<span class=\"right\"></span>、の重りが1つずつ乗っている。</p>"},
	{text: "<p>君はこの天秤に</p>", select: [{text: "重りを乗せる", to: 7},{text: "何もしない", to: 6}]},
	{text: "<p>君は天秤に触れずに立ち去った。</p>"},
	{text: "<p>重りを乗せていいのは右の皿だけだ。君が持っている重りは、<span class=\"rest\"></span>だ。</p>", select:[
		{text: '<span class="select" key="A"></span>の重りを乗せる', require: "this.self.A", to: 9},
		{text: '<span class="select" key="B"></span>の重りを乗せる', require: "this.self.B", to: 10},
		{text: '<span class="select" key="C"></span>の重りを乗せる', require: "this.self.C", to: 11},
		{text: '<span class="select" key="D"></span>の重りを乗せる', require: "this.self.D", to: 12},
		{text: '<span class="select" key="E"></span>の重りを乗せる', require: "this.self.E", to: 13},
		{text: '<span class="select" key="F"></span>の重りを乗せる', require: "this.self.F", to: 14}
	],callback: "libra.rest();libra.rename();"},
	{text: "<p>まだ左の皿の方が重いようだ。残りの重りは<span class=\"rest\"></span>だ。</p>", select:[
		{text: '<span class="select" key="A"></span>の重りを乗せる', require: "this.self.A", to: 9},
		{text: '<span class="select" key="B"></span>の重りを乗せる', require: "this.self.B", to: 10},
		{text: '<span class="select" key="C"></span>の重りを乗せる', require: "this.self.C", to: 11},
		{text: '<span class="select" key="D"></span>の重りを乗せる', require: "this.self.D", to: 12},
		{text: '<span class="select" key="E"></span>の重りを乗せる', require: "this.self.E", to: 13},
		{text: '<span class="select" key="F"></span>の重りを乗せる', require: "this.self.F", to: 14}
	],callback: "libra.rest();libra.rename();"},
	{to:15,callback:"this.self.A--;if(this.self.A==0)delete(this.self.A);this.right.A=this.right.A?this.right.A+1:1;libra.compare();"},
	{to:15,callback:"this.self.B--;if(this.self.B==0)delete(this.self.B);this.right.B=this.right.B?this.right.B+1:1;libra.compare();"},
	{to:15,callback:"this.self.C--;if(this.self.C==0)delete(this.self.C);this.right.C=this.right.C?this.right.C+1:1;libra.compare();"},
	{to:15,callback:"this.self.D--;if(this.self.D==0)delete(this.self.D);this.right.D=this.right.D?this.right.D+1:1;libra.compare();"},
	{to:15,callback:"this.self.E--;if(this.self.E==0)delete(this.self.E);this.right.E=this.right.E?this.right.E+1:1;libra.compare();"},
	{to:15,callback:"this.self.F--;if(this.self.F==0)delete(this.self.F);this.right.F=this.right.F?this.right.F+1:1;libra.compare();"},
	{require: "this.sumRight == this.sumLeft",yes: 22, no: 16},
	{require: "this.sumRight > this.sumLeft",yes: 19, no: 17},
	{require: "this.sumSelf == 0",yes: 21, no: 18},
	{require: "this.sumRight < this.sumLeft",yes: 8, no: 99},
	{text: "<p>君が右の皿に重りを乗せると、右の皿の方が重くなってしまった。</p>",
	select: [
		{text: "やり直す", to: 7},
		{text: "諦める", to: 20}
	]},
	{text: "<p>君は、天秤のバランスを取ることを諦めた。</p>",callback:"this.right=this.right_;"},
	{
		text: "<p>持っていた重りを全て乗せたが、まだ左の皿の方が重いようだ。どうやら重りの選択を間違えたようだ。</p>",
		callback:"this.right=this.right_;this.self=this.self_;"
		//callback:"this.self={};this.ready=false;this.right=this.right_;"
	},
	{
		text: "<p>君が右の皿に重りを乗せると、左右の皿が少しのあいだ揺れた後、水平に並んだ。バランスが取れたようだ。</p>",
		callback:"this.set=true;map.symbols.i05.updateImage('i05.png');map.symbols.i05.meetName='event';"
	}
];
var checkRoute = function(){
	route1 = map.symbols.route1;
	route2 = map.symbols.route2;
	route3 = map.symbols.route3;
	route4 = map.symbols.route4;
	if(route1.flg && route2.flg && route3.flg){
		route4.count = route4.count ? route4.count + 1 : 1;
		switch(route4.count){
			case 1:
				map.data[0][5][12] = map.data[0][5][12] | 0x0030;
				map.data[0][6][12] = map.data[0][6][12] | 0x3000;
				break;
			case 2:
				map.data[0][5][2] = map.data[0][5][2] | 0x0030;
				map.data[0][6][2] = map.data[0][6][2] | 0x3000;
				scene.draw();
				break;
			case 3:
				map.data[0][12][8] = map.data[0][12][8] | 0x0300;
				map.data[0][12][9] = map.data[0][12][9] | 0x0003;
				delete(map.symbols.route4);
				break;
		}
	}
	route1.flg = false;
	route2.flg = false;
	route3.flg = false;
};
var checkStone = function(){
	if(
		map.symbols.king.set == 'i01'
	 &&	map.symbols.hawk.set == 'i03'
	 &&	map.symbols.eagle.set == 'i05'
	 &&	map.symbols.falcon.set == 'i02'
	 &&	map.symbols.owl.set == 'i06'
	 &&	map.symbols.crow.set == 'i04'
	){
		map.data[0][4][3] = map.data[0][4][3] & 0xFF0F;
		map.data[0][5][3] = map.data[0][5][3] & 0x0FFF;
		if(game.flgs.i07){//台座処理
			delete(map.symbols.crown.meetName);
			//画像の書き換え
		}
		scene.draw();
	}else{
		map.data[0][4][3] = map.data[0][4][3] | 0x0010;
		map.data[0][5][3] = map.data[0][5][3] | 0x1000;
		scene.draw();
	}
};
var crown = [
	{to: 1, text: "<p>君の前に石造りの台座があり、その上には黄金のサークレットが置かれている。</p>",callback:"this.updateImage('crown2.png');"},
	{to: 2, text: "<p>これが叡智の冠だろうか？君の疑問に答える者はいないが、ここに至るまでの道のりを考えれば間違いない。これが叡智の冠だ。</p>"},
	{to: 3, text: "<p>君は冠を手に取り、自ら頭に載せた。</p>"},
	{
		text: "<p>叡智の冠を手に入れた！</p>",
		callback: "delete(this.meetName);game.addItem('i07');game.flgs.i07={x:local.x,y:local.y,z:local.z};scene.draw();"
	}
];
var king = [
	{require: "this.set", yes: 1, no: 5},
	{to: 2, text: "<p>人工的な長方形の石があり、短い文が刻んである。墓標のようだ。</p><p>「虹の王子、叡智を手にした者、王たちの王、ここに眠る」</p>"},
	{text: "<p>墓碑の中央には君がはめた<span></span>が収まっている。君は<span></span>を</p>",callback:"$('#notice span').html(items[this.set].name);", select: [{text: "取り出す", to: 4},{text: "何もしない", to: 3}]},
	{text: "<p>君は<span></span>をそのままにして立ち去ることにした。</p>",callback:"$('#notice span').html(items[this.set].name);"},
	{text: "<p>君は<span></span>を取り出し懐にしまった。</p>",callback:"$('#notice span').html(items[this.set].name);this.updateImage();game.addItem(this.set);this.set=false;checkStone();"},
	{text: "<p>人工的な長方形の石があり、短い文が刻んである。墓標のようだ。</p><p>「虹の王子、叡智を手にした者、王たちの王、ここに眠る」</p>", to: 6},
	{text: "<p>墓碑の中央に丸く凹んだ部分がある。君はこの凹みに</p>", select: [{text: "何かはめてみる", to: 8},{text: "何もしない", to: 7}]},
	{text: "<p>君は何もしないで立ち去ることにした。</p>"},
	{require: "!game.items.i01&&!game.items.i02&&!game.items.i03&&!game.items.i04&&!game.items.i05&&!game.items.i06", yes: 9, no: 10},
	{text: "<p>しかし君の所持品にはこの凹みに合う大きさの物は無いようだ。</p><p>君は仕方なく立ち去ることにした。</p>"},
	{text: "<p>君は所持品の中から一つ選んで試してみることにした。どれにする？</p>",select:[
		{text: "虹色石", require: "game.items.i01", to: 11},
		{text: "黒瑪瑙", require: "game.items.i02", to: 12},
		{text: "翠玉", require: "game.items.i03", to: 13},
		{text: "黄玉", require: "game.items.i04", to: 14},
		{text: "蒼玉", require: "game.items.i05", to: 15},
		{text: "紅玉", require: "game.items.i06", to: 16},
		{text: "やめる", to: 7}
	]},
	{
		text: "<p>君は凹みに<span></span>をはめた。大きさはちょうどよく、あつらえたようにぴったりと収った。</p>",
		callback:"this.set='i01';$('#notice span').html(items[this.set].name);game.useItem(this.set);this.updateImage(items[this.set].src);checkStone();"
	},
	{
		text: "<p>君は凹みに<span></span>をはめた。大きさはちょうどよく、あつらえたようにぴったりと収った。</p>",
		callback:"this.set='i02';$('#notice span').html(items[this.set].name);game.useItem(this.set);this.updateImage(items[this.set].src);checkStone();"
	},
	{
		text: "<p>君は凹みに<span></span>をはめた。大きさはちょうどよく、あつらえたようにぴったりと収った。</p>",
		callback:"this.set='i03';$('#notice span').html(items[this.set].name);game.useItem(this.set);this.updateImage(items[this.set].src);checkStone();"
	},
	{
		text: "<p>君は凹みに<span></span>をはめた。大きさはちょうどよく、あつらえたようにぴったりと収った。</p>",
		callback:"this.set='i04';$('#notice span').html(items[this.set].name);game.useItem(this.set);this.updateImage(items[this.set].src);checkStone();"
	},
	{
		text: "<p>君は凹みに<span></span>をはめた。大きさはちょうどよく、あつらえたようにぴったりと収った。</p>",
		callback:"this.set='i05';$('#notice span').html(items[this.set].name);game.useItem(this.set);this.updateImage(items[this.set].src);checkStone();"
	},
	{
		text: "<p>君は凹みに<span></span>をはめた。大きさはちょうどよく、あつらえたようにぴったりと収った。</p>",
		callback:"this.set='i06';$('#notice span').html(items[this.set].name);game.useItem(this.set);this.updateImage(items[this.set].src);checkStone();"
	}
];
var setStone = [
	{require: "this.set", yes: 1, no: 5},
	{text: "<p>足下に鳥（<span></span>のように見える）の絵が描いてある。開いたくちばしに君がはめた<span></span>をくわえている。</p>",to:2,
		callback:"$('#notice span:eq(0)').html(birds[this.name]);$('#notice span:eq(1)').html(items[this.set].name);"
	},
	{text: "<p>君はくちばしから<span></span>を</p>",callback:"$('#notice span').html(items[this.set].name);", select: [{text: "取り出す", to: 4},{text: "何もしない", to: 3}]},
	{text: "<p>君は<span></span>をそのままにして立ち去ることにした。</p>",callback:"$('#notice span').html(items[this.set].name);"},
	{text: "<p>君は<span></span>を取り出し懐にしまった。</p>",callback:"$('#notice span').html(items[this.set].name);this.updateImage();game.addItem(this.set);this.set=false;checkStone();"},
	{text: "<p>足下に鳥（<span></span>のように見える）の絵が描いてある。開いたくちばしの中に丸く凹んだ部分があり、何かをくわえたような絵柄になっている。</p>", to: 6,
		callback:"$('#notice span').html(birds[this.name]);"
	},
	{text: "<p>君はこの凹みに</p>", select: [{text: "何かはめてみる", to: 8},{text: "何もしない", to: 7}]},
	{text: "<p>君は何もしないで立ち去ることにした。</p>"},
	{require: "!game.items.i01&&!game.items.i02&&!game.items.i03&&!game.items.i04&&!game.items.i05&&!game.items.i06", yes: 9, no: 10},
	{text: "<p>しかし君の所持品にはこの凹みに合う大きさの物は無いようだ。</p><p>君は仕方なく立ち去ることにした。</p>"},
	{text: "<p>君は所持品の中から一つ選んで試してみることにした。どれにする？</p>",select:[
		{text: "虹色石", require: "game.items.i01", to: 11},
		{text: "黒瑪瑙", require: "game.items.i02", to: 12},
		{text: "翠玉", require: "game.items.i03", to: 13},
		{text: "黄玉", require: "game.items.i04", to: 14},
		{text: "蒼玉", require: "game.items.i05", to: 15},
		{text: "紅玉", require: "game.items.i06", to: 16},
		{text: "やめる", to: 7}
	]},
	{
		text: "<p>君は凹みに<span></span>をはめた。大きさはちょうどよく、あつらえたようにぴったりと収った。</p>",
		callback:"this.set='i01';$('#notice span').html(items[this.set].name);game.useItem(this.set);this.updateImage(items[this.set].src);checkStone();"
	},
	{
		text: "<p>君は凹みに<span></span>をはめた。大きさはちょうどよく、あつらえたようにぴったりと収った。</p>",
		callback:"this.set='i02';$('#notice span').html(items[this.set].name);game.useItem(this.set);this.updateImage(items[this.set].src);checkStone();"
	},
	{
		text: "<p>君は凹みに<span></span>をはめた。大きさはちょうどよく、あつらえたようにぴったりと収った。</p>",
		callback:"this.set='i03';$('#notice span').html(items[this.set].name);game.useItem(this.set);this.updateImage(items[this.set].src);checkStone();"
	},
	{
		text: "<p>君は凹みに<span></span>をはめた。大きさはちょうどよく、あつらえたようにぴったりと収った。</p>",
		callback:"this.set='i04';$('#notice span').html(items[this.set].name);game.useItem(this.set);this.updateImage(items[this.set].src);checkStone();"
	},
	{
		text: "<p>君は凹みに<span></span>をはめた。大きさはちょうどよく、あつらえたようにぴったりと収った。</p>",
		callback:"this.set='i05';$('#notice span').html(items[this.set].name);game.useItem(this.set);this.updateImage(items[this.set].src);checkStone();"
	},
	{
		text: "<p>君は凹みに<span></span>をはめた。大きさはちょうどよく、あつらえたようにぴったりと収った。</p>",
		callback:"this.set='i06';$('#notice span').html(items[this.set].name);game.useItem(this.set);this.updateImage(items[this.set].src);checkStone();"
	}
];
