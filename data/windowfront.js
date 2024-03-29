var canvas, preview, offscreen, matrixCanvas, ctx, pctx, dctx = null;

var outputCanvas, octx=null;


var lastTime= new Date();

var draw_flag = false;
var prevX, currX, prevY, currY=0;
var draw_start_flag = false;
var offset=4;
var drawOffX=26;
var drawOffY=6+12;

const drawUpdateInterval=0.25;

var keyboardOffX=24;
var keyboardOffY=91+12;

var dotChange=true;
var keyDown=null;

var dragTimer=2;
var draggedGlyph=null;
var isBeingDragged=false;

function newSuperEvent(){
    let SuperMovementEvent = {
        prevX:0, prevY:0,
        currX:0, currY:0,
        draw_flag:false, draw_start_flag:false,
        keyDown: null, dragTimer:1

    };
    return SuperMovementEvent;
}

var supermouse=newSuperEvent();

var inital=new Image (234, 192); inital.src ="data/images/PictoChatDefaultTop.png";


var scrollPlace=0;
var minPos=0;
var maxPos=0;
var outputimgs=[inital];
var lastSent=false;

var overlayColor="rgba(0, 0, 255, 0.5)";

var colorMode="ModeA";
var displayName="Person";

var colorPallate={}
//For modes.
//Forthe keyboard.
var CAPS=false;
var SHIFT=false;

var inKeybutton=false;
var drawing=false;

var dotsize=1;

var cols=228;
var rows=80;

let array2D= Array.from(Array(cols), () => new Array(rows));
let arr2DChanges= Array.from(Array(cols), () => new Array(rows));

//Tools
var keyboard_selected=1;

var toolActive=0;
var toolSize=0;

var penColor=2;
const maxColors=6;


var mShift=false;

var keyboards={
    1:{
        keyboardMode:"Code",
        keylist:{"Digit1":{xpos:4,ypos:2,xsize:15,ysize:14, char:"1",schar:"!", caps:false},"Digit2":{xpos:20,ypos:2,xsize:15,ysize:14, char:"2",schar:"@", caps:false},"Digit3":{xpos:36,ypos:2,xsize:15,ysize:14, char:"3",schar:"#", caps:false},"Digit4":{xpos:52,ypos:2,xsize:15,ysize:14, char:"4",schar:"$", caps:false},"Digit5":{xpos:68,ypos:2,xsize:15,ysize:14, char:"5",schar:"%", caps:false},"Digit6":{xpos:84,ypos:2,xsize:15,ysize:14, char:"6",schar:"^", caps:false},"Digit7":{xpos:100,ypos:2,xsize:15,ysize:14,char:"7",schar:"&", caps:false},"Digit8":{xpos:116,ypos:2,xsize:15,ysize:14,char:"8",schar:"*", caps:false},"Digit9":{xpos:132,ypos:2,xsize:15,ysize:14,char:"9",schar:"(", caps:false},"Digit0":{xpos:148,ypos:2,xsize:15,ysize:14,char:"0",schar:")", caps:false},"Minus": {xpos:164,ypos:2,xsize:15,ysize:14,char:"-",schar:"_", caps:false},"Equal": {xpos:180,ypos:2,xsize:15,ysize:14,char:"=",schar:"+", caps:false},"KeyW":{xpos:29,ypos:17,xsize:15,ysize:15, char:"w",schar:"W", caps:true},"KeyE":{xpos:45,ypos:17,xsize:15,ysize:15, char:"e",schar:"E", caps:true},"KeyQ":{xpos:13,ypos:17,xsize:15,ysize:15, char:"q",schar:"Q", caps:true},    "KeyR":{xpos:61,ypos:17,xsize:15,ysize:15, char:"r",schar:"R", caps:true},   "KeyT":{xpos:77,ypos:17,xsize:15,ysize:15, char:"t",schar:"T", caps:true},    "KeyY":{xpos:93,ypos:17,xsize:15,ysize:15, char:"y",schar:"Y", caps:true},   "KeyU":{xpos:109,ypos:17,xsize:15,ysize:15,char:"u",schar:"U", caps:true},    "KeyI":{xpos:125,ypos:17,xsize:15,ysize:15,char:"i",schar:"I", caps:true},   "KeyO":{xpos:141,ypos:17,xsize:15,ysize:15,char:"o",schar:"O", caps:true},    "KeyP":{xpos:157,ypos:17,xsize:15,ysize:15,char:"p",schar:"P", caps:true},   "KeyA":{xpos:20,ypos:33,xsize:15,ysize:15,char:"a",schar:"A", caps:true},    "KeyS":{xpos:36,ypos:33,xsize:15,ysize:15,char:"s",schar:"S", caps:true},   "KeyD":{xpos:52,ypos:33,xsize:15,ysize:15,char:"d",schar:"D", caps:true},    "KeyF":{xpos:68,ypos:33,xsize:15,ysize:15,char:"f",schar:"F", caps:true},   "KeyG":{xpos:84,ypos:33,xsize:15,ysize:15,char:"g",schar:"G", caps:true},    "KeyH":{xpos:100,ypos:33,xsize:15,ysize:15,char:"h",schar:"H", caps:true},   "KeyJ":{xpos:116,ypos:33,xsize:15,ysize:15,char:"j",schar:"J", caps:true},    "KeyK":{xpos:132,ypos:33,xsize:15,ysize:15,char:"k",schar:"K", caps:true},   "KeyL":{xpos:148,ypos:33,xsize:15,ysize:15,char:"l",schar:"L", caps:true},    "KeyZ":  {xpos:28,ypos:49,xsize:15,ysize:15,char:"z",schar:"Z", caps:true},   "KeyX":  {xpos:44,ypos:49,xsize:15,ysize:15,char:"x",schar:"X", caps:true},    "KeyC":  {xpos:60,ypos:49,xsize:15,ysize:15,char:"c",schar:"C", caps:true},   "KeyV":  {xpos:76,ypos:49,xsize:15,ysize:15,char:"v",schar:"V", caps:true},    "KeyB":  {xpos:92,ypos:49,xsize:15,ysize:15,char:"b",schar:"B", caps:true},    "KeyN":  {xpos:108,ypos:49,xsize:15,ysize:15,char:"n",schar:"N", caps:true},    "KeyM":  {xpos:124,ypos:49,xsize:15,ysize:15,char:"m",schar:"M", caps:true},    "Comma": {xpos:140,ypos:49,xsize:15,ysize:15,char:",",schar:"<", caps:false},    "Period":{xpos:156,ypos:49,xsize:15,ysize:15,char:".",schar:">", caps:false},    "Slash": {xpos:172,ypos:49,xsize:15,ysize:15,char:"/",schar:"?", caps:false},        "ShiftLeft":{xpos:2,ypos:49,xsize:25,ysize:15,char:null,schar:null, caps:false},    "CapsLock":{xpos:2,ypos:33,xsize:17,ysize:15,char:null,schar:null, caps:false},    "ShiftRight":{xpos:2,ypos:49,xsize:25,ysize:15,char:null,schar:null, caps:false},    "Semicolon":{xpos:36,ypos:65,xsize:15,ysize:14,char:";",schar:":", caps:false},    "BracketLeft":{xpos:148,ypos:65,xsize:15,ysize:14,char:"[",schar:"{", caps:false},    "BracketRight":{xpos:164,ypos:65,xsize:15,ysize:14,char:"{",schar:"}", caps:false},    "Quote":{xpos:52,ypos:65,xsize:15,ysize:14,char:"'",schar:"\"", caps:false}, "Backquote":{xpos:20,ypos:65,xsize:15,ysize:14,char:"`",schar:"~", caps:false},    "Backspace":{xpos:173,ypos:17,xsize:25,ysize:15,char:null,schar:null, caps:false},    "Space":{xpos:68,ypos:65,xsize:79,ysize:14,char:" ",schar:" ", caps:false},    "Enter":{xpos:164,ypos:33,xsize:34,ysize:15,char:null,schar:null, caps:false}}
    },
    2:{},
    3:{},
    4:{},
    5:{}
}
function newPictoString(defX, defY){
    let PictoString = {
        currentString:[],
        defaultX:defX, defaultY:defY,
        startX:0, startY:0,
        resetString:function(){this.startX=this.defaultX;this.startY=this.defaultY; this.currentString=[];},
        setByName:function(string){for(let it=0;it<string.length;it++){this.addToString(string[it]);}},
        setStart:function(x, y){this.startX=x; this.startY=y;},
        addToString:function(char){ this.currentString.push(char);},
        removeFromString:function(){ this.currentString.pop();}
    }
    return PictoString;
}
var PictoString = {};
var PictoStringName = {};

let glyphs=null;

//var glyphs={
//    "A":{px:1,py:1, width=5}, "a":{px:1, py:2}
//}
//Resources:

var keyboardSelectArea=null;
var drawingToolArea=null;
var ScrollButtonArea=null;
var drawingBox=null;
var SCCArea=null;

