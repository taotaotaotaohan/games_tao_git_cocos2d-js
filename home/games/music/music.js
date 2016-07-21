//*created by tao 5/25*//
var HelloWorldLayer_music = homebacklayer.extend({
    ctor: function () {
    self=this;
    var config_info=json_parse(config_music);
    self._super();
    self.size=cc.winSize;
    self.cons=0;//用户已经点击出的正确音符数量－－用于判定游戏是否完成
    self.g=3;//用户需要点击的正确音符目标数量
    self.sprite_array=[];//精灵数组,不包括point

    self.point_array=[[],[],[],[],[],[],[]];//描述point点的二维数组
    self.right_answer=[];//正确队列，队首是当前需要敲击的音符，只有敲击对首才会引起队列变化
    self.music=config_info.music;
    //self.music=[1,2,3,4,5];
    self.now=0;//当前执行的music音节数组中的序号
    self.add_animate(2);//装好星星真动画,idel眨眼
    //将发射音符的定时器附在这个没用的精灵上
    self.one=new cc.Sprite(res_music.bg);
    self.addChild(self.one,-1);
    /////////////////////////////////////////////////////////
    //场景布置
    /////////////////////////////////////////////////////////
    self.create(res_music.bg,1,1,self.size.width/2,self.size.height/1.4,3,1,1);//总背景
    self.create(res_music.bg_under,1,1,self.size.width/2,self.size.height/2,1.1,1,1);//琴的背景
    //7个按键+7个隐藏键
    for(var i=0;i<7;i++){
        self.create(res_music.key_all,1,1,self.size.width/14*(2*(i+1)-1),self.size.height/2.95,2,1,1);
    }
    for(var i=0;i<7;i++){
        self.create(res_music["key"+(i+1)],1,1,self.size.width/14*(2*(i+1)-1),self.size.height/2.95,2,1,1);
    }
    //7个彩色按键隐藏属性
    for(var i=9;i<16;i++) {
        self.sprite_array[i].setVisible(false);
    }
    //星星16-20
    self.create(res_music.start1,1,1,self.size.width/5,self.size.height/1.1,3,1,1);
    self.create(res_music.start1,1,1,self.size.width/14*13,self.size.height/1.22,3,1,1);
    self.create(res_music.start1,1.4,1.4,self.size.width/2.6,self.size.height/1.36,3,1,1);
    self.create(res_music.start1,0.6,0.6,self.size.width/14*9,self.size.height/1.3,3,1,1);
    self.create(res_music.start1,0.9,0.9,self.size.width/14,self.size.height/1.4,3,1,1);
    //星星动画16-20
    self.sprite_array[16].runAction(cc.sequence(cc.animate(self.anima),cc.delayTime(5)).repeatForever());
    self.sprite_array[17].runAction(cc.sequence(cc.animate(self.anima),cc.delayTime(4)).repeatForever());
    self.sprite_array[18].runAction(cc.sequence(cc.animate(self.anima),cc.delayTime(3)).repeatForever());
    self.sprite_array[19].runAction(cc.sequence(cc.animate(self.anima),cc.delayTime(2)).repeatForever());
    self.sprite_array[20].runAction(cc.sequence(cc.animate(self.anima),cc.delayTime(1)).repeatForever());
    //倒计时数字 21-23
    self.create(res_music.one,1.3,1.5,self.size.width/2,self.size.height/2,10,1,1);
    self.sprite_array[21].setOpacity(0);
    self.create(res_music.two,1,1.5,self.size.width/2,self.size.height/2,10,1,1);
    self.create(res_music.three,1,1.5,self.size.width/2,self.size.height/2,10,1,1);
    self.sprite_array[22].setOpacity(0);
    self.sprite_array[23].setOpacity(0);
    //倒计时数字下的背景
    self.create(res_music.bg_mask,1.3,1.3,self.size.width/2,self.size.height/2,9,1,1);
    self.sprite_array[24].setVisible(false);
    /////////////////////////////////////////////////////////
    //事件
    /////////////////////////////////////////////////////////
    self.keyy=[0,0,0,0,0,0,0];
    cc.eventManager.addListener({
        event: cc.EventListener.TOUCH_ONE_BY_ONE,
        onTouchBegan:function(touch, event){
            var location=touch.getLocation();
            cc.log(self.click_sound);
            for(var i=2;i<9;i++) {
                self.click_sound(location, self.sprite_array[i], i-1);
            }
            self.click_star(location);//星星点击
            self.show_key(location);//出现彩色琴键
            return true;
        },
        onTouchMoved:function (touch, event) {
            var location=touch.getLocation();
            for(var i=2;i<9;i++) {
                self.click_sound(location, self.sprite_array[i], i-1);
            }
            self.show_key(location);//出现彩色琴键
            return true;
        },
        onTouchEnded:function(touch,event){
            var location=touch.getLocation();
            self.hide_key(location);//隐藏彩色琴键
            self.keyy=[0,0,0,0,0,0,0];
            if(self.cons==self.g){//任务完成
                //cc.director.runScene(new HelloWorldLayer());
                var currentScene = cc.director.getRunningScene();
                currentScene.removeAllChildren();
                currentScene.addChild(new HelloWorldLayer_music());
            }
            return true;
        }
    }, self);
    return true;
    },
    //时刻监听点击事件，随时消失，删除相应point；
    pause_all:function(){//暂停所有
        for(var i in self.point_array){
            for(var j in self.point_array[i]){
                if(j!=0 || self.right_answer[0]!=(parseInt(i)+1)) {
                    self.point_array[i][j].pause();
                }
                if(self.right_answer[0]==(parseInt(i)+1)){
                    if(self.point_array[i].length){
                        self.point_array[i][0].resume();
                        self.point_array[i][0].setOpacity(0);
                        self.point_array[i][0].scale=0.5;
                        self.point_array[i][0].runAction(cc.sequence(cc.scaleBy(1,2),cc.scaleBy(1,0.5)).repeatForever());
                        self.point_array[i][0].runAction(cc.spawn(cc.sequence(cc.fadeIn(1),cc.fadeOut(1)).repeatForever()));
                    }
                }
                self.one.pause();
            }
        }
    },
    resume_all:function(){//恢复所有
        for(var i in self.point_array){
            for(var j in self.point_array[i]){
                self.point_array[i][j].resume();
                self.one.resume();
            }
        }
    },
    //创建精灵的函数,后面两个参数针对point，做特殊处理，num代表1-7音符，type代表是否为1一般事物创建，2point创建，3隐藏琴键创建
    create:function(res,scl_x,scl_y,x,y,z,num,type){
        var sprite=new cc.Sprite(res);
        sprite.setPosition(x,y);
        scl_x=scl_x>0?scl_x:1;
        scl_y=scl_y>0?scl_y:1;
        sprite.scaleX=scl_x;
        sprite.scaleY=scl_y;
        self.addChild(sprite, z);
        if(type==1) {
            self.sprite_array.push(sprite);
        }else if(type==2){
            self.point_array[num-1].push(sprite);
            sprite.setOpacity(0);
            sprite.runAction(cc.spawn(cc.sequence(cc.moveTo(1.75,self.size.width/14*(2*num-1),self.size.height/10),cc.callFunc(function(){
                self.pause_all();
                return true;
            }))));
            sprite.runAction(cc.spawn(cc.sequence(cc.scaleTo(1.3,1.3))));
            sprite.runAction(cc.spawn(cc.sequence(cc.fadeIn(1.75))));
        }
    },
    //
    //绑定发声音的函数m 1-7
    //
    click_sound:function(location,sprite,num){
        if(cc.rectContainsPoint(sprite.getBoundingBox(),location) && self.keyy[num-1]==0){
            cc.audioEngine.playEffect(res_music["m"+num], false);

            if(self.right_answer.length && self.right_answer[0]==num){//音乐没有弹完，并且用户点击当前的正确音符
                self.cons++;
                self.right_answer.shift();
                var now=self.point_array[num-1][0].getPosition();
                self.removeChild(self.point_array[num-1][0]);
                self.point_boom(now,num);
                self.point_array[num-1].shift();
                self.resume_all();
            }
            return true;
        }else{
            return false;
        }
    },
    //添加星星动画，根据png数量可重用
    add_animate:function(animate_num){
        self.anima=new cc.Animation();
        self.anima.setDelayPerUnit(0.2);
        for(var i=1;i<(animate_num+1);i++){
            self.anima.addSpriteFrameWithFile(res_music["start"+i]);
        }
        self.anima.addSpriteFrameWithFile(res_music["start"+1]);
    },
    //星星点击事件 16-20为星星编号，每个星星代表一个个music数组
    click_star: function (location) {
        for(var i=16;i<21;i++){
            if(cc.rectContainsPoint(self.sprite_array[i].getBoundingBox(),location)){
                //cc.director.runScene(new HelloWorldLayer());
                var currentScene = cc.director.getRunningScene();
                currentScene.removeAllChildren();
                currentScene.addChild(new HelloWorldLayer_music());
                self.sprite_array[24].setVisible(true);
                self.g = self.music[i-16].length;
                self.count_3(i-16);//-16
                self.sprite_array[i].setVisible(false);
                //23
                self.create(res_music.start3,self.sprite_array[i].scale,self.sprite_array[i].scale,self.sprite_array[i].getPosition().x,self.sprite_array[i].getPosition().y,10,1,1);
                self.sprite_array[25].runAction(cc.sequence(cc.rotateBy(7,360)).repeatForever());
            }
        }
    },
    //隐藏的彩色琴键显示9-15
    show_key:function(location){
        for(var i=9;i<16;i++){
            if(cc.rectContainsPoint(self.sprite_array[i].getBoundingBox(),location)){
                self.keyy[i-9]=1;
                self.sprite_array[i].setVisible(true);
            }
        }
    },
    //彩色按键离手消失
    hide_key:function(location){
        for(var i=9;i<16;i++){
            self.sprite_array[i].setVisible(false);
        }
    },
    //3个倒计时动画(21,22,23)结束之后开始发射音符
    count_3:function(i){
        self.sprite_array[23].runAction(cc.sequence(cc.fadeIn(0),cc.scaleBy(0.5,2),cc.scaleBy(0.5,0.5),cc.fadeOut(0),cc.callFunc(function(){
            self.sprite_array[22].runAction(cc.sequence(cc.fadeIn(0),cc.scaleBy(0.5,2),cc.scaleBy(0.5,0.5),cc.fadeOut(0),cc.callFunc(function(){
                self.sprite_array[21].runAction(cc.sequence(cc.fadeIn(0),cc.scaleBy(0.5,2),cc.scaleBy(0.5,0.5),cc.fadeOut(0),cc.callFunc(function(){
                    //schedule间隔，额外次数，延迟
                    self.sprite_array[24].setVisible(false);
                    self.one.schedule(function(){
                        self.create(res_music["point"+self.music[i][self.now]],0.3,0.3,self.size.width/14*(2*self.music[i][self.now]-1),self.size.height/1.8,4,self.music[i][self.now],2);
                        self.right_answer.push(self.music[i][self.now]);
                        self.now++;
                        if(self.now==self.music[i].length){
                            //发射完毕
                            //self.sprite_array[i+16].stopAllActions();
                        }
                        return true;
                    },1,self.music[i].length-1,0);
                })));
            })));
        })));
    },
    //point爆炸效果，输入需要生成爆炸点的位置cc.position() ,音符号
    point_boom:function(location,num){
        var boom=new cc.Sprite(res_music["boom"+num]);
        boom.scale=0.5;
        boom.setPosition(location.x,location.y);
        self.addChild(boom,10);
        boom.runAction(cc.sequence(cc.scaleBy(0.25,2),cc.fadeOut(0.25),cc.callFunc(function(){
            self.removeChild(boom);
        })));
    }
});

var StartScene_music = cc.Scene.extend({
    onEnter:function () {
        this._super();
        var layer = new HelloWorldLayer_music();
        this.addChild(layer);
    }
});