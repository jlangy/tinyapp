const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cookieSession = require('cookie-session');
const PORT = 8080;
const {browseURLS, readURL, linkToExternalURL, renderCreateURLPage, createURL, updateURL, deleteURL } = require('./urlCallbacks');
const { renderRegisterPage, renderLoginPage, login, register, logout } = require('./userCallbacks');

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

app.post('/login', login);
app.post('/register', register);
app.post('/urls', createURL);
app.post('/urls/:shortURL', updateURL);
app.post('/urls/:shortURL/delete', deleteURL);
app.post('/logout', logout);

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}`);
});
