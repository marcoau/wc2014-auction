angular.module('auction', ['ui.router'])
.constant('appConfig', {
  host: 'http://127.0.0.1:8888'
})
.config(['$stateProvider', '$urlRouterProvider', function($stateProvider, $urlRouterProvider){
  $urlRouterProvider.otherwise('/login');

  $stateProvider
    .state('login', {
      url: '/login',
      templateUrl: 'partials/login.html',
      controller: 'LoginCtrl'
    })
    .state('auction', {
      url: '/auction',
      templateUrl: 'partials/auction.html'
      // controller: 'AuctionCtrl'
    })
    .state('error', {
      url: '/error',
      templateUrl: 'partials/error.html'
    });
}])
.controller('LoginCtrl', ['$rootScope', '$scope', '$state', 'appConfig', function($rootScope, $scope, $state, appConfig){

  // $rootScope.Socket = io.connect('http://localhost');
  // $rootScope.Socket.on('news', function (data) {
  //   console.log(data);
  //   $rootScope.Socket.emit('my other event', { my: 'data' });
  // });

  // $scope.doLogin = function(){
  //   console.log('doLogin');
  //   $state.transitionTo('auction');
  //   $rootScope.Socket.on('serverLoadBids', function(data){
  //     $rootScope.$apply(function(){
  //       $rootScope.bids = data.bids;        
  //     })
  //     console.log($scope.bids);
  //   });
  //   $rootScope.Socket.emit('userLogin', {name: $scope.name});
  // }

  // console.log('hello');
  // $scope.doLogin = function(){
  //   console.log('doLogin');
  //   // $rootScope.socket = io(appConfig.host);
  // };

}])

.controller('AuctionCtrl', ['$scope', '$state', function($scope, $state){
  
  $scope.init = function(){
    console.log('load AuctionCtrl');
    $scope.loggedIn = false;
    // $rootScope.Socket.emit('userLoadBids');
  };

  $scope.login = function(){
    $scope.Socket = io.connect('http://localhost');
    $scope.Socket.emit('userLogin', {name: $scope.newPlayerName});
    $scope.loggedIn = true;
    $scope.socketInit();
  };

  $scope.doKeyLogin = function($event){
    console.log($event.keyCode);
    if($event.keyCode === 13){
      $scope.login();
    }
  };

  $scope.doClickLogin = function(){
    $scope.login();
  };

  $scope.socketInit = function(){

    console.log($scope.loggedIn);

    //Loading Bids
    $scope.Socket.on('serverLoadBids', function(data){
      $scope.$apply(function(){
        $scope.bids = data.bids;
      });
      // console.log($scope.bids);
    });
    $scope.Socket.emit('userLoadBids');

    $scope.doStandardBid = function(team){
      console.log('doStandardBid');
      $scope.Socket.emit('userStandardBid', {team: team});
    };

    $scope.doBigBid = function(team, bigBidTo){
      // console.log(bigBidTo);
      var toAmount = Number(bigBidTo);
      console.log(team);
      console.log($scope.bids);
      var currentBid = $scope.bids[team].currentBid;
      console.log(currentBid);
      console.log(toAmount - currentBid);
      if(toAmount){
        if(currentBid < 1000 && toAmount - currentBid < 50 ||
          currentBid >= 1000 && toAmount - currentBid < 100){
          alert('Your bid must be bigger than the standard Bid');
        }else{
          //bet accepted
          $scope.Socket.emit('userBigBid', {team: team, toAmount: toAmount});
        }
      }else{
        alert('Invalid amount');
      }
    };

    $scope.doLogout = function(){
      console.log('doLogout');
      $scope.Socket.disconnect();
      $scope.Socket = undefined;
      $scope.newPlayerName = undefined;
      $scope.loggedIn = false;        
    };
  };


}]);
