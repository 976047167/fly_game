"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Controller = /** @class */ (function () {
    function Controller() {
        this.isDown = false;
        this.position = { x: 0, y: 0 };
        this.mouseDownHandler = [];
        this.mouseUpHandler = [];
        this.mouseMoveHandler = [];
        this.addListener();
    }
    Object.defineProperty(Controller, "instance", {
        get: function () {
            if (!this._instance) {
                this._instance = new Controller();
            }
            return this._instance;
        },
        enumerable: true,
        configurable: true
    });
    Controller.prototype.addListener = function () {
        document.addEventListener('touchstart', this.onMouseDown.bind(this), false);
        document.addEventListener('touchmove', this.onMouseMove.bind(this), false);
        document.addEventListener('touchend', this.onMouseUp.bind(this), false);
    };
    Controller.prototype.onMouseDown = function (e) {
        this.isDown = true;
        var touch = e.touches[0];
        this.position.x = touch.clientX;
        this.position.y = touch.clientY;
        this.mouseDownHandler.map(function (callback) {
            callback(e);
        });
    };
    Controller.prototype.onMouseMove = function (e) {
        if (this.isDown === false)
            return;
        var deltaPos = { x: 0, y: 0 };
        var touch = e.touches[0];
        deltaPos.x = touch.clientX - this.position.x;
        deltaPos.y = touch.clientY - this.position.y;
        this.position.x = touch.clientX;
        this.position.y = touch.clientY;
        this.mouseMoveHandler.map(function (callback) {
            callback(e, deltaPos);
        });
    };
    Controller.prototype.onMouseUp = function (e) {
        this.isDown = false;
        this.mouseUpHandler.map(function (callback) {
            callback(e);
        });
    };
    Controller.prototype.registerMouseUP = function (callback) {
        this.mouseUpHandler.push(callback);
    };
    Controller.prototype.registerMouseMove = function (callback) {
        this.mouseMoveHandler.push(callback);
    };
    Controller.prototype.registerMouseDown = function (callback) {
        this.mouseDownHandler.push(callback);
    };
    Controller.prototype.unRegisterMouseUP = function (callback) {
        this.mouseUpHandler = this.mouseUpHandler.filter(function (e) {
            return e !== callback;
        });
    };
    Controller.prototype.unRegisterMouseMove = function (callback) {
        this.mouseMoveHandler = this.mouseMoveHandler.filter(function (e) {
            return e !== callback;
        });
    };
    Controller.prototype.unRegisterMouseDown = function (callback) {
        this.mouseDownHandler = this.mouseDownHandler.filter(function (e) {
            return e !== callback;
        });
    };
    return Controller;
}());
exports.default = Controller;
//# sourceMappingURL=controller.js.map