/**
 * Created by taohan on 16/6/25.
 */
var homebacklayer = cc.Layer.extend({
    ctor:function(){
        this._super();
        self=this;
        self.bac=0;//控制home跳转
        self.lor=0;//判定左右
        var back=new cc.Sprite(res_main.home);
        var back_pressed=new cc.Sprite(res_main.home_pressed);
        back.setPosition(cc.p(80,580));
        back_pressed.setPosition(cc.p(80,580));
        back_pressed.setVisible(false);
        self.addChild(back,19);
        self.addChild(back_pressed,20);
        var left = new cc.Sprite(res_main.left);
        var right = new cc.Sprite(res_main.right);
        left.setPosition(cc.p(80, 280));
        self.addChild(left, 19);
        right.setPosition(cc.p(1080, 280));
        self.addChild(right, 19);
        cc.log(which_game,"which_game");
        if(which_game==0) {
            left.setVisible(false);
            self.lor=1;
        }else if(which_game==home_config.games_num_all-1){
            right.setVisible(false);
            self.lor=2;
        }
        cc.eventManager.addListener({
            event: cc.EventListener.TOUCH_ONE_BY_ONE,
            onTouchBegan:function(touch){
                cc.log(back,left,right);
                var location=touch.getLocation();
                if(cc.rectContainsPoint(back.getBoundingBox(),location)){//home键
                    cc.audioEngine.end();
                    cc.LoaderScene.preload(g_resources, function () {
                        cc.director.runScene(new StartScene_home());
                    }, this);
                    back_pressed.setVisible(true);
                    back.setVisible(true);
                    self.bac=1;
                    which_game=0;
                    cc.log("click home");
                }else if(cc.rectContainsPoint(left.getBoundingBox(),location) && self.lor!=1){
                    cc.audioEngine.end();
                    which_game=which_game-1>0?which_game-1:0;
                    self.bac=2;
                }else if(cc.rectContainsPoint(right.getBoundingBox(),location) && self.lor!=2){
                    cc.audioEngine.end();
                    cc.log(which_game,home_config.games_num_all);
                    which_game=which_game+1>home_config.games_num_all-1?home_config.games_num_all-1:which_game+1;
                    self.bac=3;
                }
                return true;
            },
            onTouchMoved:function () {
                return true;
            },
            onTouchEnded:function(){
                cc.log(which_game,"onend");
                if(self.bac==1) {
                    var current=cc.director.getRunningScene();
                    current.removeAllChildren();
                    cc.director.runScene(new StartScene());
                }else if(self.bac==2){
                    cc.LoaderScene.preload(eval(game_menu.resources[which_game]), function () {
                        var current=cc.director.getRunningScene();
                        current.removeAllChildren();
                        eval("cc.director.runScene(new cc.TransitionSlideInB(1, new "+ game_menu.scenes[which_game]+"("+game_menu.config_name[which_game]+")))");
                    }, self);
                }else if(self.bac==3){
                    cc.LoaderScene.preload(eval(game_menu.resources[which_game]), function () {
                        var current=cc.director.getRunningScene();
                        current.removeAllChildren();
                        eval("cc.director.runScene(new cc.TransitionSlideInB(1, new "+ game_menu.scenes[which_game]+"("+game_menu.config_name[which_game]+")))");
                    }, self);
                }
                return true;
            }
        },self);
    }
});