##simple server for a MEAN chat application
This server implements real time communication using __socket.io__
. Implements authentication using __jwt__
and implements REST APIs using __Express__
. Also uses __mongoose__ for defining schemas and 
__mongoDB__ for data store

#####Any Comments to:
rlothbrock.10@gmail.com



####Endpoints
__router__:  domain/api/v1
- auth
    - this endpoint uses the route : /portal
    - resources
        - login : _POST_ `/login`
            -   requires:
                - email: (todo: write requirements)
                - password: (todo: write requirements)
        - signup : _POST_ `/new-user`
            - requires
                - username: (todo: write requirements)
                  - email: (todo: write requirements)
                  - password: (todo: write requirements)
                  - role* (only on dev phase): (todo: write requirements)

        - help on forgot password : `/recovery`
        - reset password : `/reset-password/:token`
- users
    
- rooms
- messages

-----------
dev notes:

###__Tasks__: 
- implement validation on  requests
- implement email sending
- implement endpoints test
    


esquema de las rooms:
miembros: [ObjectId] // child reference
name: ? string
date: Date def. D.now


esquema de los mensajes:
room: [ObjectId] // parent reference
text:  String
date: Date def. D.now

APIS: /api/v1

api response on production: json {
	status: string ('success'| 'fail' | 'error')
		fail: 	operational errors
		error: 	non-operational errors
	data: 		{ data: object}
	message?: 	string
	count?: 	number  -> number of docs on data 
} 
Resource auth: /portal
        route: /new-user
            description: handles user sign up process
            post = body-val (joi), controller.signup
                require from req.body: 
                        username
                        email
                        password
                        role ? // must implement another way

            return reponse with token

        route: /login
            description: handles user sign in process
            post = body-val(joi), controller.signin
                require from req.body
                        email
                        password

                return response with token

        route: /recovery
            description: handles user account recovery process on pass forgotten		
            post = body-val (joi), controller. passwordForgotten
                require from req.body:
                    email
                return empty response with a void message
                sends a email with url for recovering password

        router: /reset-password/:token
            description: handles user password changing process
            patch = controller.passwordRecovery
                require from req.params
                    token

                return response with user.id, token
Resource users: /users
        route: /Me
        description: get the currently logged user profile data (public data)
            /// ?????
        	* made with factory


        route: /Me/password
        description: hanldes the password changing process for a logged user
        	*protected with route guard
        	patch = controller.passwordUpdating
        	require from req.body :
        				oldPassword, 
        				updatedPassword
        			from req.headers.auth
        				token

        	returns token

        route: /Me/profile
        description: handles the profile info updating process
        	*protected with route guard
        	patch = controller.profileUpdating
        	require from: 
            * denies access if password provided or email
        	returns data message

        route: /Me/profile
        description: handles the profile info deleting process
        	delete = controller.profileDeleting
        	*protected with route guard
        	require from:
        	returns none
        
        route('/Me/contacts')
        	*protected with route guard
        description: handles the contacts field, so far allows add and delete
                     requires in the body an array with the emails to add-delete
                     this api returns the user object with the modified contacts field
            patch(contactsUpdating) : use patch for add new contacts
            delete(contactsDeleting): use delete for removing contacts


        route: /
        description: allows getting all registered users. admin only
        	*protected with route guard
        	*protected with admin middleware
			post = body-val(joi). controller.postUser        	
        	require from:
        	returns 
        	* made with factory

        route: /:id
        description: allow getting a single user by its id. admin only
        	*protected with route guard
        	*protected with admin middleware
        	get = controller.getUser
        	require from:
        	returns
        	* made with factory


	      	patch = controller.patchUser
        	require from:
        	returns
        	* made with factory


        	delete = controller.deleteUser
        	require from:
        	returns
        	* made with factory
Resource rooms: /rooms
Resource messages: /messages			
