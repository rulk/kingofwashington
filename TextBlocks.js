var TextInfo = Class.create();
TextInfo.prototype = {
  initialize: function(stage) {

    this.text = new PIXI.Text("Loading...", {font: "bold 16px Helvetica, Geneva, sans-serif", wordWrapWidth: 700,fill: "black", align: "left",wordWrap:"true"});
    //this.bg = PIXI.Sprite.fromFrame("bg_textInfo.png");

   // stage.addChild(this.bg);
    stage.addChild(this.text);
    this.text.position.x = 50;
    this.text.position.y = 280;
   // this.bg.position.x = 0;
   // this.bg.position.y = 270;

  },
  setText:function(text){
    this.text.setText(text);
  }
};
var TextChooser = Class.create();
TextChooser.prototype = {
  initialize: function(stage) {

    //this.text = new PIXI.Text("Привет!", {font: "25px Snippet", wordWrapWidth: 800,fill: "white", align: "center",wordWrap:"true"});
   // this.bg = PIXI.Sprite.fromFrame("bg_textOptions.png");
    this.bg =  new PIXI.DisplayObjectContainer();
    stage.addChild(this.bg);
    //stage.addChild(this.text);
    //this.text.position.x = 0;
    //this.text.position.y = 380;
    this.bg.position.x = 0;
    this.bg.position.y = 450;
    this.options = new Array();
    for(var i=0;i<5;i++)
    {
      this.options[i] = new TextOption(this.bg,i);
    }

  },
  hideAll:function()
  {
    for(var i=0;i<5;i++)
    {
      this.options[i].hide();
    }
  },
  setText:function(num,text,action){
   if(num >= 0 && num < this.options.length)
   {
     this.options[num].setText(text,action);
   }
   var y = this.options[0].text.position.y;
   for(var i=1;i<this.options.length;i++)
   {
     y+=  this.options[i-1].text.textHeight + 6;
     this.options[i].text.position.y = y;
   }
  }
};
var TextOption = Class.create();
TextOption.prototype = {
  initialize: function(chooser,num,action) {


    this.fill = "black";
    if(action == null)
      this.fill = "gray";

    this.tstyle = {font: "bold 14px Helvetica, Geneva, sans-serif", fill:this.fill, align: "left",wordWrapWidth: 780,wordWrap:"true"};
    this.text = new PIXI.Text("Привет!",this.tstyle );

    this.chooser = chooser;
    this.action = action;
    this.visible = false;
    this.text.position.x = 20;
    this.text.position.y = 14+22*num;
    this.num = num;
    var self = this;
    this.text.setInteractive(true);
          this.text.click = this.text.tap = function(data){
            self.clicked(data);
          };
          this.text.mouseover = function(data){
            self.mouseover(data);
          };
          this.text.mouseout = function(data){
            self.mouseout(data);
          };
  },
  mouseout:function(data)
  {
    this.text.setStyle(this.tstyle);
  },
  mouseover:function(data)
  {
    if(this.action != null)
    {
       var stl = Object.clone(this.tstyle);
       stl.fill = "#ffcc00";
       this.text.setStyle(stl);
    }
  },
  clicked:function(data)
  {
    if(this.action != null)
    {
       createjs.Sound.play("CLICK");
      this.action(this.num);
    }
  },
  hide:function()
  {
    if(this.visible)
      this.chooser.removeChild(this.text);
    this.visible  =false;
  },
  setText:function(text,action){
    this.fill = "black";
    if(action == null)
      this.fill = "gray";
    this.tstyle.fill = this.fill;
   // this.setStyle(this.tstyle);
    if( !this.visible)
      this.chooser.addChild(this.text);
    this.text.setText(text);
    this.text.updateText();
    this.action = action;
    this.visible = true;
  }
};