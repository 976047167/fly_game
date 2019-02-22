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
        this.grounds = [];
        this.spheres = [];
        this._time = 0;
        this.placeLastTime = 0;
        this.placeInterval = 2000;
        this.length = 0.7;
        this.speed = 0.001;
        this.camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 0.01, 10000);
        this.camera2D = new THREE.OrthographicCamera(-window.innerWidth / 2, window.innerWidth / 2, window.innerHeight / 2, -window.innerHeight / 2);
        this.camera.position.z = 1;
        this.camera2D.position.z = 1;
        this.scene = new THREE.Scene();
        this.scene2D = new THREE.Scene();
        this.scene.add(this.camera);
        this.scene2D.add(this.camera2D);
        canvas.width *= window.devicePixelRatio;
        canvas.height *= window.devicePixelRatio;
        var ctx = canvas.getContext('webgl');
        this.renderer = new THREE.WebGLRenderer({ context: ctx, antialias: true });
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.setPixelRatio(window.devicePixelRatio);
        this.renderer.autoClear = false;
        this.stats = new stats_1.default(this.renderer);
        this.createObj();
        this.createUI();
        document.body.appendChild(this.renderer.domElement);
        requestAnimationFrame(this.render.bind(this));
    }
    Main.prototype.render = function () {
        requestAnimationFrame(this.render.bind(this));
        this.renderer.clear();
        this.renderer.render(this.scene, this.camera);
        this.renderer.clearDepth();
        var ctx = this.canvas2D.getContext('2d');
        this.stats.update();
        ctx.clearRect(0, 0, this.canvas2D.width, this.canvas2D.height);
        this.canvas2dTexture.needsUpdate = true;
        ctx.drawImage(this.stats.dom, 0, 0);
        this.renderer.render(this.scene2D, this.camera2D);
        var delta = performance.now() - this._time;
        this._time = performance.now();
        this.update(delta);
    };
    Main.prototype.createUI = function () {
        var offCanvas = document.createElement('canvas');
        offCanvas.width = this.ceilPowerOfTwo(offCanvas.width);
        offCanvas.height = this.ceilPowerOfTwo(offCanvas.height);
        var ctx = offCanvas.getContext('2d');
        if (ctx === null)
            return;
        this.canvas2dTexture = new THREE.Texture(offCanvas);
        this.canvas2D = offCanvas;
        var spMaterial = new THREE.SpriteMaterial({
            color: 0xffffff,
            map: this.canvas2dTexture
        });
        var sp = new THREE.Sprite(spMaterial);
        sp.center.set(0, 1);
        sp.scale.set(offCanvas.width, offCanvas.height, 1);
        sp.position.set(-window.innerWidth / 2, window.innerHeight / 2, 0);
        this.scene2D.add(sp);
    };
    Main.prototype.ceilPowerOfTwo = function (value) {
        return Math.pow(2, Math.ceil(Math.log(value) / Math.LN2));
    };
    Main.prototype.createObj = function () {
        this.createPlayer();
        var pointLight = new THREE.PointLight("#ccffcc");
        pointLight.distance = 10;
        pointLight.intensity = 1;
        this.mesh.add(pointLight);
        this.createGround();
        this.spherePool = new spherePool_1.default(this.scene);
        this.placeSphere();
    };
    Main.prototype.createPlayer = function () {
        var _this = this;
        this.geometry = new THREE.BoxGeometry(0.15, 0.15, 0.15);
        this.material = new THREE.MeshNormalMaterial();
        this.mesh = new THREE.Mesh(this.geometry, this.material);
        controller_1.default.instance.registerMouseMove(function (e, deltaPos) {
            _this.mesh.position.x += deltaPos.x / 1000;
            _this.mesh.position.y -= deltaPos.y / 1000;
        });
        this.scene.add(this.mesh);
    };
    Main.prototype.createGround = function () {
        var backgroundGeometry = new THREE.PlaneGeometry(this.length, this.length * 6);
        // const backgroundMaterial = new THREE.MeshNormalMaterial();
        var backgroundMaterial = new THREE.MeshPhongMaterial({ color: 0x777777 });
        // const depthMaterial = new THREE.MeshDepthMaterial();
        var background = new THREE.Mesh(backgroundGeometry, backgroundMaterial);
        // const background = new THREE.SceneUtil.createMultiMaterialObject(backgroundGeometry, [backgroundMaterial,depthMaterial]);
        background.rotation.set(-0.5 * Math.PI, 0, 0);
        var point = new THREE.Object3D();
        point.add(background);
        var y = new THREE.Vector3(0, 0, -1);
        background.translateOnAxis(y, this.length / 2);
        this.scene.add(point);
        this.grounds.push(point);
        for (var i = 0; i < 3; i++) {
            var clone = point.clone();
            var v = new THREE.Vector3(0, 0, 1);
            clone.rotateOnAxis(v, 0.5 * Math.PI);
            point = clone;
            this.scene.add(point);
            this.grounds.push(point);
        }
    };
    Main.prototype.update = function (delta) {
        this.updatePlayer();
        this.updateSphere(delta);
    };
    Main.prototype.updatePlayer = function () {
        this.mesh.rotation.x += 0.01;
        this.mesh.rotation.y += 0.02;
        if (Math.abs(this.mesh.position.x) > this.length / 2 - 0.07) {
            this.mesh.position.x = this.mesh.position.x > 0 ? this.length / 2 - 0.07 : -this.length / 2 + 0.07;
        }
        if (Math.abs(this.mesh.position.y) > this.length / 2 - 0.07) {
            this.mesh.position.y = this.mesh.position.y > 0 ? this.length / 2 - 0.07 : -this.length / 2 + 0.07;
        }
    };
    Main.prototype.updateSphere = function (delta) {
        var _this = this;
        this.spheres = this.spheres.filter(function (sphere) {
            sphere.position.z += _this.speed * delta;
            if (sphere.position.z > _this.length * 0.4) {
                _this.spherePool.delSphere(sphere);
                return false;
            }
            return true;
        });
        if (this._time - this.placeLastTime >= this.placeInterval) {
            this.placeSphere();
            this.placeLastTime = this._time;
        }
    };
    Main.prototype.placeSphere = function () {
        var sphere = this.spherePool.getSphere();
        sphere.position.set(this.length * (Math.random() - 0.5), this.length * (Math.random() - 0.5), -this.length * 3);
        this.spheres.push(sphere);
    };
    return Main;
}());
exports.default = Main;
//# sourceMappingURL=main.js.map