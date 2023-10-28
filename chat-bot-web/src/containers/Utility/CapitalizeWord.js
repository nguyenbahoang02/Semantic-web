export function removeDiacritics(input) {
  return input.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
}

export function capitalizeWords(input) {
  // const words = removeDiacritics(input).replace(/-/g, " ").split(/\s+/);
  const words = input.replace(/-/g, " ").replace(/_/g, " ").split(/\s+/);
  const capitalizedWords = words.map((word) => {
    if (word.length > 0) {
      const firstLetter = word[0].toUpperCase();
      const restOfWord = word.slice(1).toLowerCase();
      return firstLetter + restOfWord;
    }
    return word;
  });

  return capitalizedWords.join(" ");
}
