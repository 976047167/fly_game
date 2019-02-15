export default class Controller{
    private obj:any ;
    private isDown:boolean =false ;
    private position:any = {x:0,y:0};
    constructor(obj :any){
        this.obj = obj;
        this.addListener()
    }
    private addListener(){
        document.addEventListener( 'touchstart', this.onMouseDown.bind(this), false );
        document.addEventListener( 'touchmove', this.onMouseMove.bind(this), false );
        document.addEventListener( 'touchend', this.onMouseUp.bind(this), false );
    }
    private onMouseDown(e:any){
        console.log("down");
        console.log(e.touches);
        let touch = e.touches[0];
        this.isDown =true;
        this.position.x = touch.clientX;
        this.position.y = touch.clientY;
    }
    private onMouseMove(e:any){
        if (this.isDown === false) return;
        console.log(e)
        let touch = e.touches[0];
        this.obj.position.x += (touch.clientX - this.position.x)/5000
        this.obj.position.y -= (touch.clientY - this.position.y)/5000
    }
    private onMouseUp(e:any){
        console.log("up");
        console.log(this.obj.position);
        this.isDown =false;
    }
}