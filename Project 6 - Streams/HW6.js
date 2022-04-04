function memo0(f) {
  let r = { evaluated: false };
  return { get: function() {
    if (! r.evaluated) {
      r = { evaluated: true, v: f() }
    }
    return r.v;
  },
  toString: function() {
  return r.evaluated ? r.v.toString() : "<unevaluated>";
  } };
}

let sempty = { isEmpty: () => true, toString: () => "sempty", map: f => sempty, filter: pred => sempty, }

function snode(head, tail) {
  return { 
    isEmpty: () => false,
    head: () => head, tail: tail.get,
    toString: () => "snode(" + head.toString() + ", " + tail.toString() + ")",
    map: f => snode(f(head),
    memo0(() => tail.get().map(f))),
    filter: f => f(head) ? snode(head, memo0(() => tail.get().filter(f))) : tail.get().filter(f)
  }
}

function smap(f, stream) {
  if (stream.isEmpty()) { return sempty; }
  return snode(f(stream.head()),
    memo0(() => smap(f, stream.tail())));
}

function addSeries(s1, s2) {
  if(s1.toString() === "sempty" && s2.toString() === "sempty"){ 
    return sempty;
  }
  else if(s1.toString() === "sempty"){ 
    return snode(s2.head(), memo0(() => addSeries(s2.tail(), s1)));
  }
  else if(s2.toString() === "sempty"){
    return snode(s1.head(), memo0(() => addSeries(s1.tail(), s2)));
  }
  return snode(s1.head() + s2.head(), memo0(() => addSeries(s1.tail(), s2.tail())));
}

function prodSeries(s1, s2) {
  if (s1.isEmpty() || s2.isEmpty()) {
    return sempty;
  }
  let productHead = smap(((x) => x * s1.head()), s2);
  return addSeries(productHead, snode(0, memo0(() => prodSeries(s1.tail(), s2))));
}

function derivSeries(s) {
  function foo(stream, x, power, func) {
    if (stream.isEmpty()) {
      return sempty;
    }
    return snode(func(stream, x, power), memo0(() => foo(stream.tail(), x, ++power, func)));
  }
  return foo(s.tail(), 1, 1, (s, x, power) => s.head() * power);
}

function coeff(s, n) {
  function foo(stream, arr, index) {
    if (stream.isEmpty() || index === n+1) {
      return arr;
    }
    arr.push(stream.head());
    return foo(stream.tail(), arr, ++index);
  }
  return foo(s, [], 0);
}

function evalSeries(s,n) {
  function foo(stream, x, index, total) {
    if (stream.isEmpty() || index === n + 1) { 
      return total;
    }
    total = total + stream.head() * Math.pow(x, index);
    return foo(stream.tail(), x, ++index, total);
  }
  return function (x) {
    return foo(s, x, 0, 0);
  }
}

function rec1Series(f, v) {
  return snode(v, memo0(() => rec1Series(f, f(v))));
}

function expSeries() {
  function foo(n) {
    if (n === 0) {
      return n + 1;
    }
    return (1/n * foo(n - 1));
  }
  function rec2Series(f, v) {
    return snode(f(v), memo0(() => rec2Series(f, ++v)));
  }
  return rec2Series(foo, 0);
}

function recurSeries(coef, init) {
  let c = 0;
  let a = [];
  function foo() {
    if(c < init.length){
      a.push(init[c]);
      ++c;
      return snode(init[c-1], memo0(() => foo()));
    }
    else{
      ++c;
      let total = [];
      for(let i = 0; i < init.length; ++i) {
        let mult = a[a.length - init.length + i];
        total.push(coef[i] * mult);
      }
      a.push(total.reduce((acc, e) => acc + e, 0));
      return snode(a[a.length - 1], memo0(() => foo()));
    }
  }
  return foo();
}