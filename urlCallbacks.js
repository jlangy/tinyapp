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
    return res.render('urls_show', {error: 'notLoggedIn', user: null, visits: null, uniqueVisits: null, visitors: null});
  }
  const userURLs = urlsForUser(userId, urlDatabase);
  const shortURL = req.params.shortURL;
  if (shortURL in userURLs) {
    const urlObj = urlDatabase[shortURL];
    const longURL = userURLs[shortURL];
    const templateVars = { shortURL, longURL, user: users[userId], error: null, visits: urlObj.visits, uniqueVisits: urlObj.uniqueVisits, visitors: urlObj.visitors};
    return res.render('urls_show', templateVars);
  }
  res.status(404);
  res.render('urls_show', {error: 'notFound', user: users[userId], visits: null,  visitors: null});
};

const linkToExternalURL = (req,res) => {
  const shortURL = req.params.shortURL;
  if(!urlDatabase[shortURL]){
    return res.render('not_found', {user: users[req.session.userId]});
  }
  urlDatabase[shortURL].visits += 1;
  let visitorId = req.session.visitorId;
  if(!visitorId){
    visitorId = generateRandomString(6);
    req.session.visitorId = visitorId;
    urlDatabase[shortURL].uniqueVisits += 1;
  }
  const time = new Date().toUTCString();
  urlDatabase[shortURL].visitors.push({ visitorId, time});
  res.redirect(urlDatabase[shortURL].longURL);
};

const renderCreateURLPage = (req,res) => {
  if (users[req.session.userId]) {
    const templateVars = { user: users[req.session.userId], error: null };
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
    urlDatabase[shortURL] = { longURL: req.body.longURL, userId: userId, visits: 0, uniqueVisits: 0, visitors: [] };
  }
  res.redirect(`/urls/${shortURL}`);
};

const updateURL = (req,res) => {
  const userId = req.session.userId;
  const shortURL = req.params.shortURL;
  if (urlDatabase[shortURL] && urlDatabase[shortURL].userId === userId) {
    urlDatabase[shortURL].longURL = req.body.longURL;
    return res.redirect(`/urls/${shortURL}`);
  }
  res.sendStatus(404);
};

const deleteURL = (req,res) => {
  const userId = req.session.userId;
  const shortURL = req.params.shortURL;
  if (urlDatabase[shortURL] && urlDatabase[shortURL].userId === userId) {
    delete urlDatabase[shortURL];
  }
  res.sendStatus(404);
};

module.exports = {browseURLS, readURL, linkToExternalURL, renderCreateURLPage, createURL, updateURL, deleteURL, showJSON };