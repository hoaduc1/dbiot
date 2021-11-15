const fs = require('fs');
const jwt = require('jsonwebtoken');
const { v4: uuidv4 } = require('uuid');
const database = require("../database/db");
const db = database.db; 
const userRef = db.collection('User');

const bcrypt = require("bcryptjs");
const verify = require("../util/verifyauth");

module.exports.deleteUser = async (req, res) => {
    // console.log(req.method)
  if (req.method != "DELETE") {
    res.status(400).send({ message: "Access denied" });
    return;
  }
  var checkToken = (await verify.verifyToken(req, res)).valueOf();
  console.log(checkToken);
  
  if (!checkToken) {
    res.end();
  } 
  else { 
    try {   
      console.log(req.body.uid);  
      await userRef.doc(req.body.uid).get().then(doc => {
        if(doc.data()) {
            console.log(doc.data());
        } else {
            console.log('no data')
        }
      });
    //   await userRef.doc(req.body.uid).delete().then(function() {
    //     console.log('Delete user done');
    //   }).catch(function(err) {
    //     console.log(err);
    //   })
      
    //   res.status(200).send({ message: "User was delete successfully!" });
    //   res.end();
    }
    catch (e) {
      console.log(e);
    };
  }
       
}