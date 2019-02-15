"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var spherePool_1 = __importDefault(require("./spherePool"));
var Main = /** @class */ (function () {
    function Main() {
        this.grounds = [];
        this.spheres = [];
        this._time = 0;
        this.placeLastTime = 0;
        this.placeInterval = 2000;
        this.length = 0.7;
        this.speed = 0.001;
        this.init();
    }
    Main.prototype.init = function () {
        this.camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 0.01, 10);
        this.camera.position.z = 1;
        this.scene = new THREE.Scene();
        this.createObj();
        var ctx = canvas.getContext('webgl');
        this.renderer = new THREE.WebGLRenderer({ context: ctx, antialias: true });
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        document.body.appendChild(this.renderer.domElement);
        requestAnimationFrame(this.render.bind(this));
    };
    Main.prototype.render = function () {
        requestAnimationFrame(this.render.bind(this));
        this.renderer.render(this.scene, this.camera);
        var delta = performance.now() - this._time;
        this._time = performance.now();
        this.update(delta);
    };
    Main.prototype.createObj = function () {
        this.createPlayer();
        // const pointLight = new THREE.PointLight( "#ccffcc");
        // pointLight.distance = 100;
        // pointLight.intensity = 1;
        // this.mesh.add(pointLight);
        this.createGround();
        this.spherePool = new spherePool_1.default(this.scene);
        this.placeSphere();
    };
    Main.prototype.createPlayer = function () {
        this.geometry = new THREE.BoxGeometry(0.15, 0.15, 0.15);
        this.material = new THREE.MeshNormalMaterial();
        this.mesh = new THREE.Mesh(this.geometry, this.material);
        this.scene.add(this.mesh);
    };
    Main.prototype.createGround = function () {
        var backgroundGeometry = new THREE.PlaneGeometry(this.length, this.length * 6);
        // const backgroundMaterial = new THREE.MeshBasicMaterial({color: 0x777777});
        var backgroundMaterial = new THREE.MeshNormalMaterial();
        // const backgroundMaterial = new THREE.MeshLambertMaterial({color: 0x777777});
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
            console.log(clone.position);
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
    };
    Main.prototype.updateSphere = function (delta) {
        var _this = this;
        this.spheres = this.spheres.filter(function (sphere) {
            sphere.position.z += _this.speed * delta;
            // checkCollision(trees[i].position.x, trees[i].position.z);
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