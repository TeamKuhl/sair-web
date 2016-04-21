// Inininininit

var Engine = new Engine();
var Client = new Client();
var Game = new Game();

Engine.Initialize();
Engine.Models.Load([
	{name:"plane",path:"vehicles/planes/cessna-152",loader:"collada"},
	{name:"fire",path:"vehicles/ground/feuerwehr",loader:"collada"},
	{name:"tanka",path:"vehicles/ground/tank-lkw",loader:"json"},
	{name:"trees",path:"landscape/trees",loader:"collada"},
	{name:"grass",path:"landscape/grass",loader:"collada"},
	{name:"grass-street",path:"landscape/grass-street",loader:"collada"},
	{name:"grass-curve",path:"landscape/grass-curve",loader:"collada"},
	{name:"grass-deadend",path:"landscape/grass-deadend",loader:"collada"},
	{name:"grass-intersection",path:"landscape/grass-intersection",loader:"collada"},
	{name:"grass-tintersection",path:"landscape/grass-tintersection",loader:"collada"},
	{name:"runway",path:"landscape/runway",loader:"collada"},
	{name:"runway-boundary",path:"landscape/runway-boundary",loader:"collada"},
	{name:"runway-boundary-edge",path:"landscape/runway-boundary-edge",loader:"collada"},
	{name:"runway-grass-street",path:"landscape/runway-grass-street",loader:"collada"},
],function(){
	$('#loader').fadeOut();


	Client.Initialize();
	Game.Initialize();

	//Engine.Objects.Add("tanka",{x:1.5,y:1,z:0},"tanka",1, {y:0.75});
	//Engine.Objects.Add("fire",{x:0,y:1,z:0},"fire",0.5, {y:0.75});
	//Engine.Objects.Add("plane",{x:-5,y:1,z:0},"plane",1);

},
function(mdl, info){
	var total = Math.round(mdl.loaded / mdl.total * 100);
	var percent = Math.round(info.loaded / info.total * 100);
	var loadtext = mdl.path+" ["+percent+"%]";
	$('#loadinfo').html(loadtext);
	$('#loadbar').css({width:total+"%"});
});
