
const users = require('./data').users;
const { generateRandomString, getUserByEmail } = require('./helpers');
const bcrypt = require('bcrypt');

//---------------------------GET REQUESTS-----------------------

const renderRegisterPage = (req,res) => {
  const templateVars = { user: users[req.session.userId], error: null};
  res.render('register', templateVars);
};

const renderLoginPage = (req,res) => {
  const templateVars = { user: users[req.session.userId], error: null};
  res.render('login', templateVars);
};

//------------------------POST REQUESTS------------------------------

const login = (req,res) => {
  const { email, password } = req.body;
  if (!email || !password) { //Note: could switch to required in html, or leave custom bootstrap msg
    res.status(400);
    return res.render('login', { error: 'empty', user: null });
  }
  const userId = getUserByEmail(email, users);
  if (userId && bcrypt.compareSync(password, users[userId].password)) {
    req.session.userId = userId;
    return res.redirect('/urls');
  }
  res.status(403);
  res.render('login', { error: 'badLogin', user: null });
};

const register = (req,res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    res.status(400);
    return res.render('register', {user: null, error: 'empty'});
  } else if (getUserByEmail(email, users)) {
    res.status(400);
    return res.render('register', {user: null, error: 'repeat'});
  }
  const userId = generateRandomString(6);
  const passwordHash = bcrypt.hashSync(password, 10);
  users[userId] = { id: userId, email, password: passwordHash };
  req.session.userId = userId;
  res.redirect('/urls');
};

const logout = (req,res) => {
  req.session = null;
  res.redirect('/urls');
};

module.exports = { renderRegisterPage, renderLoginPage, login, register, logout };
