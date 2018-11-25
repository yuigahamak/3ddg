function indexOf(ary, val){
	for (var i = 0; i < ary.length; i++) {
		if (ary[i] == val) {
			return i;
		}
	}
	return -1;
}

(function(){

var oso = window.oso = function( selector, filter ){
	return new oso.fn.init( selector, filter );
};

oso.persons = {};

oso.fn = oso.prototype = {
	version: "0.1.0",
	init: function( selector, filter ) {
		if(selector == null) return this;
		if( typeof selector == "object"){
			this.person = selector;
			return this;
		} 
		if(selector == "*" || selector == "owner_friends" || selector == "viewer_friends" || selector == "has_app" || selector == "both_friends"){
			this.id = "*";
			var persons = [];
			for(var id in oso.persons){
				if (filter && oso.persons[id].profile[filter] != "true") continue;
				if (selector != "*" && oso.persons[id].profile[selector] != "true") continue;
				persons.push(oso.persons[id]);
			}
			this.person = persons;
			return this;
		}
		this.id = selector == "owner" ? oso.ownerId :
			selector == "viewer" ? oso.viewerId :
			selector;
		if (oso.persons[this.id]) {
			this.person = oso.persons[this.id];
		}else{
			this.person = null;
		}
		return this;
	},
	exist: function(){
		return this.person ? true : false;
	},
	size: function() {
		return this.id == "*" ? this.person.length : 1;
	},
	random: function(size){
		var ids = [];
		size = Math.min(size,this.person.length);
		while (ids.length < size) {
			var rnd = Math.floor(Math.random() * this.person.length);
			var id = this.person[rnd].profile["id"];
			if(indexOf(ids,id) < 0)
				ids.push(id);
		}
		return ids;
	},
	each: function(callback){
		for (var i in this.person) {
			callback.call(this.person[i]);
		}
	},
	profile: function( key ) {
		if(this.id == "*"){
			var values = [];
			for(var id in this.person){
				values[id] = this.person[id].profile[key];
			}
			return values;
		}
		if(key == "*"){
			return this.person.profile;
		}
		return this.person.profile[key];
	},
	data: function( key, value, callback ){
		if((value || value == "") && this.id != oso.viewerId) return false;
		if(value == "") {
			oso.removeData(key, function(r){
				if(r){
					if(key == "*"){
						for(key_ in this.data)
							delete(this.data[key_]);
					}else delete(this.data[key]);
				}
				callback.call(this, r);
			});
		}
		if(this.id == "*"){
			var values = [];
			for(var id in this.person){
				if(key = "*"){
					values[id] = this.person[id].data;
				}else{
					values[id] = this.person[id].data[key];
				}
			}
			return values;
		}
		if(key == "*"){
			return this.person.data;
		}
		if (value) {
			oso.addData(key, value, function(r){
				if (r) {
					if (!this.data) 
						this.data = [];
					this.data[key] = value;
				}
				callback.call(this, r);
			});
		}
		else {
			value = this.person.data ? this.person.data[key] : undefined;
			return value || undefined;
		}
	},
	mem: function( key, value ){
		if(this.id == "*"){
			var values = [];
			for(var id in this.person){
				if(key = "*"){
					values[id] = this.person[id].mem;
				}else{
					values[id] = this.person[id].mem[key];
				}
			}
			return values;
		}
		if(key == "*"){
			return this.person.mem;
		}
		if (value) {
			if (!this.person.mem) 
				this.person.mem = [];
			this.person.mem[key] = value;
		}
		else {
			value = this.person.mem ? this.person.mem[key] : undefined;
			return value || undefined;
		}
	},
	view: function(viewName){
		var view = gadgets.views.getSupportedViews()[viewName];
		gadgets.views.requestNavigateTo(view, null, this.id);
	}
};
oso.fn.init.prototype = oso.fn;

oso.fieldList = {
	url : null,//opensocial.Person.Field.PROFILE_URL,
	address : null,//opensocial.Person.Field.ADDRESSES,
	age : null,//opensocial.Person.Field.AGE,
	birthday : null,//opensocial.Person.Field.DATE_OF_BIRTH,
	gender : null,//opensocial.Person.Field.GENDER,
	has_app : null,//opensocial.Person.Field.HAS_APP,
	blood_type : null,//mixi.PersonField.BLOOD_TYPE
};

oso.requestFields = function(list){
	if(!list) return;
	var fields = new Array;
	for(var i = 0; i < list.length; i++){
		fields.push(oso.fieldList[list[i]]); 
	}
	return fields;
};

oso.fetchData = function(id, key, callback){
	var req = opensocial.newDataRequest();
	req.add(req.newFetchPersonAppDataRequest(id, key), "response");
	req.send(function(data){
		r = data.hadError() ? false : true;
		data = data.get("response").getData();
		callback.call(null, data, r);
	});
};

oso.addData = function(key, value, callback){
	var req = opensocial.newDataRequest();
	req.add(req.newUpdatePersonAppDataRequest(oso.viewerId, key, value), "response");
	req.send(function(data){
		if (data.hadError()) {
			r = false;
		}
		else {
			var response = data.get("response");
			r = response.hadError() ? r = false : true;
		}
		callback.call(oso.persons[oso.viewerId],r);
	});
};

oso.removeData = function(key, callback){
	key = typeof(key) == "object" ? key : [key];
	var req = opensocial.newDataRequest();
	req.add(req.newRemovePersonAppDataRequest(oso.viewerId, key), "response");
	req.send(function(data){
		r = data.hadError() ? false : true;
		callback.call(oso.persons[oso.viewerId],r);
	});
};

oso.adjustHeight = function(){
	gadgets.window.adjustHeight();
};

oso.activity = function(title,priority,callback){
	var params = {};
	params[opensocial.Activity.Field.TITLE] = title;
	var activity = opensocial.newActivity(params);
	opensocial.requestCreateActivity(activity, opensocial.CreateActivityPriority[priority], function(response){
		var r = response.hadError() ? false : true;
		callback.call(null,r);
	});
};

oso.shareApp = function(callback){
	opensocial.requestShareApp("VIEWER_FRIENDS", null, function(response){
		var recipientIds = response.getData()["recipientIds"];
		callback.call(null, recipientIds);
	});
};

oso.request = function(params,callback){
	var reqParams = {};
	reqParams[mixi.Request.Field.FILTER_TYPE] = mixi.Request.FilterType[params.join];
	reqParams[mixi.Request.Field.URL] = params.url;
	reqParams[mixi.Request.Field.BODY] = params.text;
	if(params.desc){
		reqParams[mixi.Request.Field.DESCRIPTION] = params.desc;		
	}
	opensocial.requestShareApp("VIEWER_FRIENDS", null, function(response){
		var recipientIds = response.getData()["recipientIds"];
		if(typeof(callback) == 'function')
			callback.call(null, recipientIds);
	},reqParams);	
};

oso.ajax = function(reqParam, callback){
	callback.call({}, true);
	return null;
	var params = {};
	if(reqParam.method)
		params[gadgets.io.RequestParameters.METHOD] = gadgets.io.MethodType[reqParam.method];
	if(reqParam.content_type)
		params[gadgets.io.RequestParameters.CONTENT_TYPE] = gadgets.io.ContentType[reqParam.content_type];
	if(reqParam.num_entries)
		params[gadgets.io.RequestParameters.NUM_ENTRIES] = reqParam.num_entries;
	if(reqParam.post_data)
		params[gadgets.io.RequestParameters.POST_DATA] = gadgets.io.encodeValues(reqParam.post_data);
	var auth = reqParam.auth_type ? reqParam.auth_type : "NONE";
	params[gadgets.io.RequestParameters.AUTHORIZATION] = gadgets.io.AuthorizationType[auth];
	gadgets.io.makeRequest(reqParam.url, function(response){
		if(response.errors[0]){
			callback.call(response,false);
		}else{
			callback.call(response.data,true);
		}
	}, params);
};

oso.init = function(callback){
	//oso.getPersons(callback);
};

oso.getPersons = function(callback){

	function makeSpec(name){
		return null;
		if (name == "owner")
			return opensocial.IdSpec.PersonId.OWNER;
		else if (name == "viewer")
			return opensocial.IdSpec.PersonId.VIEWER;
		else {
			var params = {};
			if (name == "owner_friends")
				params[opensocial.IdSpec.Field.USER_ID] = opensocial.IdSpec.PersonId.OWNER;
			else
				params[opensocial.IdSpec.Field.USER_ID] = opensocial.IdSpec.PersonId.VIEWER;
			params[opensocial.IdSpec.Field.GROUP_ID] = "FRIENDS";
			return opensocial.newIdSpec(params);
		}
	}
	
	function makeParams(reqParam){
		return null;
		var params = {};
		if ((reqParam.name == "owner" || reqParam.name == "viewer") && oso.reqParam.profile) {
			params[opensocial.DataRequest.PeopleRequestFields.PROFILE_DETAILS] = oso.requestFields(oso.reqParam.profile);
		}
		else {
			params[opensocial.DataRequest.PeopleRequestFields.MAX] = reqParam.max || 4;
			params[opensocial.DataRequest.PeopleRequestFields.FIRST] = reqParam.first || 0;
			if (reqParam.has_app)
				params[opensocial.DataRequest.PeopleRequestFields.FILTER] = opensocial.DataRequest.FilterType.HAS_APP;
		}
		return params;
	}

	if (reqParam = oso.reqParam.persons.shift()) { //配列が空になるまで再帰的に実行する
		if (oso.ownerId && oso.viewerId && oso.ownerId == oso.viewerId && (reqParam.name == "owner" || reqParam.name == "viewer")) {
			//ownerIdとviewerIDが等しい場合はどっちかだけリクエスト
			oso.getPersons(callback);
			return;
		}
		if (oso.ownerId && oso.viewerId && oso.ownerId == oso.viewerId && (reqParam.name == "owner_friends" || reqParam.name == "viewer_friends")) {
			//ownerIdとviewerIDが等しい場合はfriendsのリクエストは1回だけ
			if(oso.reqParam.friends){
				oso.getPersons(callback);
				return;
			}
			oso.reqParam.friends = true;
		}
	}
	else { //配列の中身が空だったら（全てのリクエストを処理したら）コールバック関数を実行し終了。
		callback.call(null, true);
		return;
	}
	var idSpec = makeSpec(reqParam.name);
	var params = makeParams(reqParam);
	var req = opensocial.newDataRequest();
	req.add(req.newFetchPeopleRequest(idSpec, params), "persons");
	req.send(function(data){

		function fetch(person,attr){
			id = person.getId();
			oso.persons[id] = oso.persons[id] || {};
			oso.persons[id].profile = oso.persons[id].profile || {};
			oso.persons[id].data = oso.persons[id].data || {};
			if(person.isOwner()){
				oso.ownerId = id;
				oso.persons[id].profile["is_owner"] = person.isOwner();
			}
			if(person.isViewer()){
				oso.viewerId = id;
				oso.persons[id].profile["is_viewer"] = person.isViewer();
			}
			oso.persons[id].profile["id"] = id;
			oso.persons[id].profile["name"] = person.getDisplayName();
			oso.persons[id].profile["has_app"] = person.getField(opensocial.Person.Field.HAS_APP);
			oso.persons[id].profile[attr] = "true";
			if(thumb = person.getField(opensocial.Person.Field.THUMBNAIL_URL));
			else return;
			oso.persons[id].profile["thumb"] = thumb;
			oso.persons[id].profile["mini"] =
				thumb == "http://img.mixi.jp/img/basic/common/noimage_member76.gif"
				? thumb.replace(/76/, '40')
				: thumb.replace(/s.jpg$/, 'm.jpg');
			if(oso.ownerId == oso.viewerId && id != oso.ownerId){
				oso.persons[id].profile["viewer_friends"] = "true";
				oso.persons[id].profile["owner_friends"] = "true";
			}
			if (oso.persons[id].profile["viewer_friends"] && oso.persons[id].profile["owner_friends"]) {
				oso.persons[id].profile["both_friends"] = "true";
			}
			if (attr == "owner" || attr == "viewer") {
				var list = oso.reqParam.profile || new Array;
				for (var i = 0; i < list.length; i++) {
					if (list[i] == 'gender') {
						oso.persons[id].profile[list[i]] = person.getField(oso.fieldList[list[i]]).getKey();
					}
					else {
						oso.persons[id].profile[list[i]] = person.getField(oso.fieldList[list[i]]);
					}
				}
			}
		}

		if (data.hadError()) {
			callback.call(null, false);
		}
		else {
			var persons = data.get("persons").getData();
			if (typeof(persons.size) == "function") {
				persons.each(function(person){
					fetch(person,reqParam.name);
				});
			}
			else fetch(persons,reqParam.name);
			if (reqParam.data) {
				oso.fetchData(idSpec, reqParam.data, function(data, r){
					if (r) {
						for (var id in data) {
							oso.persons[id].data = oso.persons[id].data || {};
							if (reqParam.data == "*") 
								oso.persons[id].data = data[id];
							else {
								for (var key in data[id]) {
									oso.persons[id].data[key] = data[id][key];
								}
							}
						}
						oso.getPersons(callback);
					}
					else {
						oso.getPersons(callback);
					//	callback.call(null, false);
					}
				});
			}
			else {
				oso.getPersons(callback);
			}
		}
	});
};

})();