var ScrollBar=null;

var XButton=null;


var scrolling=false;
var scrollingCountdown=0;
var scrollingCountdownMax=3;



const backgroundImg=new Image (234, 85); backgroundImg.src = 'data/images/PictochatWindowLines.png';
var backgroundImg2=new Image (234, 85); backgroundImg2.src = 'data/images/PictochatWindowOverlay.png';


const backcomp1=new Image (238, 176); backcomp1.src = 'data/images/Back01.png';


const topScreen=new Image (256, 193); topScreen.src = 'data/images/TopScreen.png';
var keyboard1=new Image (200, 81); keyboard1.src = 'data/images/Keyboard1Normal.png';
var keyboard1s=new Image (200, 81); keyboard1s.src = 'data/images/Keyboard1Shift.png';
var keyboard1c=new Image (200, 81); keyboard1c.src = 'data/images/Keyboard1Caps.png';
var keyboard2=new Image (200, 81); keyboard2.src = 'data/images/KeyboardAccent.png';
var keyboard4=new Image (200, 81); keyboard4.src = 'data/images/KeyboardSymbol.png';
var keyboard5=new Image (200, 81); keyboard5.src = 'data/images/KeyboardPictogram.png';

var keyboardImages={}
//const keyboard2=new Image (200, 81); keyboard2.src = 'data/images/KeyboardAccent.png';
const glyph=new Image (320*2, 377*2); glyph.src = 'data/images/Glyphs.png';
const glyphX1=new Image (320, 377); glyphX1.src = 'data/images/Glyphs11.png';
var drawingImage=new Image();// drawingImage.src = '/data/images/PictochatWindowOverlay.png';

var currentXCount=0;
var countdown=0;
//backgroundImg.onload = drawImageActualSize; // Draw when image has loaded
function newBox(posX, posY, sizeX, sizeY){
    var box={
        xpos: posX, ypos:posY,
        xsize:sizeX, ysize:sizeY,
        inBounds:function(cx, cy, offX, offY){
            var cdx=cx/dotsize
            var cdy=cy/dotsize
            var xCond=((cdx>=(offX+this.xpos)) &&(cdx<=(offX+this.xpos+this.xsize)));
            var yCond=((cdy>=(offY+this.ypos)) &&(cdy<=(offY+this.ypos+this.ysize)));
            if (xCond && yCond){
                return true;
            }
            return false;
        }
    }
    return box;
}

function CloneImage(img){
    let thisimg=new Image(img.width, img.height);
    thisimg.src=img.src;
    return thisimg;
}



function init() {
    let note = document.getElementById('name');
    //console.log(note)
    displayName=note.textContent;
    let colora = document.getElementById('color');
    colorMode= colora.textContent;
    //console.log(displayName, colorMode);

    //Name and color set.
    fetch('data/json/glyphs.json')
      .then(response => response.json())
      .then(glyp => glyphs=glyp);

    fetch('data/json/keyboard2.json')
      .then(response => response.json())
      .then(glyp => keyboards[2]=glyp);

    fetch('data/json/keyboard4.json')
      .then(response => response.json())
      .then(glyp => keyboards[4]=glyp);

    fetch('data/json/keyboard5.json')
      .then(response => response.json())
      .then(glyp => keyboards[5]=glyp);

      fetch('data/json/pallates.json')
        .then(response => response.json())
        .then(color => colorPallate=color[colorMode]);

    canvas = document.getElementById('drawing');
    preview =  document.getElementById('animating');
    matrixCanvas =  document.getElementById('dotDraw');
    outputCanvas =  document.getElementById('output');

    PictoString=newPictoString(63,1);
    PictoStringName=newPictoString(1,1);

    PictoStringName.resetString();
    PictoStringName.setByName(displayName);

    getimage(backgroundImg2, colorMode);
    //offscreen = new OffscreenCanvas(320*2, 377*2);

    //discordsender = new OffscreenCanvas(cols*2, rows*2);
    //offscreen= new OffscreenCanvas(320*2, 377*2);

    overlayColor="rgba(0, 0, 255, 0.5)";
    drawingBox=newBox(drawOffX,drawOffY,cols,rows);

    ctx = canvas.getContext("2d");
    pctx = preview.getContext("2d");
    dctx = matrixCanvas.getContext("2d");
    octx= outputCanvas.getContext("2d");

    ctx.imageSmoothingEnabled = false;
    pctx.drawImage(glyphX1, 0,0);
    pctx.imageSmoothingEnabled = false;
    octx.imageSmoothingEnabled= false;
    w = canvas.width;
    h = canvas.height;
     for (var i=0;i<arr2DChanges.length;i++){
         var row =arr2DChanges[i];
         for (var j=0; j<row.length;j++){
                arr2DChanges[i][j]=true;
                array2D[i][j]=0;
        }
    }
    //         if (row[j]!=null){
    //             ctx.beginPath();
    //             ctx.fillRect(offset+i*dotsize, offset+j*dotsize, dotsize, dotsize);
    //             ctx.stroke();
    //             ctx.closePath();
    //         }
    //     }
    // }
    keyboardSelectArea={
        offX:4-2, offY:keyboardOffY+5,
        bindBoxes:[null, null, null, null, null, null]
    };
    keyboardSelectArea.Imm0=new Image(14,82); keyboardSelectArea.Imm0.src="data/images/KeyboardSelectOFF.png";
    keyboardSelectArea.ImmAct=CloneImage(keyboardSelectArea.Imm0)
    getimage(keyboardSelectArea.ImmAct, colorMode);
    //keyboardSelectArea.Imm1=new Image(14,82); keyboardSelectArea.Imm1.src="data/images/KeyboardSelectON1.png";
    //keyboardSelectArea.Imm2=new Image(14,82); keyboardSelectArea.Imm2.src="data/images/KeyboardSelectON2.png";
    //keyboardSelectArea.Imm3=new Image(14,82); keyboardSelectArea.Imm3.src="data/images/KeyboardSelectON3.png";
    //keyboardSelectArea.Imm4=new Image(14,82); keyboardSelectArea.Imm4.src="data/images/KeyboardSelectON4.png";
    //keyboardSelectArea.Imm5=new Image(14,82); keyboardSelectArea.Imm5.src="data/images/KeyboardSelectON5.png";
    keyboardSelectArea.bindBoxes[1]=newBox(0,0,14,14);
    keyboardSelectArea.bindBoxes[2]=newBox(0,17,14,14);
    keyboardSelectArea.bindBoxes[3]=newBox(0,34,14,14);
    keyboardSelectArea.bindBoxes[4]=newBox(0,51,14,14);
    keyboardSelectArea.bindBoxes[5]=newBox(0,68,14,14);
    toolActive=1;
    toolSize=2;
    penColor=2;
    drawingToolArea={
        offX:4-2, offY:25+12,
        bindBoxes:[null, null, null, null, null]
    }

    drawingToolArea.Imm0= new Image(14,62); drawingToolArea.Imm0.src="data/images/drawingTools.png";
    drawingToolArea.ImmAct= new Image(14,62); drawingToolArea.ImmAct.src="data/images/drawingTools.png";
    getimage(drawingToolArea.ImmAct, colorMode);
    drawingToolArea.bindBoxes[1]=newBox(0,0,14,13);
    drawingToolArea.bindBoxes[2]=newBox(0,14,14,13);
    drawingToolArea.bindBoxes[3]=newBox(0,33,14,14);
    drawingToolArea.bindBoxes[4]=newBox(0,48,14,14);

    ScrollButtonArea={
        offX:4-2, offY:2,
        bindBoxes:[null, null, null],
        herePress:0,
        animLoopScroll:0
    }

    ScrollButtonArea.Imm0= new Image(14,29); ScrollButtonArea.Imm0.src="data/images/scrollButtons.png";
    ScrollButtonArea.ImmAct= new Image(14,29); ScrollButtonArea.ImmAct.src="data/images/scrollButtons.png";
    getimage(ScrollButtonArea.ImmAct, colorMode);
    ScrollButtonArea.bindBoxes[1]=newBox(0,0,14,14);
    ScrollButtonArea.bindBoxes[2]=newBox(0,15,14,14);


    keyboardImages.offX=keyboardOffX; keyboardImages.offY=keyboardOffY;
    keyboardImages["K1n"]={Imm0:keyboard1, ImmAct:CloneImage(keyboard1)};
    getimage(keyboardImages["K1n"].ImmAct, colorMode);
    keyboardImages["K1s"]={Imm0:keyboard1s, ImmAct:CloneImage(keyboard1s)};
    getimage(keyboardImages["K1s"].ImmAct, colorMode);
    keyboardImages["K1c"]={Imm0:keyboard1c, ImmAct:CloneImage(keyboard1c)};
    getimage(keyboardImages["K1c"].ImmAct, colorMode);
    keyboardImages["K2"]={Imm0:keyboard2, ImmAct:CloneImage(keyboard2)};
    getimage(keyboardImages["K2"].ImmAct, colorMode);
    keyboardImages["K4"]={Imm0:keyboard4, ImmAct:CloneImage(keyboard4)};
    getimage(keyboardImages["K4"].ImmAct, colorMode);
    keyboardImages["K5"]={Imm0:keyboard5, ImmAct:CloneImage(keyboard5)};
    getimage(keyboardImages["K5"].ImmAct, colorMode);
    SCCArea = {
        offX:keyboardOffX+202, offY:keyboardOffY,
        bindBoxes:[null,
            newBox(2,2,29,28),
            newBox(2,33,29,21),
            newBox(2,57,29,22)],
        Imm0:null,
        herePress:0
    }
    SCCArea.Imm0= new Image(32,81); SCCArea.Imm0.src="data/images/SendCopyClear.png";
    SCCArea.ImmAct= new Image(32,81); SCCArea.ImmAct.src="data/images/SendCopyClear.png";
    getimage(SCCArea.ImmAct, colorMode);


    XButton = {
        offX:245, offY:1,
        bindBoxes:[null,
            newBox(0,0,10,10)],
        Imm0:null,
        herePress:0
    }
    XButton.Imm0= new Image(10,10); XButton.Imm0.src="data/images/XButton.png";
    XButton.ImmAct= new Image(10,10); XButton.ImmAct.src="data/images/XButton.png";
    getimage(XButton.ImmAct, colorMode);


        ScrollBar = {
            offX:0, offY:22,
            bindBoxes:[null,
                newBox(0,0,10,10)],
            Imm0:null,
            ImmFilled:null,
            ImmTop:null,
            ImmBottom:null,
            herePress:0
        }
        XButton.Imm0= new Image(10,10); XButton.Imm0.src="data/images/XButton.png";
        XButton.ImmAct= new Image(10,10); XButton.ImmAct.src="data/images/XButton.png";
        getimage(XButton.ImmAct, colorMode);



    PictoString.resetString();
    updateOutput([]);

    //Forces the newly joined PictoChat app to scroll to the bottom.
    lastSent=true;

    setupEvents();
    setInterval(gradualCheck, 1000);
    setInterval(animDot, 1000*drawUpdateInterval);
}


