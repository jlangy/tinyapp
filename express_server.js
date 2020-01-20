const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const PORT = 8080;


const generateRandomString = (numOfDigits) => {
  const alphaNums = 'QWERTYUIOPLKJHGFDSAZXCVBNMqwertyuioplkjhgfdsazxcvbnm1234567890'.split('');
  let randomNum = '';
  for(let i = 0; i < numOfDigits; i++){
    const randomIndex = Math.floor(Math.random()*62);
    randomNum += alphaNums[randomIndex];
  }
  return randomNum;
}

const urlDatabase = {
  'b2xVn2': 'http://www.lighthouselabs.ca',
  '9sm5xK': 'http://www.google.com'
};

app.use(bodyParser.urlencoded({extended: true}));
app.set('view engine', 'ejs');

app.get('/', (req,res) => {
  res.send("Hello!");
});

app.get('/urls', (req,res) => {
  let templateVars = { urls: urlDatabase };
  res.render('urls_index', templateVars);
});

app.get('/urls.json', (req,res) => {
  res.json(urlDatabase);
});

app.get('/urls/new', (req,res) => {
  res.render('urls_new');
});

app.get('/urls/:shortURL', (req,res) => {
  const shortURL = req.params.shortURL;
  const longURL = urlDatabase[shortURL];
  const templateVars = { shortURL, longURL };
  res.render('urls_show', templateVars);
});

app.get('/hello', (req,res) => {
  res.send('<html><body>Hello <b>World</b></body></html>\n');
});

app.post('/urls', (req,res) => {
  console.log(req.body);
  res.send("Ok");
});

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}`);
});
