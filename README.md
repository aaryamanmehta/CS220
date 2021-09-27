# CS220
 
## Image Processing
The goal of this assignment is to introduce you to the basic features of JavaScript, such as functions, variables, conditionals, and loops. You should already be familiar with these concepts from other programming languages (e.g., Java). You will use these features to write several image processing functions (e.g., blur, sharpen, and adjust brightness).

## More Higher-Order Functions for Image Processing
You have already used higher order functions for two image processing tasks in Project 1. In Project 2 you will perform all four image processing tasks from Project 1 with higher order functions. You will also use reduce to compose several processing functions. In the rest of this document, we use the types Pixel and Image to describe our functions:
1. A Pixel is a three-element array, where each element is a number in the range 0.0 to 1.0 inclusive.
2. An Image is an object whose 2D array of Pixels is accessed via gePixel / setPixel.
