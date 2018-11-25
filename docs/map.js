lineTable = {
	"0": 1,
	"1": 2,
	"2": 3,
	"3": 7,
	"7": 0
};
colorTable = {
	"0": "#000",
	"1": "#bbb",
	"2": "#555",
	"3": "#f70",
	"7": "#f00"
};

function Map(_symbols,data,el,id){
	//alert($.toJSON(_symbols));
	this.data = $.parseJSON($.toJSON(data));//配列コピー
	this.id = id;
	this.el = el;
	this.sd = [];//symbol data
	this.symbols = {};
	for(var key in _symbols){
		this.symbols[key] = new Symbol(_symbols[key].type,_symbols[key]);
	}
};
Map.prototype.check = function(){
	var checkData = maps[this.id];
	if(!checkData.symbols['start'])
		return '<p>スタート地点がありません。スタート地点を配置して保存してください。</p>';
	if(!checkData.symbols['goal'])
		return '<p>ゴール地点がありません。ゴール地点を配置して保存してください。</p>';
	var a = 0;//置いてある鍵の数
	var b = 0;//鍵のかかったドアの数
	//alert(typeof(checkData.detail) + ": " + checkData.detail);
	a = checkData.symbols['key'] ? a + 1 : a;
	a = checkData.symbols['moveKey'] ? a + 1 : a;
	for(var z = 0; z < checkData.detail[0].length; z++){
		for(var x = 0; x < checkData.detail[0][z].length; x++){
			if(checkData.detail[0][z][x] & 0x4444)
				b++;
		}
	}
	if(Math.ceil(b / 2) > a)
		return '<p>鍵のかかった扉の数と、鍵の数が合っていません。扉と鍵の配置を見直して、保存してください。</p>';
	//alert('a: ' + a + ' b: ' + b);
	return false;
};
Map.prototype.draw = function(pass){
	if(pass);
	else{
		$(this.el).empty();
		this.drawMap();
	}
	this.drawSymbols();
};
Map.prototype.lock = function(){
	var a = 0;//置いてある鍵の数
	var b = 0;//鍵のかかったドアの数
	a = this.symbols['key'] ? a + 1 : a;
	a = this.symbols['moveKey'] ? a + 1 : a;
	if(a > 0){
		for(var z = 0; z < this.data[0].length; z++){
			for(var x = 0; x < this.data[0][z].length; x++){
				if(this.data[0][z][x] & 0x4444)
					b++;
			}
		}
		if(Math.ceil(b / 2) < a)
			return 7;
	}
	return 0;
};
Map.prototype.modifyHorizonLine = function(x,z){
	var data = this.data[0];
	line = data[z][x] >> 12;
	line = lineTable[line];
	var lock = this.lock();
	line = line == 7 ? lock : line;
	line <<= 12;
	cell = data[z][x] & 0x0FFF;
	data[z][x] = line | cell;
	z--;
	if(data[z]){
		line = lineTable[(data[z][x] & 0x00F0) >> 4];
		line = line == 7 ? lock : line;
		line <<= 4;
		cell = data[z][x] & 0xFF0F;
		data[z][x] = line | cell;
	}
	//変更したところだけ描画
	z++;
	var td = this.drawHorizonLine(x, z);
	$('.horizon-line[x=' + x + '][z=' + z + ']',this.el).replaceWith(td);
};
Map.prototype.modifyVerticalLine = function(x,z){
	var data = this.data[0];
	line = lineTable[data[z][x] & 0x000F];
	var lock = this.lock();
	line = line == 7 ? lock : line;
	cell = data[z][x] & 0xFFF0;
	data[z][x] = line | cell;
	x--;
	if(data[z][x] != undefined){
		line = lineTable[(data[z][x] & 0x0F00) >> 8];
		line = line == 7 ? lock : line;
		line <<= 8;
		cell = data[z][x] & 0xF0FF;
		data[z][x] = line | cell;
	}
	//変更したところだけ描画
	x++;
	var td = this.drawVerticalLine(x, z);
	$('.vertical-line[x=' + x + '][z=' + z + ']',this.el).replaceWith(td);
};
Map.prototype.drawHorizonLine = function(x,z){
	var data = this.data[0];
	var td = document.createElement('td');
	$(td).css('background-color',colorTable[(data[z][x] & 0xF000) >> 12]);
	$(td).attr('x',x).attr('z',z).addClass('horizon-line');
	$(td).click(function(){
		if($(this).attr('z') == 0) return false;
		map.modifyHorizonLine($(this).attr('x'),$(this).attr('z'));
	});
	return td;
};
Map.prototype.drawVerticalLine = function(x,z){
	var data = this.data[0];
	var td = document.createElement('td');
	$(td).css('background-color',colorTable[data[z][x] & 0x000F]);
	$(td).attr('x',x).attr('z',z).addClass('vertical-line');
	$(td).click(function(){
		if($(this).attr('x') == 0) return false;				
		map.modifyVerticalLine($(this).attr('x'),$(this).attr('z'));
	});
	return td;
};
Map.prototype.drawMap = function(){
	var data = this.data[0];
	for(var z = 0; z < data.length; z++){
		//壁 水平
		var row = document.createElement('tr');
		for(var x = 0; x < data[z].length; x++){
			//ポッチ
			var td = document.createElement('td');
			$(td).css('background-color','#777');
			$(row).append(td);
			//壁
			$(row).append(this.drawHorizonLine(x,z));
		}
		//ポッチ
		var td = document.createElement('td');
		$(td).css('background-color','#777');
		$(row).append(td);
		$(this.el).append(row);

		var row = document.createElement('tr');
		for(var x = 0; x < data[z].length; x++){
			//壁 垂直
			$(row).append(this.drawVerticalLine(x,z));

			//cell
			var td = document.createElement('td');
			$(td).addClass('cell');
			/*if(data[z][x] & 0x0001)
				$(td).css('border-left','solid 1px #fff');
			if(data[z][x] & 0x0010)
				$(td).css('border-bottom','solid 1px #fff');
			if(data[z][x] & 0x0100)
				$(td).css('border-right','solid 1px #fff');
			if(data[z][x] & 0x1000)
				$(td).css('border-top','solid 1px #fff');*/
			$(td).attr('z',z).attr('x',x).attr('y',this.y);
			$(row).append(td);
		}
		//壁 垂直ラスト
		x--;
		var td = document.createElement('td');
		$(td).css('background-color',colorTable[(data[z][x] & 0x0F00) >> 8]);
		$(td).addClass('vertical-line');
		//$(td).html(z);
		$(row).append(td);

		$(this.el).append(row);
	}
	
	//壁 水平ラスト
	z--;
	var row = document.createElement('tr');
	for(var x = 0; x < data[z].length; x++){
		//alert(x + ' ' + z);
		var td = document.createElement('td');
		$(td).css('background-color','#777');
		$(row).append(td);
		var td = document.createElement('td');
		$(td).css('background-color',colorTable[(data[z][x] & 0x00F0) >> 4]);
		$(td).addClass('horizon-line');
		$(row).append(td);
	}
	var td = document.createElement('td');
	$(td).css('background-color','#777');
	$(row).append(td);
	$(this.el).append(row);

	$('.cell').click(function(){
		if($('img',this).length);
		else return false;
		var key = $('img',this).attr('key');
		//alert(key);
		map.symbols[key].d = (map.symbols[key].d + 1) % 4;
		map.symbols[key].location.d = (map.symbols[key].location.d + 1) % 4;
		map.draw(true);
	});
	
	$('.cell').dblclick(function(){
		if($('img',this).length);
		else return false;
		var key = $('img',this).attr('key');
		var symbol = map.symbols[key];
		if(
			symbol.type == 'msg'
		 ||	symbol.type == 'start'
		 ||	symbol.type == 'goal'
		){
			$('#mask-editor').show();
			$('#msg-editor').attr('key',key).fadeIn('fast');
			$('#msg-editor textarea').focus().val(symbol.text);
		}
		if(symbol.type == 'hiddenItem'
		|| symbol.type == 'hiddenMsg'
		|| symbol.type == 'event'
		){
			$('#mask-editor').show();
			$('#event-editor').attr('key',key).fadeIn('fast');
			$('#event-editor input').val('');
			$('#event-editor textarea').val('');
			for(var attr in symbol){
				$('#event-editor [name=' + attr + ']').val(symbol[attr]);
			}
			//$('#event-editor [name=name]').val(map.symbols[key].name);
			//$('#event-editor [name=item]').val(map.symbols[key].item);
		}
	});
	
	//シンボルドロップ
	$('.cell').droppable({
		//activeClass: "hover-symbol",
		hoverClass: "hover-symbol",
		drop: function( event, ui ) {
			ui.draggable.css('left',0).css('top',0);
			if($('img',this).length) return false;//既にそのcellにsymbolがあったらfalse
			var key = ui.draggable.attr('key');
			$(this).append(ui.draggable);
			var id = key;

			if(key == 'msg' || key == "event"){
				var count = 1;
				id = key + count;
				while(map.symbols[id]){
					count++;
					id = key + count;
				}
				ui.draggable.draggable( "destroy" );//draggableを一回破棄してhelperなしで再セット
				ui.draggable.draggable({
					revert: "invalid"
				});
				if(//コピーを作って#symbolsに入れる
					!$('#symbols [key=' + key + ']').length > 0
				 || $('#symbols [key=' + key + '].ui-draggable-dragging').length > 0
				){
					var img = ui.draggable.clone();
					if(key == 'msg')
						$('#symbols').prepend(img);
					else if(key == 'event')
						$('#symbols').append(img);
					$(img).draggable(map.symbolDrag);
				}
				ui.draggable.attr('key',id);
				if(key == 'msg')
					$('#msg-num').html($('#msg-num').html() - 1);
			}
			else if(key.match(/^msg/)){
				key = 'msg';
			}
			
			if(!map.symbols[id]){
				map.symbols[id] = new Symbol(key,symbols[key]);
				map.symbols[id].name = id;
			}
			map.symbols[id].x = $(this).attr('x');
			map.symbols[id].z = $(this).attr('z');
			map.symbols[id].location.x = $(this).attr('x');
			map.symbols[id].location.z = $(this).attr('z');
			
			var src = api.icon + '/' + map.symbols[id].icons[map.symbols[id].location.d];
			ui.draggable.attr('src',src);
			//alert('x:' + $(this).attr('x') + ' z:' + $(this).attr('z'));
			//map.draw();
		}
	});

};
Map.prototype.symbolDrag = {
	helper: 'clone',
	revert: "invalid",
	start: function(){
		var level = new Level(viewer.exp);
		var count = 0;
		for(var key in map.symbols){
			if(map.symbols[key].type == 'msg'){
				count++;
			}
			if(count >= level.param.msg)
				return false;
		}
	}
};
Map.prototype.arrow = function(d){
	switch(d){
		case 0: return '↑';
		case 1: return '→';
		case 2: return '↓';
		case 3: return '←';
	}
};
Map.prototype.drawSymbols = function(){
	//alert('drawSymbols');
	//$('.cell',this.el).empty();
	for(var key in this.symbols){
		if(key == 'self') continue;
		var symbol = this.symbols[key];

		if($('.cell img[key=' + key + ']',this.el).length)
			var img = $('.cell img[key=' + key + ']',this.el);
		else{
			var img = document.createElement('img');
			cell = $('.cell[x=' + symbol.location.x + '][z=' + symbol.location.z + ']',this.el);
			$(cell).append(img);
			$(img).draggable({
				revert: "invalid"
			});
		}
		var src = api.icon + '/' + symbol.icons[symbol.location.d];
		$(img).attr('src',src).attr('title',symbol.title).attr('key',key);
	}
};
Map.prototype.sp = function(){
	this.sd = [];
	for(var key in this.symbols){
		if(key == 'self') continue;
		var symbol = this.symbols[key];
		if(!this.sd[symbol.location.z])
			this.sd[symbol.location.z] = [];
		if(!this.sd[symbol.location.z][symbol.location.x])
			this.sd[symbol.location.z][symbol.location.x] = {};
		this.sd[symbol.location.z][symbol.location.x][symbol.name] = symbol;
	}
};
Map.prototype.forward = function(after){
	for(var key in this.symbols){
		if(after && this.symbols[key].after)
			this.symbols[key].forward(this.symbols["self"].location);
		else if(!after && !this.symbols[key].after)
			this.symbols[key].forward(this.symbols["self"].location);
	}
	//if(after) this.sd();
};
Map.prototype.hit = function(){
	var self = this.symbols['self'];
	for(var key in this.symbols){
		if(key == 'self') continue;
		var symbol = this.symbols[key];
		if(
			symbol.hitName
		 && 	self.location.x == symbol.location.x
		 &&	self.location.y == symbol.location.y
		 &&	self.location.z == symbol.location.z
		){
			return key;
		}
	}
	return false;
};
Map.prototype.crash = function(){
	var self = this.symbols['self'];
	for(var key in this.symbols){
		if(key == 'self') continue;
		symbol = this.symbols[key];
		if(
			self.location.x == symbol.location.x
		 &&	self.location.y == symbol.location.y
		 &&	self.location.z == symbol.location.z
		 && symbol.meetName == 'crash'
		){
			symbol.crash();
			return true;
		}
		if(
			(self.location.before_x == symbol.location.x
		 && self.location.before_y == symbol.location.y
		 && self.location.before_z == symbol.location.z
		 	) && (
			self.location.x == symbol.location.before_x
		 && self.location.y == symbol.location.before_y
		 && self.location.z == symbol.location.before_z
		 	)
		 && 	symbol.meetName == 'crash'
		){
			symbol.crash();
			return true;
		}
	}
	return false;	
};
Map.prototype.meet = function(){
	var self = this.symbols['self'];
	var _symbols = [];
	for(var key in this.symbols){
		if(key == 'self') continue;
		symbol = this.symbols[key];
		if(
			self.location.x == symbol.location.x
		 &&	self.location.y == symbol.location.y
		 &&	self.location.z == symbol.location.z
		){
			_symbols.push(key);
			continue;
		}
		if(
			(self.location.before_x == symbol.location.x
		 && self.location.before_y == symbol.location.y
		 && self.location.before_z == symbol.location.z
		 	) && (
			self.location.x == symbol.location.before_x
		 && self.location.y == symbol.location.before_y
		 && self.location.z == symbol.location.before_z
		 	)
		){
			_symbols.push(key);
			continue;
		}
	}
	return _symbols;
};
Map.prototype.openDoor = function(key){
	l = this.symbols.self.location;
	switch(l.d){
		case 0:
			//if(!this.data[l.y][l.z - 1]) break;
			//鍵を開ける
			if((this.data[l.y][l.z][l.x] & 0x4000) && key){
				this.data[l.y][l.z][l.x] &= 0xBFFF;
				this.data[l.y][l.z - 1][l.x] &= 0xFFBF;
				return 1;
			}
			//鍵を持っていない
			else if(this.data[l.y][l.z][l.x] & 0x4000){
				return 2;
			}
			//扉を開ける
			if((this.data[l.y][l.z][l.x] & 0x3000) == 0x3000){
				this.data[l.y][l.z][l.x] &= 0xEFFF;
				this.data[l.y][l.z - 1][l.x] &= 0xFFEF;
			}
			//扉を閉じる
			else if(this.data[l.y][l.z][l.x] & 0x2000){
				this.data[l.y][l.z][l.x] |= 0x1000;
				this.data[l.y][l.z - 1][l.x] |= 0x0010;
			}
			break;
		case 1:
			//if(!this.data[l.y][l.z][l.x + 1]) break;
			if((this.data[l.y][l.z][l.x] & 0x0400) && key){
				this.data[l.y][l.z][l.x] &= 0xFBFF;
				this.data[l.y][l.z][l.x - 0 + 1] &= 0xFFFB;
				return 1;
			}
			else if(this.data[l.y][l.z][l.x] & 0x0400){
				return 2;
			}
			if((this.data[l.y][l.z][l.x] & 0x0300) == 0x0300){
				this.data[l.y][l.z][l.x] &= 0xFEFF;
				this.data[l.y][l.z][l.x - 0 + 1] &= 0xFFFE;
			}
			else if(this.data[l.y][l.z][l.x] & 0x0200){
				this.data[l.y][l.z][l.x] |= 0x0100;
				this.data[l.y][l.z][l.x - 0 + 1] |= 0x0001;
			}
			break;
		case 2:
			//if(!this.data[l.y][l.z + 1]) break;
			if((this.data[l.y][l.z][l.x] & 0x0040) && key){
				this.data[l.y][l.z][l.x] &= 0xFFBF;
				this.data[l.y][l.z - 0 + 1][l.x] &= 0xBFFF;
				return 1;
			}
			else if(this.data[l.y][l.z][l.x] & 0x0040){
				return 2;
			}
			if((this.data[l.y][l.z][l.x] & 0x0030) == 0x0030){
				//alert('y: ' + l.y + ' z: ' + l.z + ' x: ' + l.x);
				//alert($.toJSON(this.data[l.y]));
				//alert($.toJSON(this.data[l.y][l.z]));
				//alert($.toJSON(this.data[l.y][4]));
				//alert($.toJSON(this.data[l.y][l.z - 0 + 1]));
				this.data[l.y][l.z][l.x] &= 0xFFEF;
				this.data[l.y][l.z - 0 + 1][l.x] &= 0xEFFF;
			}
			else if(this.data[l.y][l.z][l.x] & 0x0020){
				this.data[l.y][l.z][l.x] |= 0x0010;
				this.data[l.y][l.z - 0 + 1][l.x] |= 0x1000;
			}
			break;
		case 3:
			//if(!this.data[l.y][l.z][l.x - 1]) break;
			if((this.data[l.y][l.z][l.x] & 0x0004) && key){
				this.data[l.y][l.z][l.x] &= 0xFFFB;
				this.data[l.y][l.z][l.x - 1] &= 0xFBFF;
				return 1;
			}
			else if(this.data[l.y][l.z][l.x] & 0x0004){
				return 2;
			}
			if((this.data[l.y][l.z][l.x] & 0x0003) == 0x0003){
				this.data[l.y][l.z][l.x] &= 0xFFFE;
				this.data[l.y][l.z][l.x - 1] &= 0xFEFF;
			}
			else if(this.data[l.y][l.z][l.x] & 0x0002){
				this.data[l.y][l.z][l.x] |= 0x0001;
				this.data[l.y][l.z][l.x - 1] |= 0x0100;
			}
			break;
	}
};
