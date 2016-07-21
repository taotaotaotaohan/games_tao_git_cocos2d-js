/**
 * Created by taohan on 16/7/13.
 */
var endLayer = cc.Layer.extend({
    ctor:function () {
        this._super();
        //读取配置信息

        return true;

    }

});

var endScene = cc.Scene.extend({
    ctor:function () {
        this._super();
        var layer = new endLayer();
        this.addChild(layer);
    }
});
