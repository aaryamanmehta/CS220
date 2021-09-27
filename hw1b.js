// Assigning the robot image to a variable 'wallE'
let wallE = lib220.loadImageFromURL("https://people.cs.umass.edu/~joydeepb/robot.jpg");

/* Highlighting the edges of an image by
calculating mean values of a pixel at (x, y) - m1 and
the mean values of an adjacent pixel at (x, y + 1) - m2,
then setting the RGB values of the pixel at (x, y) to
|m1 - m2|.
*/

// highlightEdges(img: Image) : Image

function highlightEdges(img) {
  let newImg = img.copy();
  for (let a = 0; a < newImg.width; ++a) {
    for (let b = 0; b < newImg.height - 1; ++b) { 
      let c1 = newImg.getPixel(a, b);
      let m1 = (c1[0] + c1[1] + c1[2])/3;
      let c2 = newImg.getPixel(a, b + 1);
      let m2 = (c2[0] + c2[1] + c2[2])/3;
      let absM = Math.abs(m1 - m2);
      newImg.setPixel(a, b, [absM, absM, absM]);
    }
  }
  return newImg;
}

/* isInBounds is a helper function for blur that
checks if the position of the pixel is within bounds,
and returns false if it is not. This is necessary as
the blur function requires adjacent pixels to calculate
the mean values of RGB, and in edge cases, such as
a pixel at (0, 0), not all adjacent pixels are in bounds.
*/

function isInBounds(max_x, max_y, x, y) {
  if (x < 0) {
    return false;
  }
  if (y < 0) {
    return false;
  }
  if (x >= max_x) {
    return false;
  }
  if (y >= max_y) {
    return false;
  }
  return true;
}

// blur(img: Image) : Image

function blur(img) {
  let newImg = img.copy();
  for (let a = 0; a < newImg.width; ++a) {
    for (let b = 0; b < newImg.height; ++b) {
      let count = 0;
      let red = 0;
      let green = 0;
      let blue = 0;
      if (isInBounds(img.width, img.height, a, b)) {
        count = count + 1;
        let c = img.getPixel(a, b);
        red = red + c[0];
        green = green + c[1];
        blue = blue + c[2];
      }
      if (isInBounds(img.width, img.height, a + 1, b)) {
        count = count + 1;
        let c = img.getPixel(a + 1, b);
        red = red + c[0];
        green = green + c[1];
        blue = blue + c[2];
      }
      if (isInBounds(img.width, img.height, a - 1, b)) {
        count = count + 1;
        let c = img.getPixel(a - 1, b);
        red = red + c[0];
        green = green + c[1];
        blue = blue + c[2];
      }
      if (isInBounds(img.width, img.height, a, b + 1)) {
        count = count + 1;
        let c = img.getPixel(a, b + 1);
        red = red + c[0];
        green = green + c[1];
        blue = blue + c[2];
      }
      if (isInBounds(img.width, img.height, a, b - 1)) {
        count = count + 1;
        let c = img.getPixel(a, b - 1);
        red = red + c[0];
        green = green + c[1];
        blue = blue + c[2];
      }
      if (isInBounds(img.width, img.height, a + 1, b + 1)) {
        count = count + 1;
        let c = img.getPixel(a + 1, b + 1);
        red = red + c[0];
        green = green + c[1];
        blue = blue + c[2];
      }
      if (isInBounds(img.width, img.height, a - 1, b - 1)) {
        count = count + 1;
        let c = img.getPixel(a - 1, b - 1);
        red = red + c[0];
        green = green + c[1];
        blue = blue + c[2];
      }
      if (isInBounds(img.width, img.height, a + 1, b - 1)) {
        count = count + 1;
        let c = img.getPixel(a + 1, b - 1);
        red = red + c[0];
        green = green + c[1];
        blue = blue + c[2];
      }
      if (isInBounds(img.width, img.height, a - 1, b + 1)) {
        count = count + 1;
        let c = img.getPixel(a - 1, b + 1);
        red = red + c[0];
        green = green + c[1];
        blue = blue + c[2];
      }
      
      red = red / count;
      green = green / count;
      blue = blue / count;

      newImg.setPixel(a, b, [red, green, blue]);
    }
  }
  return newImg;
}

