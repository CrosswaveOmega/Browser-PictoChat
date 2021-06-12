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
 div.scrollinit{
     overflow:scroll;
     height:300px;
     width:300px;
 }

 </style>
    <body onload="init()">
        <div id="outputzone" class="scrollinit" >

        </div>
        <canvas id="output" width="720px", height="10px">
                Sorry, your browser doesn't support canvas technology.
      </canvas>
        <div>
        <canvas id="drawing" width="720px", height="500px">
                Sorry, your browser doesn't support canvas technology.
            </canvas>


        <canvas id="animating" width="720px" height="500px" span hidden style="position:absolute;z-index:0;" >
        </canvas>


        <canvas id="dotDraw" width="228px" height="80px" span hidden style="position:absolute;z-index:0;" >
        </canvas>

        </div>


    </body>
    </html>
`
function sendDraw(name, color){
    let toreturn=util.format(filetosend, name, color);
    return toreturn;
}

module.exports= sendDraw;
