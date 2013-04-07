(function(){
  'use strict';
  console.log('App running');

  // Functions
  var drawAxis = function(paper) {
    var vPath = 'M' + Math.floor(paper.width/2) + ',' + '0' + 'L' + Math.floor(paper.width/2) + ',' + paper.height + 'z';
    var hPath = 'M' + '0' + ',' +  Math.floor(paper.height/2) + 'L' + paper.width + ',' + Math.floor(paper.height/2) + 'z';
    var line = paper.path(vPath);
    line.attr("stroke", "#aaa");
    line = paper.path(hPath);
    line.attr("stroke", "#aaa");
  }; 
  var SineMaker = function(f, a) {
    f = f || 1;
    a = a || 1;
    return function(t) {
      return a * Math.sin(t*f*2*Math.PI);
    }
  }
  var SawtoothMaker = function(f, a) {
    f = f || 1;
    a = a || 1;
    return function(t) {
      return a * 2 * (f*t - Math.floor(f*t) - .5) 
    }
  }
  var TriangleMaker = function(f, a) {
    f = f || 1;
    a = a || 1;
    return function(t) {
      t = t - .25;
      return a * ((2 * Math.abs(2 * (f*t - Math.floor(f*t +.5)))) - 1);
    }
  }

  var drawNGon = function(paper, n, o) {
    if (n < 3)
      return;

    var vertices = [];
    var angle = 2*Math.PI/n;
    var x;
    var y;

    for (var i=0;i<n;i++) {
      x = Math.cos(i*angle);  
      y = Math.sin(i*angle);  
      vertices.push([x,y]);
    }

    var r = paper.width/o.spScale;
    var pathString = 'M'+ (o.spCenter[0]+(vertices[n-1][0]*r)) + ',' + (o.spCenter[1]+(vertices[n-1][1]*r));
    for (var i=0;i<n;i++) {
      pathString += 'L'+ (o.spCenter[0]+(vertices[i][0]*r)) + ',' + (o.spCenter[1]+(vertices[i][1]*r));
    }
    var shape = paper.path(pathString + 'z');
    shape.attr('stroke', 'blue');
    shape.attr('stroke-width', 2);
    return shape;
  }

  var shapeToWave = function(shapePaper, wavePaper, shape, samples, o) {
    var periodLength = wavePaper.width/o.wpXScale;
    var yUnit = wavePaper.height/o.wpYScale;
    var rUnit = shapePaper.height/o.spScale;
    
    var t = 0;
    var th = 0;
    var getY = function(th) {
      var ps = "M" + o.wpCenter[0] + "," + o.wpCenter[1] + "l" + (2*rUnit*Math.cos(th)) + "," + (-2*rUnit*Math.sin(th));
      var tempPath = shapePaper.path(ps);
      var intersection = Raphael.pathIntersection(shape.getSubpath().end, tempPath.getSubpath().end);
      tempPath.remove();
      if (intersection.length) {
        return intersection[0]['y'];
      }
      return -1;

    };

    var waveString = "M" + o.wpCenter[0] + "," + o.wpCenter[1];
    for (var i=0; i<=samples; i++) {
      t = i/samples;
      th = t*2*Math.PI
      var y = getY(th);
      if (y<0)
        continue;
      waveString += "L" + (i*(periodLength/samples)+o.wpCenter[0]) + "," + y; 
    }
    var wave = wavePaper.path(waveString);
    wave.attr("stroke", "blue");
    wave.attr("stroke-width", "2");
  }

  var drawCurve = function(waveFunction, samples, wavePaper, shapePaper, o) {
    var periodLength = wavePaper.width/o.wpXScale;
    var yUnit = wavePaper.height/o.wpYScale;
    var rUnit = shapePaper.height/o.spScale;
    
    var t = 0;
    var th = 0;
    var waveString = "M" + o.wpCenter[0] + "," + o.wpCenter[1];
    var shapeString = "M" + (o.spCenter[0]+rUnit) + "," + o.spCenter[1];

    for (var i=0; i<=samples; i++) {
      t = i/samples;
      th = t*2*Math.PI
      var shapeX = rUnit * Math.cos(th);
      var y = waveFunction(t);
      waveString += "L" + (i*(periodLength/samples)+o.wpCenter[0]) + "," + (-y*yUnit+o.wpCenter[1]); 
      shapeString += "L" + (o.spCenter[0]+shapeX) + "," + (o.spCenter[1]-rUnit*y);
    }
    var wave = wavePaper.path(waveString);
    var shape = shapePaper.path(shapeString);
    wave.attr("stroke", "blue");
    wave.attr("stroke-width", "2");
    shape.attr("stroke", "blue");
    shape.attr("stroke-width", "2");
  }

  // Constants
  var setup = {
    spWidth: 300,
    spHeight: 300, // Should be a square for now
    spCenter: false,
    spScale: 4,
    wpWidth: 300,
    wpHeight: 300,
    wpCenter: false,
    wpXScale: 2,
    wpYScale: 4,
  }
  setup.spCenter = [Math.floor(setup.spWidth/2), Math.floor(setup.spHeight/2)];
  setup.wpCenter = [Math.floor(setup.wpWidth/2), Math.floor(setup.wpHeight/2)];
  
  // Set up Raphael instances
  var shapePaper = Raphael(document.getElementById('shapeCanvas'), setup.spWidth, setup.spHeight);
  var wavePaper = Raphael(document.getElementById('waveCanvas'), setup.wpWidth, setup.wpHeight);

  // Set up backgrounds 
  var spBg = shapePaper.circle(setup.spCenter[0], setup.spCenter[1], 5);
  spBg.attr("fill", "#ddd");
  spBg.attr("stroke", "#ddd");
  drawAxis(shapePaper);
  drawAxis(wavePaper);
 
  // Make a function
  var sine = SineMaker();
  var sawtooth = SawtoothMaker();
  var triangle = TriangleMaker();

  // Draw curve
  //drawCurve(sawtooth, 150, wavePaper, shapePaper, setup);
  //drawCurve(sine, 150, wavePaper, shapePaper, setup);
  //drawCurve(triangle, 150, wavePaper, shapePaper, setup);
  
  // Draw Shape
  var shape = drawNGon(shapePaper, 3, setup);
  shapeToWave(shapePaper, wavePaper, shape, 100, setup);









})();
