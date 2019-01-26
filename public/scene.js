//配列に格納した順に描画する。端から真ん中へ
var views = [
	/*[
		{x: -4, z: 7},
		{x: 4, z: 7},
		{x: -3, z: 7},
		{x: 3, z: 7},
		{x: -2, z: 7},
		{x: 2, z: 7},
		{x: -1, z: 7},
		{x: 1, z: 7},
		{x: 0, z: 7}
	],*/
	[
		{x: -7, z: 6},
		{x: 7, z: 6},
		{x: -6, z: 6},
		{x: 6, z: 6},
		{x: -5, z: 6},
		{x: 5, z: 6},
		{x: -4, z: 6},
		{x: 4, z: 6},
		{x: -3, z: 6},
		{x: 3, z: 6},
		{x: -2, z: 6},
		{x: 2, z: 6},
		{x: -1, z: 6},
		{x: 1, z: 6},
		{x: 0, z: 6}
	],
	[
		{x: -6, z: 5},
		{x: 6, z: 5},
		{x: -5, z: 5},
		{x: 5, z: 5},
		{x: -4, z: 5},
		{x: 4, z: 5},
		{x: -3, z: 5},
		{x: 3, z: 5},
		{x: -2, z: 5},
		{x: 2, z: 5},
		{x: -1, z: 5},
		{x: 1, z: 5},
		{x: 0, z: 5}
	],
	[
		{x: -5, z: 4},
		{x: 5, z: 4},
		{x: -4, z: 4},
		{x: 4, z: 4},
		{x: -3, z: 4},
		{x: 3, z: 4},
		{x: -2, z: 4},
		{x: 2, z: 4},
		{x: -1, z: 4},
		{x: 1, z: 4},
		{x: 0, z: 4}
	],
	[
		{x: -4, z: 3},
		{x: 4, z: 3},
		{x: -3, z: 3},
		{x: 3, z: 3},
		{x: -2, z: 3},
		{x: 2, z: 3},
		{x: -1, z: 3},
		{x: 1, z: 3},
		{x: 0, z: 3}
	],
	[
		/*{x: -4, z: 2},
		{x: 4, z: 2},*/
		{x: -3, z: 2},
		{x: 3, z: 2},
		{x: -2, z: 2},
		{x: 2, z: 2},
		{x: -1, z: 2},
		{x: 1, z: 2},
		{x: 0, z: 2}
	],
	[
		{x: -3, z: 1},
		{x: 3, z: 1},
		{x: -2, z: 1},
		{x: 2, z: 1},
		{x: -1, z: 1},
		{x: 1, z: 1},
		{x: 0, z: 1}
	],
	[
		{x: -2, z: 0},
		{x: 2, z: 0},
		{x: -1, z: 0},
		{x: 1, z: 0},
		{x: 0, z: 0}
	]
];

function Shape(x,z,p) {
	this.polygons = [];
	this.x = x;
	this.z = z;
	for(var d = 0; d < 4; d++){
		if(x < 0 && d == 1) continue;
		if(x > 0 && d == 3) continue;
		if(_type = this.type(d,p)){
			//alert('type: ' + type);
			if(_type); else continue;
			var polygon = new Polygon(x,z,d,_type);
			this.polygons.push(polygon);
		}
	}
}
Shape.prototype.type = function(d,p) {
	switch(local.d){
		case 0://前
			return d == 0 && (p & 0xF000) >> 12
			|| d == 1 && (p & 0x0F00) >> 8
			|| d == 2 && false
			|| d == 3 && (p & 0x000F);
		case 1://右
			return d == 0 && (p & 0x0F00) >> 8
			|| d == 1 && (p & 0x00F0) >> 4
			|| d == 2 && false
			|| d == 3 && (p & 0xF000) >> 12;
		case 2://下
			return d == 0 && (p & 0x00F0) >> 4
			|| d == 1 && (p & 0x000F)
			|| d == 2 && false
			|| d == 3 && (p & 0x0F00) >> 8;
		case 3://左
			return d == 0 && (p & 0x000F)
			|| d == 1 && (p & 0xF000) >> 12
			|| d == 2 && false
			|| d == 3 && (p & 0x00F0) >> 4;
	}
}
Shape.prototype.draw = function() {
	for (var i = 0; i < this.polygons.length; i++){
		this.polygons[i].draw();
	}
}

