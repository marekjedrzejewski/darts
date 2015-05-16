(function() {
  var pointsvariant = 501;
  var dartsperturn = 3;
  var doublein = true;
  var doubleout = true;

  var dart = angular.module('dart', []);
  dart.controller('scoretable', function($scope){
    // game preferences
    this.doublein = doublein;
    this.doubleout = doubleout;
    this.startpoints = pointsvariant;

    // this will go to player
    this.points_left = this.startpoints;
    this.darts_left = dartsperturn;


    this.darthit = function(points, type) {
      // starting block
      if ( this.points_left === this.startpoints ) {
        if (doublein) {
          if (type === 'mult2' || type === 'bullseye')
            this.points_left -= points;
        }
        else { // if doublein is not enabled no need for checking type
          this.points_left -= points;
        }
      }

      // midgame & ending block
      else {
        // TODO ending 
        if (doubleout) {
          if (this.points_left - points <= 1) {
            return;
          }
        }
        else {
          if (this.points_left - points < 0) {
            return;
          }
        }
        // midgame
        this.points_left -= points;
      }


      this.darts_left -= 1;

      $scope.$apply(); // html need to be refreshed
    };

  });
})();
