const fs = require('fs');
const jwt = require("jsonwebtoken");
const database = require("../database/db");
const db = database.db;
const userRef = db.collection('User');

module.exports.checkDuplicateUsernameOrEmail = async (req, res) => {
  
  let queryUsername = userRef.where('username', '==', req.body.username);
  let queryEmail = userRef.where('email', '==', req.body.email);
  var userDuplicate, emailDuplicate;

  await queryUsername.get().then(querySnapshot => {
      if (querySnapshot.docs.length > 0) {
        // querySnapshot.forEach(user => {
        //     console.log(user.data());
        // })
          userDuplicate = true;
      } else {
        userDuplicate = false;
      }
  });

  await queryEmail.get().then(querySnapshot => {
      if (querySnapshot.docs.length > 0) {
        emailDuplicate = true;
      } else {
        emailDuplicate = false;
      }
  });

//   console.log(emailDuplicate);
//   console.log(userDuplicate);

  if (userDuplicate) {
      res.status(400).send({ message: "Failed! Username is already in use!" });
      return true;
  }

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
        }
        tokenValid = true;
        req.userId = decoded.uid;
        // console.log(req.userId);
    });
    
    if (!tokenBool) {
        res.status(403).send({ message: "No token provided!" });
        return true;
    }
  
    if (!tokenValid) {
        res.status(401).send({ message: "Unauthorized!" });
      return true;
    }
  
    return false;
};