function Polygon(x,z,d,type){
	/*dist = Math.pow(x * x + z * z, 1/2);
	l = 4000 / Math.pow((dist + 1.5) * 2, 2);
	g = l / 4 | 0;
	g = 127;*/
	this.z = z;
	this.d = d;
	this.type = type;
	this.size_x = unitWidth;
	this.size_y = unitHeight;
	switch(type){
		//case 1: this.color = [g,g,g]; break;
		case 1:
			this.img = imgs.wall;
			break;
		case 2:
			this.img = imgs.door3;
			break;
		case 3:
			this.img = imgs.door2;
			break;
		case 7:
			this.img = imgs.door;
			break;
	}
	//this.color = (type & 0x3) == 3 ? [127,95,31] : [g,g,g];
	switch(d){
		case 0: this.points = this.front(x,z); break;
		case 1: this.points = this.right(x,z); break;
		case 2: this.points = []; break;
		case 3: this.points = this.left(x,z); break;
	}
	//alert($.toJSON(this.points));
}
Polygon.prototype.front = function(x,z) {
	z = distance + 0.5 + z * 0.5;
	var size_x = this.size_x / z;
	var size_y = this.size_y / z;
	var fx1 = size_x * (x - 0.5);
	var fy1 = size_y * - 0.5;
	var fx2 = fx1 + size_x;
	var fy2 = fy1 + size_y;	
	return [
		{fx: fx1, fy: fy1},
		{fx: fx2, fy: fy1},
		{fx: fx2, fy: fy2},
		{fx: fx1, fy: fy2}
	]
}
Polygon.prototype.right = function(x,z) {
	z1 = distance + 0.5 + z * 0.5;
	z2 = distance + z * 0.5;
	var size1_x = this.size_x / z1;
	var size1_y = this.size_y / z1;
	var size2_x = this.size_x / z2;
	var size2_y = this.size_y / z2;
	var fx1 = size1_x * (x + 0.5);
	var fx2 = size2_x * (x + 0.5);
	var fy1 = size1_y * - 0.5;
	var fy2 = fy1 + size1_y;	
	var fy3 = size2_y * - 0.5;	
	var fy4 = fy3 + size2_y;	
	return [
		{fx: fx1, fy: fy1},
		{fx: fx2, fy: fy3},
		{fx: fx2, fy: fy4},
		{fx: fx1, fy: fy2}
	];
}
Polygon.prototype.left = function(x,z) {
	z1 = distance + 0.5 + z * 0.5;
	z2 = distance + z * 0.5;
	var size1_x = this.size_x / z1;
	var size1_y = this.size_y / z1;
	var size2_x = this.size_x / z2;
	var size2_y = this.size_y / z2;
	var fx1 = size1_x * (x - 0.5);
	var fx2 = size2_x * (x - 0.5);
	var fy1 = size1_y * - 0.5;
	var fy2 = fy1 + size1_y;	
	var fy3 = size2_y * - 0.5;	
	var fy4 = fy3 + size2_y;	
	return [
		{fx: fx2, fy: fy3},
		{fx: fx1, fy: fy1},
		{fx: fx1, fy: fy2},
		{fx: fx2, fy: fy4}
	]
}
Polygon.prototype.draw = function() {
	//if(this.type & 0x2)
	if(this.img)
		this.drawImg();
	else	
		this.drawWall();
}
Polygon.prototype.drawImg = function() {
	p0 = this.points[0];
	p1 = this.points[1];
	p2 = this.points[2];
	p3 = this.points[3];

	h_size = (p1.fx - p0.fx) / this.size_x;
	v_size1 = Math.abs(p1.fy - p2.fy) / this.size_y;
	v_size2 = Math.abs(p0.fy - p3.fy) / this.size_y;
	v_slope = (p1.fy - p0.fy) / this.size_y * (unitHeight / unitWidth);

	ctx.save();

	if(this.z == 0 && (this.d == 1 || this.d == 3)){
		ctx.beginPath();
		if(p0.fy <= p1.fy){//left
			ctx.moveTo(halfCanvasWidth + p0.fx - (p0.fx - p1.fx) / 2, halfCanvasHeight + p1.fy - (Math.max(p0.fy, p1.fy) - Math.min(p0.fy, p1.fy)) / 2);
			ctx.lineTo(halfCanvasWidth + p1.fx, halfCanvasHeight + p1.fy);
			ctx.lineTo(halfCanvasWidth + p2.fx, halfCanvasHeight + p2.fy);
			ctx.lineTo(halfCanvasWidth + p3.fx - (p0.fx - p1.fx) / 2, halfCanvasHeight + p2.fy + (Math.max(p0.fy, p1.fy) - Math.min(p0.fy, p1.fy)) / 2);
		}else{//right
			ctx.moveTo(halfCanvasWidth + p0.fx, halfCanvasHeight + p0.fy);
			ctx.lineTo(halfCanvasWidth + p0.fx + (p1.fx - p0.fx) / 2, halfCanvasHeight + p0.fy - (Math.max(p0.fy, p1.fy) - Math.min(p0.fy, p1.fy)) / 2);
			ctx.lineTo(halfCanvasWidth + p3.fx + (p1.fx - p0.fx) / 2, halfCanvasHeight + p2.fy - (Math.max(p0.fy, p1.fy) - Math.min(p0.fy, p1.fy)) / 2);
			ctx.lineTo(halfCanvasWidth + p3.fx, halfCanvasHeight + p3.fy);
		}
		ctx.closePath();
		ctx.clip();
	}
	
	//0.007 隙間埋め
	ctx.setTransform(h_size + 0.007, v_slope * 1, 0, Math.min(v_size1,v_size2), halfCanvasWidth + p0.fx, halfCanvasHeight + p0.fy);	
	ctx.drawImage(this.img, 0, 0, this.size_x, this.size_y);
	ctx.restore();
	
	var fx,fy;
	if(this.z == 0 && (this.d == 1 || this.d == 3)){
		if(p0.fy <= p1.fy){//left
			fx = p0.fx;
			fy = p0.fy;
			p0.fx = p0.fx + (p1.fx - p0.fx) / 2;
			p3.fx = p0.fx;
			p0.fy = p0.fy + (p2.fy - p0.fy) / 2;
			p3.fy = p3.fy - (p3.fy - p2.fy) / 2;
			p1.fy = p0.fy;//left判定にするため
		}else{//right
			fx = p0.fx;
			fy = p3.fy - (p2.fy - p1.fy);
			p1.fx = p0.fx + (p1.fx - p0.fx) / 2;
			p2.fx = p1.fx;
			p1.fy = p1.fy + (p3.fy - p1.fy) / 2;
			p2.fy = p2.fy - (p2.fy - p3.fy) / 2;
			p0.fy = p1.fy + 1;//left判定にするため			
		}
	}
	
	ctx.save();
	ctx.beginPath();
	if(p0.fy <= p1.fy){//left
		ctx.moveTo(halfCanvasWidth + p0.fx, halfCanvasHeight + p0.fy);
		fx = fx || p0.fx;
		fy = fy || p0.fy;
	}else{//right
		ctx.moveTo(halfCanvasWidth + p1.fx, halfCanvasHeight + p1.fy);
		fy = fy || (p3.fy - (p2.fy - p1.fy));
		fx = fx || p0.fx;
	}
	ctx.lineTo(halfCanvasWidth + p2.fx, halfCanvasHeight + p2.fy);
	ctx.lineTo(halfCanvasWidth + p3.fx, halfCanvasHeight + p3.fy);
	ctx.closePath();
	ctx.clip();

	/*if(this.z == 0 && (this.d == 1 || this.d == 3)){
		ctx.beginPath();
		if(p0.fy <= p1.fy){//left
			ctx.moveTo(halfCanvasWidth + p0.fx - (p0.fx - p1.fx) / 2, halfCanvasHeight + p1.fy - (Math.max(p0.fy, p1.fy) - Math.min(p0.fy, p1.fy)) / 2);
			ctx.lineTo(halfCanvasWidth + p1.fx, halfCanvasHeight + p1.fy);
			ctx.lineTo(halfCanvasWidth + p2.fx, halfCanvasHeight + p2.fy);
			ctx.lineTo(halfCanvasWidth + p3.fx - (p0.fx - p1.fx) / 2, halfCanvasHeight + p2.fy + (Math.max(p0.fy, p1.fy) - Math.min(p0.fy, p1.fy)) / 2);
		}else{//right
			ctx.moveTo(halfCanvasWidth + p0.fx, halfCanvasHeight + p0.fy);
			ctx.lineTo(halfCanvasWidth + p0.fx + (p1.fx - p0.fx) / 2, halfCanvasHeight + p0.fy - (Math.max(p0.fy, p1.fy) - Math.min(p0.fy, p1.fy)) / 2);
			ctx.lineTo(halfCanvasWidth + p3.fx + (p1.fx - p0.fx) / 2, halfCanvasHeight + p2.fy - (Math.max(p0.fy, p1.fy) - Math.min(p0.fy, p1.fy)) / 2);
			ctx.lineTo(halfCanvasWidth + p3.fx, halfCanvasHeight + p3.fy);
		}
		ctx.closePath();
		ctx.clip();
	}*/
	
	//0.007 隙間埋め
	ctx.setTransform(h_size + 0.007, -v_slope * 1, 0, Math.max(v_size1,v_size2), halfCanvasWidth + fx, halfCanvasHeight + fy);
	ctx.drawImage(this.img, 0, 0, this.size_x, this.size_y);
	ctx.restore();
	
	/*ctx.beginPath();
	ctx.moveTo(halfCanvasWidth + p0.fx, halfCanvasHeight + p0.fy);
	ctx.lineTo(halfCanvasWidth + p1.fx, halfCanvasHeight + p1.fy);
	ctx.lineTo(halfCanvasWidth + p2.fx, halfCanvasHeight + p2.fy);
	ctx.lineTo(halfCanvasWidth + p3.fx, halfCanvasHeight + p3.fy);
	ctx.closePath();
	ctx.strokeStyle = "rgb(255, 255, 255)";
	ctx.stroke();*/
}
Polygon.prototype.drawWall = function() {
	ctx.beginPath();
	ctx.moveTo(
		halfCanvasWidth + this.points[0].fx,
		halfCanvasHeight + this.points[0].fy
	);
	for(var i = 1; i < this.points.length; i++) {
		ctx.lineTo(
			halfCanvasWidth + this.points[i].fx,
			halfCanvasHeight + this.points[i].fy
		);
	}
	ctx.closePath();
	var color = this.color;
	if (color.length > 3) {
		var style = ["rgba(",
		             color[0], ",",
		             color[1], ",",
		             color[2], ",",
		             color[3], ")"].join("");
	} else {
		var style = ["rgb(",
		             color[0], ",",
		             color[1], ",",
		             color[2], ")"].join("");
	}
	ctx.fillStyle = style;
	ctx.fill();
	ctx.strokeStyle = "rgb(95, 95, 95)";
	ctx.stroke();
}