function setupEvents(){

    document.addEventListener("keydown", function (e) {
         handleKeyboardEvent(e, "down");
    }, false);
    document.addEventListener("keyup", function (e) {
         handleKeyboardEvent(e, "up");
    }, false);
    /*
    canvas.addEventListener("mousemove", function (e) {
        e.preventDefault();
        //console.log("MOUSE")
        handleMouse(e, 'move')
    }, false);
    canvas.addEventListener("mousedown", function (e) {
        e.preventDefault();
        handleMouse(e, 'down')
    }, false);
    canvas.addEventListener("mouseup", function (e) {
        e.preventDefault();
        handleMouse(e, 'up')
    }, false);
    canvas.addEventListener("mouseout", function (e) {
        e.preventDefault();
        handleMouse(e, 'out')
    }, false);
    canvas.addEventListener("mousein", function (e) {
        e.preventDefault();
        handleMouse(e, 'in')
    }, false);
*/canvas.addEventListener('contextmenu', function(e){
    e.preventDefault()
    dragTimer=0;
}
);
    canvas.addEventListener("pointermove", function (e) {
        if (e.pointerType=="pen"){
            //console.log("PEN");
            e.preventDefault();
            handleMouse(e, 'move')
        }
        else if (e.pointerType=="mouse"){
            //console.log("MOUSE")
            e.preventDefault();
            handleMouse(e, 'move')
        }
        else if (e.pointerType=="touch"){
            e.preventDefault()
            handleTouchPointer(e, e.pointerId, "move");
        }
    }, false);
    canvas.addEventListener("pointerdown", function (e) {
        if (e.pointerType=="pen"){
            //console.log("PEN");
            e.preventDefault();
            handleMouse(e, 'down')
        }
        else if (e.pointerType=="mouse"){
            //console.log("MOUSE")
            e.preventDefault();
            handleMouse(e, 'down')
        }
        else if (e.pointerType=="touch"){
            e.preventDefault()
            handleTouchPointer(e, e.pointerId, "start");
        }
    }, false);
    canvas.addEventListener("pointerup", function (e) {
        if (e.pointerType=="pen"){
            //console.log("PEN");
            e.preventDefault();
            handleMouse(e, 'up')
        }
        else if (e.pointerType=="mouse"){
            //console.log("MOUSE")
            e.preventDefault();
            handleMouse(e, 'up')
        }
        else if (e.pointerType=="touch"){
            e.preventDefault()
            handleTouchPointer(e, e.pointerId, "end");
        }
    }, false);
    canvas.addEventListener("pointerout", function (e) {
        if (e.pointerType=="pen"){
            //console.log("PEN");
            e.preventDefault();
            handleMouse(e, 'out')
        }
        else if (e.pointerType=="mouse"){
            //console.log("MOUSE")
            e.preventDefault();
            handleMouse(e, 'out')
        }
        else if (e.pointerType=="touch"){
            e.preventDefault()
            handleTouchPointer(e, e.pointerId, "end");
        }
    }, false);
    canvas.addEventListener("pointercancel", function (e) {
        if (e.pointerType=="pen"){
            //console.log("PEN");
            e.preventDefault();
            handleMouse(e, 'out')
        }
        else if (e.pointerType=="mouse"){
            //console.log("MOUSE")
            e.preventDefault();
            handleMouse(e, 'out')
        }
        else if (e.pointerType=="touch"){
            e.preventDefault()
            handleTouchPointer(e, e.pointerId, "end");
        }
    }, false);
    canvas.addEventListener("pointerin", function (e) {

        if (e.pointerType=="pen"){
            //console.log("PEN");
            e.preventDefault();
            handleMouse(e, 'in')
        }
        else if (e.pointerType=="mouse"){
            //console.log("MOUSE")
            e.preventDefault();
            handleMouse(e, 'up')
        }
        else if (e.pointerType=="touch"){
            e.preventDefault()
            handleTouchPointer(e, e.pointerId, "end");
        }

    }, false);

    window.addEventListener("beforeunload", function (e){
        leaveMe()
    })
    document.getElementById('outputzone').addEventListener("scroll", function(e){
        scrolling=true;
        scrollingCountdown=scrollingCountdownMax;
        //console.log(document.getElementById('outputzone').scrollTop);
    });
    document.getElementById('openhelp').onclick=function(){
        console.log("HELP.");
        
        document.getElementById('helpsection').hidden=!(document.getElementById('helpsection').hidden);
        //console.log(document.getElementById('outputzone').scrollTop);
    }
    document.getElementById('mobilebar').onclick=function(){
        document.getElementById('manentry').hidden=!(document.getElementById('manentry').hidden);
        //console.log(document.getElementById('outputzone').scrollTop);
    }
    //window.onbeforeunload=leaveMe;
/*
    canvas.addEventListener("touchstart", function(e){
        handleTouch(e, "start");
    }, false);
    canvas.addEventListener("touchend", function(e){
        handleTouch(e, "end");
    }, false);
    canvas.addEventListener("touchcancel", function(e){
        handleTouch(e, "end");
    }, false);
    canvas.addEventListener("touchmove", function(e){
        handleTouch(e, "move");
    }, false);
    */
}
function leaveMe(){
    let xhr = new XMLHttpRequest();
    //console.log("Getting Messages.");
    xhr.open("POST", '/leave', false);

    xhr.send();
    document.getElementById("drawing").style.display= 'none';
//    window.close();
}
function gradualCheck(){
    if (countdown<=0){
        countdown=1+Math.ceil(Math.sqrt(0.5*currentXCount));
        currentXCount=currentXCount+1;
        //console.log(countdown);
        if (currentXCount>8){
            currentXCount=8
        }
        countdown=1
        getmessages();
    }
    countdown=countdown-1;
}
function animDot(){
    if (glyphs!=null){

        dotDraw(ctx);
        if (draggedGlyph!=null){
            if (dragTimer>0){
                dragTimer=dragTimer-(1*drawUpdateInterval);
            }else{isBeingDragged=true;}
            if (isBeingDragged){
                drawDraggedGlyph(ctx, supermouse);
            }
        }

    }
}
function getCharFromKey(keyCode){
    var thisCode=keyboards[keyboard_selected].keylist[keyCode]
    if (keyboards[keyboard_selected].keyboardMode=="Code"){
        if (SHIFT) { return thisCode.schar;}
        else if (CAPS && thisCode.caps){ return thisCode.schar;}
        else{return thisCode.char;}
    }else{return thisCode.char;}
}

