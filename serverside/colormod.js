const express = require('express');
const session = require('express-session');
const {check} = require('express-validator');
var MemoryStore = require('memorystore')(session)
const bodyParser = require('body-parser');
const fetch = require('node-fetch');
const fs = require('fs');
const FormData = require('form-data');
const cors = require("cors");
var path = require("path");

const { createCanvas, loadImage } = require('canvas');


let imgpath="data/images/PictochatWindowOverlay.png"
colormod = express.Router();

let rawdata = fs.readFileSync('data/json/pallates.json');
let image=null;
loadImage(imgpath).then((imag) => image=imag);
var colors = JSON.parse(rawdata);

var ColoredImg={};

function createColoredImageUri(imagePath, colorMode){
        let colorset=colors[colorMode];
    return loadImage("data/images/"+imagePath).then((image) =>{
            let width=image.naturalWidth;
            let height=image.naturalHeight;
            let thiscanvas=createCanvas(width, height);
            var context = thiscanvas.getContext('2d');
            context.drawImage(image,0,0);
            let imagedata=context.getImageData(0,0,width,height);
            let data=imagedata.data;
            let imX, imY, imp=0;
            let r, g, b, a=0;
            for (let im=0;im<width*height;im++){
                imX=im%width;
                imY=Math.floor(im/width);
                imp=im*4;
                r=data[imp]; g=data[imp+1]; b=data[imp+2]; a=data[imp+3];
                //console.log(r,g,b,a);
                if (r==g && g==b){
                    let col=r;
                //    console.log(col);
                    let thisColor="none";
                    switch(col){
                        case 97:
                            thisColor="color1";
                            break;
                        case 219:
                            thisColor="color2";
                            break;
                        case 162:
                            thisColor="color3"
                            break;
                        case 73:
                            thisColor="color4"
                            break;
                    }
                    if (thisColor!="none"){
                        r=colorset[thisColor].r;
                        g=colorset[thisColor].g;
                        b=colorset[thisColor].b;
                    }
                }
                data[imp]=r; data[imp+1]=g; data[imp+2]=b; a=data[imp+3];
            }
            //let newdata=new ImageData(data, width, height);
            context.putImageData(imagedata,0,0);
            let uri=thiscanvas.toDataURL('image/png');
            if (ColoredImg[imagePath]==null){
                ColoredImg[imagePath]={};

            }
            ColoredImg[imagePath][colorMode]=uri;
    });
}
function doesColorModeExist(colorMode){
    if (colorMode in colors){
        return true;
    }
    return false;
}
function getUriFromDictionary(hostpath, pallate){
    let thisimagepath=path.basename(hostpath);
    return ColoredImg[thisimagepath][pallate];
}
function setup(directoryPath){
fs.readdir("data/images", function (err, files) {
    //handling error
    if (err) {
        return console.log('Unable to scan directory: ' + err);
    }
    //listing all files using forEach
    files.forEach(function (file) {
        // Do whatever you want to do with the file
        console.log(file);
        let imagePath=file;
        if (ColoredImg[imagePath]==null){
            ColoredImg[imagePath]={};

        }
        Object.keys(colors).forEach(function(key) {
            console.log(key);
          createColoredImageUri(imagePath, key);
        })

    //    console.log(ColoredImg);
    });
    console.log("ColoredImages Created And Ready.");
});
}

setup(__dirname);
colormod
  // Add a binding to handle '/tests'
  .get('/',  (req, res) => {

    let thisimagepath= req.query.image;  // true
    let pallate=req.query.pallate;// === 'blue' // true

    res.writeHead(200, {'Content-Type':'application/json'})


        res.write(JSON.stringify({'resp':getUriFromDictionary(thisimagepath, pallate)}));
        res.end()
    })

  // Import my automated routes into the path '/tests/automated'
  // This works because we're already within the '/tests' route
  // so we're simply appending more routes to the '/tests' endpoint


  module.exports= {colormod, getUriFromDictionary, doesColorModeExist};
