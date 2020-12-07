const fs = require('fs');
const wordTrie = require('./resources/words-updated-trie.json');

function generateValidNextLetters(letterSets) {
  let validLetters = {};

  for (let index in letterSets) {
    for (let letter of letterSets[index]) {
      validLetters[letter] = [];
      for (let subIndex in letterSets) {
        if (subIndex !== index) {
          validLetters[letter] = [
            ...validLetters[letter],
            ...letterSets[subIndex],
          ]
        }
      }
    }
  }

  return validLetters;
}

function generateValidWords(subTrie, currentPath, validLetters, letterMap) {
  if (typeof subTrie[currentPath] === 'undefined') {
    return [];
  }

  let validWords = [];

  if (subTrie[currentPath].word === true) {
    validWords.push(currentPath);
  }

  for (let letter of validLetters) {
    const nextWords = generateValidWords(subTrie[currentPath], `${currentPath}${letter}`, letterMap[letter], letterMap);

    validWords = [
      ...validWords,
      ...nextWords
    ];
  }

  return validWords;
}

function generateAllValidWords(letters, letterMap) {
  let allValidWords = [];
  for (let letter of letters) {
    allValidWords = [
      ...allValidWords,
      ...generateValidWords(wordTrie, letter, letterMap[letter], letterMap)
    ]
  }

  return allValidWords;
}

/* TODO: make this not slow AF */
function findSolution(prevWords, allWords) {
  if (prevWords.length > 3) {
    return [];
  }

  const letterSet = new Set(prevWords.reduce((agg, word) => [
    ...word.split(''),
    ...agg,
  ], []));

  if (letterSet.size >= 12) {
    return prevWords;
  }

  const wordsBeginningWithLastLetter = prevWords.length ? allWords.filter(word => {
    const [lastWord] = prevWords.slice(-1);
    const [lastLetter] = lastWord.split('').slice(-1);

    return word[0] === lastLetter && prevWords.indexOf(word) === -1;
  }) : allWords;
  let solutions = [];

  for (let word of wordsBeginningWithLastLetter) {
    const nextSolutions = findSolution([...prevWords, word], allWords);

    if (nextSolutions.length) {
      if (Array.isArray(nextSolutions[0])) {
        solutions = solutions.concat(nextSolutions);
      } else {
        solutions.push(nextSolutions);
      }
    }
  }

  return solutions;
}

exports.solve = ({ top, left, bottom, right }) => {
  const letterMap = generateValidNextLetters([top, left, bottom, right]);
  const words = generateAllValidWords([
    ...top,
    ...left,
    ...bottom,
    ...right
  ], letterMap);
  let validSolutions = [];

  for (let word of words) {
    const letterSet = new Set([...word.split('')]);

    if (letterSet.size >= 12) {
      console.log('One word solution', word);
      validSolutions.push([word])
    }

    const [lastLetter] = word.split('').slice(-1);
    const wordsBeginningWithLastLetter = words.filter(word => word[0] === lastLetter);

    for (let potentialPairWord of wordsBeginningWithLastLetter) {
      if (potentialPairWord === word) {
        continue;
      }

      const combinedLetterSet = new Set([...word.split(''), ...potentialPairWord.split('')]);
      if (combinedLetterSet.size >= 12) {
        validSolutions.push([word, potentialPairWord]);
      }
    }
  }

  return validSolutions;

  // return findSolution([], words);
}