var scene = {
	depth: 6,
	draw: function(){
		ctx.clearRect(0, 0, canvasWidth, canvasHeight);
		var data = map.data[this.location.y];
		map.sp();
		for(var i = 0; i < views.length; i++){
			if(this.depth < views[i][0].z) continue;
			for(var j = 0; j < views[i].length; j++){
				var p = views[i][j];
				var _x = p.x;
				var _z = p.z;
				switch(this.location.d){
					case 0: x = (this.location.x - 0) + (_x - 0); z = this.location.z - _z; break;
					case 1: x = (this.location.x - 0) + (_z - 0); z = (this.location.z - 0) + (_x - 0); break;
					case 2: x = this.location.x - _x; z = (this.location.z - 0) + (_z - 0); break;
					case 3: x = this.location.x - _z; z = this.location.z - _x; break;
				}
				//$('#info').append('_x: ' + _x + ' _y: '+ _y + ' x: ' + x + ' y: ' + y + '<br />');
				if(data[z] && data[z][x] !== undefined){
					var shape = new Shape(_x,_z,data[z][x]);
					shape.draw();
				}
				if(this.map.sd[z] && this.map.sd[z][x]){
					for(var key in this.map.sd[z][x]){
						//alert(key);
						//var symbol = this.map.sd[z][x][key];
						//symbol.draw(_x,_z);
						this.map.sd[z][x][key].draw(_x,_z);
					}
				}
			}
		}
		this.mask();
	},
	mask: function(){
		var data = map.data[this.location.y];
		var p = data[this.location.z][this.location.x];
		if(//左壁
			this.location.d == 3 && (p & 0x0010)
		 || this.location.d == 2 && (p & 0x0100)
		 || this.location.d == 1 && (p & 0x1000)
		 || this.location.d == 0 && (p & 0x0001)
		){
			var width = (unitWidth / distance + unitWidth / (distance + 0.5)) / 2;
			ctx.beginPath();
			ctx.moveTo(0,0);
			ctx.lineTo(halfCanvasWidth - width / 2, 0);
			ctx.lineTo(halfCanvasWidth - width / 2, canvasHeight);
			ctx.lineTo(0,canvasHeight);
			ctx.closePath();
			ctx.fillStyle = "rgb(0, 0, 0)";
			ctx.fill();			
		}
		/*else if(//左扉
				this.location.d == 3 && (p & 0x0020)
			 || this.location.d == 2 && (p & 0x0200)
			 || this.location.d == 1 && (p & 0x2000)
			 || this.location.d == 0 && (p & 0x0002)
		){
			var width = (unitWidth / distance + unitWidth / (distance + 0.5)) / 2;
			var height = (unitHeight / distance + unitHeight / (distance + 0.5)) / 2;
			var h = height * 0.57;
			ctx.beginPath();
			ctx.moveTo(halfCanvasWidth - width, halfCanvasHeight - h);
			ctx.lineTo(halfCanvasWidth - width / 2, 0);
			ctx.lineTo(halfCanvasWidth - width / 2, halfCanvasHeight - h / 2);
			ctx.closePath();
			ctx.fillStyle = "rgb(0, 0, 0)";
			ctx.fill();
		}*/
		if(//右壁
			this.location.d == 3 && (p & 0x1000)
		 || this.location.d == 2 && (p & 0x0001)
		 || this.location.d == 1 && (p & 0x0010)
		 || this.location.d == 0 && (p & 0x0100)
		){
			var width = (unitWidth / distance + unitWidth / (distance + 0.5)) / 2;
			ctx.beginPath();
			ctx.moveTo(canvasWidth,0);
			ctx.lineTo(halfCanvasWidth + width / 2, 0);
			ctx.lineTo(halfCanvasWidth + width / 2, canvasHeight);
			ctx.lineTo(canvasWidth,canvasHeight);
			ctx.closePath();
			ctx.fillStyle = "rgb(0, 0, 0)";
			ctx.fill();			
		}
		/*else if(//右扉
				this.location.d == 3 && (p & 0x2000)
			 || this.location.d == 2 && (p & 0x0002)
			 || this.location.d == 1 && (p & 0x0020)
			 || this.location.d == 0 && (p & 0x0200)
		){
			var width = (unitWidth / distance + unitWidth / (distance + 0.5)) / 2;
			var height = (unitHeight / distance + unitHeight / (distance + 0.5)) / 2;
			var h = height * 0.57;
			ctx.beginPath();
			ctx.moveTo(halfCanvasWidth + width, halfCanvasHeight - h);
			ctx.lineTo(halfCanvasWidth + width / 2, 0);
			ctx.lineTo(halfCanvasWidth + width / 2, halfCanvasHeight - h / 2);
			ctx.closePath();
			ctx.fillStyle = "rgb(0, 0, 0)";
			ctx.fill();
		}*/
	}
};
