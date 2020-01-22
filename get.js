const { urlDatabase, users } = require('./data');

const browseURLS = (req,res) => {
  const templateVars =  { urls: urlDatabase, user: users[req.cookies.user_id] };
  res.render('urls_index', templateVars);
}

const renderCreateURLPage = (req,res) => {
  if(users[req.cookies.user_id]){
    const templateVars = { user: users[req.cookies.user_id] }
    return res.render('urls_new', templateVars);
  }
  res.redirect('/login');
}

const readURL = (req,res) => {
  const shortURL = req.params.shortURL;
  const longURL = urlDatabase[shortURL];
  const templateVars = { shortURL, longURL, user: users[req.cookies.user_id] };
  res.render('urls_show', templateVars);
}

const linkToExternalURL = (req,res) => {
  res.redirect(urlDatabase[req.params.shortURL]);
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