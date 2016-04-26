// global setting
var gameSetting = {
  width: 1000,
  height: 800,
  nEnemies: 100,
  rEnemies: function() {return 5 + Math.random() * 10;},
  padding: 10,
  rPlayer: 10
};

gameSetting.nEnemies = prompt("Enter POSITIVE number of enemies, I said POSITIVE");

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
  console.log(radiusTotal);
  console.log(distance);
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
