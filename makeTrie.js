const fs = require('fs');
const words = fs.readFileSync('resources/words-updated', 'utf-8').split(/\r?\n/);

function makeTrie(words) {
  let trie = {};

  function makeTrieEntry(trie, chars, depth) {
    if (chars.length < depth) {
      return {
        word: true
      };
    }

    const key = chars.slice(0, depth).join('');

    if (typeof trie[key] === 'undefined') {
      trie[key] = {};
    }

    trie[key] = makeTrieEntry(trie[key], chars, depth + 1);

    return trie;
  }

  for (let word of words) {
    const lc = word.toLowerCase();
    trie = makeTrieEntry(trie, lc.split(''), 1);
  }

  return trie;
}

const trie = makeTrie(words);

fs.writeFileSync('resources/words-updated-trie.json', JSON.stringify(trie));
