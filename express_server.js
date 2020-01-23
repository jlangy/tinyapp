const express = require('express');
const methodOverride = require('method-override');
const app = express();
const bodyParser = require('body-parser');
const cookieSession = require('cookie-session');
const PORT = 8080;
const {browseURLS, readURL, linkToExternalURL, renderCreateURLPage, createURL, updateURL, deleteURL, showJSON } = require('./urlCallbacks');
const { renderRegisterPage, renderLoginPage, login, register, logout } = require('./userCallbacks');

app.use(methodOverride('_method'));
app.use(bodyParser.urlencoded({extended: true}));
app.use(cookieSession({
  name: 'session',
  keys: ['key1', 'key2']
}));

app.set('view engine', 'ejs');

app.get('/urls', browseURLS);
app.get('/urls/new', renderCreateURLPage);
app.get('/urls/:shortURL', readURL);
app.get('/u/:shortURL', linkToExternalURL);
app.get('/register', renderRegisterPage);
app.get('/login', renderLoginPage);
app.get("/urls.json", showJSON);

app.post('/login', login);
app.post('/register', register);
app.post('/urls', createURL);
app.post('/logout', logout);

app.put('/urls/:shortURL', updateURL);
app.delete('/urls/:shortURL', deleteURL);

app.get('*', (req,res) => {
  res.redirect('/urls');
});

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}`);
});
