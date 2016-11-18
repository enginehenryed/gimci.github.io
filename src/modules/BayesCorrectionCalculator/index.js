var calcBayesCorrection = function () {
  var that = {},
    filter = /([a-z]+)/g,
    alphabets = ['a','b','c','d','e','f','g','h','i','j','k','l','m','n','o','p','q','r','s','t','u','v','w','x','y','z'],
    NWORDS = {}//Training Model

  // trainingText입력시마다 해당 텍스트에대한 빈도수 1증가
  var train = function(trainingText) {
    var features = trainingText.match(filter);
    for(var f in features) {
      var feature = features[f];
      if (NWORDS.hasOwnProperty(feature)) {
        NWORDS[feature] += 1;
      }
      else {
        NWORDS[feature] = 1;
      }
    }
  };
// 삭제, 인접 자리바꾸기, 교체하기, 삽입하기를 수행한 결과물
  var edits1 = function (words) {
    var edits1Set = [];
    for(var w = 0; w < words.length; w++) {
      var word = words[w];
      for (var i = 0; i <= word.length; i++) {
        //splits (a & b)
        var a = word.slice(0,i),
          b = word.slice(i),
          c = b.slice(1),
          d = b.slice(2);
        // if(i != word.length){
        if (b != '') {

          edits1Set.push(a + c);
          //transposes
          if (b.length > 1) {
            edits1Set.push(a + b.charAt(1) + b.charAt(0) + d);
          }
          //replaces & inserts
          for (var j = 0; j < alphabets.length; j++) {
            edits1Set.push(a + alphabets[j] + c);//replaces
            edits1Set.push(a + alphabets[j] + b);//inserts
          }
        }
        else {
          //inserts (remaining set for b == '')
          for (var j = 0; j < alphabets.length; j++) {
            edits1Set.push(a + alphabets[j] + b);
            console.log("a", a, "b", b);
          }
        }
      }
    }
    return edits1Set;
  };

  var edits2 = function (words) {
    return edits1(edits1(words));
  };


  Object.prototype.isEmpty = function () {
    var that = this;
    for(var prop in that) {
      if(that.hasOwnProperty(prop))
        return false;
    }
    return true;
  };

  Function.prototype.curry = function () {
    var slice = Array.prototype.slice,
      args = slice.apply(arguments),
      that = this;
    return function () {
      return that.apply(null, args.concat(slice.apply(arguments)));
    };
  };

  // 입력값값이 트레인된값에존재하면 해당 정보 리턴
  var known = function () {
    var knownSet = {};
    for (var i = 0; knownSet.isEmpty() && i < arguments.length; i++) {
      var words = arguments[i];
      for (var j = 0; j < words.length; j++) {
        var word = words[j];
        if (!knownSet.hasOwnProperty(word) && NWORDS.hasOwnProperty(word)) {
          knownSet[word] = NWORDS[word];
        }
      }
    }
    return knownSet;
  };

  var max = function(candidates) {
    var maxCandidateKey = null,
      maxCandidateVal = 0,
      currentCandidateVal;
    for (var candidate in candidates) {
      currentCandidateVal = candidates[candidate];
      if (candidates.hasOwnProperty(candidate) && currentCandidateVal > maxCandidateVal) {
        maxCandidateKey = candidate;
        maxCandidateVal = currentCandidateVal;
      }
    }
    return maxCandidateKey;
  };

  var correct = function () {
    var corrections = {};
    for (var i = 0; i < arguments.length; i++) {
      var word = arguments[i];
      // 인풋자체, 1번 수정한거, 2번수정한 결과물들중에 트레인된 데이터와 일치하는것들을 후보로 가져옴
      var candidates = known.curry()([word],edits1([word]),edits2([word]));
      // 후보들중 가장큰 예상값을 가진놈이 아웃풋으로 나옴
      corrections[word] = candidates.isEmpty() ? word : max(candidates);
    }
    return corrections;
  };

  that.train = train;
  that.correct = correct.curry();

  that.edits1 = edits1;
  that.edits2 = edits2;
  return that;
};
export default calcBayesCorrection;


