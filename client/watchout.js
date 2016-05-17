// global setting

var gameSetting = {
  width:770,
  height: 1000,
  nEnemies: 100,
  rEnemies: function() {return 5 + Math.random() * 10;},
  padding: 10,
  rPlayer: 50,
  keySensitivity: 0,
  rMissile : 8,
  missileSpeedByPixel : 10,
  //settings for enemy
  enemyMissileNum: 5,
  enemyTransitionDuration: 4999,
  enemyMissileTransitionDuration: 8000,
  enemyMissileFrequency: 6000
};

//gameSetting.nEnemies = prompt("Enter POSITIVE number of enemies, I said POSITIVE");
gameSetting.nEnemies = 10;

var gameScore = {
  bestScore: 0,
  now: 0,
  nCollisions: 0,
  nKilled: 0
};



// scales the range from 0 to 100 into gameboard's width and height
var convertAxes = {
  x: d3.scale.linear().domain([0, 100]).range([gameSetting.padding, gameSetting.width - gameSetting.padding]),
  y: d3.scale.linear().domain([0, 100]).range([gameSetting.padding, gameSetting.height - gameSetting.padding])
};

// create data for enemies with randomized cx, cy
// function makeEnemiesData(n) {
//   // holds json objects (for data)
//   var container = [];
//   for (var j = 0; j < n; j++) {
//     container[j] = {
//       "id": j,
//       "cx": convertAxes.x(Math.random() * 100),
//       "cy": convertAxes.y(Math.random() * 70),
//       "r": gameSetting.rEnemies()
//     };
//   }
//   return container;
// }

// creates a game board and enemies
var canvas = d3.select("#map").append("svg:svg")
              .attr("width", gameSetting.width)
              .attr("height", gameSetting.height)
              .attr('transform','translate(0,0)');



// var enemies = function(data) {
//
//   var circles = canvas.selectAll(".enemy")
//                 .data(data, function(d) { return d.id; });
//
//   circles.enter().append("circle")
//          .attr("cx", function(d) { return d.cx; })
//          .attr("cy", function(d) { return d.cy; })
//          .attr("r", function(d) { return d.r; })
//          .attr("class", "enemy collide");
//
//   circles.transition().ease("cubic-in-out").duration(gameSetting.enemyTransitionDuration)
//          .attr("cx", function(d) { return d.cx; })
//          .attr("cy", function(d) { return d.cy; });
//
// };


var makeEnemies = function() {
  this.cnt = 0;
  this.data = [];
  this.makeData = function() {
    this.data.push({
      "id": this.cnt,
      "cx": convertAxes.x(Math.random() * 100),
      "cy": convertAxes.y(Math.random() * 70),
      "r": gameSetting.rEnemies()
    });
    this.cnt++;
  };
  this.render = function() {
    var circles = canvas.selectAll(".enemy")
                  .data(this.data, function(d) { return d.id; });

    circles.enter().append("circle")
           .attr("cx", function(d) { return d.cx; })
           .attr("cy", function(d) { return d.cy; })
           .attr("r", function(d) { return d.r; })
           .attr("class", "enemy collide");

    circles.transition().ease("cubic-in-out").duration(gameSetting.enemyTransitionDuration)
           .attr("cx", function(d) { return d.cx; })
           .attr("cy", function(d) { return d.cy; });
  };
  this.collide = function(player) {
    d3.selectAll(".enemy").each(function(d, i) {
      if (collision(d3.select(this), player)) {
        this.data.splice(+d3.select(this).attr("id"), 1);
        var circles = canvas.selectAll(".enemy")
                      .data(this.data, function(d) { return d.id; })
                      .exit().remove();
      }
    });
  };
};


var enemyMissileFire = function(player) {
  var playerX = player.attr('x') + player.attr('width') / 2;
  var playerY = player.attr('y') + player.attr('height') / 2;

  var enemies = canvas.selectAll('.enemy');

  enemies.each(function(d, i) {
    var thisX = +d3.select(this).attr('cx');
    var thisY = +d3.select(this).attr('cy');

    var num = gameSetting.enemyMissileNum;
    for (var j = 0; j < num; j++) {
      var pi = Math.PI * 2 / num * j;
      // console.log('pi is', pi);
      var criteriaLine = Math.sqrt(Math.pow(gameSetting.height, 2) + Math.pow(gameSetting.width, 2));
      var missX = thisX + Math.cos(pi) * criteriaLine;
      var missY = thisY + Math.sin(pi) * criteriaLine;

      var missile = canvas.append('circle')
                    .attr("cx", thisX).attr("cy", thisY)
                    .attr("class", "enemyMissile collide")
                    .transition().duration(gameSetting.enemyMissileTransitionDuration)
                    .attr("cx", missX).attr("cy", missY).attr("r", gameSetting.rMissile);
    }

    var enemyMissile = canvas.selectAll('.enemyMissile')
                      .each(function(d, i) {
                        if (d3.select(this).attr("cx") < 0 || d3.select(this).attr("cx") > gameSetting.width || d3.select(this).attr("cy") < 0 || d3.select(this).attr("cy") > gameSetting.height) {
                          d3.select(this).remove();
                        }
                      });

  });

};



