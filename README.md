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
1. Your purpose is not to solve the problem, but to test whether a solution given to you is correct. That is, all code you write will be tests and supporting code for tests.
2. There might be no unique solution. Thus, you will need to test properties of the given solution, and make sure you are considering enough properties so anything that satisfies all of them (i.e., passes all your tests) is correct.

### Part 1

_TODO: implement functions generateInput, oracle._

### Part 2

_TODO: implement function runOracle._

## Data Wrangling with JSON
The goal of the programming task is to define a class FluentRestaurants that supports the fluent design pattern to filter the dataset. We can use this class to perform queries such as “What vegan restaurants are in Wyoming?” Or “Which Mexican restaurants in NY are rated below 2 stars?” The fluent design thus allows the queries to be chained in arbitrary orders, with specified constraints, much like a user might wish to, on the Yelp website, to find specific restaurants of interest.

_TODO: define class FluentRestaurants and implement methods fromState, ratingLeq, ratingGeq, category, hasAmbience, bestPlace, mostReviews._

## Streams

In this assignment, you will work with streams to evaluate power series.
<img src = "https://latex.codecogs.com/svg.latex?s%28x%29%20%3D%20a_%7B%200%7D%20&plus;%20a_%7B%201%7Dx%20&plus;%20a_%7B%202%7Dx%5E2%20&plus;%20...">
