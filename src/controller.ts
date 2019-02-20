export default class Controller{

    private static _instance:Controller ;
    private isDown:boolean =false ;
    private position:any = {x:0,y:0};
    private mouseDownHandler :Array<Function> =[];
    private mouseUpHandler :Array<Function> =[];
    private mouseMoveHandler :Array<Function> =[];
    public static get instance(){
        if (!this._instance){
            this._instance = new Controller();
        }
        return this._instance;
    }
    private constructor(){
        this.addListener()
    }
    private addListener(){
        document.addEventListener( 'touchstart', this.onMouseDown.bind(this), false );
        document.addEventListener( 'touchmove', this.onMouseMove.bind(this), false );
        document.addEventListener( 'touchend', this.onMouseUp.bind(this), false );
    }
    private onMouseDown(e:any){
        this.isDown =true;
        let touch = e.touches[0];
        this.position.x = touch.clientX;
        this.position.y = touch.clientY;
        this.mouseDownHandler.map((callback)=>{
            callback(e);
        })
    }
    private onMouseMove(e:any){
        if (this.isDown === false) return;
        let deltaPos = {x:0,y:0};
        let touch = e.touches[0];
        deltaPos.x = touch.clientX - this.position.x
        deltaPos.y = touch.clientY - this.position.y
        this.position.x = touch.clientX;
        this.position.y = touch.clientY;
        this.mouseMoveHandler.map((callback)=>{
            callback(e,deltaPos);
        })
    }
    private onMouseUp(e:any){
        this.isDown =false;
        this.mouseUpHandler.map((callback)=>{
            callback(e);
        })
    }
    public registerMouseUp(callback:Function){
        this.mouseUpHandler.push(callback);
    }
    public registerMouseMove(callback:Function){
        this.mouseMoveHandler.push(callback);
    }
    public registerMouseDown(callback:Function){
        this.mouseDownHandler.push(callback);
    }
    public unRegisterMouseUp(callback:Function){
        this.mouseUpHandler = this.mouseUpHandler.filter((e) => {
            return e !== callback;
        });
    }
    public unRegisterMouseMove(callback:Function){
        this.mouseMoveHandler = this.mouseMoveHandler.filter((e) => {
            return e !== callback;
        });
    }
    public unRegisterMouseDown(callback:Function){
        this.mouseDownHandler = this.mouseDownHandler.filter((e) => {
            return e !== callback;
        });
    }
}