//*created by tao 5/25*//
var HelloWorldLayer = cc.Layer.extend({
    ctor: function () {
        this._super();
        self=this;
        self.scheduleUpdate();
        self.move_or_swim=0;//该变量用来判断用户是想拖动还是点击游动鱼类
        self.size=cc.winSize;
        cc.audioEngine.playEffect("res/sea_sound01.m4a",true);
        self.sprite_array=[[],[],[],[],[]];//4个分层的精灵+particle
        self.click_array=[];//有点击事件的精灵
        self.max_location=[[[],[],[],[]],[[],[],[],[]],[[],[],[],[]],[[],[],[],[]],[[],[],[],[]]];//y1,y2,x1,x2
        self.choosed=[];//当前选中的个体鱼或者鱼群
        //气泡粒子效果
        add_particle(res_sea.particle2,300,100,10,0.5);
        add_particle(res_sea.particle,600,300,10,0.25);
        add_particle(res_sea.particle,100,600,10,0.25);
        add_particle(res_sea.particle,1000,300,10,0.25);
        add_particle(res_sea.particle,1600,100,10,0.25);
        add_particle(res_sea.particle,2000,100,10,0.25);
        //0是最下面一层
        create_sea(0,res_sea.lowest,0,0,0);
        create_sea(0,res_sea.sea_bed1,0,0,0);
        create_sea(0,res_sea.bg_1,0,0,0);
        create_sea(1,res_sea.balloon1,0,534,1600);
        horizon_move(self.sprite_array[0][self.sprite_array[0].length-1],-2000,120);
        create_sea(1,res_sea.balloon2,0,1933,1600);
        horizon_move(self.sprite_array[0][self.sprite_array[0].length-1],-2000,120);
        create_sea(1,res_sea.cloud1,0,80,1575);
        horizon_move(self.sprite_array[0][self.sprite_array[0].length-1],-2000,120);
        create_sea(1,res_sea.cloud2,0,941,1632);
        horizon_move(self.sprite_array[0][self.sprite_array[0].length-1],-2000,200);
        create_sea(1,res_sea.cloud4,0,1441,1481);
        horizon_move(self.sprite_array[0][self.sprite_array[0].length-1],-2000,140);
        create_sea(1,res_sea.cloud3,0,1832,1575);
        horizon_move(self.sprite_array[0][self.sprite_array[0].length-1],-2000,160);
        create_sea(1,res_sea.cloud5,0,2332,1648);
        horizon_move(self.sprite_array[0][self.sprite_array[0].length-1],-2000,180);
        create_sea(1,res_sea.cloud6,0,2776,1632);
        horizon_move(self.sprite_array[0][self.sprite_array[0].length-1],-2000,300);
        create_sea(1,res_sea.island,0,414,1449);

        useSpine(res_sea['spine0.1_json'],res_sea['spine0.1_atlas'],'animation',1778,1449,0,0);
        create_sea(0,res_sea.big_ship,0,1000,1420);
        horizon_move(self.sprite_array[0][self.sprite_array[0].length-1],2000,80);
        create_sea(0,res_sea.small_ship,0,2100,1435);
        horizon_move(self.sprite_array[0][self.sprite_array[0].length-1],2000,20);
        //1
        create_sea(0,res_sea.sea_bed1,1,0,0);
        create_sea(0,res_sea.water,1,0,0);
        create_sea(0,res_sea.cliff,1,2628,498);//岩石
        create_sea(1,res_sea.shoal_fish,1,700,700);//鱼群
        create_sea(1,res_sea.shark,1,834,1073);//鲨鱼
        set_animation1(self.sprite_array[1][self.sprite_array.length-1]);
        //鱼群动画测试
        self.sprite_array[1][3].runAction(cc.sequence(cc.rotateBy(0.5,-30),cc.moveBy(10,200,200),cc.rotateBy(0.5,30),cc.moveBy(20,700,0),cc.rotateBy(0.5,30),cc.moveBy(4,200,-200),cc.rotateBy(0.5,-30),cc.flipX(true),cc.moveBy(30,-1100,0),cc.flipX(false)).repeatForever());
        //
        create_sea(1,res_sea["pic1.17"],1,1427,160);//箱子
        rotateby(1,30);
        create_sea(0,res_sea.sea_bed2,1,0,0);
        useSpine(res_sea['spine3.1_json'],res_sea['spine3.1_atlas'],'animation',1985,327,1,0);
        useSpine(res_sea['spine3.2_json'],res_sea['spine3.2_atlas'],'fight_act',2499,535,1,2);//fish light
        useSpine(res_sea['spine3.3_json'],res_sea['spine3.3_atlas'],'animation',924,439,1,0);
        useSpine(res_sea['spine3.4_json'],res_sea['spine3.4_atlas'],'octopus_act',2758,412,1,0);
        //var spineBoy = new sp.SkeletonAnimation(res_sea['spine3.4_json'],res_sea['spine3.4_atlas']);
        //var bone=spineBoy.findBone('bone');
        ////bone.setColor(cc.color(66,0,255,255));
        //bone.scaleY=5;
        //cc.log(bone);
        //spineBoy.setPosition(500, 500);
        //spineBoy.setAnimation(0, 'octopus_act', true);//trues时为一直循环播放
        //spineBoy.setVisible(true);
        //self.addChild(spineBoy,2);

        useSpine(res_sea['spine1.11_json'],res_sea['spine1.11_atlas'],'youdong',2155,755,1,3);
        ////2
        create_sea(0,res_sea["sea"],2,0,0);
        create_sea(1,res_sea.inkfish,2,2237,277);
        create_sea(1,res_sea.bottom,2,728,1366);
        set_animation1(self.sprite_array[2][self.sprite_array[2].length-1]);
        create_sea(1,res_sea.b1,2,277,1419);
        float_act(2,30);
        create_sea(1,res_sea.b2,2,530,1255);
        float_act(2,-40);
        useSpine(res_sea['spine2.1_json'],res_sea['spine2.1_atlas'],'lantern_fly',1226,684,2,3);//light fish黄色
        useSpine(res_sea['spine2.2_json'],res_sea['spine2.2_atlas'],'animation',866,462,2,0);
        useSpine(res_sea['spine2.2_json'],res_sea['spine2.2_atlas'],'animation',722,509,2,0);
        flipxy(2,1);


        ////3
        create_sea(0,res_sea["pic1.37"],3,0,0);
        create_sea(0,res_sea["pic1.38"],3,0,0);
        create_sea(0,res_sea["pic1.33"],3,1.4,372);//rock1

        create_sea(1,res_sea["pic1.3"],3,785,782);//小蓝鱼1
        create_sea(1,res_sea["pic1.3"],3,742,764);//小蓝鱼2
        fish(self.sprite_array[3][self.sprite_array[3].length-1],self.sprite_array[3][self.sprite_array[3].length-2]);
        //self.sprite_array[3][3].runAction(cc.follow(self.sprite_array[3][4]),cc.rect(0,0,100,100));
        func_one(self.sprite_array[3][3],self.sprite_array[3][4]);
        create_sea(1,res_sea["pic1.4"],3,1182,479);//小黄鱼1
        create_sea(1,res_sea["pic1.4"],3,1234,434);//小黄鱼2
        fish(self.sprite_array[3][self.sprite_array[3].length-1],self.sprite_array[3][self.sprite_array[3].length-2]);
        create_sea(1,res_sea["pic1.5"],3,730,246);//贝壳1
        create_sea(1,res_sea["pic1.5"],3,229,324);//贝壳2
        create_sea(1,res_sea["pic1.5"],3,335,156);//贝壳3
        create_sea(1,res_sea["pic1.5"],3,605,129);//贝壳4
        create_sea(1,res_sea["pic1.6"],3,91,381);//贝壳5
        create_sea(1,res_sea["pic1.6"],3,304,299);//贝壳6
        create_sea(1,res_sea["pic1.6"],3,834,66);//贝壳7

        create_sea(1,res_sea["pic1.8"],3,801,353);//黄鱼
        self.sprite_array[3][self.sprite_array[3].length-1].runAction(cc.sequence(cc.moveBy(30,500,0),cc.flipX(true),cc.moveBy(30,-500,0),cc.flipX(false)).repeatForever());
        create_sea(1,res_sea["pic1.12"],3,593,325);//g海星1
        create_sea(1,res_sea["pic1.12"],3,79,568);//
        create_sea(1,res_sea["pic1.13"],3,509,203);//r海星1
        create_sea(1,res_sea["pic1.13"],3,44,441);//
        create_sea(1,res_sea["pic1.14"],3,931,148);//y海星1
        create_sea(1,res_sea["pic1.14"],3,262,227);//
        create_sea(1,res_sea["pic1.16"],3,21,607);//黑匣子
        useSpine(res_sea['fish3_json'],res_sea['fish3_atlas'],'animation',297,878,3,0);//一条蓝鱼,箱子里的
        useSpine(res_sea['fish5_json'],res_sea['fish5_atlas'],'animation',141,868,3,0);//一条黄鱼,箱子里的
        useSpine(res_sea['fish3_json'],res_sea['fish3_atlas'],'animation',384,911,3,0);//一条蓝鱼，箱子里的

        create_sea(1,res_sea["pic1.17"],3,617,176);//箱子

        create_sea(1,res_sea["pic1.21"],3,500,383);//珊瑚
        create_sea(1,res_sea["pic1.22"],3,200,183);//珊瑚
        create_sea(1,res_sea["pic1.26"],3,968,113);//grass1
        create_sea(1,res_sea["pic1.26"],3,119,180);//grass1
        create_sea(1,res_sea["pic1.26"],3,22,311);//grass1
        create_sea(1,res_sea["pic1.27"],3,708,88);//grass2
        create_sea(1,res_sea["pic1.28"],3,18,568);//grass4
        create_sea(1,res_sea["pic1.28"],3,341,522);//grass4
        create_sea(1,res_sea["pic1.28"],3,158,317);//grass4
        create_sea(1,res_sea["pic1.29"],3,1081,61);//grass5
        create_sea(1,res_sea["pic1.29"],3,704,301);//grass5
        useSpine(res_sea['fish3_json'],res_sea['fish3_atlas'],'animation',364,316,3,0);//一条蓝鱼
        self.sprite_array[3][self.sprite_array[3].length-1].runAction(cc.sequence(cc.moveBy(30,-500,0),cc.flipX(true),cc.moveBy(30,500,0),cc.flipX(false)).repeatForever());
        useSpine(res_sea['spine1.1_json'],res_sea['spine1.1_atlas'],'purple_ spread',887,216,3,0);
        useSpine(res_sea['spine1.3_json'],res_sea['spine1.3_atlas'],'corall_fly',504,370,3,0);
        useSpine(res_sea['spine1.2_json'],res_sea['spine1.2_atlas'],'yellow_act',571,374,3,0);
        //
        useSpine(res_sea['spine1.4_json'],res_sea['spine1.4_atlas'],'coral2_fly',130,148,3,0);
        useSpine(res_sea['spine1.5_json'],res_sea['spine1.5_atlas'],'animation',834,66,3,0);
        useSpine(res_sea['spine1.7_json'],res_sea['spine1.7_atlas'],'animation',281,432,3,0);
        useSpine(res_sea['spine1.8_json'],res_sea['spine1.8_atlas'],'animation',464,592,3,2);//海龙
        //flipxy(3,1);
        useSpine(res_sea['spine1.9_json'],res_sea['spine1.9_atlas'],'shark_fly',1373,1084,3,1);//鲨鱼
        useSpine(res_sea['spine1.10_json'],res_sea['spine1.10_atlas'],'animation',2521,400,3,2);//潜水艇

        //多放几个浮游生物
        useSpine(res_sea['spine3.5_json'],res_sea['spine3.5_atlas'],'swim_fly',900,1200,3,4);
        useSpine(res_sea['spine3.6_json'],res_sea['spine3.6_atlas'],'swim02',900,900,3,4);
        useSpine(res_sea['spine3.5_json'],res_sea['spine3.5_atlas'],'swim_fly',600,900,3,4);
        useSpine(res_sea['spine3.6_json'],res_sea['spine3.6_atlas'],'swim02',1200,900,3,4);
        useSpine(res_sea['spine3.5_json'],res_sea['spine3.5_atlas'],'swim_fly',1900,1200,3,4);
        useSpine(res_sea['spine3.6_json'],res_sea['spine3.6_atlas'],'swim02',2100,900,3,4);


        useSpine(res_sea['fish1_json'],res_sea['fish1_atlas'],'animation',1200,1200,3,0);
        useSpine(res_sea['fish1_json'],res_sea['fish1_atlas'],'animation',1220,1220,3,0);//鸳鸯蓝鱼骨骼动画
        fish(self.sprite_array[3][self.sprite_array[3].length-1],self.sprite_array[3][self.sprite_array[3].length-2]);

        useSpine(res_sea['fish2_json'],res_sea['fish2_atlas'],'animation',1800,1200,3,0);
        useSpine(res_sea['fish2_json'],res_sea['fish2_atlas'],'animation',1850,1150,3,0);//鸳鸯黄鱼骨骼动画
        fish(self.sprite_array[3][self.sprite_array[3].length-1],self.sprite_array[3][self.sprite_array[3].length-2]);

       // useSpine(res_sea['end_json'],res_sea['end_atlas'],'act',1800,1200,3,0);
        create_sea(0,res_sea["pic1.34"],3,0,0);//rock2
        create_sea(1,res_sea["pic1.27"],3,289,59);//grass2
        create_sea(1,res_sea["pic1.35"],3,454,347);//stone
        self.click_positon(self.sprite_array);
        self.get_max();
    },
    //模拟scrollView效果的函数
    click_positon:function(sprite){
        self1=this;
        cc.eventManager.addListener({
            event: cc.EventListener.TOUCH_ONE_BY_ONE,
            onTouchBegan: function (touch) {
                self1.location=touch.getLocation();
                return true;
            },
            onTouchMoved: function (touch) {
                var location_new=touch.getLocation();
                if(self.sprite_array[0][0].y<=0 && self.sprite_array[0][0].y>=-1151 && self.sprite_array[0][0].x<=0 && self.sprite_array[0][0].x>=-2054 ){
                    var delta_x=location_new.x-self1.location.x;
                    var delta_y=location_new.y-self1.location.y;
                    if(self.move_or_swim==0) {
                        for (var i = 0; i < sprite.length; i++) {
                            for (var j = 0; j < sprite[i].length; j++) {
                                sprite[i][j].setPosition(sprite[i][j].getPosition().x + delta_x, sprite[i][j].getPosition().y + delta_y);
                            }
                        }//bg
                    }
                    self1.location = location_new;
                }
                return true;
            },
            onTouchEnded: function () {
                //点击事件结束后，世界地图矫正，bounceable效果
                var delta_x=0;
                var delta_y=0;
                if(self.sprite_array[0][0].y>-50) {
                    delta_y = -self.sprite_array[0][0].y-50;
                }else if(self.sprite_array[0][0].y<-1051){
                    delta_y = -1151 -self.sprite_array[0][0].y+50;
                }
                if(self.sprite_array[0][0].x>-50) {
                    delta_x = -self.sprite_array[0][0].x-50;
                }else if(self.sprite_array[0][0].x<-1954){
                    delta_x = -2054 -self.sprite_array[0][0].x+50;
                }
                for(var i=0;i<sprite.length;i++){
                    for(var j=0;j<sprite[i].length;j++) {
                        if(self.sprite_array[i][j]!=self.choosed[0] && self.sprite_array[i][j]!=self.choosed[1]) {
                        sprite[i][j].runAction(cc.moveTo(1,sprite[i][j].getPosition().x+delta_x, sprite[i][j].getPosition().y + delta_y));
                        }
                    }
                }
                return true;
            }
        },self);
    },
    //获取maxlocation的方法
    get_max:function(){
        for (var i = 0; i < self.sprite_array.length; i++) {
            for (var j = 0; j < self.sprite_array[i].length; j++) {
                self.max_location[i][0][j]=self.sprite_array[i][j].getPosition().y;
                self.max_location[i][1][j]=self.sprite_array[i][j].getPosition().y-1151;
                self.max_location[i][2][j]=self.sprite_array[i][j].getPosition().x;
                self.max_location[i][3][j]=self.sprite_array[i][j].getPosition().x-2054;
            }
        }
    },
    //随时查看是否超出边界
    update:function(dt)
    {
        if(self.sprite_array[0][0].y>0){
            for (var i = 0; i < self.sprite_array.length; i++) {
                for (var j = 0; j < self.sprite_array[i].length; j++) {
                        self.sprite_array[i][j].stopActionByTag(1);
                        if(self.sprite_array[i][j]!=self.choosed[0] && self.sprite_array[i][j]!=self.choosed[1]) {
                            self.sprite_array[i][j].setPosition(self.sprite_array[i][j].getPosition().x, self.max_location[i][0][j]);
                        }
                    }
            }
        }else if(self.sprite_array[0][0].y<-1151){
            for (var i = 0; i < self.sprite_array.length; i++) {
                for (var j = 0; j < self.sprite_array[i].length; j++) {
                    self.sprite_array[i][j].stopActionByTag(1);
                    if(self.sprite_array[i][j]!=self.choosed[0] && self.sprite_array[i][j]!=self.choosed[1]) {
                        self.sprite_array[i][j].setPosition(self.sprite_array[i][j].getPosition().x, self.max_location[i][1][j]);
                    }
                }
            }
        }
        if(self.sprite_array[0][0].x>0){
            for (var i = 0; i < self.sprite_array.length; i++) {
                for (var j = 0; j < self.sprite_array[i].length; j++) {
                self.sprite_array[i][j].stopActionByTag(1);
                    if(self.sprite_array[i][j]!=self.choosed[0] && self.sprite_array[i][j]!=self.choosed[1]) {
                        self.sprite_array[i][j].setPosition(self.max_location[i][2][j], self.sprite_array[i][j].getPosition().y);
                    }
                }
            }
        }else if(self.sprite_array[0][0].x<-2054){
            for (var i = 0; i < self.sprite_array.length; i++) {
                for (var j = 0; j < self.sprite_array[i].length; j++) {
                    self.sprite_array[i][j].stopActionByTag(1);
                    if(self.sprite_array[i][j]!=self.choosed[0] && self.sprite_array[i][j]!=self.choosed[1]) {
                        self.sprite_array[i][j].setPosition(self.max_location[i][3][j], self.sprite_array[i][j].getPosition().y);
                    }
                }
            }
        }
    }
});
var StartScene = cc.Scene.extend({
    onEnter:function () {
        this._super();
        var layer = new HelloWorldLayer();
        this.addChild(layer);
    }
});