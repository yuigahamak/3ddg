function Location(x,y,z,d/*,map*/){
	this.log = [];
	this.x = (x - 0) || 0;
	this.y = (y - 0) || 0;
	this.z = (z - 0) || 0;
	this.d = (d - 0) || 0;
	//this.map = map;
}
Location.prototype.move = function(keyCode){
	var data = map.data[this.y];
	this.before_x = this.x;
	this.before_y = this.y;
	this.before_z = this.z;
	if(keyCode == '38' || keyCode == '40'){//up or down
		var boo = false;
		switch(keyCode == '38' ? this.d : (this.d + 2) % 4){
			case 0: boo = (data[this.z][this.x] & 0x1000); break;
			case 1: boo = (data[this.z][this.x] & 0x0100); break;
			case 2: boo = (data[this.z][this.x] & 0x0010); break;
			case 3: boo = (data[this.z][this.x] & 0x0001); break;
		}
		if(boo || (!data[this.z] || data[this.z][this.x] === undefined))
			return false;
		return true;
	}
	if(keyCode == '37' || keyCode == '39'){//left or right
		if(keyCode == '37') this.d --;
		if(keyCode == '39') this.d ++;
		this.d = (this.d + 4) % 4;
		return false;
	}
	if(keyCode == '32'){
		return true;
	}
};
Location.prototype.forward = function(keyCode){
	if(keyCode == '32') return;
	switch(keyCode == '38' ? this.d : (this.d + 2) % 4){
		case 0: this.z --; break;
		case 1: this.x ++; break;
		case 2: this.z ++; break;
		case 3: this.x --; break;
	}
};
Location.prototype.pushLog = function(){
	if(this.log.length > 99)
		this.log.shift();
	this.log.push([this.x,this.z]);
};

