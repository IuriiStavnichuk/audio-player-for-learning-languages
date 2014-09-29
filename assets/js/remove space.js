/**
 * Created by istavnichuk on 07/02/14.
 */
var fs = require("fs");

//var str= "Первое что приходит на ум.mp3"; var uni = [],i = str.length;
//while (i--) { uni[i] =str[i]+">"+ str.charCodeAt(i); }
//console.log (">>>",  uni );

var walk = function(dir) {

    var filesSource = fs.readdirSync(dir);

    for (var i=0; i<filesSource.length; i++ ) {
        filesSource[i]=filesSource[i].toLowerCase();
        if ( filesSource[i].indexOf("   ")!=-1) {
            newName=filesSource[i].replace('   ',' ');
            console.log ("3 >>>", i, filesSource[i], filesSource[i].indexOf("  "));
            fs.renameSync(dir+filesSource[i], dir+newName)
        }

        if ( filesSource[i].indexOf("  ")!=-1) {
            newName=filesSource[i].replace('  ',' ');
            console.log ("char 160 32 >>>", i, filesSource[i], filesSource[i].indexOf("  "));
            fs.renameSync(dir+filesSource[i], dir+newName)
        }
        if ( filesSource[i].indexOf("  ")!=-1) {
            newName=filesSource[i].replace('  ',' ');
            console.log ("22 >>>", i, filesSource[i], filesSource[i].indexOf("  "));
            fs.renameSync(dir+filesSource[i], dir+newName)
        }
        if ( filesSource[i].indexOf(" ")!==-1) {
            newName=filesSource[i].replace(' ',' ');
            console.log ("char 160 >>>", i, filesSource[i], filesSource[i].indexOf(" "));
            fs.renameSync(dir+filesSource[i], dir+newName)
        }
        if ( filesSource[i].indexOf("'")!=-1) {
            newName=filesSource[i].replace("'",'');
            console.log ("' >>>", i, filesSource[i], filesSource[i].indexOf("'"));
            fs.renameSync(dir+filesSource[i], dir+newName)
        }
        if ( filesSource[i].indexOf("“")!=-1) {
            newName=filesSource[i].replace('“','');
            console.log ("/ >>>", i, filesSource[i], filesSource[i].indexOf("“"));
            fs.renameSync(dir+filesSource[i], dir+newName)
        }
        if ( filesSource[i].indexOf("”")!=-1) {
            newName=filesSource[i].replace('”','');
            console.log ("/ >>>", i, filesSource[i], filesSource[i].indexOf("”"));
            fs.renameSync(dir+filesSource[i], dir+newName)
        }
        if ( filesSource[i].indexOf("/")!=-1) {
            newName=filesSource[i].replace("/",'');
            console.log ("/ >>>", i, filesSource[i], filesSource[i].indexOf("/"));
            fs.renameSync(dir+filesSource[i], dir+newName)
        }
        if ( filesSource[i].indexOf(",")!=-1) {
            newName=filesSource[i].replace(",",'');
            console.log (", >>>", i, filesSource[i], filesSource[i].indexOf(","));
            fs.renameSync(dir+filesSource[i], dir+newName)
        }
    };

    String.prototype.toUnicode = function () {
        return this.replace(/./g, function (char) {
            return "&#" + String.charCodeAt(char) + ";";
        });



    }





}

walk ("mp3//sentences//");
walk ("mp3//words//");
walk ("mp3//programming//");
walk ("mp3//interview//");
walk ("mp3//letters//");
walk ("mp3//phrases//");







