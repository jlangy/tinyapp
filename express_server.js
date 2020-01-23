const express = require('express');
const methodOverride = require('method-override');
const app = express();
const bodyParser = require('body-parser');
const cookieSession = require('cookie-session');
const PORT = 8080;
const urlRouter = require('./routes/urls');
const { urlDatabase, users } = require('./data');
const { generateRandomString, getUserByEmail } = require('./helpers');
const bcrypt = require('bcrypt');

app.use(methodOverride('_method'));
app.use(bodyParser.urlencoded({extended: true}));
app.use(cookieSession({
  name: 'session',
  keys: ['key1', 'key2']
}));
app.set('view engine', 'ejs');

//URL routes
app.use('/urls', urlRouter);


//User login/logout and registration routes
app.get('/register', (req,res) => {
  const userId = req.session.userId;
  if (userId) {
    return res.redirect('/urls');
  }
  const templateVars = { user: users[req.session.userId], error: null};
  res.render('register', templateVars);
});

app.get('/login', (req,res) => {
  const userId = req.session.userId;
  if (userId) {
    return res.redirect('/urls');
  }
  const templateVars = { user: users[req.session.userId], error: null};
  res.render('login', templateVars);
});

app.post('/login', (req,res) => {
  const { email, password } = req.body;
  if (!email || !password) {
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
});

app.post('/register', (req,res) => {
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
});

app.post('/logout', (req,res) => {
  req.session.userId = null;
  res.redirect('/login');
});

//External Links and catchall routes

app.get('/u/:shortURL', (req,res) => {
  const shortURL = req.params.shortURL;
  if (!urlDatabase[shortURL]) {
    return res.render('not_found', {user: users[req.session.userId]});
  }
  urlDatabase[shortURL].visits += 1;
  let visitorId = req.session.visitorId;
  if (!visitorId) {
    visitorId = generateRandomString(6);
    req.session.visitorId = visitorId;
    urlDatabase[shortURL].uniqueVisits += 1;
  }
  const time = new Date().toUTCString();
  urlDatabase[shortURL].visitors.push({ visitorId, time});
  res.redirect(urlDatabase[shortURL].longURL);
});

app.get("/", (req,res) => {
  if (users[req.session.userId]) {
    return res.redirect('/urls');
  }
  res.redirect('/login');
});

app.get('*', (req,res) => {
  res.redirect('/urls');
});

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}`);
});
