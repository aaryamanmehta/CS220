// Assigning variable 'robot' to the image
let robot = lib220.loadImageFromURL('https://people.cs.umass.edu/~joydeepb/robot.jpg');

// imageMapXY(img: Image, func: (img: Image, x: number, y: number) => Pixel): Image
function imageMapXY(img, func) {
  let newImg = img.copy();
  for (let x = 0; x < newImg.width; ++x) {
    for (let y = 0; y < newImg.height; ++y) {
      let functionCall = func(newImg, x, y);
      newImg.setPixel(x, y, functionCall);
    } 
  }
  return newImg;
}

// imageMask(img: Image, cond: (img: Image, x: number, y: number) => boolean, maskValue: Pixel): Image
function imageMask(img, cond, maskValue) {
  let imageMapXYCall = imageMapXY(img, function(img, x, y) {
    if (cond(img, x, y) === true) {
      return maskValue;
    }
    if (cond(img, x, y) === false) {
      return img.getPixel(x, y);
    }
  });
  return imageMapXYCall;
}

// imageMapCond(img: Image, cond: (img: Image, x: number, y: number) => boolean, func: (p: Pixel) => Pixel): Image
function imageMapCond(img, cond, func) {
  let imageMapXYCall = imageMapXY(img, function(img, x, y) {
    if (cond(img, x, y) === true) {
     return func(img.getPixel(x, y));
    }
    if (cond(img, x, y) === false) {
      return img.getPixel(x, y);
    }
  });
  return imageMapXYCall;
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

// makeGrayish(img: Image) : Image
function makeGrayish(img) {
  let imageMapXYCall = imageMapXY(img, function(img, x, y) {
    let p = img.getPixel(x, y);
    if (isGrayish(p) === true) {
     return img.getPixel(x, y);
    }
    if (isGrayish(p) === false) {
      let avg = (p[0] + p[1] + p[2])/3;
      return [avg, avg, avg];
    }
  });
  return imageMapXYCall;
}

// grayHalfHelper(img: Image, x: number, y: number) : Pixel
function grayHalfHelper(img, x, y) {
  let p = img.getPixel(x, y);
  if (isGrayish(p) === true) {
    return img.getPixel(x, y);
  }
  if (isGrayish(p) === false) {
    let avg = (p[0] + p[1] + p[2])/3;
    return [avg, avg, avg];
  }
}

// grayHalfImage(img: Image): Image
function grayHalfImage(img) {
  return imageMapXY(img, function(img, x, y) {
    if (y < (1/2*img.height)) {
      return grayHalfHelper(img, x, y);
    }
    return img.getPixel(x, y);
  });
}

// blackenLow(img: Image) : Image
function blackenLow(img) {
  return imageMapXY(img, function(img, x, y) {
    let p = img.getPixel(x, y); 
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
  });
}

// Calling all functions and displaying them
robot.show();

imageMapXY(robot, function(img, x, y) {
  const c = img.getPixel(x, y);
  return [c[0], 0, 0];
}).show();

imageMask(robot, function(img, x, y) {
  return (y % 10 === 0); }, [1, 0, 0]).show();

imageMapCond(robot, function(img, x, y) {
  return (x % 10 === 0);
}, function(p) {
  return [0, 1, 1];
}).show();

makeGrayish(robot).show();

grayHalfImage(robot).show();

blackenLow(robot).show();

// Tests
test('imageMapXY function definition is correct', function() {
  function identity(image, x, y) { return image.getPixel(x, y); }
  let inputImage = lib220.createImage(10, 10, [0, 0, 0]);
  let outputImage = imageMapXY(inputImage, identity);
  let p = outputImage.getPixel(0, 0); // output should be an image, getPixel works
  assert(p.every(c => c === 0)); // every pixel channel is 0
  assert(inputImage !== outputImage); // output should be a different image object
});

function pixelEq (p1, p2) {
  const epsilon = 0.002; // increase for repeated storing & rounding
  return [0,1,2].every(i => Math.abs(p1[i] - p2[i]) <= epsilon);
};

test('identity function with imageMapXY', function() {
  let identityFunction = function(image, x, y ) {
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

test('imageMask function definition and identity function is correct', function() {
  let inputImage = lib220.createImage(10, 10, [0, 0, 0]);
  function identity(img, x, y) { 
    return (y % 10 === 0);
  };
  let outputImage = imageMask(inputImage, identity, [1, 0, 0]);
  let changedPixel = outputImage.getPixel(0, 0);
  let unchangedPixel = outputImage.getPixel(0, 1);
  assert(pixelEq(changedPixel, [1, 0, 0])); // at position y = 0, pixel values must be changed as per identity function
  assert(pixelEq(unchangedPixel, [0, 0, 0])) // at position y = 1, pixel values must be unchanged as per identity function
  assert(inputImage !== outputImage); // output should be a different image object
});

test('imageMapCond function definition and identity function is correct', function() {
  let inputImage = lib220.createImage(10, 10, [0, 0, 0]);
  function identity(img, x, y) {
    return (x % 10 === 0);
  };
  let outputImage = imageMapCond(inputImage, identity, function(p) { return [0, 1, 1]; });
  let changedPixel = outputImage.getPixel(0, 0);
  let unchangedPixel = outputImage.getPixel(1, 0);
  assert(pixelEq(changedPixel, [0, 1, 1])); // at position x = 0, pixel values must be changed as per identity function
  assert(pixelEq(unchangedPixel, [0, 0, 0])) // at position x = 1, pixel values must be unchanged as per identity function
  assert(inputImage !== outputImage); // output should be a different image object
});

test('isGrayish function is valid', function() {
  const testPixel1 = [0.2, 1, 0.8];
  const testPixel2 = [0, 0, 0];
  const testPixel3 = [1, 1, 0.7];
  const testPixel4 = [1, 1, 0.6];
  assert(isGrayish(testPixel1) === false);
  assert(isGrayish(testPixel2) === true);
  assert(isGrayish(testPixel3) === true);
  assert(isGrayish(testPixel4) === false);
});

test('makeGrayish function is valid', function() {
  let inputImage1 = lib220.createImage(10, 10, [0.2, 1, 0.8]);
  let grayishImage = makeGrayish(inputImage1);
  let inputImage2 = lib220.createImage(10, 10, [1, 1, 0.7]);
  let notGrayishImage = makeGrayish(inputImage2);
  /* When makeGrayish is called on an image where all pixels return false when isGrayish is called, the pixel values would be changed
  to the average of RGB channel values */
  assert(pixelEq(grayishImage.getPixel(5, 5), [2/3, 2/3, 2/3]));
  // When makeGrayish is called on an image where all pixels return true when isGrayish is called, the pixel values would be unchanged
  assert(pixelEq(notGrayishImage.getPixel(5, 5), [1, 1, 0.7]));
});

test('grayHalfImage function is valid', function() {
  let inputImage1 = lib220.createImage(10, 10, [0.2, 1, 0.8]);
  let halfGrayImage = grayHalfImage(inputImage1);
  let inputImage2 = lib220.createImage(10, 10, [1, 1, 0.7]);
  let notHalfGrayImage = grayHalfImage(inputImage2);
  /* When grayHalfImage is called on an image where all pixels return false when isGrayish is called, the pixel values would be changed
  to the average of RGB channel values at the top half of the image, and unchanged in the bottom half. Note that (0, 0) is the top-left corner */
  assert(pixelEq(halfGrayImage.getPixel(5, 4), [2/3, 2/3, 2/3]));
  assert(pixelEq(halfGrayImage.getPixel(5, 6), [0.2, 1, 0.8]));
  /* When grayHalfImage is called on an image where all pixels return true when isGrayish is called, the pixel values would be unchanged regardless
  of the position of the pixel*/
  assert(pixelEq(notHalfGrayImage.getPixel(5, 4), [1, 1, 0.7]));
  assert(pixelEq(notHalfGrayImage.getPixel(5, 6), [1, 1, 0.7]));
});

test('blackenLow function is valid', function() {
  let inputImage1 = lib220.createImage(10, 10, [0.4, 1, 0.2]);
  let inputImage2 = lib220.createImage(10, 10, [0.3, 0.7, 0.1]);
  let outputImage1 = blackenLow(inputImage1);
  let outputImage2 = blackenLow(inputImage2);
  assert(pixelEq(outputImage1.getPixel(5, 5), [0.4, 1, 0])); // only pixels with values less than 1/3 will be changed to 0
  assert(pixelEq(outputImage2.getPixel(5, 5), [0, 0.7, 0])); // only pixels with values less than 1/3 will be changed to 0
});