function Symbol(type,op){
	for(var key in symbols[type]){
		//if(key == 'src')
		//alert(type + ' ' + key + ': ' + symbols[type][key]);
		this[key] = symbols[type][key];
	}
	for(var key in op){
		this[key] = op[key];
	}
	this['type'] = type;
	this.location = new Location(this.x,this.y,this.z,this.d/*,map*/);
	if(!this.icons){
		this.icons = [this.icon,this.icon,this.icon,this.icon];
	}
	if(!this.src) return;
	this.src = typeof(this.src) == 'object' ? this.src : [this.src,this.src,this.src,this.src];
	this.imgs = [];
	//描画する度にsrcを書き換えるやり方だとfirefoxでバグった
	for(var i = 0; i < this.src.length; i++){
		var src = api.symbol + '/' + this.src[i];
		//this.imgs[i] = new Image();
		//this.imgs[i].src = src;
		//setLoader(src);
		this.imgs[i] = setLoader(src);
		/*loader[api.symbol + '/' + this.src[i]] = loader[api.symbol + '/' + this.src[i]] ? true : false;
		this.imgs[i] = new Image();
		this.imgs[i].src = api.symbol + '/' + this.src[i];
		$(this.imgs[i]).load(loadCheck(this.imgs[i]));*/
		//this.imgs[i].onload = loadCheck(this.imgs[i]);
	}
	//alert(this.src[3]);
};
Symbol.prototype.updateImage = function(src){
	this.src = src;
	if(!this.src){
		delete(this.imgs);
		return;
	}
	this.src = typeof(this.src) == 'object' ? this.src : [this.src,this.src,this.src,this.src];
	this.imgs = [];
	//描画する度にsrcを書き換えるやり方だとfirefoxでバグった
	for(var i = 0; i < this.src.length; i++){
		var src = api.symbol + '/' + this.src[i];
		this.imgs[i] = setLoader(src);
	}
};
Symbol.prototype.draw = function(x,z){
	z = distance + 0.25 + z * 0.5;
	if(this.frame){
		z1 = z - this.frame / 4;
		z2 = z + this.frame / 4;
		size_x1 = unitWidth / z1;
		size_x2 = unitWidth / z2;
		size_y1 = unitHeight / z1;
		size_y2 = unitHeight / z2;
		diff_x1 = size_x1 * (1 - this.frame) * 0.5;
		diff_x2 = size_x2 * (1 - this.frame) * 0.5;
		x1 = size_x1 * (x - 0.5) + halfCanvasWidth;
		x2 = size_x2 * (x - 0.5) + halfCanvasWidth;
		if(this.frame_pos == 'ceil'){
			y1 = - size_y1 * 0.5 + halfCanvasHeight;
			y2 = - size_y2 * 0.5 + halfCanvasHeight;			
		}
		else{
			y1 = size_y1 * 0.5 + halfCanvasHeight;
			y2 = size_y2 * 0.5 + halfCanvasHeight;
		}
		p1 = {x: x2 + diff_x2, y: y2};
		p2 = {x: x2 + size_x2 - diff_x2, y: y2};
		p3 = {x: x1 + size_x1 - diff_x1, y: y1};
		p4 = {x: x1 + diff_x1, y: y1};
		ctx.beginPath();
		ctx.moveTo(p1.x,p1.y);
		ctx.lineTo(p2.x,p2.y);
		ctx.lineTo(p3.x,p3.y);
		ctx.lineTo(p4.x,p4.y);
		ctx.closePath();
		ctx.strokeStyle = "rgb(128, 128, 128)";
		ctx.stroke();
	}
	if(this.imgs){
		d = (this.location.d - local.d + 4) % 4;
		var size_x = unitWidth / z;
		var size_y = unitHeight / z;
		var fx = size_x * (x - 0.5) + halfCanvasWidth;
		var fy = size_y * 0.5 + halfCanvasHeight;
		fx += size_x * (1 - this.size_x) * 0.5;
		fy -= size_y * this.pos_y;
		fy -= size_y * this.size_y;
		var ss_x = size_x * this.size_x;
		var ss_y = size_y * this.size_y;
		if(this.pitch){
			fy += this.pitch * (Math.random() * 2 - 1) * size_y;
		}
		if(this.roll){
			fx += this.roll * (Math.random() * 2 - 1) * size_x;
		}
		ctx.drawImage(this.imgs[d], fx, fy, ss_x, ss_y);
	}
};
Symbol.prototype.forward = function(target){
	var data = map.data[this.location.y];
	if(this[this.alg](target));
	else return false;
	this.location.before_x = this.location.x;
	this.location.before_y = this.location.y;
	this.location.before_z = this.location.z;
	switch(this.location.d){
		case 0: this.location.z --; break;
		case 1: this.location.x ++; break;
		case 2: this.location.z ++; break;
		case 3: this.location.x --; break;
	}
	return true;
};
Symbol.prototype.rotateRight = function(){
	var data = map.data[this.location.y];
	p = data[this.location.z][this.location.x];
	da = [];
	da[0] = (this.location.d + 1) % 4;
	da[1] = this.location.d;
	da[2] = (this.location.d + 3) % 4;
	da[3] = (this.location.d + 2) % 4;
	for(var i = 0; i < da.length; i++){
		d = da[i];
		if(d == 0 & !(p & 0x1000)){
			this.location.d = d;
			return true;
		}else if(d == 1 & !(p & 0x0100)){
			this.location.d = d;
			return true;
		}else if(d == 2 & !(p & 0x0010)){
			this.location.d = d;
			return true;
		}else if(d == 3 & !(p & 0x0001)){
			this.location.d = d;
			return true;
		}		
	}
	return false;	
};
Symbol.prototype.rotateLeft = function(){
	var data = map.data[this.location.y];
	p = data[this.location.z][this.location.x];
	da = [];
	da[0] = (this.location.d + 3) % 4;
	da[1] = this.location.d;
	da[2] = (this.location.d + 1) % 4;
	da[3] = (this.location.d + 2) % 4;
	for(var i = 0; i < da.length; i++){
		d = da[i];
		if(d == 0 & !(p & 0x1000)){
			this.location.d = d;
			return true;
		}else if(d == 1 & !(p & 0x0100)){
			this.location.d = d;
			return true;
		}else if(d == 2 & !(p & 0x0010)){
			this.location.d = d;
			return true;
		}else if(d == 3 & !(p & 0x0001)){
			this.location.d = d;
			return true;
		}		
	}
	return false;	
};
Symbol.prototype.turnRight = function(){
	var data = map.data[this.location.y];
	p = data[this.location.z][this.location.x];
	da = [];
	da[0] = this.location.d;
	da[1] = (this.location.d + 1) % 4;
	da[2] = (this.location.d + 3) % 4;
	da[3] = (this.location.d + 2) % 4;
	for(var i = 0; i < da.length; i++){
		d = da[i];
		if(d == 0 & !(p & 0x1000)){
			this.location.d = d;
			return true;
		}else if(d == 1 & !(p & 0x0100)){
			this.location.d = d;
			return true;
		}else if(d == 2 & !(p & 0x0010)){
			this.location.d = d;
			return true;
		}else if(d == 3 & !(p & 0x0001)){
			this.location.d = d;
			return true;
		}		
	}
	return false;	
};
Symbol.prototype.turnLeft = function(){
	var data = map.data[this.location.y];
	p = data[this.location.z][this.location.x];
	da = [];
	da[0] = this.location.d;
	da[1] = (this.location.d + 3) % 4;
	da[2] = (this.location.d + 1) % 4;
	da[3] = (this.location.d + 2) % 4;
	for(var i = 0; i < da.length; i++){
		d = da[i];
		if(d == 0 & !(p & 0x1000)){
			this.location.d = d;
			return true;
		}else if(d == 1 & !(p & 0x0100)){
			this.location.d = d;
			return true;
		}else if(d == 2 & !(p & 0x0010)){
			this.location.d = d;
			return true;
		}else if(d == 3 & !(p & 0x0001)){
			this.location.d = d;
			return true;
		}		
	}
	return false;
};
Symbol.prototype.chase = function(target){
	var data = map.data[this.location.y];
	p = data[this.location.z][this.location.x];
	da = [];
	diff_x = this.location.x - target.x;
	diff_z = this.location.z - target.z;
	if(Math.abs(diff_x) > Math.abs(diff_z)){
		da[0] = diff_x > 0 ? 3 : 1;
		da[1] = diff_z > 0 ? 0 : 2;
		da[2] = (da[1] + 2) % 4;
		da[3] = (da[0] + 2) % 4;
	}else{
		da[0] = diff_z > 0 ? 0 : 2;
		da[1] = diff_x > 0 ? 3 : 1;
		da[2] = (da[1] + 2) % 4;
		da[3] = (da[0] + 2) % 4;
	}
	for(var i = 0; i < da.length; i++){
		d = da[i];
		if(d == 0 & !(p & 0x1000)){
			this.location.d = d;
			return true;
		}else if(d == 1 & !(p & 0x0100)){
			this.location.d = d;
			return true;
		}else if(d == 2 & !(p & 0x0010)){
			this.location.d = d;
			return true;
		}else if(d == 3 & !(p & 0x0001)){
			this.location.d = d;
			return true;
		}		
	}
	return false;	
};
Symbol.prototype.away = function(target){
	var data = map.data[this.location.y];
	p = data[this.location.z][this.location.x];
	da = [];
	diff_x = this.location.x - target.x;
	diff_z = this.location.z - target.z;
	if(this.location.x == target.x && this.location.y == target.y && this.location.z == target.z){
		ary = [0,1,2,3];
		for(var i = 0; i < 4; i++){
			n = Math.random() * ary.length | 0;
			da[i] = ary.splice(n, 1) - 0;
		}
	}else if(diff_x == diff_z){
		//alert(1);
		da[0] = diff_x > 0 ? ((Math.random() + 1.5) | 0) : ((Math.random() * 2 | 0) * 3);//1 or 2 : 0 or 3
		da[1] = diff_x > 0 ? (da[0] == 1 ? 2 : 1) : (da[0] == 0 ? 3 : 0);
		da[2] = diff_x > 0 ? ((Math.random() * 2 | 0) * 3) : ((Math.random() + 1.5) | 0);//0 or 3 : 1 or 2
		da[3] = diff_x > 0 ? (da[2] == 0 ? 3 : 0) : (da[2] == 1 ? 2 : 1);
		//alert((diff_x > 0 ? "A" : "B") + da);
	}else if(Math.abs(diff_x) == Math.abs(diff_z)){
		//alert(2);
		da[0] = diff_x > 0 ? (Math.random() * 2 | 0) : ((Math.random() * 2 | 0) + 2);//0 or 1 : 2 or 3
		da[1] = diff_x > 0 ? (da[0] == 0 ? 1 : 0) : (da[0] == 2 ? 3 : 2);
		da[2] = diff_x > 0 ? ((Math.random() * 2 | 0) + 2) : (Math.random() * 2 | 0);//2 or 3 : 0 or 1
		da[3] = diff_x > 0 ? (da[2] == 2 ? 3 : 2) : (da[2] == 0 ? 1 : 0);
		//alert((diff_x > 0 ? "C" : "D") + da);
	}else if(Math.abs(diff_x) > Math.abs(diff_z)){
		da[0] = diff_x < 0 ? 3 : 1;
		da[1] = diff_z < 0 ? 0 : 2;
		da[1] = diff_z == 0 ?  (Math.random() * 2 | 0) * 2 : da[1];//0 or 2
		da[2] = (da[1] + 2) % 4;
		da[3] = (da[0] + 2) % 4;
	}else{
		da[0] = diff_z < 0 ? 0 : 2;
		da[1] = diff_x < 0 ? 3 : 1;
		da[1] = diff_x == 0 ?  (Math.random() * 2 | 0) * 2 + 1 : da[1];//1 or 3
		da[2] = (da[1] + 2) % 4;
		da[3] = (da[0] + 2) % 4;
	}
	for(var i = 0; i < da.length; i++){
		d = da[i];
		if(d == 0 && !(p & 0x1000)
		 && !(this.location.x == target.x && this.location.y == target.y && this.location.z - 1 == target.z)
		 && !(this.location.x == target.before_x && this.location.y == target.before_y && this.location.z - 1 == target.before_z)
		){
			this.location.d = d;
			return true;
		}else if(d == 1 && !(p & 0x0100)
		 && !(this.location.x + 1 == target.x && this.location.y == target.y && this.location.z == target.z)
		 && !(this.location.x + 1 == target.before_x && this.location.y == target.before_y && this.location.z == target.before_z)
		){
			this.location.d = d;
			return true;
		}else if(d == 2 && !(p & 0x0010)
		 && !(this.location.x == target.x && this.location.y == target.y && this.location.z + 1 == target.z)
		 && !(this.location.x == target.before_x && this.location.y == target.before_y && this.location.z + 1 == target.before_z)
		){
			this.location.d = d;
			return true;
		}else if(d == 3 && !(p & 0x0001)
		 && !(this.location.x - 1 == target.x && this.location.y == target.y && this.location.z == target.z)				
		 && !(this.location.x - 1 == target.before_x && this.location.y == target.before_y && this.location.z == target.before_z)				
		){
			this.location.d = d;
			return true;
		}
	}
	return false;
};
Symbol.prototype.static = function(){
	return false;
};
Symbol.prototype.selfAlg = function(){
	return false;
};
Symbol.prototype.meet = function(){
	if(this.once && viewer.detail.flgs[this.name]){
		delete(map.symbols[this.name]);
		return false;
	}
	else if(this.meetName)
		this[this.meetName]();
	if(this.once && this.meetName){
		game.flgs[this.name] = {x:local.x,y:local.y,z:local.z};
		delete(map.symbols[this.name]);
	}
};
Symbol.prototype.hit = function(){
	if(this.once && viewer.detail.flgs[this.name]){
		delete(map.symbols[this.name]);
		return false;
	}
	else if(this.hitName)
		this[this.hitName]();
	if(this.once && this.hitName){
		game.flgs[this.name] = {x:local.x,y:local.y,z:local.z};
		delete(map.symbols[this.name]);
	}
};
Symbol.prototype.crash = function(){
	build.unbind();
	build.retry('go');
	var img = this.imgs[2];
	$(img).attr('id','crash')
	.css('width','216px').css('height','216px')
	.css('left','252px').css('top','250px');
	$('#animation').append(this.imgs[2]);
	$(img).animate({
		left: 144,
		top: 100,
		width: 432,
		height: 432,
		opacity: 0
	},1000,function(){
		$(this).remove();
	});
};
Symbol.prototype.getKey = function(){
	game.key.push({status: 'unuse',get: '100'});
	build.addKey();
	build.popup('鍵を手に入れた');
	delete(map.symbols[this.name]);
};
Symbol.prototype.goal = function(){
	build.text(this.text || '<p>君は梯子に手をかけ感触を確かめる。</p><p>腐食が進んで今にも折れそうだがなんとか登れるだろうか？</p><p>君は慎重に足の置き場を選びながら、ゆっくりと登っていった・・・。</p>',true);
	build.unbind();
	$(document).bind('keydown click',pause);
	function pause(){
		$(document).unbind('keydown click',pause);
		if(from == 'public-list')
			api.clearPublic(map.id);
		if(from == 'private-list')
			api.clearPrivate(map.id);
		if(from == 'editor')
			api.updateMapStatus(map.id);
		return false;
	}
};
Symbol.prototype.start = function(){
	build.notice(this.text || '<h3>' + maps[map.id].name + '</h3>');
};
Symbol.prototype.msg = function(){
	build.notice(this.text);
	//this.message(this.text);
};
//IE対応のため関数(once_message)外だし
function once_message(){
	message.index ++;
	if(message.text.length > message.index){
		build.text(message.text[message.index],true);
		if(message.text.length - 1 == message.index && message.item){
			game.addItem(message.item);
		}
		if(message.text.length - 1 == message.index && message.callback){
			eval(message.callback);
		}
	}
	else{
		$('#notice:visible').fadeOut(500);
		$(document).unbind('keydown click',once_message);
		build.bind();
	}
	return false;
};
Symbol.prototype.message = function(){
	var text = typeof(this.text) == 'object' ? this.text : [this.text];
		build.unbind();
		build.text(text[0],true);
		if(text.length === 1){
			if(this.item){
				game.addItem(this.item);
			}
			if(this.callback){
				eval(this.callback);
			}
		}
		message = {
			text: text, index: 0, item: this.item, callback: this.callback
		};
		//IE対応のため関数(once_message)外だし
		$(document).bind('keydown click',once_message/*function once(e){
			message.index ++;
			if(message.text.length > message.index){
				build.text(message.text[message.index],true);
				if(message.text.length - 1 == message.index && message.item){
					game.addItem(message.item);
				}
				if(message.text.length - 1 == message.index && message.callback){
					eval(message.callback);
				}
			}
			else{
				$('#notice:visible').fadeOut(500);
				$(document).unbind('keydown click',once);
				build.bind();
			}
			return false;
		}*/);
};
Symbol.prototype.event = function(){
	if(this.text)
		this.message();
	if(this.callback)
		eval(this.callback);
};
Symbol.prototype.occ = function(ary){
	build.unbind();
	//$('#controller:visible').fadeOut('fast');
	$('#notice').attr('name',this.name);
	this.ary = ary;
	this.occ_exe(0);
};
Symbol.prototype.occ_exe = function(n){
	var occ = this.ary[n];
	if(occ.require){
		if(eval(occ.require)){
			this.occ_exe(occ.yes);
			return false;
		}
		else{
			this.occ_exe(occ.no);
			return false;
		}
	}
	if(occ.text){
		build.text(occ.text, occ.select ? false : true, true);
	}
	if(occ.select){		
		this.selected = 0;
		var ul = document.createElement('ul');			
		for(var i = 0; i < occ.select.length; i++){
			if(occ.select[i].require && !eval(occ.select[i].require)) continue;
			var li = document.createElement('li');			
			$(li).attr('no',i).attr('to',occ.select[i].to).html(occ.select[i].text);
			$(li).click(function(){
				$(document).unbind('keydown',c_s);
				map.symbols[$('#notice').attr('name')].occ_exe($(this).attr('to'));
				return false;
			});
			$(li).mouseover(function(){
				//alert('over');
				$('#notice li').css('border-color','#000');
				$(this).css('border-color','#777');
				var symbol = map.symbols[$('#notice').attr('name')];
				symbol.selected = $(this).attr('no');
			});
			$(li).mouseout(function(){
				$(this).css('border-color','#000');
			});
			$(ul).append(li);
		}
		$('#notice').append(ul);
		$('#notice li:first').css('border-color','#777');
		
		//カーソル操作
		function c_s(e){
			var symbol = map.symbols[$('#notice').attr('name')];
			if(e.keyCode == 13 || e.keyCode == 32){
				$(document).unbind('keydown',c_s);
				symbol.occ_exe($('#notice li').eq(symbol.selected).attr('to'));
				return false;
			}
			if(e.keyCode == 38){
				symbol.selected = symbol.selected || $('#notice li').length;
				symbol.selected --;
			}
			if(e.keyCode == 40){
				symbol.selected ++;
				symbol.selected = symbol.selected >= $('#notice li').length ? 0 : symbol.selected;
			}
			if(e.keyCode == 38 || e.keyCode == 40){
				$('#notice li').css('border-color','#000');
				$('#notice li').eq(symbol.selected).css('border-color','#777');
				return false;
			}
		}
		$(document).bind('keydown',c_s);
	}
	else if(occ.to){
		var to = typeof(occ.to) == 'string' ? eval(occ.to): occ.to;
		$('#notice').attr('to',to);
		if(occ.text){
			function once_to(){
				$(document).unbind('keydown click',once_to);
				map.symbols[$('#notice').attr('name')].occ_exe($('#notice').attr('to'));
				return false;
			}
			$(document).bind('keydown click',once_to);
		}
	}
	else{
		function once_fo(){
			$(document).unbind('keydown click',once_fo);
			$('#notice:visible').fadeOut(500);
			//alert('bind');
			build.bind();
			return false;
		}
		$(document).bind('keydown click',once_fo);
	}
	if(occ.callback){//コールバックは最後に。textの内容を書き換えたりするから
		eval(occ.callback);
	}
	if(!occ.text){//textが無くてコールバックだけの時とか
		if(occ.to){
			var to = typeof(occ.to) == 'string' ? eval(occ.to): occ.to;
			//if(typeof(occ.to) == 'string')
			//	occ.to = eval(occ.to);
			this.occ_exe(to);
		}
		return false;
	}
};
