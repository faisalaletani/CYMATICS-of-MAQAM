class Splash {

 constructor() {
   
  this.splashBorder = 100;
  fill(255);
  stroke(255, 0, 0)
  rect(this.splashBorder, this.splashBorder, windowWidth-this.splashBorder*2, windowHeight-this.splashBorder*2);
  fill(0, 0, 222);
  noStroke()
   
  this.title = createDiv("My Project Title");
  this.title.style('color:deeppink');
  this.title.style('font-family: Arial, Helvetica, sans-serif');
  this.title.position(this.splashBorder+20, this.splashBorder+20);
  
  this.name = createDiv("My Name");
  this.name.position(this.splashBorder+20, this.splashBorder+60);
  
  this.info = createDiv("You can read a bunch of stuff about my project here because I've been working very hard in this class and I have so much to say about my project, the way it works, and why I made it. It's such an incredable joy to be coding in p5js and also so amazing to be learning from such a skilled teacher like Bryan Jacobs. <p> I could go on and on and on.");
  
  this.info.position(this.splashBorder+20, this.splashBorder+100);
  this.info.size(600, 600)
  
}
 
  hide(){
    this.title.remove()
    this.name.remove()
    this.info.remove()
  }
}

