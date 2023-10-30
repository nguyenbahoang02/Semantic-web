const removeNonAlphanumeric = (inputString) => {
  const alphanumericString = inputString.replace(/[^0-9a-zA-Z]/g, "");
  return alphanumericString;
};

const removeFilter = (inputString) => {
  return inputString.replace(/\([^)]*\)/g, "");
};

const getSubString = (input) => {
  const regex = /(.*)\s*{/;
  const match = input.match(regex);
  if (match) {
    return match[1].trim();
  } else {
    return null;
  }
};

const removeDuplicates = (arr) => {
  const uniqueArr = [];
  for (let str of arr) {
    if (!uniqueArr.includes(str)) {
      uniqueArr.push(str);
    }
  }
  return uniqueArr;
};

export function getLabel(query) {
  const regex = /\?(.*?)\s/g;
  var label;
  if (query.includes("*")) {
    label = removeFilter(query);
  } else label = getSubString(query);
  console.log(label);
  const matches = [...label.matchAll(regex)];

  if (matches) {
    const variables = matches.map((match) => removeNonAlphanumeric(match[1]));
    return removeDuplicates(variables);
  }

  return [];
}
