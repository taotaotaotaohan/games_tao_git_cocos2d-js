var HelloWorldLayer_move = homebacklayer.extend({
    ctor:function () {
        this._super();
        //读取配置信息
        var config_info=json_parse(config_move_and_draw);
        var size = cc.winSize;
        self=this;
        self.sprite_array=[];//不包含即将被擦除的精灵
        self.sprite_array_visit=[];//即将擦除的精灵，用visit方式放到画布上
        //场景配置，背景
        create_draw(config_info.background_img,parseInt(config_info.back_gound_scale),size.width/2,size.height/2,0,1);
        //纹理上面的精灵（等待擦除）
        for(var i=0;i<config_info.images.length;i++){
            create_draw(config_info.images[i].res,config_info.images[i].scale,config_info.images[i].x,config_info.images[i].y,3,2);
        }
        //纹理下面层的精灵（不被擦除）
        for(i in config_info.images){
            create_draw(config_info.images[i].res,config_info.images[i].scale,config_info.images[i].x,config_info.images[i].y,1,1);
        }
        var count=self.sprite_array.length;//普通的无动作事物的个数
        //等待显示的图片,配置文件中的drawlayerf,支持多个draw layer
        for(i in config_info.draw_layer){
            create_draw(config_info.draw_layer[i].res,config_info.draw_layer[i].scale,config_info.draw_layer[i].pos_x,config_info.draw_layer[i].pos_y,2,1);
        }
        //布置透明画布
        this.draw_page=new cc.RenderTexture(size.width,size.height);
        this.draw_page.setPosition(size.width/2,size.height/2);
        this.addChild(this.draw_page,3);
        this.draw_page.begin();
        for(i in self.sprite_array_visit){
            self.sprite_array_visit[i].visit();
        }
        this.draw_page.end();
        //布置画笔，现在暂且只支持一个画笔
        this.pen=new cc.DrawNode();
        this.pen.drawCircle(cc.p(0,0), 35, 360, 28, 0, 35, cc.color(0,0,0,0));
        this.pen.retain();
        self=this;
        //布置画笔形状
        this.pen_shape=new cc.Sprite(config_info.draw_tool[0].res);
        this.pen_shape.setPosition(config_info.draw_tool[0].pos_x,config_info.draw_tool[0].pos_y);
        this.pen_shape.scale=config_info.draw_tool[0].scale;
        this.pen_shape.setOpacity(0);
        this.pen_shape.runAction(cc.fadeIn(1));
        this.addChild(this.pen_shape,4);
        //设置事件监听
        cc.eventManager.addListener({
            event: cc.EventListener.TOUCH_ONE_BY_ONE,
            onTouchBegan:function(touch, event){
                var target = event.getCurrentTarget();
                var location=touch.getLocation();
                self.pen_shape.setPosition(location.x,location.y);
                return true;
            },
            onTouchMoved:function (touch, event) {
                var target = event.getCurrentTarget();
                var location = touch.getLocation();
                var blendfunc  = {src:cc.ONE, dst: cc.ZERO};
                self.pen.setPosition(location.x,location.y);
                self.pen_shape.setPosition(location.x,location.y);
                self.eraseByBlend();
                return true;
            },
            onTouchEnded:function(touch,event){
                return true;
            }
        }, this);

        return true;

    },
    eraseByBlend :function() {
        var blendfunc  = {src:1, dst: cc.ZERO};
        self.pen.setBlendFunc(blendfunc);
        self.draw_page.begin();
        self.pen.visit();
        self.draw_page.end();
    }

});

var StartScene_move_and_draw = cc.Scene.extend({
    onEnter:function () {
        this._super();
        var layer = new HelloWorldLayer_move();
        this.addChild(layer);
    }
});
