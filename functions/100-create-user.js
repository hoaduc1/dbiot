const fs = require('fs');
const jwt = require('jsonwebtoken');
const { v4: uuidv4 } = require('uuid');
const database = require("../database/db");
const db = database.db;
const userRef = db.collection('User'); 

const bcrypt = require("bcryptjs");
const verify = require("../util/verifyauth");

module.exports.createUser = async (req, res) => {
  if (req.method != "POST") {
    res.status(400).send({ message: "Access denied" });
    return;
  }

  var checkDuplicateUsername = (await verify.checkDuplicateUsername(req, res)).valueOf();
  // console.log(checkDuplicateUsername);
  
  if (checkDuplicateUsername) {
    res.end();
  } 
  else { 
    var checkDuplicateEmail = (await verify.checkDuplicateEmail(req, res)).valueOf();
    if (checkDuplicateEmail) {
      res.end();
    }
    else {
      try {   
        var User = {
          id: null,
          username: req.body.username, 
          email: req.body.email,
          password: bcrypt.hashSync(req.body.password, 8)
        };
        await userRef.add(User).then(doc => { 
          User.id = doc.id;
          userRef.doc(User.id).update(User);
        });
      
        var privKey = fs.readFileSync('./jwt-cert/jwt.key');
        var payload = {
        iss: 'db-iot',
        sub: 'O=dbiot.io,E=' + User.email,
        aud: User.email,
        jti: uuidv4(),
        exp: Math.floor(Date.now() / 1000) + 3600,
        iat: Math.floor(Date.now() / 1000),
        uid: User.id,
        version: 1,
        name: User.name,
        email: User.email,
        phone: User.phone,
        postalCode: User.postalCode,
        photoUrl: User.photoUrl,
        };
        var token = jwt.sign(payload, privKey, {algorithm: 'ES256'});

        console.log('Add user done');
        res.writeHead(200, {});
        res.write(JSON.stringify({
          msgCode: 10000,
          msgResp: {
            uid: User.id,
            token: token
          }
        }));
        res.end();
      }
      catch (e) {
        console.log(e);
      };
    }
  }      
}