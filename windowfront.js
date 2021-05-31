var canvas, preview, offscreen, ctx, pctx = null;
var draw_flag = false;
var prevX, currX, prevY, currY=0;
var tap_flag = false;
var offset=4;
var drawOffX=25;
var drawOffY=4;

//For modes.
//Forthe keyboard.
var CAPS=false;
var SHIFT=false;
var inKeybutton=false;
var drawing=false;
const dotsize=1;

var cols=228;
var rows=80;
let array2D= Array.from(Array(cols), () => new Array(rows));
let pictoStringArray= Array.from(Array(cols), () => new Array(rows));
var keyboard_selected=1;

var keyDown=null;

var keyboards={
    1:{
        keylist:{"Digit1":{xpos:4,ypos:2,xsize:15,ysize:14, char:"1",schar:"!", caps:false},"Digit2":{xpos:20,ypos:2,xsize:15,ysize:14, char:"2",schar:"@", caps:false},"Digit3":{xpos:36,ypos:2,xsize:15,ysize:14, char:"3",schar:"#", caps:false},"Digit4":{xpos:52,ypos:2,xsize:15,ysize:14, char:"4",schar:"$", caps:false},"Digit5":{xpos:68,ypos:2,xsize:15,ysize:14, char:"5",schar:"%", caps:false},"Digit6":{xpos:84,ypos:2,xsize:15,ysize:14, char:"6",schar:"^", caps:false},"Digit7":{xpos:100,ypos:2,xsize:15,ysize:14,char:"7",schar:"&", caps:false},"Digit8":{xpos:116,ypos:2,xsize:15,ysize:14,char:"8",schar:"*", caps:false},"Digit9":{xpos:132,ypos:2,xsize:15,ysize:14,char:"9",schar:"(", caps:false},"Digit0":{xpos:148,ypos:2,xsize:15,ysize:14,char:"0",schar:")", caps:false},"Minus": {xpos:164,ypos:2,xsize:15,ysize:14,char:"-",schar:"_", caps:false},"Equal": {xpos:180,ypos:2,xsize:15,ysize:14,char:"=",schar:"+", caps:false},"KeyW":{xpos:29,ypos:17,xsize:15,ysize:15, char:"w",schar:"W", caps:true},"KeyE":{xpos:45,ypos:17,xsize:15,ysize:15, char:"e",schar:"E", caps:true},"KeyQ":{xpos:13,ypos:17,xsize:15,ysize:15, char:"q",schar:"Q", caps:true},    "KeyR":{xpos:61,ypos:17,xsize:15,ysize:15, char:"r",schar:"R", caps:true},   "KeyT":{xpos:77,ypos:17,xsize:15,ysize:15, char:"t",schar:"T", caps:true},    "KeyY":{xpos:93,ypos:17,xsize:15,ysize:15, char:"y",schar:"Y", caps:true},   "KeyU":{xpos:109,ypos:17,xsize:15,ysize:15,char:"u",schar:"U", caps:true},    "KeyI":{xpos:125,ypos:17,xsize:15,ysize:15,char:"i",schar:"I", caps:true},   "KeyO":{xpos:141,ypos:17,xsize:15,ysize:15,char:"o",schar:"O", caps:true},    "KeyP":{xpos:157,ypos:17,xsize:15,ysize:15,char:"p",schar:"P", caps:true},   "KeyA":{xpos:20,ypos:33,xsize:15,ysize:15,char:"a",schar:"A", caps:true},    "KeyS":{xpos:36,ypos:33,xsize:15,ysize:15,char:"s",schar:"S", caps:true},   "KeyD":{xpos:52,ypos:33,xsize:15,ysize:15,char:"d",schar:"D", caps:true},    "KeyF":{xpos:68,ypos:33,xsize:15,ysize:15,char:"f",schar:"F", caps:true},   "KeyG":{xpos:84,ypos:33,xsize:15,ysize:15,char:"g",schar:"G", caps:true},    "KeyH":{xpos:100,ypos:33,xsize:15,ysize:15,char:"h",schar:"H", caps:true},   "KeyJ":{xpos:116,ypos:33,xsize:15,ysize:15,char:"j",schar:"J", caps:true},    "KeyK":{xpos:132,ypos:33,xsize:15,ysize:15,char:"k",schar:"K", caps:true},   "KeyL":{xpos:148,ypos:33,xsize:15,ysize:15,char:"l",schar:"L", caps:true},    "KeyZ":  {xpos:28,ypos:49,xsize:15,ysize:15,char:"z",schar:"Z", caps:true},   "KeyX":  {xpos:44,ypos:49,xsize:15,ysize:15,char:"x",schar:"X", caps:true},    "KeyC":  {xpos:60,ypos:49,xsize:15,ysize:15,char:"c",schar:"C", caps:true},   "KeyV":  {xpos:76,ypos:49,xsize:15,ysize:15,char:"v",schar:"V", caps:true},    "KeyB":  {xpos:92,ypos:49,xsize:15,ysize:15,char:"b",schar:"B", caps:true},    "KeyN":  {xpos:108,ypos:49,xsize:15,ysize:15,char:"n",schar:"N", caps:true},    "KeyM":  {xpos:124,ypos:49,xsize:15,ysize:15,char:"m",schar:"M", caps:true},    "Comma": {xpos:140,ypos:49,xsize:15,ysize:15,char:",",schar:"<", caps:false},    "Period":{xpos:156,ypos:49,xsize:15,ysize:15,char:".",schar:">", caps:false},    "Slash": {xpos:172,ypos:49,xsize:15,ysize:15,char:"/",schar:"?", caps:false},        "ShiftLeft":{xpos:2,ypos:49,xsize:25,ysize:15,char:null,schar:null, caps:false},    "CapsLock":{xpos:2,ypos:33,xsize:17,ysize:15,char:null,schar:null, caps:false},    "ShiftRight":{xpos:2,ypos:49,xsize:25,ysize:15,char:null,schar:null, caps:false},    "Semicolon":{xpos:36,ypos:65,xsize:15,ysize:14,char:";",schar:":", caps:false},    "BracketLeft":{xpos:148,ypos:65,xsize:15,ysize:14,char:"[",schar:"{", caps:false},    "BracketRight":{xpos:164,ypos:65,xsize:15,ysize:14,char:"{",schar:"}", caps:false},    "Backquote":{xpos:52,ypos:65,xsize:15,ysize:14,char:"`",schar:"~", caps:false},    "Backspace":{xpos:173,ypos:17,xsize:25,ysize:15,char:null,schar:null, caps:false},    "Space":{xpos:68,ypos:65,xsize:79,ysize:14,char:" ",schar:" ", caps:false},    "Enter":{xpos:164,ypos:33,xsize:34,ysize:15,char:null,schar:null, caps:false}}
    }
}

