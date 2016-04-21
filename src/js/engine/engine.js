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
    this.stats = false;

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
            this.camera = new THREE.TargetCamera(
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

        // enable shadows
        if(Config.Shadows)
          this.renderer.shadowMapEnabled = true;

        // mouse movement
        //this.controls = new THREE.OrbitControls(this.camera, this.renderer.domElement);
        //if(Config.Isometric) this.controls.enableRotate = false;

        // sky
        this.CreateSky();

        // window resize
        THREEx.WindowResize(this.renderer, this.camera)

        // initialize stats
        if(Config.Stats)
            this.InitStats();

    		// other classes
    		this.Models = new Models();
    		this.Map = new Map();
    		this.Objects = new Objects();

        // start rendering
        this.Frame();

    }

    /**
     * Frame render function
     */
    this.Frame = function()
    {
        // reference to me
        var self = this;

        if(self.stats)
            self.stats.begin();

		    //this.Objects.PreMove();
        //this.Objects.TargetMove();
        this.camera.update();

        this.renderer.render(this.scene, this.camera);

        if(self.stats)
            self.stats.end();

        requestAnimationFrame(function() { self.Frame(); });
    }

    /**
     * Creates the sky and hemisphere light
     */
    this.CreateSky = function()
    {
        // create sky light
        this.sky.light = new THREE.HemisphereLight( 0xFFE8D0, 0xFFE8D0, 0.0035 );
        this.scene.add( this.sky.light );

        if(Config.Shadows) {
          var dirLight = new THREE.DirectionalLight( 0xffffff, 1 );
  				dirLight.color.setHSL( 0.1, 1, 0.95 );
  				dirLight.position.set( -1, 5, 1 );
  				dirLight.position.multiplyScalar( 50 );
  				this.scene.add( dirLight );
  				dirLight.castShadow = true;
  				dirLight.shadowMapWidth = 2048;
  				dirLight.shadowMapHeight = 2048;
        }

        // blue sky
        this.renderer.setClearColor(0x96CFEA,1);
    }

    /**
     * Initialize stats.js for debug information
     */
    this.InitStats = function() {

        // create fps counter
        this.stats = new Stats();
        this.stats.setMode( 0 );

        // align top-left
        this.stats.domElement.style.position = 'absolute';
        this.stats.domElement.style.right = '0px';
        this.stats.domElement.style.top = '0px';

        // show it
        document.body.appendChild( this.stats.domElement );
    }
}
