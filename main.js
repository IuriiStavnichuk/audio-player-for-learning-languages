var app=angular.module("myApp", [])
app.run(function($rootScope) {
    $rootScope.id='';
    $rootScope.nextElement='';
})

app.controller ("AppCtrl", function ($scope, $rootScope, $http, $sce) {

$scope.workingArrayWithPlaylist=[];

    var timers = [];var timersForCheck = [];

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

           var first=$scope.sourceArrayWithPlaylist.length;
           var realFirst=$scope.sourceArrayWithPlaylist.length-first;

           for (var i= realFirst,j=0; i<realFirst+100; i=i+1) {
                $scope.workingArrayWithPlaylist[j++]=$scope.sourceArrayWithPlaylist[i];
           }
           $scope.loadingIndicatorVisible=0;
        });

        $scope._player.pause();
        $scope._player.src = "";
        timers.length=0;
        $rootScope.id=0;
        window.clearTimeout(timersForCheck);
        document.getElementById("current-track").innerHTML="click on track below";
    });

    $scope.$watch('firstRecord', function ( newValue, oldValue, $scope ) {

        if ( newValue!=oldValue)   {

                $scope.realFirstRecord= ($scope.sourceArrayWithPlaylist.length-$scope.firstRecord)<0 ? 0 : $scope.sourceArrayWithPlaylist.length-$scope.firstRecord;
                $scope.workingArrayWithPlaylist =$scope.sourceArrayWithPlaylist.splice( $scope.realFirstRecord, 200);
        }

    });

    $scope._player = document.getElementById('player');
    $scope._playlist = document.getElementById('playlist');
    $scope._play = document.getElementById('play');
    $scope._prev = document.getElementById('prev');
    $scope._next = document.getElementById('next');

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

        $scope._player.pause();
        $scope._player.src = "";

        timers.length=0;

        if (id === null || id === undefined || id === '') {id = 0;}

        $(".glyphicon.glyphicon-play").toggleClass('glyphicon-play glyphicon-pause');

        $rootScope.id= ( document.getElementById ( "track"+id) ||'' ) ? id : 0 ;

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

    }

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
        }


        if (trackId % 2 == 1) {$scope.indexInCycle=0; $scope.currentNumberOfRepetitions=2;}   //if odd -finish loop
        else {$scope.indexInCycle=1; $scope.currentNumberOfRepetitions=1;}

        $scope.playTrack(trackId);
    }

    $scope.selectDeselectAllCheckers= function () {
        for (var index in $scope.workingArrayWithPlaylist) {
            $scope.workingArrayWithPlaylist[index].checked = !$scope.workingArrayWithPlaylist[index].checked;
        }
    }

    $scope._player.addEventListener("ended", $scope.playNextWidthDelay);

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
                var minValue=d3.min (workingArray, function(d) { return +d[currrent_field] });
                var maxValue=d3.max (workingArray, function(d) { return +d[currrent_field] });
                var margin = {top: 5, right: 0, bottom: 100, left: 25};
                d3.chart_width=$("#chart-wrapper").width();

                var pos=$("#buttom-control-bar").position();
                d3.chart_height=(pos.top/1.2) - margin.top - margin.bottom;
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
                        .attr("transform", function(d) { return "translate(" + (x0(d[0])+5) + ", " + (d3.chart_height+3) + " ) rotate(-90)" })
                    ;
                }

                $(window).resize(function() {

                    clearTimeout($.data(this, 'resizeTimer'));
                    $.data(this, 'resizeTimer', setTimeout(function() {

                        d3.chart_width=$("#chart-wrapper").width();
                        var pos=$("#buttom-control-bar").position();
                        d3.chart_height=(pos.top/1.2) - margin.top - margin.bottom;

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
});
$(window).resize(function() {
    recalculation ();
});

function recalculation() {
    var pageWidth =($("body").width()>600) ? 600 : $("body").width();
    $(".audio-player").css("font-size", pageWidth/7.5+"px" )
    $("#current-track-name").css("font-size", pageWidth/22+"px" )

    if ($('#next-track').length > 0) { $("#next-track").css("font-size", pageWidth/28+"px" ) };

    $("#playlist").css("margin-top",$(".audio-player").height()+16);

    $(".cell select").css("height",$("#buttom-control-bar .glyphicon").height()*0.6);
};








