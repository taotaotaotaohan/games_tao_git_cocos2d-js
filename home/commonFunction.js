//精灵池类
var obj_class = cc.Sprite.extend({
    _hp:0,
    ctor:function(_image) {
        this._super(_image);
    },
    reuse:function (_image) {
        this.setTexture(_image);
        this.setVisible(true);
        cc.eventManager.resumeTarget(this);
    },
    unuse:function () {
        this.removeFromParent();
    }
});
obj_class.recreate=function (_image) {
    if(cc.pool.hasObject(obj_class)){
        return cc.pool.getFromPool(obj_class,_image);
    }else {
        return new obj_class(_image);
    }
};
var obj_class_move_horizontal_game = cc.Sprite.extend({
    _hp:0,
    ctor:function(_image,hp) {
        this._super(_image);
        this._hp=hp;
    },
    reuse:function (_image,hp) {
        this.setTexture(_image);
        this._hp=hp;
    },
    unuse:function (hp) {
        this._hp=0;
        this.removeFromParent();
    }
});
obj_class_move_horizontal_game.recreate=function (_image,hp) {
    if(cc.pool.hasObject(obj_class_move_horizontal_game)){
        return cc.pool.getFromPool(obj_class_move_horizontal_game,_image,hp);
    }else {
        return new obj_class_move_horizontal_game(_image,hp);
    }
};
//动画字典
var create_animation=function(sprite,type,tag){
    switch(type) {
        case "elastic_scale_in":
            if(tag){
                sprite.runAction(new cc.blink(10,10));
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
            sprite.runAction(cc.fadeIn(1,255));
            break;
        case "fade_out":
            sprite.runAction(cc.fadeOut(1,0));
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

            var speed=sprite.org.speed?sprite.org.speed:3;
            sprite.runAction(new cc.moveBy(speed,cc.p(-2000,0)));
            break;
        case "slide_in_from_top":
            sprite.runAction(cc.sequence(cc.jumpTo(1,location.x,location.y,50,4)));
            break;
        case "slide_in_from_bottom":
            sprite.runAction(new cc.Sequence(new cc.moveBy( 0.5,cc.p(0,350)),cc.delayTime(1),new cc.moveBy(0.5,cc.p(0,-350))));
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

