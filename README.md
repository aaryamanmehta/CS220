# CS220
 
My code for the assigned projects of CS220, a course that Develops programming methodology, such as designing, implementing, testing, and modifying larger programs, using JavaScript. Project overviews taken from the instructions provided by the professor are provided below.
 
## Image Processing

The goal of this assignment is to introduce you to the basic features of JavaScript, such as functions, variables, conditionals, and loops. You should already be familiar with these concepts from other programming languages (e.g., Java). You will use these features to write several image processing functions (e.g., blur, sharpen, and adjust brightness).

_TODO: implement functions removeBlueAndGreen, shiftRGB, imageMap, mapToRed, mapToGBR, increaseContrast._

## More Higher-Order Functions for Image Processing

Following up to Project 1, in Project 2 you will perform all processing tasks with higher order functions. As before, we use the types Pixel and Image to specify our functions:
1. A Pixel is a three-element array, where each element is a number in the range 0.0 to 1.0 inclusive.
2. An Image is an object whose 2D array of Pixels is accessed via gePixel / setPixel.

_TODO: implement functions imageMapXY, imageMask, imageMapCond, isGrayish, makeGrayish, grayHalfImage, blackenLow._

## More Image Processing with Higher-Order Functions

Following up to Project 2, in Project 3 you will perform all processing tasks with higher order functions.

_TODO: implement functions blurPixel, blurImage, diffLeft, highlightEdges, reduceFunctions, combineThree._

## Oracles
In this assignment, you will develop an oracle to test (possibly broken) solutions to the Stable Matching Problem. This assignment is different in that:
● Your purpose is not to solve the problem, but to test whether a solution given to you is correct. That is, all code you write will be tests and supporting code for tests.
● There might be no unique solution. Thus, you will need to test properties of the given solution, and make sure you are considering enough properties so anything that satisfies all of them (i.e., passes all your tests) is correct.

### Part 1

_TODO: implement functions generateInput, oracle._

### Part 2

_TODO: implement function runOracle._
