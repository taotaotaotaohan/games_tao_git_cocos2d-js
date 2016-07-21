/**
 * Created by taohan on 16/5/26.
 */
var res_move = {
    bg : "games/move_and_draw/res/247207.jpg",
    lion:"games/move_and_draw/res/247208.png",
    dirty : "games/move_and_draw/res/247209.png",
    eraser:"games/move_and_draw/res/247210.png",
    //button:"games/move_and_draw/res/247206.png"
    //particle_file:"games/move_and_draw/res/particle.plist",
    //great:"games/move_and_draw/res/great.mp3",
};
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
//创建精灵的函数（图片源头，scale，x，y，z,sprite_type）
//type==1 是不被擦除的精灵
//################################################//
var create_draw=function(res,scl,x,y,z,type){
    sprite=new cc.Sprite(res);
    sprite.setPosition(x,y);
    scl=scl>0?scl:1;
    sprite.scale=scl;
    if(type==1) {
        self.sprite_array.push(sprite);
        self.addChild(sprite, z);
    }else{
        self.sprite_array_visit.push(sprite);
    }
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
var g_resources_move = [];
for (var i in res_move) {
    g_resources.push(res_move[i]);
}
