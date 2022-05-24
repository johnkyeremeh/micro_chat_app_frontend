
//Start when  DOM Content loaded successfully
document.addEventListener("DOMContentLoaded", () => {
    User.createUser();
})


class User {
    constructor (name) {
        this.username = name;
    }

    static createUser(){
        //form for user to enter their username
        const newUserForm = document.getElementsByClassName('new-user-form')[0]
        
        //listen to see if username was submitted 
        newUserForm.addEventListener('submit', (e) =>   {

            e.preventDefault() //ensure the button doesn't redirect on click. 
            const formValue =  e.target.children[1].value; //value of the input which is the username


            //Either alert if username is blank post or call User Controller method Create(POST)
        
            if (formValue === "") {
                return window.alert("You entered a blank username. Please enter a valid username.")
            } else {
                const userURL = "http://localhost:3000/users";

                //post to the User Controller Create method 
                const configurationObject = {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Accept: "application/json"
                    },
                    body: JSON.stringify({
                        username: formValue
                    })
                };
        
                fetch(userURL, configurationObject)
                .then(function(response) {
                    return response.json();
                })
                .then(function(user) {
                    let newUser = new User(user) //initialize a user object
                    console.log(newUser);
                    newUser.displayUser()  //call function to display user information
                    User.fetchUsers(newUser); //call function to get available users from the database (GET)
                })
                .catch(function(error) {
                    alert("User not added to User Controller");
                    console.log(error.message);
                });
            }
        })
    }

    //hide the newUserForm and remove the container 
    //add welcome message and display the welcome message
    displayUser(){
        const loginWrapper = document.getElementsByClassName('login-wrapper')[0]
        const wrapper =  document.getElementsByClassName('wrapper')[0]
        const newUserForm = document.getElementsByClassName('new-user-form')[0]
        const welcome = document.querySelector("#menu > p.welcome")
        const formContainer = document.getElementsByClassName('form-container')[0]

        newUserForm.style.visibility = "hidden" //hide the signup form
  
        formContainer.remove() //remove the form container
        welcome.innerText = `Welcome, ${this["username"]["data"]["attributes"]["username"]}`
        wrapper.style.display = "block"
    }

    //GET from User Controllers Index function to see all the users from the database
    static fetchUsers(userInstance) {

        // let currentUser = userInstance 

        const userURL = "http://localhost:3000/users";
        return fetch(userURL)
        .then(function(response) {
            return response.json();
        })
        .then(function(userJson) {
            return userInstance.renderRegisteredUsers(userInstance, userJson["data"]) 
            console.log(userJson);   
        })
        .catch(function(error) {
            alert("Cannot get index User Controllers");
            console.log(error.message);
        });
    }

   


    renderRegisteredUsers(userInstance, users) {
        let newUsersArray = users.slice() //duplicating array of users
        let registeredUserSection = document.getElementsByClassName('registered-users-section')[0]
        let registeredUsersContainer = document.createElement('div')
        let listElement = document.createElement('ul')

    
        registeredUserSection.appendChild(listElement)

        
    
        //list of all users that don't include current user instance
        let ArrayOfRegisteredUser = newUsersArray.filter(user => {
            return user["attributes"]['username'] != userInstance['username']['data']['attributes']['username']
        })

        
       //create list for each user 
       ArrayOfRegisteredUser.forEach (user => {
        let li = document.createElement('li')
        li.innerText =  user['attributes']['username'] 
        listElement.appendChild(li)
        li.id = user.id //listing ID so can use later to under who current user chose
        li.addEventListener('click', (e) => {
            this.usersRecipient(e)
        })
       })
    }

    usersRecipient(e){
        let sender = this
        let recipientName = e.target.textContent
        let recipientId = e.target.id
        this.updateChat(sender, recipientName, recipientId)
    }

    updateChat(sender, recipientName, recipientId){
        const senderId =  sender["username"]['data']['id']
        const recipient_id = recipientId
        const messageList =  document.querySelector("#message-list")
        messageList.innerHTML = ""

        //call grab messages which calls Conversation Controller GET Index to see available conversations for specific Conversation ID

        Conversation.grabMessages(senderId, recipient_id)

    
        const chatbox =  document.querySelector("#chatbox")
        chatbox.style.color = "orange" 
        let result =  this.sendlistener(sender, recipientName, recipientId)

        //on click of a user continually update the chatbox with updated converstions
        //Note to self < 1000 breaks the app.
        const refreshInterval = setInterval(function() {
            Conversation.grabMessages(senderId, recipient_id)
        }, 2500)
        
    }



    sendlistener(sender, recipientName, recipientID){
        const sendForm = document.getElementsByClassName("send-message")[0]

        const senderId =  sender["username"]['data']['id']
        const recipient_id = recipientID
        let newMessageObject 
        let conversationObject
        console.log(`SenderID is ${senderId}`)
        console.log(`RecipientID is ${recipient_id}`)

    

        
        sendForm.addEventListener('submit', (e) =>   {

            e.preventDefault() 
           
            //create a Conversation Object in database
            const conversationObject =  Conversation.createConversation(senderId,recipient_id, e)
        })
       
    }
    
}









