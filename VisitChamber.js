var VisitChamber = Class.create();
VisitChamber.prototype = {
  initialize: function(stage) {


    this.bg = PIXI.Sprite.fromFrame("bg.png");
    stage.addChild(this.bg);

    this.visitors = new Array();
    this.bubleKing = null;
    this.bubleVisitor = null;
    this.stage = stage;
    this.paperVisitor = null;
    //this.visitors[0] = new Visitor(stage,"merlin.png",true,1);
    //this.visitors[1] = new Visitor(stage,"un.png",false,1);
  },
  hideAll:function()
  {
    for(var i=0;i<this.visitors.length;i++)
    {
      this.visitors[i].unlink();
    }
     this.visitors.length = 0;
     this.hidePaper();
  },
  hidePaper:function()
  {
    if(this.paperVisitor)
    {
      this.paperVisitor.unlink();
      this.paperVisitor = null;
    }
  },
  addVisitor: function(presenter,text,action)
  {
    if(presenter == "paper" || presenter == "report")
    {
      this.paperVisitor = new PaperVisitor(stage,presenter);
      for(var i=0;i<this.visitors.length;i++)
      {
        this.visitors[i].sielentNow();
      }
    }
    else
    {
      this.hidePaper();
      var left = ((this.visitors.length % 2) == 0);
      var pos = (this.visitors.length >= 2);
      var needToAdd = true;
      for(var i=0;i<this.visitors.length;i++)
      {
        if(this.visitors[i].spriteName ==presenter+".png" )
        {
          this.visitors[i].speaksNow();
          needToAdd = false;
        }
        else
        {
          this.visitors[i].sielentNow();
        }
      }
      if(needToAdd)
        this.visitors[this.visitors.length] = new Visitor(this.stage,presenter+".png",left,pos,text,action);
    }

  },
  frame: function(time) {
    for(var i=0;i<this.visitors.length;i++)
    {
      this.visitors[i].frame(time);
    }
    if(this.paperVisitor)this.paperVisitor.frame(time);

  }

};
var VisitorBuble = Class.create();
VisitorBuble.prototype = {
  initialize: function(stage,left,visitorSprite,text,spriteName,action) {
          this.buble = new PIXI.Sprite.fromFrame(spriteName);
          this.action = action;
          this.spriteName = visitorSprite;
          this.stage = stage;
          this.visible = true;
          if(left)
          {
            this.buble.position.y = visitorSprite.position.y - this.buble.height + 17;
            this.buble.position.x = visitorSprite.position.x + visitorSprite.width/2;
          }
          else
          {
           this.buble.position.y = visitorSprite.position.y- this.buble.height + 17;
           this.buble.position.x = visitorSprite.position.x + visitorSprite.width/2;

          }
          stage.addChild(this.buble);
          /*var textSample = new PIXI.Text(text, {font: "25px Snippet", wordWrapWidth: 200,fill: "white", align: "center",wordWrap:"true"});
          textSample.anchor.x = 0.5;
          textSample.anchor.y = 0.5;
          if(left)
            textSample.position.x = this.buble.width/2;
          else
          {
            textSample.position.x = -this.buble.width/2;
            textSample.scale.x = -1;
          }

          textSample.position.y = -this.buble.height/2;
          this.buble.addChild(textSample);
          var self= this;
          this.buble.setInteractive(true);
          this.buble.click = this.buble.tap = function(data){
            self.clicked(data);
          };*/
  },
  setVisible:function(vbl)
  {
    if(vbl == false && this.visible == true)
      this.stage.removeChild(this.buble);
    if(vbl == true && this.visible == false)
    {
       this.stage.addChild(this.buble);
    }
    this.visible = vbl;
  },
  clicked: function(data) {
     this.action();
  },
  unlink:function()
  {
    if(this.visible)
      this.stage.removeChild(this.buble);
  }

};
var PaperVisitor = Class.create();
PaperVisitor.prototype = {
  initialize: function(stage,spriteName) {
    this.sprite = PIXI.Sprite.fromFrame(spriteName+".png");
    stage.addChild( this.sprite);
    this.stage = stage;
    this.sprite.anchor.x = 0.5;
    this.sprite.anchor.y = 0.5;
    this.sprite.scale.x = 0.1;
    this.sprite.scale.y = 0.1;
    this.sprite.position.x = 400;
    this.sprite.position.y = 200;
  },
  frame:function(time){
    if(this.sprite.scale.x < 1.0)
    {
      this.sprite.rotation += 30.1*time;
      this.sprite.scale.x += 2.1*time;
      this.sprite.scale.y += 2.1*time;
    }
    else
       this.sprite.rotation = 0;
  },
  unlink:function(){
    this.stage.removeChild(this.sprite);
  }
};

var Visitor = Class.create();
Visitor.prototype = {
  initialize: function(stage,frameName, left,place,text,action) {


    this.sprite = PIXI.Sprite.fromFrame(frameName);
    stage.addChild(this.sprite);
    this.action = action;
    this.stage = stage;
    this.spriteName = frameName;
    if(left)
    {
      this.sprite.anchor.x = 0.0;
      this.sprite.anchor.y = 1.0;
      this.sprite.position.x = 20;
      this.sprite.position.y = 260;
      if(place)
      {
        this.sprite.position.x +=this.sprite.width + 20;
      }
    }
    else
    {
      this.sprite.anchor.x = 0.0;
      this.sprite.anchor.y = 1.0;
      this.sprite.position.x = 800-20;
      this.sprite.position.y = 260;
      this.sprite.scale.x = -1;
      if(place)
      {
        this.sprite.position.x +=this.sprite.width -20;
      }
    }
    this.state = "walking";
    this.buble = new VisitorBuble(stage,left,this.sprite,text,"speech-indicator.png",action);

  },
  unlink:function()
  {
    this.stage.removeChild(this.sprite);
    this.buble.unlink();
  },
  clicked:function(data){
    alert("hi!");
  },
  speaksNow:function()
  {
     this.buble.setVisible(true);
  },
  sielentNow:function()
  {
    this.buble.setVisible(false);
  },
  frame: function(time) {
    switch(this.state)
    {
      case "walking":

        break;
      case "waits":


        break;
      default:
        break;
    }
  }

};