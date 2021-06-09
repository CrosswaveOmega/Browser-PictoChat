//index.js
//including the imported packages
const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
const fetch = require('node-fetch');
const fs = require('fs');
const FormData = require('form-data');
const cors = require("cors");
const { createCanvas, loadImage } = require('canvas');
const width = 228*2;
const height = 80*2;

const discordUrl='https://discord.com/api/webhooks/851232711075168266/RgkH5r8_dKtTbv68zEEf444Amkq02mwPXAnDNKfLd3b1ZC6DgzMw3AjyqJHZWD0M4CO6'

var canvas = createCanvas(234,  85)
var context = canvas.getContext('2d')

//initialize the app as an express app
const app = express();
const router = express.Router();

//middleware

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true})
);
app.use(express.static(__dirname));
app.use(cors());

//app.use('/images');


//ROUTERS
var messageLog=[];

router.get('/',(req, res) => {
    res.sendFile(__dirname + '/draw.html');
});

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
    context.clearRect(0, 0, width, height);
    context.clearRect(0, 0, width, height);
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

    loadImage('./images/OutputWindow80.png').then((image) => {

        context.drawImage(image, 0, 0, 234*dotsize, 85*dotsize);
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
console.log(`App Started on PORT ${process.env.PORT || 3000}`);
});
