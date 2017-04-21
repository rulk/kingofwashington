//var element = document.querySelector("#greeting");
//element.innerText = "Hello, world!";
// create an new instance of a pixi stage with a grey background
var stage = new PIXI.Stage(0x888888,true);
// create a renderer instance width=640 height=480
var renderer = PIXI.autoDetectRenderer(800,600);
var tileAtlas = ["atlas.json"];
// create a new loader
var loader = new PIXI.AssetLoader(tileAtlas);
// create an empty container
var gameContainer = new PIXI.DisplayObjectContainer();
// add the container to the stage
stage.addChild(gameContainer);
// add the renderer view element to the DOM
 document.querySelector("#game").appendChild(renderer.view);
// use callback
loader.onComplete = onTilesLoaded
//begin load
loader.load();
var visitorChamber  = null;
var textInfo = null;
var textChooser = null;
function onTilesLoaded()
{
  MyKingdom = new Kingdom(stage);
  visitorChamber = new VisitChamber(stage);

  textInfo = new TextInfo(stage);
  textChooser = new TextChooser(stage);
  //textChooser.hideAll();
  //textChooser.setText(0,"Param one",null);
  //textChooser.setText(1,"Param two",null);
  //textChooser.setText(2,"Param three",null);
   MyKingdom.createProgresses();
  requestAnimFrame(animate);
  var questPlayer = new QuestPlayer(stage,visitorChamber,textInfo,textChooser);
}
var lastTime = Date.now(),
    timeSinceLastFrame = 0;
function animate()
{
  var now = Date.now();
  timeSinceLastFrame = parseFloat(now - lastTime)/1000.0;
  lastTime = now;


  visitorChamber.frame(timeSinceLastFrame);
  requestAnimFrame(animate);
  renderer.render(stage);
}
function loadSound()
{
  createjs.Sound.addEventListener("fileload", handleLoadComplete);
  createjs.Sound.registerSound("bg-music.ogg", "BGMUSIC");
  createjs.Sound.registerSound("click.ogg", "CLICK");
}
function handleLoadComplete(event) {
    createjs.Sound.play("BGMUSIC",{loop:-1});
}
var muted = false;
function mute()
{
  if(!muted)
  {
   createjs.Sound.setVolume(0.0);
   muted = true;
   $('soundMute').addClassName('soundMuteOFF');
  }
   else
   {
   createjs.Sound.setVolume(1.0);
   muted = false;
   $('soundMute').removeClassName('soundMuteOFF');
   }
}