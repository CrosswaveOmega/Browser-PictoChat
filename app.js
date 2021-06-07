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

var canvas = createCanvas(234*2,  85*2)
var context = canvas.getContext('2d')

//initialize the app as an express app
const app = express();
const router = express.Router();

//middleware

app.use(bodyParser.json());
app.use(
bodyParser.urlencoded({
extended: true
})
);
app.use(cors());
app.use(express.static(__dirname));
//app.use('/images');


//ROUTERS


router.get('/',(req, res) => {
  res.sendfile("index.html");
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
router.get('/sendmatrix', (req, res) => {
console.log("Serverside.");

var dotsize=2;
var parce=JSON.parse(req.body.matrix);
context.clearRect(0, 0, width, height);
context.clearRect(0, 0, width, height);
loadImage('./images/PictochatWindowClear.png').then((image) => {
  context.drawImage(image, 0, 0, 234*2, 85*2);

for (var i=0;i<parce.length;i++){
    var row =parce[i];
    for (var j=0; j<row.length;j++){
            //console.log(parce[i][j])
            if (parce[i][j]==2){
                context.fillStyle = '#000000';
                context.fillRect((i+3)*dotsize, (j+2)*dotsize, dotsize, dotsize);
            }
            else{
                //context.fillStyle = '#fff';
                //context.fillRect((i)*dotsize, (j)*dotsize, dotsize, dotsize);
            }
    }
}

var buffer = canvas.toBuffer('image/png');
console.log(buffer);
fs.writeFileSync('./test.png', buffer);
postMessageToDiscord("Test", buffer);
});
res.end('done');
});

router.post('sendmatrix', (req, res) => {
console.log("Serverside.");

var dotsize=2;
var parce=JSON.parse(req.body.matrix);
context.clearRect(0, 0, width, height);
context.clearRect(0, 0, width, height);
loadImage('./images/PictochatWindowClear.png').then((image) => {
  context.drawImage(image, 0, 0, 234*2, 85*2);

for (var i=0;i<parce.length;i++){
    var row =parce[i];
    for (var j=0; j<row.length;j++){
            //console.log(parce[i][j])
            if (parce[i][j]==2){
                context.fillStyle = '#000000';
                context.fillRect((i+3)*dotsize, (j+2)*dotsize, dotsize, dotsize);
            }
            else{
                //context.fillStyle = '#fff';
                //context.fillRect((i)*dotsize, (j)*dotsize, dotsize, dotsize);
            }
    }
}

var buffer = canvas.toBuffer('image/png');
console.log(buffer);
fs.writeFileSync('./test.png', buffer);
postMessageToDiscord("Test", buffer);
});
res.end('done');
});

//Router 4: for session destruction

app.listen(process.env.PORT || 3000, () => {
console.log(`App Started on PORT ${process.env.PORT || 3000}`);
});
