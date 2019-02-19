export default class SpherePool{
    private scene:any ;
    private pool:Array<any> ;
    constructor(scene :any){
        this.pool= [];
        this.scene =scene;
    }
    public getSphere() :any
    {
        let sphere;
        let i = 0;
        for (let i = 0;i<this.pool.length; i ++) {
            const temp = this.pool[i];
            if (temp.active === false){
                sphere = temp;
                sphere.active = true;
                sphere.visible =true;
                break;
            }
        }
        if (!sphere){
            sphere = this.createSphere();
        }
        return sphere;
    };
    private createSphere(){
        const  geometry = new THREE.SphereGeometry(0.2,16,16);
        const material = new THREE.MeshLambertMaterial( {color: 0xffff00} );
        const sphere = new THREE.Mesh( geometry, material );
        sphere.active = true;
        sphere.visible = true;
        this.scene.add(sphere);
        this.pool.push(sphere);
        return sphere;
    }
    public delSphere(sphere: any){
        sphere.active = false;
        sphere.visible = false;
    };
}