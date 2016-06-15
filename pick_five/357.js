/**
 * Created by taohan on 16/5/24.master 5/30
 */
var helloworld=cc.Layer.extend({
    ctor:function() {
        this._super();
        var size = cc.winSize;
        //精灵的动画创建函数(精灵，动画类型，动画参数))))
        self = this;

//################################################//
//创建精灵的函数（精灵编号，图片源头，scale，x，y，z）
//################################################//
        var create = function (sprite, res, scl, x, y, z) {
            sprite = new cc.Sprite(res);
            sprite.setPosition(x, y);
            scl = scl > 0 ? scl : 1;
            sprite.scale = scl;
            self.sprite_array.push(sprite);
            self.addChild(sprite, z);
        };
//###################################################//
//动画搜集函数，输入，一个图片对象
//###################################################//
        var find_ani = function (obj) {
            var t = [], t1 = {};
            for (this.i in obj) {
                if (this.i.indexOf("animation") != -1) {
                    t1[this.i] = obj[this.i];
                    t.push(t1);
                    t1 = {};
                }
            }
            self.animal.push(t);
        };
        self.sprite_array = [];//精灵数组
        self.animal = [];//动画数组，序号和精灵数组相对应
        //读取配置信息
        self.config_info = json_parse(config);
        cc.log(self.config_info);
        var mid;
        //创建背景
        create(mid, self.config_info.background_img, 1, size.width / 2, size.height / 2, 0);
        self.animal.push(0);//背景没有装饰图
        //创建装饰图
        for (var i = 0; i < self.config_info.images.length; i++) {
            create(mid, self.config_info.images[0].res, parseFloat(self.config_info.images[i].scale), self.config_info.images[0].x, self.config_info.images[0].y, 1);
        }
        //创建点击图
        for (var i = 0; i < self.config_info.option_layer.length; i++) {
            create(mid, self.config_info.option_layer[i].res, parseInt(self.config_info.option_layer[i].scale), self.config_info.option_layer[i].pos_x, self.config_info.option_layer[i].pos_y, 3);
        }
        //搜寻动画
        find_ani(self.config_info.images[0]);
        for (var i = 0; i < self.config_info.option_layer.length; i++) {
            find_ani(self.config_info.option_layer[i]);
        }
        //创建start animation,idle动画
        for(var i=1;i<self.sprite_array.length;i++){
            for(j in self.animal[i]){
                if(self.animal[i][j].start_animation){
                    create_animation(self.sprite_array[i],self.animal[i][j].start_animation,false);
                }
                if(self.animal[i][j].idle_animation){
                    create_animation(self.sprite_array[i],self.animal[i][j].idle_animation,true);
                }
            }
        }

        cc.log(self.animal);
        var listener_sprite_click = cc.EventListener.create({
            event: cc.EventListener.TOUCH_ONE_BY_ONE,
            swallowTouches: true,
            onTouchBegan: function (touch, event) {
                cc.log("touch begin my sprite");
                return true;
            },
            onTouchMoved: function (touch, event) {
                return true;
            },
            onTouchEnded: function (touch, event) {
                var touch_point = touch.getLocation();
                for (var i = 1; i < self.sprite_array.length; i++) {
                    for(j in self.animal[i]){
                        if(self.animal[i][j].click_animation){
                            self.judge(touch_point,self.sprite_array[i],self.animal[i][j].click_animation);
                        }
                        if(self.animal[i][j].end_animation){
                            self.judge(touch_point,self.sprite_array[i],self.animal[i][j].end_animation);
                        }
                    }
                }
                return true;
            }
        });
        cc.eventManager.addListener(listener_sprite_click, self);
    },
    //创建click动画的函数 cc.point cc.sprite string
    judge:function(location,sprite,act) {
        if (cc.rectContainsPoint(sprite.getBoundingBox(), location)) {
            cc.log("ininin");
            create_animation(sprite,act,false);
        }
    }
});
var StartScene = cc.Scene.extend({
    onEnter:function () {
        //cc.log(this._super());
        this._super();
        var layer = new helloworld();
        //cc.log(layer);
        this.addChild(layer);

    }
});