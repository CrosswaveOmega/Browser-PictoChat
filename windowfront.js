var canvas, preview, offscreen, matrixCanvas, ctx, pctx, dctx = null;

var outputCanvas, octx=null;

var draw_flag = false;
var prevX, currX, prevY, currY=0;
var tap_flag = false;
var offset=4;
var drawOffX=26;
var drawOffY=6;

var keyboardOffX=24;
var keyboardOffY=91;

var dotChange=true;


var outputimgs=[];

var overlayColor="rgba(0, 0, 255, 0.5)";
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
var keyDown=null;
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

var PictoString = {
    currentString:[],
    defaultX:63, defaultY:2,
    startX:0, startY:0,
    resetString:function(){this.startX=this.defaultX;this.startY=this.defaultY; this.currentString=[];},
    setStart:function(x, y){this.startX=x; this.startY=y;},
    addToString:function(char){ this.currentString.push(char);},
    removeFromString:function(){ this.currentString.pop();}
}
let glyphs={}

//var glyphs={
//    "A":{px:1,py:1, width=5}, "a":{px:1, py:2}
//}
//Resources:

var keyboardSelectArea=null;
var drawingToolArea=null;
var drawingBox=null;
var SCCArea=null;

const backgroundImg=new Image (234, 85); backgroundImg.src = 'images/PictochatWindowLines.png';
const backgroundImg2=new Image (234, 85); backgroundImg2.src = 'images/PictochatWindowOverlay.png';


const backcomp1=new Image (238, 176); backcomp1.src = 'images/Back01.png';
const keyboard1=new Image (200, 81); keyboard1.src = 'images/Keyboard1Normal.png';
const keyboard1s=new Image (200, 81); keyboard1s.src = 'images/Keyboard1Shift.png';
const keyboard1c=new Image (200, 81); keyboard1c.src = 'images/Keyboard1Caps.png';
const keyboard2=new Image (200, 81); keyboard2.src = 'images/KeyboardAccent.png';
const keyboard4=new Image (200, 81); keyboard4.src = 'images/KeyboardSymbol.png';
const keyboard5=new Image (200, 81); keyboard5.src = 'images/KeyboardPictogram.png';

//const keyboard2=new Image (200, 81); keyboard2.src = 'images/KeyboardAccent.png';
const glyph=new Image (320*2, 377*2); glyph.src = 'images/Glyphs.png';
const glyphX1=new Image (320, 377); glyphX1.src = 'images/Glyphs11.png';
var drawingImage=new Image();// drawingImage.src = '/images/PictochatWindowOverlay.png';

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

