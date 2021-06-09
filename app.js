//index.js
//including the imported packages
const express = require('express');
const session = require('express-session');
const {check} = require('express-validator');
const bodyParser = require('body-parser');
const fetch = require('node-fetch');
const fs = require('fs');
const FormData = require('form-data');
const cors = require("cors");
const { createCanvas, loadImage } = require('canvas');
const width = 228*2;
const height = 80*2;

const discordUrl='https://discord.com/api/webhooks/851232711075168266/RgkH5r8_dKtTbv68zEEf444Amkq02mwPXAnDNKfLd3b1ZC6DgzMw3AjyqJHZWD0M4CO6'


//initialize the app as an express app
const app = express();
const router = express.Router();

//middleware

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true})
);
app.use(express.static(__dirname));
app.use(cors());
app.use(session({
    secret: "OWAIJFOIHSKJ",
    resave:true,
    saveUninitialized:true
}));
const startupHead=`<html><head><title>Enter Display Name.</title></head>`
const startupBody=`
<body>
    <form action="/theapp" method="post">
        <label for="displayname"> Display Name:</label><br>
            <input type="text" id="displayname" name="displayname"><br>
        <input type="submit" value="Submit">
    </form>
</body>
</html>`;
//app.use('/images');


//ROUTERS
var messageLog=[];
var glyphs= {};
var glyph= null;
router.get('/',(req, res) => {
    res.writeHead(200, {'Content-Type':'text/html'})
    let response=[];
    res.write(startupHead);
    res.write(startupBody);
    res.end();
});

router.post('/theapp', [
   check('displayname').isLength({min:1, max: 10 }).trim().escape()//,
 //  check('email').isEmail().normalizeEmail(),
  // check('age').isNumeric().trim().escape()
], (req, res) => {
    try{
        let displayname=req.body.displayname; //(req.body.position);
        if (displayname == undefined ){throw new Error("You didn't enter anything!");}
        //displayname= new Sanitizer().sanatize(displayname);
        if (displayname.length>10){throw new Error("Your name is too big!");}
        req.session.dispname=displayname;
        res.sendFile(__dirname + '/draw.html');
    }
    catch(err){
        console.log(err)
        res.write("<html><head><title>"+err+"</title></head>");
        res.write(startupBody);
        res.end();
    }
})

router.post('/whoami', (req, res) => {
    console.log(req.session)
    let displayname=req.session.dispname; //(req.body.position);
    res.write(displayname);
    res.end();
})


function postMessageToDiscord(message, buffer) {
    console.log("GO.")
    const form = new FormData();
    form.append('file', buffer, "tes3.png")

    const options = {
    method: 'POST',
    body: form,
    headers: form.getHeaders()
    }

    fetch(discordUrl, options)
        .then(res => res.json())
        .then(json => console.log(json));
    }

function makeName(context, name){
    var startX=5;
    var startY=3;
    var glyphX=0;
    var glyphY=0;
    var dotsize=1;
    var charwidth=0;
    console.log(name);

    //const glyphX1=new Image (320, 377); glyphX1.src = ;
        for (let index = 0; index < name.length; index++) {
            let current=(name[index]);
            if (glyphs.glyphs.hasOwnProperty(current)){
                glyphX=glyphs.glyphs[current].px;
                glyphY=glyphs.glyphs[current].py;
                charwidth=glyphs.glyphs[current].width;
                console.log(glyphX, glyphY, charwidth);
                context.drawImage(glyph, glyphX*10, glyphY*13, charwidth, 12, startX*dotsize, startY*dotsize, charwidth*dotsize, 12*dotsize);
                startX=startX+charwidth+1;
            }
        }
}
router.post('/getmatrix', (req, res) => {
    var position=req.body.position%100; //(req.body.position);
    let returnArray=[];
    for (let i=position;i<messageLog.length;i++){
        returnArray.push(messageLog[i]);
    }
    res.write(JSON.stringify(returnArray));
    res.end('');
})

router.post('/sendmatrix', (req, res) => {
    console.log("Serverside.");

    var dotsize=1;
    var parce=JSON.parse(req.body.matrix);
    let most=0;
    for (var i=0;i<parce.length;i++){
        var row =parce[i];
        for (var j=0; j<row.length;j++){
            //    if((i>57 || j>16)||(j==16 && i>=54) ||(j==15 && i>=55)||(j==14 && i>=56)||(j==13 && i==57)) {
                    if (parce[i][j]==2){
                        if (j>most){
                            most=j;
                        }
                    }
            }
        }
    var canvas = canvas=createCanvas(234,  85);


    let thisimagepath='./images/OutputWindow80.png';
    if (most<=16){
        canvas=createCanvas(234,  21);
        thisimagepath='./images/OutputWindow16.png';
    }
    else if (most<=32) {
        canvas=createCanvas(234,  37);
        thisimagepath='./images/OutputWindow32.png';
    }
    else if (most<=48) {
        canvas=createCanvas(234,  53);
        thisimagepath='./images/OutputWindow48.png';
    }
    else if (most<=64) {
        canvas=createCanvas(234,  69);
        thisimagepath='./images/OutputWindow64.png';
    }
    else{

    }
    var context = canvas.getContext('2d')
    loadImage(thisimagepath).then((image) => {

        context.drawImage(image, 0, 0);

        for (var i=0;i<parce.length;i++){
            var row =parce[i];

            for (var j=0; j<row.length;j++){
                    //console.log(parce[i][j])
                     if((i>57 || j>16)||(j==16 && i>=54) ||(j==15 && i>=55)||(j==14 && i>=56)||(j==13 && i==57)) {
                        if (parce[i][j]==2){
                            context.fillStyle = '#000000';
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
        console.log(buffer);
        fs.writeFileSync('./test.png', buffer);
        postMessageToDiscord("Test", buffer);
        let dataUrl = canvas.toDataURL('image/png');
        console.log(dataUrl);
        messageLog.push(dataUrl);
        if (messageLog.length>=100){
            messageLog=[];
            messageLog.push(dataUrl);
        }
        console.log(messageLog.length);
    });
    res.write("Finishsed.;")
    res.end('done');
});


app.use('/', router);
//Router 4: for session destruction

app.listen(process.env.PORT || 3000, () => {
    let rawdata = fs.readFileSync('glyphs.json');
    glyphs = JSON.parse(rawdata);
    loadImage('./images/Glyphs11.png').then((glyp) => {glyph=glyp; });
console.log(`App Started on PORT ${process.env.PORT || 3000}`);
});
