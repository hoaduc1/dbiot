// const logIn = require('./log-in');
// const signUp = require('./sign-up');
// const getUser = require('./get-user');
// const productsManager = require('./products-manager');
const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const mongoose = require('mongoose');
// const { verifySignUp } = require("./middlewares");
// const initRoles = require("./db/init-roles");
// const controller = require("./controllers/user.controller");
// const { authJwt } = require("./middlewares");
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(function (req, res, next) {
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PATCH, PUT, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, Keep-AIive');
  res.setHeader('Content-Type', 'application/json');
  res.setHeader('x-powered-by', 'Django'); // Purposely misleading
  next();
});

app.get('/', (req, res) => {
  res.writeHead(200, {});
  res.write(JSON.stringify({
    name: 'dbiot services', 
    version: '1.0'
  }));
  res.end();
})

const endpointMap = {
  '100-create-user': 'createUser',
  '101-update-user': 'updateUser',
  '102-get-user': 'getUser',
  // '103-delete-user': 'deleteUser',
  // '104-search-user': 'searchUser',
  // '105-change-password': 'changePassword',
  // '106-reset-password': 'resetPassword',
  '107-login': 'login',
  // '108-login-3rd-party': 'login3RdParty',
  // '109-subscribe-notification': 'subscribeNotification',
  // '110-create-feedback': 'createFeedback',
  // '111-create-notification': 'createNotification',
  // '112-read-notification': 'readNotification',
  // '113-list-notifications': 'listNotifications',
  // '114-upload-photo': 'uploadPhoto',
  // '115-create-group': 'createGroup',
  // '116-update-group': 'updateGroup',
  // '117-get-group': 'getGroup',
  // '118-list-groups': 'listGroups',
  // '119-delete-group': 'deleteGroup',
  // '120-approve-group-join': 'approveGroupJoin',
  // '121-ban-member': 'banMember',
  // '122-change-group-role': 'changeGroupRole',
  // '123-join-group': 'joinGroup',
  // '124-remove-member': 'removeMember',
  // '125-get-member-info': 'getMemberInfo',
  // '126-create-event': 'createEvent',
  // '127-update-event': 'updateEvent',
  // '128-update-event-status': 'updateEventStatus',
  // '129-update-event-share': 'updateEventShare',
  // '130-get-event': 'getEvent',
  // '131-list-events-opening': 'listEventsOpening',
  // '132-list-events-by-group': 'listEventsByGroup',
  // '133-list-my-events': 'listMyEvents',
  // '134-get-share-event': 'getShareEvent',
  // '135-request-payment': 'requestPayment',
  // '136-delete-event': 'deleteEvent',
  // '137-create-order': 'createOrder',
  // '138-update-order': 'updateOrder',
  // '139-update-order-status': 'updateOrderStatus',
  // '140-update-order-buyer-status': 'updateOrderBuyerStatus',
  // '141-update-order-buyer-info': 'updateOrderBuyerInfo',
  // '142-update-order-no': 'updateOrderNo',
  // '143-list-orders-by-event': 'listOrdersByEvent',
  // '144-list-orders-by-ref': 'listOrdersByRef',
  // '145-list-orders-by-buyer': 'listOrdersByBuyer',
};

for (let endpoint in endpointMap) {
  var method = endpointMap[endpoint];
  var methods = require('./functions/' + endpoint)
  // console.log('./functions/' + endpoint)
  subEndpoint = endpoint.substring(4);
  // console.log(method)
  app.get('/' + subEndpoint, methods[method]);
  app.post('/' + subEndpoint, methods[method]);
  app.put('/' + subEndpoint, methods[method]);
  app.patch('/' + subEndpoint, methods[method]);
  app.delete('/' + subEndpoint, methods[method]);
}

  async function main() {
    const port = 3000;
    app.listen(port, () => {
      console.log(`Example app listening at http://localhost:${port}`);
    });
  }
  
  main();