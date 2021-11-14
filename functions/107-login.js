const fs = require('fs');
const jwt = require('jsonwebtoken');
const bcrypt = require("bcryptjs");
const { v4: uuidv4 } = require('uuid');
const database = require("../database/db");
const db = database.db;
const userRef = db.collection('User');



module.exports.login = async (req, res) => {
    console.log(req.body.username);
    let queryUsername = userRef.where('username', '==', req.body.username);
    var user = null;
    try {
        await queryUsername.get().then(querySnapshot => {
            querySnapshot.forEach(documentSnapshot  => {
                user = documentSnapshot;
            })
        });
        // console.log(user.data());
    } 
    catch (e) {
      res.status(500).send({ message: e });
      return;
    } 
    
    if (!user) {
      return res.status(404).send({ message: "User Not found." });
    }

    var passwordIsValid = bcrypt.compareSync(
      req.body.password,
      user.data().password
    );

    if (!passwordIsValid) {
      return res.status(401).send({
        accessToken: null,
        message: "Invalid Password!"
      });
    }

    var privKey = fs.readFileSync('./jwt-cert/jwt.key');
    var payload = {
        iss: 'db-iot',
        sub: 'O=dbiot.io,E=' + user.data().email,
        aud: user.data().email,
        jti: uuidv4(),
        exp: Math.floor(Date.now() / 1000) + 3600,
        iat: Math.floor(Date.now() / 1000),
        uid: user.id,
        version: 1,
        name: user.data().name,
        email: user.data().email,
        phone: user.data().phone,
        postalCode: user.data().postalCode,
        photoUrl: user.data().photoUrl,
    };
    var token = jwt.sign(payload, privKey, {algorithm: 'ES256'});

    res.writeHead(200, {});
    res.write(JSON.stringify({
      msgCode: 10700,
      msgResp: {
        uid: user.id,
        token: token
      }
    }));
    res.end();
}