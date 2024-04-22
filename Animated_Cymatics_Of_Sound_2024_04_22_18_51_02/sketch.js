let Geometry;
let Sides; // Number of sides (3, 4, or 6)
let Radius; // Geometry radius
let Angle; // Edge ray angle
let Distance; // Edge ray distance from midpoint
let fillHueSlider;
let fillAlphAngle;
let strokeHueSlider;
let strokeAlphAngle;
let GeometryAlphAngle;
let randomizeInterval;

var mode = 0;
let audioStarted = false;
let bgMusic; // Define a variable for the audio file

function preload() {
  // Load the audio file
  bgMusic = loadSound('Cymatics of Maqam Audio.mp3');
}

function mousePressed() { // needed to get it to work in full screen mode
    // Start audio on user gesture
    if (!audioStarted) {
        userStartAudio();
        audioStarted = true;
        bgMusic.loop(); // Start playing the audio file when audio context is started
    }
}

function setup() {
   createCanvas(750, 600);
  colorMode(HSB, 100);
  
  createDiv().style('height', '8px');
  Sides = new ArraySlider('Sides', [3, 4, 6], 2, reset);
  Radius = new Slider('Radius', 20, 200, 50, 1, reset);
  Angle = new Slider('Angle', 0, 180, 120, 1, reset);
  Distance = new Slider('Delta', 0, 0.99, 0.3, 0.01, reset);
  
  fillHueSlider = new Slider('Fill Color', 0, 100, 56);
  fillAlphAngle = new Slider('Fill Alpha', 0, 100, 100);
  strokeHueSlider = new Slider('Line Color', 0, 100, 14);
  strokeAlphAngle = new Slider('Line Alpha', 0, 100, 0);
  GeometryAlphAngle = new Slider('Geometry Alpha', 0, 100, 0);
  
  reset();
  splash = new Splash();
  
  // Create buttons and move them to the right side
  let startButton = createButton('Start Randomization');
  startButton.position(width - 200, height + 10);
  startButton.mousePressed(startRandomization);
  
  let stopButton = createButton('Stop Randomization');
  stopButton.position(width - 370, height + 10);
  stopButton.mousePressed(stopRandomization);

  // Start randomization initially
  startRandomization();
}

function startRandomization() {
  randomizeInterval = setInterval(randomizeSliders, 500); // Randomize every half a second
}

function stopRandomization() {
  clearInterval(randomizeInterval);
}

function randomizeSliders() {
  Sides.slider.value(random(Sides.slider.elt.min, Sides.slider.elt.max));
  Radius.slider.value(random(Radius.slider.elt.min, Radius.slider.elt.max));
  Angle.slider.value(random(Angle.slider.elt.min, Angle.slider.elt.max));
  Distance.slider.value(random(Distance.slider.elt.min, Distance.slider.elt.max));
  fillHueSlider.slider.value(random(fillHueSlider.slider.elt.min, fillHueSlider.slider.elt.max));
  fillAlphAngle.slider.value(random(fillAlphAngle.slider.elt.min, fillAlphAngle.slider.elt.max));
  strokeHueSlider.slider.value(random(strokeHueSlider.slider.elt.min, strokeHueSlider.slider.elt.max));
  strokeAlphAngle.slider.value(random(strokeAlphAngle.slider.elt.min, strokeAlphAngle.slider.elt.max));
  GeometryAlphAngle.slider.value(random(GeometryAlphAngle.slider.elt.min, GeometryAlphAngle.slider.elt.max));
}

function draw() {
   if (mouseIsPressed == true) {
    mode = 1;
  }
  if (mode == 1) {
    splash.hide();}
  
  background(100);
  
  translate(width/2, height/2);
  switch(Geometry.sideCount) {
    case 3: drawTriangleGrid(); break;
    case 4: drawSquareGrid(); break;
    case 6: drawHexagonGrid(); break;
    
  }
}

function reset() {
  let n = Sides.value();
  let r = Radius.value();
  let a = Angle.value() / 180 * PI; // Deg to Rad
  let d = Distance.value();
  
  Geometry = new HankinGeometry(n, r, a, d);
}

function drawTriangleGrid() {
  // TODO
  Geometry.draw();
}

function drawSquareGrid() {
  let space = sqrt((Geometry.radius*Geometry.radius)/2) * 2;
  let xRange = ceil((width/2 + space/2) / space);
  let yRange = ceil((height/2 + space/2) / space);
  for (let x = -xRange; x <= xRange; ++x) {
    for (let y = -yRange; y <= yRange; ++y) {
      push();
      translate(x * space, y * space);
      Geometry.draw();
      pop();
    }
  }
}

function drawHexagonGrid() {
  let xSpace = Geometry.radius * 1.5;
  let xRange = floor((width/2 + Geometry.radius) / xSpace);
  let ySpace = Geometry.radius * tan(PI/3);
  let yRange = ceil((height/2) / ySpace);
  for (let x = -xRange; x <= xRange; ++x) {
    for (let y = -yRange; y <= yRange; ++y) {
      let xPos = x * xSpace;
      let yPos = y * ySpace + (x % 2 != 0 ? ySpace/2 : 0);
      
      push();
      translate(xPos, yPos);
      Geometry.draw();
      pop();
    }
  }
}

