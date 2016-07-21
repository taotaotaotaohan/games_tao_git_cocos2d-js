/**
 * Created by taohan on 16/6/24.
 */

//创建动画的统一函数，精灵cc.sprite，类型string，是否是idel动画bool
var create_animation=function(sprite,type,tag){
    switch(type) {
        case "elastic_scale_in":
            if(tag){
                sprite.runAction(cc.sequence(cc.scaleBy(1,0.5),cc.scaleBy(1,2),cc.delayTime(1)).repeatForever());
                break;
            } else{
                sprite.runAction(cc.sequence(cc.scaleBy(1,0.5),cc.scaleBy(1,2)));
                break;
            }
        case "elastic_scale_out":
            sprite.runAction(cc.sequence(cc.scaleBy(0.5,0.5),cc.scaleBy(0.5,2),cc.hide()));
            break;
        case "fade_in":
            sprite.setOpacity(0);
            sprite.runAction(cc.fadeIn(1));
            break;
        case "fade_out":
            sprite.runAction(cc.fadeOut(1));
            break;
        case "bounce_in":
            var location=sprite.getPosition();
            sprite.setPosition(0,0);
            sprite.runAction(cc.sequence(cc.jumpTo(1,location.x,location.y,50,4),cc.show()));
            break;
        case "bounce_out":
            sprite.runAction(cc.sequence(cc.jumpTo(1,0,0,50,4),cc.hide()));
            break;
        case "slide_in_from_left":
            var location=sprite.getPosition();
            sprite.setPosition(0,size.height/2);
            sprite.runAction(cc.sequence(cc.jumpTo(1,location.x,location.y,50,4)));
            break;
        case "slide_in_from_right":
            var location=sprite.getPosition();
            sprite.setPosition(size.width,size.height/2);
            sprite.runAction(cc.sequence(cc.jumpTo(1,location.x,location.y,50,4)));
            break;
        case "slide_in_from_top":
            var location=sprite.getPosition();
            sprite.setPosition(size.width/2,size.height);
            sprite.runAction(cc.sequence(cc.jumpTo(1,location.x,location.y,50,4)));
            break;
        case "slide_in_from_bottom":
            var location=sprite.getPosition();
            sprite.setPosition(size.width/2,0);
            sprite.runAction(cc.sequence(cc.jumpTo(1,location.x,location.y,50,4)));
            break;
        case "shake":
            if(tag){
                sprite.runAction(cc.sequence(cc.rotateBy(0.2,30),cc.rotateBy(0.2,-30),cc.rotateBy(0.2,-30),cc.rotateBy(0.2,30),cc.delayTime(3)).repeatForever());
                break;
            }else {
                sprite.runAction(cc.sequence(cc.rotateBy(0.2, 30), cc.rotateBy(0.2, -30), cc.rotateBy(0.2, -30), cc.rotateBy(0.2, 30)));
                break;
            }
        case "blink":
            if(tag) {
                sprite.runAction(cc.sequence(cc.blink(1, 4),cc.delayTime(3)).repeatForever());
                break;
            }
            else{
                sprite.runAction(cc.blink(1, 4));
                break;
            }
        case "pulsate":
            if(tag){
                sprite.runAction(cc.sequence(cc.show(),cc.scaleBy(0.2,0.8,0.8),cc.scaleBy(0.2,1.25,1.25),cc.delayTime(3)).repeatForever());
                break;
            }else{
                sprite.runAction(cc.sequence(cc.show(),cc.scaleBy(0.2,0.8,0.8),cc.scaleBy(0.2,1.25,1.25)));
                break;
            }
    }
    return true;
};

//################################################//
//创建精灵的函数（精灵编号，图片源头，scale，x，y，z）
//################################################//
var create=function(sprite,res,scl,x,y,z){
    sprite=new cc.Sprite(res);
    sprite.setPosition(x,y);
    scl=scl>0?scl:1;
    sprite.scale=scl;
    self.sprite_array.push(sprite);
    self.addChild(sprite,z);
};
//###################################################//
//动画搜集函数，输入，一个图片对象
//###################################################//
var find_ani=function(obj){
    var t=[],t1={};
    for(this.i in obj){
        if(this.i.indexOf("animation")!=-1){
            t1[this.i]=obj[this.i];
            t.push(t1);
            t1={};
        }
    }
    self.animal.push(t);
};

//################################################//
//事件绑定函数(精灵，目标，源)
//################################################//
var event_sprite=function(spritex1,tar_x,tar_y,or_x,or_y){
    var tag=1;//拖动控制，避免同时拖动多个精灵
    cc.eventManager.addListener({
        event: cc.EventListener.TOUCH_ONE_BY_ONE,
        onTouchBegan:function(touch, event){
            var location=touch.getLocation();
            if(cc.rectContainsPoint(spritex1.getBoundingBox(),location)){
                spritex1.setPosition(location.x,location.y);
                tag=0;
                cc.log("in");
                if(self.animal[self.sprite_array.indexOf(spritex1)][2].click_animation!="undefined"){
                    create_animation(spritex1,self.animal[self.sprite_array.indexOf(spritex1)][2].click_animation);
                }
            }
            return true;
        },
        onTouchMoved:function (touch, event) {
            if(tag==0) {
                var location = touch.getLocation();
                spritex1.setPosition(location.x, location.y);
            }
            return true;
        },
        onTouchEnded:function(touch,event){
            if(tag==0) {
                var location = touch.getLocation();
                if (location.x - tar_x > -30 && location.x - tar_x < 30 && location.y - tar_y > -30 && location.y - tar_y < 30) {
                    spritex1.setPosition(tar_x, tar_y);
                    if(self.animal[self.sprite_array.indexOf(spritex1)][1].end_animation!="undefined"){
                        create_animation(spritex1,self.animal[self.sprite_array.indexOf(spritex1)][1].end_animation);
                    }
                } else {
                    spritex1.setPosition(or_x, or_y);
                    if(self.animal[self.sprite_array.indexOf(spritex1)][1].end_animation!="undefined"){
                        create_animation(spritex1,self.animal[self.sprite_array.indexOf(spritex1)][1].end_animation);
                    }
                }
            }
            tag=1;
            return true;
        }
    }, self);
};