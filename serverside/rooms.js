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
const util = require('util');
const { createCanvas, loadImage } = require('canvas');
const roomMake = express.Router();
const roomStorage={
    rooms:{},
    privateRooms:0
};

const privateRoomCiphers={

}

function makeCipher(){
    let length=7
    var result           = '';
    var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for ( var i = 0; i < length; i++ ) {
          result += characters.charAt(Math.floor(Math.random() *
     charactersLength));
       }
       return result;

}

function checkIfRoomIDExists(id){
    //console.log(JSON.stringify(roomStorage))
    if (roomStorage.rooms.hasOwnProperty(id)){
        return true;
    }
    return false;
}

function addRoom(id, type="Public", webhook="None"){
    if (checkIfRoomIDExists(id)){ throw "Given RoomID already exists";}
    let newRoom={
        roomID:id,
        roomType:type,
        webhookurl:webhook,
        messageLog:{}
    };
    roomStorage.rooms[id]=newRoom;
    return id;
}

function addMessageToLog(roomId, time, dataUrl){
    if( checkIfRoomIDExists(roomId)){
        roomStorage.rooms[roomId].messageLog[time.getTime()]=(dataUrl);
        if (roomStorage.rooms[roomId].messageLog.length>=250){
            roomStorage.rooms[roomId].messageLog={};
            roomStorage.rooms[roomId].messageLog[time.getTime()]=(dataUrl);
        }
    }
}

function getMessagesFromLog(roomId, time){
    if (checkIfRoomIDExists(roomId)){
        let returnArray=[];
        let lastTime=time;
        let setLastTime=null;
        Object.keys(roomStorage.rooms[roomId].messageLog).forEach(function(key){
            //console.log(key);
            //console.log(lastTime);
            if (key>lastTime){
                returnArray.push(roomStorage.rooms[roomId].messageLog[key]);
                setLastTime=key;
            }
        }
        ) ;
        return [returnArray, setLastTime];
    }
    else {throw "This room id does not exist.";}
}

function getRoomWebhook(roomId){
    if( checkIfRoomIDExists(roomId)){
        return roomStorage.rooms[roomId].webhookurl;
    }
    return "None";
}
function checkIfWebhookExists(webhook){
    var returnVal=null;
    Object.keys(privateRoomCiphers).forEach(function(key){
        //console.log(key);
        //console.log(lastTime);
        console.log(privateRoomCiphers[key])
        if(roomStorage.rooms[privateRoomCiphers[key]].webhookurl==webhook){
            returnVal= key;
        }
    }
    ) ;
    return returnVal;
}

function addPrivateRoom(webhook, exCyph=null){
    console.log(webhook)
    let ciphcheck=checkIfWebhookExists(webhook);
    if (ciphcheck!=null){
        return ciphcheck;
    }
    let newID=util.format("PR_%d",roomStorage.privateRooms)
    roomStorage.privateRooms=roomStorage.privateRooms+1;
    addRoom(newID, "Private", webhook);
    var cipher=makeCipher();
    if (exCyph!=null){
        cipher=exCyph;
    }
    while (privateRoomCiphers.hasOwnProperty(cipher)){
        cipher=makeCipher();
    }
    privateRoomCiphers[cipher]=newID;
    return cipher;
}

function getPrivateRoomByCipher(cipher){
    if (privateRoomCiphers.hasOwnProperty(cipher)){
        return privateRoomCiphers[cipher];
    }
    return null;
}

function postStatusMessageToDiscord(webhook=null, message="") {
    //console.log("GO.")
    var discordUrl=webhook;
    if (webhook==null){ return null;}
    const form = new FormData();
    form.append('payload_json', JSON.stringify({"username":"PictoChat", "content":message, "avatar_url":process.env.ProfileImage}))
    const options = {
    method: 'POST',
    body: form,
    headers: form.getHeaders()
    }

    fetch(discordUrl, options)
    }
    function getRandomInt(min, max) {
      min = Math.ceil(min);
      max = Math.floor(max);
      return Math.floor(Math.random() * (max - min) + min); //The maximum is exclusive and the minimum is inclusive
    }

function setup(){

    addRoom("A");
    addRoom("B");
    addRoom("C");
    addRoom("D");
    let url= process.env.PrivateDebugWebhook;
    let ciph= process.env.PrivateDebugCipher;
    if (url!=null && ciph!=null){
    let ciph2=addPrivateRoom(url, ciph)

    console.log("CIPHER", ciph2);
    console.log(ciph2)
    let responses=["Hello world, I'm back online!", "Greetings mortals, I live.", "Beware cowards, I awaken.", "Mezame tamae, waga aruji tachi yo!", "I'm so lonely...", "I wonder what's for DINNER?", "PAY ME TRIBUTE.", "Nikki is my waifu.", "Good morning!", "Ness, It's your dad."]
    //postStatusMessageToDiscord(url, responses[getRandomInt(0, responses.length)])
    //postStatusMessageToDiscord(url, "Back "])

    }

}

setup();

module.exports= {addRoom, addMessageToLog, getMessagesFromLog, getRoomWebhook, addPrivateRoom, getPrivateRoomByCipher, postStatusMessageToDiscord};
