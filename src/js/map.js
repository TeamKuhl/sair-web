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
    this.Set  = function(x,y,z,model,rotation)
    {
        // get model
        var model = Engine.Models.Get(model);
        
        // calculate size and factor
        var size = Engine.Models.GetSize(model);
        var factor = Config.Size / size.x;
        
        // scale model
        model.scale.x *= factor;
        model.scale.y *= factor;
        model.scale.z *= factor;
        
        // check if rotation is set
        if(rotation != undefined)
            model.rotation.y = rotation * Math.PI * 2;
        
        // set model position
        model.position.x = (x * Config.Size) * (1+Config.Spacing);
        model.position.y = (y * Config.Size) * (1+Config.Spacing);
        model.position.z = (z * Config.Size) * (1+Config.Spacing);
        
        // add model to map
        this.Check(x, y, z);
        if(this.map[x][y][z].model != undefined)
            Engine.scene.remove(this.map[x][y][z].model);
        
        this.map[x][y][z].model = model;
        
        // add model to scene
        Engine.scene.add(model);
    }
    
    /**
     * Checks a map position and creates it in map object if necessary
     */
    this.Check = function(x,y,z) {
        if(!(x in this.map))
            this.map[x] = {};
        
        if(!(y in this.map[x]))
            this.map[x][y] = {};
        
        if(!(z in this.map[x][y]))
            this.map[x][y][z] = {};
    }   
}