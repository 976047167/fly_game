"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Controller = /** @class */ (function () {
    function Controller(obj) {
        this.isDown = false;
        this.position = { x: 0, y: 0 };
        this.obj = obj;
        this.addListener();
    }
    Controller.prototype.addListener = function () {
        document.addEventListener('touchstart', this.onMouseDown.bind(this), false);
        document.addEventListener('touchmove', this.onMouseMove.bind(this), false);
        document.addEventListener('touchend', this.onMouseUp.bind(this), false);
    };
    Controller.prototype.onMouseDown = function (e) {
        console.log("down");
        console.log(e.touches);
        var touch = e.touches[0];
        this.isDown = true;
        this.position.x = touch.clientX;
        this.position.y = touch.clientY;
    };
    Controller.prototype.onMouseMove = function (e) {
        if (this.isDown === false)
            return;
        console.log(e);
        var touch = e.touches[0];
        this.obj.position.x += (touch.clientX - this.position.x) / 5000;
        this.obj.position.y -= (touch.clientY - this.position.y) / 5000;
    };
    Controller.prototype.onMouseUp = function (e) {
        console.log("up");
        console.log(this.obj.position);
        this.isDown = false;
    };
    return Controller;
}());
exports.default = Controller;
//# sourceMappingURL=controller.js.map