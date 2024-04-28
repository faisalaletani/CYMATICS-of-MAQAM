class Splash {
  constructor() {
    this.splashBorder = 100;

    this.backgroundRect = createDiv('');
    this.backgroundRect.position(this.splashBorder+500, this.splashBorder);
    this.backgroundRect.size(600, 350); 
    this.backgroundRect.style('background-color', '#8BC34A');

    fill(0, 0, 222);
    noStroke();

    line(windowWidth - this.splashBorder - 40, this.splashBorder + 20, windowWidth - this.splashBorder - 20, this.splashBorder + 40)
    line(windowWidth - this.splashBorder - 20, this.splashBorder + 20, windowWidth - this.splashBorder - 40, this.splashBorder + 40)

    this.title = createDiv("CYMATICS OF MAQAM");
    this.title.style('color:#FFFFFF');
    this.title.style('font-family: Arial, Helvetica, sans-serif');
    this.title.position(this.splashBorder + 680, this.splashBorder + 20);

    this.name = createDiv("FAISAL ALETANI");
    this.name.position(this.splashBorder + 700, this.splashBorder + 60);

    this.info = createDiv("This project is dedicated to present the Arabic school of Art and Geometry using an interactive geometry designer which can be used to visualize the cymatic representation of the Arabic music modes or scale which is refered to as maqamat, once you click on the this splash page you will start a musical journey where you will here 8 different maqams or arabic scales in 90 seconds in the background as you try to create an arabic geometrical shape that would reflect a cymatic representation based on what you heared and felt.<p> <a href=https://editor.p5js.org/faisalfreezy/sketches/QckP5cAWp>view code</a>");
    this.info.position(this.splashBorder + 550, this.splashBorder + 100);
    this.info.size(500, 100); // Adjust width and height as needed

    // Event listener to hide splash page on mouse click
    this.backgroundRect.mouseClicked(() => {
      this.hide();
    });
  }

  update() {
    if (mouseX > windowWidth - this.splashBorder - 40 &&
      mouseX < windowWidth - this.splashBorder - 20 &&
      mouseY < this.splashBorder + 40 &&
      mouseY > this.splashBorder + 20
    ) {
      console.log('hello')
      return true;
    }
  }

  hide() {
    this.title.remove();
    this.name.remove();
    this.info.remove();
    this.backgroundRect.remove(); // Also remove the background rectangle when hiding
  }
}
