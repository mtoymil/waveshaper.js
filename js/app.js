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
  var sine = SineMaker(1);
  var sawtooth = SawtoothMaker();
  var triangle = TriangleMaker();

  // Draw curve
  //drawCurve(sawtooth, 150, wavePaper, shapePaper, setup);
  drawCurve(sine, 150, wavePaper, shapePaper, setup);
  //drawCurve(triangle, 150, wavePaper, shapePaper, setup);









})();
