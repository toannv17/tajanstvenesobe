
import { _decorator,
    Component,
    math, 
    macro,
    Label,
    systemEvent,
    SystemEvent,
    game,
    view,
    Node,
    Vec3,
    Quat,
    director,
    geometry,
    setDisplayStats,
    sys,
    EventKeyboard,
    KeyCode,
    PhysicsRayResult,
    PhysicsSystem,
    RigidBody,
    Layers} from 'cc';
const { ccclass, property } = _decorator;
//const outRay = new ray(0, -1, 0, 0, 1, 0);

import { DetectTypeOfDevice } from "./DetectTypeOfDevice";
import { GameManager, GameStatuType } from './GameManager';

const KEYCODE = {
    UP: KeyCode.ARROW_UP,
    DOWN: KeyCode.ARROW_DOWN,
    LEFT: KeyCode.ARROW_LEFT,
    RIGHT: KeyCode.ARROW_RIGHT,
    W: 'W'.charCodeAt(0),
    S: 'S'.charCodeAt(0),
    A: 'A'.charCodeAt(0),
    D: 'D'.charCodeAt(0),
    Q: 'Q'.charCodeAt(0),
    E: 'E'.charCodeAt(0),
    SPACE: KeyCode.SPACE,
    SHIFT: KeyCode.SHIFT_LEFT,
}

var _pointerLockGeneral = false;
var _keyEvent = [false];

@ccclass('FirstPersonCameraMovement')
export class FirstPersonCameraMovement extends Component {

    @property
    moveSpeed = 1;

    @property
    forceStrenght = 1;
 
 
    @property({ slide: true, range: [0.05, 0.5, 0.01] })
    damp = 0.2;

    _gotStartLocation = false;

    @property
    _eventOn = false;

    _finalMoveVector = new Vec3;
 
    _position = new Vec3();
    _keyPresed = false;

    _tutorialEnded = false;

    _myGround! : Node ; 
    
    @property
    heightFromGround = 0.6;

    _jumpTemp : number = 0;
    _jumpHeight : number = .5;
    _jumpSpeed : number = 2;
    _jumpRise : boolean = true;
    _jumpBool : boolean = false;

    scaledSpeedCoeficient = 1;

    start() {
        systemEvent.on(SystemEvent.EventType.KEY_DOWN, this.onKeyDown, this);
        systemEvent.on(SystemEvent.EventType.KEY_UP, this.onKeyUp, this);

        this.scaledSpeedCoeficient = 1;//GameManager.getInstance().WorldRoot!.scale.x / 100 ;
        //director.getPhysicsManager().enabled = true;

        Vec3.copy(this._position, this.node.position);
    }
 
    onDestroy() {
        systemEvent.off(SystemEvent.EventType.KEY_DOWN, this.onKeyDown, this);
        systemEvent.off(SystemEvent.EventType.KEY_UP, this.onKeyUp, this);
    }

    jump() {
        if(!this._jumpBool) {
            this._jumpBool = true;
            this._jumpRise = true;
        }
    }
 
    update(dt: number) {
    
        if(GameManager.getInstance().gameStatus == GameStatuType.gamePaused)
            return;
        
        var raycast: geometry.Ray = new geometry.Ray(this.node.position.x, this.node.position.y, this.node.position.z, 0, -1, 0);
        var hit: Vec3 = new Vec3();
        var distance = 0; 

        


        if(this._jumpBool) {
            if(this._jumpRise) 
                this._jumpTemp += dt * this._jumpSpeed;
            else
                this._jumpTemp -= dt * this._jumpSpeed;

            if(this._jumpTemp > this._jumpHeight && this._jumpRise)
                this._jumpRise = false;
           
            if( this._jumpTemp <= 0 && !this._jumpRise )
                {
                    this._jumpBool = false;
                }
        }

        if (PhysicsSystem.instance.raycast(raycast)) {
            const r = PhysicsSystem.instance.raycastResults;

            var visina = new Vec3(0,-200,0);

            for (let i = 0; i < r.length; i++){

                const item = r[i];

                try {
                    if( item != undefined && item != null) {
                        if( item.collider.node.name == "Ground002") {
                            if(visina.y < item.hitPoint.y + this.heightFromGround + this._jumpTemp )
                                visina = new Vec3(item.hitPoint.x, item.hitPoint.y + this.heightFromGround + this._jumpTemp, item.hitPoint.z);
                        }
                    }
                } catch (error) {
                    
                }
            }
            this.node.position = visina;

        }

        raycast.computeHit(hit, distance);

        var runningSpeed = 0;
        if(_keyEvent[KEYCODE.SHIFT] == true) 
            runningSpeed = 1;

        //if(this._keyPresed && this.fpsMovement._pointerLockLocal ) 
        if(this._keyPresed ){
            this.creatingFinalVectorKeyboard();
            //this.node.getComponent(RigidBody)?.applyImpulse(this._finalMoveVector.multiplyScalar(this.forceStrenght));
            //this.node.getComponent(RigidBody)?.applyForce(this._finalMoveVector.multiplyScalar(this.forceStrenght));
            this.node.getComponent(RigidBody)?.setLinearVelocity(this._finalMoveVector.multiplyScalar( GameManager.getInstance().moveSpeed * this.scaledSpeedCoeficient + runningSpeed ))
            
            //this.node.position.add(this._finalMoveVector.multiplyScalar(this.moveSpeed) );
        }     
    }

