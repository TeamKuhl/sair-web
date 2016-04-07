/**
 * THREE.js Engine
 * Map
 *
 * written by Matthias Neid
 **/

function Map()
{
    // DEFINITION
    this.map = {};

    /**
     * Set a model to a tile
     */
    this.Set  = function(position,model,rotation)
    {
        // get model
        var model = Engine.Models.Get(model);

        // calculate size and factor
        var modelSize = Engine.Models.GetSize(model);
    		var length = modelSize.x;
    		if(modelSize.z > length);
    			length = modelSize.z;
        var factor = Config.Size / length;

        // scale model
        model.scale.x *= factor;
        model.scale.y *= factor;
        model.scale.z *= factor;

        // check if rotation is set
        if(rotation != undefined)
            model.rotation.y = rotation.y * Math.PI * 2;

        // set model position
        model.position.x = (position.x * Config.Size) * (1+Config.Spacing);
        model.position.y = (position.y * Config.Size) * (1+Config.Spacing) / 2;
        model.position.z = (position.z * Config.Size) * (1+Config.Spacing);

        // add model to map
        this.Check(position);
        if(this.map[position.x][position.y][position.z].model != undefined)
            this.group.remove(this.map[position.x][position.y][position.z].model);

        this.map[position.x][position.y][position.z].model = model;

        // create group
        if(this.group == undefined) {
          this.group = new THREE.Object3D();
          Engine.scene.add(this.group);
        }

        // add model to scene
        this.group.add(model);
    }

    /**
     * Checks a map position and creates it in map object if necessary
     */
    this.Check = function(position) {
        if(!(position.x in this.map))
            this.map[position.x] = {};

        if(!(position.y in this.map[position.x]))
            this.map[position.x][position.y] = {};

        if(!(position.z in this.map[position.x][position.y]))
            this.map[position.x][position.y][position.z] = {};
    }
}
