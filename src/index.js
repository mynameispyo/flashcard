const express = require('express');
const app = express();
const PORT = process.env.PORT || 5000;
const bodyParser = require('body-parser');  
const urlencodedParser = bodyParser.urlencoded({ extended: false });
const crypto = require('crypto');
const MongoClient = require('mongodb').MongoClient
const { v4: uuidv4 } = require('uuid');
const cookieParser = require('cookie-parser');

const mongoDB = "mongodb+srv://user:PqwT8gDXmD171D9H@cluster0.d9ri5.mongodb.net/user?retryWrites=true&w=majority";

app.use(cookieParser());


app.get('/', (req, res) => {
  res.sendFile(__dirname + "/public/index.html");
})

app.get('/:file', (req, res) => {
  res.sendFile(__dirname + "/public/index.html");
})

app.get('/build/:file', (req, res) => {
  res.sendFile(__dirname + "/public/build/"+req.params.file);
})


app.post('/api/login', urlencodedParser,  async (req, res) => {
  let user = req.body.user;
  let pass = req.body.pass;
  const client = await MongoClient.connect(mongoDB)
    .catch(err => { 
      res.send(JSON.stringify({'error':"1:"+err}));
      return;
    });

  if (!client) {
    res.send(JSON.stringify({'error':"2:"+err}));
    return;
  }

  try {

    let collection = await client.db("Flashcards").collection('Auth');

    let loginresult = await collection.find({user:user}).toArray();

    if(loginresult.length < 1){
      res.send(JSON.stringify({'error':"can't find user"}));
      return;
    }else if (loginresult.length > 1){
      res.send(JSON.stringify({'error': "more than 2 accounts"}));
      return;
    }

    if (loginresult[0].sha === crypto.createHmac('sha256', loginresult[0].salt).update(user+pass).digest('hex')){

      let token = uuidv4();
      let newvalues = { $set: {'user':user, 'token':token} };
      let generateToken = await client.db("Flashcards").collection('LoginToken').updateOne({'user':user}, newvalues)

    let output = {
      'error': 'nil',
      'token': token,
      'message':"Login",
    }
      res.send(JSON.stringify(output));
    }else{
      res.send(JSON.stringify({'error':"wrong password"}));
      return;
    }

  } catch (err) {

    res.send(JSON.stringify({'error':"3:"+err}));
    return;

  } finally {

    client.close();
  }
})

app.post('/api/signup', urlencodedParser,  async (req, res) => {
  function generateSalt(){
    let sixteenbit = ['0','1','2','3','4','5','6','7','8','9','A','B','C','D','E','F'];
    return sixteenbit[Math.floor((Math.random() * 16))] + sixteenbit[Math.floor((Math.random() * 16))] + sixteenbit[Math.floor((Math.random() * 16))] + sixteenbit[Math.floor((Math.random() * 16))]
  }
  let user = req.body.user;
  let pass = req.body.pass;
  const client = await MongoClient.connect(mongoDB)
    .catch(err => { 
      res.send(JSON.stringify({'error':"1:"+err}));
      return;
    });

  if (!client) {
    res.send(JSON.stringify({'error':"2:"+err}));
    return;
  }

  try {

    let collection = await client.db("Flashcards").collection('Auth');

    let loginresult = await collection.find({user:user}).toArray();

    if(loginresult.length === 1){
      res.send(JSON.stringify({'error':"user aready exist"}));
      return;
    }else if (loginresult.length > 1){
      res.send(JSON.stringify({'error': "more than 2 accounts"}));
      return;
    }

    let salt = generateSalt();
    let sha = crypto.createHmac('sha256', salt).update(user+pass).digest('hex');

    let singupresult = await collection.insertOne({user:user, sha:sha, salt:salt});


    let token = uuidv4();
    let generateToken = await client.db("Flashcards").collection('LoginToken').insertOne({user:user, token: token});

    res.send(JSON.stringify({'error':'nil', 'message':'sussefully add account', 'token': token}));

  } catch (err) {

    res.send(JSON.stringify({'error':"3:"+err}));
    return;

  } finally {

    client.close();
  }
})

app.post('/api/cardsets', urlencodedParser,  async (req, res) => {
  if(typeof req.body === "undefined"){
    res.send(JSON.stringify({'error':"hide"}));
    return;
  }
    const client = await MongoClient.connect(mongoDB)
      .catch(err => { 
        res.send(JSON.stringify({'error':"1:"+err}));
        return;
      });
  
    if (!client) {
      res.send(JSON.stringify({'error':"2:"+err}));
      return;
    }
  
    try {
      let findToken = await client.db("Flashcards").collection('LoginToken').findOne({'token': req.body.token });
      let getFlashcards = await client.db("Flashcards").collection('Cards').find({'user': findToken.user}).toArray();
      getFlashcards.map((cardSet)=>{
        return {
          id: cardSet.id,
          title: cardSet.title,
          desc:cardSet.desc,
          NCards: cardSet.NCards,
        }
      })
      res.send(JSON.stringify({'error':'nil', 'message':'success', 'user': findToken.user, 'sets':getFlashcards}));


  
    } catch (err) {
  
      res.send(JSON.stringify({'error':"3:"+err}));
      return;
  
    } finally {
  
      client.close();
    }

})