    multiplyQuatVec3(rotation: Quat, point: Vec3)
    {
      var num1: number = rotation.x * 2;
      var num2: number  = rotation.y * 2;
      var num3: number  = rotation.z * 2;
      var num4: number  = rotation.x * num1;
      var num5: number  = rotation.y * num2;
      var num6: number  = rotation.z * num3;
      var num7: number  = rotation.x * num2;
      var num8: number  = rotation.x * num3;
      var num9: number  = rotation.y * num3;
      var num10: number  = rotation.w * num1;
      var num11: number  = rotation.w * num2;
      var num12: number  = rotation.w * num3;
      var vector3: Vec3 = new Vec3;
      vector3.x = ((1.0 - ( num5 +  num6)) *  point.x + ( num7 -  num12) *  point.y + ( num8 +  num11) *  point.z);
      vector3.y = (( num7 +  num12) *  point.x + (1.0 - ( num4 +  num6)) *  point.y + ( num9 -  num10) *  point.z);
      vector3.z = (( num8 -  num11) *  point.x + ( num9 +  num10) *  point.y + (1.0 - ( num4 +  num5)) *  point.z);
      return vector3;
    }


    calculateForward(sila: number) {
        var vectorForward = this.multiplyQuatVec3(this.node.rotation, Vec3.FORWARD);
        vectorForward.y = 0;
        
        return vectorForward.multiplyScalar(sila);
    }

    calculateLeft(sila: number) {
        var vectorLeft = this.multiplyQuatVec3(this.node.rotation, Vec3.RIGHT);

        return vectorLeft.negative().multiplyScalar(sila);
    }

    calculateRight(sila: number) {
        var vectorRight = this.multiplyQuatVec3(this.node.rotation, Vec3.RIGHT);

        return vectorRight.multiplyScalar(sila);
    }

    calculateBack(sila: number) {
        var vectorBack = this.multiplyQuatVec3(this.node.rotation, Vec3.FORWARD);
        vectorBack.y = 0;

        return vectorBack.negative().multiplyScalar(sila);
    }

    creatingFinalVectorKeyboard() {

        var e = _keyEvent;
        
        if(_keyEvent[KEYCODE.UP] == true || _keyEvent[KEYCODE.W] == true ) {
            this._finalMoveVector.add(this.calculateForward(1));
            this.tutorialEnd();
        }
        if(_keyEvent[KEYCODE.LEFT] == true || _keyEvent[KEYCODE.A] == true ) {
            this._finalMoveVector.add(this.calculateLeft(1));
            this.tutorialEnd();
        }
        if(_keyEvent[KEYCODE.DOWN] == true || _keyEvent[KEYCODE.S] == true ) {
            this._finalMoveVector.add(this.calculateBack(1));
            this.tutorialEnd();
        }
        if(_keyEvent[KEYCODE.RIGHT] == true || _keyEvent[KEYCODE.D] == true ) {
            this._finalMoveVector.add(this.calculateRight(1));
            this.tutorialEnd();
         }

        this._finalMoveVector.normalize().multiplyScalar(GameManager.getInstance().moveSpeed);
    }

    tutorialEnd() {
        if(this._tutorialEnded == false) {
            var detectType = GameManager.instance.Canvas!.getComponent("DetectTypeOfDevice") as DetectTypeOfDevice;
            detectType.keyboard_Move();

            this._tutorialEnded = true;
        }
    }
    

    creatingFinalVectorTouch(moveVec: Vec3) {

        var temp = new Vec3 (moveVec.x, 0, -moveVec.y);
        this._finalMoveVector = this.multiplyQuatVec3(this.node.rotation,temp);
        

        this._finalMoveVector.multiplyScalar(GameManager.getInstance().moveSpeed);
        
        if(moveVec.x != 0 || moveVec.y != 0)
            this.tutorialEnd();

    }

    onKeyUp(e: any) {
        _keyEvent[e.keyCode] = false;
        this._finalMoveVector = new Vec3(0,0,0);

        var sviPodignuti = true;
        _keyEvent.forEach(element => {
            if(element==true)
                sviPodignuti = false;
        });

        if(sviPodignuti)
            this._keyPresed = false;
    }

    onKeyDown(e: any) {
        _keyEvent[e.keyCode] = true;
        this._keyPresed = true;

        if(_keyEvent[KEYCODE.SPACE] == true) 
            this.jump();
    }   

    

};