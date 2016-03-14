/**
 * Sair Socket Client
 * Client class
 *
 * written by Matthias Neid
 **/

function Client() {

	// private socket
	this.socket = false;

	// events
	this.events = {};

	/**
	 * Initialize the client and connect to the server
	 */
	this.Initialize = function() {
		this.socket = new WebSocket(ClientConfig.URL);
		this.socket.onmessage = this.Listener;
	}

	/**
	 * Listener callback, handles incoming messages
	 */
	this.Listener = function(event) {

		// parse data
		var objMessage = JSON.parse(event.data);
		var eventCallback = false;

		// debugging
		// console.info("SAIRCLIENT: INCOMING ["+objMessage.type+"]");
		// console.info(objMessage);

		// callback available?
		if(Client.events[objMessage.t] != undefined)
			 Client.events[objMessage.t].forEach(function(callback) {
				// call callback
				if(callback)
					callback(objMessage);
			});
	}

	/**
	 * Bind to an event
	 */
	this.Bind = function(type, callback) {
		// create array for event
		if(this.events[type] == undefined)
			this.events[type] = [];

		// add to event array
		this.events[type].push(callback);
	}

	/**
	 * Send an object as json
	 */
	this.Send = function(data){
		//console.info("SAIRCLIENT: SENDING ["+data.type+"]");
		//console.info(JSON.stringify(data));
		this.socket.send(JSON.stringify(data));
	}

}
