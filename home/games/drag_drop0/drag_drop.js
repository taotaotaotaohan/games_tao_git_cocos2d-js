var drag_drop_layer = homebacklayer.extend({
    ctor:function (config) {
        this._super();
        //读取配置信息
        cc.log(config);
        var config_info = json_parse(config);
        var size = cc.winSize;
        this.sprite_array=[];
        var mid;//中间量，用于生成每一个精灵
        self=this;
        //精灵的动画创建函数(精灵，动画类型，是否idle)
        //create_animation
        //创建精灵的函数（精灵编号，图片源头，scale，x，y，z）
        //create
        //动画搜集函数，输入，一个图片对象
        //find_ani
        //事件绑定函数(精灵，目标，源)
        //event_sprite
        self.animal=[];//用来存放动画的对象，下标和精灵创建顺序一致
        //创建背景
        create(mid,config_info.background_img,config_info.scale,size.width/2,size.height/2,0);
        self.animal.push(0);//背景没有动画
        //创建其他事物
        for(var i=0;i<config_info.images.length;i++){
            create(mid,config_info.images[i].res,parseFloat(config_info.images[i].scale),config_info.images[i].x,config_info.images[i].y,1);
            find_ani(config_info.images[i]);//动画搜索
        }
        var count=self.sprite_array.length;//非动作事物的个数，用于事件绑定的时候定位
        //创建动作事物
        for(var i=0;i<config_info.sprites.length;i++) {
            create(mid,config_info.sprites[i].org_res,parseFloat(config_info.sprites[i].scale),config_info.sprites[i].org_pos_x,config_info.sprites[i].org_pos_y,2);
            find_ani(config_info.sprites[i]);
        }
        //创建start动画
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
        //事件绑定调用
        for(var i=0;i<config_info.sprites.length;i++) {
            event_sprite(self.sprite_array[count+i], config_info.sprites[i].target_pos_x, config_info.sprites[i].target_pos_y, config_info.sprites[i].org_pos_x, config_info.sprites[i].org_pos_y);
        }
        //创建返回键
        return true;
    }
});

var drag_drop_scene = cc.Scene.extend({
    ctor:function(config){
        this._super();
        var layer = new drag_drop_layer(config);
        this.addChild(layer);
    }
});
