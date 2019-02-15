"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var SpherePool = /** @class */ (function () {
    function SpherePool(scene) {
        this.pool = [];
        this.scene = scene;
    }
    SpherePool.prototype.getSphere = function () {
        var sphere;
        var i = 0;
        for (var i_1 = 0; i_1 < this.pool.length; i_1++) {
            var temp = this.pool[i_1];
            if (temp.active === false) {
                sphere = temp;
                sphere.active = true;
                sphere.visible = true;
                break;
            }
        }
        if (!sphere) {
            sphere = this.createSphere();
        }
        return sphere;
    };
    ;
    SpherePool.prototype.createSphere = function () {
        var geometry = new THREE.SphereGeometry(0.2);
        var material = new THREE.MeshBasicMaterial({ color: 0xffff00 });
        var sphere = new THREE.Mesh(geometry, material);
        sphere.active = true;
        sphere.visible = true;
        this.scene.add(sphere);
        this.pool.push(sphere);
        return sphere;
    };
    SpherePool.prototype.delSphere = function (sphere) {
        sphere.active = false;
        sphere.visible = false;
    };
    ;
    return SpherePool;
}());
exports.default = SpherePool;
//# sourceMappingURL=spherePool.js.map