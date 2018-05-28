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
        totalBlood: 100,//总血量
        bloodBar: {
            default: null,
            type: cc.Node
        },
        damage: 10,//攻击力
        walkSpeed: 200,
        runSpeed: 400,
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
        this.remain = this.totalBlood;
        this.bloodBarComponent = this.bloodBar.getComponent("BloodBar");
        this.bloodBarComponent.setRemain(this.node.name, this.remain, this.totalBlood);
        this.skeletonInit();
    },

    skeletonInit() {
        this.skeleton = this.getComponent("sp.Skeleton");
        this.skeleton.setAnimationListener(this, this.onAnimationStatusChange);
    },

    //参数是攻击者
    beenHit(hiter) {
        this.remain -= hiter.damage;
        this.bloodBarComponent.setRemain(this.node.name, this.remain, this.totalBlood);
        this.info("been hit, remine " + this.blood + " blood left");

        if (this.remain <= 0) {
            this.onDie();
        }
    },

    onDie() {

    },

    //当前是否可移动
    moveable() {
        return false;
    },

    //当前的速度，可为负数
    nowSpeed() {
        return 0;
    },

    //可移动的范围
    moveArea() {
        return this.node.parent.getComponent(BaseComponent).getBounds();
    },

    //右边走到顶
    onRightLimit() {

    },

    //左边走到顶
    onLeftLimit() {

    },

    update(dt) {
        if (this.moveable()) {
            this.node.x += this.nowSpeed() * dt;

            var moveArea = this.moveArea();
            if (this.node.x < moveArea.left) {
                this.node.x = moveArea.left;
                this.onLeftLimit();
            } else if (this.node.x > moveArea.right) {
                this.node.x = moveArea.right
                this.onRightLimit();
            }
        }
    },

    // update (dt) {},
});
