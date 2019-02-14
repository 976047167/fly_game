"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Main = /** @class */ (function () {
    function Main() {
        this.init();
        this.animate();
    }
    Main.prototype.init = function () {
        this.camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 0.01, 10);
        this.camera.position.z = 1;
        this.scene = new THREE.Scene();
        this.geometry = new THREE.BoxGeometry(0.2, 0.2, 0.2);
        this.material = new THREE.MeshBasicMaterial();
        this.mesh = new THREE.Mesh(this.geometry, this.material);
        this.scene.add(this.mesh);
        var ctx = canvas.getContext('webgl');
        this.renderer = new THREE.WebGLRenderer({ context: ctx, antialias: true });
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        document.body.appendChild(this.renderer.domElement);
    };
    Main.prototype.animate = function () {
        requestAnimationFrame(this.animate.bind(this));
        this.mesh.rotation.x += 0.01;
        this.mesh.rotation.y += 0.02;
        this.renderer.render(this.scene, this.camera);
    };
    return Main;
}());
exports.default = Main;
//# sourceMappingURL=main.js.map