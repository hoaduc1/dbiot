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
  
  if (checkToken) {
    res.end();
  } 
  else { 
    try {   
      console.log(req.body.uid);  
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