// swapGB(img: Image) : Image

function swapGB(img) {
  return imageMap(img, swapGBPixel);
}

function swapGBPixel(p) {
  return [p[0], p[2], p[1]];
}

// shiftRGB(img: Image) : Image

function shiftRGB(img) {
  return imageMap(img, shiftRGBPixel);
}

function shiftRGBPixel(p) {
  return [p[2], p[0], p[1]];
}

// imageMap(img: Image, func: (p: Pixel) => Pixel) : Image

function imageMap(img, func) {
  let newImg = img.copy();
  for (let a = 0; a < newImg.width; ++a) {
    for (let b = 0; b < newImg.height; ++b) {
      let c = newImg.getPixel(a, b);
      let newC = func(c);
      newImg.setPixel(a, b, newC)
    } 
  }
  return newImg;
}

// Calling all functions and displaying them

wallE.show();

let highlightEdgesWallE = highlightEdges(wallE);
highlightEdgesWallE.show();

let callSwapGB = imageMap(wallE, swapGBPixel);
callSwapGB.show();

let callShiftRGB = imageMap(wallE, shiftRGBPixel);
callShiftRGB.show();

let blurWallE = blur(wallE);
blurWallE.show();

// Tests

function pixelEq (p1, p2) {
  const epsilon = 0.004;
  for (let i = 0; i < 3; ++i) {
    if (Math.abs(p1[i] - p2[i]) > epsilon) {
      return false;
    }
  }
  return true;
}

test('highlightEdges function definition correct', function() {
  const testImage = lib220.createImage(10, 10, [0.5, 1, 1]);
  highlightEdges(testImage);
  // no assertion, just checks that the code runs to completion
})

test('highlightEdges function check pixel value', function() {
  const testImage = lib220.createImage(10, 10, [0.5, 1, 1]);
  highlightEdges(testImage);
  const testImagePixel = highlightEdges(testImage).getPixel(5, 5);
  assert(pixelEq(testImagePixel, [0, 0, 0]));
})

test('blur function definition correct', function() {
  const testImage = lib220.createImage(10, 10, [0.5, 1, 0.5]);
  blur(testImage);
  // no assertion, just checks that the code runs to completion
})

test('blur function check pixel value at center', function() {
  const testImage = lib220.createImage(10, 10, [0, 0, 0]);
  testImage.setPixel(5, 5, [1, 1, 1]);
  blur(testImage);
  const testImagePixel = blur(testImage).getPixel(5, 5);
  assert(pixelEq(testImagePixel, [0.1111, 0.1111, 0.1111]));
})

test('blur function check pixel value at corner', function() {
  const testImage = lib220.createImage(10, 10, [0.5, 0.5, 0.5]);
  testImage.setPixel(0, 0, [1, 1, 1]);
  blur(testImage);
  const testImagePixel = blur(testImage).getPixel(0, 0);
  assert(pixelEq(testImagePixel, [0.625, 0.625, 0.625]));
})

test('swapGBPixel function definition correct', function() {
  const testPixel = [1, 0.5, 0];
  swapGBPixel(testPixel);
  // no assertion, just checks that the code runs to completion
})

test('swapGBPixel function check swapped green and blue pixels', function() {
  const testPixel = [1, 0.5, 0];
  const testPixelSwapped = swapGBPixel(testPixel);
  assert(pixelEq(testPixelSwapped, [1, 0, 0.5]));
})

test('shiftRGBPixel function definition correct', function() {
  const testPixel = [1, 0.5, 0];
  shiftRGBPixel(testPixel);
  // no assertion, just checks that the code runs to completion
})

test('shiftRGBPixel function check shifted RGB pixels', function() {
  const testPixel = [1, 0.5, 0];
  const testPixelShifted = shiftRGBPixel(testPixel);
  assert(pixelEq(testPixelShifted, [0, 1, 0.5]));
})
