const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const PORT = 8080;

const urlDatabase = {
  'b2xVn2': 'http://www.lighthouselabs.ca',
  '9sm5xK': 'http://www.google.com'
};

const users = {
  123: {
    id: "123",
    email: "email@email.com",
    password: "password123"
  }
}

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
  }
}

const repeatEmail = email => {
  for(user in users){
    if(users[user].email === email){
      console.log('email repeated!');
      return true;
    }
  } return false;
}

app.use(bodyParser.urlencoded({extended: true}));
app.use(cookieParser());
app.set('view engine', 'ejs');

app.get('/', (req,res) => {
  res.send("Hello!");
});

app.get('/urls', (req,res) => {
  const templateVars =  { urls: urlDatabase, user: users[req.cookies.user_id] };
  res.render('urls_index', templateVars);
});

app.get('/urls.json', (req,res) => {
  res.json(urlDatabase);
});

app.get('/urls/new', (req,res) => {
  const templateVars = { user: users[req.cookies.user_id] }
  res.render('urls_new', templateVars);
});

app.get('/urls/:shortURL', (req,res) => {
  const shortURL = req.params.shortURL;
  const longURL = urlDatabase[shortURL];
  const templateVars = { shortURL, longURL, user: users[req.cookies.user_id] };
  res.render('urls_show', templateVars);
});

app.get('/u/:shortURL', (req,res) => {
  res.redirect(urlDatabase[req.params.shortURL]);
});

app.get('/hello', (req,res) => {
  res.send('<html><body>Hello <b>World</b></body></html>\n');
});

app.get('/register', (req,res) => {
  const templateVars = { user: users[req.cookies.user_id], error: null}
  res.render('register', templateVars);
});

app.get('/login', (req,res) => {
  const templateVars = { user: users[req.cookies.user_id], error: null}
  res.render('login', templateVars);
});

app.post('/login', (req,res) => {
  if(req.body.email === ''){
    return res.render('login', { error: 'empty', user: null });
  }
  const userId = getUserIdFromEmail(req.body.email);
  if(userId){
    if(users[userId].password === req.body.password){
      res.cookie('user_id', getUserIdFromEmail(req.body.email));
      return res.redirect('/urls');
    } 
    res.status(403);
    return res.render('login', { error: 'badPassword', user: null })
  } 
  res.status(403);
  res.render('login', { error: 'notFound', user: null });
});

app.post('/register', (req,res) => {
  if(!req.body.email || !req.body.password){
    res.status(400);
    return res.render('register', {user: null, error: 'empty'});
  } else if(repeatEmail(req.body.email)){
    res.status(400);
    return res.render('register', {user: null, error: 'repeat'});
  }
  const userID = generateRandomString(6);
  users[userID] = { id: userID, email: req.body.email, password: req.body.password }
  res.cookie("user_id", userID);
  res.redirect('/urls');
});

app.post('/urls', (req,res) => {
  const shortURL = generateRandomString(6);
  urlDatabase[shortURL] = req.body.longURL;
  res.redirect(`/urls/${shortURL}`);
});

app.post('/urls/:shortURL', (req,res) => {
  const shortURL = req.params.shortURL;
  urlDatabase[shortURL] = req.body.longURL;
  res.redirect(`/urls/${shortURL}`);
});

app.post('/urls/:shortURL/delete', (req,res) => {
  const shortURL = req.params.shortURL;
  delete urlDatabase[shortURL];
  res.redirect('/urls');
});

app.post('/logout', (req,res) => {
  res.clearCookie('user_id');
  res.redirect('/urls');
});

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}`);
});
