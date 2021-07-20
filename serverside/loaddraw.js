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
 <meta name="viewport" content="width=device-width, initial-scale=1.0" />
</head>
    <script type="text/javascript" src="windowfront.js">

    </script>
    <div id="name"><span style="display:none">%s</span></div>
    <div id="color"><span style="display:none">%s</span></div>
    <header>
          <h1>Main App.<h1>

    </header>
 <style>
 canvas {

   image-rendering: -moz-crisp-edges;
   image-rendering: -webkit-crisp-edges;
   image-rendering: pixelated;
   image-rendering: crisp-edges;
   touch-action: manipulation;
 }
 html, body {
     overflow-x: hidden;
 }
body{
    max-width: 300px;

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
    <canvas id="output" style="position:absolute; pointer-events:none;" width="256" height="192px">
            Sorry, your browser doesn't support canvas technology.
  </canvas>
        <div id="outputzone" class="scrollinit" >

        </div>

        <div style="width:300px;height:220px">
        <canvas id="drawing" width="270px", height="220px">
                Sorry, your browser doesn't support canvas technology.
            </canvas>


        <canvas id="animating" width="300px" height="300px" span hidden style="position:absolute;z-index:0;" >
        </canvas>


        <canvas id="dotDraw" width="300px" height="300px" span hidden style="position:absolute;z-index:0;" >
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
