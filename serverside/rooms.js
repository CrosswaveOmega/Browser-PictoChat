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


const roomStorage={
    rooms:{}
};




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


function setup(){

    addRoom("A");
    addRoom("B");
    addRoom("C");
    addRoom("D");
}

setup();

module.exports= {addRoom, addMessageToLog, getMessagesFromLog};
