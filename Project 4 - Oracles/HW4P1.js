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

// oracle(f: (companies: number[][], candidates: number[][]) => Hire[]): void
/*
Properties of stable matching, test them to wheat1 and chaff1.

Hire is an array of : { company: number, candidate: number }; where number denotes the array from 0 to n-1.

The program’s generated “hires” are stable if there do not exist two matched
pairs, where a company from one pair and a candidate from the other pair both prefer each
other to their current match (the preferences of their current partners don’t matter).

Assert false: 
1) There is an element A of the first matched set which prefers some given element B of the second matched
set over the element to which A is already matched, and
2) B also prefers A over the element to which B is already matched.

Assert true:
1) There does not exist any match (A, B) which both prefer each other to their current partner under the matching.
2) Every element in the input must also exist in the output
*/
function oracle(f) {
  let numTests = 20; // Change this to some reasonably large value.
  for (let i = 0; i < numTests; ++i) {
    let n = 6; // Change this to some reasonable size
    let companies = generateInput(n);
    let candidates = generateInput(n);
    let hires = f(companies, candidates);
    test('Hires length is correct', function() {
      assert(companies.length === hires.length);
    });
    test('Duplicates do not exist in companies, candidates, or hires', function() {
      function findingDuplicates(a) {
        return a.some(function(item) {
          return a.indexOf(item) !== a.lastIndexOf(item);
        });
      }
      let duplicateCompanies = findingDuplicates(companies);
      let duplicateCandidates = findingDuplicates(candidates);
      let duplicateHires = findingDuplicates(hires);
      assert(duplicateCompanies === false);
      assert(duplicateCandidates === false);
      assert(duplicateHires === false);
    });
    test('Stable matching valid', function() {
      for(let i = 0; i < n; ++i) {
        let currentCompany = companies[hires[i].company];
        let currentCandidate = candidates[hires[i].candidate]; 
        for(let j = 0; j < n; ++j) { 
          let nextCandidate = candidates[hires[j].candidate]; 
          let currentRank = currentCompany.indexOf(hires[i].candidate); 
          let currentRank2 = currentCompany.indexOf(hires[j].candidate); 
            let candidateRank = nextCandidate.indexOf(hires[i].company); 
          let candidateRank2 = nextCandidate.indexOf(hires[j].company); 
          assert(!(currentRank2 < currentRank && candidateRank < candidateRank2));
        }
      }
    });
  }
}

console.log(generateInput(4));
oracle(wheat1);
oracle(chaff1);