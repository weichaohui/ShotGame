// Learn cc.Class:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/class.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/class.html
// Learn Attribute:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/life-cycle-callbacks.html
var BaseComponent = require("./Common/BaseComponent");
cc.Class({
    extends: BaseComponent,

    properties: {
        border: 5,
        borderColor: {
            default: cc.Color.WHITE,
            type: cc.Color
        },
        playFillColor: {
            default: cc.Color.RED,
            type: cc.Color
        },
        monsterFillColor: {
            default: cc.Color.BLUE,
            type: cc.Color
        }
        // foo: {
        //     // ATTRIBUTES:
        //     default: null,        // The default value will be used only when the component attaching
        //                           // to a node for the first time
        //     type: cc.SpriteFrame, // optional, default is typeof default
        //     serializable: true,   // optional, default is true
        // },
        // bar: {
        //     get () {
        //         return this._bar;
        //     },
        //     set (value) {
        //         this._bar = value;
        //     }
        // },
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start() {
    },

    setRemain(type, remain, total) {
        this.remain = remain;
        if (type == "player") {
            this.draw(this.borderColor, this.playFillColor, remain, total);
        } else if (type == "monster") {
            this.draw(this.borderColor, this.monsterFillColor, remain, total);
        }

    },

    draw(borderColor, fillColor, remain, total) {
        var graphics = this.getComponent(cc.Graphics);

        graphics.clear();

        graphics.rect(0, 0, this.node.width, this.node.height);
        // graphics.fillColor = fillColor;//填充  
        graphics.strokeColor = borderColor;
        graphics.strokeColor.a = 100;
        graphics.lineWidth = this.border;
        graphics.stroke();
        // graphics.fill();

        graphics.rect(this.border / 2, this.border / 2, (this.node.width - this.border) * remain / total, this.node.height - this.border);
        graphics.fillColor = fillColor;
        graphics.fillColor.a = 200;
        graphics.lineWidth = 0;
        graphics.fill();

    },

    update(dt) {
    },
});
