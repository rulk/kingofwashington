var KingdomParams = ["money","peasant","nobility","merlin","un","dragon"];
var Kingdom = Class.create();
Kingdom.prototype = {
  initialize: function(stage) {
    this.p  = new Array();
    this.vis = new Array();
    this.stage = stage;
    this.pDelta  = new Array();
    this.nextDay();
  },
  getDelta:function(p)
  {
    if(this.pDelta[p] > 0)
      return "+"+this.pDelta[p]
    return  this.pDelta[p];
  },
  nextDay:function()
  {
    for(var i=0;i<KingdomParams.length;i++)
    {
      this.pDelta[KingdomParams[i]] = 0;
    }
  },
  createProgresses:function()
  {
    for(var i=0;i<KingdomParams.length;i++)
    {
      this.p[KingdomParams[i]] = 0;
      var x =  30+ (800/KingdomParams.length)*i;
      if( i == 0)
      {
        this.vis[KingdomParams[i]] = new PIXI.Text(this.getP(KingdomParams[i]), {font: "18px Tahoma, Geneva, sans-serif", fill: "white", align: "left"});
        this.stage.addChild(this.vis[KingdomParams[i]]);
        this.vis[KingdomParams[i]].position.x = x+40;
        var micon = new PIXI.Sprite.fromFrame("top-gold.png");
        this.stage.addChild(micon);
        micon.position.x = 15;
        micon.position.y = -(micon.height - 46)/2;
        this.vis[KingdomParams[i]].y = -(this.vis[KingdomParams[i]].height - 46)/2;
      }
      else
      {
        this.vis[KingdomParams[i]] = new Slider(this.stage,100,KingdomParams[i],x);
      }
     // this.vis[KingdomParams[i]].position.y = 500;

    }
    this.setP("money",1000);
    this.setP("nobility",60);
    this.setP("merlin",60);
    this.setP("peasant",50);
    this.setP("un",40);
    this.setP("dragon",40);
    //this.updateText();
  },
  updateText:function()
  {
     for(var i=0;i<KingdomParams.length;i++)
    {
      if(i==0)
        this.vis[KingdomParams[i]].setText(this.getP(KingdomParams[i]));
      else
      {
         this.vis[KingdomParams[i]].adjust(this.getP(KingdomParams[i]));
      }
    }
  },
  getP: function(name) {
    return this.p[name];
  },
  setP:function(name,arg){
    this.p[name] = arg;
    this.updateText();
  },
  addP:function(name,arg){
    this.p[name] += arg;
    this.updateText();
    this.pDelta[name] = arg;
  },
  needWarring:function()
  {
    for(var i=1;i<KingdomParams.length;i++)
    {
      if(this.p[KingdomParams[i]]< 20)
      {
        return KingdomParams[i]+"_warning";
      }
    }
    return null;
  },
  gameOver:function()
  {
    for(var i=1;i<KingdomParams.length;i++)
    {
      if(this.p[KingdomParams[i]] <= 0)
      {
        return KingdomParams[i];
      }
    }
    return null;
  }
};

var MyKingdom = null;

var Slider = Class.create();
Slider.prototype = {
  initialize: function(stage,max,name,x)
  {
    this.stage = stage;
    this.max = max;

    this.container = new PIXI.DisplayObjectContainer();
    this.container.position.x = x;
    this.container.position.y = 5;
    this.sliderSprite = new PIXI.Sprite.fromFrame("top-slider.png");
    this.sliderAvatar =  new PIXI.Sprite.fromFrame("top-"+name+".png");
    this.sliderAvatar.anchor.x = 0.5;
    this.sliderAvatar.anchor.y = 0.0;
    this.sliderAvatar.position.y = -(this.sliderAvatar.height - 36)/2;
    this.sliderSprite.position.y = -(this.sliderSprite.height - 36)/2;
    this.container.addChild(this.sliderSprite);
    this.container.addChild(this.sliderAvatar);
    this.stage = stage;
    this.stage.addChild(this.container);

  },
  adjust:function(value)
  {
    var p = parseFloat(value)/parseFloat(this.max);
    p = Math.min(p,1.0);
    p = Math.max(p,0.0);
    this.sliderAvatar.position.x = p*this.sliderSprite.width;
  }
};
