const express = require('express');
const route = express.Router()


const { joiSchema } = require('./schema')
const { 
    getUser, getUsers,
    postUser, patchUser, 
    getMe, useTokenForSetParams, 
    deleteUser, passwordUpdating,
    profileUpdating, profileDeleting, contactsUpdating, contactsDeleting
} = require('./controller');
const {paramValidator} = require('../middleware/param-validator');
const { bodyValidator } = require('../middleware/body-validator');
const { routeGuard, allowOnly } = require('../middleware/route-guard-middle');
const { upload, imageResize } = require('./../utils/fileUploader'); 


route.param('id',paramValidator)

route.use(routeGuard); // all routes below require a logged user


route
.route('/Me')
.get(useTokenForSetParams, getMe);

route
.route('/Me/password')
.patch(passwordUpdating)

route
.route('/Me/profile')
.patch(upload.single('file'),profileUpdating)
// .patch(upload.single('file'),imageResize,profileUpdating)
.delete(profileDeleting)

route
.route('/Me/contacts')
.patch(contactsUpdating)
.delete(contactsDeleting)


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