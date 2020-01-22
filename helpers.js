const { urlDatabase, users } = require('./data');

const generateRandomString = (numOfDigits) => {
  const alphaNums = 'QWERTYUIOPLKJHGFDSAZXCVBNMqwertyuioplkjhgfdsazxcvbnm1234567890'.split('');
  let randomNum = '';
  for(let i = 0; i < numOfDigits; i++){
    const randomIndex = Math.floor(Math.random()*62);
    randomNum += alphaNums[randomIndex];
  }
  return randomNum;
}

const getUserIdFromEmail = email => {
  for(user in users){
    if(users[user].email === email){
      return user;
    }
  } return false;
}

const fetchUserURLs = userID => {
  const URLs = {};
  for(shortURL in urlDatabase){
    if(urlDatabase[shortURL].userID === userID){
      URLs[shortURL] = urlDatabase[shortURL].longURL;
    }
  }
  return URLs;
}

module.exports = { generateRandomString, getUserIdFromEmail, fetchUserURLs };