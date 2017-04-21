function shuffle(o){ //v1.0
    for(var j, x, i = o.length; i; j = Math.floor(Math.random() * i), x = o[--i], o[i] = o[j], o[j] = x);
    return o;
};

var QuestPlayer = Class.create();
QuestPlayer.prototype = {
  initialize: function(stage,visitorChamber,textInfo,textChooser)
  {
    this.stage = stage;
    this.lang = "ru";
    this.visitorChamber = visitorChamber;
    this.textInfo = textInfo;
    this.textChooser = textChooser;
    this.previousWarings = false;
    this.runQuest(1);
    this.gameOvered = false;
    this.reportTurn = false;
    this.dayNum = 0;
    this.rndArray = new Array();
    for(var i=2;i<34;i++)
    {
       this.rndArray[i] = i;
    }
    this.rndArray = shuffle( this.rndArray);
    this.rndArray.pop();

  },
  runQuest:function(name){
    var self = this;
    new Ajax.Request("quests/"+name+'.txt', {
        method:'get',
        onSuccess: function(transport){
           self.json = transport.responseText.evalJSON();
           self.onLoaded();
         }
      });
  },
  onLoaded: function() {
    this.visitorChamber.hideAll();
    console.log(this.json);

    this.q = this.json[0];
    this.q_text = 0;
    if(this.reportTurn)
      this.formatReport();
    else
    {
      this.dayNum++;
      MyKingdom.nextDay();
    }
    this.showVisitor();
  },
  formatReport:function()
  {
    this.q.texts[this.q_text]["text_"+this.lang] = this.q.texts[this.q_text]["text_"+this.lang].replace('%T', this.dayNum);
    this.q.texts[this.q_text]["text_"+this.lang] = this.q.texts[this.q_text]["text_"+this.lang].replace('%M', MyKingdom.getDelta("money"));
    this.q.texts[this.q_text]["text_"+this.lang] = this.q.texts[this.q_text]["text_"+this.lang].replace('%P', MyKingdom.getDelta("peasant"));
    this.q.texts[this.q_text]["text_"+this.lang] = this.q.texts[this.q_text]["text_"+this.lang].replace('%N', MyKingdom.getDelta("nobility"));
    this.q.texts[this.q_text]["text_"+this.lang] = this.q.texts[this.q_text]["text_"+this.lang].replace('%U', MyKingdom.getDelta("un"));
    this.q.texts[this.q_text]["text_"+this.lang] = this.q.texts[this.q_text]["text_"+this.lang].replace('%D', MyKingdom.getDelta("dragon"));
    this.q.texts[this.q_text]["text_"+this.lang] = this.q.texts[this.q_text]["text_"+this.lang].replace('%L', MyKingdom.getDelta("merlin"));
  },
  showVisitor:function()
  {
    var self = this;
    var text = this.q.texts[this.q_text]["text_"+this.lang];
    this.visitorChamber.addVisitor(
      this.q.texts[this.q_text].presenter,
      text,function(){self.next();});

    this.textInfo.setText(text);
    this.textChooser.hideAll();
    var reply = "Next";
    if(this.q.texts[this.q_text]["shortreply_"+this.lang])
    {
      reply  = this.q.texts[this.q_text]["shortreply_"+this.lang];
    }
    if(this.isOnLastText() && this.q.replies.length > 0)
    {
      var funct = function(num){self.playerChoise(num);};
      for(var i=0;i<this.q.replies.length;i++)
      {
         if(this.isReplyOk(this.q.replies[i]))
            this.textChooser.setText(i,this.q.replies[i]["text_"+this.lang],funct);
          else
            this.textChooser.setText(i,this.q.replies[i]["text_"+this.lang],null);
      }
    }
    else
    {
      this.textChooser.setText(0,reply,function(num){self.next();});
    }
  },
  isReplyOk:function(reply)
  {
    var i = 0;
    //for(var i=0;i<KingdomParams.length;i++)
    {
      if(reply[KingdomParams[i]] &&reply[KingdomParams[i]] < 0)
      {
        if(  Math.abs(reply[KingdomParams[i]]) > MyKingdom.getP(KingdomParams[i]) )
          return false;
      }
    }
    return  true;
  },
  playerChoise:function(num)
  {
    for(var i=0;i<KingdomParams.length;i++)
    {
        if(this.q.replies[num][KingdomParams[i]] && this.q.replies[num][KingdomParams[i]] != 0)
        {
          MyKingdom.addP(KingdomParams[i],this.q.replies[num][KingdomParams[i]]);
        }
    }
    if(this.q.replies[num].goto)
    {
      for(var i=0;i<this.json.length;i++)
      {
        if(this.json[i].name == this.q.replies[num].goto)
        {
          this.q = this.json[i];
          this.q_text = 0;
          this.showVisitor();
          return;
        }
      }

    }
    else
    {

      this.turnEnd();
    }



  },
  turnEnd:function()
  {
    if(! this.reportTurn && this.previousWarings ==false)
    {
      this.reportTurn = true;
      this.previousWarings = false;
      this.runQuest("report");

      return;
    }
    else
      this.reportTurn = false;
    var gameOver = MyKingdom.gameOver();
    if(gameOver != null)
    {
      this.runQuest(gameOver);
      this.previousWarings = false;
      this.gameOvered = true;
      return;
    }
    var warring = MyKingdom.needWarring();
    if(warring != null && this.previousWarings == false)
    {
      this.previousWarings = true;
      this.runQuest(warring);
      return;
    }
    this.previousWarings = false;
     if(!this.lastRnd)
        this.lastRnd = 1;


      do
      {
        var rnd =  this.rndArray.pop();
      }while(typeof rnd === 'undefined' && this.rndArray.length != 0)
      if(typeof rnd === 'undefined' || !rnd)
      {
        this.gameOvered = true;
        this.runQuest("victory");
        return ;
      }
      this.lastRnd = rnd;
      this.runQuest(rnd);
  },
  isOnLastText:function()
  {
    if(this.q.texts.length -1 > this.q_text) return false;
    return true;
  },
  next:function()
  {
    if(this.gameOvered) return ;
    if(this.q.texts.length -1 > this.q_text)
    {
      this.q_text++;
      this.showVisitor();
      return;
    }
    this.turnEnd();

  }

};