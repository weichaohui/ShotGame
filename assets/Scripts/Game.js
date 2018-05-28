
var BaseComponent = require("./Common/BaseComponent");
cc.Class({
    extends: BaseComponent,

    properties: {
        label: {
            default: null,
            type: cc.Label
        },
        // defaults, set visually when attaching this script to the Canvas
        text: 'Hello, World!'
    },


    // use this for initialization
    onLoad: function () {
        //this.label.string = this.text;
        cc.log("Canvas onload");
        this.collisionInit();
    },

    //碰撞系统初始化
    collisionInit() {
        this.collisionManager = cc.director.getCollisionManager();
        this.collisionManager.enabled = true;
        // this.collisionManager.enabledDebugDraw = true;
    },

    start() {
        cc.log("Canvas start");
    },

    // called every frame
    update: function (dt) {

    },
});

