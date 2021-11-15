const fs = require('fs');
const jwt = require("jsonwebtoken");
const database = require("../database/db");
const db = database.db;
const userRef = db.collection('User');

module.exports.checkDuplicateUsername = async (req, res) => {
  
  let queryUsername = userRef.where('username', '==', req.body.username);
  var userDuplicate;

  await queryUsername.get().then(querySnapshot => {
      if (querySnapshot.docs.length > 0) {
          userDuplicate = true;
      } else {
          userDuplicate = false;
      }
  });

//   console.log(userDuplicate);

  if (userDuplicate) {
      res.status(400).send({ message: "Failed! Username is already in use!" });
      return true;
  }

  return false;
};

module.exports.checkDuplicateEmail = async (req, res) => {
  
  let queryEmail = userRef.where('email', '==', req.body.email);
  var emailDuplicate;

  await queryEmail.get().then(querySnapshot => {
      if (querySnapshot.docs.length > 0) {
        emailDuplicate = true;
      } else {
        emailDuplicate = false;
      }
  });

//   console.log(emailDuplicate);

  if (emailDuplicate) {
    res.status(400).send({ message: "Failed! Email is already in use!" });
    return true;
  }

  return false;
};

module.exports.verifyToken = (req, res) => {
    let token = req.headers["authorization"]
    token = token.replace('Bearer ', '');
    var tokenBool, tokenValid;
    // console.log(token);
    if (token == 'Bearer') {
        tokenBool = false;
    } else {
        tokenBool = true;
    }

    var cert = fs.readFileSync('./jwt-cert/jwt.crt');
    jwt.verify(token, cert, (err, decoded) => {
        // console.log(cert); console.log(decoded);
        if (err) {
            tokenValid = false;
        } else {
        tokenValid = true;
        req.userId = decoded.uid;
        }
        // console.log(req.userId);
    });
    
    if (!tokenBool) {
        res.status(403).send({ message: "No token provided!" });
        return false;
    }
  
    if (!tokenValid) {
        res.status(401).send({ message: "Unauthorized!" });
      return false;
    }
  
    return true;
};

