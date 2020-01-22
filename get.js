const { urlDatabase, users } = require('./data');
const urlsForUser = require('./helpers').urlsForUser;

const browseURLS = (req,res) => {
  const userID = req.cookies.user_id;
  if(userID){
    const URLs = urlsForUser(userID);
    const templateVars =  { urls: URLs, user: users[req.cookies.user_id] };
    return res.render('urls_index', templateVars);
  }
  res.render('urls_index', {urls: null, user: null});
}

const renderCreateURLPage = (req,res) => {
  if(users[req.cookies.user_id]){
    const templateVars = { user: users[req.cookies.user_id] }
    return res.render('urls_new', templateVars);
  }
  res.redirect('/login');
}

const readURL = (req,res) => {
  const userID = req.cookies.user_id;
  if(!userID){
    return res.render('urls_show', {error: 'notLoggedIn'});
  }
  const userURLs = urlsForUser(userID);
  const shortURL = req.params.shortURL;
  if(shortURL in userURLs){
    const longURL = userURLs[shortURL];
    const templateVars = { shortURL, longURL, user: users[userID], error: null };
    return res.render('urls_show', templateVars);
  }
  res.render('urls_show', {error: 'notFound', user: users[userID]})
}

const linkToExternalURL = (req,res) => {
  res.redirect(urlDatabase[req.params.shortURL].longURL);
}

const renderRegisterPage = (req,res) => {
  const templateVars = { user: users[req.cookies.user_id], error: null}
  res.render('register', templateVars);
}

const renderLoginPage = (req,res) => {
  const templateVars = { user: users[req.cookies.user_id], error: null}
  res.render('login', templateVars);
}

module.exports = {
  browseURLS,
  renderCreateURLPage,
  readURL,
  linkToExternalURL,
  renderRegisterPage,
  renderLoginPage
}