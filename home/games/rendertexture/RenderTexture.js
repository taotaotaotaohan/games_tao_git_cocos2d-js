var HelloWorldLayer_render = homebacklayer.extend({
    sprite:null,
    pEraser:null,
    pRTex:null,
    particle_array:[],
    ctor:function () {
        this._super();
        self=this;
        this.sprite_array=[];//精灵数组
        //场景配置，读取配置信息，5/30
        this.config_info=json_parse(config_render);
        //cc.log(this.config_info);
        var size = cc.winSize;
        //场景配置，背景
        self.create_render(self.config_info.background,self.config_info.background_scale,size.width/2,size.height/2,0);
        //场景配置，橡皮擦的外形
        self.create_render(self.config_info.erase_tool[0].res,self.config_info.erase_tool[0].scale,self.config_info.erase_tool[0].pos_x,self.config_info.erase_tool[0].pos_y,2);
        //橡皮擦画笔设置
        this.pEraser = new cc.DrawNode();
        this.pEraser.drawCircle(cc.p(0,0), 35, 360, 28, 0, 30, cc.color(0,0,0,0));
        this.pEraser.retain();
        //场景配置，画布
        this.pRTex = new cc.RenderTexture(size.width,size.height);
        this.pRTex.setPosition(size.width/2, size.height/2);
        this.addChild(this.pRTex);
        //场景配置，dirty pic
        this.pBg =new cc.Sprite(this.config_info.erase_layer[0].res);
        this.pBg.x=this.config_info.erase_layer[0].pos_x;
        this.pBg.y=this.config_info.erase_layer[0].pos_y;
        this.pBg.scale=this.config_info.erase_layer[0].scale;
        this.pRTex.begin();
        this.pBg.visit();
        this.pRTex.end();
        cc.log("here");
        self.particle_count=0;//粒子数目
        //增加事件监听器
        //设置哨兵，判断是否擦除完毕
        self.count=0;//达到哨兵的数目
        cc.eventManager.addListener({
            event: cc.EventListener.TOUCH_ONE_BY_ONE,
            onTouchBegan:function(touch, event){
                var target = event.getCurrentTarget();
                var location=touch.getLocation();
                cc.log(location,"testtest");
                self.base_location=location;//新基点坐标，用于判断是否新建粒子
                if(cc.rectContainsPoint(self.sprite_array[1].getBoundingBox(), location)) {
                    self.sprite_array[1].setPosition(location.x,location.y);
                }
                self.tag=0;
                return true;
            },
            onTouchMoved:function (touch, event) {
                var target = event.getCurrentTarget();
                var location = touch.getLocation();
                if (cc.rectContainsPoint(self.sprite_array[1].getBoundingBox(), location)) {
                    self.sprite_array[1].setPosition(location.x, location.y);
                    self.pEraser.setPosition(touch.getLocation());
                    self.eraseByBlend();
                    //超过一定范围，新建粒子，达到跟踪效果，避免每个像素新建粒子
                    var dis = location.x - self.base_location.x;
                    if (dis > 50 || dis < -50) {
                            self.particle_array[self.particle_count] = new cc.ParticleSystem(self.config_info.erase_tool[0].animation_click);
                            self.particle_array[self.particle_count].setPosition(location.x, location.y);
                            self.addChild(self.particle_array[self.particle_count]);
                            self.particle_array[self.particle_count].duration = 5;
                            self.particle_count++;
                            self.base_location = location;
                    }
                    self.count=self.guard_judge(location,self.count);
                    //cc.log(self.count);
                    if(self.count==4 && self.tag<1){//判断擦除完毕
                        //cc.log("ok");
                        self.pRTex.setVisible(false);
                        cc.audioEngine.playEffect(res_render.great, false);
                        self.tag++;
                        self.removeAllChildren();
                        self.config_info.guard=self.guard_clear(self.config_info.guard);
                        cc.director.pushScene(new StartScene_render());
                    }
                }
            },
            onTouchEnded:function(touch,event){
                return true;
            }
        }, this);
        return true;
    },
    //创建精灵的函数1111
    create_render:function(res,scl,x,y,z){
        var sprite=new cc.Sprite(res);
        sprite.setPosition(x,y);
        sprite.scale=parseFloat(scl);
        self.addChild(sprite,z);
        self.sprite_array.push(sprite);
        return true;
    },
    //擦除函数test
    eraseByBlend :function() {
        var blendfunc  = {src: cc.ONE, dst: cc.ZERO};
        this.pEraser.setBlendFunc(blendfunc);
        this.pRTex.begin();
        this.pEraser.visit();
        this.pRTex.end();
    },
    //判断是否达到目标点
    guard_judge:function(location,count){
        for(var i=0;i<self.config_info.guard.length;i++){
            if((location.x-self.config_info.guard[i].location[0]<30 && location.x-self.config_info.guard[i].location[0]>-30)&&(self.config_info.guard[i].tag!=1)){
                if((location.y-self.config_info.guard[i].location[1]<30 && location.y-self.config_info.guard[i].location[1]>-30)&&(self.config_info.guard[i].tag!=1)) {
                    self.config_info.guard[i].tag = 1;
                    count++;
                }
            }
        }
        return count;
    },
    //刷新，清除哨兵影响
    guard_clear:function(guard){
        for(var i=0;i<self.config_info.guard.length;i++){
            self.config_info.guard[i].tag=0;
        }
        return self.config_info.guard;
    }
});

var StartScene_render = cc.Scene.extend({
    onEnter:function () {
        this._super();
        var layer = new HelloWorldLayer_render();
        this.addChild(layer);

    }
});
