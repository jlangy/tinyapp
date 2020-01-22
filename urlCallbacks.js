const { urlDatabase, users } = require('./data');
const urlsForUser = require('./helpers').urlsForUser;
const generateRandomString = require('./helpers').generateRandomString;

// ---------------GET REQUESTS-------------------------

const browseURLS = (req,res) => {
  const userId = req.session.userId;
  if (userId) {
    const URLs = urlsForUser(userId, urlDatabase);
    const templateVars =  { urls: URLs, user: users[userId] };
    return res.render('urls_index', templateVars);
  }
  res.render('urls_index', {urls: null, user: null});
};

const readURL = (req,res) => {
  const userId = req.session.userId;
  if (!userId) {
    return res.render('urls_show', {error: 'notLoggedIn'});
  }
  const userURLs = urlsForUser(userId, urlDatabase);
  const shortURL = req.params.shortURL;
  if (shortURL in userURLs) {
    const longURL = userURLs[shortURL];
    const templateVars = { shortURL, longURL, user: users[userId], error: null };
    return res.render('urls_show', templateVars);
  }
  res.render('urls_show', {error: 'notFound', user: users[userId]});
};

const linkToExternalURL = (req,res) => {
  res.redirect(urlDatabase[req.params.shortURL].longURL);
};

const renderCreateURLPage = (req,res) => {
  if (users[req.session.userId]) {
    const templateVars = { user: users[req.session.userId] };
    return res.render('urls_new', templateVars);
  }
  res.redirect('/login');
};

const showJSON = (req, res) => {
  res.json(urlDatabase);
};

//------------------------POST REQUESTS-----------------------

const createURL = (req,res) => {
  const userId = req.session.userId;
  const shortURL = generateRandomString(6);
  if (userId) {
    urlDatabase[shortURL] = { longURL: req.body.longURL, userId: userId };
  }
  res.redirect(`/urls/${shortURL}`);
};

const updateURL = (req,res) => {
  const userId = req.session.userId;
  const shortURL = req.params.shortURL;
  if (urlDatabase[shortURL].userId === userId) {
    urlDatabase[shortURL].longURL = req.body.longURL;
  }
  res.redirect(`/urls/${shortURL}`);
};

const deleteURL = (req,res) => {
  const userId = req.session.userId;
  const shortURL = req.params.shortURL;
  if (urlDatabase[shortURL].userId === userId) {
    delete urlDatabase[shortURL];
  }
  res.redirect('/urls');
};

module.exports = {browseURLS, readURL, linkToExternalURL, renderCreateURLPage, createURL, updateURL, deleteURL, showJSON };