// Learn cc.Class:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/class.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/class.html
// Learn Attribute:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/life-cycle-callbacks.html

var Util = require("./Common/Util");
var DIRECTION = Util.DIRECTION;
var BaseComponent = require("./Common/BaseComponent");

cc.Class({
    extends: BaseComponent,

    properties: {
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

    init(direction, x, y, damage) {
        this.node.x = x;
        this.node.y = y;
        this.damage = damage;
        Util.updateDirection(this.node, direction);
        var action = cc.moveTo(1, cc.p(x + this.node.parent.width * direction, y));
        this.node.runAction(action);
    },
    onCollisionEnter(other, self) {
        this.info("collision with monster enter.");
        if (other.node.getName() == 'monster') {
            // this.beenHit();
            this.node.destroy();
        }
    },

    onCollisionExit(other, self) {
        this.info("collision with monster. exit");
    }

    // update (dt) {},
});
