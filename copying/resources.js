/**
 * Created by taohan on 16/5/26.
 */
//资源项
var res = {
    "default0":"res/shape_triangle_default@2x.png",
    "selected0":"res/shape_triangle_selected@2x.png",
    "default1":"res/shape_round_default@2x.png",
    "selected1":"res/shape_round_selected@2x.png",
    "arrow1":"res/arrow.png",
    "bg_mask":"res/bg_mask@2x.png",
    "back":"res/btn_back_default@2x.png",
    "back1":"res/btn_back_pressed@2x.png",
    "start":"res/btn_start_default@2x.png",
    "start1":"res/btn_start_pressed@2x.png",
    "star":"res/star.png",
    "star1":"res/image_top_star_before@2x.png",
    "star2":"res/image_top_star_doing@2x.png",
    "star3":"res/image_top_star_full@2x.png",
    "ingame1":"res/ingame_button_topbar_help_normal.png",
    "ingame2":"res/ingame_image_topbar_dephmark.png",
    "ingame3":"res/ingame_image_topbar_progress_help.png",
    "bg":"res/numbertracing__background_x_A-aera.png",
    "close":"res/shapetracing_button_close@2x.png",
    "left":"res/shapetracing_image_leg_left@2x.png",
    "right":"res/shapetracing_image_leg_right@2x.png",
    "success":"res/shapetracing_success_mark@2x.png",
    "effect1":"res/shapetracking_effect01@2x.png",
    "effect2":"res/shapetracking_effect02@2x.png",
    "effect3":"res/shapetracking_effect_cloud@2x.png",
    "no_name":"res/shapetracking_image_starmon@2x.png",
    "no_name1":"res/shapetracking_image@2x.png",
    "start_bg":"res/bg_background@2x.png",
    "start_bg1":"res/bg_freechoice@2x.png",
    "dot1":"res/shapetracing_dot1@2x.png",
    "dot2":"res/shapetracing_recommend_common@2x.png"
};
//数据项
var which_pic=0;//当前展示的临摹形状序号
var xpoint=[[569,261,878],[575,438,334,290,300, 395,573,706,792, 856,821,708]];//描述各个形状的点集
var ypoint=[[583,49,49],[593,565,482,344,226, 99,48,74,152,304,435,553]];
var rota=[];//角度数组
var line_width=[];//线的宽度
var step=[40,90];//防跳转步长
//创建精灵函数 type=0 是不变的背景 ，type＝1是要变的
var create_sprite=function(res,x,y,s,z,type){
    var p=new cc.Sprite(res);
    p.scale=s;
    p.setPosition(x,y);
    self.addChild(p,z);
    if(type==1){
        self.sprite_array.push(p);
    }else if(type==2){
        self.sprite_array_start.push(p);
    }
    return true;
};
//创建文字函数
var create_text=function(words,x,y,s,type){
    var t=new ccui.Text(words,"AmericanTypewriter",s);
    t.setPosition(cc.p(x,y));
    if(type){
        t.setColor(255,255,255,255);
    }
    self.addChild(t,10);

};
//输入两个向量，输出夹角
var get_ang=function(x1,y1,x2,y2){
    var up=x1*x2+y1*y2;
    var down=Math.sqrt(x1*x1+y1*y1)*Math.sqrt(x2*x2+y2*y2);
    return (y1>=0)&&(down!=0)?-Math.acos(up/down)*180/3.14:Math.acos(up/down)*180/3.14;
};
//输入点集合，输出箭头应该rotateTo的值
var get_ang_array=function(xs,ys){
    rota=[];
    for(var i=0;i<xs.length;i++){
        rota.push(get_ang(xs[(i+1)%xs.length]-xs[i],ys[(i+1)%xs.length]-ys[i],1,0));
    }
};
//输入两个点，返回两点的距离
var get_points_dis=function(x1,y1,x2,y2){
    //var d=Math.square(x1-x2)+Math.square(y1-y2);
    var d=(x1-x2)*(x1-x2)+(y1-y2)*(y1-y2);
    return Math.sqrt(d);
};
//输入直线的两个点，和x3，返回x3到该直线距离
var get_dis=function(x1,y1,x2,y2,x3,y3){
    var k=(y2-y1)/(x2-x1);
    var b=y1-k*x1;
    var d=Math.abs((k*x3-y3+b)/(Math.sqrt(1+k*k)));
    return d;
};
//输入两个点，得到直线,第三个点如果距离这条线比较近，则投影到该条线段上，不能超出去
var get_line=function(x1,y1,x2,y2,x3,y3){
    var k=(y2-y1)/(x2-x1);
    var b=y1-k*x1;
    var d=Math.abs((k*x3-y3+b)/(Math.sqrt(1+k*k)));
    var x4=0;
    var y4=0;
    if(d<20){
        x4=(x3+y3*k-b*k)/(1+k*k);
        y4=x4*k+b;
    }
    var p_max=x1>x2?cc.p(x1,y1):cc.p(x2,y2);
    var p_min=x1>x2?cc.p(x2,y2):cc.p(x1,y1);
    if(x4>p_max.x){
        return p_max;
    }else if(x4<p_min.x){
        return p_min;
    }else{
        return cc.p(x4,y4);
    }
};
//输入n个点, [x], [y] ,position.x , position.y 得到当前应该处于的location
var get_polly=function(n,x,y,position_x,position_y){
    var i=self.seg;
    var lo=get_line(x[i],y[i],x[(i+1)%n],y[(i+1)%n],position_x,position_y);
    if(get_dis(x[(i+1)%n],y[(i+1)%n],x[(i+2)%n],y[(i+2)%n],self.drawNode_position.x,self.drawNode_position.y)<=10){
        self.seg++;
        self.sprite_array[0].rotation=rota[self.seg];
    }
    if(Math.abs(lo.x-self.drawNode_position.x)+Math.abs(lo.y-self.drawNode_position.y)<step[which_pic]) {
        if (get_points_dis(lo.x,lo.y,xpoint[which_pic][self.seg],ypoint[which_pic][self.seg])>get_points_dis(self.drawNode_position.x,self.drawNode_position.y,xpoint[which_pic][self.seg],ypoint[which_pic][self.seg])) {
            self.drawNode_position = lo;
            return lo;
        }else{
            cc.log("fan");
            cc.log(self.drawNode_position,self.sprite_array[0].getPosition());
            return self.drawNode_position;
        }
    }else{
        cc.log("yuan");
        return self.drawNode_position;
    }

};
var g_resources = [];
for (var i in res) {
    g_resources.push(res[i]);
}
