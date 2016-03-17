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
    this.targetSet = false;
    this.Speed = 1;

    /**
     * Initializes the GAME
     */
    this.Initialize = function()
    {
      // listen to events
  		Client.Bind(ONMAPCHANGE, this.Mapchange);
      Client.Bind(ONOBJECTHANGE, this.Objectchange);
      Client.Bind(ONOBJECTDELETE, this.Objectdelete);
      Client.Bind(ONCLIENTUUID, this.Clientuuid);
  		Client.socket.onopen = this.Connected;
    }

	/**
	 * Mapchange
	 */
	this.Mapchange = function(message) {
		message.o.forEach(function(e){
			Engine.Map.Set(e.p,e.m,e.r);
		});
	}

  this.Clientuuid = function(message) {
		Game.clientuuid = message.u;

    Game.current = { movement: {z:0},
                    rotation: {y:0}};

    Game.lastPosition = {x:1, y:1, z:1};
    Game.lastRotation = {x:0, y:0, z:0};

    $(document).keydown(function(e){
      switch(e.which) {
        case 87: // w
          Game.current.movement.z = 0.10 * Game.Speed;
          break;
        case 83: // s
          Game.current.movement.z = -0.10 * Game.Speed;
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
    //if(Game.current.movement.z != 0 || Game.current.rotation.y != 0) {
      Engine.Objects.ChangeRotation(Game.clientuuid, Game.current.rotation);
      Engine.Objects.Move(Game.clientuuid, Game.current.movement);

  	  Engine.Objects.CalcMovement(Game.clientuuid);
  	  Engine.Objects.UpdateLast(Game.clientuuid);

      var clientobject = Engine.Objects.Get(Game.clientuuid);
      var message = {
        t: SETOBJECT,
      };

      var pos = Game.GetPositionChange(Engine.Objects.GetPosition(Game.clientuuid));
      var rot = Game.GetRotationChange(Engine.Objects.GetRotation(Game.clientuuid));

      if(pos)
        message.p = pos;

      if(rot)
        message.r = rot;

      Client.Send(message);

      if(!Game.targetSet) {
          Engine.camera.addTarget({
              name: 'me',
              targetObject: Engine.Objects.objects[Game.clientuuid].model,
              cameraPosition: new THREE.Vector3(0, 2, 4),
              cameraRotation: new THREE.Euler( 0.2, Math.PI, 0, 'XYZ' ),
              fixed: false,
              stiffness: 1,
              matchRotation: true
          });

          Engine.camera.setTarget('me');

          Game.targetSet = true;
      }
    //}
  }

  this.Objectchange = function(message) {
    message.o.forEach(function(e){
      if(Engine.Objects.Exists(e.u)) {
      	if(e.p != undefined)
        	Engine.Objects.SetPosition(e.u, e.p);

        if(e.r != undefined)
        	Engine.Objects.SetRotation(e.u, e.r);

		Engine.Objects.CalcMovement(e.u);
		Engine.Objects.UpdateLast(e.u);
      }
      else {
        if(Engine.Models.Exists(e.m))
          Engine.Objects.Add(e.u, e.p, e.m, 1, e.r);
      }
    });
  }

  this.Objectdelete = function(message) {
    message.o.forEach(function(e){
      Engine.Objects.Destroy(e.u);
    });
  }

  this.GetPositionChange = function(position) {
    var change = {};
    if(position.x != this.lastPosition.x)
      change.x = position.x;
    if(position.y != this.lastPosition.y)
      change.y = position.y;
    if(position.z != this.lastPosition.z)
      change.z = position.z;

    this.lastPosition = position;
    if($.isEmptyObject(change))
      return false;
    else
      return change;
  }

  this.GetRotationChange = function(rotation) {
    var change = {};
    if(rotation.x != this.lastRotation.x)
      change.x = rotation.x;
    if(rotation.y != this.lastRotation.y)
      change.y = rotation.y;
    if(rotation.z != this.lastRotation.z)
      change.z = rotation.z;

    this.lastRotation = rotation;
    if($.isEmptyObject(change))
      return false;
    else
      return change;
  }

	/**
	 * Connect
	 */
	this.Connected = function() {

	}
}
