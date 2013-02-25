
var Playwright = {

	id: -1,

	// Initialize
	initialize: function(){
		window.addEventListener("message",function(event){

			var callerID = event.data.id;
			var command = event.data.command;
			var params = event.data.params;

			switch(command){

				// Input
				case "emit":
					var target = _apps[callerID];
					target = target ? target : Playwright;
					target.emit( params.event, params.message );
					break;

				case "initialize":
					Playwright.id = params.id;
					Playwright.parent = event.source;
					break;

			}

		},false);
	},

	// Apps
	open: function(src,options){
		var app = new App(src,options);
		return app;
	},

	// Tell parent
	tellParent: function(event,message){
		Playwright.parent.postMessage({
			id: Playwright.id,
			command: "emit",
			params: { event:event, message:message }
		},"*");
	}

};
window.addEventListener("load",function(){
	Playwright.initialize();
},false);

//////

var _UID = 0;
var _apps = {};
var App = function(src,options){

	// App registered
	var app = new EventEmitter();
	var id = _UID++;
	_apps[id] = app;
	
	// Source
	var iframe = document.createElement("iframe");
	iframe.onload = function(){
		app.exec( "initialize", { id:id, options:options||{} } );
	};
	iframe.style.display = "none";
	iframe.src = src;
	document.body.appendChild(iframe);
	app.iframe = iframe;

	// App post command
	app.exec = function(command,params){
		iframe.contentWindow.postMessage({
			id: -1,
			command: command,
			params: params
		},"*");
		return app;
	};

	// Data I/O;
	app.input = function(data){
		app.exec("emit",{ event:"input", message:data });
		return app;
	};
	app.edit = function(data,callback){
		app.input(data).once("output",callback);
		return app;
	};

	// UI helpers
	app.popup = function(){
		Mixin({
			
			width:"100%", height:"100%",
			display: "block",

			position:"fixed",
			top:0, left:0,

			border:0
			
		},iframe.style);
		return app;
	};
	app.close = function(){
		Mixin({ display:"none" },iframe.style);
		return app;
	};

	// Return
	return app;

};
// TODO: Prototype

/**
Mixin
**/
var Mixin = function(src,dest){
	for(var key in src){
		dest[key] = src[key];
	}
};


/**
EventEmitter - Make any js object an event emitter
**/

var EventEmitter = function(){};
EventEmitter.prototype = {
	
	on: function(event, fn){
		this._events = this._events || {};
		this._events[event] = this._events[event] || [];
		this._events[event].push(fn);
		return this;
	},
	
	once: function(event, fn){
		var me = this;
		me.on(event,function wrapper(){
			me.off(event,wrapper);
			fn.apply(this,arguments);
		});
		return this;
	},

	off: function(event, fn){
		
		this._events = this._events || {};
		if(!this._events[event]) return;
		var handlers = this._events[event];
		var index = handlers.indexOf(fn);
		if(index<0) return;

		handlers.splice(index, 1);

		return this;

	},

	emit: function(event /* , args... */){

		this._events = this._events || {};

		if(!this._events[event]) return;
		var handlers = this._events[event];
		var args = Array.prototype.slice.call(arguments, 1);

		for(var i=0; i<handlers.length; i++){
			handlers[i].apply(this,args);
		}

		return this;

	}

};

Mixin(EventEmitter.prototype,Playwright);
