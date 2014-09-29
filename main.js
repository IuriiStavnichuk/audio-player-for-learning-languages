var app=angular.module("myApp", [])
app.run(function($rootScope) {
    $rootScope.id='';
    $rootScope.nextElement='';
})

//app.factory('jsonplaylist', function($http) {
//    return $http.get('assets/json/fileslistSentences.json');
//});
//app.factory('jsonplaylistwords', function($http) {
//    return $http.get('assets/json/fileslistWords.json');
//});

app.controller ("AppCtrl", function ($scope, $rootScope, $http, $sce) {
//$scope.errorMessage="";
//app.controller ("AppCtrl", function ($scope, $http, jsonplaylist, jsonplaylistwords) {
//$scope.path="mp3/sentences/";
$scope.workingArrayWithPlaylist=[];

    var timers = [];var timersForCheck = [];
    //jsonplaylist.success(function(data) { $scope.workingArrayWithPlaylist = data.playlist; });

    $scope.$watch('jsonName', function ( newValue, oldValue, $scope ) {

        $scope.loadingIndicatorVisible=1;
        $scope.chartVisibility=0;
        $scope.pathToMp3='mp3/'+$scope.jsonName+'/';
        $scope.currentFilelist='assets/json/'+$scope.jsonName+'.json';
        $http.get($scope.currentFilelist).success(function(data) {
        $scope.sourceArrayWithPlaylist =data.playlist;

            $scope.listOfFirstRecords={};
            $scope.firstRecord=$scope.sourceArrayWithPlaylist.length;
            var ii;
            for (var i=$scope.firstRecord;  i>0 ; i=i-200) {
                ii="000"+i;
                $scope.listOfFirstRecords[ii.substr(ii.length-4
                )]=i;
            }

            // $scope.workingArrayWithPlaylist = $scope.sourceArrayWithPlaylist.slice();

           var first=$scope.sourceArrayWithPlaylist.length;
           var realFirst=$scope.sourceArrayWithPlaylist.length-first;

           for (var i= realFirst,j=0; i<realFirst+100; i=i+1) {
                $scope.workingArrayWithPlaylist[j++]=$scope.sourceArrayWithPlaylist[i];
           }

            //COMMENT IT

            //var first=499; realFirst=$scope.sourceArrayWithPlaylist.length-first;
            //for (var i= realFirst,j=0; i<realFirst+25; i=i+2) {
            //    $scope.workingArrayWithPlaylist[j++]=$scope.sourceArrayWithPlaylist[i];
            //}
            //            setTimeout ( function() {
            //                    $('#playlist a').css('color','#fff !important');
            //                    $('#playlist a').hover( function(){$(this).css('background-color','#fff !important')});
            //                    $('#current-track-name').css('display','none');
            //                    $('#next-track').css('display','none');
            //                }
            //                , 100)

            //COMMENT IT
            $scope.loadingIndicatorVisible=0;
        });

        $scope._player.pause();
        $scope._player.src = "";
        timers.length=0;
        $rootScope.id=0;
        window.clearTimeout(timersForCheck);
        document.getElementById("current-track").innerHTML="click on track below";
//        if ($('#next-track').length > 0) { document.getElementById("next-track").innerHTML= "▪" };

    });

    $scope.$watch('firstRecord', function ( newValue, oldValue, $scope ) {

        if ( newValue!=oldValue)   {

           // $http.get($scope.currentFilelist).success(function(data) {
                $scope.realFirstRecord= ($scope.sourceArrayWithPlaylist.length-$scope.firstRecord)<0 ? 0 : $scope.sourceArrayWithPlaylist.length-$scope.firstRecord;
                $scope.workingArrayWithPlaylist =$scope.sourceArrayWithPlaylist.splice( $scope.realFirstRecord, 200);
               // console.log ("$scope.realFirstRecord >> ", $scope.realFirstRecord)
           // });

        }

    });
//    $scope.$watch('fieldVisible', function ( newValue, oldValue, $scope ) {
//
//        if ( newValue!=oldValue)   {
//            $scope.workingArrayWithPlaylist.length=0;
//            switch ($scope.fieldVisible) {
//                case "even":
//                    for (var i= 0,j=0; i<$scope.sourceArrayWithPlaylist.length; i=i+2) {
//                         $scope.workingArrayWithPlaylist[j++]=$scope.sourceArrayWithPlaylist[i];
//                    }
//                    break;
//                case "odd":
//                    console.log ("odd>>>");
//                    for (var i= 1,j=0; i<$scope.sourceArrayWithPlaylist.length; i=i+2) {
//                        $scope.workingArrayWithPlaylist[j++]=$scope.sourceArrayWithPlaylist[i];
//                    }
//                    break;
//                default:
//                    $scope.workingArrayWithPlaylist=$scope.sourceArrayWithPlaylist.slice();
//            }
//        }
//
//    });


    $scope._player = document.getElementById('player');
    $scope._playlist = document.getElementById('playlist');
    $scope._play = document.getElementById('play');
//  $scope._pause = document.getElementById('pause');
    $scope._prev = document.getElementById('prev');
    $scope._next = document.getElementById('next');

//        $scope.initFunction= function (){
//        $scope.indexInCycle=1; //for calculate delay
//       // $scope.counter=1;      //for calculate each second
//    }

    function callback (state, error, track){
        $scope.trustedErrorMessage = $sce.trustAsHtml("callbackERROR <strong> "+ state +" </strong><strong> "+ error +" </strong> ");
        console.log ("STATE>>>", state, error);
        console.log ("ERROR>",  error);
        console.log ("TRACK>",  track);
        $scope.errorMessage=true;

        $rootScope.id++;
        $scope.playTrack($rootScope.id);
        $scope.$apply();
    }

    $scope.playTrack= function (id){
//        try {
//            if($scope._player.canPlayType('audio/mpeg') == "probably")
//                callback("canPlay");
//
//            //If this event fires, then MP3s can be played
//            $scope._player.addEventListener('canplaythrough', function(e){
//                callback("canplaythrough");
//            }, false);
//
//            //If this is fired, then client can't play MP3s
//            $scope._player.addEventListener('error', function(e){
//                callback("error", this.error)
//            }, false);

        $scope._player.pause();
        $scope._player.src = "";

        timers.length=0;

        if (id === null || id === undefined || id === '') {id = 0;}

        $(".glyphicon.glyphicon-play").toggleClass('glyphicon-play glyphicon-pause');

        $rootScope.id= ( document.getElementById ( "track"+id) ||'' ) ? id : 0 ;

        //   if ($scope.workingArrayWithPlaylist[$rootScope.id].checked===true) {

        $scope.selected = $scope._playlist.querySelector(".selected");

        if ($scope.selected) { $scope.selected.classList.remove("selected");}

        $scope.clickedElement = document.getElementById("track"+$rootScope.id);


        $rootScope.nextElement = ($rootScope.id+1!== $scope.workingArrayWithPlaylist.length) ? document.getElementById("track"+($rootScope.id+1)) : document.getElementById("track0");

        $scope.clickedElement.classList.add("selected");


        $scope.currentTrack=$scope.clickedElement.innerHTML;

        document.getElementById("current-id").innerHTML=$scope.workingArrayWithPlaylist[$rootScope.id].id ;

        document.getElementById("current-track").innerHTML=$scope.currentTrack;

        if ($('#next-track').length > 0) { document.getElementById("next-track").innerHTML= $rootScope.nextElement.innerHTML;}


        $scope._player.src = $scope.pathToMp3 + $scope.currentTrack+".mp3";

        $("#playlist").css("margin-top",$(".audio-player").height()+4);

        $scope._player.play();

//                var ii=0;
//
//                timersForCheck=setInterval (function run() {
//
//
//                    ii++;
//                    if ($scope._player.currentTime>0) {
//                        $scope.trustedErrorMessage=$sce.trustAsHtml("id_1>>"+$rootScope.id+"  <br> "+"duration>>"+$scope._player.duration+"  <br> "+"currentTime>>"+$scope._player.currentTime+" <br> "+"currentTrack>>"+ $scope.currentTrack);
//                        window.clearTimeout(timersForCheck)
//
//                        $scope.$apply();
//                    }
//                    else {
//                        if (ii<5){
//                            $scope.trustedErrorMessage=$sce.trustAsHtml("CYCLE id>>"+ii+"  "+$rootScope.id+"  <br> "+"duration>>"+$scope._player.duration+"  <br> "+"currentTime>>"+$scope._player.currentTime+" <br> "+"currentTrack>>"+ $scope.currentTrack);
//                            var tmpSrc=$scope._player.src;
//                            $scope._player.src="";
//                            $scope._player.pause();
//
//                            $scope._player.src=tmpSrc;
//                            $scope._player.play();
//                            $scope.$apply();
//                        } else {
//                            window.clearTimeout(timersForCheck);
//                            $scope.trustedErrorMessage=$sce.trustAsHtml("ERROR id>>"+$rootScope.id+"  <br> "+"duration>>"+$scope._player.duration+"  <br> "+"currentTime>>"+$scope._player.currentTime+" <br> "+"currentTrack>>"+ $scope.currentTrack);
//                            $scope.errorMessage= true;
//                            $rootScope.id++;
//                            $scope.playTrack($rootScope.id);
//                            $scope.$apply();
//                        }
//                    }
//                },20);
        //           }
        //       }
//        catch (e) {
//            if(window.console && console.error("Error:" + e));
//            callback("catch error", e, $rootScope.id+" "+$scope.currentTrack);
//        }
    }
    // $scope.increase==1;
    $scope.currentNumberOfRepetitions=1;

    $scope.playNextWidthDelay= function() {

        $scope.timeDelay=( $scope.indexInCycle ) ? $scope.timeDelayBetweenTracks*$scope._player.duration*1000 : $scope.timeDelayBetweenRepetitions*1000 ;

        $scope.indexInCycle=!$scope.indexInCycle;


        if ( $scope.currentNumberOfRepetitions < $scope.numberOfRepetitions*2 ) {     //for  numberOfRepetitions
            $scope.currentNumberOfRepetitions++;
            if ($scope.indexInCycle){$rootScope.id--} else {$rootScope.id++}
        }
        else {
            $scope.currentNumberOfRepetitions=1;
            $rootScope.id++;$scope.indexInCycle=1;
        }

        if ($rootScope.id==$scope.workingArrayWithPlaylist.length) { $rootScope.id=0 };

        timers.push(setTimeout (function run() {

                $scope.playTrack($rootScope.id);
            },
            $scope.timeDelay) );


    }


    $scope.playNext= function() {
        if(!$rootScope.id  ) {$rootScope.id =0}
        $scope._player.src = "";

        $rootScope.id = ($rootScope.id>=$scope.workingArrayWithPlaylist.length) ?  0 : $rootScope.id+1;
        $scope.playTrack($rootScope.id);
    }
    $scope.playPrev= function() {
        if(!$rootScope.id  ) {$rootScope.id =0}
        $scope._player.src = "";
        $rootScope.id = ($rootScope.id<1)? 0 : $rootScope.id-1;
        $scope.playTrack($rootScope.id);
    }

    $scope.findCheckedTrack= function(trackId) {

        if ($scope.showTestPage){
            $scope.timeDelayBetweenTracks=999999;
            $scope.timeDelayBetweenRepetitions=999999;
            $scope.showMatte=1;
            $scope.testInfoShow=0;
            $scope.testSubmitFormShow=1;
            $scope._player.removeEventListener("ended", $scope.playNextWidthDelay);
            // $("#matte").css("display","block")
        }


        if (trackId % 2 == 1) {$scope.indexInCycle=0; $scope.currentNumberOfRepetitions=2;}   //if odd -finish loop
        else {$scope.indexInCycle=1; $scope.currentNumberOfRepetitions=1;}

        //  $scope.initFunction();
        $scope.playTrack(trackId); //break;
    }

    $scope.selectDeselectAllCheckers= function () {
        for (var index in $scope.workingArrayWithPlaylist) {
            $scope.workingArrayWithPlaylist[index].checked = !$scope.workingArrayWithPlaylist[index].checked;
        }
    }

//    $scope.progressBar=function() {
    //get current time in seconds
    //var elapsedTime = Math.round($scope._player.currentTime);

    //      console.log ("elapsedTime              >", $scope._player.currentTime );
//      $scope.errorMessage= $scope._player.currentTime;
    //console.log ("$scope._player.duration33;>>>", $scope._player.duration);
    //if ($scope._player.duration<=$scope._player.currentTime)  {console.log ("YES>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>");}
    //update the progress bar
//        if (canvas.getContext) {
//            var ctx = canvas.getContext("2d");
//            //clear canvas before painting
//            ctx.clearRect(0, 0, canvas.clientWidth, canvas.clientHeight);
//            ctx.fillStyle = "rgb(255,0,0)";
//            var fWidth = (elapsedTime / oAudio.duration) * (canvas.clientWidth);
//            if (fWidth > 0) {
//                ctx.fillRect(0, 0, fWidth, canvas.clientHeight);
//            }
//        }
//    }

//        $scope.playing=function() {
//            console.log("$rootScope >>>", $rootScope.id, $scope.currentTrack)
//        }

    $scope._player.addEventListener("ended", $scope.playNextWidthDelay);

//    $scope._player.addEventListener("timeupdate", $scope.progressBar, true);

//    timersForCheck=setInterval (function run() {
//        $scope._player.addEventListener("onerror",   callback("onerror", "onerror", $rootScope.id+" "+$scope.currentTrack) );
//    }, 50)

    // $scope._player.addEventListener("playing", $scope.playing);


//    $scope._player.addEventListener('loadedmetadata', function() {
//        $scope._player.play();
//    }, false);




    $scope._play.addEventListener("click", function () {
        if ($(".glyphicon.glyphicon-play").length) {
            $(".glyphicon.glyphicon-play").toggleClass('glyphicon-play glyphicon-pause');
            $scope.playTrack($rootScope.id);
        } else {
            $scope._player.src = "";
            for (var i = 0; i < timers.length; i++) { clearTimeout(timers[i]); }timers.length=0;

            $(".glyphicon.glyphicon-pause").toggleClass('glyphicon-pause glyphicon-play');
            $scope._player.pause();
        }
    });
    $scope._next.addEventListener("click", $scope.playNext);
    $scope._prev.addEventListener("click", $scope.playPrev);


//    $scope.changeFilelist= function (id) {

    //        $scope._player.src = "";
    //        for (var i = 0; i < timers.length; i++) { clearTimeout(timers[i]); }; timers.length=0;
    //        document.getElementById("current-track").innerHTML="click track below";
    //        document.getElementById("next-track").innerHTML= "";
    //
    //        $(".change-filelist a").removeClass();
    //        $("#"+id).addClass( "active" );
    //        switch (id) {
    //            case "btn-words":
    //                $scope.pathToMp3="mp3/words/";
    //                jsonplaylistwords.success(function(data) { $scope.workingArrayWithPlaylist = data.playlist; });
    //                break;
    //            default:
    //                $scope.pathToMp3="mp3/sentences/";
    //                jsonplaylist.success(function(data) { $scope.workingArrayWithPlaylist = data.playlist; });
    //                break;
    //        }
    //        $("#directionOfTranslation").html("RU►EN")
//    }

    $scope.changeDirectionOfTranslation= function (reverse) {
        var tmpArray=[];
        for ( var i=0;  i< $scope.workingArrayWithPlaylist.length; i=i+2) {
            tmpArray[i]=$scope.workingArrayWithPlaylist[i+1];
            tmpArray[i+1]=$scope.workingArrayWithPlaylist[i];
        }
        $scope.workingArrayWithPlaylist= tmpArray;
        (reverse)?  $("#directionOfTranslation").html("EN>RU"): $("#directionOfTranslation").html("RU>EN")
    }

    $scope.shuffle= function (reverse) {
        var tmpArray=[],arrayWithRandomIndexes=[];

        for ( var i=0;  i< $scope.workingArrayWithPlaylist.length-1; i=i+2) {

            while("1")
            {
                var randomIndex=Math.floor(Math.random()*($scope.workingArrayWithPlaylist.length-1));
                if (randomIndex % 2 == 0){   //terminate if even

                    if (arrayWithRandomIndexes.indexOf(randomIndex)===-1)  {  //if unique
                        arrayWithRandomIndexes.push(randomIndex);
                        break;
                    }
                }
            }

            tmpArray[i]=$scope.workingArrayWithPlaylist[randomIndex];
            tmpArray[i+1]=$scope.workingArrayWithPlaylist[randomIndex+1];

        }

        $scope.workingArrayWithPlaylist= tmpArray;

    }


    $scope.$watch('chartVisibility', function ( ) {

        if ($scope.chartVisibility==1) {

            Array.prototype.getUnique = function(){
                var u = {}, a = [];
                for(var i = 0, l = this.length; i < l; ++i){
                    if(u.hasOwnProperty(this[i])) {continue;}
                    a.push(this[i]);
                    u[this[i]] = 1;
                }
                return a;
            }

            d3.text("countrymin.csv", function(error, data) {
                var workingArray=[];
                loadResult=function() {


                    //var tmp=localStorage.answers;
                    //    if (localStorage.answers!==undefined) {
                    // var localStorageArray=localStorage.answers.split(",");

                    var testArray=
                        "11,clobberingg,clobbering quibble,8,2013/9/24,"+
                            "12,reminiscebnt,reminisce<em>b</em><em>n</em>,2,2013/9/24,"+
                            "13,positive,positive,4,2013/9/24,"+
                            "14,tedius,te<em>d</em><em>i</em><em>u</em>,3,2013/11/26,"+
                            "99,clobbering,clobbering quibble,8,2013/11/26,"+
                            "79,reminiscebnt,reminisce<em>b</em><em>n</em>,2,2013/11/26,"+
                            "77,positivee,positive,5,2013/10/26,"+
                            "75,tedius,te<em>d</em><em>i</em><em>u</em>,3,2013/10/26,"+
                            "99,clobbeing,clobbering quibble,7,2013/10/27,"+
                            "79,reminiscebnt,reminisce<em>b</em><em>n</em>,2,2013/10/27,"+
                            "77,positive,positive,3,2013/10/27,"+
                            "75,tedius,te<em>d</em><em>i</em><em>u</em>,3,2013/10/27,"+
                            "11,clobberingg,clobbering quibble,8,2013/9/24,"+
                            "12,reminiscebnt,reminisce<em>b</em><em>n</em>,2,2013/9/24,"+
                            "13,positive,positive,4,2013/9/24,"+
                            "14,tedius,te<em>d</em><em>i</em><em>u</em>,3,2013/11/26,"+
                            "99,clobbering,clobbering quibble,8,2013/11/26,"+
                            "79,reminiscebnt,reminisce<em>b</em><em>n</em>,2,2013/12/26,"+
                            "77,positivee,positive,5,2013/10/26,"+
                            "75,tedius,te<em>d</em><em>i</em><em>u</em>,3,2013/12/26,"+
                            "99,clobbeing,clobbering quibble,7,2013/10/27,"+
                            "79,reminiscebnt,reminisce<em>b</em><em>n</em>,2,2013/12/27,"+
                            "77,positive,positive,3,2013/10/27,"+
                            "75,tedius,te<em>d</em><em>i</em><em>u</em>,3,2013/12/27"

                    var localStorageArray=testArray.split(",");


                    var timeArray=[],tmpArray=[];
                    for (var i=0 ; i<localStorageArray.length; i=i+5)  {
                        tmpArray.push( [ localStorageArray[i+1],localStorageArray[i+3],localStorageArray[i+4] ]);
                        timeArray.push( localStorageArray[i+4]);
                    }
                    var arrayWithUniqueTime=timeArray.getUnique();

                    for (var i=0 ; i<arrayWithUniqueTime.length; i++)  {

                        arrayWithFindedElements = $.grep(tmpArray, function( a ) {
                            return a[2] == arrayWithUniqueTime[i];
                        });

                        var totalErrors = 0; var totalCharacters = 0;
                        for(var ii in arrayWithFindedElements) {
                            if (typeof arrayWithFindedElements[ii][0]!=="undefined") {
                                totalCharacters=totalCharacters+parseInt(arrayWithFindedElements[ii][0].length);
                                totalErrors=totalErrors+parseInt(arrayWithFindedElements[ii][1]);
                            }
                        }
                        workingArray.push( [ arrayWithUniqueTime [i], totalCharacters, totalErrors ]);
                    }

                    //  }  //if (localStorage.answers
                }

                loadResult();

                var parsedCSV= d3.csv.parseRows(data);


                var axis_x_name=parsedCSV[0][0]
                var axis_y_name=parsedCSV[0][1]

                for (var i=1;i<parsedCSV[0].length;i++){
                    $('#label_field_choice_'+i).prop('innerHTML',parsedCSV[0][i]);
                }

                var currrent_field=1;

                parsedCSV = parsedCSV.splice(1)           //delete first row
                //var workingArray=parsedCSV.slice();     //create duplicate array


//<desc="INIT" editor-fold defaultstate="collapsed" >
//var x; var y;
                var minValue=d3.min (workingArray, function(d) { return +d[currrent_field] });
                var maxValue=d3.max (workingArray, function(d) { return +d[currrent_field] });
                var margin = {top: 5, right: 0, bottom: 100, left: 25};
                d3.chart_width=$("#chart-wrapper").width();

                //d3.chart_height=($(document).height()/1.7) - margin.top - margin.bottom;
                var pos=$("#buttom-control-bar").position();
                d3.chart_height=(pos.top/1.2) - margin.top - margin.bottom;
//            console.log("$(document).height()11>>>", d3.chart_height)
//            d3.chart_height=(d3.chart_height>300)?300:d3.chart_height;
//            console.log("$(document).height()22>>>", d3.chart_height)
                $("svg").remove();
                var svg = d3.select("#svgcontainer").append("svg")
                    .attr("id", "svg_")
                    .append("g")
                    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

                $( "#slider-range" ).slider({    //Slider reorder_array
                    orientation: "vertical",
                    min: minValue,
                    max: maxValue,
                    values: [ minValue, maxValue ],
                    range: true,
                    stop: function(event, ui) {
                        $("input#sliderMinValue").val($("#slider-range").slider("values",0));
                        $("input#sliderMaxValue").val($("#slider-range").slider("values",1));
                        threshold ();
                        // $('.bar').remove();
                        $('.y').remove();
                        $('.x_axis_text').remove();

                        draw_svg ();
                        reorder_array ();

                    },
                    slide: function(event, ui){  //Init first time
                        $("input#sliderMinValue").val($("#slider-range").slider("values",0));
                        $("input#sliderMaxValue").val($("#slider-range").slider("values",1));
                    }
                });
                $("input#sliderMinValue").val($("#slider-range").slider("values",0)); //Initialisation
                $("input#sliderMaxValue").val($("#slider-range").slider("values",1));
                $("#radio").buttonset();
                $("#radio1").prop("checked",true);
                $("#radio").change( reorder_array );
                $("#radio_field_choice_1").prop("checked",true);
                $(".radio_field_choice").change( field_choice );

                draw_svg();
//</editor-fold>

                function draw_svg () {

                    $('#slider-range').css('height', d3.chart_height+1 +'px')
                    $('#slider-range').css('left', 23 +'px')
                    $('#svg_').attr("width", d3.chart_width)
                    $('#svg_').attr("height", d3.chart_height + margin.top + margin.bottom)

                    x = d3.scale.ordinal()
                        .rangeBands([0, d3.chart_width], 0, 1);
                    x.domain(workingArray.map(function(d) { return d[0]; }));

                    y = d3.scale.linear()
                        .range([d3.chart_height, 0]);
                    y.domain([0, d3.max(workingArray, function(d) { return (+d[currrent_field]); })]);

                    var yAxis = d3.svg.axis(0)
                        .scale(y)
                        .orient("right").ticks(6);
                    ;

                    yAxis.tickFormat(function (d) { return ''; });

                    $(".axis").remove();


                    var yAxis_=svg.append("g")
                        .attr("class", "axis")
                        .attr("transform","translate(0,0)")
                        .attr("fill", "#555555")
                        .call(yAxis)
                        .append("text")
                        .attr("id", "y_axis_text")
                        .attr("transform", "rotate(-90)")
                        .attr("x", -8)
                        .attr("y", -18)
                        .attr("dy", "0.81em")
                        .style("text-anchor", "end")
                        .text(axis_y_name)

                    var colorScale = d3.scale.linear()
                        .domain([d3.min (workingArray, function(d) { return +d[currrent_field]; }), d3.max (workingArray, function(d) { return +d[currrent_field]; })])
                        .range([160, 60]);
                    /*var colorScale = d3.scale.linear()
                     .domain([0, d3.max (workingArray, function(d) { return d[currrent_field]; })])
                     .range([#F6931F, #1C94C4]);*/
                    $(".bar").remove();
                    var bar= svg.selectAll(".bar")
                            .data(workingArray)
                            .enter().append("rect")
                            .attr("class", "bar")
                            .attr("x", function(d) {return ( x(d[0])-2); })
                            .attr("width", 2)
                            .attr("fill", function(d) {return (d3.rgb(colorScale(d[currrent_field]),colorScale(d[currrent_field]),colorScale(d[currrent_field])))})
                            .attr("y", function(d) { return ( y(d[currrent_field])); })
                            .attr("height", function(d) { return (d3.chart_height - y(d[currrent_field])); })
                        ;
                    $(".bar2").remove();
                    var bar2= svg.selectAll(".bar2")
                            .data(workingArray)
                            .enter().append("rect")
                            .attr("class", "bar2")
                            .attr("x", function(d) {return ( x(d[0])+2);})
                            .attr("width", 2)
                            .attr("fill", function(d) {return (d3.rgb(255,0,0))})
                            .attr("y", function(d) { return ( y(d[currrent_field+1])); })
                            .attr("height", function(d) { return (d3.chart_height - y(d[currrent_field+1])); })
                        ;
                    $(".x_axis_text").remove();
                    svg.selectAll(".x_axis_text")
                        .data(workingArray)
                        .enter().append("text")
                        .attr("class", "x_axis_text")
                        .attr("transform", function(d) { return "translate(" + (x(d[0])+4) + ", " + (d3.chart_height+3) + " ) rotate(-90)" })
                        .attr("fill", "#545454")
                        .text(function(d) {return (d[0]); })
                    ;
                }

                function field_choice() {
                    currrent_field=$(this).prop('value');

                    minValue=d3.min (workingArray, function(d) { return +d[currrent_field] });
                    maxValue=d3.max (workingArray, function(d) { return +d[currrent_field] });


                    $( "#slider-range" ).slider({
                        min: minValue,
                        max: maxValue,
                        values: [ minValue, maxValue ]
                    })

                    draw_svg();
                    reorder_array();
                    //change label name
                    $('#y_axis_text ').text($('#label_field_choice_'+currrent_field).prop('innerHTML'));
                }

                function sortByName(i,ii){
                    if (i[0]  < ii[0])   return -1;
                    else if (i[0] > ii[0])   return 1;
                    else    return 2;
                }

                function sortByValue(i,ii) {
                    i[1]=parseInt(i[1], 10);
                    ii[1]=parseInt(ii[1], 10);
                    if (i[1] < ii[1])   return 1;
                    else if (i[1] > ii[1])   return -1;
                    else  return 2;
                }

                function threshold () {
                    workingArray.length=0;
                    var thresholdMin = $("input#sliderMinValue").val();
                    var thresholdMax = $("input#sliderMaxValue").val();
                    for (var i=0;i<parsedCSV.length;i++){
                        if ( +parsedCSV[i][currrent_field] >= thresholdMin && +parsedCSV[i][currrent_field] <= thresholdMax ) {
                            workingArray.push(parsedCSV[i]);
                        }
                    }
                }

                function reorder_array() {

                    var x0 = x.domain(workingArray.sort($("#radio2").prop('checked')
                                ? function(a, b) { return b[currrent_field] - a[currrent_field]; }
                                : function(a, b) { return d3.ascending(a[0], b[0]); })
                            .map(function(d) { return d[0]; }))
                        .copy();

                    var transition = svg.transition().duration(700),
                        delay = function(d, i) { return i * 20; }
                        ;
                    transition.selectAll(".bar")
                        .delay(delay)
                        .attr("x", function(d) { return x0(d[0]); })
                    ;
                    var transition = svg.transition().duration(0),
                        delay = function(d, i) { return 0; }
                        ;
                    transition.selectAll(".x_axis_text")
                        //.delay(delay)
                        .attr("transform", function(d) { return "translate(" + (x0(d[0])+5) + ", " + (d3.chart_height+3) + " ) rotate(-90)" })
                    ;
                }

                $(window).resize(function() {

                    clearTimeout($.data(this, 'resizeTimer'));
                    $.data(this, 'resizeTimer', setTimeout(function() {

                        d3.chart_width=$("#chart-wrapper").width();
                        var pos=$("#buttom-control-bar").position();
                        d3.chart_height=(pos.top/1.2) - margin.top - margin.bottom;
                        //d3.chart_height=$(document).height()/1.3 - margin.top - margin.bottom;

                        draw_svg();

                    }, 400));

                });

            });    //end d3 text
        } //end if

    })  //end watch


})    //end chart

