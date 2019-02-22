import SpherePool from "./spherePool";
import Controller from "./controller";
import Stats from "./stats";
import * as THREE from "three";
export default class Main {
	private camera :THREE.PerspectiveCamera;
	private scene :THREE.Scene;
	private renderer :THREE.WebGLRenderer;
	private canvasWebgl :HTMLCanvasElement;
	private updateFuncs:Array<Function> = [];

	private _time:number = 0;
	private placeLastTime:number = 0;
	private placeInterval:number = 2000;
	private length :number = 0.7;
	private speed :number = 0.001;
	constructor() {
		this.camera = new THREE.PerspectiveCamera( 70, window.innerWidth / window.innerHeight, 0.01, 10000 );
		this.camera.position.z = 1;
		this.scene = new THREE.Scene();
		this.scene.add(this.camera);
		canvas.width *= window.devicePixelRatio;
		canvas.height *= window.devicePixelRatio;
		this.canvasWebgl = document.createElement('canvas');
		this.canvasWebgl.width *= window.devicePixelRatio;
		this.canvasWebgl.height *= window.devicePixelRatio;
		let ctx = <WebGLRenderingContext>this.canvasWebgl.getContext('webgl');
		this.renderer = new THREE.WebGLRenderer( { context : ctx , antialias: true } );
		this.renderer.setSize( window.innerWidth, window.innerHeight );
		this.renderer.setPixelRatio(window.devicePixelRatio);
		document.body.appendChild( this.renderer.domElement );
		this.createObj();
		requestAnimationFrame(this.render.bind(this));
	}

	private render() {
		requestAnimationFrame(this.render.bind(this));
		this.renderer.render( this.scene, this.camera );
		let ctx = <CanvasRenderingContext2D>canvas.getContext('2d');
		ctx.clearRect(0,0,canvas.width,canvas.height);
		ctx.drawImage(this.canvasWebgl,0,0);
		const delta :number = performance.now() - this._time;
		this._time =performance.now();
		this.updateFuncs.map(function(f){
			f(delta);
		})
	}
	private registerUpdate(f:Function) {
		this.updateFuncs.push(f);
	}

	private createObj(){
		this.createStats();
		this.createPlayer();
		this.createGround();
		this.createSphere();
	}
	private createStats(){
		let stats = new Stats(this.renderer);
		this.registerUpdate((delta:number)=>{
			stats.update();
			let ctx = <CanvasRenderingContext2D>canvas.getContext("2d");
			ctx.drawImage(stats.dom,0,0);
		})
	}
	private createPlayer(){
		let geometry = new THREE.BoxGeometry( 0.15, 0.15, 0.15 );
		let material = new THREE.MeshNormalMaterial();
		let mesh = new THREE.Mesh(geometry,material );
        const pointLight = new THREE.PointLight( "#ccffcc");
        pointLight.distance = 10;
        pointLight.intensity = 1;
        mesh.add(pointLight);
		Controller.instance.registerMouseMove((e:TouchEvent,deltaPos:any) =>{
			mesh.position.x += deltaPos.x/1000;
			mesh.position.y -= deltaPos.y/1000;
		});
		this.registerUpdate((delta:number)=>{
			mesh.rotation.x += 0.01;
			mesh.rotation.y += 0.02;
			if (Math.abs(mesh.position.x) > this.length/2 - 0.07){
				mesh.position.x =mesh.position.x > 0 ? this.length/2-0.07:-this.length/2+0.07
			}
			if (Math.abs(mesh.position.y) > this.length/2 - 0.07){
				mesh.position.y =mesh.position.y > 0 ? this.length/2-0.07:-this.length/2+0.07
			};
		})
		this.scene.add(mesh);
	}
	private createGround(){
		const backgroundGeometry = new THREE.PlaneGeometry(this.length,this.length * 6);
		// const backgroundMaterial = new THREE.MeshNormalMaterial();
		const backgroundMaterial = new THREE.MeshPhongMaterial({color: 0xf0f0f0});
		// const depthMaterial = new THREE.MeshDepthMaterial();
		const background = new THREE.Mesh(backgroundGeometry,backgroundMaterial);
		// const background = new THREE.SceneUtil.createMultiMaterialObject(backgroundGeometry, [backgroundMaterial,depthMaterial]);
		background.rotation.set(-0.5 * Math.PI,0,0);
		var point = new THREE.Object3D();
		point.add(background);
		const y = new THREE.Vector3(0,0,-1);
		background.translateOnAxis(y,this.length/2);
		this.scene.add(point);
		for (let i= 0; i < 3; i++){
			let clone =point.clone();
			const v = new THREE.Vector3(0,0,1);
			clone.rotateOnAxis(v,0.5 * Math.PI);
			point = clone;
			this.scene.add(point);
		}
	}

	private createSphere(){
		let spherePool = new SpherePool(this.scene);
		let spheres:Array<any> = [];
		this.registerUpdate((delta :number)=>{
			spheres =spheres.filter(sphere=> {
				sphere.position.z += this.speed * delta;
				if (sphere.position.z > this.length*0.4) {
					spherePool.delSphere(sphere);
					return false
				}
				return true;
			});
			if (this._time - this.placeLastTime >= this.placeInterval) {
				const sphere = spherePool.getSphere();
				sphere.position.set(this.length * (Math.random()-0.5),this.length * (Math.random()-0.5),-this.length * 3);
				spheres.push(sphere);
				this.placeLastTime = this._time;
			}
		})
	}
}