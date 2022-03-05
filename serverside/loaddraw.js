//index.js
//including the imported packages
const express = require('express');
const session = require('express-session');
const {check} = require('express-validator');
const bodyParser = require('body-parser');
const fetch = require('node-fetch');
const fs = require('fs');

const FormData = require('form-data');
const util = require('util');

//The html for the web app is here.
const filetosend=`
<html>
<head>
 <meta name="viewport" charset="UTF-8" content="width=device-width" />
</head>
    <script type="text/javascript" src="/data/windowfront.js">

    </script>
    <div id="name"><span style="display:none">%s</span></div>
    <div id="color"><span style="display:none">%s</span></div>
    <header>

    </header>
 <style>
 canvas {

   image-rendering: -moz-crisp-edges;
   image-rendering: -webkit-crisp-edges;
   image-rendering: pixelated;
   image-rendering: crisp-edges;
   user-select: none;
   touch-action: none;
   -webkit-user-select: none;
   -moz-user-select: none;
   -ms-user-select: none;
   -khtml-user-select: none;
 }
 html {
     display: table;
     margin: auto;
     color: #ffffff;
 }

body{
    max-width: 300px;
    vertical-align: middle;
    display: table;
    
    font: 1rem 'Fira Sans', sans-serif;
    background-color: #000000;
}
.buttonzone{
    display: grid;
    grid-template-columns: 25% 25% 25% 25%;
    grid-auto-rows: 52px;
    gap:0px;
    padding: 0px;

}
button{
    width: 100%;
    min-height:100%;
    
    font: 0.6rem 'Fira Sans', sans-serif;
    display: inline-block;
}
table, td, tr{
    border: 1px solid;
    border-color: #ffffff;
    
    font: 0.8rem 'Fira Sans', sans-serif;
}
.subtable{
    width:100%; border:1px solid; border-color:white; border-block-color:aliceblue;

}
.help{
    width:500px;
    column-width: 500px;
    
}

label{
    
  font: 1rem 'Fira Sans', sans-serif;
  color:white;
}
 .scrollinit{
     overflow:scroll;
     height:192px;
     width:256px;
     background-image: url(data/images/ScrollBack.png);
 }
 img{
     image-rendering: -moz-crisp-edges;
     image-rendering: -webkit-crisp-edges;
     image-rendering: pixelated;
     image-rendering: crisp-edges;
     float:right;
     margin:1px;
 }
 .helpimg{
    display: block;
  margin-left: auto;
  margin-right: auto;
  float:none;
 }
 input{
     width:100%;
 }

 /* Hide scrollbar for Chrome, Safari and Opera */
 .scrollinit::-webkit-scrollbar {
     display: none;
 }

 /* Hide scrollbar for IE, Edge and Firefox */
 .scrollinit {
   -ms-overflow-style: none;  /* IE and Edge */
   scrollbar-width: none;  /* Firefox */
 }


 </style>
    <body onload="init()" id="MainArea">
        <div id="everything" style="display:table-cell; max-width: 300px">
        <div id="topScreen" style="width:256;height:192px">
            <canvas id="output" style="position:absolute; pointer-events:none;" width="256" height="192px">
                Sorry, your browser doesn't support canvas technology.
            </canvas>
            <div id="outputzone" class="scrollinit" >

            </div>
        </div>
        <div style="width:300px;height:220px;">
        <canvas id="drawing" width="258px", height="192px" style="background-color: #ffffff;">
                Sorry, your browser doesn't support canvas technology.
            </canvas>


        <canvas id="animating" width="300px" height="300px" span hidden style="position:absolute;z-index:0;" >
        </canvas>


        <canvas id="dotDraw" width="300px" height="300px" span hidden style="position:absolute;z-index:0;" >
        </canvas>
        <canvas id="copy" width="300px" height="300px" span hidden  style="position:absolute;z-index:0;" >
        </canvas>
        </div>
        <div  id="HelpButtons" class="buttonzone" style="width:256px;height:52; ">
            <button 
            type="button" id='openhelp' >
        Help.
    </button>
    <button  type="button" id='mobilebar'>
        Open Mobile Bar.
    </button>
    <button type="button">
        Option TBD
    </button>
    <button     type="button">
    Option TBD
    </button>
</div>
<div id="manentry" hidden>    
                <label for="mantext" style="color:'#ffffff';">If you want to use a mobile keyboard instead, tap the bar below.</label>
                <input type="text" id="mantext" name="manualtextentry"><br><br>
        
    
            </div>
    </div>


        <div id="helpcont" class="help" style="display: table-cell;vertical-align: top; " >
            <div id="helpsection" style="min-width: 500px;" span hidden>
            <table style="width:100%; border:1px solid; border-color:white; border-block-color:aliceblue;">
                <tr>
                    This is a nearly 1:1 recreation of PictoChat!  You can click or tap on each of the 
                    buttons to make them work!  You can also use your own keyboard to type messages!

                    Send your message by hitting the "Send" button!
                </tr>
                <tr>
                  <td> 
                      <img src="data/images/scrollButtons.png" class="helpimg">
                  </td>
                  <td>
                  <table class="subtable">
                    <tr>
                  <td>Scroll Buttons</td>
                  <td>Scroll through messages in the output.</td>
                  </tr></table>
                </td>
                </tr>
            
                <tr>
                  <td><img src="data/images/drawingTools.png" class="helpimg"></td>
                  <td>
                  <table class="subtable">
                    <tr> <td>Pen</td> <td>Select the Pen tool.  Tap it multiple times to switch between different colors.</td></tr>
                    <tr>   <td>Eraser</td>  <td>Select the Eraser Tool.  The Eraser Tool Erases Drawings.</td> </tr>
                        <tr> <td>Pen/Eraser Thickness.</td>   <td>Select the desired thickness for the pen or eraser.</td></td> </tr>
                  
                </table>
                </td>
                </tr>
                <tr>
                    
                    <td><img src="data/images/PictochatWindow.png" class="helpimg", style="background-color: #ffffff; width: 50%; height:50%;"></td>
                    <td>
                  <table class="subtable">
                      <tr>
                    <td> Drawing  Area </td>
                    <td> 
                        Click/Tap in this Area to write your message.
                    </td>
                </tr>
                <tr>
                    
                    <td><img src="data/images/Keyboard1Normal.png" class="helpimg", style="background-color: #ffffff; width: 50%; height:50%;"></td>
                    <td>
                  <table class="subtable">
                      <tr>
                    <td> Keyboard </td>
                    <td> 
                        Click or Tap the Keys to type a text message!  You can even switch between 4 different keyboards with the panel on the side! (Kanji Keyboard not implimented due to unfamiliarity.) 
                    </td>
                </tr>
                </table>
                </td>
                  </tr>
              </table>
            </div>
                    </div>



    </body>
    </html>
`
function sendDraw(name, color){
    let toreturn=util.format(filetosend, name, color);
    return toreturn;
}



module.exports= sendDraw;
