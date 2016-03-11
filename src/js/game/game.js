/**
 * Sair Game
 * Game class
 *
 * written by Matthias Neid
 **/

function Game()
{
    // DEFINITION
    this.clientuuid = false;
    this.current = false;

    /**
     * Initializes the GAME
     */
    this.Initialize = function()
    {
      // listen to events
  		Client.Bind("mapchange", this.Mapchange);
      Client.Bind("objectchange", this.Objectchange);
      Client.Bind("objectdelete", this.Objectdelete);
      Client.Bind("clientuuid", this.Clientuuid);
  		Client.socket.onopen = this.Connected;
    }

	/**
	 * Mapchange
	 */
	this.Mapchange = function(message) {
		message.map.forEach(function(e){
			Engine.Map.Set(e.x,e.y,e.z,e.name,e.rotation);
		});
	}

  this.Clientuuid = function(message) {
		Game.clientuuid = message.uuid;

    Game.current = { movement: {z:0},
                    rotation: {y:0}};

    $(document).keydown(function(e){
      switch(e.which) {
        case 87: // w
          Game.current.movement.z = 0.10;
          break;
        case 83: // s
          Game.current.movement.z = -0.10;
          break;
        case 65: // a
          Game.current.rotation.y = +0.015;
          break;
        case 68: // d
          Game.current.rotation.y = -0.015;
          break;
      }
    });

    $(document).keyup(function(e){
      switch(e.which) {
        case 87: // w
          Game.current.movement.z = 0;
          break;
        case 83: // s
          Game.current.movement.z = 0;
          break;
        case 65: // a
          Game.current.rotation.y = 0;
          break;
        case 68: // d
          Game.current.rotation.y = 0;
          break;
      }
    });

    setInterval(Game.Movement, 50);
	}

  this.Movement = function() {

    if(Game.current.movement.z != 0 || Game.current.rotation.y != 0) {
      Engine.Objects.ChangeRotation(Game.clientuuid, Game.current.rotation);
      Engine.Objects.Move(Game.clientuuid, Game.current.movement);

      var clientobject = Engine.Objects.Get(Game.clientuuid);
      Client.Send({
        type: "setobject",
        position: Engine.Objects.GetPosition(Game.clientuuid),
        rotation: Engine.Objects.GetRotation(Game.clientuuid),
        model: clientobject.model.name
      });
    }
  }

  this.Objectchange = function(message) {
    message.objects.forEach(function(e){
      if(Engine.Objects.Exists(e.uuid)) {
        Engine.Objects.SetPosition(e.uuid, e.position);
        Engine.Objects.SetRotation(e.uuid, e.rotation);
      }
      else {
        if(Engine.Models.Exists(e.model))
          Engine.Objects.Add(e.uuid, e.position, e.model, 1, e.rotation);
      }
    });
  }

  this.Objectdelete = function(message) {
    message.objects.forEach(function(e){
      Engine.Objects.Destroy(e.uuid);
    });
  }

	/**
	 * Connect
	 */
	this.Connected = function() {

	}
}
