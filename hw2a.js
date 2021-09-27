// Assigning the robot image to a variable 'wallE'
let wallE = lib220.loadImageFromURL("https://people.cs.umass.edu/~joydeepb/robot.jpg");

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

// blurPixel(img: Image, x: number, y: number): Pixel
function blurPixel(img, x, y) {
  let newImg = img.copy();
  let count = 0;
  let red = 0;
  let green = 0;
  let blue = 0;
  if (isInBounds(img.width, img.height, x, y)) {
    count = count + 1;
    let c = img.getPixel(x, y);
    red = red + c[0];
    green = green + c[1];
    blue = blue + c[2];
  }
  if (isInBounds(img.width, img.height, x + 1, y)) {
    count = count + 1;
    let c = img.getPixel(x + 1, y);
    red = red + c[0];
    green = green + c[1];
    blue = blue + c[2];
  }
  if (isInBounds(img.width, img.height, x - 1, y)) {
    count = count + 1;
    let c = img.getPixel(x - 1, y);
    red = red + c[0];
    green = green + c[1];
    blue = blue + c[2];
  }
  if (isInBounds(img.width, img.height, x, y + 1)) {
    count = count + 1;
    let c = img.getPixel(x, y + 1);
    red = red + c[0];
    green = green + c[1];
    blue = blue + c[2];
  }
  if (isInBounds(img.width, img.height, x, y - 1)) {
    count = count + 1;
    let c = img.getPixel(x, y - 1);
    red = red + c[0];
    green = green + c[1];
    blue = blue + c[2];
  }
  if (isInBounds(img.width, img.height, x + 1, y + 1)) {
    count = count + 1;
    let c = img.getPixel(x + 1, y + 1);
    red = red + c[0];
    green = green + c[1];
    blue = blue + c[2];
  }
  if (isInBounds(img.width, img.height, x - 1, y - 1)) {
    count = count + 1;
    let c = img.getPixel(x - 1, y - 1);
    red = red + c[0];
    green = green + c[1];
    blue = blue + c[2];
  }
  if (isInBounds(img.width, img.height, x + 1, y - 1)) {
    count = count + 1;
    let c = img.getPixel(x + 1, y - 1);
    red = red + c[0];
    green = green + c[1];
    blue = blue + c[2];
  }
  if (isInBounds(img.width, img.height, x - 1, y + 1)) {
    count = count + 1;
    let c = img.getPixel(x - 1, y + 1);
    red = red + c[0];
    green = green + c[1];
    blue = blue + c[2];
  }
  red = red / count;
  green = green / count;
  blue = blue / count;
  newImg.setPixel(x, y, [red, blue, green]);
  return newImg.getPixel(x, y);
}

// blurImage(img: Image): Image
function blurImage(img) {
  let imageMapXYCall = imageMapXY(img, function(img, x, y) {
    return blurPixel(img, x, y);
  });
  return imageMapXYCall;
}

// Calling all functions and displaying them
wallE.show();

imageMapXY(wallE, function(img, x, y) {
  const c = img.getPixel(x, y);
  return [c[0], 0, 0];
}).show();

imageMask(wallE, function(img, x, y) {
  return (y % 10 === 0); }, [1, 0, 0]).show();

imageMapCond(wallE, function(img, x, y) {
  return (x % 10 === 0);
}, function(p) {
  return [0, 1, 1];
}).show();

let testImage = lib220.loadImageFromURL("http://www.simpleimageresizer.com/_uploads/photos/b6e1b688/create-pixel-art-images-and-gifs_2_50x50.png");
testImage.show();
blurImage(testImage).show();

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

test('imageMask function definition is correct', function() {
  let inputImage = lib220.createImage(10, 10, [0, 0, 0]);
  function identity(image, x, y) { 
    return (y % 10 === 0);
  }
  imageMask(inputImage, identity, [1, 0, 0]);
  // no assertion, just checks that the code runs to completion
});

test('imageMapCond function definition is correct', function() {
  let inputImage = lib220.createImage(10, 10, [0, 0, 0]);
  imageMapCond(wallE, function(img, x, y) {
    return (x % 10 === 0);
  }, function(p) {
    return [0, 1, 1];
  });
  // no assertion, just checks that the code runs to completion
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


// test('blur function check pixel value at center', function() {
//   const testImage = lib220.createImage(10, 10, [0.5, 0.5, 0.5]);
//   testImage.setPixel(5, 5, [1, 1, 1]);
//   blurImage(testImage);
//   const testImagePixel = blurImage(testImage).getPixel(5, 5);
//   assert(pixelEq(testImagePixel, [0.5, 0.5, 0.5]));
// })

test('blur function check pixel value at corner', function() {
  const testImage = lib220.createImage(10, 10, [0.5, 0.5, 0.5]);
  testImage.setPixel(0, 0, [1, 1, 1]);
  blurImage(testImage);
  const testImagePixel = blurImage(testImage).getPixel(0, 0);
  assert(pixelEq(testImagePixel, [0.625, 0.625, 0.625]));
})