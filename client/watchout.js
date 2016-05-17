// global setting
var gameSetting = {
  width: 1000,
  height: 800,
  nEnemies: 100,
  rEnemies: function() {return 5 + Math.random() * 10;},
  padding: 10,
  rPlayer: 10,
  keySensitivity: 0,
  rMissile : 3,
  missileSpeedByPixel : 10,
  enemyMissileNum: 3
};

//gameSetting.nEnemies = prompt("Enter POSITIVE number of enemies, I said POSITIVE");
gameSetting.nEnemies = 10;

var gameScore = {
  bestScore: 0,
  now: 0,
  nCollisions: 0
};

// scales the range from 0 to 100 into gameboard's width and height
var convertAxes = {
  x: d3.scale.linear().domain([0, 100]).range([gameSetting.padding, gameSetting.width - gameSetting.padding]),
  y: d3.scale.linear().domain([0, 100]).range([gameSetting.padding, gameSetting.height - gameSetting.padding])
};

// create data for enemies with randomized cx, cy
function makeEnemiesData(n) {
  // holds json objects (for data)
  var container = [];
  for (var j = 0; j < n; j++) {
    container[j] = {
      "id": j,
      "cx": convertAxes.x(Math.random() * 100),
      "cy": convertAxes.y(Math.random() * 100),
      "r": gameSetting.rEnemies()
    };
  }
  return container;
}

// creates a game board and enemies
var canvas = d3.select("body").append("svg:svg")
              .attr("width", gameSetting.width)
              .attr("height", gameSetting.height);

var enemies = function(data) {

  var circles = canvas.selectAll(".enemy")
                .data(data, function(d) { return d.id; });

  circles.enter().append("circle")
         .attr("cx", function(d) { return d.cx; })
         .attr("cy", function(d) { return d.cy; })
         .attr("r", function(d) { return d.r; })
         .attr("class", "enemy");

  circles.transition().ease("cubic-in-out").duration(1500)
         .attr("cx", function(d) { return d.cx; })
         .attr("cy", function(d) { return d.cy; });

};




function enemyMissile(whose, num) {
  this.whose = whose;
  this.missileNum = num;
  this.cnt = 0;
  this.data = [];
  this.set = function() {
    this.cnt += 1;
    var cx = +this.whose.attr("cx");
    var cy = +this.whose.attr("cy");
    for (var i = 0; i < this.missileNum; i++) {
      this.data.push({
        id: this.cnt + "-" + i,
        missileOrder: this.cnt,
        identifier: i,
        r: gameSetting.rMissile,
        cx: cx,
        cy: cy
      });
    }
    var enemies = canvas.selectAll('enemyMissile')
                  .data(this.data, function(d) { return d.id; })
                  .enter().append('circle')
                  .attr("cx", function(d) { return d.cx; })
                  .attr("cy", function(d) { return d.cy; })
                  .attr("r", function(d) { return d.r; })
                  .attr("class", "enemyMissile enemy");
  };
  this.update = function() {
    var speedByPixel = 100;
    // console.log('data is', this.data);
    for (var i = 0; i < this.data.length; i++) {
      var pi = Math.PI * 2 / this.missileNum * this.data[i].identifier;
      // console.log('pi is', pi);
      this.data[i].cx += Math.cos(pi) * speedByPixel;
      this.data[i].cy += Math.sin(pi) * speedByPixel;

      console.log(Math.cos(pi), Math.sin(pi));
      if (this.data[i].cx < 0 || this.data[i].cx > gameSetting.width || this.data[i].cy < 0 || this.data[i].cy > gameSetting.height) {
        this.data.splice(i, 1);
      }
    }

    var enemies = this.whose
                  .data(this.data, function(d) { return d.id; });

    enemies.attr("cx", function(d) { return d.cx; })
          .attr("cy", function(d) { return d.cy; });

    enemies.exit().remove();
  };
}



var enemyMissileAttach = function() {

  var enemyMissiles = [];
  // console.log(canvas.selectAll('.enemy'));
  var enemies = canvas.selectAll('.enemy')
                .each(function(d, i) {
                  // console.log('hrer');
                  // console.log(d3.select(this));
                  enemyMissiles.push(new enemyMissile(d3.select(this), gameSetting.enemyMissileNum));
                });
  var set = function() {
    // console.log('here');
    // console.log(enemyMissiles);
    for (var j = 0; j < enemyMissiles.length; j++) {

      enemyMissiles[j].set();
    }
  };
  var update = function() {
    for (var k = 0; k < enemyMissiles.length; k++) {
      console.log('k ', enemyMissiles[k]);
      enemyMissiles[k].update();
    }
  };

  return {
    set: set,
    update: update
  };
};








var missile = function(whose) {
  this.whose = whose;
  this.cnt = 0;
  this.list = [];
  this.data = [];
  this.set = function() {
    this.cnt += 1;
    var cx = +this.whose.attr("cx");
    var cy = +this.whose.attr("cy");
    console.log('player position from missile : ', cx, cy);
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
            .attr("id", function(d) { console.log("update");return d.id; })
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
var collision = function(circle1, circle2) {
  var result = false;
  // debugger;
  var radiusTotal = +circle1.attr("r") + +circle2.attr("r");
  // Using Pythogorean Theorem
  // 피타고라스 정의 사용
  var distance = Math.sqrt(Math.pow(+circle1.attr("cx") - +circle2.attr("cx"), 2) + Math.pow(+circle1.attr("cy") - +circle2.attr("cy"), 2));
  // console.log(radiusTotal);
  // console.log(distance);
  if (radiusTotal > distance) {
    result = true;
  }
  return result;
};

// initial launch
enemies(makeEnemiesData(gameSetting.nEnemies));

var player = canvas.selectAll(".player")
                   .data([{"id":"player","cx":gameSetting.width/2, "cy":gameSetting.height/2, "r":gameSetting.rPlayer}])
                   .enter()
                   .append("circle").attr("class", "player")
                   .attr("cx", function(d) {
                      return gameSetting.width / 2;
                   })
                   .attr("cy", function(d) {
                      return gameSetting.height / 2;
                   })
                   .attr("r", gameSetting.rPlayer).call(drag);

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
  var newcx = +unit.attr('cx') + d[dir].x;
  var newcy = +unit.attr('cy') + d[dir].y;

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
  unit.attr("cx", function(d) { return newcx; })
        .attr("cy", function(d) { return newcy; });
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
  console.log('exe');
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
  var fireEnemyMissile = enemyMissileAttach();

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
    fireEnemyMissile.set();
    fireEnemyMissile.update();
  }, 2000);



  // randomize enemies' position again
  setInterval(function() {
    enemies(makeEnemiesData(gameSetting.nEnemies));
  }, 1500);


  // detects collision
  var isCollidedFlag = false;

  setInterval(function() {
    var isCollide = false;
    for (var i = 0; i < d3.selectAll('.enemy')[0].length; i++) {
      isCollide = collision(d3.select(".player"), d3.select(d3.selectAll('.enemy')[0][i]));
      if (isCollide) {
        break;
      }
    }

    if (isCollide) {
      gameScore.bestScore = Math.max(gameScore.now, gameScore.bestScore);
      gameScore.now = 0;

      if (!isCollidedFlag) {
        gameScore.nCollisions++;
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

  // updates the current game score
  setInterval(function() {
    gameScore.now ++;
  }, 100);

})
