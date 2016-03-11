// Inininininit

var Engine = new Engine();
var Client = new Client();
var Game = new Game();

Engine.Initialize();
Engine.Models.Load([
	{name:"plane",path:"vehicles/planes/cessna-152"},
	{name:"fire",path:"vehicles/ground/feuerwehr"},
	{name:"tanka",path:"vehicles/ground/tank-lkw"},
	{name:"grass",path:"landscape/grass"},
	{name:"grass-street",path:"landscape/grass-street"},
	{name:"grass-curve",path:"landscape/grass-curve"},
	{name:"grass-deadend",path:"landscape/grass-deadend"},
	{name:"grass-intersection",path:"landscape/grass-intersection"},
	{name:"grass-tintersection",path:"landscape/grass-tintersection"},
	{name:"runway",path:"landscape/runway"},
	{name:"runway-boundary",path:"landscape/runway-boundary"},
	{name:"runway-boundary-edge",path:"landscape/runway-boundary-edge"},
	{name:"runway-grass-street",path:"landscape/runway-grass-street"},
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