function init() {
    fetch('./glyphs.json')
      .then(response => response.json())
      .then(glyp => glyphs=glyp);

    fetch('./keyboard2.json')
      .then(response => response.json())
      .then(glyp => keyboards[2]=glyp);

    fetch('./keyboard4.json')
      .then(response => response.json())
      .then(glyp => keyboards[4]=glyp);

    fetch('./keyboard5.json')
      .then(response => response.json())
      .then(glyp => keyboards[5]=glyp);

    canvas = document.getElementById('drawing');
    preview =  document.getElementById('animating');
    matrixCanvas =  document.getElementById('dotDraw');
    outputCanvas =  document.getElementById('output')

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
                arr2DChanges[i][j]=false;
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
        offX:4, offY:keyboardOffY+5,
        bindBoxes:[null, null, null, null, null, null]
    };
    keyboardSelectArea.Imm0=new Image(14,82); keyboardSelectArea.Imm0.src="images/KeyboardSelectOFF.png";
    keyboardSelectArea.Imm1=new Image(14,82); keyboardSelectArea.Imm1.src="images/KeyboardSelectON1.png";
    keyboardSelectArea.Imm2=new Image(14,82); keyboardSelectArea.Imm2.src="images/KeyboardSelectON2.png";
    keyboardSelectArea.Imm3=new Image(14,82); keyboardSelectArea.Imm3.src="images/KeyboardSelectON3.png";
    keyboardSelectArea.Imm4=new Image(14,82); keyboardSelectArea.Imm4.src="images/KeyboardSelectON4.png";
    keyboardSelectArea.Imm5=new Image(14,82); keyboardSelectArea.Imm5.src="images/KeyboardSelectON5.png";
    keyboardSelectArea.bindBoxes[1]=newBox(0,0,14,14);
    keyboardSelectArea.bindBoxes[2]=newBox(0,17,14,14);
    keyboardSelectArea.bindBoxes[3]=newBox(0,34,14,14);
    keyboardSelectArea.bindBoxes[4]=newBox(0,51,14,14);
    keyboardSelectArea.bindBoxes[5]=newBox(0,68,14,14);
    toolActive=1;
    toolSize=1;
    drawingToolArea={
        offX:4, offY:25,
        bindBoxes:[null, null, null, null, null]
    }
    drawingToolArea.Imm0= new Image(14,62); drawingToolArea.Imm0.src="images/drawingTools.png";
    drawingToolArea.bindBoxes[1]=newBox(0,0,14,13);
    drawingToolArea.bindBoxes[2]=newBox(0,14,14,13);
    drawingToolArea.bindBoxes[3]=newBox(0,33,14,14);
    drawingToolArea.bindBoxes[4]=newBox(0,48,14,14);

    SCCArea = {
        offX:keyboardOffX+202, offY:keyboardOffY,
        bindBoxes:[null,
            newBox(2,2,29,28),
            newBox(2,33,29,21),
            newBox(2,57,29,22)],
        Imm0:null,
        herePress:0
    }
    SCCArea.Imm0= new Image(32,81); SCCArea.Imm0.src="images/SendCopyClear.png";

    PictoString.resetString();

    canvas.addEventListener("mousemove", function (e) {
        handleMouse(e, 'move')
    }, false);
    document.addEventListener("keydown", function (e) {
         handleKeyboardEvent(e, "down");
    }, false);
    document.addEventListener("keyup", function (e) {
         handleKeyboardEvent(e, "up");
    }, false);
    canvas.addEventListener("mousedown", function (e) {
        handleMouse(e, 'down')
    }, false);
    canvas.addEventListener("mouseup", function (e) {
        handleMouse(e, 'up')
    }, false);
    canvas.addEventListener("mouseout", function (e) {
        handleMouse(e, 'out')
    }, false);
    canvas.addEventListener("mousein", function (e) {
        handleMouse(e, 'in')
    }, false);
    dotDraw(ctx);
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
    if (keyboards[keyboard_selected].keylist.hasOwnProperty(keyCode)){
        var thisCode=keyboards[keyboard_selected].keylist[keyCode]
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
            default:

                if (keyboards[keyboard_selected].keyboardMode=="Code"){
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
            SHIFT=true;
        }
        if (keyEvent.code=="CapsLock"){
            CAPS= !CAPS;
        }
        else{
            if (keyboards[1].keylist.hasOwnProperty(keyEvent.code)){
                keyboards[1].keylist[keyEvent.code].pressed=true;
                keyOps(keyEvent.code, 'keyboard');
            }
            else if(keyboards[keyboard_selected].hasOwnProperty(keyEvent.key)){
                keyboards[keyboard_selected].keylist[keyEvent.key].pressed=true;
                keyOps(keyEvent.code, 'keyboard');
            }
        }
    }
    if (type == "up"){
        if (keyEvent.key=="Shift"){
            SHIFT=false;
        }

        if (keyboards[1].keylist.hasOwnProperty(keyEvent.code)){
            keyboards[1].keylist[keyEvent.code].pressed=false;
        }
        else if(keyboards[keyboard_selected].hasOwnProperty(keyEvent.key)){
            keyboards[keyboard_selected].keylist[keyEvent.key].pressed=false;
            keyOps(keyEvent.code, 'keyboard');
        }
    }
    dotDraw(ctx);
}