app.post('/api/loadset', urlencodedParser,  async (req, res) => {
  if(typeof req.body === "undefined"){
    res.send(JSON.stringify({'error':"hide"}));
    return;
  }
    const client = await MongoClient.connect(mongoDB)
      .catch(err => { 
        res.send(JSON.stringify({'error':"1:"+err}));
        return;
      });
  
    if (!client) {
      res.send(JSON.stringify({'error':"2:"+err}));
      return;
    }
  
    try {
      let findToken = await client.db("Flashcards").collection('LoginToken').findOne({'token': req.body.token });
      let getFlashcards = await client.db("Flashcards").collection('Cards').findOne({'user': findToken.user, 'id': req.body.id});
      res.send(JSON.stringify({'error':'nil', 'message':'success', 'user': findToken.user, 'sets':getFlashcards}));


  
    } catch (err) {
  
      res.send(JSON.stringify({'error':"3:"+err}));
      return;
  
    } finally {
  
      client.close();
    }

})
app.post('/api/saveset', urlencodedParser,  async (req, res) => {
  if(typeof req.body === "undefined"){
    res.send(JSON.stringify({'error':"hide"}));
    return;
  }
    const client = await MongoClient.connect(mongoDB)
      .catch(err => { 
        res.send(JSON.stringify({'error':"1:"+err}));
        return;
      });
  
    if (!client) {
      res.send(JSON.stringify({'error':"2:"+err}));
      return;
    }
  
    try {
      let findToken = await client.db("Flashcards").collection('LoginToken').findOne({'token': req.body.token });
      let getFlashcards = await client.db("Flashcards").collection('Cards').updateOne({'user': findToken.user, 'id': req.body.id}, {$set:JSON.parse(req.body.newsets)});
      res.send(JSON.stringify({'error':'nil', 'message':'success'}));


  
    } catch (err) {
  
      res.send(JSON.stringify({'error':"3:"+err}));
      return;
  
    } finally {
  
      client.close();
    }

})

app.post('/api/newset', urlencodedParser,  async (req, res) => {
  if(typeof req.body === "undefined"){
    res.send(JSON.stringify({'error':"hide"}));
    return;
  }
    const client = await MongoClient.connect(mongoDB)
      .catch(err => { 
        res.send(JSON.stringify({'error':"1:"+err}));
        return;
      });
  
    if (!client) {
      res.send(JSON.stringify({'error':"2:"+err}));
      return;
    }
  
    try {
      let findToken = await client.db("Flashcards").collection('LoginToken').findOne({'token': req.body.token });
      let getFlashcards = await client.db("Flashcards").collection('Cards').insertOne({"id":uuidv4(),"user":findToken.user,"title":" ","desc":"","cards":[]});
      res.send(JSON.stringify({'error':'nil', 'message':'success'}));


  
    } catch (err) {
  
      res.send(JSON.stringify({'error':"3:"+err}));
      return;
  
    } finally {
  
      client.close();
    }

})

app.post('/api/deleteset', urlencodedParser,  async (req, res) => {
  if(typeof req.body === "undefined"){
    res.send(JSON.stringify({'error':"hide"}));
    return;
  }
    const client = await MongoClient.connect(mongoDB)
      .catch(err => { 
        res.send(JSON.stringify({'error':"1:"+err}));
        return;
      });
  
    if (!client) {
      res.send(JSON.stringify({'error':"2:"+err}));
      return;
    }
  
    try {
      let findToken = await client.db("Flashcards").collection('LoginToken').findOne({'token': req.body.token });
      let getFlashcards = await client.db("Flashcards").collection('Cards').deleteOne({'user':findToken.user, 'id': req.body.id});
      res.send(JSON.stringify({'error':'nil', 'message':'success'}));


  
    } catch (err) {
  
      res.send(JSON.stringify({'error':"3:"+err}));
      return;
  
    } finally {
  
      client.close();
    }

})

app.post('/api/test', urlencodedParser, async (req, res) => {
  if(req.body.token ){

    const client = await MongoClient.connect(mongoDB)
      .catch(err => { 
        res.send(JSON.stringify({'error':"1:"+err}));
        return;
      });
  
    if (!client) {
      res.send(JSON.stringify({'error':"2:"+err}));
      return;
    }
  
    try {
      let findToken = await client.db("Flashcards").collection('LoginToken').findOne({token: req.body.token });
  
      res.send(JSON.stringify({'error':'nil', 'message':'success', 'user': findToken.user}));
  
    } catch (err) {
  
      res.send(JSON.stringify({'error':"3:"+err}));
      return;
  
    } finally {
  
      client.close();
    }
  }else{
    res.send(JSON.stringify({'error':"hide"}));
  }
})




app.listen(PORT, () => {
  console.log(`Example app listening at http://localhost:${PORT}`)
})