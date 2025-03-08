var express = require('express');
var router = express.Router();
const userService = require('../services/users.service');
const { authenticateJWT } = require('../middleware/jwtAuthentication');

router.post('/sign-in', function (req, res, next) {
  // A simple authentication using only mail.
  const response = userService.login(req.body);
  res.send(response);
});

router.post('/sign-up', function (req, res, next) {
  const response = userService.createUser(req.body);
  res.send(response);
});

/* GET users listing. */
router.get('/', authenticateJWT, function (req, res, next) {
  const page = req.query.page;
  const response = userService.getUsers(page);
  res.send(response);
});

router.put('/:id', authenticateJWT, function (req, res, next) {
  const id = req.params.id;
  const response = userService.updateUser(req.body, id);
  res.send(response);
});

router.delete('/:id', authenticateJWT, function (req, res, next) {
  const id = req.params.id;
  const response = userService.deleteUser(id);
  res.send(response);
});


module.exports = router;
