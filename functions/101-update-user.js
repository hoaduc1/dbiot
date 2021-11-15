const fs = require('fs');
const jwt = require('jsonwebtoken');
const { v4: uuidv4 } = require('uuid');
const database = require("../database/db");
const db = database.db; 
const userRef = db.collection('User');

const bcrypt = require("bcryptjs");
const verify = require("../util/verifyauth");

module.exports.updateUser = async (req, res) => {
  if (req.method != "POST") {
    res.status(400).send({ message: "Access denied" });
    return;
  }
  var checkToken = (await verify.verifyToken(req, res)).valueOf();
  console.log(checkToken);
  
  if (!checkToken) {
    res.end();
  } 
  else { 

    let queryUsername = userRef.where('username', '==', req.body.username);
    var userDuplicate;
    await queryUsername.get().then(querySnapshot => {
        if (querySnapshot.docs.length > 0) {
            userDuplicate = true;
        } else {
            userDuplicate = false;
        }
    });
    // console.log(userDuplicate); 
    console.log((await userRef.doc(req.body.uid).get()).data().username);
    if (userDuplicate) {
      if((await userRef.doc(req.body.uid).get()).data().username == req.body.username) {
        console.log('it is'); 
        try {    
          await userRef.doc(req.body.uid).update({
                        // username: req.body.username, 
                        email: req.body.email, 
                        password: bcrypt.hashSync(req.body.password, 8)
                    });
          
          console.log('Update user done');
          res.status(200).send({ message: "User was update successfully!" });
          res.end();
        }
        catch (e) {
          console.log(e);
        };
      }
      else {
        res.status(400).send({ message: "Failed! Username is already in use!" });
        return;
      }
    } 
    else {
      try {   
        // console.log(req.body.uid);  
        await userRef.doc(req.body.uid).update({
                      username: req.body.username, 
                      email: req.body.email, 
                      password: bcrypt.hashSync(req.body.password, 8)
                  });
        
        console.log('Update user done');
        res.status(200).send({ message: "User was update successfully!" });
        res.end();
      }
      catch (e) {
        console.log(e);
      };
    }
  }  
}