function keyOps(keyCode, fireContext){
    //This is fired whenever a key is pressed.
    //Either on the on screen keyboard or the
    //hardware keyboard.
    //Fire Context can be 'keyboard' or 'mouse'
    let keyselected=keyboard_selected;
    if (fireContext=='keyboard'){
        //console.log("KEYBOARD")
        keyselected=1;
    }

    if (keyboards[keyselected].keylist.hasOwnProperty(keyCode)){
        var thisCode=keyboards[keyselected].keylist[keyCode]
        switch (keyCode){
            case "Enter":
                PictoString.addToString("+n");
                break;
            case "Space":
                PictoString.addToString(" ");
                break
            case "Backspace":
                PictoString.removeFromString();
                break;
            case "ShiftLeft":
                if (fireContext=='mouse'){SHIFT=true; mShift=true;}
                break;
            case "CapsLock":
                if (fireContext=='mouse'){CAPS=(!CAPS);}
                break;
            default:

                if (keyboards[keyselected].keyboardMode=="Code"){
                    if (SHIFT) { PictoString.addToString(thisCode.schar);}
                    else if (CAPS && thisCode.caps){PictoString.addToString(thisCode.schar);}
                    else{PictoString.addToString(thisCode.char);}
                    if (mShift) {SHIFT=false; mShift=false;}
                }else{PictoString.addToString(thisCode.char);}
        }
    }
}
function  handleKeyboardEvent(keyEvent, type){
    //currently matches with keyboard 1 only.
    if (type == "down"){
        if (keyEvent.key=="Shift"){
            keyEvent.preventDefault();
            SHIFT=true;
        }
        if (keyEvent.code=="CapsLock"){
            keyEvent.preventDefault();
            CAPS= !CAPS;
        }
        else{
            if (keyboards[1].keylist.hasOwnProperty(keyEvent.code)){
                keyEvent.preventDefault();
                keyboards[1].keylist[keyEvent.code].pressed=true;
                keyOps(keyEvent.code, 'keyboard');
            }
            else if(keyboards[keyboard_selected].hasOwnProperty(keyEvent.key)){
                keyEvent.preventDefault();
                keyboards[keyboard_selected].keylist[keyEvent.key].pressed=true;
                keyOps(keyEvent.code, 'keyboard');
            }
        }
    }
    if (type == "up"){
        if (keyEvent.key=="Shift"){
            keyEvent.preventDefault();
            SHIFT=false;
        }

        if (keyboards[1].keylist.hasOwnProperty(keyEvent.code)){
            keyEvent.preventDefault();
            keyboards[1].keylist[keyEvent.code].pressed=false;
        }
        else if(keyboards[keyboard_selected].hasOwnProperty(keyEvent.key)){
            keyEvent.preventDefault();
            keyboards[keyboard_selected].keylist[keyEvent.key].pressed=false;
            keyOps(keyEvent.code, 'keyboard');
        }
    }
    animDot();
}

function drawScaledImage(cont, image, X, Y){
    cont.drawImage(image, X*dotsize, Y*dotsize, image.naturalWidth*dotsize, image.naturalHeight*dotsize)
}

function burnInPictoString(picto){
    renderPictoString(picto, true);
}
function displayPictoString(picto){
    renderPictoString(picto, false);
}
function renderPictoString(picto, mode){
    //This function displays the pictostring;
    //Only run after update.

    //TO DO: ADD DEFAULT.
    var startX=picto.startX + drawOffX;
    var startY=picto.startY + drawOffY;
    var ims=0;
    var im=0;
    var imX=0;
    var imY=0;
    var burn=mode;

    for (index = 0; index < picto.currentString.length; index++) {
        var current=(picto.currentString[index]);
        if (glyphs.glyphs.hasOwnProperty(current)){
            var glyphX=glyphs.glyphs[current].px;
            var glyphY=glyphs.glyphs[current].py;
            var charwidth=glyphs.glyphs[current].width;
        if (((startX-drawOffX)+charwidth+1)>cols){
            startY=startY+16;
            startX=3+drawOffX;
        }
        if(current=="+n"){
            startY=startY+16;
            startX=3+drawOffX;
        }
         else{
             if (burn){
                 var data=(pctx.getImageData(glyphX*10, glyphY*13, charwidth, 12).data);
                 for (im=0;im<12*charwidth;im++){
                     //im=im*2;
                     imX=im%charwidth;
                     imY=Math.floor(im/charwidth);

                     if(data[im*4+3]>200){
                         dotAt(startX-drawOffX+imX,startY-drawOffY+imY,2);
                         dotChange=true;
                     }
                 }
                }

             else{
                 ctx.drawImage(glyph, glyphX*10*2, glyphY*13*2, charwidth*2, 12*2, startX*dotsize, startY*dotsize, charwidth*dotsize, 12*dotsize);
             }
         }
            startX=startX+charwidth+1;
        }
    }
}

function checkIfInKeyboardButtons(cx, cy){

    //Check if mouse cursor is in a keyboard button.
    var offX=keyboardOffX;
    var offY=keyboardOffY;


    var keys=Object.keys(keyboards[keyboard_selected].keylist);
    for (var k=0;k<keys.length;k++){
        var thisEntry=keyboards[keyboard_selected].keylist[keys[k]];

                xCond=((cx/dotsize>=(offX+thisEntry.xpos)) &&(cx/dotsize<=(offX+thisEntry.xpos+thisEntry.xsize)));
                yCond=((cy/dotsize>=(offY+thisEntry.ypos)) &&(cy/dotsize<=(offY+thisEntry.ypos+thisEntry.ysize)));

                if (xCond && yCond){
                    return keys[k];
                }

    }
    return null;
}

function checkIfInKeyboardSelect(cx, cy){
    //check if a pointer is in the keyboard select.
    var offX=keyboardSelectArea.offX;
    var offY=keyboardSelectArea.offY;
    for (var k=1;k<keyboardSelectArea.bindBoxes.length;k++){
        if (keyboardSelectArea.bindBoxes[k].inBounds(cx, cy,offX, offY)){
            keyboard_selected=k;
        }
    }
}
function checkIfInToolArea(cx, cy){
    var offX=drawingToolArea.offX;
    var offY=drawingToolArea.offY;
    for (var k=1;k<drawingToolArea.bindBoxes.length;k++){
        if (drawingToolArea.bindBoxes[k].inBounds(cx, cy,offX, offY)){
            switch(k){
                case 1:
                    if (toolActive==1){
                        penColor=penColor+1;
                        if (penColor>maxColors){
                            penColor=2;
                        }
                    }
                    else{
                        penColor=2;
                    }
                    toolActive=1;
                    break;
                case 2:
                    toolActive=2;
                    break;
                case 3:
                    toolSize=2;
                    break;
                case 4:
                    toolSize=1;
                    break;
            }
        }
    }
}

function checkIfInSCCArea(cx, cy, status){
    //Status can be up or down.
    var offX=SCCArea.offX;
    var offY=SCCArea.offY;
    var toset=0;
    for (var k=1;k<SCCArea.bindBoxes.length;k++){
        if (SCCArea.bindBoxes[k].inBounds(cx, cy,offX, offY)){
            if(status=='down'){
                //console.log(k);
                toset=k;
            }
            else if(status=='up'){
                if (SCCArea.herePress==k){
                    switch(k){
                        case 1:
                            sendmatrix();
                            clearmatrix();
                            SCCArea.herePress=0;
                            break;
                        case 2:
                            //console.log("There's nothing to copy.")
                            cloneCurrentOutput(outputimgs[scrollPlace]);
                            SCCArea.herePress=0;
                            break;
                        case 3:
                            //console.log("Clearing.");
                            clearmatrix();
                        //    dotChange=true;
                            SCCArea.herePress=0;
                            break;
                    }

                }
            }
        }
    }
    SCCArea.herePress=toset;
}

function checkIfInXButton(cx, cy, status){
    //Status can be up or down.
    var offX=XButton.offX;
    var offY=XButton.offY;
    var toset=0;
    for (var k=1;k<XButton.bindBoxes.length;k++){
        if (XButton.bindBoxes[k].inBounds(cx, cy,offX, offY)){
            if(status=='down'){
                //console.log(k);
                toset=k;
            }
            else if(status=='up'){
                if (XButton.herePress==k){
                    switch(k){
                        case 1:
                            leaveMe()
                            XButton.herePress=0;
                            break;
                    }

                }
            }
        }
    }
    XButton.herePress=toset;
}


