const express = require('express');
const router = express.Router();
const { urlDatabase, users } = require('../data');
const urlsForUser = require('../helpers').urlsForUser;
const generateRandomString = require('../helpers').generateRandomString;

router.get('/new', (req,res) => {
  const user = users[req.session.userId];
  if (user) {
    const templateVars = { user, error: null };
    return res.render('urls_new', templateVars);
  }
  res.redirect('/login');
});

router.get('/:shortURL', (req,res) => {
  const userId = req.session.userId;
  if (!userId) {
    return res.render('urls_show', {error: 'notLoggedIn', user: null});
  }
  const userURLs = urlsForUser(userId, urlDatabase);
  const shortURL = req.params.shortURL;
  if (shortURL in userURLs) {
    const urlObj = urlDatabase[shortURL];
    const templateVars = { shortURL, user: users[userId], error: null,  urlObj };
    return res.render('urls_show', templateVars);
  }
  res.status(404);
  res.render('urls_show', {error: 'notFound', user: users[userId], urlObj: null});
});

router.get('/', (req,res) => {
  const userId = req.session.userId;
  if (!userId) {
    return res.render('urls_index', {URLObjects: null, user: null});
  }
  const userURLs = urlsForUser(userId, urlDatabase);
  const URLObjects = {};
  for (const URL in urlDatabase) {
    if (URL in userURLs) {
      URLObjects[URL] = urlDatabase[URL];
    }
  }
  const templateVars =  { URLObjects, user: users[userId] };
  return res.render('urls_index', templateVars);
});

router.get("/urls.json", (req, res) => {
  res.json(urlDatabase);
});

router.put('/:shortURL', (req,res) => {
  const userId = req.session.userId;
  const shortURL = req.params.shortURL;
  if (urlDatabase[shortURL] && urlDatabase[shortURL].userId === userId) {
    urlDatabase[shortURL].longURL = req.body.longURL;
    return res.redirect(`/urls`);
  }
  res.sendStatus(404);
});

router.post('/', (req,res) => {
  const userId = req.session.userId;
  const shortURL = generateRandomString(6);
  if (userId) {
    const creationDate = new Date().toLocaleDateString();
    urlDatabase[shortURL] = { creationDate, longURL: req.body.longURL, userId: userId, visits: 0, uniqueVisits: 0, visitors: [] };
  }
  res.redirect(`/urls/${shortURL}`);
});

router.delete('/:shortURL', (req,res) => {
  const userId = req.session.userId;
  const shortURL = req.params.shortURL;
  if (urlDatabase[shortURL] && urlDatabase[shortURL].userId === userId) {
    delete urlDatabase[shortURL];
    return res.redirect('/urls');
  }
  res.sendStatus(404);
});



module.exports = router;