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
        target: {
            default: null,
            type: cc.Node
        }
    },

    // use this for initialization
    onLoad: function () {

    },

    start() {
        this.camera = this.getComponent(cc.Camera);
        this.parentBounds = this.node.parent.getComponent("Background").getBounds();
    },

    onEnable: function () {
        //cc.director.getPhysicsManager().attachDebugDrawToCamera(this.camera);
    },
    onDisable: function () {
        // cc.director.getPhysicsManager().detachDebugDrawFromCamera(this.camera);
    },

    // called every frame, uncomment this function to activate update callback
    lateUpdate: function (dt) {
        let targetPos = this.target.convertToWorldSpaceAR(cc.Vec2.ZERO);
        let playerInParent = this.node.parent.convertToNodeSpaceAR(targetPos);
        // this.node.x = playerInParent.x;
        let parentLeft = this.parentBounds.left;
        let parentRight = this.parentBounds.right;

        if (playerInParent.x < parentLeft + this.camera.viewPort.width / 2) {
            this.node.x = parentLeft + this.camera.viewPort.width / 2;
        } else if (playerInParent.x > parentRight - this.camera.viewPort.width / 2) {
            this.node.x = parentRight - this.camera.viewPort.width / 2;
        } else {
            this.node.x = playerInParent.x;
        }
        // cc.log("camera node x:" + this.node.x);

        // let ratio = targetPos.y / cc.winSize.height;
        // this.camera.zoomRatio = 1 + (0.5 - ratio) * 0.5;
    },
});
