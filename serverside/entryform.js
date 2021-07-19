const express = require('express');
const session = require('express-session');
const {check} = require('express-validator');
const bodyParser = require('body-parser');
const fetch = require('node-fetch');
const fs = require('fs');

const FormData = require('form-data');
const util = require('util');




const startupHead=`

<html><head><title>Enter Display Name.</title>
 <meta charset="UTF-8">
<style>

.grid-container{
    display: grid;
    grid-template-columns: 52px 52px 52px 52px;
    grid-auto-rows: 52px;
    gap:10px;
    padding: 10px;
}

.button {
  display: inline-block;
  border-radius: 4px;
  border: none;
  text-align: center;
  transition: all 0.5s;
  cursor: pointer;
  margin: 5px;
}

.button:hover {
  border: dashed;
  margin:8px;
  border-radius: 4px;
}
.disabled {
  display: inline-block;
  border: 1px dashed;
  text-align: center;
  transition: all 0.5s;
  cursor: not-allowed;
  margin: 10px;
}

input button {
  border: 1px solid rgba(0, 0, 0, 0.8);
  padding: 20px;
  font-size: 30px;
  text-align: center;
}


</style>
</head>
`
const startupBody=`<body>
<script>
   function changeValue(o){
     document.getElementById('color').value=o.value;
     document.getElementById('colorselect').style.backgroundColor=o.style.backgroundColor;
     var elements = document.getElementById('colorselect').children;
     for (var i = 0; i < elements.length; i++){
         elements[i].className="button";

    }
    o.className="disabled"
    // o.style.cursor="not-allowed";
    // o.style.opacity=0.3;
    }

</script>
    <h1> %s </h1>
    <form action="/theapp" method="post">
        <label for="displayname"> Display Name:</label><br>
            <input type="text" id="displayname" name="displayname"><br>
            <input type="hidden" id="color" name="colormode" value="ModeA">
              <fieldset>
                <label>Select a color:</label><br>
              <div class="grid-container" id=colorselect>
              <input type="button" class="button" onclick="changeValue(this)" value="ModeA" style="background-color:#61829a;">
              <input type="button" class="button" onclick="changeValue(this)" value="ModeB" style="background-color:#ba4900;">
              <input type="button" class="button" onclick="changeValue(this)" value="ModeC" style="background-color:#fb0018;">
              <input type="button" class="button" onclick="changeValue(this)" value="ModeD" style="background-color:#fb8afb;">

              <input type="button" class="button" onclick="changeValue(this)" value="ModeE" style="background-color:#fb9200;">
              <input type="button" class="button" onclick="changeValue(this)" value="ModeF" style="background-color:#f3e300;">
              <input type="button" class="button" onclick="changeValue(this)" value="ModeG" style="background-color:#aafb00;">
              <input type="button" class="button" onclick="changeValue(this)" value="ModeH" style="background-color:#00fb00;">

              <input type="button" class="button" onclick="changeValue(this)" value="ModeI" style="background-color:#00a238;">
              <input type="button" class="button" onclick="changeValue(this)" value="ModeJ" style="background-color:#49db8a;">
              <input type="button" class="button" onclick="changeValue(this)" value="ModeK" style="background-color:#30baf3;">
              <input type="button" class="button" onclick="changeValue(this)" value="ModeL" style="background-color:#0059f3;">

              <input type="button" class="button" onclick="changeValue(this)" value="ModeM" style="background-color:#000092;">
              <input type="button" class="button" onclick="changeValue(this)" value="ModeN" style="background-color:#8a00d3;">
              <input type="button" class="button" onclick="changeValue(this)" value="ModeO" style="background-color:#d300eb;">
              <input type="button" class="button" onclick="changeValue(this)" value="ModeP" style="background-color:#fb0092;">
              </div>
            </fieldset>
        <input type="submit" value="Submit">
    </form>
</body>
</html>`;



function sendForm(message){
    let toReturn=(startupHead);
    toReturn=toReturn+util.format(startupBody, message);
    return toReturn;
}


module.exports= sendForm;
