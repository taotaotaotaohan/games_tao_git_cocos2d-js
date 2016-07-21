var G_catgory_decoration=[];
var G_item_decoration=[];
var move_h_decorationLayer = homebacklayer.extend({
    background:null,
    obj:null,
    dist:null,
    arry_sprite:null,
    recyclebin:null,
    decoration_target:null,
    camera:null,
    ctor: function () {
        this._super();
        this.initScene();
        this.prepareforpool();

        var size=cc.winSize;
        cc.audioEngine.playMusic(move_h_decoration.background_music,true);

        var arry_menu_item = [];
        var closeItem = new cc.MenuItemImage(
            "games/decoration/res/tuichu.png",
            "games/decoration/res/tuichule.png",
            function () {
               this.theend();
            }, this);
        closeItem.attr({
            x: size.width - 80,
            y: size.height - 50,
            anchorX: 0.5,
            anchorY: 0.5
        });
        arry_menu_item[0] = closeItem;

        var menu = new cc.Menu(arry_menu_item);
        menu.x = 0;
        menu.y = 0;
        this.addChild(menu, 11);

        var self=this;
        cc.eventManager.addListener({
            event: cc.EventListener.TOUCH_ONE_BY_ONE,
            swallowTouches: true,
            onTouchBegan:function(touch, event){
                var location=touch.getLocation();
                var target = event.getCurrentTarget();
                if(cc.rectContainsPoint(self.camera.getBoundingBox(),location)){
                    cc.log("zhao xiang le");
                    return true;
                    }
                if(cc.rectContainsPoint(self.decoration_target.getBoundingBox(),location)){
                    cc.log("dian zhong bei zhuangshi wu le");
                    if(move_h_decoration.smart_object.sound_click){
                        cc.audioEngine.playEffect(move_h_decoration.smart_object.sound_click);
                    }
                    self.effect_animation(self.decoration_target,'animation_click',true);
                    return true;
                }
                for (var i=0;i<self.arry_sprite.length;i++){
                    if(cc.rectContainsPoint(self.arry_sprite[i].getBoundingBox(),location)){
                        cc.log("dian le di "+i+"zhangtu");
                        if(self.arry_sprite[i].org.sound_click){
                            cc.audioEngine.playEffect(self.arry_sprite[i].org.sound_click);
                        }
                        self.effect_animation(self.arry_sprite[i],'animation_click',true);
                        return true;
                    }
                }
            },
            onTouchMoved:function (touch, event) {
                return true;
            },
            onTouchEnded:function(touch,event){
                return true;
            }
        },this);
    },

    initScene: function () {
        var size=cc.winSize;
        this.arry_sprite=[];
        this.array_moving=[];

        //背景
        this.background=new cc.Sprite(move_h_decoration.backgrounder.res);
        this.background.setPosition(move_h_decoration.backgrounder.x,move_h_decoration.backgrounder.y);
        this.background.setOpacity(move_h_decoration.backgrounder.opacity);
        this.background.setScale(move_h_decoration.backgrounder.scale);
        this.background.org=move_h_decoration.backgrounder;
        this.addChild(this.background, 0);
        //回收
        this.recyclebin=new cc.Sprite("games/decoration/res/recycle_bin.png");
        this.recyclebin.setPosition(850,-120);
        this.recyclebin.setScale(0.5);
        this.addChild(this.recyclebin,1);
        //相机
        this.camera=new cc.Sprite("games/decoration/res/camera.png");
        this.camera.setScale(0.5);
        this.camera.setPosition(1000,100);
        this.addChild(this.camera,1);
        //被装饰物
        this.decoration_target=new cc.Sprite(move_h_decoration.smart_object.res);
        this.decoration_target.setPosition(move_h_decoration.smart_object.x,move_h_decoration.smart_object.y);
        this.decoration_target.setScale(move_h_decoration.smart_object.scale);
        this.decoration_target.setOpacity(move_h_decoration.smart_object.opacity);
        this.decoration_target.setRotation(move_h_decoration.smart_object.rotate1);
        this.addChild(this.decoration_target, 3);
        this.decoration_target.org=move_h_decoration.smart_object;
        this.effect_animation(this.decoration_target,'animation_start',true);
        this.effect_animation(this.decoration_target,'animation_idle',true);

        //图片
        for(var i=0;i<move_h_decoration.images.length;i++){
            this.arry_sprite[i]=new obj_class(move_h_decoration.images[i].res);
            this.arry_sprite[i].setPosition(move_h_decoration.images[i].x,move_h_decoration.images[i].y);
            this.arry_sprite[i].setScale(move_h_decoration.images[i].scale);
            this.arry_sprite[i].setOpacity(move_h_decoration.images[i].opacity);
            this.arry_sprite[i].setRotation(move_h_decoration.images[i].rotate1);
            this.arry_sprite[i].org=move_h_decoration.images[i];
            this.addChild(this.arry_sprite[i],2);
            this.effect_animation(this.arry_sprite[i],'animation_start',true);
            this.effect_animation(this.arry_sprite[i],'animation_idle',true);
        }
        //装饰工具库
        for(var i=0;i<move_h_decoration.category.length;i++){
            G_catgory_decoration[i]=new obj_class(move_h_decoration.category[i].res);
            G_catgory_decoration[i].setPosition(250,520-i*80);
            G_catgory_decoration[i].setScale(move_h_decoration.category[i].scale);
            G_catgory_decoration[i].setOpacity(move_h_decoration.category[i].opacity);
            G_catgory_decoration[i].setRotation(move_h_decoration.category[i].rotate1);
            G_catgory_decoration[i].org=move_h_decoration.category[i];
            this.addChild(G_catgory_decoration[i],2);
            this.event_category(G_catgory_decoration[i]);
            this.effect_animation(G_catgory_decoration[i],'animation_start',true);
            this.effect_animation(G_catgory_decoration[i],'animation_idle',true);
        }
        //装饰工具
        for(var i=0;i<move_h_decoration.item1.length;i++){
            G_item_decoration[i]=new obj_class(move_h_decoration.item1[i].res);
            G_item_decoration[i].setPosition(320,520-i*80);
            G_item_decoration[i].setScale(move_h_decoration.item1[i].scale);
            G_item_decoration[i].setOpacity(move_h_decoration.item1[i].opacity);
            G_item_decoration[i].setRotation(move_h_decoration.item1[i].rotate1);
            G_item_decoration[i].org=move_h_decoration.item1[i];
            G_item_decoration[i].num=i;
            this.addChild(G_item_decoration[i],6);
            G_item_decoration[i].setVisible(false);
            this.event_item(G_item_decoration[i]);
            this.effect_animation(G_item_decoration[i],'animation_start',true);
            this.effect_animation(G_item_decoration[i],'animation_idle',true);
        }
    },
    //关闭游戏时的动画。
    theend:function () {
        for (var i=0;i<G_catgory_decoration.length;i++){
            this.effect_animation(G_catgory_decoration[i],'animation_end',true);
        }
        for (var i=0;i<G_item_decoration.length;i++){
            this.effect_animation(G_item_decoration[i],'animation_end',true);
        }
        for (var i=0;i< this.arry_sprite.length;i++){
            this.effect_animation( this.arry_sprite[i],'animation_end',true);
        }
        this.effect_animation( this.decoration_target,'animation_end',true);
        this.effect_animation( this.background,'animation_end',true);
        cc.log("tui chu ");
    },
    prepareforpool:function () {
        for(var i=0;i<3;i++){
            var node=new obj_class(move_h_decoration.images[0].res);
            this.addChild(node);
            cc.pool.putInPool(node);
        }
    },
    reclbing:function () {
      this.recyclebin.runAction(new cc.moveTo(0.2,cc.p(850,105)));
    },
    unreclbing:function () {
        this.recyclebin.runAction(new cc.moveTo(0.2,cc.p(850,-120)));
    },
    //不同item不同状态动作
    effect_animation:function (sprite,pattern,tag) {
        switch (pattern){
            case 'animation_start':
            var type=sprite.org.animation_start;
                if(type){
                create_animation(sprite,type,tag);
                }
                break;
            case 'animation_idle':
            var type=sprite.org.animation_idle;
                if(type){
                    create_animation(sprite,type,tag);
                }
                break;
            case 'animation_click':
                var type=sprite.org.animation_click;
                if(type){
                    create_animation(sprite,type,tag);
                }
                break;
            case 'animation_end':
                var type=sprite.org.animation_end;
                if(type){
                    create_animation(sprite,type,tag);
                }
            default:sprite.runAction(new cc.blink(10,10));
        }
    },
    event_category:function(sprite){
        var self=this;
        cc.eventManager.addListener({
            event: cc.EventListener.TOUCH_ONE_BY_ONE,
            swallowTouches: true,
            onTouchBegan:function(touch, event){
                var location=touch.getLocation();
                var target = event.getCurrentTarget();
                if(cc.rectContainsPoint(target.getBoundingBox(),location)){
                    if(target.org.sound_click){
                        cc.audioEngine.playEffect(target.org.sound_click);
                    }
                    for(var i=0;i< sprite.org.target.length;i++){
                        cc.eventManager.resumeTarget(G_item_decoration[sprite.org.target[i]]);
                        G_item_decoration[sprite.org.target[i]].setVisible(true);
                    }
                    for(var i=0;i< sprite.org.untarget.length;i++){
                        G_item_decoration[sprite.org.untarget[i]].setVisible(false);
                        cc.eventManager.pauseTarget(G_item_decoration[sprite.org.untarget[i]]);
                    }
                    return true;
                }
            },
            onTouchMoved:function (touch, event) {
                return true;
            },
            onTouchEnded:function(touch,event){
                return true;
            }
        },sprite);
    },
    event_item:function(sprite){
        var self=this;
        cc.eventManager.addListener({
            event: cc.EventListener.TOUCH_ONE_BY_ONE,
            swallowTouches: true,
            onTouchBegan:function(touch, event){
                var location=touch.getLocation();
                var target = event.getCurrentTarget();
                if(cc.rectContainsPoint(sprite.getBoundingBox(),location)){
                    self.reclbing();
                    if(target.org.sound_click){
                        cc.audioEngine.playEffect(target.org.sound_click);
                    }
                    //用新生成的item代替原来相应位置上的item，这样就能在此监听事件中移动无间隔的移动item了。
                    var num=sprite.num;
                    var item2=obj_class.recreate(sprite.org.res);
                    item2.setPosition(320,520-num*80);
                    item2.setScale(move_h_decoration.item1[num].scale);
                    self.addChild(item2,2);

                    G_item_decoration.splice(num,1,item2);
                    G_item_decoration[num].org=move_h_decoration.item1[num];
                    G_item_decoration[num].num=num;
                    self.event_item(G_item_decoration[num]);
                    return true;
                }
            },
            onTouchMoved:function (touch, event) {
                var delta = touch.getDelta();
                var target = event.getCurrentTarget();
                var disty= delta.y;
                var distx= delta.x;
                target.x+=distx;
                target.y+=disty;
                return true;
            },
            onTouchEnded:function(touch,event){
                G_item_decoration[sprite.num].setLocalZOrder(6);
                var target = event.getCurrentTarget();
                if(target.x==320&&target.y==520-sprite.num*80){
                    target.runAction(new cc.moveTo(0.5,cc.p(568,320)));
                }
                if(target.x<900&&target.y<150&&target.x>800&&target.y>50){
                    cc.pool.putInPool(target);
                    target.removeFromParent();
                }
                self.unreclbing();
                return true;
            }
        },sprite);
    }
});
var move_h_decorationScene = cc.Scene.extend({
    onEnter : function () {
        this._super();
        var layer = new  move_h_decorationLayer();
        this.addChild(layer);
    }
});







