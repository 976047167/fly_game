import Controller from "./controller";
export default class Stats{
	private renderer : THREE.WebGLRenderer;
	private mode:number = 0;
	private container :Array<HTMLCanvasElement>;
	private fpsPanel :Panel;
	private msPanel :Panel;
	private drawcallPanel :Panel;
	private memPanel :Panel|undefined;
	private beginTime :number;
	private prevTime :number;
	private frames :number =0;
	private offcanvas :HTMLCanvasElement | undefined;
	public get dom(){
		return this.offcanvas;
	}
	constructor(renderer :THREE.WebGLRenderer){
		this.renderer = renderer;
		this.container =[];
		this.beginTime = ( performance || Date ).now();
		this.prevTime = this.beginTime;
		this.fpsPanel = this.addPanel( new Panel( 'FPS', '#0ff', '#002' ) );
		this.msPanel = this.addPanel( new Panel( 'MS', '#0f0', '#020' ) );
		this.drawcallPanel = this.addPanel(new Panel('DC','#f08','#201'))
		if ( window.performance && window.performance.memory ) {

			this.memPanel = this.addPanel( new Panel( 'MB', '#f08', '#201' ) );

		}

		this.showPanel( 0 );
		Controller.instance.registerMouseUp((e:TouchEvent) => {
			this.showPanel(++this.mode %this.container.length)
		})

	}

	private addPanel(panel:Panel){
		this.container.push(panel.dom);
		return panel;
	}

	private showPanel(id:number){
		this.offcanvas = this.container[id];
		this.mode = id;
	}
	public begin(){
		this.beginTime = (performance || Date).now();
	}
	public end(){
		this.frames++;
		let time =(performance || Date).now();
		this.msPanel.update(time -this.beginTime,2000);
		if(time >= this.prevTime + 1000){
			this.fpsPanel.update((this.frames * 1000)/(time - this.prevTime),100);
			this.prevTime = time;
			this.frames =0;
			this.drawcallPanel.update(this.renderer.info.render.calls,100)
			if (this.memPanel){
				let memory = performance.memory;
				this.memPanel.update(memory.usedJSHeapSize/1048576,memory.jsHeapSizeLimit / 1048576);
			}
		}
		return time;
	}
	public update(){
		this.beginTime = this.end();
	}
}
class Panel{
	public get dom(): HTMLCanvasElement
	{
		return this.offcanvas;
	}
	private name :string;
	private fg :string;
	private bg :string;
	private min :number = Infinity;
	private max :number = 0;
	private round :Function = Math.round;
	// private PR :number = this.round(window.devicePixelRatio || 1 );
	private PR :number = 2;
	private offcanvas :HTMLCanvasElement;
	private WIDTH :number = 80 * this.PR;
	private HEIGHT :number = 48 * this.PR;
	private TEXT_X :number = 3 * this.PR;
	private TEXT_Y :number = 2 * this.PR;
	private GRAPH_X :number = 3 * this.PR;
	private GRAPH_Y :number = 15 * this.PR;
	private GRAPH_WIDTH :number = 74 * this.PR;
	private GRAPH_HEIGHT :number= 30 * this.PR;
	private context :CanvasRenderingContext2D;
	constructor(name:string,fg:string,bg:string){
		this.name = name;
		this.fg = fg;
		this.bg = bg;
		this.offcanvas = document.createElement('canvas');
		let ctx:CanvasRenderingContext2D = this.offcanvas.getContext('2d');
		this.context =ctx;
		this.context.font = 'bold ' + ( 9 * this.PR ) + 'px Helvetica,Arial,sans-serif';
		this.context.textBaseline = 'top';
		this.context.fillStyle = this.bg;
		this.context.fillRect( 0, 0, this.WIDTH, this.HEIGHT );
		this.context.fillStyle = this.fg;
		this.context.fillText( this.name, this.TEXT_X, this.TEXT_Y );
		this.context.fillRect( this.GRAPH_X, this.GRAPH_Y, this.GRAPH_WIDTH, this.GRAPH_HEIGHT );
		this.context.fillStyle = this.bg;
		this.context.globalAlpha = 0.9;
		this.context.fillRect( this.GRAPH_X, this.GRAPH_Y, this.GRAPH_WIDTH, this.GRAPH_HEIGHT );
	}
	public update(value :number,maxValue:number){
		this.min = Math.min( this.min, value );
		this.max = Math.max( this.max, value );

		this.context.fillStyle = this.bg;
		this.context.globalAlpha = 1;
		this.context.fillRect( 0, 0, this.WIDTH, this.GRAPH_Y );
		this.context.fillStyle = this.fg;
		this.context.fillText( this.round( value ) + ' ' + this.name + ' (' + this.round( this.min ) + '-' + this.round( this.max ) + ')', this.TEXT_X, this.TEXT_Y );

		this.context.drawImage(this.offcanvas, this.GRAPH_X + this.PR, this.GRAPH_Y, this.GRAPH_WIDTH - this.PR, this.GRAPH_HEIGHT, this.GRAPH_X, this.GRAPH_Y, this.GRAPH_WIDTH - this.PR, this.GRAPH_HEIGHT );

		this.context.fillRect( this.GRAPH_X + this.GRAPH_WIDTH - this.PR, this.GRAPH_Y, this.PR, this.GRAPH_HEIGHT );

		this.context.fillStyle = this.bg;
		this.context.globalAlpha = 0.9;
		this.context.fillRect( this.GRAPH_X + this.GRAPH_WIDTH - this.PR, this.GRAPH_Y, this.PR, this.round( ( 1 - ( value / maxValue ) ) * this.GRAPH_HEIGHT ) );
	}
}