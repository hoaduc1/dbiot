const fs = require('fs');
const jwt = require('jsonwebtoken');
const { v4: uuidv4 } = require('uuid');
const database = require("../database/db");
const db = database.db;
const userRef = db.collection('User');

const bcrypt = require("bcryptjs");
const verify = require("../util/verifySignUp");

module.exports.createUser = async (req, res) => {
  var checkDuplicate = (await verify.checkDuplicateUsernameOrEmail(req, res)).valueOf();
  console.log(checkDuplicate);
  
  if (checkDuplicate) {
    res.end();
  } 
  else { 
    try {   
      await userRef.add({
        username: req.body.username, 
        email: req.body.email,
        password: bcrypt.hashSync(req.body.password, 8)
      });

      console.log('Add user done');
      res.status(200).send({ message: "User was registered successfully!" });
      res.end();
    }
    catch (e) {
      console.log(e);
    };
  }
       
}