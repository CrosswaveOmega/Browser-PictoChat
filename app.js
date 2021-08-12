//index.js
//including the imported packages
const express = require('express');
const session = require('express-session');
const {check} = require('express-validator');
var MemoryStore = require('memorystore')(session)
const bodyParser = require('body-parser');
const fetch = require('node-fetch');
const fs = require('fs');

const FormData = require('form-data');
const cors = require("cors");
const { createCanvas, loadImage } = require('canvas');
const width = 228*2;
const height = 80*2;
const util = require('util');
const sendDraw=require('./serverside/loaddraw.js')
const sendForm=require('./serverside/entryform.js')
const {colormod, getUriFromDictionary, doesColorModeExist} = require("./serverside/colormod.js")
const {addRoom, addMessageToLog, getMessagesFromLog, getRoomWebhook, addPrivateRoom, getPrivateRoomByCipher, postStatusMessageToDiscord} = require("./serverside/rooms.js")

const path = require('path')


//initialize the app as an express app
const app = express();
const router = express.Router();

//middleware

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true})
);
//app.use(express.static(__dirname+ '/data'));
//app.use(express.static(__dirname));
app.use('/data', express.static(path.join(__dirname, 'data')))
app.use(cors());
app.use(session({
    secret: "qWpjpuv9sw48aVP3iPP7",
    resave:false,
    store: new MemoryStore({
      checkPeriod: 3600000 // prune expired entries every 24h
    }),
    maxAge: Date.now() + (40000000) ,
    secure: true,
    saveUninitialized:true
}));
//app.use('/images');


//ROUTERS
var messageLog={};
var glyphs= {};
var glyph= null;
var glyphy= null;
var glyphw=null;
var glyphb=null;
//default
router.get('/',(req, res) => {
    res.writeHead(200, {'Content-Type':'text/html'})
    let response=[];
    res.write(sendForm("Enter Name and select Color."))
    res.end();
});


router.get('/privjoin',(req, res) => {
    res.writeHead(200, {'Content-Type':'text/html'})
    let cipher=req.query.join;
    req.session.preroom=getPrivateRoomByCipher(cipher);
    let response=[];
    if (req.session.preroom==null){
    res.write(sendForm("Invalid Cipher."))
    }
    else{

        res.write(sendForm("Private Room accepted"))
    }
    res.end();
});


//Where you login
router.post('/theapp', [
   check('displayname').isLength({min:1, max: 10 }).trim().escape(),
   check('colormode').isLength({min:5,max:5}).trim().escape()//,
 //  check('email').isEmail().normalizeEmail(),
  // check('age').isNumeric().trim().escape()
], (req, res) => {
    try{
        let displayname=req.body.displayname; //(req.body.position);
        if (displayname == undefined ){throw new Error("You didn't enter anything!");}
        //displayname= new Sanitizer().sanatize(displayname);
        if (displayname.length>10){throw new Error("Your name is too big!");}
        if (!displayname.trim()){throw new Error("You didn't enter anything!");}
        if (doesColorModeExist(req.body.colormode)!=true){throw new Error("Invalid color.")};
        req.session.dispname=displayname;
        req.session.pallate=req.body.colormode;
        req.session.roomID="A";
        if (req.session.preroom != null){
            req.session.roomID=req.session.preroom;
        }
        let date=new Date()
        date.setMinutes(date.getMinutes()-3)
        req.session.lastTimeSet=(date).getTime();
        postMessage("Now entering %s", req.session.dispname, req.session.roomID, "yellow");

        res.writeHead(200, {'Content-Type':'text/html'})
        res.write(sendDraw(req.session.dispname, req.session.pallate));
        res.end();
        //res.sendFile(__dirname + '/draw.html');
    }
    catch(err){
        //console.log(err)
        //res.write(startupHead);
        res.write(sendForm(err.message))
        //res.write(util.format(startupBody, err));
        res.end();
    }
})

router.post('/whoami', (req, res) => {
    //return the username of the session.
    //console.log(req.session)
    let displayname=req.session.dispname; //(req.body.position);
    let pallate=req.session.pallate;
    res.write(JSON.stringify({displayname:displayname, pallate: req.session.pallate}));
    res.end();
})

router.post('/leave', (req, res) => {
    //return the username of the session.
    //console.log(req.session)
    let displayname=req.session.dispname; //(req.body.position);
    let roomid=req.session.roomID;
    postMessage("Now leaving %s",req.session.dispname, req.session.roomID, "blue");

    //res.write(JSON.stringify({displayname:displayname, pallate: req.session.pallate}));
    res.end();
})

