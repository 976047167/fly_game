import SpherePool from "./spherePool";
import Controller from "./controller";
import Stats from "./stats";
export default class Main{
	private camera :any;
	private camera2D :any;
	private scene :any;
	private scene2D :any;
	private renderer :any;
	private canvas2D :any;
	private stats  :Stats;
	private geometry :any;
	private material :any;
	private mesh :any;
	private grounds :Array<any> = [];
	private spherePool:any;
	private spheres:Array<any> = [];


	private _time:number = 0;
	private placeLastTime:number = 0;
	private placeInterval:number = 2000;
	private length :number = 0.7;
	private speed :number = 0.001;
	constructor() {
		this.init();
	}
	private init() {

		this.camera = new THREE.PerspectiveCamera( 70, window.innerWidth / window.innerHeight, 0.01, 10000 );
		this.camera2D = new THREE.OrthographicCamera( - window.innerWidth / 2, window.innerWidth / 2,  window.innerHeight/ 2, - window.innerHeight/ 2,);

		this.camera.position.z = 1;
		this.camera2D.position.z = 1;
		this.scene = new THREE.Scene();
		this.scene2D =new THREE.Scene();
		this.scene.add(this.camera);
		this.scene2D.add(this.camera2D);
		this.createObj();
		this.createUI();
		let ctx = canvas.getContext('webgl');
		this.renderer = new THREE.WebGLRenderer( { context : ctx , antialias: true } );
		// this.renderer.setPixelRatio( window.devicePixelRatio );
		this.renderer.setSize( window.innerWidth, window.innerHeight );
		this.renderer.autoClear = false;
		document.body.appendChild( this.renderer.domElement );
		requestAnimationFrame(this.render.bind(this));
	}

	private render() {
		requestAnimationFrame(this.render.bind(this));
		this.renderer.clear();
		this.renderer.render( this.scene, this.camera );
		this.renderer.clearDepth();
		let ctx = this.canvas2D.getContext('2d')
		this.stats.update();
		ctx.clearRect(0,0,this.canvas2D.width,this.canvas2D.height);
		ctx.drawImage(this.stats.dom,0,0);
		this.renderer.render(this.scene2D,this.camera2D);
		const delta :number = performance.now() - this._time;
		this._time =performance.now();

		this.update(delta);
	}
	private createUI(){
		let offCanvas = document.createElement('canvas')
		let ctx = offCanvas.getContext('2d')
		if (ctx === null) return;
		this.stats = new Stats();
		ctx.drawImage(this.stats.dom,0,0);

		let CanvasTexture = new THREE.CanvasTexture( offCanvas);

		this.canvas2D=offCanvas ;
		const spMaterial = new THREE.SpriteMaterial({
			color: 0xffffff,
			map:CanvasTexture
		})
		const sp = new THREE.Sprite(spMaterial)

		sp.scale.set(window.innerWidth, window.innerHeight, 1);
		console.log(sp)
		this.scene2D.add(sp);
	}
	private createObj(){
		this.createPlayer();
        // const pointLight = new THREE.PointLight( "#ccffcc");
        // pointLight.distance = 100;
        // pointLight.intensity = 1;
        // this.mesh.add(pointLight);
		this.createGround();
		this.spherePool = new SpherePool(this.scene);
		this.placeSphere();
	}
	private createPlayer(){
		this.geometry = new THREE.BoxGeometry( 0.15, 0.15, 0.15 );
		this.material = new THREE.MeshNormalMaterial();
		this.mesh = new THREE.Mesh( this.geometry, this.material );
		let controller = new Controller(this.mesh);
		this.scene.add( this.mesh );
	}
	private createGround(){
		const backgroundGeometry = new THREE.PlaneGeometry(this.length,this.length * 6);
		// const backgroundMaterial = new THREE.MeshBasicMaterial({color: 0x777777});
		const backgroundMaterial = new THREE.MeshNormalMaterial();
		// const backgroundMaterial = new THREE.MeshLambertMaterial({color: 0x777777});
		// const depthMaterial = new THREE.MeshDepthMaterial();
		const background = new THREE.Mesh(backgroundGeometry,backgroundMaterial);
		// const background = new THREE.SceneUtil.createMultiMaterialObject(backgroundGeometry, [backgroundMaterial,depthMaterial]);
		background.rotation.set(-0.5 * Math.PI,0,0);
		var point = new THREE.Object3D();
		point.add(background);
		const y = new THREE.Vector3(0,0,-1);
		background.translateOnAxis(y,this.length/2);
		this.scene.add(point);
		this.grounds.push(point);
		for (let i= 0; i < 3; i++){
			let clone =point.clone();
			const v = new THREE.Vector3(0,0,1);
			clone.rotateOnAxis(v,0.5 * Math.PI);
			point = clone;
			this.scene.add(point);
			this.grounds.push(point);
		}
	}
	private update(delta:number){
		this.updatePlayer();
		this.updateSphere(delta);
	}
	private updatePlayer(){
		this.mesh.rotation.x += 0.01;
		this.mesh.rotation.y += 0.02;
	}
	private updateSphere(delta:number) {
		this.spheres = this.spheres.filter(sphere=> {
			sphere.position.z += this.speed * delta;
			if (sphere.position.z > this.length*0.4) {
				this.spherePool.delSphere(sphere);
				return false
			}
			return true;
		});
		if (this._time - this.placeLastTime >= this.placeInterval) {
			this.placeSphere();
			this.placeLastTime = this._time;
		}
	}
	private placeSphere(){
		const sphere = this.spherePool.getSphere();
		sphere.position.set(this.length * (Math.random()-0.5),this.length * (Math.random()-0.5),-this.length * 3);
		this.spheres.push(sphere);
	}
}