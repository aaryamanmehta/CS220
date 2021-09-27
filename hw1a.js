// Assigning the robot image to a variable 'wallE'
let wallE = lib220.loadImageFromURL("https://people.cs.umass.edu/~joydeepb/robot.jpg");

/* Removing blue and green pixels of the image
one by one until the entire image's pixels have
been changed using nested loops. Assigning c to the
array of pixels at a, b, and then changing the pixels
at a, b so that only the red value remains, while the
blue and green values are set to 0.
*/

// removeBlueAndGreen(img: Image) : Image

function removeBlueAndGreen(img) {
  let newImg = img.copy();
  for (let a = 0; a < newImg.width; ++a) {
    for (let b = 0; b < newImg.height; ++b) {
      let c = newImg.getPixel(a, b); 
      newImg.setPixel(a, b, [c[0], 0, 0]);   
    }
  }
  return newImg;
}

/* Changing the pixels of the image to gray
one by one until the entire image's pixels have
been changed using nested loops. Assigning c to the
array of pixels at a, b, and then changing the pixels
at a, b so that only the image turns gray - done by
averaging out the values of the pixels at R, G, and B.
*/


// makeGrayScale(img : Image) : Image

function makeGrayscale(img) {
  let newImg = img.copy();
  for (let a = 0; a < newImg.width; ++a) {
    for (let b = 0; b < newImg.height; ++b) { 
      let c = newImg.getPixel(a, b);
      let avg = (c[0] + c[1] + c[2])/3;
      newImg.setPixel(a, b, [avg, avg, avg]);
    }
  }
  return newImg;
}

/* Helper methods mapToRed and mapToGrey are used
in conjuction with imageMap */

// mapToRed(p : Pixel) : Pixel

function mapToRed(img) {
  return imageMap(img, mapToRedPixel);
}

function mapToRedPixel(p) {
  return [p[0], 0, 0];
}

// mapToGray(p : Pixel) : Pixel

function mapToGrayscale(img) {
  return imageMap(img, mapToGrayscalePixel);
}

function mapToGrayscalePixel(p) {
  let avg = (p[0] + p[1] + p[2])/3;
  return [avg, avg, avg];
}

// imageMap(img: Image, func: (p: Pixel) => Pixel) : Image

function imageMap(img, func) {
  let newImg = img.copy();
  for (let a = 0; a < newImg.width; ++a) {
    for (let b = 0; b < newImg.height; ++b) {
      let c = newImg.getPixel(a, b);
      let newC = func(c);
      newImg.setPixel(a, b, newC);
    } 
  }
  return newImg;
}

// Calling all functions and displaying them
wallE.show();

let redWallE = removeBlueAndGreen(wallE);
redWallE.show();

let grayWallE = makeGrayscale(wallE);
grayWallE.show();

let callRedMap = imageMap(wallE, mapToRedPixel);
callRedMap.show();

let callGrayMap = imageMap(wallE, mapToGrayscalePixel);
callGrayMap.show();

// Tests
test('removeBlueAndGreen function definition correct', function() {
  const white = lib220.createImage(10, 10, [1, 1, 1]);
  removeBlueAndGreen(white).getPixel(0, 0);
  // no assertion, just checks that the code runs to completion
})

test('No blue or green in removeBlueAndGreen result', function() {
  // Create a test image, of size 10 pixels x 10 pixels, and set it to all white.
  const white = lib220.createImage(10, 10, [1, 1, 1]);
  // Get the result of the function.
  const shouldBeRed = removeBlueAndGreen(white);
  // Read the center pixel.
  const pixelValue = shouldBeRed.getPixel(5, 5);
  // The red channel should be changed.
  assert(pixelValue[0] === 1);
  // The green channel should be 0.
  assert(pixelValue[1] === 0);
  // The blue channel should be 0.
  assert ( pixelValue [2] === 0);
})

function pixelEq (p1, p2) {
  const epsilon = 0.002;
  for (let i = 0; i < 3; ++i) {
    if (Math.abs(p1[i] - p2[i]) > epsilon) {
      return false;
    }
  }
  return true;
}

test('Check pixel equality', function() {
  const inputPixel = [0.5, 0.5, 0.5]
  // Create a test image, of size 10 pixels x 10 pixels, and set it to the inputPixel
  const image = lib220.createImage(10, 10, inputPixel);
  // Process the image.
  const outputImage = removeBlueAndGreen(image);
  // Check the center pixel.
  const centerPixel = outputImage.getPixel(5, 5);
  assert(pixelEq(centerPixel, [0.5, 0, 0]));
  // Check the top-left corner pixel.
  const cornerPixel = outputImage.getPixel(0, 0);
  assert(pixelEq(cornerPixel, [0.5, 0, 0]));
})

test('mapToRedPixel function definition correct', function() {
  const white = [1, 1, 1];
  mapToRedPixel(white)[2];
  // no assertion, just checks that the code runs to completion
})

test('mapToRedPixel check removed blue and green from pixel', function() {
  const white = [1, 1, 1];
  const redPixel = mapToRedPixel(white);
  assert(pixelEq(redPixel, [1, 0, 0]));
})

test('mapToGrayscalePixel function definition correct', function() {
  const originalPixel = [0.5, 1, 0];
  mapToGrayscalePixel(originalPixel)[2];
  // no assertion, just checks that the code runs to completion
})

test('mapToGrayscalePixel check removed blue and green from pixel', function() {
  const originalPixel = [0.5, 1, 0];
  const grayPixel = mapToGrayscalePixel(originalPixel);
  assert(pixelEq(grayPixel, [0.5, 0.5, 0.5]));
})

test('mapToRed function definition correct', function() {
  const white = lib220.createImage(10, 10, [1, 1, 1]);
  mapToRed(white).getPixel(0, 0);
})

test('mapToGrayscale function definition correct', function() {
  const white = lib220.createImage(10, 10, [1, 1, 1]);
  mapToGrayscale(white).getPixel(0, 0);
})