var PictoString = {
    currentString:[],
    addToString:function(char){ this.currentString.push(char);},
    removeFromString:function(){ this.currentString.pop();}
}
let glyphs={}

//var glyphs={
//    "A":{px:1,py:1, width=5}, "a":{px:1, py:2}
//}
//Resources:
var drawingBox=null;
const backgroundImg=new Image (234, 85); backgroundImg.src = 'PictochatWindow.png';
const keyboard1=new Image (200, 81); keyboard1.src = 'Keyboard1Normal.png';
const keyboard1s=new Image (200, 81); keyboard1s.src = 'Keyboard1Shift.png';
const keyboard1c=new Image (200, 81); keyboard1c.src = 'Keyboard1Caps.png';

const glyph=new Image (320, 377); glyph.src = 'Glyphs.png';


//backgroundImg.onload = drawImageActualSize; // Draw when image has loaded
function newBox(posX, posY, sizeX, sizeY){
    var box={
        xpos: posX, ypos:posY,
        xsize:sizeX, ysize:sizeY,
        inBounds:function(cx, cy, offX, offY){
            //console.log("Checking.")
            //console.log(cx, cy);
            //console.log((offX+this.xpos), (offX+this.xpos+this.xsize))
        //    console.log((offY+this.ypos), (offY+this.ypos+this.ysize))
            var xCond=((cx>=(offX+this.xpos)) &&(cx<=(offX+this.xpos+this.xsize)));
            var yCond=((cy>=(offY+this.ypos)) &&(cy<=(offY+this.ypos+this.ysize)));
            if (xCond && yCond){
                return true;
            }
            return false;
        }
    }
    return box;
}
var keyboardSelectArea=null;
function init() {
    fetch('./glyphs.json')
      .then(response => response.json())
      .then(glyp => glyphs=glyp);



    canvas = document.getElementById('drawing');
    preview =  document.getElementById('animating');
    offscreen = new OffscreenCanvas(320, 377);


    drawingBox=newBox(drawOffX,drawOffY,cols*dotsize,rows*dotsize);

    ctx = canvas.getContext("2d");
    pctx = offscreen.getContext("2d");
    pctx.drawImage(glyph, 0,0);
    w = canvas.width;
    h = canvas.height;
    for (var i=0;i<array2D.length;i++){
        var row =array2D[i];
        for (var j=0; j<row.length;j++){
            if (row[j]!=null){
                ctx.beginPath();
                ctx.fillRect(offset+i*dotsize, offset+j*dotsize, dotsize, dotsize);
                ctx.stroke();
                ctx.closePath();
            }
        }
    }
    keyboardSelectArea={
        offX:5, offY:100,
        bindBoxes:[null, null, null, null, null, null]
    };
    keyboardSelectArea.Imm0=new Image(14,82); keyboardSelectArea.Imm0.src="KeyboardSelectOFF.png";
    keyboardSelectArea.Imm1=new Image(14,82); keyboardSelectArea.Imm1.src="KeyboardSelectON1.png";
    keyboardSelectArea.Imm2=new Image(14,82); keyboardSelectArea.Imm2.src="KeyboardSelectON2.png";
    keyboardSelectArea.Imm3=new Image(14,82); keyboardSelectArea.Imm3.src="KeyboardSelectON3.png";
    keyboardSelectArea.Imm4=new Image(14,82); keyboardSelectArea.Imm4.src="KeyboardSelectON4.png";
    keyboardSelectArea.Imm5=new Image(14,82); keyboardSelectArea.Imm5.src="KeyboardSelectON5.png";
    keyboardSelectArea.bindBoxes[1]=newBox(0,0,14,14);
    keyboardSelectArea.bindBoxes[2]=newBox(0,17,14,14);
    keyboardSelectArea.bindBoxes[3]=newBox(0,34,14,14);
    keyboardSelectArea.bindBoxes[4]=newBox(0,51,14,14);
    keyboardSelectArea.bindBoxes[5]=newBox(0,68,14,14);



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

function keyOps(keyCode){
    if (keyboards[1].keylist.hasOwnProperty(keyCode)){
        var thisCode=keyboards[1].keylist[keyCode]
        switch (keyCode){
            case "Enter":
                PictoString.addToString("\n");
                break;
            case "Space":
                PictoString.addToString(" ");
                break
            case "Backspace":
                PictoString.removeFromString();
                break;
            default:
                if (SHIFT) { PictoString.addToString(thisCode.schar);}
                else if (CAPS && thisCode.caps){PictoString.addToString(thisCode.schar);}
                else{PictoString.addToString(thisCode.char);}
        }
    }
}
function  handleKeyboardEvent(keyEvent, type){
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
                keyOps(keyEvent.code);
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
    }
    dotDraw(ctx);
}
function renderPictoString(){
    //This function displays the pictostring;
    //Only run after update.
    var startX=63 + offset;
    var startY=4 + offset;
    var imX=0;
    var imY=0;
    var burn=false;
    for (index = 0; index < PictoString.currentString.length; index++) {
        var current=(PictoString.currentString[index]);
        if (glyphs.glyphs.hasOwnProperty(current)){
            var glyphX=glyphs.glyphs[current].px;
            var glyphY=glyphs.glyphs[current].py;
            var charwidth=glyphs.glyphs[current].width;
        if(burn){
             for (imX=0;imX<9; imX++){
                 for (imY=0;imY<12; imY++){
                     var data=(pctx.getImageData(imX+glyphX*10, imY+glyphY*13, 1, 1).data);
                     if ((data[3])>200){
                        pictoStringArray[startX+imX][startY+imY]=2;
                    }
                     else{
                         pictoStringArray[startX+imX][startY+imY]=null;
                     }
                }
             }
         }
         else{
             ctx.drawImage(glyph, glyphX*10, glyphY*13, charwidth, 12, startX, startY, charwidth, 12);
         }

            startX=startX+charwidth+1;
        }
    }
}
function checkIfInKeyboardButtons(cx, cy){

    //Check if mouse cursor is in a keyboard button.
    var offX=offset+25;
    var offY=offset+100;


    var keys=Object.keys(keyboards[1].keylist);
    for (var k=0;k<keys.length;k++){
        var thisEntry=keyboards[1].keylist[keys[k]];

                xCond=((cx>=(offX+thisEntry.xpos)) &&(cx<=(offX+thisEntry.xpos+thisEntry.xsize)));
                yCond=((cy>=(offY+thisEntry.ypos)) &&(cy<=(offY+thisEntry.ypos+thisEntry.ysize)));

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

function drawBoxes(cont){
    //For debugging.
    var offX=keyboardSelectArea.offX;
    var offY=keyboardSelectArea.offY;

    for (var k=1;k<keyboardSelectArea.bindBoxes.length;k++){
        var thisEntry=keyboardSelectArea.bindBoxes[k];

        cont.beginPath();
        cont.rect(offX+thisEntry.xpos, offY+thisEntry.ypos, thisEntry.xsize, thisEntry.ysize);
        cont.stroke();
        cont.closePath();

}
}

function drawKeyboardSelect(){
    ctx.drawImage(keyboardSelectArea.Imm0,keyboardSelectArea.offX,keyboardSelectArea.offY);
    switch (keyboard_selected){
        case 1:
            ctx.drawImage(keyboardSelectArea.Imm1,keyboardSelectArea.offX,keyboardSelectArea.offY);
            break;
        case 2:
            ctx.drawImage(keyboardSelectArea.Imm2,keyboardSelectArea.offX,keyboardSelectArea.offY);
            break;
        case 3:
            ctx.drawImage(keyboardSelectArea.Imm3,keyboardSelectArea.offX,keyboardSelectArea.offY);
            break;
        case 4:
            ctx.drawImage(keyboardSelectArea.Imm4,keyboardSelectArea.offX,keyboardSelectArea.offY);
            break;
        case 5:
            ctx.drawImage(keyboardSelectArea.Imm5,keyboardSelectArea.offX,keyboardSelectArea.offY);
            break;
    }
    //drawBoxes(ctx);
}

function dotDraw(cont){
    //This draws the entire window.
    cont.clearRect(0, 0, w, h);
    cont.drawImage(backgroundImg,drawOffX,drawOffY);
    for (var i=0;i<array2D.length;i++){
        var row =array2D[i];
        for (var j=0; j<row.length;j++){
            if ((row[j]!=null) || (pictoStringArray[i][j]!=null)){
                if (array2D[i][j]==2){
                cont.fillRect(drawOffX+i*dotsize, drawOffY+j*dotsize, dotsize, dotsize);
                }
            }
        }
    }
    //Keyboard Drawing.
    var offX=offset+25;
    var offY=offset+100;
    if (SHIFT){
        cont.drawImage(keyboard1s,offX,100+offset);
    }
    else if(CAPS){
        cont.drawImage(keyboard1c,offX,100+offset);
    }else{
        cont.drawImage(keyboard1, offX, 100+offset);
    }
    var keys=Object.keys(keyboards[1].keylist);
    for (var k=0;k<keys.length;k++){
        var thisEntry=keyboards[1].keylist[keys[k]];
        if (thisEntry.hasOwnProperty("pressed")){
            if (thisEntry.pressed==true){
                cont.fillRect(offX+thisEntry.xpos, offY+thisEntry.ypos, thisEntry.xsize, thisEntry.ysize);
            }
        }
    }
    drawKeyboardSelect();

    //Make Text.
    renderPictoString();
}

function dotAt(i, j){
    if (i <array2D.length && i>=0){
        if (j<array2D[i].length && j>=0){
            array2D[i][j]=2;
        }
    }
}
function dotFill(x,y){
    //Convert to Dot.
    var i= Math.floor((x-drawOffX)/dotsize);
    var j = Math.floor((y-drawOffY)/dotsize);
    dotAt(i,j)
}

function dotlinedraw(lx,ly,x,y){
    //need to impliment line algoritm.

    dotAt(x,y)
}
function dotLineFill(lx, ly, x, y){
    //Convert two sets of coordinates to the type used by the dot matrix.
    var i1=Math.floor((lx-drawOffX)/dotsize);
    var j1=Math.floor((ly-drawOffY)/dotsize);
    var i2= Math.floor((x-drawOffX)/dotsize);
    var j2 = Math.floor((y-drawOffY)/dotsize);
    dotlinedraw(i1,j1,i2,j2);
}

function clearmatrix() {
    console.log("Placeholder.");
}

function sendmatrix() {
    //post dot matrix to back end.
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
        if (drawingBox.inBounds(currX, currY, drawOffX, drawOffY)){
            draw_flag = true;
            tap_flag = true;
            if (tap_flag) {
                dotFill(currX, currY);
                tap_flag = false;
            }
        }

        //KeyboardCheck.
        var isIn=checkIfInKeyboardButtons(currX, currY);
        if (isIn!=null){
            keyDown=isIn;
            keyboards[1].keylist[keyDown].pressed=true;
        }
        //ToggleButtonChecks
        checkIfInKeyboardSelect(currX,currY);
    }
    if (type== 'up'){
        var isIn=checkIfInKeyboardButtons(currX, currY);
        if (isIn!=null){
            if (keyDown==isIn)
            {
                keyOps(keyDown);
            }
        }
        if (keyDown!=null){
            keyboards[1].keylist[keyDown].pressed=false;

            keyDown=null;
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
    ctx.beginPath();
    ctx.rect(currX-2, currY-2, 4, 4);
    ctx.stroke();
    ctx.closePath();
}