function checkIfInScrollButtonArea(cx, cy, status){
    //Status can be up or down.
    var offX=ScrollButtonArea.offX;
    var offY=ScrollButtonArea.offY;
    var toset=0;
    for (var k=1;k<ScrollButtonArea.bindBoxes.length;k++){
        if (ScrollButtonArea.bindBoxes[k].inBounds(cx, cy,offX, offY)){
            if(status=='down'){
                //console.log(k);
                toset=k;
                ScrollButtonArea.animLoopScroll=0
            }
            else if(status=='up'){
                if (ScrollButtonArea.herePress==k){
                    switch(k){
                        case 1:
                            if (ScrollButtonArea.animLoopScroll==0){
                                console.log("Going up.")
                                scrollPlace=scrollPlace-1;
                                scrollToElement(true)
                            }
                            ScrollButtonArea.animLoopScroll=0;
                            ScrollButtonArea.herePress=0;

                            break;
                        case 2:
                            if (ScrollButtonArea.animLoopScroll==0){
                                scrollPlace=scrollPlace+1;
                                scrollToElement(true)
                                console.log("Going down.")
                            }
                            ScrollButtonArea.animLoopScroll=0;
                            ScrollButtonArea.herePress=0;
                            break;
                    }

                }
            }
        }
    }
    ScrollButtonArea.herePress=toset;

}


function toFillFormat(colorEntry, alpha){
    //Return a string with the color values and an alpha
    return "rgba("+colorEntry["r"]+", "+colorEntry["g"]+","+colorEntry["b"]+", "+alpha+")";
}
// function drawBox(cont, offX, offY, box){
//     cont.fillRect((offX+box.xpos)*dotsize, (offY+box.ypos)*dotsize, (box.xsize)*dotsize, (box.ysize)*dotsize);
//
// }
function drawBox(cont, areaObj, box){
    let offX=areaObj.offX;
    let offY=areaObj.offY;
    ////console.log(areaObj.ImmAct.src)
    cont.drawImage(areaObj.ImmAct, box.xpos, box.ypos, box.xsize, box.ysize, (offX+box.xpos)*dotsize, (offY+box.ypos)*dotsize, (box.xsize)*dotsize, (box.ysize)*dotsize);

    //cont.fillRect((offX+box.xpos)*dotsize, (offY+box.ypos)*dotsize, (box.xsize)*dotsize, (box.ysize)*dotsize);

}
function drawBoxes(cont){
    //For debugging.
    var offX=keyboardSelectArea.offX;
    var offY=keyboardSelectArea.offY;

    for (var k=1;k<keyboardSelectArea.bindBoxes.length;k++){
        var thisEntry=keyboardSelectArea.bindBoxes[k];

        cont.beginPath();
        cont.rect( (offX+thisEntry.xpos)*dotsize, (offY+thisEntry.ypos)*dotsize, (thisEntry.xsize)*dotsize, (thisEntry.ysize)*dotsize);
        cont.stroke();
        cont.closePath();

    }
}



function drawToolsArea(){
    var offX=drawingToolArea.offX;
    var offY=drawingToolArea.offY;
    drawScaledImage(ctx, drawingToolArea.Imm0, drawingToolArea.offX, drawingToolArea.offY)
    //ctx.drawImage(drawingToolArea.Imm0, drawingToolArea.offX*dotsize, drawingToolArea.offY*dotsize)
    ctx.fillStyle = overlayColor;
    switch (toolActive){
        case 1:
            drawBox(ctx, drawingToolArea, drawingToolArea.bindBoxes[1]);
            if (penColor>2){
                if (penColor==3){
                    ctx.fillStyle = '#ff1717';
                }
                if (penColor==4){
                    ctx.fillStyle = '#003cc8';
                }
                if (penColor==5){
                    ctx.fillStyle = '#008232';
                }
                if (penColor==6){
                    ctx.fillStyle = '#ffe600';
                }
                let box= drawingToolArea.bindBoxes[1];
                ctx.fillRect((offX+box.xpos)*dotsize, (offY+box.ypos)*dotsize, (box.xsize)*dotsize, (box.ysize)*dotsize)
            }
            break;
        case 2:
            drawBox(ctx,drawingToolArea, drawingToolArea.bindBoxes[2]);
            break;
    }
    switch (toolSize){
        case 2:
            drawBox(ctx,drawingToolArea, drawingToolArea.bindBoxes[3]);
            break;
        case 1:
            drawBox(ctx, drawingToolArea, drawingToolArea.bindBoxes[4]);
            break;
    }
}
function drawSCCArea(){
    var offX=SCCArea.offX;
    var offY=SCCArea.offY;
    drawScaledImage(ctx, SCCArea.Imm0, SCCArea.offX, SCCArea.offY);
    //ctx.drawImage(drawingToolArea.Imm0, drawingToolArea.offX*dotsize, drawingToolArea.offY*dotsize)
    ctx.fillStyle = overlayColor;
    switch (SCCArea.herePress){
        case 1:
            drawBox(ctx, SCCArea, SCCArea.bindBoxes[1]);
            break;
        case 2:
            drawBox(ctx, SCCArea, SCCArea.bindBoxes[2]);
            break;
        case 3:
            drawBox(ctx, SCCArea, SCCArea.bindBoxes[3]);
            break;
    }
}

function drawXButton(){
    var offX=XButton.offX;
    var offY=XButton.offY;
    drawScaledImage(ctx, XButton.Imm0, XButton.offX, XButton.offY);
    //ctx.drawImage(drawingToolArea.Imm0, drawingToolArea.offX*dotsize, drawingToolArea.offY*dotsize)
    ctx.fillStyle = overlayColor;
    switch (XButton.herePress){
        case 1:
            drawBox(ctx, XButton, XButton.bindBoxes[1]);
            break;
    }
}

