var gameSetting = {
  width: 700,
  height: 450,
  nEnemies: 30,
  rEnemies: 3,
  padding: 10
};

var gameScore = {
  bestScore: 0,
  now: 0
};

var convertAxes = {
  x: d3.scale.linear().domain([0, 100]).range([0, gameSetting.width]),
  y: d3.scale.linear().domain([0, 100]).range([0, gameSetting.height])
};


function makeEnemiesData(n) {
  // holds json objects (for data)
  var container = [];
  for (var j = 0; j < n; j++) {
    container[j] = {
      "id": j,
      "cx": convertAxes.x(Math.random() * 100),
      "cy": convertAxes.y(Math.random() * 100)
    };
  }
  return container;
}






var canvas = d3.select("body").append("svg:svg")
              .attr("width", gameSetting.width)
              .attr("height", gameSetting.height);

var enemies = function(data) {
  var circles = canvas.selectAll("circle")
                .data(data, function(d) { return d.id; });

  circles.enter().append("circle")
                  .attr("cx", function(d) { return d.cx; })
                  .attr("cy", function(d) { return d.cy; })
                  .attr("r", gameSetting.rEnemies);

  circles.transition().duration(2000).attr("cx", function(d) { return d.cx; })
                                      .attr("cy", function(d) { return d.cy; });

};

enemies(makeEnemiesData(gameSetting.nEnemies));

setInterval(function() {
  enemies(makeEnemiesData(gameSetting.nEnemies));
}, 1500);

setInterval(function() {
  gameScore.now ++;
  d3.select(".current").select("span")
                        .text(gameScore.now);
}, 100);
