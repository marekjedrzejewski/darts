(function() {
  var startpoints = 501;
  var dartsperturn = 3;
  var doublein = true;
  var doubleout = true;

  var players = [ ];

  var winner = -1;

  var dart = angular.module('dart', []);

  dart.controller('settings', function($scope) {
    $scope.start_game = function() {
      doublein = $scope.doublein;
      doubleout = $scope.doubleout;
      players.push( {
                      name: 1,
                      points_left: startpoints,
                      darts_left: dartsperturn
                    });
      for (var i = 1; i < $scope.players; i++) {
        players.push({
                      name: i+1,
                      points_left: startpoints,
                      darts_left: 0
                    });
      }
    };
  });

  dart.controller('score_table', function($scope){
    $scope.get_players = function() {
      return players;
    };
    // will represent which player turn is it
    $scope.current = 0;


    this.darthit = function(points, type) {
      players[$scope.current].darts_left -= 1;
      // starting block
      if ( players[$scope.current].points_left === startpoints ) {
        if (doublein) {
          if (type === 'mult2' || type === 'bullseye')
            players[$scope.current].points_left -= points;
        }
        else { // if doublein is not enabled no need for checking type
          players[$scope.current].points_left -= points;
        }
      }

      // midgame & ending block
      else {
        // OMG THIS BLOCK. DISGUSTING.
        if (players[$scope.current].points_left - points <= 1) {
          if(doubleout) {
            if (players[$scope.current].points_left - points === 0) {
              if (type === 'mult2' || type === 'bullseye') {
                players[$scope.current].points_left -= points;
                // Player won
                winner = $scope.current + 1;
              }
              else { // Points reach 0, but shot is not double
                players[$scope.current].darts_left = 0;
              }
            }
            else { // points below zero
              players[$scope.current].darts_left = 0;
            }
          }
          else {
            if (players[$scope.current].points_left - points === 0) {
              players[$scope.current].points_left -= points;
              // Player won
              winner = $scope.current + 1;
            }
            else if (players[$scope.current].points_left - points === 1) {
              players[$scope.current].points_left -= points;
            }
            else {
              players[$scope.current].darts_left = 0;
            }
          }
        // midgame
        }
        else {
          players[$scope.current].points_left -= points;
        }
      }


      if (players[$scope.current].darts_left === 0) {
        $scope.current++;
        if ($scope.current === players.length) {
          $scope.current = 0;
        }
        players[$scope.current].darts_left = dartsperturn;
      }

      $scope.$apply(); // html need to be refreshed, because function is called
                       // from separate JS file in a somewhat hacky way.
    };

  });

  dart.controller('game_controller', function($scope) {
    $scope.get_winner = function() {
      return winner;
    };
  });

})();
