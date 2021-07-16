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

const filetosend=`
<html>
<head>
 <meta charset="UTF-8">
</head>
    <script type="text/javascript" src="windowfront.js">

    </script>
    <div id="name"><span style="display:none">%s</span></div>
    <div id="color"><span style="display:none">%s</span></div>
    <header>
          <h1>Frontend WIP</h1>

    </header>
 <style>
 canvas {

   image-rendering: -moz-crisp-edges;
   image-rendering: -webkit-crisp-edges;
   image-rendering: pixelated;
   image-rendering: crisp-edges;

 }



 .scrollinit{
     overflow:scroll;
     height:192px;
     width:256px;
 }
 img{
     float:right;
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
    <body onload="init()">
        <div id="outputzone" class="scrollinit" >

        </div>
        <canvas id="output" width="500px", height="10px">
                Sorry, your browser doesn't support canvas technology.
      </canvas>
        <div>
        <canvas id="drawing" width="500px", height="500px">
                Sorry, your browser doesn't support canvas technology.
            </canvas>


        <canvas id="animating" width="500px" height="500px" span hidden style="position:absolute;z-index:0;" >
        </canvas>


        <canvas id="dotDraw" width="500px" height="500px" span hidden style="position:absolute;z-index:0;" >
        </canvas>

        </div>


    </body>
    </html>
`
function sendDraw(name, color){
    let toreturn=util.format(filetosend, name, color);
    return toreturn;
}

function sendForm(){

}

module.exports= sendDraw;