var missile = function(whose) {
  this.whose = whose;
  this.cnt = 0;
  this.list = [];
  this.data = [];
  this.set = function() {
    this.cnt += 1;
    var cx = +this.whose.attr("x") + player.attr('width') / 2;
    var cy = +this.whose.attr("y") + player.attr('height') / 2;
    // console.log('player position from missile : ', cx, cy);
    this.data.push({"id": this.cnt, "r": gameSetting.rMissile, "cx": cx, "cy": cy});
  };
  this.update = function() {
    //to add to cy and check if the missile is out of canvas and del
    for (var i = 0; i < this.data.length; i++) {
      this.data[i].cy -= gameSetting.missileSpeedByPixel;
      if (this.data[i].cy < gameSetting.padding) {
        this.data.splice(i, 1);
      }
    }
    var missiles = canvas.selectAll('.playerMissile')
                      .data(this.data, function(d) { return d.id; });


    missiles.enter().append('circle')
            .attr("cx", function(d) { return d.cx; })
            .attr("cy", function(d) { return d.cy; })
            .attr("r", function(d) { return d.r; })
            .attr("class", "playerMissile");



    missiles.attr("r", function(d) { return d.r; })
            .attr("id", function(d) { return d.id; })
            .attr("cx", function(d) { return d.cx; })
            .attr("cy", function(d) { return d.cy; });

    missiles.exit().remove();
    // console.log('data is', this.data);
  };

  // this.enterRemove = function() {
  //   for (var i = this.data.length - 1; i >= 0; i--) {
  //     this.data[i].cy -= 20;
  //     if (this.data[i].cy < 0) {
  //       this.data.splice(i, 1);
  //     }
  //   }
  //   var missiles = canvas.selectAll('.playerMissile')
  //                 .data(this.data, function(d) { return d.id; });
  //   missiles.enter().append('circle')
  //         .attr("cx", function(d) { return d.cx; })
  //         .attr("cy", function(d) { return d.cy; })
  //         .attr("r", function(d) { return d.r; })
  //         .attr("class", "playerMissile");
  //
  //
  //
  //   // missiles.attr("r", function(d) { return d.r; })
  //   //       .attr("id", function(d) { console.log("update");return d.id; })
  //   //       .attr("cx", function(d) { return d.cx; })
  //   //       .attr("cy", function(d) { return d.cy; });
  //
  //   missiles.exit().remove();
  //   // console.log('data is', this.data);
  // };
};



// helper function
  // happens when user drags the red dot
var drag = d3.behavior.drag()
    .on("drag", function(d,i) {
        d.cx += d3.event.dx;
        d.cy += d3.event.dy;
        var newCx = + d3.select(this).attr("cx") + d3.event.dx;
        var newCy = + d3.select(this).attr("cy") + d3.event.dy;

        if (d.cx < gameSetting.padding) {
          d.cx = gameSetting.padding;
          newCx = gameSetting.padding;
        } else if (d.cx > gameSetting.width - gameSetting.padding) {
          d.cx = gameSetting.width - gameSetting.padding;
          newCx = gameSetting.width - gameSetting.padding;
        }
        if (d.cy < gameSetting.padding) {
          d.cy = gameSetting.padding;
          newCy = gameSetting.padding;
        } else if (d.cy > gameSetting.height - gameSetting.padding) {
          d.cy = gameSetting.height - gameSetting.padding;
          newCy = gameSetting.height - gameSetting.padding;
        }
        // console.log(d3.event.dx + " " + d3.event.dy);
        // console.log(d.cx + " " + d.cy);
        // d3.select(this).attr("transform", function(d,i){
        //     return "translate(" + [ d.cx, d.cy ] + ")";
        // });
        d3.select(this).attr("cx", function(d) { return newCx; })
                       .attr("cy", function(d) { return newCy; });
    });



  // determines whether two circles have collided or not
  // accepts two d3 objects
