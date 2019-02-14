export default class Main{
	private camera :any
	private scene :any
	private renderer :any;
	private geometry :any;
	private material :any;
	private mesh :any;

	constructor() {
		this.init();
		this.animate();
	}
	private init() {

		this.camera = new THREE.PerspectiveCamera( 70, window.innerWidth / window.innerHeight, 0.01, 10 );
		this.camera.position.z = 1;

		this.scene = new THREE.Scene();

		this.geometry = new THREE.BoxGeometry( 0.2, 0.2, 0.2 );
		this.material = new THREE.MeshBasicMaterial();

		this.mesh = new THREE.Mesh( this.geometry, this.material );
		this.scene.add( this.mesh );

		let ctx = canvas.getContext('webgl')
		this.renderer = new THREE.WebGLRenderer( { context : ctx , antialias: true } );
		this.renderer.setSize( window.innerWidth, window.innerHeight );
		document.body.appendChild( this.renderer.domElement );

	}

	private animate() {
		requestAnimationFrame(this.animate.bind(this));

		this.mesh.rotation.x += 0.01;
		this.mesh.rotation.y += 0.02;

		this.renderer.render( this.scene, this.camera );
	}
}