// HankinGeometry

class HankinGeometry {
  constructor(sideCount, radius, rayAngle, rayDelta) {
    this.sideCount = sideCount;
    this.radius = radius;
    
    this.sideAngle = TWO_PI / this.sideCount;
    this.a = createVector(this.radius, 0).rotate(HALF_PI - (this.sideAngle/2));
    this.b = this.a.copy().rotate(this.sideAngle);
    let sideLength = p5.Vector.dist(this.a, this.b);
    
    let mid = p5.Vector.lerp(this.a, this.b, 0.5);
    this.c1 = p5.Vector.lerp(mid, this.a, rayDelta);
    this.c2 = p5.Vector.lerp(mid, this.b, rayDelta);
    
    let r1 = p5.Vector.sub(this.a, this.c1).rotate(-rayAngle);
    let r2 = p5.Vector.sub(this.b, this.c2).rotate(rayAngle);
    
    let a, aAngle;
    let halfInteriorAngle = (PI - this.sideAngle) / 2;
    if (p5.Vector.cross(r1, this.c1.copy().mult(-1)).z < 0) {
      this.crossed = false;
      a = (sideLength/2) * (1 - rayDelta);
      aAngle = PI - halfInteriorAngle - rayAngle;
    } else {
      this.crossed = true;
      a = (sideLength/2) * (1 + rayDelta);
      aAngle = PI - halfInteriorAngle - (PI - rayAngle);
    }
    
    let rayLength = (a * sin(halfInteriorAngle)) / sin(aAngle);
    this.d1 = p5.Vector.add(this.c1, r1.setMag(rayLength));
    this.d2 = p5.Vector.add(this.c2, r2.setMag(rayLength));
  }
  
  draw() {
    strokeWeight(2);
    beginShape();
    for (let i = 0; i < this.sideCount; ++i) {
      stroke(0, 0, 0, GeometryAlphAngle.value());
      line(this.a.x, this.a.y, this.b.x, this.b.y);
      
      if (!this.crossed) {
        vertex(this.d1.x, this.d1.y);
        vertex(this.c1.x, this.c1.y);
        vertex(this.c2.x, this.c2.y);
        vertex(this.d2.x, this.d2.y);
      } else {
        vertex(this.d2.x, this.d2.y);
        vertex(this.c2.x, this.c2.y);
        vertex(this.c1.x, this.c1.y);
        vertex(this.d1.x, this.d1.y);
      }
      
      this.a.rotate(this.sideAngle);
      this.b.rotate(this.sideAngle);
      this.c1.rotate(this.sideAngle);
      this.c2.rotate(this.sideAngle);
      this.d1.rotate(this.sideAngle);
      this.d2.rotate(this.sideAngle);
    }
    fill(fillHueSlider.value(), 100, 100, fillAlphAngle.value());
    stroke(strokeHueSlider.value(), 100, 100, strokeAlphAngle.value());
    endShape(CLOSE);
  }
}

// Slider

function Slider(name, min, max, init, step, inputCallback, changedCallback) {
  this.name = name;
  this.label = createP(name)
    .style('color', '#BBB')
    .style('margin-bottom', '-2px')
    .style('margin-top', '0px');
  this.slider = createSlider(min, max, init, step || 1)
    .style('width', width + 'px');
  
  this.inputCallback = null;
  this.changedCallback = null;
  
  // Initial execution without callbacks
  this.onInput();
  
  this.inputCallback = inputCallback;
  this.changedCallback = changedCallback;
  
  this.slider.input(() => this.onInput());
  this.slider.changed(() => this.onChanged());
}

Slider.prototype.onInput = function() {
  this.label.html(this.name + ": " + this.value());
  
  if (this.inputCallback != null) {
    this.inputCallback();
  }
}

Slider.prototype.onChanged = function() {
  if (this.changedCallback != null) {
    this.changedCallback();
  }
}

Slider.prototype.value = function() {
  return this.slider.value();
}

// PoweRadius

PoweRadius.prototype = Object.create(Slider.prototype);
PoweRadius.prototype.constructor = PoweRadius;
function PoweRadius(name, min, max, init, power, inputCallback, changedCallback) {
  this.power = power;
  Slider.call(this, name, min, max, init, 1, inputCallback, changedCallback);
}

PoweRadius.prototype.value = function() {
  return pow(this.power, this.slider.value());
}

// ArraySlider

ArraySlider.prototype = Object.create(Slider.prototype);
ArraySlider.prototype.constructor = ArraySlider;
function ArraySlider(name, values, initialIndex, inputCallback, changedCallback) {
  this.values = values;
  Slider.call(this, name, 0, values.length - 1, initialIndex, 1, inputCallback, changedCallback);
}

ArraySlider.prototype.value = function() {
  return this.values[this.slider.value()];
}
