const fs = require('fs').promises;
const readme = require('./readme');

const msInOneDay = 1000 * 60 * 60 * 24;

const today = new Date();

function generateNewREADME() {
  const readmeRow = readme.split('\n');

  function updateIdentifier(identifier, replaceText) {
    const identifierIndex = findIdentifierIndex(readmeRow, identifier);
    if (identifierIndex === -1) return; // Check if identifier exists
    readmeRow[identifierIndex] = readmeRow[identifierIndex].replace(
      `<#${identifier}>`,
      replaceText
    );
  }

  const identifierToUpdate = {
    day_before_new_years: getDBNWSentence(),
    today_date: getTodayDate(),
    gabot_signing: getGabotSigning(),
  };

  Object.entries(identifierToUpdate).forEach(([key, value]) => {
    updateIdentifier(key, value);
  });

  return readmeRow.join('\n');
}

const moodByDay = {
  0: 'love',
  1: 'hate',
  2: 'wickedness',
  3: 'pleasure',
  4: 'wickedness',
  5: 'cruelty',
  6: 'horror',
};

function getGabotSigning() {
  const mood = moodByDay[today.getDay()];
  return `🤖 This README.md is updated with ${mood}, by Gabot ❤️`;
}

function getTodayDate() {
  return today.toDateString();
}

function getMyself() {
  // test if we are in a PAIR DAY
  return today.getDate() % 2 === 0
    ? Math.floor(Math.random() * 2)
      ? 'penguin 🐧'
      : 'bear 🐻'
    : 'penguin bear 🐧🐻';
}

function getDBNWSentence() {
  const nextYear = today.getFullYear() + 1;
  const nextYearDate = new Date(nextYear, 0, 1);
  const timeUntilNewYear = nextYearDate - today;
  const dayUntilNewYear = Math.floor(timeUntilNewYear / msInOneDay);

  return `**${dayUntilNewYear} days before ${nextYear} ⏱**`;
}

const findIdentifierIndex = (rows, identifier) =>
  rows.findIndex((r) => r.includes(`<#${identifier}>`));

const updateREADMEFile = (text) => fs.writeFile('./README.md', text, 'utf-8');

async function main() {
  try {
    const newREADME = generateNewREADME();
    console.log(newREADME);
    await updateREADMEFile(newREADME);
  } catch (error) {
    console.error('An error occurred:', error);
  }
}

main();