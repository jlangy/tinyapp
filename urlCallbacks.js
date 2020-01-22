const { urlDatabase, users } = require('./data');
const urlsForUser = require('./helpers').urlsForUser;
const generateRandomString = require('./helpers').generateRandomString;

// ---------------GET REQUESTS-------------------------

const browseURLS = (req,res) => {
  const userID = req.session.userId;
  if (userID) {
    const URLs = urlsForUser(userID, urlDatabase);
    const templateVars =  { urls: URLs, user: users[req.session.userId] };
    return res.render('urls_index', templateVars);
  }
  res.render('urls_index', {urls: null, user: null});
};

const readURL = (req,res) => {
  const userID = req.session.userId;
  if (!userID) {
    return res.render('urls_show', {error: 'notLoggedIn'});
  }
  const userURLs = urlsForUser(userID, urlDatabase);
  const shortURL = req.params.shortURL;
  if (shortURL in userURLs) {
    const longURL = userURLs[shortURL];
    const templateVars = { shortURL, longURL, user: users[userID], error: null };
    return res.render('urls_show', templateVars);
  }
  res.render('urls_show', {error: 'notFound', user: users[userID]});
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

//------------------------POST REQUESTS-----------------------

const createURL = (req,res) => {
  const userID = req.session.userId;
  const shortURL = generateRandomString(6);
  if (userID) {
    urlDatabase[shortURL] = { longURL: req.body.longURL, userID };
  }
  res.redirect(`/urls/${shortURL}`);
};

const updateURL = (req,res) => {
  const userID = req.session.userId;
  const shortURL = req.params.shortURL;
  if (urlDatabase[shortURL].userID === userID) {
    urlDatabase[shortURL].longURL = req.body.longURL;
  }
  res.redirect(`/urls/${shortURL}`);
};

const deleteURL = (req,res) => {
  const userID = req.session.userId;
  const shortURL = req.params.shortURL;
  if (urlDatabase[shortURL].userID === userID) {
    delete urlDatabase[shortURL];
  }
  res.redirect('/urls');
};

module.exports = {browseURLS, readURL, linkToExternalURL, renderCreateURLPage, createURL, updateURL, deleteURL };