const discordUrlMain='https://discord.com/api/webhooks/851232711075168266/RgkH5r8_dKtTbv68zEEf444Amkq02mwPXAnDNKfLd3b1ZC6DgzMw3AjyqJHZWD0M4CO6'
function postMessageToDiscord(message, buffer, webhook="None") {
    //console.log("GO.")
    var discordUrl=webhook;
    if (webhook=="None"){ discordUrl=discordUrlMain;}
    const form = new FormData();
    form.append('file', buffer, "tes3.png")
    form.append('payload_json', JSON.stringify({"username":"PictoChat","avatar_url":process.env.ProfileImage}))
    const options = {
    method: 'POST',
    body: form,
    headers: form.getHeaders()
    }

    fetch(discordUrl, options)
        .then(res => res.json())
        .then(json => console.log(json));
    }

function makeName(context, name, color="Norm", startXmain=5, startYmain=3){
    var startX=startXmain;
    var startY=startYmain;
    var glyphX=0;
    var glyphY=0;
    var dotsize=1;
    var charwidth=0;
    //console.log(name);

    //const glyphX1=new Image (320, 377); glyphX1.src = ;
        for (let index = 0; index < name.length; index++) {
            let current=(name[index]);
            if (glyphs.glyphs.hasOwnProperty(current)){
                glyphX=glyphs.glyphs[current].px;
                glyphY=glyphs.glyphs[current].py;
                charwidth=glyphs.glyphs[current].width;
                //console.log(glyphX, glyphY, charwidth);
            if (color=="Norm"){
                context.drawImage(glyph, glyphX*10, glyphY*13, charwidth, 12, startX*dotsize, startY*dotsize, charwidth*dotsize, 12*dotsize);
            }
            else if (color=="yellow"){
                context.drawImage(glyphy, glyphX*10, glyphY*13, charwidth, 12, startX*dotsize, startY*dotsize, charwidth*dotsize, 12*dotsize);
            }
            else if (color=="blue"){
                context.drawImage(glyphb, glyphX*10, glyphY*13, charwidth, 12, startX*dotsize, startY*dotsize, charwidth*dotsize, 12*dotsize);
            }
            else{
                context.drawImage(glyphw, glyphX*10, glyphY*13, charwidth, 12, startX*dotsize, startY*dotsize, charwidth*dotsize, 12*dotsize);
            }
                startX=startX+charwidth+1;
            }
        }
    return startX;
}
router.post('/getmatrix',  [
   check('position').isISO8601()
 //  check('email').isEmail().normalizeEmail(),
  // check('age').isNumeric().trim().escape()
], (req, res) => {
    try{
    var position=Date.parse(req.body.position); //(req.body.position);
    let returnArray=[];
    var lastTime=req.session.lastTimeSet
    let setLastTime=null;
    let resArr=getMessagesFromLog(req.session.roomID, lastTime);

    returnArray=resArr[0];
    setLastTime=resArr[1];

    if (setLastTime!=null){
        req.session.lastTimeSet=setLastTime;
    }
//    for (let i=position;i<messageLog.length;i++){
//        returnArray.push(messageLog[i]);
//    }

    res.write(JSON.stringify(returnArray));
    res.end('');
    }catch(err){
        //console.log(err);
        res.end();
    }
})

router.post('/addprivateroom', (req, res) => {
    var url=req.body.weburl;

    let cipher=addPrivateRoom(url);
    res.writeHead(200, {'Content-Type':'text/plain'})
    res.write(cipher);
    res.end();
})

function postMessage(message, dispname, roomid, begin="yellow"){
    let canvas=createCanvas(234,  21);
    let thisimagepath=getUriFromDictionary('data/images/SystemMessage.png',"ModeA");
    var context = canvas.getContext('2d')
    loadImage(thisimagepath).then((image) => {
        context.drawImage(image, 0, 0);
        let mess1=util.format(message, roomid)
        let namePos=makeName(context, mess1, begin);
        makeName(context, util.format(": %s", dispname), "white", namePos);
        let buffer = canvas.toBuffer('image/png');
        //console.log(buffer);
        fs.writeFileSync('./test.png', buffer);
        postMessageToDiscord("Test", buffer, getRoomWebhook(roomid));
        let dataUrl = canvas.toDataURL('image/png');
        //console.log(dataUrl);
        time=new Date();
        addMessageToLog(roomid, time, dataUrl)
    });
}