function collision(circle1, circle2, option) {
  var result = false;
  // debugger;
  if (option === undefined) {
    var radiusTotal = +circle1.attr("r") + +circle2.attr("r");
    // Using Pythogorean Theorem
    // 피타고라스 정의 사용
    var distance = Math.sqrt(Math.pow(+circle1.attr("cx") - +circle2.attr("cx"), 2) + Math.pow(+circle1.attr("cy") - +circle2.attr("cy"), 2));
    // console.log(radiusTotal);
    // console.log(distance);
  } else if (option === 1) {
    var radiusTotal = +circle1.attr("r") + Math.max(+circle2.attr("width"), +circle2.attr("height")) / 2;
    // Using Pythogorean Theorem
    // 피타고라스 정의 사용
    var distance = Math.sqrt(Math.pow(+circle1.attr("cx") - +circle2.attr("x") - +circle2.attr("width") / 2, 2) + Math.pow(+circle1.attr("cy") - +circle2.attr("y") - +circle2.attr("height"), 2));
    // console.log(radiusTotal);
    // console.log(distance);
  } else if (option = 2){
    var radiusTotal = Math.max(+circle1.attr("width"), +circle1.attr("height")) / 2 + Math.max(+circle2.attr("width"), +circle2.attr("height")) / 2;
    // Using Pythogorean Theorem
    // 피타고라스 정의 사용
    var distance = Math.sqrt(Math.pow(+circle1.attr("x") + +circle1.attr("width") / 2 - +circle2.attr("x") - +circle2.attr("width") / 2, 2) + Math.pow(+circle1.attr("y") + +circle1.attr("height") - +circle2.attr("y") - +circle2.attr("height"), 2));
    // console.log(radiusTotal);
    // console.log(distance);
  }

  if (radiusTotal > distance) {
    result = [circle1.attr("id"), circle2.attr("id")];
  }
  return result;
};

// initial launch
enemies(makeEnemiesData(gameSetting.nEnemies));
// var explosion = canvas
//   .append("svg:image")
//   .attr("xlink:href", "static/explosion.gif")
//   .attr("width", r)
//   .attr("height", r)
//   .attr("x", cx - r/2)
//   .attr("y",cy - r/2);
var player = canvas.selectAll(".player")
                   .data([{"id":"player","cx":gameSetting.width/2, "cy":gameSetting.height/2, "r":gameSetting.rPlayer}])
                   .enter()
                   .append("svg:image").attr("class", "player")
                   .attr("xlink:href", "static/spaceship.png")
                   .attr("id", 1)
                   .attr("x", function(d) {
                      return gameSetting.width / 2;
                   })
                   .attr("y", function(d) {
                      return gameSetting.height / 8 * 7;
                   })
                   .attr("width", gameSetting.rPlayer)
                   .attr("height", gameSetting.rPlayer).call(drag);
                  //  .append("svg:image")
                  //  .attr("xlink:href", "static/spaceship.png")

var player2 = canvas.selectAll(".player")
                  .data([{"id":"player","cx":gameSetting.width/2, "cy":gameSetting.height/2, "r":gameSetting.rPlayer}])
                  .enter()
                  .append("circle").attr("class", "player")
                  .attr("cx", function(d) {
                     return gameSetting.width / 2;
                  })
                  .attr("cy", function(d) {
                     return gameSetting.height / 2;
                  });

var playerWeapon = new missile(player);

// for keyboard controller
  //up, down, left, right, missile
var keyState = [false, false, false, false, false];
var move = function(unit, dir) {
  // console.log('dir is : ', dir);
  // speed is key sensitivity;
  var speed = 5;
  var d = {
    "0": {x: 0, y: speed},
    "1": {x: 0, y: -speed},
    "2": {x: -speed, y: 0},
    "3": {x: speed, y: 0},
  };
  var newcx = +unit.attr('x') + player.attr('width') / 2 + d[dir].x;
  var newcy = +unit.attr('y') + player.attr('height') / 2 + d[dir].y;

  if (newcx > gameSetting.width - gameSetting.padding) {
    newcx = gameSetting.width - gameSetting.padding;
  } else if (newcx < gameSetting.padding) {
    newcx = gameSetting.padding;
  }
  if (newcy > gameSetting.height - gameSetting.padding) {
    newcy = gameSetting.height - gameSetting.padding;
  } else if (newcy <  gameSetting.padding) {
    newcy = gameSetting.padding;
  }
  // console.log("direction is set");
  unit.attr("x", function(d) { return newcx - player.attr('width') / 2; })
        .attr("y", function(d) { return newcy - player.attr('height') / 2; });
};
var keyToMove = function(keyState) {
  for (var i = 0; i < 4; i++) {
    if (keyState[i]) move(player, i);
  }

};



