/**
 * THREE.js Engine
 * Objects
 *
 * written by Matthias Neid
 **/

function Objects()
{
    // DEFINITION
	this.objects = {};

	/**
	 * Add an object
	 */
	this.Add = function(name, position, model, size, rotation)
	{
    // get model
    var model = Engine.Models.Get(model);

        // add model to objects
		this.objects[name] = {};
        this.objects[name].model = model;

        // set model size, position & rotation
		if(size != undefined)
			this.SetSize(name, size);

		if(position != undefined)
			this.SetPosition(name, position);

		if(rotation != undefined) // O
			this.SetRotation(name, rotation);

		// initialize movment
		this.objects[name].movement = {
				position: {x: 0, y: 0, z: 0},
				rotation: {x: 0, y: 0, z: 0}
		};

		// save last
		this.UpdateLast(name);

		// add model to scene
		Engine.scene.add(model);
	}

	/**
	 * Check if an object exists with the given name
	 */
	this.Exists = function(name) {
			return (this.objects[name] != undefined);
	}

	/**
	 * Get an object
	 */
	this.Get = function(name) {
			return this.objects[name];
	}

	/**
	 * Save the last position
	 */
	this.UpdateLast = function(name) {
			this.objects[name].last = {
				position: this.GetPosition(name),
				rotation: this.GetRotation(name),
				time: Date.now()
			};

			this.objects[name].movetime = Date.now();
	}

	/**
	 * Calculate new movement
	 */
	this.CalcMovement = function(name) {
		// get new position
		var npos = this.GetPosition(name);
		var nrot = this.GetRotation(name);

		// get old position
		var opos = this.objects[name].last.position;
		var orot = this.objects[name].last.rotation;

		// get time difference
		var timediff = Date.now() - this.objects[name].last.time;

		if(timediff <= 0)
			return true;

		// calculate movement
		this.objects[name].movement = {
				position: {
					x: (npos.x - opos.x) / timediff,
					y: (npos.y - opos.y) / timediff,
					z: (npos.z - opos.z) / timediff,
				},
				rotation: {
					x: (nrot.x - orot.x) / timediff,
					y: (nrot.y - orot.y) / timediff,
					z: (nrot.z - orot.z) / timediff,
				}
		};
	}

	/**
	 * Move all objects in the precalculated direction
	 */
	this.PreMove = function() {
		var self = this;

		for(var name in this.objects) {
			var obj = self.objects[name];
			var timediff = Date.now() - obj.movetime;

			if(timediff > 50) {
				self.ChangePosition(name, {
					x: obj.movement.position.x * timediff,
					y: obj.movement.position.y * timediff,
					z: obj.movement.position.z * timediff,
				});

				self.ChangeRotation(name, {
					x: obj.movement.rotation.x * timediff,
					y: obj.movement.rotation.y * timediff,
					z: obj.movement.rotation.z * timediff,
				});

				self.objects[name].movetime = Date.now();
			}
		}
	}

	/**
	 * Get an object position
	 */
	this.GetPosition = function(name) {
			return {
				x: RoundPosition(this.objects[name].model.position.x / (Config.Size * (1+Config.Spacing))),
				y: RoundPosition(this.objects[name].model.position.y * 2 / (Config.Size * (1+Config.Spacing))),
				z: RoundPosition(this.objects[name].model.position.z / (Config.Size * (1+Config.Spacing))),
			};
	}

	/**
	 * Get an object rotaion
	 */
	this.GetRotation = function(name) {
			return {
				x: (this.objects[name].model.rotation.x / (Math.PI * 2)),
				y: (this.objects[name].model.rotation.y / (Math.PI * 2)),
				z: (this.objects[name].model.rotation.z / (Math.PI * 2)),
			};
	}

	/**
	 * Destroy an object
	 */
	this.Destroy = function(name) {
			Engine.scene.remove(this.objects[name].model);
			delete this.objects[name];
	}

	/**
	 * Set the size of an object
	 */
	this.SetSize = function(name, size) {

		// default size
		if(size == undefined)
			size = 1;

        // calculate size and factor
        var modelSize = Engine.Models.GetSize(this.objects[name].model);
		var length = modelSize.x;
		if(modelSize.z > length);
			length = modelSize.z;
        var factor = Config.Size / length * size;

		// scale model
		this.objects[name].model.scale.x *= factor;
		this.objects[name].model.scale.y *= factor;
		this.objects[name].model.scale.z *= factor;
	}

	/**
	 * Set the target of an object
	 */
	this.SetTarget = function(name, target) {
			var pos = this.GetPosition(name);
			var rot = this.GetRotation(name);

			this.objects[name].target = {
				position: {
					x: (target.position.x == undefined) ? pos.x : target.position.x,
					y: (target.position.y == undefined) ? pos.y : target.position.y,
					z: (target.position.z == undefined) ? pos.z : target.position.z,
				},
				rotation: {
					x: (target.rotation.x == undefined) ? rot.x : target.rotation.x,
					y: (target.rotation.y == undefined) ? rot.y : target.rotation.y,
					z: (target.rotation.z == undefined) ? rot.z : target.rotation.z,
				}
			};
			this.objects[name].targettime = Date.now() + 100;
			this.objects[name].movetime = Date.now();
	}

	/**
	 * Set the target of an object
	 */
	this.TargetMove = function() {
		var self = this;

		for(var name in this.objects) {
			var obj = self.objects[name];
			var timeleft = obj.targettime - Date.now();
			var timediff = Date.now() - obj.movetime;

			var vector = new THREE.Vector3 (
				obj.model.position.x - obj.target.position.x,
				obj.model.position.y - obj.target.position.y,
				obj.model.position.z - obj.target.position.z
			);

			vector.setLength(vector.length() / (timediff / (timeleft + timediff)));

			self.ChangePosition(name, {
				x: vector.x,
				y: vector.y,
				z: vector.z,
			});

/*
			self.ChangeRotation(name, {
				x: obj.movement.rotation.x * timediff,
				y: obj.movement.rotation.y * timediff,
				z: obj.movement.rotation.z * timediff,
			}); */
		}
	}

	/**
	 * Set the position of an object
	 */
	this.SetPosition = function(name, position) {
		if(position.x != undefined && position.x != false)
			this.objects[name].model.position.x = (position.x * Config.Size) * (1+Config.Spacing);
		if(position.y != undefined && position.y != false)
			this.objects[name].model.position.y = (position.y * Config.Size) * (1+Config.Spacing) / 2;
		if(position.z != undefined && position.z != false)
			this.objects[name].model.position.z = (position.z * Config.Size) * (1+Config.Spacing);
	}

	/**
	 * Change the position of an object
	 */
	this.ChangePosition = function(name, position) {
		if(position.x != undefined && position.x != false)
			this.objects[name].model.position.x += (position.x * Config.Size) * (1+Config.Spacing);
		if(position.y != undefined && position.y != false)
			this.objects[name].model.position.y += (position.y * Config.Size) * (1+Config.Spacing) / 2;
		if(position.z != undefined && position.z != false)
			this.objects[name].model.position.z += (position.z * Config.Size) * (1+Config.Spacing);
	}

	/**
	 * Set the rotation of an object
	 */
	this.SetRotation = function(name, rotation) {
		if(rotation.x != undefined && rotation.x != false)
			this.objects[name].model.rotation.x = rotation.x * Math.PI * 2;
		if(rotation.y != undefined && rotation.y != false)
			this.objects[name].model.rotation.y = rotation.y * Math.PI * 2;
		if(rotation.z != undefined && rotation.z != false)
			this.objects[name].model.rotation.z = rotation.z * Math.PI * 2;
	}

	/**
	 * Change the rotation of an object
	 */
	this.ChangeRotation = function(name, rotation) {
		if(rotation.x != undefined && rotation.x != false)
			this.objects[name].model.rotation.x += rotation.x * Math.PI * 2;
		if(rotation.y != undefined && rotation.y != false)
			this.objects[name].model.rotation.y += rotation.y * Math.PI * 2;
		if(rotation.z != undefined && rotation.z != false)
			this.objects[name].model.rotation.z += rotation.z * Math.PI * 2;
	}

	/**
	 * Move an object using the Three.JS translate function
	 */
	this.Move = function(name, movement) {
		if(movement.x != undefined && movement.x != false)
			this.objects[name].model.translateX(movement.x * Config.Size);
		if(movement.y != undefined && movement.y != false)
			this.objects[name].model.translateY(movement.y * Config.Size);
		if(movement.z != undefined && movement.z != false)
			this.objects[name].model.translateZ(movement.z * Config.Size);
	}

}