router.post('/sendmatrix', (req, res) => {
    //Creates the image URI, and adds it to the message log.
    try{
-    var dotsize=1;
    var parce=JSON.parse(req.body.matrix);
    let most=-1;
    let least=500;
    var time=0;
    let mode=req.session.pallate;
    for (var i=0;i<parce.length;i++){
        var row =parce[i];
        for (var j=0; j<row.length;j++){
            //    if((i>57 || j>16)||(j==16 && i>=54) ||(j==15 && i>=55)||(j==14 && i>=56)||(j==13 && i==57)) {
                    if (parce[i][j]>=2){
                        if (j>most){
                            most=j;
                        }
                        if (j<least && i>=58){
                            least=j;
                        }

                    }
            }
        }
        //most=most-least;
    if (most<=-1){throw new Error("Empty message.");}
    var canvas = canvas=createCanvas(234,  85);


    let thisimagepath=getUriFromDictionary('data/images/OutputWindow80.png',mode);
    if (most<=16){
        canvas=createCanvas(234,  21);
        thisimagepath=getUriFromDictionary('data/images/OutputWindow16.png',mode);;
    }
    else if (most<=32) {
        canvas=createCanvas(234,  37);
        thisimagepath=getUriFromDictionary('data/images/OutputWindow32.png',mode);;
    }
    else if (most<=48) {
        canvas=createCanvas(234,  53);
        thisimagepath=getUriFromDictionary('data/images/OutputWindow48.png',mode);;
    }
    else if (most<=64) {
        canvas=createCanvas(234,  69);
        thisimagepath=getUriFromDictionary('data/images/OutputWindow64.png',mode);;
    }
    else{

    }
    var context = canvas.getContext('2d')
    loadImage(thisimagepath).then((image) => {

        context.drawImage(image, 0, 0);

        for (var i=0;i<parce.length;i++){
            var row =parce[i];

            for (var j=0; j<row.length;j++){
                    ////console.log(parce[i][j])
                     if((i>57 || j>16)||(j==16 && i>=54) ||(j==15 && i>=55)||(j==14 && i>=56)||(j==13 && i==57)) {
                        if (parce[i][j]==2){
                            context.fillStyle = '#141414';
                            context.fillRect((i+3)*dotsize, (j+3)*dotsize, dotsize, dotsize);
                        }
                        else if (parce[i][j]==3){
                            context.fillStyle = '#ff1717';
                            context.fillRect((i+3)*dotsize, (j+3)*dotsize, dotsize, dotsize);
                        }
                        else if (parce[i][j]==4){
                            context.fillStyle = '#003cc8';
                            context.fillRect((i+3)*dotsize, (j+3)*dotsize, dotsize, dotsize);
                        }
                        else if (parce[i][j]==5){
                            context.fillStyle = '#008232';
                            context.fillRect((i+3)*dotsize, (j+3)*dotsize, dotsize, dotsize);
                        }
                        else if (parce[i][j]==6){
                            context.fillStyle = '#ffe600';
                            context.fillRect((i+3)*dotsize, (j+3)*dotsize, dotsize, dotsize);
                        }
                        else{
                            //context.fillStyle = '#fff';
                            //context.fillRect((i)*dotsize, (j)*dotsize, dotsize, dotsize);
                        }
                }
            }
        }
        makeName(context, req.session.dispname);

        let buffer = canvas.toBuffer('image/png');
        //console.log(buffer);
        fs.writeFileSync('./test.png', buffer);
        postMessageToDiscord("Test", buffer, getRoomWebhook(req.session.roomID));
        let dataUrl = canvas.toDataURL('image/png');
        //console.log(dataUrl);
        time=new Date();
        addMessageToLog(req.session.roomID, time, dataUrl)
        /*
        messageLog[time.getTime()]=(dataUrl);
        if (messageLog.length>=250){
            messageLog={};
            messageLog[time.getTime()]=(dataUrl);
        }
        */
        //console.log(messageLog.length);
    });
    res.write("Finishsed.")
    res.end('done');
    }
    catch(err){
        //console.log("Empty message...");
        res.write("Empty...");
        res.end();
    }
});


app.use('/', router);
app.use('/color', colormod)
//Router 4: for session destruction

const server=app.listen(process.env.PORT || 3000, () => {
    let rawdata = fs.readFileSync('data/json/glyphs.json');
    glyphs = JSON.parse(rawdata);

    loadImage('./data/images/Glyphs11.png').then((glyp) => {glyph=glyp; });
        loadImage('./data/images/Glyphs11y.png').then((glyp) => {glyphy=glyp; });
                loadImage('./data/images/Glyphs11w.png').then((glyp) => {glyphw=glyp; });
    loadImage('./data/images/Glyphs11b.png').then((glyp) => {glyphb=glyp; });
    postStatusMessageToDiscord( discordUrlMain, "Turning back on.")
    //console.log(`App Started on PORT ${process.env.PORT || 3000}`);
});
