const { urlDatabase, users } = require('./data');
const { generateRandomString, getUserIdFromEmail } = require('./helpers');
const bcrypt = require('bcrypt');

const login = (req,res) => {
  const { email, password } = req.body;
  if(email === '' || password === ''){ //Note: could switch to required in html, or leave custom bootstrap msg
    res.status(400);
    return res.render('login', { error: 'empty', user: null });
  }
  const userId = getUserIdFromEmail(email);
  if(userId && bcrypt.compareSync(password, users[userId].password)){
    res.cookie('user_id', userId);
    return res.redirect('/urls');
  } 
  res.status(403);
  res.render('login', { error: 'badLogin', user: null });
}

const register = (req,res) => {
  if(!req.body.email || !req.body.password){
    res.status(400);
    return res.render('register', {user: null, error: 'empty'});
  } else if(getUserIdFromEmail(req.body.email)){
    res.status(400);
    return res.render('register', {user: null, error: 'repeat'});
  }
  const userID = generateRandomString(6);
  const passwordHash = bcrypt.hashSync(req.body.password, 10);
  users[userID] = { id: userID, email: req.body.email, password: passwordHash }
  res.cookie("user_id", userID);
  res.redirect('/urls');
}

const createURL = (req,res) => {
  const userID = req.cookies.user_id;
  const shortURL = generateRandomString(6);
  if(userID){
    urlDatabase[shortURL] = { longURL: req.body.longURL, userID };
  }
  res.redirect(`/urls/${shortURL}`);
}

const updateURL = (req,res) => {
  const userID = req.cookies.user_id;
  const shortURL = req.params.shortURL;
  if(urlDatabase[shortURL].userID === userID){
    urlDatabase[shortURL].longURL = req.body.longURL;
  } 
  res.redirect(`/urls/${shortURL}`);
}

const deleteURL = (req,res) => {
  const userID = req.cookies.user_id;
  const shortURL = req.params.shortURL;
  console.log('pinged!');
  if(urlDatabase[shortURL].userID === userID){
    delete urlDatabase[shortURL];
  }
  res.redirect('/urls');
}

const logout = (req,res) => {
  res.clearCookie('user_id');
  res.redirect('/urls');
}

module.exports = { login, register, createURL, updateURL, deleteURL, logout }

