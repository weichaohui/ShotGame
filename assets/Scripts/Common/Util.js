module.exports = {
    DIRECTION: {
        LEFT: -1,
        UNDEFINED: 0,
        RIGHT: 1,
    },
    updateDirection: function (node, toDirection) {
        switch (toDirection) {
            case this.DIRECTION.LEFT:
                node.scaleX = -Math.abs(node.scaleX);
                break;
            case this.DIRECTION.RIGHT:
                node.scaleX = Math.abs(node.scaleX);
                break;
            case this.DIRECTION.UNDEFINED:
            default:
                break;
        }
    },
    /**
     * trace
     * @param [int] [count=10]
     */
    trace: function (count) {
        var caller = arguments.callee.caller;
        var i = 0;
        count = count || 10;
        cc.log("***----------------------------------------  ** " + (i + 1));
        while (caller && i < count) {
            cc.log(caller.toString());
            caller = caller.caller;
            i++;
            cc.log("***---------------------------------------- ** " + (i + 1));
        }
    }

};