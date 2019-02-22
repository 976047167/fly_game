"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
var spherePool_1 = __importDefault(require("./spherePool"));
var controller_1 = __importDefault(require("./controller"));
var stats_1 = __importDefault(require("./stats"));
var THREE = __importStar(require("three"));
var Main = /** @class */ (function () {
    function Main() {
        this.updateFuncs = [];
        this._time = 0;
        this.placeLastTime = 0;
        this.placeInterval = 2000;
        this.length = 0.7;
        this.speed = 0.001;
        this.camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 0.01, 10000);
        this.camera.position.z = 1;
        this.scene = new THREE.Scene();
        this.scene.add(this.camera);
        canvas.width *= window.devicePixelRatio;
        canvas.height *= window.devicePixelRatio;
        this.canvasWebgl = document.createElement('canvas');
        this.canvasWebgl.width *= window.devicePixelRatio;
        this.canvasWebgl.height *= window.devicePixelRatio;
        var ctx = this.canvasWebgl.getContext('webgl');
        this.renderer = new THREE.WebGLRenderer({ context: ctx, antialias: true });
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.setPixelRatio(window.devicePixelRatio);
        this.createObj();
        document.body.appendChild(this.renderer.domElement);
        requestAnimationFrame(this.render.bind(this));
    }
    Main.prototype.render = function () {
        requestAnimationFrame(this.render.bind(this));
        this.renderer.render(this.scene, this.camera);
        var ctx = canvas.getContext('2d');
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(this.canvasWebgl, 0, 0);
        var delta = performance.now() - this._time;
        this._time = performance.now();
        this.updateFuncs.map(function (f) {
            f(delta);
        });
    };
    Main.prototype.registerUpdate = function (f) {
        this.updateFuncs.push(f);
    };
    Main.prototype.createObj = function () {
        this.createStats();
        this.createPlayer();
        this.createGround();
        this.createSphere();
    };
    Main.prototype.createStats = function () {
        var stats = new stats_1.default(this.renderer);
        this.registerUpdate(function (delta) {
            stats.update();
            var ctx = canvas.getContext("2d");
            ctx.drawImage(stats.dom, 0, 0);
        });
    };
    Main.prototype.createPlayer = function () {
        var _this = this;
        var geometry = new THREE.BoxGeometry(0.15, 0.15, 0.15);
        var material = new THREE.MeshNormalMaterial();
        var mesh = new THREE.Mesh(geometry, material);
        var pointLight = new THREE.PointLight("#ccffcc");
        pointLight.distance = 10;
        pointLight.intensity = 1;
        mesh.add(pointLight);
        controller_1.default.instance.registerMouseMove(function (e, deltaPos) {
            mesh.position.x += deltaPos.x / 1000;
            mesh.position.y -= deltaPos.y / 1000;
        });
        this.registerUpdate(function (delta) {
            mesh.rotation.x += 0.01;
            mesh.rotation.y += 0.02;
            if (Math.abs(mesh.position.x) > _this.length / 2 - 0.07) {
                mesh.position.x = mesh.position.x > 0 ? _this.length / 2 - 0.07 : -_this.length / 2 + 0.07;
            }
            if (Math.abs(mesh.position.y) > _this.length / 2 - 0.07) {
                mesh.position.y = mesh.position.y > 0 ? _this.length / 2 - 0.07 : -_this.length / 2 + 0.07;
            }
            ;
        });
        this.scene.add(mesh);
    };
    Main.prototype.createGround = function () {
        var backgroundGeometry = new THREE.PlaneGeometry(this.length, this.length * 6);
        // const backgroundMaterial = new THREE.MeshNormalMaterial();
        var backgroundMaterial = new THREE.MeshPhongMaterial({ color: 0xf0f0f0 });
        // const depthMaterial = new THREE.MeshDepthMaterial();
        var background = new THREE.Mesh(backgroundGeometry, backgroundMaterial);
        // const background = new THREE.SceneUtil.createMultiMaterialObject(backgroundGeometry, [backgroundMaterial,depthMaterial]);
        background.rotation.set(-0.5 * Math.PI, 0, 0);
        var point = new THREE.Object3D();
        point.add(background);
        var y = new THREE.Vector3(0, 0, -1);
        background.translateOnAxis(y, this.length / 2);
        this.scene.add(point);
        for (var i = 0; i < 3; i++) {
            var clone = point.clone();
            var v = new THREE.Vector3(0, 0, 1);
            clone.rotateOnAxis(v, 0.5 * Math.PI);
            point = clone;
            this.scene.add(point);
        }
    };
    Main.prototype.createSphere = function () {
        var _this = this;
        var spherePool = new spherePool_1.default(this.scene);
        var spheres = [];
        this.registerUpdate(function (delta) {
            spheres = spheres.filter(function (sphere) {
                sphere.position.z += _this.speed * delta;
                if (sphere.position.z > _this.length * 0.4) {
                    spherePool.delSphere(sphere);
                    return false;
                }
                return true;
            });
            if (_this._time - _this.placeLastTime >= _this.placeInterval) {
                var sphere = spherePool.getSphere();
                sphere.position.set(_this.length * (Math.random() - 0.5), _this.length * (Math.random() - 0.5), -_this.length * 3);
                spheres.push(sphere);
                _this.placeLastTime = _this._time;
            }
        });
    };
    return Main;
}());
exports.default = Main;
//# sourceMappingURL=main.js.map