app.directive("playlist", function () {
    return {
        restrict: 'E',
        replace:true,
        template:
            "<div id='playlist'>"+

                "<ul>"+
                "   <li ng-repeat='track in workingArrayWithPlaylist | orderBy:predicate:reverse'>" +
                "       <span>{{track.id}}</span><a id='track{{$index}}' ng-click='findCheckedTrack($index)'>{{track.title}}</a>" +
                "   </li> "+
                "</ul> "+

                "<br><br><div class='audio'><audio id='player' controls='controls'></audio></div>"+
                "</div>"
        ,
        link: function ( $scope, $http ) {
        }
    };
})
$( window ).ready(function() {
    recalculation ();
//   console.log("browser>>>", $.browser.webkit )
//    if((Browser.Platform.ios) || (Browser.Platform.android) && (Browser.safari)) {
//        //For iPhone and Andriod To remove Address bar when viewing website on Safari Mobile
//        // When ready...
//        window.addEventListener("load",function() {
//            // Set a timeout...
//            setTimeout(function(){
//                // Hide the address bar!
//                window.scrollTo(0, 1);
//            }, 0);
//        });
//    }
});
$(window).resize(function() {
    recalculation ();
});

function recalculation() {
    var pageWidth =($("body").width()>600) ? 600 : $("body").width();
    $(".audio-player").css("font-size", pageWidth/7.5+"px" )
    $("#current-track-name").css("font-size", pageWidth/22+"px" )

    if ($('#next-track').length > 0) { $("#next-track").css("font-size", pageWidth/28+"px" ) };

//    $("#top-control-bar").css("height", $("#top-control-bar .glyphicon").height());

    $("#playlist").css("margin-top",$(".audio-player").height()+16);

//    $(".test-page-title").css("height",$(".audio-player").height()+4);

    $(".cell select").css("height",$("#buttom-control-bar .glyphicon").height()*0.6);
};








