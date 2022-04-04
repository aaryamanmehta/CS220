// Assigning variable 'robot' to the image
let robot = lib220.loadImageFromURL('https://people.cs.umass.edu/~joydeepb/robot.jpg');

// removeBlueAndGreen(img: Image) : Image
function removeBlueAndGreen(img) {
  let newImg = img.copy();
  for (let a = 0; a < newImg.width; ++a) {
    for (let b = 0; b < newImg.height; ++b) {
      let p = newImg.getPixel(a, b); 
      newImg.setPixel(a, b, [p[0], 0, 0]);   
    }
  }
  return newImg;
}

// shiftRGB(img: Image) : Image
function shiftRGB(img) {
  let newImg = img.copy();
  for (let a = 0; a < newImg.width; ++a) {
    for (let b = 0; b < newImg.height; ++b) {
      let p = newImg.getPixel(a, b);
      newImg.setPixel(a, b, [p[1], p[2], p[0]])
    } 
  }
  return newImg;
}

// imageMap(img: Image, func: (p: Pixel) => Pixel) : Image
function imageMap(img, func) {
  let newImg = img.copy();
  for (let a = 0; a < newImg.width; ++a) {
    for (let b = 0; b < newImg.height; ++b) {
      let p = newImg.getPixel(a, b);
      let newP = func(p);
      newImg.setPixel(a, b, newP)
    } 
  }
  return newImg;
}

// mapToRed(img : Image) : Image
function mapToRed(img) {
  return imageMap(img, mapToRedPixel);
}

function mapToRedPixel(p) {
  return [p[0], 0, 0];
}

// mapToGBR(img : Image) : Image
function mapToGBR(img) {
  return imageMap(img, mapToGBRPixel);
}

function mapToGBRPixel(p) {
  return [p[1], p[2], p[0]];
}

// increaseContrast(img: Image) : Image
function increaseContrast(img) {
  return imageMap(img, increaseContrastPixel);  
}

function increaseContrastPixel(p) {
  if (p[0] > 0.5) {
    p[0] += (1 - p[0])/10;
  }
  if (p[0] < 0.5) {
    p[0] += (0 - p[0])/10;
  }
  if (p[1] > 0.5) {
    p[1] += (1 - p[1])/10;
  }
  if (p[1] < 0.5) {
    p[1] += (0 - p[1])/10;
  }
  if (p[2] > 0.5) {
    p[2] += (1 - p[2])/10;
  }
  if (p[2] < 0.5) {
    p[2] += (0 - p[2])/10;
  }
  return [p[0], p[1], p[2]];
}

// Calling all functions
robot.show();

let redWallE = removeBlueAndGreen(robot);
redWallE.show();

let callShiftRGB = shiftRGB(robot);
callShiftRGB.show();

let callRedMap = mapToRed(robot);
callRedMap.show();

let callGBRMap = mapToGBR(robot);
callGBRMap.show();

let callIncreaseContrast = increaseContrast(robot);
callIncreaseContrast.show();

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
  // The red channel should be unchanged.
  assert(pixelValue[0] === 1);
  // The green channel should be 0.
  assert(pixelValue[1] === 0);
  // The blue channel should be 0.
  assert(pixelValue[2] === 0);
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

test('mapToRedPixel check removed blue and green from pixel', function() {
  const white = [1, 1, 1];
  const redPixel = mapToRedPixel(white);
  assert(pixelEq(redPixel, [1, 0, 0]));
})

test('mapToGBRPixel check shifted RGB', function() {
  const pixel = [1, 0.5, 0];
  const shiftedPixel = mapToGBRPixel(pixel);
  assert(pixelEq(shiftedPixel, [0.5, 0, 1]));
})

test('mapToRed function definition correct', function() {
  const white = lib220.createImage(10, 10, [1, 1, 1]);
  mapToRed(white).getPixel(0, 0);
  // no assertion, just checks that the code runs to completion
})

test('mapToGBR function definition correct', function() {
  const white = lib220.createImage(10, 10, [1, 1, 1]);
  mapToGBR(white).getPixel(0, 0);
  // no assertion, just checks that the code runs to completion
})

test('increaseContrastPixel check 1', function() {
  const pixel = [0.6, 0.3, 0.5];
  const contrastedPixel = increaseContrastPixel(pixel);
  assert(pixelEq(contrastedPixel, [0.64, 0.27, 0.5]));
})

test('increaseContrastPixel check 2', function() {
  const pixel = [1, 0, 0.1];
  const contrastedPixel = increaseContrastPixel(pixel);
  assert(pixelEq(contrastedPixel, [1, 0, 0.09]));
})

test('increaseContrastPixel check 3', function() {
  const pixel = [0.9, 0.52, 0.32];
  const contrastedPixel = increaseContrastPixel(pixel);
  assert(pixelEq(contrastedPixel, [0.91, 0.568, 0.288]));
})