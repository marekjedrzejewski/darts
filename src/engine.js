(function() {
  var startpoints = 501;
  var dartsperturn = 3;
  var doublein = true;
  var doubleout = true;

  var players = [
    {
      name: 1,
      points_left: startpoints,
      darts_left: dartsperturn
    },
    {
      name: 2,
      points_left: startpoints,
      darts_left: dartsperturn
    }
  ];

  var dart = angular.module('dart', []);
  dart.controller('scoretable', function($scope){
    this.players = players;
    // will represent which player turn is it
    this.current = 0;


    this.darthit = function(points, type) {
      this.players[this.current].darts_left -= 1;
      // starting block
      if ( this.players[this.current].points_left === startpoints ) {
        if (doublein) {
          if (type === 'mult2' || type === 'bullseye')
            this.players[this.current].points_left -= points;
        }
        else { // if doublein is not enabled no need for checking type
          this.players[this.current].points_left -= points;
        }
      }

      // midgame & ending block
      else {
        // OMG THIS BLOCK. DISGUSTING.
        if (this.players[this.current].points_left - points <= 1) {
          if(doubleout) {
            if (this.players[this.current].points_left - points === 0) {
              if (type === 'mult2' || type === 'bullseye') {
                this.players[this.current].points_left -= points;
                // Player won
              }
              else { // Points reach 0, but shot is not double
                this.players[this.current].darts_left = 0;
              }
            }
            else { // points below zero
              this.players[this.current].darts_left = 0;
            }
          }
          else {
            if (this.players[this.current].points_left - points === 0) {
              this.players[this.current].points_left -= points;
              // Player won
            }
            else if (this.players[this.current].points_left - points === 1) {
              this.players[this.current].points_left -= points;
            }
            else {
              this.players[this.current].darts_left = 0;
            }
          }
        // midgame
        }
        else {
          this.players[this.current].points_left -= points;
        }
      }


      if (this.players[this.current].darts_left === 0) {
        this.current++;
        if (this.current === this.players.length) {
          this.current = 0;
        }
        this.players[this.current].darts_left = dartsperturn;
      }

      $scope.$apply(); // html need to be refreshed
    };

  });
})();
