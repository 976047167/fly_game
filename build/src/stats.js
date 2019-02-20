"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var controller_1 = __importDefault(require("./controller"));
var Stats = /** @class */ (function () {
    function Stats(renderer) {
        var _this = this;
        this.mode = 0;
        this.frames = 0;
        this.renderer = renderer;
        this.container = [];
        this.beginTime = (performance || Date).now();
        this.prevTime = this.beginTime;
        this.fpsPanel = this.addPanel(new Panel('FPS', '#0ff', '#002'));
        this.msPanel = this.addPanel(new Panel('MS', '#0f0', '#020'));
        this.drawcallPanel = this.addPanel(new Panel('DC', '#f08', '#201'));
        if (self.performance && self.performance.memory) {
            this.memPanel = this.addPanel(new Panel('MB', '#f08', '#201'));
        }
        this.showPanel(0);
        controller_1.default.instance.registerMouseDown(function (e) {
            _this.showPanel(++_this.mode % _this.container.length);
        });
    }
    Object.defineProperty(Stats.prototype, "dom", {
        get: function () {
            return this.offcanvas;
        },
        enumerable: true,
        configurable: true
    });
    Stats.prototype.addPanel = function (panel) {
        this.container.push(panel.dom);
        return panel;
    };
    Stats.prototype.showPanel = function (id) {
        this.offcanvas = this.container[id];
        this.mode = id;
    };
    Stats.prototype.begin = function () {
        this.beginTime = (performance || Date).now();
    };
    Stats.prototype.end = function () {
        this.frames++;
        var time = (performance || Date).now();
        this.msPanel.update(time - this.beginTime, 2000);
        if (time >= this.prevTime + 1000) {
            this.fpsPanel.update((this.frames * 1000) / (time - this.prevTime), 100);
            this.prevTime = time;
            this.frames = 0;
            this.drawcallPanel.update(this.renderer.info.render.calls, 100);
            if (this.memPanel) {
                var memory = performance.memory;
                this.memPanel.update(memory.usedJSHeapSize / 1048576, memory.jsHeapSizeLimit / 1048576);
            }
        }
        return time;
    };
    Stats.prototype.update = function () {
        this.beginTime = this.end();
    };
    return Stats;
}());
exports.default = Stats;
var Panel = /** @class */ (function () {
    function Panel(name, fg, bg) {
        this.min = Infinity;
        this.max = 0;
        this.round = Math.round;
        // private PR :number = this.round(window.devicePixelRatio || 1 );
        this.PR = 2;
        this.WIDTH = 80 * this.PR;
        this.HEIGHT = 48 * this.PR;
        this.TEXT_X = 3 * this.PR;
        this.TEXT_Y = 2 * this.PR;
        this.GRAPH_X = 3 * this.PR;
        this.GRAPH_Y = 15 * this.PR;
        this.GRAPH_WIDTH = 74 * this.PR;
        this.GRAPH_HEIGHT = 30 * this.PR;
        this.name = name;
        this.fg = fg;
        this.bg = bg;
        this.offcanvas = document.createElement('canvas');
        var ctx = this.offcanvas.getContext('2d');
        this.context = ctx;
        this.context.font = 'bold ' + (9 * this.PR) + 'px Helvetica,Arial,sans-serif';
        this.context.textBaseline = 'top';
        this.context.fillStyle = this.bg;
        this.context.fillRect(0, 0, this.WIDTH, this.HEIGHT);
        this.context.fillStyle = this.fg;
        this.context.fillText(this.name, this.TEXT_X, this.TEXT_Y);
        this.context.fillRect(this.GRAPH_X, this.GRAPH_Y, this.GRAPH_WIDTH, this.GRAPH_HEIGHT);
        this.context.fillStyle = this.bg;
        this.context.globalAlpha = 0.9;
        this.context.fillRect(this.GRAPH_X, this.GRAPH_Y, this.GRAPH_WIDTH, this.GRAPH_HEIGHT);
    }
    Object.defineProperty(Panel.prototype, "dom", {
        get: function () {
            return this.offcanvas;
        },
        enumerable: true,
        configurable: true
    });
    Panel.prototype.update = function (value, maxValue) {
        this.min = Math.min(this.min, value);
        this.max = Math.max(this.max, value);
        this.context.fillStyle = this.bg;
        this.context.globalAlpha = 1;
        this.context.fillRect(0, 0, this.WIDTH, this.GRAPH_Y);
        this.context.fillStyle = this.fg;
        this.context.fillText(this.round(value) + ' ' + this.name + ' (' + this.round(this.min) + '-' + this.round(this.max) + ')', this.TEXT_X, this.TEXT_Y);
        this.context.drawImage(this.offcanvas, this.GRAPH_X + this.PR, this.GRAPH_Y, this.GRAPH_WIDTH - this.PR, this.GRAPH_HEIGHT, this.GRAPH_X, this.GRAPH_Y, this.GRAPH_WIDTH - this.PR, this.GRAPH_HEIGHT);
        this.context.fillRect(this.GRAPH_X + this.GRAPH_WIDTH - this.PR, this.GRAPH_Y, this.PR, this.GRAPH_HEIGHT);
        this.context.fillStyle = this.bg;
        this.context.globalAlpha = 0.9;
        this.context.fillRect(this.GRAPH_X + this.GRAPH_WIDTH - this.PR, this.GRAPH_Y, this.PR, this.round((1 - (value / maxValue)) * this.GRAPH_HEIGHT));
    };
    return Panel;
}());
//# sourceMappingURL=stats.js.map