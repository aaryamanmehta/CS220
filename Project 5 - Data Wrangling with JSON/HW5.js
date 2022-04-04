class FluentRestaurants {
  constructor(jsonData) {
    this.data = jsonData;
  }
  // fromState(stateStr: string): FluentRestaurants
  fromState(stateStr) {
    return new FluentRestaurants(this.data.filter(function(x) {
      if(lib220.getProperty(x, "state").found){
        return lib220.getProperty(x, "state").value === stateStr;
      }
    }));
  }
  // ratingLeq(rating: number): FluentRestaurants
  ratingLeq(rating) {
    return new FluentRestaurants(this.data.filter(function(x) {
        return (lib220.getProperty(x, "stars").found && lib220.getProperty(x, "stars").value <= rating);
    }));
  }
  // ratingGeq(rating: number): FluentRestaurants
  ratingGeq(rating) {
    return new FluentRestaurants(this.data.filter(function(x) {
      return (lib220.getProperty(x, "stars").found && lib220.getProperty(x, "stars").value >= rating);
    }));
  }
  // category(categoryStr: string): FluentRestaurants
  category(categoryStr) {
    return new FluentRestaurants(this.data.filter(function(x) {
      if (lib220.getProperty(x, "categories").found) {
        for (let a = 0; a < lib220.getProperty(x, "categories").value.length; ++a) {
          if (lib220.getProperty(x, "categories").value[a] === categoryStr) {
            return true;
          }
        }
      }
      else {
        return false;
      }
    }));
  }
  // hasAmbience(ambienceStr: string): FluentRestaurants
  hasAmbience(ambienceStr) {
    return new FluentRestaurants(this.data.filter(function(x) { 
      if (lib220.getProperty(x, "Attributes").found && lib220.getProperty(x.Attributes, "Ambience").found) {
        if (lib220.getProperty(lib220.getProperty(lib220.getProperty(x, "Attributes").value, "Ambience").value, ambienceStr).found
        && lib220.getProperty(lib220.getProperty(lib220.getProperty(x, "Attributes").value, "Ambience").value, ambienceStr).value) {
          return true;
        }
      }
      else {
        return false;
      }
    }));
  }
  // bestPlace(): Restaurant | {}
  bestPlace() {
    let best = {};
    this.data.map(function(x) {
      let bestValue = 0;
      if (lib220.getProperty(best, "stars").found) {
        bestValue = lib220.getProperty(best, "stars").value;
      }
      let currentValue = 0;
      if (lib220.getProperty(x, "stars").found) {
        currentValue = lib220.getProperty(x, "stars").value;
      }
      if (currentValue > bestValue) {
        best = x;
      }
      else if (currentValue === bestValue) {
        let bestNumReview = 0;
        if (lib220.getProperty(best, "review_count").found) {
          bestNumReview = lib220.getProperty(best, "review_count").value;
        }
        let currentNumReview = 0;
        if (lib220.getProperty(x, "review_count").found) {
          currentNumReview = lib220.getProperty(x, "review_count").value;
        }
        if (currentNumReview > bestNumReview) {
          best = x;
        }
        if (currentNumReview === bestNumReview) {
          best = best;
        }
        if (currentNumReview < bestNumReview) {
          best = {};
        }
      }
    });
    return best;
  }
  // mostReviews(): Restaurant | {}
  mostReviews() {
    let mostReviewed = {};
    this.data.map(function(x) {
      let mostReviewedValue = 0;
      if (lib220.getProperty(mostReviewed, "review_count").found) {
        mostReviewedValue = lib220.getProperty(mostReviewed, "review_count").value;
      }
      let currentValue = 0;
      if (lib220.getProperty(x, "review_count").found) {
        currentValue = lib220.getProperty(x, "review_count").value;
      }
      if (currentValue > mostReviewedValue) {
        mostReviewed = x;
      }
      else if (currentValue === mostReviewedValue) {
        let mostReviewedNumReview = 0;
        if (lib220.getProperty(mostReviewed, "stars").found) {
          mostReviewedNumReview = lib220.getProperty(mostReviewed, "stars").value;
        }
        let currentNumReview = 0;
        if (lib220.getProperty(x, "stars").found) {
          currentNumReview = lib220.getProperty(x, "stars").value;
        }
        if (currentNumReview > mostReviewedNumReview) {
          mostReviewed = x;
        }
        if (currentNumReview === mostReviewedNumReview) {
          mostReviewed = mostReviewed;
        }
        if (currentNumReview < mostReviewedNumReview) {
          mostReviewed = {};
        }
      }
    });
    return mostReviewed;
  }
}

// Tests
let data = lib220.loadJSONFromURL('https://people.cs.umass.edu/~joydeepb/yelp.json');
let f = new FluentRestaurants(data);
f.ratingLeq(5)
  .ratingGeq(3)
  .category('Restaurants')
  .hasAmbience('casual')
  .fromState('NV')
  .bestPlace();
f.ratingLeq(4)
  .ratingGeq(2)
  .category('Restaurants')
  .hasAmbience('romantic')
  .fromState('AZ')
  .bestPlace();

test("Usage for getProperty", function() {
  let obj = { x: 42, y: "hello"};
  assert(lib220.getProperty(obj, 'x').found === true);
  assert(lib220.getProperty(obj, 'x').value === 42);
  assert(lib220.getProperty(obj, 'y').value === "hello");
  assert(lib220.getProperty(obj, 'z').found === false);
});

const testData = [
  {
    name: "Applebee's",
    state: "NC",
    stars: 4,
    review_count: 6,
  },
  {
    name: "China Garden",
    state: "NC",
    stars: 4,
    review_count: 10,
  },
  {
    name: "Beach Ventures Roofing",
    state: "AZ",
    stars: 3,
    review_count: 30,
  },
  {
    name: "Alpaul Automobile Wash",
    state: "NC",
    stars: 3,
    review_count: 30, 
  }
]

test('fromState filters correctly', function() {
  let tObj = new FluentRestaurants(testData);
  let list = tObj.fromState('NC').data;
  assert(list.length === 3);
  assert(list[0].name === "Applebee's");
  assert(list[1].name === "China Garden");
  assert(list[2].name === "Alpaul Automobile Wash");
});

test('bestPlace tie-breaking', function() {
  let tObj = new FluentRestaurants(testData);
  let place = tObj.fromState('NC').bestPlace();
  assert(place.name === 'China Garden');
});