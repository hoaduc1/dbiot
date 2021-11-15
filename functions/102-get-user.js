const fs = require('fs');
const jwt = require('jsonwebtoken');
const { v4: uuidv4 } = require('uuid');
const database = require("../database/db");
const db = database.db; 
const userRef = db.collection('User');

const bcrypt = require("bcryptjs");
const verify = require("../util/verifyauth");

module.exports.getUser = async (req, res) => {
  if (req.method != "GET") {
      res.status(400).send({ message: "Access denied" });
      return;
  }
  var checkToken = (await verify.verifyToken(req, res)).valueOf();
  console.log(checkToken);
  var user = {};

  if (checkToken) {
    res.end();
  } 
  else { 
    try {   
      console.log(req.body.uid);  
      await userRef.doc(req.body.uid).get().then(querySnapshot => {
            user.username = querySnapshot.data().username;
            user.email = querySnapshot.data().email;
    });
      
      console.log('Get user done');
      res.writeHead(200, {});
      res.write(JSON.stringify({
      msgCode: 10200,
      msgResp: {
            user: user
            }
      }));
      res.end();
    }
    catch (e) {
      console.log(e);
    };
  }
       
}