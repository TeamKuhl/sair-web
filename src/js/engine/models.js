/**
 * THREE.js Engine
 * Models
 *
 * written by Matthias Neid
 **/

function Models()
{
    // DEFINITION
    this.models = {};
    this.pendingModels = {};
	  this.loader = new THREE.ColladaLoader();

	/**
	 * Get a model
	 */
	 this.Get = function(model) {
		return this.models[model].clone();
	 }

 	/**
 	 * Check if an model exists with the given name
 	 */
 	this.Exists = function(name) {
 			return (this.models[name] != undefined);
 	}

    /**
     * Loads multiple models
     */
    this.Load = function(models, callback, loadcallback)
    {
        this.pendingModels = models;
        this.loadModelTotal = models.length;
        this.currentModel = 0;
        this.LoadNextModel(callback, loadcallback);
    }

    /**
     * Loads the next pending model
     */
    this.LoadNextModel = function(callback, loadcallback)
    {
        var self = this;
        this.currentModel++;

        // exit and call callback if done
        if(this.pendingModels.length == 0)
        {
            callback();
            return true;
        }

        // get first model
        var mdl = this.pendingModels[0];

        // load model and call this function again
        this.loader.load(
            'src/objects/'+mdl.path+'.dae',
            function(collada) {
                // enable shadows
                if(Config.Shadows)
                  self.EnableShadows(collada.scene);

                // save model
                self.models[mdl.name] = collada.scene;
                self.models[mdl.name].name = mdl.name;

                // delete from
                self.pendingModels.shift();

                // load the next model
                self.LoadNextModel(callback, loadcallback);
            },
            function(info) {

                // call callback for loading info
                if(typeof(loadcallback) == "function")
                    mdl.loaded = self.currentModel;
                    mdl.total = self.loadModelTotal;
                    loadcallback(mdl, info);
            }
        );
    }

	/**
     * Get the size of a model
     */
    this.GetSize = function(model)
    {
        var box = new THREE.Box3().setFromObject( model );
        return box.size();
    }

    /**
     * Enable shadows
     */
    this.EnableShadows = function(model) {
      model.castShadow = true;
      model.receiveShadow = true;

      if(model.children.length > 0) {
        for(var i in model.children) {
          this.EnableShadows(model.children[i]);
        }
      }
    }
}