function drawScrollButtons(){
    var offX=ScrollButtonArea.offX;
    var offY=ScrollButtonArea.offY;
    drawScaledImage(ctx, ScrollButtonArea.Imm0, ScrollButtonArea.offX, ScrollButtonArea.offY);
    //ctx.drawImage(drawingToolArea.Imm0, drawingToolArea.offX*dotsize, drawingToolArea.offY*dotsize)
    ctx.fillStyle = overlayColor;
    switch (ScrollButtonArea.herePress){
        case 1:
            drawBox(ctx, ScrollButtonArea, ScrollButtonArea.bindBoxes[1]);
            break;
        case 2:
            drawBox(ctx, ScrollButtonArea, ScrollButtonArea.bindBoxes[2]);
            break;
    }
}
function drawKeyboardSelect(){
    drawScaledImage(ctx, keyboardSelectArea.Imm0, keyboardSelectArea.offX, keyboardSelectArea.offY)
    //ctx.drawImage(keyboardSelectArea.Imm0,keyboardSelectArea.offX*dotsize,keyboardSelectArea.offY*dotsize);
    switch (keyboard_selected){
        case 1:
            drawBox(ctx, keyboardSelectArea, keyboardSelectArea.bindBoxes[1])
    //        drawScaledImage(ctx, keyboardSelectArea.Imm1, keyboardSelectArea.offX, keyboardSelectArea.offY)
            //ctx.drawImage(keyboardSelectArea.Imm1,keyboardSelectArea.offX,keyboardSelectArea.offY);
            break;
        case 2:
            drawBox(ctx, keyboardSelectArea, keyboardSelectArea.bindBoxes[2])
            //drawScaledImage(ctx, keyboardSelectArea.Imm2, keyboardSelectArea.offX, keyboardSelectArea.offY)
            //ctx.drawImage(keyboardSelectArea.Imm2,keyboardSelectArea.offX,keyboardSelectArea.offY);
            break;
        case 3:
            drawBox(ctx, keyboardSelectArea, keyboardSelectArea.bindBoxes[3])
            //drawScaledImage(ctx, keyboardSelectArea.Imm3, keyboardSelectArea.offX, keyboardSelectArea.offY)
            //ctx.drawImage(keyboardSelectArea.Imm3,keyboardSelectArea.offX,keyboardSelectArea.offY);
            break;
        case 4:
            drawBox(ctx, keyboardSelectArea, keyboardSelectArea.bindBoxes[4])
            //drawScaledImage(ctx, keyboardSelectArea.Imm4, keyboardSelectArea.offX, keyboardSelectArea.offY)
            //ctx.drawImage(keyboardSelectArea.Imm4,keyboardSelectArea.offX,keyboardSelectArea.offY);
            break;
        case 5:
            drawBox(ctx, keyboardSelectArea, keyboardSelectArea.bindBoxes[5])
            //drawScaledImage(ctx, keyboardSelectArea.Imm5, keyboardSelectArea.offX, keyboardSelectArea.offY)
            //ctx.drawImage(keyboardSelectArea.Imm5,keyboardSelectArea.offX,keyboardSelectArea.offY);
            break;
    }
    //drawBoxes(ctx);
}
function setDraggedGlyph(keyDown,cX, cY){
    if (keyDown!=null){
        var current=getCharFromKey(keyDown);

        if (glyphs.glyphs.hasOwnProperty(current)){
            burnInPictoString(PictoString);
            PictoString.resetString();
            PictoString.setStart(Math.floor(cX/dotsize)-drawOffX, Math.floor(cY/dotsize)-drawOffY);
            PictoString.addToString(current);
         }

    }
}
function drawDraggedGlyph(cont, superevt){
    let cX=superevt.currX;
    let cY=superevt.currY;
    if (draggedGlyph!=null){
        var current=getCharFromKey(draggedGlyph);
        if (glyphs.glyphs.hasOwnProperty(current)){
            var glyphX=glyphs.glyphs[current].px;
            var glyphY=glyphs.glyphs[current].py;
            var charwidth=glyphs.glyphs[current].width;
             cont.drawImage(glyph, glyphX*10*2, glyphY*13*2, charwidth*2, 12*2, cX, cY, charwidth*dotsize, 12*dotsize);
         }

    }
}
function drawKeyboard(cont){
    var offX=keyboardOffX;
    var offY=keyboardOffY;
    let keyboardObject=keyboardImages["K1n"];
    if (keyboard_selected==1){
        if (SHIFT){
            keyboardObject=keyboardImages["K1s"];
        }
        else if(CAPS){
            keyboardObject=keyboardImages["K1c"];
        }else{
            keyboardObject=keyboardImages["K1n"];
        }
    }
    else if (keyboard_selected==2){
        keyboardObject=keyboardImages["K2"];
    }
    else if (keyboard_selected==3){
        keyboard_selected=5
        keyboardObject=keyboardImages["K5"];
    }
    else if (keyboard_selected==4){
        keyboardObject=keyboardImages["K4"];
        //drawScaledImage(cont,keyboard4, offX, offY);
    }
    else if (keyboard_selected==5){
        keyboardObject=keyboardImages["K5"];
        //drawScaledImage(cont,keyboard5, offX, offY);
    }
    drawScaledImage(cont,keyboardObject.Imm0, offX, offY);
    var keys=Object.keys(keyboards[keyboard_selected].keylist);
    cont.fillStyle=toFillFormat(colorPallate["color5"], 0.5);
    for (var k=0;k<keys.length;k++){
        var thisEntry=keyboards[keyboard_selected].keylist[keys[k]];
        if (thisEntry.hasOwnProperty("pressed")){
            if (thisEntry.pressed==true){
            //    drawBox(cont, keyboardObject, thisEntry);
                cont.fillRect((offX+thisEntry.xpos)*dotsize, (offY+thisEntry.ypos)*dotsize, (thisEntry.xsize)*dotsize, (thisEntry.ysize)*dotsize);
            }
        }
    }
}
var changeddotsize=false
function changeDotSize(newdotsize){
    dotsize=newdotsize;
    changeddotsize=true;
    for (let i=0;i<array2D.length;i++){
        let row =array2D[i];
        for (let j=0; j<row.length;j++){
                arr2DChanges[i][j]=true;
        }
    }
}
function dotUpdate(cont){

    if (dotChange){
        if (changeddotsize){
            dctx.clearRect(0,0,500,500);
            changeddotsize=false;
        }
    //    dctx.clearRect(0, 0, 228, 80);
    //    dctx.drawImage(backgroundImg,0-3,0-2)

        for (let i=0;i<array2D.length;i++){
            let row =array2D[i];
            for (let j=0; j<row.length;j++){
                if ((row[j]!=null)){
                    if (arr2DChanges[i][j]){
                        if (array2D[i][j]==2){
                            dctx.fillStyle = "#141414";
                            dctx.fillRect((i)*dotsize, (j)*dotsize, 1*dotsize, 1*dotsize);
                        }
                        else if (array2D[i][j]==3){
                            dctx.fillStyle = '#ff1717';
                            dctx.fillRect((i)*dotsize, (j)*dotsize, 1*dotsize, 1*dotsize);
                        }
                        else if (array2D[i][j]==4){
                            dctx.fillStyle = '#003cc8';
                            dctx.fillRect((i)*dotsize, (j)*dotsize, 1*dotsize, 1*dotsize);
                        }
                        else if (array2D[i][j]==5){
                            dctx.fillStyle = '#008232';
                            dctx.fillRect((i)*dotsize, (j)*dotsize, 1*dotsize, 1*dotsize);
                        }
                        else if (array2D[i][j]==6){
                            dctx.fillStyle = '#ffe600';
                            dctx.fillRect((i)*dotsize, (j)*dotsize, 1*dotsize, 1*dotsize);
                        }
                        else{
                            dctx.clearRect((i)*dotsize, (j)*dotsize, 1*dotsize, 1*dotsize);
                            if ((j+1)%16 == 0){dctx.fillStyle = toFillFormat(colorPallate["color2"], 1); dctx.fillRect((i)*dotsize, (j)*dotsize, 1*dotsize, 1*dotsize);}

                        }
                        arr2DChanges[i][j]=false;
                    }
                }
            }
        }
        dotChange=false;

    }
    //drawingImage.src=matrixCanvas.toDataURL();
    ////console.log(drawingImage.src);
    //return drawingImage;
    cont.putImageData(dctx.getImageData(0,0,cols*dotsize, rows*dotsize),  drawOffX*dotsize, drawOffY*dotsize, 0,0,cols*dotsize, rows*dotsize)
}
function scrollCheck(){
    var out=document.getElementById('outputzone');
    //console.log(out.scrollHeight, out.scrollTop)
    var scrolledToBottom = (out.scrollHeight -out.scrollTop  );


    // scroll to bottom if isScrolledToBottom is true
    if (scrolledToBottom <= 300) {
      return true;
    }
    return false;
}

function scrollToElement(override = false){
    if (scrollPlace<0){scrollPlace=0;}
    if (scrollPlace>=outputimgs.length){scrollPlace=outputimgs.length-1;}
    if ((scrolling==false) || override==true){
        if ((!scrollCheck() || override==true)  && lastSent==false){
            //I don't want it to interrupt scrolling downwards.
            outputimgs[Math.floor(scrollPlace)].scrollIntoView({behavior: "auto", block:"end", inline:"nearest"});
        }
    }
    if (scrollPlace<minPos){
        minPos=scrollPlace;
        if ((maxPos-minPos)>=33){
            maxPos=minPos+33
        }
    }
    if (scrollPlace>maxPos){
        //console.log("updated")
        maxPos=scrollPlace;
        if ((maxPos-minPos)>=33){
            minPos=maxPos-33
        }
    }
}

function updateOutput(elements){
    //outputimgs=[];
    document.getElementById('outputzone').innerHTML = "";

    for (let i=0;i<elements.length;i++){
        let img=new Image();
        img.src=elements[i];
        outputimgs.push(img);
    }
    var scrollTo=true;
    var lastImage=null;
    for (let i=0; i<outputimgs.length;i++){
        //img
        document.getElementById('outputzone').appendChild(outputimgs[i]);

        outputimgs[i].onload = function (e){
            if(scrollTo || lastSent){
                scrollPlace=i; scrollingCountdown=0;
                scrolling=false; scrollToElement(true);
                }
                if (lastSent){
                    document.getElementById('outputzone').scrollBy({top: 1000000, left: 0, behavior: 'smooth'});
                    lastSent=false;
                }
         }
    }
    scrollTo=scrollCheck();


 }
//



var toFillIn=[]
function drawScrollBar(cont){
        var offX=ScrollBar.offX;
        var offY=ScrollBar.offY+4;
        cont.beginPath();
                cont.fillStyle = overlayColor;
        if ((maxPos+1)<outputimgs.length){
            let startX=(offX+3+2)*dotsize;
            let startY=(offY+(4*(34+1)))*dotsize;
            cont.fillRect( startX, startY, (8)*dotsize, (2)*dotsize);
        }
        if ((maxPos+2)<outputimgs.length){
            let startX=(offX+3+4)*dotsize;
            let startY=(offY+(4*(34+2)))*dotsize;
            cont.fillRect( startX, startY, (4)*dotsize, (2)*dotsize);
        }
        for (let k=0;k<=maxPos-minPos;k++){
                    cont.fillStyle = overlayColor;
            if (toFillIn.includes(maxPos-k)){
                cont.fillStyle=("rgba(24,24,24,1)")
            }
            if (k==(maxPos-scrollPlace)){
                cont.fillStyle=("rgba(0,0,0,1)")
            }


            let startX=(offX+3)*dotsize;
            let startY=(offY+(4*(34-k)))*dotsize;
            cont.fillRect( startX, startY, (12)*dotsize, (2)*dotsize);
            cont.stroke();


        }
        cont.fillStyle = overlayColor;
        if ((minPos-1)>-1){
            let startX=(offX+3+2)*dotsize;
            let startY=(offY+(4*(0)))*dotsize;
            cont.fillRect( startX, startY, (8)*dotsize, (2)*dotsize);
        }
        if ((minPos-2)>-1){
            let startX=(offX+3+4)*dotsize;
            let startY=(offY+(4*(-1)))*dotsize;
            cont.fillRect( startX, startY, (4)*dotsize, (2)*dotsize);
        }
        cont.closePath();
}


