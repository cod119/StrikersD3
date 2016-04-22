var gameSetting = {
  width: 700,
  height: 450,
  nEnemies: 30,
  padding: 10
};

var gameScore = {
  bestScore: 0,
  now: 0
};

convertAxes = {
  x: d3.scale.linear().domain([0, 100]).range([0, gameSetting.width]),
  y: d3.scale.linear().domain([0, 100]).range([0, gameSetting.height])
};


function enemiesData(n) {
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

d3.select('body').append('div').selectAll('p').data(enemiesData(5), function(d) {
  return d.id;
}).enter().append('p').text(function(d) {return "id: " +  d.id + " " + d.cx + " " + d.cy;});