// check player pulled the trigger by keyState, and shoot missils & update their position

var fire = function(unit, onfire) {
  unit.update();
  //to check if player pull the trigger
  if (onfire) unit.set();
};
var keyToFire = function(keyState) {
  fire(playerWeapon, keyState[4]);
  // console.log('exe');
};




var keyboardDown = d3.select('body').on('keydown', function() {
  console.log('keydown');
  if (d3.event.keyCode == 40) {
    keyToMove(keyState);
    keyState[0] = true;
  }
  if (d3.event.keyCode == 38) {
    keyToMove(keyState);
    keyState[1] = true;
  }
  if (d3.event.keyCode == 37) {
    keyToMove(keyState);
    keyState[2] = true;
  }
  if (d3.event.keyCode == 39) {
    keyToMove(keyState);
    keyState[3] = true;
  }
  if (d3.event.keyCode == 32) {
    playerWeapon.set();
    keyState[4] = true;
  }
});

var keyboardUp = d3.select('body').on('keyup', function() {
  console.log('keyup');
  if (d3.event.keyCode == 40) {
    keyState[0] = false;
  }
  if (d3.event.keyCode == 38) {
    keyState[1] = false;
  }
  if (d3.event.keyCode == 37) {
    keyState[2] = false;
  }
  if (d3.event.keyCode == 39) {
    keyState[3] = false;
  }
  if (d3.event.keyCode == 32) {
    keyState[4] = false;
  }
});








// executes moving according to keyState
$(document).ready(function() {


  setInterval(function() {
    keyToMove(keyState);
    // keyToFire(keyState);
    playerWeapon.update();
    // playerWeapon.enterRemove();
  }, 30);

  setInterval(function() {
    if (keyState[4]) playerWeapon.set();
  }, 200);

  setInterval(function() {
    enemyMissileFire(player);
  }, gameSetting.enemyMissileFrequency);



  // randomize enemies' position again
  setInterval(function() {
    enemies(makeEnemiesData(gameSetting.nEnemies));
  }, gameSetting.enemyTransitionDuration);


  // detects collision
  var isCollidedFlag = false;

  setInterval(function() {
    var isCollide = false;
    for (var i = 0; i < d3.selectAll('.collide')[0].length; i++) {
      isCollide = collision(d3.select(d3.selectAll('.collide')[0][i]), d3.select(".player"), 1);
      if (isCollide) {
        break;
      }
    }

    if (isCollide) {
      gameScore.bestScore = Math.max(gameScore.now, gameScore.bestScore);
      gameScore.now = 0;

      if (!isCollidedFlag) {
        gameScore.nCollisions++;
        // var x = +player.attr("x");
        // var y = +player.attr("y");
        // var w = +player.attr("width");
        // var h = +player.attr("height");
        // var explosion = canvas
        //   .append("svg:image")
        //   .attr("xlink:href", "static/explosion.gif")
        //   .attr("width", w)
        //   .attr("height", h)
        //   .attr("x", x - w/2)
        //   .attr("y", y - h/2);
        // setTimeout(function() {
        //     explosion.remove();
        // }, 1000);


        d3.select("svg").attr("class", "collision");
        isCollidedFlag = true;
      }

    } else {
      d3.select("svg").classed("collision", false);
      isCollidedFlag = false;
    }
    d3.select(".high").select("span")
                          .text(gameScore.bestScore);
    d3.select(".current").select("span")
                          .text(gameScore.now);
    d3.select(".collisions").select("span")
                          .text(gameScore.nCollisions);
  }, 50);

  setInterval(function() {
    var enemy = d3.selectAll('.enemy');
    enemy.each(function(d, i) {
      var that = this;
      d3.selectAll('.playerMissile').each(function(d, i) {
        var ishit = collision(d3.select(that), d3.select(this));
        var cx = d3.select(that).attr("cx");
        var cy = d3.select(that).attr("cy");
        var r = d3.select(that).attr("r") * 6;
        if (ishit) {
          gameScore.nKilled++;
          d3.select(that).remove();
          var explosion = canvas
            .append("svg:image")
            .attr("xlink:href", "static/explosion.gif")
            .attr("width", r)
            .attr("height", r)
            .attr("x", cx - r/2)
            .attr("y",cy - r/2);
          d3.select(".killed").select("span")
                                .text(gameScore.nKilled);
          setTimeout(function() {
              explosion.remove();
          }, 1000);
        }
      });

    });
  }, 50);

  // updates the current game score
  setInterval(function() {
    gameScore.now ++;
  }, 100);

})