function drawScaledImage(cont, image, X, Y){
    cont.drawImage(image, X*dotsize, Y*dotsize, image.naturalWidth*dotsize, image.naturalHeight*dotsize)
}

function burnInPictoString(){
    renderPictoString(true);
}
function displayPictoString(){
    renderPictoString(false);
}
function renderPictoString(mode){
    //This function displays the pictostring;
    //Only run after update.

    //TO DO: ADD DEFAULT.
    var startX=PictoString.startX + drawOffX;
    var startY=PictoString.startY + drawOffY;
    var ims=0;
    var im=0;
    var imX=0;
    var imY=0;
    var burn=mode;

    for (index = 0; index < PictoString.currentString.length; index++) {
        var current=(PictoString.currentString[index]);
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
                console.log(k);
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
                            console.log("There's nothing to copy.")
                            getmessages();
                            SCCArea.herePress=0;
                            break;
                        case 3:
                            console.log("Clearing.");
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

function drawBox(cont, offX, offY, box){
    cont.fillRect((offX+box.xpos)*dotsize, (offY+box.ypos)*dotsize, (box.xsize)*dotsize, (box.ysize)*dotsize);

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
            drawBox(ctx, offX, offY, drawingToolArea.bindBoxes[1]);
            break;
        case 2:
            drawBox(ctx, offX, offY, drawingToolArea.bindBoxes[2]);
            break;
    }
    switch (toolSize){
        case 2:
            drawBox(ctx, offX, offY, drawingToolArea.bindBoxes[3]);
            break;
        case 1:
            drawBox(ctx, offX, offY, drawingToolArea.bindBoxes[4]);
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
            drawBox(ctx, offX, offY, SCCArea.bindBoxes[1]);
            break;
        case 2:
            drawBox(ctx, offX, offY, SCCArea.bindBoxes[2]);
            break;
        case 3:
            drawBox(ctx, offX, offY, SCCArea.bindBoxes[3]);
            break;
    }
}
function drawKeyboardSelect(){
    drawScaledImage(ctx, keyboardSelectArea.Imm0, keyboardSelectArea.offX, keyboardSelectArea.offY)
    //ctx.drawImage(keyboardSelectArea.Imm0,keyboardSelectArea.offX*dotsize,keyboardSelectArea.offY*dotsize);
    switch (keyboard_selected){
        case 1:
            drawScaledImage(ctx, keyboardSelectArea.Imm1, keyboardSelectArea.offX, keyboardSelectArea.offY)
            //ctx.drawImage(keyboardSelectArea.Imm1,keyboardSelectArea.offX,keyboardSelectArea.offY);
            break;
        case 2:
            drawScaledImage(ctx, keyboardSelectArea.Imm2, keyboardSelectArea.offX, keyboardSelectArea.offY)
            //ctx.drawImage(keyboardSelectArea.Imm2,keyboardSelectArea.offX,keyboardSelectArea.offY);
            break;
        case 3:
            drawScaledImage(ctx, keyboardSelectArea.Imm3, keyboardSelectArea.offX, keyboardSelectArea.offY)
            //ctx.drawImage(keyboardSelectArea.Imm3,keyboardSelectArea.offX,keyboardSelectArea.offY);
            break;
        case 4:
            drawScaledImage(ctx, keyboardSelectArea.Imm4, keyboardSelectArea.offX, keyboardSelectArea.offY)
            //ctx.drawImage(keyboardSelectArea.Imm4,keyboardSelectArea.offX,keyboardSelectArea.offY);
            break;
        case 5:
            drawScaledImage(ctx, keyboardSelectArea.Imm5, keyboardSelectArea.offX, keyboardSelectArea.offY)
            //ctx.drawImage(keyboardSelectArea.Imm5,keyboardSelectArea.offX,keyboardSelectArea.offY);
            break;
    }
    //drawBoxes(ctx);
}
function setDraggedGlyph(cX, cY){
    if (keyDown!=null){
        var current=getCharFromKey(keyDown);

        if (glyphs.glyphs.hasOwnProperty(current)){
            burnInPictoString();
            PictoString.resetString();
            PictoString.setStart(Math.floor(cX/dotsize)-drawOffX, Math.floor(cY/dotsize)-drawOffY);
            PictoString.addToString(current);
         }

    }
}
function drawDraggedGlyph(cont, cX, cY){
    if (keyDown!=null){
        var current=getCharFromKey(keyDown);
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
    if (keyboard_selected==1){
        if (SHIFT){
            drawScaledImage(cont,keyboard1s,offX,offY);
        }
        else if(CAPS){
            drawScaledImage(cont,keyboard1c,offX,offY);
        }else{
            drawScaledImage(cont,keyboard1, offX, offY);
        }
    }
    else if (keyboard_selected==2){
        drawScaledImage(cont,keyboard2, offX, offY);
    }
    else if (keyboard_selected==4){
        drawScaledImage(cont,keyboard4, offX, offY);
    }
    else if (keyboard_selected==5){
        drawScaledImage(cont,keyboard5, offX, offY);
    }
    var keys=Object.keys(keyboards[keyboard_selected].keylist);
    cont.fillStyle=overlayColor;
    for (var k=0;k<keys.length;k++){
        var thisEntry=keyboards[keyboard_selected].keylist[keys[k]];
        if (thisEntry.hasOwnProperty("pressed")){
            if (thisEntry.pressed==true){
                cont.fillRect((offX+thisEntry.xpos)*dotsize, (offY+thisEntry.ypos)*dotsize, (thisEntry.xsize)*dotsize, (thisEntry.ysize)*dotsize);
            }
        }
    }
}

function dotUpdate(cont){

    if (dotChange){
    //    dctx.clearRect(0, 0, 228, 80);
    //    dctx.drawImage(backgroundImg,0-3,0-2)
        dctx.fillStyle = "rgb(0, 0, 0)";
        for (let i=0;i<array2D.length;i++){
            let row =array2D[i];
            for (let j=0; j<row.length;j++){
                if ((row[j]!=null)){
                    if (arr2DChanges[i][j]){
                        if (array2D[i][j]==2){
                            dctx.fillRect((i), (j), 1, 1);
                        }else{
                            dctx.clearRect((i), (j), 1, 1);
                        }
                        arr2DChanges[i][j]=false;
                    }
                }
            }
        }
        dotChange=false;

    }
    drawingImage.src=matrixCanvas.toDataURL();
    //console.log(drawingImage.src);
    //return drawingImage;
    //cont.putImageData(dctx.getImageData(0,0,cols, rows),  drawOffX, drawOffY, 0,0,cols*dotsize, rows*dotsize)
}
function updateOutput(elements){
    outputimgs=[];
    document.getElementById('outputzone').innerHTML = "";

    for (var i=0;i<elements.length;i++){
        let img=new Image( 228,80 );
        img.src=elements[i];
        outputimgs.push(img);
        document.getElementById('outputzone').appendChild(img);
    }

}
function drawOutput(){
    octx.clearRect(0,0,w,h);
    for (var i=0;i<outputimgs.length;i++){

        octx.drawImage(outputimgs[i], i*228, 0, 228,80);
        //drawScaledImage(octx, img,i*228,4);
    }
}
function dotDraw(cont){
    //This draws the entire window.
    cont.clearRect(0, 0, w, h);
    //drawOutput();
    drawScaledImage(cont, backcomp1, drawOffX-6,drawOffY-6);
    drawScaledImage(cont,backgroundImg,drawOffX-3,drawOffY-3);
    // dotUpdate(cont);
    dotUpdate(cont);
    drawScaledImage(cont, drawingImage, drawOffX, drawOffY);
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
    drawKeyboardSelect();
    drawToolsArea();
    drawSCCArea();
    //Make Text.
    displayPictoString();
}

function dotAt(i,j,val){
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
        dotAt(i,j,2);

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
    console.log("Placeholder.");
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

function getmessages(){
    var xhr = new XMLHttpRequest();

    xhr.open("GET", '/getmatrix', true);

    //Send the proper header information along with the request
    xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
    xhr.overrideMimeType("text/plain");
    xhr.onreadystatechange = function() { // Call a function when the state changes.
        if (xhr.readyState == XMLHttpRequest.DONE) {
        //    alert(xhr.responseText);
            let elem=JSON.parse(xhr.responseText);
            updateOutput(elem);
            //outputimgs=elem;
            console.log(elem);
        }
    }

    content=JSON.stringify(array2D);
    xhr.send("?position=0");
// xhr.send(new Int8Array());
// xhr.send(document);
    console.log("Placeholder.");
}
function sendmatrix() {
    //post dot matrix to back end.
    var xhr = new XMLHttpRequest();
    burnInPictoString();
    xhr.open("POST", '/sendmatrix', true);

    //Send the proper header information along with the request
    xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
    xhr.overrideMimeType("text/plain");
    xhr.onreadystatechange = function() { // Call a function when the state changes.
        if (this.readyState === XMLHttpRequest.DONE && this.status === 200) {
            console.log("Finished.");
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
    console.log("Placeholder.");
}

function handleMouse(mouseEvent, type) {
    //TO DO: GET THE BUTTON PRESS.
    prevX = currX;
    prevY = currY;
    currX = mouseEvent.clientX - canvas.offsetLeft;
    currY = mouseEvent.clientY - canvas.offsetTop;
    if (type == 'down') {
        //Check if in drawing box.
        if (drawingBox.inBounds(currX, currY, 0, 0)){
            console.log(drawingBox.xpos, drawingBox.ypos, drawingBox.xsize, drawingBox.ysize)
            console.log(currX/dotsize, currY/dotsize)
            draw_flag = true;
            tap_flag = true;
            if (tap_flag) {
                dotPoint(currX, currY);
                tap_flag = false;
            }
        }

        //KeyboardCheck.
        var isIn=checkIfInKeyboardButtons(currX, currY);
        if (isIn!=null){
            keyDown=isIn;
            keyboards[keyboard_selected].keylist[keyDown].pressed=true;
        }
        //ToggleButtonChecks
        checkIfInKeyboardSelect(currX,currY);
        //CheckIfInTools
        checkIfInToolArea(currX, currY);
        //checkIfInSCCArea
        checkIfInSCCArea(currX, currY, 'down');
    }
    if (type== 'up'){
        var isIn=checkIfInKeyboardButtons(currX, currY);
        if (isIn!=null){
            if (keyDown==isIn)
            {
                keyOps(keyDown, 'mouse');
            }
        }
        if (keyDown!=null){
            if (drawingBox.inBounds(currX, currY, 0, 0)){
                setDraggedGlyph(currX, currY)
            }
            keyboards[keyboard_selected].keylist[keyDown].pressed=false;

            keyDown=null;
        }
        console.log(SCCArea.herePress)
        if (SCCArea.herePress>0){
            checkIfInSCCArea(currX, currY, 'up')
        }
        draw_flag = false;
    }

    if (type == 'move') {
        dotDraw(ctx);
        if (draw_flag) {
            dotLineFill(prevX, prevY, currX, currY)
        }
    }
    dotDraw(ctx);
    drawDraggedGlyph(ctx, currX, currY);
    ctx.beginPath();
    ctx.fillRect(currX, currY, 2*dotsize, 2*dotsize);
    ctx.closePath();
}
