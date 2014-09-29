var fs = require("fs");

var isKyr = function  (str) { return /[а-яё]/i.test(str);};  var state=false;

var walk = function(folderName) {
    var results = [], files = [];
    var dir="mp3//"+folderName+"//";
    var filesSource = fs.readdirSync(dir);

    filesSource.sort(function(a, b) {
        return fs.statSync(dir + b).mtime.getTime() -  fs.statSync(dir + a).mtime.getTime();
    });

    //console.log ("filesSource", filesSource);

    for (var i=0; i<filesSource.length-1; i=i+2 ) {
        files[i]=filesSource[i+1];
        files[i+1]=filesSource[i];
    }

    console.log ("files>>>", files);


    var trackId=files.length+1;

    fs.open( 'assets//json//'+folderName+'.json' , 'w+', 666, function( e, id ) {

        line='{"playlist": [\r\n';
        // fs.write(id, line ,  null, 'utf8',  function(err) {});
        for (var i in files ) {
            trackId--;

            if (i==files.length-1) {
                line=line+'{"checked":true,"id":'+'"' +trackId+'",' +'"title":'+'"' +files[i].slice(0, -4)+'",' +
                    '"time":'+fs.statSync(dir + files[i]).mtime.getTime()+
                    '}\r\n';
            } else {
                line=line+'{"checked":true,"id":'+'"' +trackId+'",' +'"title":'+'"' +files[i].slice(0, -4)+'",' +
                    '"time":'+fs.statSync(dir + files[i]).mtime.getTime()+
                    '},\r\n';
            }

        }

        line=line+"]}";
        console.log ("line>>", line);
        fs.write(id, line ,  null, 'utf8',  function(err) {
            if(err) {
                console.log("!!!!!!!!!!!!!!!!!!!!!!!!!!!!! ERROR>>>>>>>>>>>", err);
            } else {
                console.log("!!!!!!!!!!!!!!!!!!!!!!!!!!!!! SUCCESS >>>>>>>>>>>", err);
            }

        });
        fs.close(id, function(){
            console.log('file closed');
        });

    });



    for (var i in files ) {
        results[i]= {checked:true,
            title:files[i],
            date:(fs.statSync(dir + files[i]).mtime+"").substr(4,17),
            time:fs.statSync(dir + files[i]).mtime.getTime()
        }
    }
    return results;



}
//
//var folderName='sentences';
//
//
//walk ("mp3//"+folderName+"//");
//
//var folderName='letters';
//
//
//walk ("mp3//"+folderName+"//");

var folderName=['sentences', 'interview', 'phrases','programming'];

for(var i in folderName) {
    console.log ("folderName[i]>>>", folderName[i]);
    walk (folderName[i]);
}









