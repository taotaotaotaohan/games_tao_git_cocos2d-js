var StartLayer = cc.Layer.extend({
    ctor:function () {
        this._super();
        //读取配置信息
        self=this;
        self.size=cc.winSize;
        self.sprite_array_start=[];//开始页面精灵数组
        create_sprite(res.start_bg,self.size.width/2,self.size.height/2-10,0.6,0,2);
        create_sprite(res.bg_mask,self.size.width/2,self.size.height/2,1,1,2);
        create_sprite(res.start_bg1,self.size.width/2,self.size.height/2-10,0.4,2,2);
        create_sprite(res.left,260,120,0.5,1.5,2);
        create_sprite(res.right,self.size.width-260,120,0.5,1.5,2);
        create_sprite(res.start,self.size.width/2,170,0.5,3,2);
        create_sprite(res.no_name,430,430,0.4,4,2);
        create_sprite(res.no_name1,430,430,0.4,3,2);
        create_sprite(res.dot2,400,280,0.8,6,2);
        create_sprite(res.dot1,400,280,0.8,5,2);
        create_sprite(res.effect1,400,280,0.7,4,2);
        self.sprite_array_start[self.sprite_array_start.length-1].runAction(cc.sequence(cc.rotateBy(5,360)).repeatForever());
        create_sprite(res.effect2,400,280,0.7,4,2);
        self.sprite_array_start[self.sprite_array_start.length-1].runAction(cc.sequence(cc.rotateBy(10,360)).repeatForever());
        create_sprite(res.effect3,400,280,0.7,4,2);
        self.sprite_array_start[self.sprite_array_start.length-1].runAction(cc.sequence(cc.rotateBy(15,360)).repeatForever());
        create_text("形状跟踪",700,450,35,0);
        create_text("绘制并且命名多种常见形状",700,400,25,1);
        create_text("1",400,280,25,1);
        create_sprite(res.dot1,580,280,0.8,6,2);
        create_text("2",580,280,25,1);
        create_sprite(res.success,580,310,1,6,2);
        create_sprite(res.success,400,310,1,6,2);
        //点击事件
        cc.eventManager.addListener({
            event: cc.EventListener.TOUCH_ONE_BY_ONE,
            onTouchBegan:function(touch){
                var location=touch.getLocation();
                if(cc.rectContainsPoint(self.sprite_array_start[5].getBoundingBox(),location)){
                    var current=cc.director.getRunningScene();
                    current.removeAllChildren();
                    cc.director.runScene(new StartScene());
                }
                return true;
            }
        }, this);
        return true;
    }
});
var StartScene_begin = cc.Scene.extend({
    onEnter:function () {
        this._super();
        var layer = new StartLayer();
        this.addChild(layer);
    }
});
