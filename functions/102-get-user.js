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
  // console.log(checkToken);
  var user = {};

  if (!checkToken) {
    res.end();
  } 
  else { 
    try {   
      // console.log(req.body.uid);  
      await userRef.doc(req.body.uid).get().then(doc => {
            if (doc.data() != null) {
              user.username = doc.data().username;
              user.email = doc.data().email;
              
              console.log('Get user done');
              res.writeHead(200, {});
              res.write(JSON.stringify({
              msgCode: 10200,
              msgResp: {
                    user: user
                    }
              }));
              res.end();
            } else {
              res.writeHead(200, {});
              res.write(JSON.stringify({
              msgCode: 10201,
              msgResp: 'User not fount'
              }));
              res.end();
              return;
            }
            
    });
      

    }
    catch (e) {
      console.log(e);
    };
  }
       
}