/**
 * Sair Game
 * Game class
 *
 * written by Matthias Neid
 **/

function Game()
{
    // DEFINITION
    
    /**
     * Initializes the GAME
     */
    this.Initialize = function()
    {
		Client.onMapchange = this.Mapchange;
		Client.socket.onopen = this.Connected;
    }
	
	/**
	 * Mapchange
	 */
	this.Mapchange = function(message) {
		console.log(message);
		message.map.forEach(function(e){
			Engine.Map.Set(e.x,e.y,e.z,e.name,e.rotation);
		});
	}
	
	/**
	 * Connect
	 */
	this.Connected = function() {
		Client.Send("map");
	}
}