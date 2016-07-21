var HelloWorldLayer = cc.Layer.extend({
    ctor:function () {
        this._super();
        //读取配置信息
        self=this;
        self.sprite_array=[];//精灵数组
        self.seg=0;//描述多边形的，线段顺序，当前要画的第几条线段
        self.drawNode_position=cc.p(xpoint[which_pic][0],ypoint[which_pic][0]);//当前的drawNode的位置
        var size=cc.winSize;
        get_ang_array(xpoint[which_pic],ypoint[which_pic]);
        cc.log(rota,"rota");
        //箭头
        create_sprite(res.arrow1,self.drawNode_position.x,self.drawNode_position.y,0.8,10,1);
        self.sprite_array[0].rotation=rota[self.seg];
        //下层图好的
        create_sprite(res["selected"+which_pic],size.width/2,size.height/2,0.6,0,1);
        //切换back按钮
        create_sprite(res.back,size.width/2,size.height/2,1,3,1);

        //画布与待擦除的部分
        var deft=new cc.Sprite(res["default"+which_pic]);
        deft.setPosition(size.width/2,size.height/2);
        deft.scale=0.6;
        this.draw_page=new cc.RenderTexture(size.width,size.height);
        this.draw_page.setPosition(size.width/2,size.height/2);
        this.draw_page.begin();
        deft.visit();
        this.draw_page.end();
        this.addChild(this.draw_page,3);
        //画笔
        this.pen=new cc.DrawNode();
        this.pen.retain();
        self.pen.drawCircle(cc.p(0,0), 25, 360, 99, 0, 50, cc.color(0,0,0,0));
        var blendfunc  = {src:1, dst: cc.ZERO};
        self.pen.setBlendFunc(blendfunc);
        //点击事件
        cc.eventManager.addListener({
            event: cc.EventListener.TOUCH_ONE_BY_ONE,
            onTouchBegan:function(touch){
                var location=touch.getLocation();
                cc.log(location);
                self.pen.setPosition(self.drawNode_position);
                self.sprite_array[0].setPosition(self.drawNode_position);
                self.draw_page.begin();
                self.pen.visit();
                self.draw_page.end();
                self.pen.setPosition(get_polly(xpoint[which_pic].length,xpoint[which_pic],ypoint[which_pic],location.x,location.y));
                self.pen.setLineWidth(100);
                self.draw_page.begin();
                self.pen.visit();
                self.draw_page.end();
                if(cc.rectContainsPoint(self.sprite_array[2].getBoundingBox(),location)){
                    which_pic++;
                    self.removeAllChildren();
                    cc.director.runScene(new StartScene());
                }
                return true;
            },
            onTouchMoved:function (touch) {
                var location=touch.getLocation();
                var setPo=get_polly(xpoint[which_pic].length,xpoint[which_pic],ypoint[which_pic],location.x,location.y);
                cc.log(setPo);
                self.pen.setPosition(setPo);
                self.sprite_array[0].setPosition(location);
                self.draw_page.begin();
                self.pen.visit();
                self.draw_page.end();
                return true;
            },
            onTouchEnded:function(){
                self.sprite_array[0].setPosition(self.drawNode_position);
                return true;
            }
        }, this);
        return true;

    }
});

var StartScene = cc.Scene.extend({
    onEnter:function () {
        this._super();
        var layer = new HelloWorldLayer();
        this.addChild(layer);
    }
});
