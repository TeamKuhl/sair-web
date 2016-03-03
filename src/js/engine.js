/**
 * THREE.js Engine
 * 
 * written by Matthias Neid
 **/

function Engine()
{
    // DEFINITION
    this.sky = {};
	this.objects = {};
	
	this.Models = {};
	this.Map = {};
    
    /**
     * Initializes THREE.js and set up the scene
     */
    this.Initialize = function()
    {
        // set up scene and camera
        this.scene = new THREE.Scene();
        if(Config.Isometric)
        {
            var d = 20;
            this.camera = new THREE.OrthographicCamera( - d * Config.AspectRatio, d * Config.AspectRatio, d, - d, 1, 1000 );

            this.camera.position.set( 13, 13, 13 );
            this.camera.lookAt( this.scene.position );
        }
        else
        {
            this.camera = new THREE.PerspectiveCamera( 
                Config.FieldOfView,
                Config.AspectRatio,
                Config.PaneNear,
                Config.PaneFar
            );
            
            this.camera.position.z = 10;
            this.camera.position.y = 3;
        }    
        
        
        
        // set up renderer
        this.renderer = new THREE.WebGLRenderer({antialias: Config.AntiAlias});
        this.renderer.setSize(Config.Width, Config.Height);
        document.body.appendChild(this.renderer.domElement);
        
        // mouse movement
        this.controls = new THREE.OrbitControls(this.camera, this.renderer.domElement);
        if(Config.Isometric) this.controls.enableRotate = false;
        
        // sky
        this.CreateSky();
        
        // start rendering
        this.Frame();
		
		// other classes
		this.Models = new Models();
		this.Map = new Map();
		this.Objects = new Objects();
    }
    
    /**
     * Frame render function
     */
    this.Frame = function()
    {
        var self = this;
        requestAnimationFrame(function() { self.Frame(); });
        this.renderer.render(this.scene, this.camera);
    }
    
    /**
     * Creates the sky and hemisphere light
     */ 
    this.CreateSky = function()
    {
        // create sky light
        this.sky.light = new THREE.HemisphereLight( 0xffffbb, 0x080820, 1 );
        this.scene.add( this.sky.light );
        
        // blue sky
        this.renderer.setClearColor(0x96CFEA,1);
    }    
}