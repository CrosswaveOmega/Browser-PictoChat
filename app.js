//index.js
//including the imported packages
const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
const fetch = require('node-fetch');
const fs = require('fs');
const FormData = require('form-data');
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
app.use(
session({
secret: 'thisisasecret',
saveUninitialized: false,
resave: false
})
);
app.use(bodyParser.json());
app.use(
bodyParser.urlencoded({
extended: true
})
);
app.use(express.static(__dirname));
//app.use('/images');

var sess; //is a global variable, NOT RECOMMENDED!

//ROUTERS

//Router 1: for redering the hompage
//Returns the client.
router.get('/', (req, res) => {
sess = req.session;
if (sess.email && sess.visits) {
return res.redirect('/admin');
} else {
sess.visits = 1;
res.sendFile(__dirname + '/drawing.html');
}
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

router.post('/sendmatrix', (req, res) => {
sess = req.session;
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
router.get('/logout', (req, res) => {
req.session.destroy(err => {
if (err) {
return console.log(err);
}
res.redirect('/');
});
});

app.use('/', router);
app.listen(process.env.PORT || 3000, () => {
console.log(`App Started on PORT ${process.env.PORT || 3000}`);
});
