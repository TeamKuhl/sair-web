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
	this.onConnect = false;
	this.onMapchange = false;
	
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
		
		console.info("SAIRCLIENT: INCOMING ["+objMessage.type+"]");
		
		// switch type, select event
		switch(objMessage.type) {
			case "mapchange":
				eventCallback = Client.onMapchange;
				break;
			default:
				console.error("Message Type '" + objMessage.type + "' not found.");
				console.info(event.data);
				break;
		}
		
		// call event
		if(eventCallback)
			eventCallback(objMessage);
	}
	
	/**
	 * Send an object as json
	 */
	this.Send = function(data){
		this.socket.send(data);
	}
	
}