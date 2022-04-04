// Assigning variable 'robot' to the image
let robot = lib220.loadImageFromURL('https://people.cs.umass.edu/~joydeepb/robot.jpg');

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

// imageMapXY(img: Image, func: (img: Image, x: number, y: number) => Pixel): Image
function imageMapXY(img, func) {
  let newImg = img.copy();
  for (let x = 0; x < img.width; ++x) {
    for (let y = 0; y < img.height; ++y) {
      let functionCall = func(img, x, y);
      newImg.setPixel(x, y, functionCall);
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

function isInBounds(width, height, x, y) {
  return (!(x < 0 || y < 0 || x >= width || y >= height));
}

// blurPixel(img: Image, x: number, y: number): Pixel
function blurPixel(img, x, y) {
  let count = 0;
  let rgb = [0, 0, 0];
  for (let i = -1; i < 2; ++i) {
    for (let j = -1; j < 2; ++j) {
      if (isInBounds(img.width, img.height, x+i, y+j)) {
        ++count;
        let c = img.getPixel(x+i, y+j);
        rgb[0] += c[0];
        rgb[1] += c[1];
        rgb[2] += c[2];
      }
    } 
  }
  return rgb.map(x => x / count);
}

// blurImage(img: Image): Image
function blurImage(img) {
  return imageMapXY(img, blurPixel);
}

// diffLeft(img: Image, x: number, y: number): Pixel
function diffLeft(img, x, y) {
  let c1 = img.getPixel(x, y);
  let m1 = (c1[0] + c1[1] + c1[2])/3;
  if (x-1 >= 0) {
    let c2 = img.getPixel(x-1, y);
    let m2 = (c2[0] + c2[1] + c2[2])/3;
    let absM = Math.abs(m2-m1);
    return [absM, absM, absM];
  }
  else {
    return [0, 0, 0];
  }
}

// highlightEdges(img: Image) : Image
function highlightEdges(img) {
  return imageMapXY(img, diffLeft);
}

// isGrayish(p: Pixel) : boolean
function isGrayish(p) {
  const max = Math.max(p[0], p[1], p[2]);
  const min = Math.min(p[0], p[1], p[2]);
  const difference = max - min;
  if (difference > (1/3)){
    return false;
  }
  else {
    return true;
  }
}

// makeGrayish(p: Pixel) : Pixel
function makeGrayish(p) {
    if (isGrayish(p) === true) {
     return p;
    }
    if (isGrayish(p) === false) {
      let avg = (p[0] + p[1] + p[2])/3;
      return [avg, avg, avg];
    }
}

// blackenLow(p: Pixel) : Pixel
function blackenLow(p) {
    if (p[0] < 1/3) {
      p[0] = 0;
    }
    if (p[1] < 1/3) {
      p[1] = 0;
    }
    if (p[2] < 1/3) {
      p[2] = 0;
    }
  return p;
}

// shiftRGB(p: Pixel) : Pixel
function shiftRGB(p) {
  return [p[1], p[2], p[0]];
}

// reduceFunctions(fa: ((p: Pixel) => Pixel)[] ): ((x: Pixel) => Pixel)
function reduceFunctions(fa) {
  function finalPixel(p) {
    return fa.reduce(function(p, func){
      return func(p)
    }, p);
  }
  return finalPixel;
}

// combineThree(img: Image) : Image
function combineThree(img) {
  let arrayOfFunctions = reduceFunctions([makeGrayish, blackenLow, shiftRGB]);
  return imageMap(img, arrayOfFunctions);
}

// Calling all functions and displaying them
blurImage(robot).show();
highlightEdges(robot).show();
combineThree(robot).show();

// Tests
test('imageMapXY function definition is correct', function() {
  function identity(image, x, y) { return image.getPixel(x, y); }
  let inputImage = lib220.createImage(10, 10, [0, 0, 0]);
  let outputImage = imageMapXY(inputImage, identity);
  let p = outputImage.getPixel(0, 0); // output should be an image, getPixel works
  assert(p[0] === 0);
  assert(p[1] === 0);
  assert(p[2] === 0);
  assert(inputImage !== outputImage); // output should be a different image object
});

function pixelEq (p1, p2) {
  const epsilon = 0.004;
  for (let i = 0; i < 3; ++i) {
    if (Math.abs(p1[i] - p2[i]) > epsilon) { return false; }
  }
  return true;
};
  
test('identity function with imageMapXY', function() {
  let identityFunction = function(image, x, y) {
    return image.getPixel(x, y);
  };
  let inputImage = lib220.createImage(10, 10, [0.2, 0.2, 0.2]);
  inputImage.setPixel(0, 0, [0.5, 0.5, 0.5]);
  inputImage.setPixel(5, 5, [0.1, 0.2, 0.3]);
  inputImage.setPixel(2, 8, [0.9, 0.7, 0.8]);
  let outputImage = imageMapXY(inputImage, identityFunction);
  assert(pixelEq(outputImage.getPixel(0, 0), [0.5, 0.5, 0.5]));
  assert(pixelEq(outputImage.getPixel(5, 5), [0.1, 0.2, 0.3]));
  assert(pixelEq(outputImage.getPixel(2, 8), [0.9, 0.7, 0.8]));
  assert(pixelEq(outputImage.getPixel(9, 9), [0.2, 0.2, 0.2]));
});

test('blurPixel', function() {
  let inputImage = lib220.createImage(10, 10, [0, 0, 0]);
  blurPixel(inputImage, 0, 0);
  // no assertion, just checks that the code runs to completion
});

test('blurImage', function() {
  let inputImage = lib220.createImage(10, 10, [0, 0, 0]);
  blurImage(inputImage);
  // no assertion, just checks that the code runs to completion
});

test('blur function check pixel value at center', function() {
  const testImage = lib220.createImage(10, 10, [0.4375, 0.4375, 0.4375]);
  testImage.setPixel(5, 5, [1, 1, 1]);
  const testImagePixel = blurImage(testImage).getPixel(5, 5);
  assert(pixelEq(testImagePixel, [0.5, 0.5, 0.5]));
});

test('blur function check pixel value at corner', function() {
  const testImage = lib220.createImage(10, 10, [0.5, 0.5, 0.5]);
  testImage.setPixel(0, 0, [1, 1, 1]);
  const testImagePixel = blurImage(testImage).getPixel(0, 0);
  assert(pixelEq(testImagePixel, [0.625, 0.625, 0.625]));
});

test('isGrayish function is valid', function() {
  const testPixel1 = [0.2, 1, 0.8];
  const testPixel2 = [0, 0, 0];
  const testPixel3 = [1, 1, 0.7];
  const testPixel4 = [1, 0.2, 0.75];
  assert(isGrayish(testPixel1) === false);
  assert(isGrayish(testPixel2) === true);
  assert(isGrayish(testPixel3) === true);
  assert(isGrayish(testPixel4) === false);
});

test('makeGrayish check if pixel values are made grayish', function() {
  const pixel1 = [0.2, 1, 0.8];
  const pixel2 = [0.6, 0.3, 0.4];
  const grayishPixel = makeGrayish(pixel1);
  const notGrayishPixel = makeGrayish(pixel2);
  /* When makeGrayish is called on a pixel that returns false when isGrayish is called, the pixel values would be changed
  to the average of RGB channel values */
  assert(pixelEq(grayishPixel, [2/3, 2/3, 2/3]));
  // When makeGrayish is called on a pixel that returns true when isGrayish is called, the pixel values would be unchanged
  assert(pixelEq(notGrayishPixel, [0.6, 0.3, 0.4]));
});

test('blackenLow check if pixel values are valid', function() {
  const pixel1 = [0.4, 1, 0.2];
  const pixel2 = [0.3, 0.7, 0.1];
  const outputPixel1 = blackenLow(pixel1);
  const outputPixel2 = blackenLow(pixel2);
  assert(pixelEq(outputPixel1, [0.4, 1, 0])); // only pixels with values less than 1/3 will be changed to 0
  assert(pixelEq(outputPixel2, [0, 0.7, 0])); // only pixels with values less than 1/3 will be changed to 0
});

test('shiftRGB check if pixel values are shifted', function() {
  const pixel = [1, 0.5, 0];
  const shiftedPixel = shiftRGB(pixel);
  assert(pixelEq(shiftedPixel, [0.5, 0, 1]));
});

test('highlightEdges pixel value returns absolute mean value of pixel(x,y) - pixel(x-1,y)', function() {
  const testImage = lib220.createImage(10, 10, [0.5, 1, 1]);
  testImage.setPixel(3,3, [0, 1, 0.3]);
  highlightEdges(testImage);
  const testImagePixel1 = highlightEdges(testImage).getPixel(5, 5);
  const testImagePixel2 = highlightEdges(testImage).getPixel(4, 3);
  const testImagePixel3 = highlightEdges(testImage).getPixel(0, 0);
  assert(pixelEq(testImagePixel1, [0, 0, 0])); // pixel(4,5) is the same as (5,5) hence it returns [0,0,0]
  assert(pixelEq(testImagePixel2, [0.4, 0.4, 0.4])); // pixel(3,3) is different than (4,3) hence it returns the absolute mean value of pixel(3,3) - pixel(4,3)
  assert(pixelEq(testImagePixel3, [0, 0, 0])); // pixel(-1,0) does not exist, hence it returns [0,0,0]
  // this test also tests diffLeft as highlightEdges returns the correct value only if diffLeft returns the correct value
});

test('combineThree pixel value returns correct pixel value', function() {
  const inputPixel1 = [0.2, 1, 0.8];
  const outputPixel1 = shiftRGB(blackenLow(makeGrayish(inputPixel1)));
  const inputPixel2 = [0.1, 0.5, 0.34];
  const outputPixel2 = shiftRGB(blackenLow(makeGrayish(inputPixel2)));
  const testImage1 = lib220.createImage(10, 10, [0.2, 1, 0.8]);
  const testImage2 = lib220.createImage(10, 10, [0.1, 0.5, 0.34]);
  const outputImage1 = combineThree(testImage1);
  const outputImage2 = combineThree(testImage2);
  assert(pixelEq(outputImage1.getPixel(5, 5), outputPixel1));
  assert(pixelEq(outputImage1.getPixel(5, 5), [0.666666, 0.666666, 0.666666]));
  assert(pixelEq(outputImage2.getPixel(5, 5), outputPixel2));
  assert(pixelEq(outputImage2.getPixel(5, 5), [0, 0, 0]));
  // this test also tests reduceFunctions as combineThree returns the correct value only if reduceFunctions can be called correctly
});