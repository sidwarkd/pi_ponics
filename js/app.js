'use strict';

$(function () {
  $('#temp-chart').highcharts({
      chart: {
          type: 'spline'
      },
      title: {
          text: 'Past 24 Hours'
      },
      xAxis: {
          type: 'datetime',
          labels: {
              overflow: 'justify'
          },
          dateTimeLabelFormats: {
            millisecond: '%H:%M:%S.%L',
            second: '%H:%M:%S',
            minute: '%H:%M %P',
            hour: '%l %P',
            day: '%e. %b',
            week: '%e. %b',
            month: '%b \'%y',
            year: '%Y'
          }
      },
      yAxis: {
          title: {
              text: '°F'
          },
          min: 50,
          minorGridLineWidth: 0,
          gridLineWidth: 0,
          alternateGridColor: null,
          plotBands: [{ // Light air
              from: 50,
              to: 60,
              color: 'rgba(68, 170, 213, 0.1)',
              label: {
                  text: 'System Collapse',
                  style: {
                      color: '#606060'
                  }
              }
          }, { // Light breeze
              from: 60,
              to: 68,
              color: 'rgba(0, 0, 0, 0)',
              label: {
                  text: 'Too Cold',
                  style: {
                      color: '#606060'
                  }
              }
          }, { // Gentle breeze
              from: 68,
              to: 78,
              color: 'rgba(68, 170, 213, 0.1)',
              label: {
                  text: 'Nominal',
                  style: {
                      color: '#606060'
                  }
              }
          }, { // Moderate breeze
              from: 78,
              to: 88,
              color: 'rgba(0, 0, 0, 0)',
              label: {
                  text: 'Too Hot',
                  style: {
                      color: '#606060'
                  }
              }
          }, { // Fresh breeze
              from: 88,
              to: 100,
              color: 'rgba(68, 170, 213, 0.1)',
              label: {
                  text: 'System Overheat',
                  style: {
                      color: '#606060'
                  }
              }
          }]
      },
      tooltip: {
          valueSuffix: ' °F',
          dateTimeLabelFormats: {
            millisecond: '%H:%M:%S.%L',
            second: '%H:%M:%S',
            minute: '%H:%M %P',
            hour: '%l:%M %P',
            day: '%e. %b',
            week: '%e. %b',
            month: '%b \'%y',
            year: '%Y'
          }
      },
      plotOptions: {
          spline: {
              lineWidth: 4,
              states: {
                  hover: {
                      lineWidth: 5
                  }
              },
              marker: {
                  enabled: false
              },
              pointInterval: 1800000, // one hour
              pointStart: Date.UTC(2014, 1, 14, 8, 0, 0)
          }
      },
      series: [{
          name: 'Tank Water',
          data: [74.3, 75.1, 74.3, 75.2, 75.4, 74.7, 73.5, 74.1, 75.6, 77.4, 76.9, 77.1,
              77.9, 77.9, 77.5, 76.7, 77.7, 77.7, 77.4, 77.0, 77.1, 75.8, 75.9, 77.4,
              78.2, 78.5, 79.4, 78.1, 80.9, 80.4, 80.9, 82.4, 82.1, 79.5, 77.5,
              77.1, 77.5, 78.1, 76.8, 73.4, 72.1, 71.9, 71.6, 71.0, 70.2]

      }, {
          name: 'Grow Bed',
          data: [70.0, 70.0, 70.0, 70.0, 70.0, 70.0, 70.0, 70.0, 70.1, 70.0, 70.3, 70.0,
              70.0, 70.4, 70.0, 70.1, 70.0, 70.0, 70.0, 70.0, 70.0, 70.0, 70.0, 70.0,
              70.0, 70.6, 71.2, 71.7, 70.7, 72.9, 74.1, 72.6, 73.7, 73.9, 71.7, 72.3,
              73.0, 73.3, 74.8, 75.0, 74.8, 75.0, 74.8, 74.7, 74.6]
      }]
      ,
      navigation: {
          menuItemStyle: {
              fontSize: '10px'
          }
      }
  });

});

var app = angular.module('AquaApp', [
  'ngRoute'
]);


var appCtrl = app.controller('AppCtrl', ["$scope", "$http", function($scope, $http) {
  $scope.pumpState = 1;
  $scope.offClass="btn-info";
  $scope.onClass="btn-default";
  $scope.temp = 0.0;

  $scope.toggleState = function(){
    $scope.pumpState ^= 1;
    if($scope.pumpState === 0){
      $scope.onClass="btn-info";
      $scope.offClass="btn-default";
    }
    else{
      $scope.offClass="btn-info";
      $scope.onClass="btn-default";
    }
  };

  $scope.SetLED = function(state){
    if(state !== $scope.pumpState){
      $http.post('/led', {state:state}).
        success(function(data, status, headers, config){
          $scope.toggleState();
        }).
        error(function(data, status, headers, config){
          alert("Unable to change the state");
        });
    }
  };

  $scope.getTemp = function(){
    $http.get('/temp').
      success(function(data, status, headers, config){
        $scope.temp = data.temp;
      }).
      error(function(data, status, headers, config){
        alert("Unable to change the state");
      });
  };


}]);