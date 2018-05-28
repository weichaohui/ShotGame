// Learn cc.Class:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/class.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/class.html
// Learn Attribute:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/life-cycle-callbacks.html
var PLAYER_STATUS = {
    IDLE: 0,//站立
    WALK: 1,//行走
    RUN: 2,//奔跑
    SHOOT: 3,//射击
    JUMP: 4,//跳跃
    JUMP_END: 5,
    BOARD: 6,//滑板
    HIT: 7,//被攻击
    DIE: 8,//死亡

};

var TRACK_INDEX = {
    WALK: 0,
    HIT: 1,
    SHOOT: 2,
};

var Util = require("./Common/Util");
var Animal = require("Animal");
var DIRECTION = Util.DIRECTION;

//animation: death, hit idle jump run shoot walk
cc.Class({
    extends: Animal,

    properties: {
        doubleClickDuration: {
            default: 200,
            displayName: "double click duration",
            tooltip: "double click duration to run",
        },

        bulletPrefab: {
            default: null,
            type: cc.Prefab
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

        this.anim = this.getComponent(cc.Animation);
        this.enventInit();
        this.direction = DIRECTION.RIGHT;
        this.idle();
        this.parentBounds = this.node.parent.getComponent("Background").getBounds();

        this.lastDTime = 0, this.lastATime = 0;
    },

    onAnimationStatusChange(target, trackEntry, eventType) {
        if (eventType == sp.AnimationEventType.COMPLETE) {
            //动画结束
            switch (trackEntry.animation.name) {
                case "jump":
                    this.status = PLAYER_STATUS.JUMP_END;
                    this.idle();
                    break;
                case "hit":
                    this.idle();
                    break;
                case "death":
                    this.node.destroy();
                    this.over();
                    break;
                default:
                    break;
            }
        }
    },

    walk(direction) {
        if (this.status != PLAYER_STATUS.WALK && this.status != PLAYER_STATUS.JUMP && this.direction != direction) {
            this.info("walk");
            this.direction = direction;
            this.skeleton.setAnimation(TRACK_INDEX.WALK, "walk", true);
            this.status = PLAYER_STATUS.WALK;
            Util.updateDirection(this.node, this.direction);
        }
    },

    run(direction) {
        if (this.status != PLAYER_STATUS.RUN && this.status != PLAYER_STATUS.JUMP || this.direction != direction) {
            this.info("run");
            this.direction = direction;
            this.skeleton.setAnimation(TRACK_INDEX.WALK, "run", true);
            this.status = PLAYER_STATUS.RUN;
            Util.updateDirection(this.node, this.direction);
            // Util.trace();
        }
    },

    jump() {
        if (this.status != PLAYER_STATUS.JUMP) {
            this.info("jump");
            this.skeleton.setAnimation(TRACK_INDEX.WALK, "jump", false);
            this.lastStatus = this.status;
            this.status = PLAYER_STATUS.JUMP;

            this.anim.play("PlayerJump");
        }
    },

    beenHit(monster) {
        var state = this.anim.play("BeenHit");
        this.status = PLAYER_STATUS.HIT;
        this.skeleton.setAnimation(TRACK_INDEX.WALK, "hit", false);
        state.repeatCount = 6;
        this._super(monster);
    },

    idle() {
        if (this.status != PLAYER_STATUS.IDLE && this.status != PLAYER_STATUS.JUMP) {
            this.info("idle");
            this.status = PLAYER_STATUS.IDLE;
            this.skeleton.setAnimation(TRACK_INDEX.WALK, "idle", true);
            Util.updateDirection(this.node, this.direction);
            // Util.trace();
        }
    },

    shoot() {
        if (this.status != PLAYER_STATUS.JUMP) {
            this.info("shoot");
            this.skeleton.setAnimation(TRACK_INDEX.SHOOT, "shoot", false);

            this.bullet = cc.instantiate(this.bulletPrefab);
            this.node.parent.addChild(this.bullet);
            this.bullet.getComponent("Bullet").init(this.direction, this.node.x + 200 * this.direction, this.node.y + 150, this.damage);
        }
    },

    onDie() {
        this.skeleton.clearTracks();
        this.skeleton.setAnimation(1, "death", false);
        this.status = PLAYER_STATUS.DIE;
        this.info("die...");
    },

    onKeyDowm(envent) {
        var now = new Date().getTime();
        switch (event.keyCode) {
            case cc.KEY.d:
                if (now - this.lastDTime < this.doubleClickDuration) {
                    this.run(DIRECTION.RIGHT);
                } else {
                    this.walk(DIRECTION.RIGHT);
                }
                this.lastDTime = now;
                break;
            case cc.KEY.a:
                if (now - this.lastATime < this.doubleClickDuration) {
                    this.run(DIRECTION.LEFT);
                } else {
                    this.walk(DIRECTION.LEFT);
                }
                this.lastATime = now;
                break;
            case cc.KEY.space:
                this.jump();
                break;
            case cc.KEY.q:
                this.shoot();
                break;
            default:
                break;
        }
    },

    onKeyUp(event) {
        switch (event.keyCode) {
            case cc.KEY.d:
            case cc.KEY.a:
                this.info("key up");
                this.idle();
                break;
        }
    },

    enventInit() {
        //this.node.on(cc.Node.EventType.KEY_DOWN, event => {
        cc.systemEvent.on(cc.SystemEvent.EventType.KEY_DOWN, this.onKeyDowm, this);

        //this.node.on(cc.Node.EventType.KEY_DOWN, event => {
        cc.systemEvent.on(cc.SystemEvent.EventType.KEY_UP, this.onKeyUp, this);
    },

    //碰撞进入
    onCollisionEnter(other, self) {
        if (this.isAlive()) {
            if (other.node.getName() == "monster") {
                this.info(other + "collision with player enter.");
                this.beenHit(other.node.getComponent("Monster"));
            }
        }
    },

    //碰撞离开
    onCollisionExit(other, self) {
        this.info(other + "collision with player exit");
    },

    moveable() {
        var status = this.status;

        if (status == PLAYER_STATUS.JUMP) {
            status = this.lastStatus;
        }
        return status == PLAYER_STATUS.WALK || status == PLAYER_STATUS.RUN;
    },

    nowSpeed() {
        return this.runSpeed * this.direction;
    },

    update(dt) {
        this._super(dt);
    },

    isAlive() {
        return this.status != PLAYER_STATUS.DIE;
    },

    over() {
        cc.systemEvent.off(cc.SystemEvent.EventType.KEY_DOWN, this.onKeyDowm);

        cc.systemEvent.off(cc.SystemEvent.EventType.KEY_UP, this.onKeyUp);
    }
});
