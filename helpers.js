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

const hasVisited = (visitorId, visitors) => {
  for(const visitor of visitors){
    if(visitor.visitorId === visitorId){
      return true;
    }
  }
  return false;
}

const urlsForUser = (userId, urlDatabase) => {
  const URLs = {};
  for (const shortURL in urlDatabase) {
    if (urlDatabase[shortURL].userId === userId) {
      URLs[shortURL] = urlDatabase[shortURL].longURL;
    }
  }
  return URLs;
};

module.exports = { generateRandomString, getUserByEmail, urlsForUser, hasVisited };