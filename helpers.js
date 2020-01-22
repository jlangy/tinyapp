const generateRandomString = (numOfDigits) => {
  const alphaNums = 'QWERTYUIOPLKJHGFDSAZXCVBNMqwertyuioplkjhgfdsazxcvbnm1234567890'.split('');
  let randomNum = '';
  for (let i = 0; i < numOfDigits; i++) {
    const randomIndex = Math.floor(Math.random() * 62);
    randomNum += alphaNums[randomIndex];
  }
  return randomNum;
};

const getUserByEmail = (email, users) => {
  for (const user in users) {
    if (users[user].email === email) {
      return user;
    }
  }
};

const urlsForUser = (userID, urlDatabase) => {
  const URLs = {};
  for (const shortURL in urlDatabase) {
    if (urlDatabase[shortURL].userID === userID) {
      URLs[shortURL] = urlDatabase[shortURL].longURL;
    }
  }
  return URLs;
};

module.exports = { generateRandomString, getUserByEmail, urlsForUser };