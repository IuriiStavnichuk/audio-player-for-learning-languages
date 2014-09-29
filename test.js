app.controller ("TestCtrl", function ($scope, $rootScope) {
})

app.directive("test", function ($rootScope, $sce) {
    return {
        restrict: 'E',
        replace:true,
        template:
            " <div class='test' ng-show='showTestPage'>" +
                "<div class='test-page-title'>"+
                    "<div class='mode'>test mode<a ng-click='showTestPage=0;showMatte=0;topControlBarVisibility=1;trustedResultForShow=\"\";timeDelayBetweenTracks=1;timeDelayBetweenRepetitions=0.5;' class='glyphicon glyphicon-remove right'></a></div>"+

                    "<div class='info' ng-show='testInfoShow' ng-init='testInfoShow=1'>click on track below to start the test</div>"+
                //"<div class='info' ng-show='testInfoShow' ng-init='testInfoShow=1'><span class='glyphicon glyphicon-info-sign'></span> click on track below to start the test</div>"+
                "</div>"+

                "<div class='submit-form' ng-show='testSubmitFormShow' ng-init='testSubmitFormShow=0'>"+
                "   <input type='text'  ng-model='answer' placeholder='type your answer'>"+
                "   <a class='button right' ng-click='loadResult();testResultFrame=1' style='color:#fff'>Result</a>"+
                "   <a class='next right' ng-click='answerSave();'>Next</a>"+
//              "   <a ng-click='clearLocalStorage()' style='color:#555'>Reset</a> "+
                "</div>"+
                "<div class='answer'>"+
                     "<div ng-bind-html='trustedResultForShow'>__</div> "+
                "</div>"+
             "</div> "
        ,
        link: function ( $scope, $http ) {

            $scope.init=function() {
                $scope.currentIndex=-5;
                $scope.answer="";
                $scope.resultForSaving="";
                $scope.trustedTestResult="";
                $scope.answersArray=[];
                $scope.numberOfErrors=0;
            }

            $scope.init();

            $scope.answerSave=function() {

                $(".submit-form input[type='text']").val("");


                $scope.resultForSaving= $scope.comparison ($rootScope.nextElement.innerHTML, $scope.answer) ;
                $scope.resultForShow="<span>Your answer: </span>"+$scope.resultForSaving +"<hr><span>Right answer: </span>"+$rootScope.nextElement.innerHTML+"<hr><span>Numbers of errors: </span>"+$scope.numberOfErrors;

                $scope.trustedResultForShow = $sce.trustAsHtml($scope.resultForShow);

                if ( localStorage.answers === undefined )
                {$scope.currentIndex= $scope.currentIndex+5;}
                else
                {
                    $scope.answersArray=localStorage.answers.split(",");
                    $scope.currentIndex=localStorage.answers.split(",").length;
                }
                

                $scope.answersArray[$scope.currentIndex]=$scope.workingArrayWithPlaylist[$rootScope.id].id ;      //track id
                $scope.answersArray[$scope.currentIndex+1]=$rootScope.nextElement.innerHTML;
                $scope.answersArray[$scope.currentIndex+2]=$scope.resultForSaving;
                $scope.answersArray[$scope.currentIndex+3]=$scope.numberOfErrors;
                var d = new Date();
                var year = d.getFullYear();
                var month = ("0" + (d.getMonth() + 1)).slice(-2);
                var day = ("0" + d.getDate()).slice(-2)
                var time = year+"/"+month+"/"+day;

                $scope.answersArray[$scope.currentIndex+4]=time;

                localStorage.answers=$scope.answersArray;

                // $scope.playNextWidthDelay();
                $rootScope.id+=2;
                $scope.playTrack($rootScope.id)
            }

            $scope.clearLocalStorage=function() {
                var r = confirm("Are you sure that you wnat to remove test results?");
                if (r == true)
                {
                    $scope.currentIndex=-5;
                    $scope.answersArray.length=0;
                    localStorage.clear();
                }
                else
                {
                }

            }

            $scope.comparison=function(original, answer) {
                var resultForSaving="";var tmp =""; $scope.numberOfErrors =0;
                for (var i in original)  {

                    if (answer[i]===undefined){
                        answer=answer+"X";
                    }
                    if( original[i] === answer [i] ) {tmp = original[i]  }
                    else {tmp ="<em>"+answer[i]+"</em>";$scope.numberOfErrors ++}
                    resultForSaving=resultForSaving + tmp  ;
                    resultForSaving = resultForSaving.replace(',','');
                }

                return resultForSaving;
            }
            $scope.loadResult=function() {

                $scope.removeTestResultButtonShow=1;

                $scope.testResult="<div id='removeTestResultButton' ng-click=testResultFrame=0;removeTestResultButtonShow=0 class='glyphicon glyphicon-remove right'></div>";

                if (localStorage.answers!==undefined) {
                    var localStorageArray=localStorage.answers.split(",");

                    $scope.testResult= $scope.testResult+"<h4>Your result:</h4><br>";

                    for (var i=0 ; i<localStorageArray.length; i=i+5)  {

                        $scope.testResult= $scope.testResult +"<strong>"+ localStorageArray[i]+"</strong>   /   <span>"+ localStorageArray[i+3]+" ERROR </span><br>";
                        $scope.testResult= $scope.testResult + localStorageArray[i+1]+"<br>";
                        $scope.testResult= $scope.testResult + localStorageArray[i+2]+"<hr>";

                    }
                    //$scope.testResult= $scope.testResult+"</div>";
                    $scope.trustedTestResult = $sce.trustAsHtml($scope.testResult);
                }  else {
                    $scope.testResult= $scope.testResult+"<br><br><h4>Unfortunately you do not have the test results because you didn't try to pass the test. Please try to do it</h4>";
                    $scope.trustedTestResult = $sce.trustAsHtml($scope.testResult);
                }

            }
        }
    };
})









