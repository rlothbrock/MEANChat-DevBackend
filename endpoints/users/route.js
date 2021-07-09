const express = require('express');
const {passwordForgotten} = require("../../core/middleware/route-guard");
const {paramValidator} = require("../../core/middleware/req-validator");
const route = express.Router()
const {
    getUser, getUsers,
    postUser, patchUser, 
    getMe, useTokenForSetParams, 
    deleteUser, passwordUpdating,
    profileUpdating, profileDeleting, contactsUpdating, contactsDeleting
} = require('./controller');
const { routeGuard, allowOnly } = require('../../core/middleware/route-guard');
const { upload } = require('../../tools/fileUploader');


route.use(routeGuard); // all routes below require a logged user


route
.route('/Me')
.get(useTokenForSetParams, getMe);

route
.route('/Me/password')
.patch(passwordUpdating)
.post(passwordForgotten)

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
.post(postUser)

// .get(paramValidator,getUser)
route
    .route('/:id')
    .get(paramValidator,getUser)
    .patch(patchUser)
    .delete(deleteUser)




module.exports = route;
