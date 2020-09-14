const express = require('express');
const route = express.Router()

const { joiSchema } = require('./schema')
const { 
    getUser, getUsers,
    postUser, patchUser, 
    getMe, useTokenForSetParams, 
    deleteUser, passwordUpdating,
    profileUpdating, profileDeleting
} = require('./controller');
const {paramValidator} = require('../middleware/param-validator');
const { bodyValidator } = require('../middleware/body-validator');
const { routeGuard, allowOnly } = require('../middleware/route-guard-middle');

route.param('id',paramValidator)

route.use(routeGuard); // all routes below require a logged user

route
.route('/Me')
.get(useTokenForSetParams, getMe);

route
.route('/Me/update-password')
.patch(passwordUpdating)

route
.route('/Me/update-profile')
.patch(profileUpdating)

route
.route('/Me/delete-profile')
.delete(profileDeleting)


route.use(allowOnly('admin'))  // all routes below are only for administration purpose

route
.route('/')
.get(getUsers)
.post(bodyValidator(joiSchema),postUser)

route
.route('/:id')
.get(getUser)
.patch(patchUser)
.delete(deleteUser)




module.exports = route;