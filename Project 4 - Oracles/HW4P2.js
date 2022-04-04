// Durstenfeld shuffle - modern version of the Fisher-Yates shuffle
// https://en.wikipedia.org/wiki/Fisher%E2%80%93Yates_shuffle
function shuffle(a) {
  for (let i = a.length - 1; i > 0; --i) {
    let j = Math.floor(Math.random() * (i + 1));
    let temp = a[i];
    a[i] = a[j];
    a[j] = temp;
  }
  return a;
}

function generateInput(n) {
  function generateInputHelper() {
    let innerArray = Array.create(n, 0);
    for (let i = 0; i < n; ++i) {
      innerArray[i] = i;
    }
    return shuffle(innerArray);
  }
  let outerArray = [];
  generateInputHelper().forEach((x => {
    outerArray.push(generateInputHelper());
  }));
  return outerArray;
}

function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
}

// type Offer = { from: number, to: number, fromCo: boolean }
// type Run = { trace: Offer[], out: Hire[] }

/*
An offer is a triple with two numbers from 0 to n-1 identifying the proposer and the recipient,
and a boolean fromCo; if fromCo is true, the proposer is a company, otherwise a candidate.
A run is a sequence of offers, together with an outcome, which is a matching (like at point 2).
*/

// runOracle(f: (companies: number[][], candidates: number[][]) => Run): void
function runOracle(f) {
  let numTests = 20; // Change this to some reasonably large value.
  for (let i = 0; i < numTests; ++i) {
    let n = 6; // Change this to some reasonable size
    let companies = generateInput(n);
    let candidates = generateInput(n);
    let hires = f(companies, candidates);
    test('Companies and candidates length is correct', function() {
      assert(companies.length === candidates.length);
    });
    test('Duplicates do not exist in Trace', function() {
      function findingDuplicates(a) {
        return a.some(function(item) {
          return a.indexOf(item) !== a.lastIndexOf(item);
        });
      }
      let duplicateOffers = findingDuplicates(hires.trace);
      assert(duplicateOffers === false);
    });
  }
}

console.log(generateInput(4));
const oracleLib = require('oracle');
runOracle(oracleLib.traceWheat1);
runOracle(oracleLib.traceChaff1);