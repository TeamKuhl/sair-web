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
		
		if(rotation != undefined)
			this.SetRotation(name, rotation);
        
        // add model to scene
        Engine.scene.add(model);
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
    
}