function scrollTranslate(){
    var div=document.getElementById('outputzone')
    var top, min = 0;
    let newscrollplace=null;
    var scrollTop=document.getElementById('outputzone').scrollTop;
    toFillIn=[];
    for (var i=0; i<outputimgs.length; i++) {
        top = (outputimgs[i].offsetTop-div.offsetTop);
        //console.log(top, scrollTop, scrollTop+div.clientHeight);
        if (top > scrollTop && top < scrollTop+div.clientHeight && top>min) {
            min = top;
        //    console.log("OKOK");
            newscrollplace=i;
            toFillIn.push(i);
            //console.log(i);
            //
        }
    }
    return newscrollplace;
}

function drawOutput(){
    document.getElementById('outputzone').scrollTop;

    octx.clearRect(0,0,w,h);
    octx.drawImage(topScreen,0,0);
    drawScrollBar(octx);

    if (ScrollButtonArea.herePress>0){
        switch(ScrollButtonArea.herePress){
            case 1:
                scrollPlace=scrollPlace-1;
                scrollToElement(true);

                ScrollButtonArea.animLoopScroll=2;
                break;
            case 2:
                scrollPlace=scrollPlace+1;
                scrollToElement(true);

                ScrollButtonArea.animLoopScroll=2;
                break;
        }

    }
    else{
        scrollPlace=scrollTranslate();
        if (scrollingCountdown>0){
            scrollingCountdown=scrollingCountdown-1;
        }
        else{
            scrolling=false;
        }

        scrollToElement();
    }
}
function dotDraw(cont){
    //This draws the entire window.
    cont.clearRect(0, 0, w, h);
    drawScaledImage(cont, backcomp1, drawOffX-6,drawOffY-6);

    //drawScaledImage(cont,backgroundImg,drawOffX-3,drawOffY-3);
    dotUpdate(cont);
    scrollCheck()

    drawOutput()

//    drawScaledImage(cont, drawingImage, drawOffX, drawOffY);

    drawScaledImage(cont,backgroundImg2,drawOffX-3,drawOffY-3);
    // for (var i=0;i<array2D.length;i++){
    //     var row =array2D[i];
    //     for (var j=0; j<row.length;j++){
    //         if ((row[j]!=null) || (arr2DChanges[i][j]!=null)){
    //             if (array2D[i][j]==2){
    //             cont.fillRect((drawOffX+i)*dotsize, (drawOffY+j)*dotsize, dotsize, dotsize);
    //             }
    //         }
    //     }
    // }
    //Keyboard Drawing.
    drawKeyboard(cont);
    drawScrollButtons();
    drawKeyboardSelect();
    drawToolsArea();
    drawSCCArea();
    drawXButton();
    //Make Text.
    displayPictoString(PictoString);
    displayPictoString(PictoStringName);
}

function dotAt(i,j,val){
    //Color the dot at i, j with the number specified with val.
    if (i <array2D.length && i>=0){
        if (j<array2D[i].length && j>=0){
            if (array2D[i][j]!=val){
                array2D[i][j]=val;
                arr2DChanges[i][j]=true;
            }
        }
    }
}

function dotWithTool(i, j){
    //will apply tiik
    if (toolActive==1){
        //Pen Color is a integer, to determine which color will be used.
        dotAt(i,j,penColor);

        dotChange=true;
    }
    else if(toolActive==2){
        dotAt(i,j,0);
        dotChange=true;
    }
}

function dotFill(i,j){
    switch(toolSize){
        case 1:
            dotWithTool(i,j);
            break;
        case 2:
            dotWithTool(i,j);
            dotWithTool(i,j+1);
            dotWithTool(i+1,j);
            dotWithTool(i+1,j+1);
            break;
    }
}


function dotLineDraw(x0,y0,x1,y1){
    //derived from: https://en.wikipedia.org/wiki/Bresenham%27s_line_algorithm
    //Modified

    var startX, endX, startY, endY, cX, cY, erInt, step;
    var dx =x1-x0; var dy=y1-y0;
    var adx = Math.abs(dx); var ady=Math.abs(dy);
    step=-1;

    if (ady<=adx){
        if (dx>=0){
            startX=x0;
            startY=y0;
            endX=x1;
            if (dy>0){ step=1;} //the same.
        }
        else if (dx<0){
            startX=x1;
            startY=y1;
            endX=x0;
            if (dy<0){ step=1;} //the same.

        }
        erInt=(2*ady)-adx;
        cY=startY;
        for( cX=startX; cX<=endX;cX++){
            dotFill(cX,cY);
            if (erInt>0){
                cY=cY+step;
                erInt= erInt+ 2 *(ady-adx);
            }else{
                erInt= erInt+ 2 *(ady);
            }
        }
    }
    else{
        if (dy>=0){
            startX=x0;
            startY=y0;
            endY=y1;
            if (dx>0){ step=1;} //the same.
        }
        else if (dy<0){
            startX=x1;
            startY=y1;
            endY=y0;
            if (dx<0){ step=1;} //the same.

        }
        erInt=(2*adx)-ady;
        cX=startX;
        for( cY=startY; cY<=endY;cY++){
            dotFill(cX,cY);
            if (erInt>0){
                cX=cX+step;
                erInt= erInt+ 2 *(adx-ady);
            }else{
                erInt= erInt+ 2 *(adx);
            }
        }
    }
}
function dotPoint(x,y){
    //Convert to Dot.
    //var i= Math.floor((x-drawOffX)/dotsize);
    //var j = Math.floor((y-drawOffY)/dotsize);
    var i=Math.floor((x/dotsize))-drawOffX;
    var j=Math.floor((y/dotsize))-drawOffY;
    dotFill(i,j)
}
function dotLineFill(lx, ly, x, y){
    //Convert two sets of coordinates to the type used by the dot matrix.
    var i1=Math.floor((lx/dotsize))-drawOffX;
    var j1=Math.floor((ly/dotsize))-drawOffY;
    var i2= Math.floor((x/dotsize))-drawOffX;
    var j2 = Math.floor((y/dotsize))-drawOffY;
    dotLineDraw(i1,j1,i2,j2);
}

function clearmatrix() {
    //console.log("Placeholder.");
    PictoString.resetString();
    for (var i=0;i<array2D.length;i++){
        var row =array2D[i];
        for (var j=0; j<row.length;j++){
            dotAt(i,j,0);
            //array2D[i][j]=null;
        }
    }
    dotChange=true;
}

function getimage(image, mode){
    let src=image.src;
    fetch("color/?image="+src+"&pallate="+mode)
      .then(response => response.json())
      .then(glyp => image.src=glyp.resp);

}

function cloneCurrentOutput(source){

    let cloneCanvas = document.getElementById('copy');
    cloneCanvas.width = source.width;
    cloneCanvas.height = source.height;
    let cloneCTX=cloneCanvas.getContext('2d')
    cloneCTX.drawImage(source, 0, 0);
    let drawSizeX=source.width-3;
    let drawSizeY=source.height-3;
    let data = cloneCTX.getImageData(3, 3, drawSizeX, drawSizeY).data;
    let im=0;
    let r, g, b, a= -7;
    for (im=0;im<drawSizeX*drawSizeY;im++){
        //im=im*2;
        let imX=im%drawSizeX;
        let imY=Math.floor(im/drawSizeX);
        //console.log(imX, imY)
        r=data[im*4]; g=data[im*4+1]; b=data[im*4+2]; a=data[im*4+3];
        //console.log(r,g,b);
        if(r==20 && g==20 && b==20&& a>200){
            dotAt(imX,imY,2);
            dotChange=true;
        }
        if(r==255 && g==23 && b==23&& a>200){
            dotAt(imX,imY,3);
            dotChange=true;
        }
        if(r==0 && g==60 && b==200 && a>200){
            dotAt(imX,imY,4);
            dotChange=true;
        }
        if(r==0 && g==130 && b==50 && a>200){
            dotAt(imX,imY,5);
            dotChange=true;
        }
        if(r==255 && g==230 && b==0 && a>200){
            dotAt(imX,imY,6);
            dotChange=true;
        }
    }
}

function getmessages(){

        let xhr = new XMLHttpRequest();
        //console.log("Getting Messages.");
        xhr.open("POST", '/getmatrix', true);
        xhr.timeout=5000;
        //Send the proper header information along with the request
        xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
        xhr.overrideMimeType("text/plain");
        xhr.onreadystatechange = function() { // Call a function when the state changes.
            if (xhr.readyState == XMLHttpRequest.DONE) {
            //    alert(xhr.responseText);
                let elem=JSON.parse(xhr.responseText);
                if (elem.length>0){
                    updateOutput(elem);
                    currentXCount=0;
                    countdown=0;
                }
                //...toISOString();
            }
            else{

            }
        }
        xhr.ontimeout = function (e){
            //console.log("timeout...");
        };

        xhr.send("position="+lastTime.toISOString());
    }
// xhr.send(new Int8Array());
// xhr.send(document);
    ////console.log("Placeholder.");


