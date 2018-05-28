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
var Animal = require("Animal");
var DIRECTION = Util.DIRECTION;

var MONSTER_STATUS = {
    RUN: 0,//站立
    HIT: 1,//被攻击
    DIE: 2//死亡
};

var TAG = "[monster]";

cc.Class({
    extends: Animal,

    properties: {
        player: {
            default: null,
            type: cc.Node
        },

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
        this._super();
        this.run(DIRECTION.RIGHT);
    },

    onAnimationStatusChange(target, trackEntry, eventType) {
        if (eventType == sp.AnimationEventType.COMPLETE) {
            //动画结束
            switch (trackEntry.animation.name) {
                case "hit":
                    this.info("hit complete");
                    this.run(this.direction);
                    break;
                case "death":
                    this.node.destroy();
                    break;
                default:
                    break;
            }
        }
    },

    run(direction) {
        if (this.status != MONSTER_STATUS.RUN || this.direction != direction) {
            this.info("monster run");
            this.direction = direction;
            this.status = MONSTER_STATUS.RUN;
            this.skeleton.clearTracks();
            this.skeleton.setAnimation(0, "run", true);
            Util.updateDirection(this.node, this.direction);
            // Util.trace();
        }
    },

    beenHit(player) {
        this.info("monster been hit.");
        this.skeleton.clearTracks();
        this.skeleton.setAnimation(1, "hit", false);
        this.status = MONSTER_STATUS.HIT;
        this._super(player);
    },

    onDie() {
        this.skeleton.clearTracks();
        this.skeleton.setAnimation(1, "death", false);
        this.status = MONSTER_STATUS.DIE;
        this.info("die...");
    },

    moveable() {
        return true;
    },

    nowSpeed() {
        if (this.status == MONSTER_STATUS.RUN) {
            return this.runSpeed * this.direction;
        } else if (this.status == MONSTER_STATUS.HIT) {
            return 0;
        }
    },

    //右边走到顶
    onRightLimit() {
        this.run(DIRECTION.LEFT);
    },

    //左边走到顶
    onLeftLimit() {
        this.run(DIRECTION.RIGHT);
    },

    update(dt) {
        if (this.player.isValid && this.status != MONSTER_STATUS.DIE) {
            if (this.status != MONSTER_STATUS.HIT) {
                if (this.player.x < this.node.x - this.runSpeed * 2) {
                    this.run(DIRECTION.LEFT);
                } else if (this.player.x > this.node.x + this.runSpeed * 2) {
                    this.run(DIRECTION.RIGHT);
                }
            }

            this._super(dt);
        }
    },

    onCollisionEnter(other, self) {
        if (this.status != MONSTER_STATUS.DIE) {
            this.info("collision with monster enter.");
            if (other.node.getName() == 'bullet') {
                this.beenHit(other.node.getComponent("Bullet"));
            }
        }
    },

    onCollisionExit(other, self) {
        this.info("collision with monster. exit");
    }
});
