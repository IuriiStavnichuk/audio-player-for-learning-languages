var fs = require('fs');
var array = fs.readFileSync('../audio_player_two_lang/_musor.html').toString().split("\n");
for(i in array) {

    line = array[i].replace(/(\r\n|\n|\r)/gm," ");

    line =line.replace(/"/g, '\"');

    console.log( '"'+line + '"+')
}

