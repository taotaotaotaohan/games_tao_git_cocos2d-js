//*created by tao 5/25*//

var HelloWorldLayer1 = homebacklayer.extend({
    ctor: function () {
        this._super();
        var size=cc.winSize;
        self=this;
        self.sprite_array=[];
        //
        //创建精灵的函数
        //
        var create=function(res,scl,x,y,z){
            var sprite=new cc.Sprite(res);
            sprite.setPosition(x,y);
            scl=scl>0?scl:1;
            sprite.scale=scl;
            self.sprite_array.push(sprite);
            self.addChild(sprite,z);
        };
        create(res.c1,0.5,size.width/14,size.height/12*11,1);
        create(res.c2,0.5,size.width/14,size.height/12*9.5,1);
        create(res.c3,0.5,size.width/14,size.height/12*8);
        create(res.c4,0.5,size.width/14,size.height/12*6.5,1);
        create(res.c5,0.5,size.width/14,size.height/12*5,1);
        create(res.c6,0.5,size.width/14,size.height/12*3.5,1);
        create(res.c7,0.5,size.width/14,size.height/12*2,1);
        create(res.t1,0.7,size.width/3.7,size.height/2.1,1);
        create(res.t2,0.7,size.width/1.38,size.height/2.1,2);
        create(res.t3,0.7,size.width/2,size.height*0.53,3);
        create(res.t4,0.7,size.width/2*1.005,size.height/6*4.246,4);
        create(res.t5,0.7,size.width/2*1.005,size.height/6*4.247,5);
        create(res.t6,0.7,size.width/2,size.height/2,6);
        create(res.t7,0.7,size.width*0.6129,size.height/18,7);
        create(res.t7,0.7,size.width*0.382,size.height/18,8);
        create(res.t8,0.7,size.width/2,size.height/2,9);
        //布置画布
        this.draw_page=new cc.RenderTexture(size.width,size.height);
        this.draw_page.setPosition(size.width/2,size.height/2);
        this.addChild(this.draw_page,3);
        //布置画笔
        this.pen=new cc.DrawNode();
        this.pen.drawCircle(cc.p(0,0), 35, 360, 28, 0, 35, cc.color(255,255,111,255));
        this.pen.retain();

        //
        //绑定事件函数
        //
        self.draw_c=new cc.color(0,0,0,0);//当前画笔的取色
        self.cor=[cc.color(66,0,255,255),cc.color(255,0,0,0),cc.color(0,218,0,255),cc.color(129,218,228,225),cc.color(95,52,9,255),cc.color(243,129,0,255),cc.color(249,255,0,255)];//总共颜色存放点
        //取色事件
        self.a=[];
        self.dd=function(location1){
                self.pen.setPosition(location1);
                self.draw_page.begin();
                self.pen.visit();
                self.draw_page.end();
        };
        var create_event=function(sprite_name,color){
            this.tag=1;
            cc.eventManager.addListener({
                event: cc.EventListener.TOUCH_ONE_BY_ONE,
                target:sprite_name,
                onTouchBegan:function(touch, event){
                    var location=touch.getLocation();
                    var target=event.getCurrentTarget();
                    var size=target.getContentSize();
                    if(cc.rectContainsPoint(sprite_name.getBoundingBox(),location)){
                        cc.log("in");
                        self.draw_c=color;
                        this.tag=0;


                        cc.log(self.draw_c);
                    }
                    return true;
                },
                onTouchMoved:function (touch, event) {
                    return true;
                },
                onTouchEnded:function(touch,event){

                    return true;
                }
            }, self);
                };
        //着色事件
        var create_event_draw=function(){
            cc.eventManager.addListener({
                event: cc.EventListener.TOUCH_ONE_BY_ONE,
                onTouchBegan:function(touch, event){
                    var location=touch.getLocation();//local not world
                    cc.log(self.sprite_array);
                    if(cc.rectContainsPoint(self.sprite_array[14].getBoundingBox(),location)){//local not world
                        self.sprite_array[14].setColor(self.draw_c);
                        return true;
                        //sprite_name.setPosition(location.x,location.y);
                    }else if(cc.rectContainsPoint(self.sprite_array[13].getBoundingBox(),location)){
                        self.sprite_array[13].setColor(self.draw_c);
                        return true;
                    }else if(cc.rectContainsPoint(self.sprite_array[12].getBoundingBox(),location)){
                        self.sprite_array[12].setColor(self.draw_c);
                        return true;
                    }else if(cc.rectContainsPoint(self.sprite_array[11].getBoundingBox(),location)){
                        self.sprite_array[11].setColor(self.draw_c);
                        return true;
                    }else if(cc.rectContainsPoint(self.sprite_array[10].getBoundingBox(),location)){
                        self.sprite_array[10].setColor(self.draw_c);
                        return true;
                    }else if(cc.rectContainsPoint(self.sprite_array[9].getBoundingBox(),location)){
                        self.sprite_array[9].setColor(self.draw_c);
                        return true;
                    }else if(cc.rectContainsPoint(self.sprite_array[8].getBoundingBox(),location)){
                        self.sprite_array[8].setColor(self.draw_c);
                        return true;
                    }else if(cc.rectContainsPoint(self.sprite_array[7].getBoundingBox(),location)){
                        self.sprite_array[7].setColor(self.draw_c);
                        return true;
                    }
                },
                onTouchMoved:function(touch,event){
                    var location=touch.getLocation();
                    return true;
                },
                onTouchEnded:function(touch,event){
                    return true;
                }
            }, self);
        };
        ////////////////
        for(var i=0;i<7;i++){
            cc.log(1);
            create_event(self.sprite_array[i],self.cor[i]);
        }
        create_event_draw();

       // create_event_draw(t);

    }

});
var StartScene1 = cc.Scene.extend({
    onEnter:function () {
        //cc.log(this._super());
        this._super();
        var layer = new HelloWorldLayer1();
        //cc.log(layer);
        this.addChild(layer);

    }
});