function sendmatrix() {
    //post dot matrix to back end.
    var xhr = new XMLHttpRequest();
    burnInPictoString(PictoString);
    xhr.open("POST", '/sendmatrix', true);

    //Send the proper header information along with the request
    xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
    xhr.overrideMimeType("text/plain");
    xhr.onreadystatechange = function() { // Call a function when the state changes.
        if (this.readyState === XMLHttpRequest.DONE && this.status === 200) {
            currentXCount=0;
            countdown=0;
            lastSent=true;
            //document.getElementById('outputzone').scrollBy({top: 10000, left: 0, behavior: 'smooth'});
            ////console.log("Finished.");
            // Request finished. Do processing here.
        }
    }
    resp="";
    for (var i=0;i<array2D.length;i++){
        var row =array2D[i];
        for (var j=0; j<row.length;j++){
                if (array2D[i][j]==2){
                    resp=resp+"2";
                //cont.fillRect((drawOffX+i)*dotsize, (drawOffY+j)*dotsize, dotsize, dotsize);
                }
                else{
                    resp=resp+"1";
                }
        }
    }
    content=JSON.stringify(array2D);
    xhr.send("?username=bar&matrix="+content);
// xhr.send(new Int8Array());
// xhr.send(document);
    ////console.log("Placeholder.");
}

function sleep(milliseconds) {
  const date = Date.now();
  let currentDate = null;
  do {
    currentDate = Date.now();
  } while (currentDate - date < milliseconds);
}

function whoami() {
    //post dot matrix to back end.
    var xhr = new XMLHttpRequest();
    xhr.open("POST", '/whoami', true);

    //Send the proper header information along with the request
    xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
    xhr.overrideMimeType("text/plain");
    xhr.onreadystatechange = function() { // Call a function when the state changes.
        if (this.readyState === XMLHttpRequest.DONE && this.status === 200) {
            //console.log("Finished.");
            jsonv=JSON.parse(xhr.responseText);
            displayName=jsonv.displayname;
            colorMode=jsonv.pallate;
            //console.log(displayName, colorMode)

            // Request finished. Do processing here.
        }
    }
    xhr.send();
// xhr.send(new Int8Array());
    // xhr.send(document);
    //console.log("Placeholder.");
}

function handleMovementEvent(superevt, type){
    if (type == 'down') {
        //Check if in drawing box.
        if (drawingBox.inBounds(superevt.currX, superevt.currY, 0, 0)){
            //console.log(drawingBox.xpos, drawingBox.ypos, drawingBox.xsize, drawingBox.ysize)
            //console.log(superevt.currX/dotsize, superevt.currY/dotsize)
            superevt.draw_flag = true;
            superevt.draw_start_flag = true;
            if (superevt.draw_start_flag) {
                dotPoint(superevt.currX, superevt.currY);
                superevt.draw_start_flag = false;
            }
        }

        //KeyboardCheck.
        var isIn=checkIfInKeyboardButtons(superevt.currX, superevt.currY);
        if (isIn!=null){
            superevt.keyDown=isIn;
            dragTimer=1;
            draggedGlyph=isIn;
            keyboards[keyboard_selected].keylist[superevt.keyDown].pressed=true;
        }
        //ToggleButtonChecks
        checkIfInKeyboardSelect(superevt.currX,superevt.currY);
        //CheckIfInTools
        checkIfInToolArea(superevt.currX, superevt.currY);
        //checkIfInSCCArea
        checkIfInSCCArea(superevt.currX, superevt.currY, 'down');
        checkIfInScrollButtonArea(superevt.currX, superevt.currY, 'down');
        checkIfInXButton(superevt.currX, superevt.currY, 'down');
    }
    if (type== 'up'){
        var isIn=checkIfInKeyboardButtons(superevt.currX, superevt.currY);
        if (isIn!=null){
            if (superevt.keyDown==isIn)
            {
                keyOps(superevt.keyDown, 'mouse');
            }
        }
        if (superevt.keyDown!=null){
            if (drawingBox.inBounds(superevt.currX, superevt.currY, 0, 0)&&isBeingDragged){

                setDraggedGlyph(draggedGlyph, superevt.currX, superevt.currY)

            }
            keyboards[keyboard_selected].keylist[superevt.keyDown].pressed=false;

            superevt.keyDown=null;
        }
        ////console.log(SCCArea.herePress)
        if (SCCArea.herePress>0){
            checkIfInSCCArea(superevt.currX, superevt.currY, 'up')
        }
        if (ScrollButtonArea.herePress>0){
            checkIfInScrollButtonArea(superevt.currX, superevt.currY, 'up');
        }
        if (XButton.herePress>0){
            checkIfInXButton(superevt.currX, superevt.currY, 'up');
        }
        superevt.draw_flag = false;
        draggedGlyph=null;
        isBeingDragged=false;
    }

    if (type == 'move') {

        if (isBeingDragged==false){
        if (superevt.keyDown!=null){
                    var isIn=checkIfInKeyboardButtons(superevt.currX, superevt.currY);
            if (isIn!=null && dragTimer>0){

                keyboards[keyboard_selected].keylist[superevt.keyDown].pressed=false;

                superevt.keyDown=isIn;
                draggedGlyph=isIn;
                dragTimer=1;
                keyboards[keyboard_selected].keylist[superevt.keyDown].pressed=true;
            }
            else if (isIn==null){
                draggedGlyph=null;
                keyboards[keyboard_selected].keylist[superevt.keyDown].pressed=false;
            }
        }
    }
        if (superevt.draw_flag) {
            dotLineFill(superevt.prevX, superevt.prevY, superevt.currX, superevt.currY)
        }
    }
    //dotDraw(ctx);
    dotDraw(ctx);
    if (isBeingDragged){
        drawDraggedGlyph(ctx, superevt);
    }
    //drawDraggedGlyph(ctx, superevt);
    ctx.beginPath();
    ctx.fillRect(superevt.currX, superevt.currY, 2*dotsize, 2*dotsize);
    ctx.closePath();
}


function handleMouse(mouseEvent, type) {
    //This function is for the mouse and pen only.
    supermouse.prevX = supermouse.currX;
    supermouse.prevY = supermouse.currY;
     var rect = canvas.getBoundingClientRect();
    supermouse.currX = mouseEvent.clientX - rect.left;
    supermouse.currY = mouseEvent.clientY -rect.top;
    if (type=='out' ||type=='in'){
        handleMovementEvent(supermouse, 'up');
    }
    handleMovementEvent(supermouse, type);
}

var supertouches=[];
var activetouches=0;
function getIndexOfSupertouch(id){ //O(n)
    for (let i=0;i<supertouches.length;i++){
        if (supertouches[i].id==id){
            return i;
        }
    }
    return -1;
}

function handleTouchPointer(touch, identifier, type){
            var rect = canvas.getBoundingClientRect();
    if (type=="start"){

        let supertouch=new newSuperEvent();
        if  (getIndexOfSupertouch(identifier)!=-1){
            supertouch=supertouches[getIndexOfSupertouch(identifier)];
        }
        supertouch.id=identifier;
        supertouch.currX = touch.clientX - rect.left
        supertouch.currY = touch.clientY - rect.top;

        handleMovementEvent(supertouch,'down');
        supertouches.push(supertouch);
    //    supertouches.push(supertouch)
        activetouches=activetouches+1;
    }
    else if (type=="move"){
        let index=getIndexOfSupertouch(identifier);
        //console.log(index)
        if  (index==-1){
            return false;
        }
        let supertouch=supertouches[index];
        ////console.log(supertouch)
        supertouch.prevX=supertouch.currX;
        supertouch.prevY=supertouch.currY;
        supertouch.currX = touch.clientX - rect.left
        supertouch.currY = touch.clientY - rect.top;
        //console.log(supertouch.prevX, supertouch.prevY, supertouch.currX, supertouch.currY)
        handleMovementEvent(supertouch,'move');
        supertouches.splice(index, 1, supertouch);
    //    supertouches[index]=supertouch;
    }
    else if (type=="end"){
        let index=getIndexOfSupertouch(identifier);
        if  (index==-1){
            return false;
        }
        let supertouch=supertouches[index];
        //console.log(supertouch)
        supertouch.prevX=supertouch.currX;
        supertouch.prevY=supertouch.currY;
        supertouch.currX = touch.clientX - rect.left
        supertouch.currY = touch.clientY - rect.top;
        handleMovementEvent(supertouch,'up');
        supertouches.splice(index, 1);
        activetouches=activetouches-1;
        if (activetouches<=0){
            supertouches=[];
        }
    }
}
function handleTouchEvent(touchevent, type){
    touchevent.preventDefault()

//      if (touchevent.touches.length > 1 || (touchevent.type == "touchend" && touchevent.touches.length > 0))/
//        return;
    for (let i=0;i<touchevent.changedTouches.length;i++){
        let touch = touchevent.changedTouches[i];
        identifier=touch.identifier
        prosessTouch(touch, identifier, type);
    }
    //        //console.log(supertouches);
}
