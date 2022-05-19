document.addEventListener("DOMContentLoaded", () => {
    User.createUser();
})


class User {
    constructor (name) {
        this.username = name;
    }

    static createUser(){
        const newUserForm = document.getElementsByClassName('new-user-form')[0]
        
        newUserForm.addEventListener('submit', (e) =>   {

            e.preventDefault() //ensure the button doesn't redirect on click. 
            const formValue =  e.target.children[1].value; //value of the input which is the username

            if (formValue === "") {
                return window.alert("You entered a blank username. Please enter a valid username.")
            } else {
                // let newUserObject = new User(formValue)
                const userURL = "http://localhost:3000/users";

                //post to the User Controller Create method 
                const configurationObject = {
                    method: "POST",
                    headers: {
                        // #type of content type we are sending 
                        // type of content type we accept
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
                    let newUser = new User(user)
                    console.log(newUser);
                    newUser.displayUser()
                    User.fetchUsers(newUser);
                })
                .catch(function(error) {
                    alert("User not added to User Controller");
                    console.log(error.message);
                });
            }
        })
    }

    //
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

    static fetchUsers(userInstance) {

        let currentUser = userInstance 

        const userURL = "http://localhost:3000/users";
        return fetch(userURL)
        .then(function(response) {
            return response.json();
        })
        .then(function(userJson) {
            return currentUser.renderRegisteredUsers(currentUser, userJson["data"]) 
            console.log(userJson);   
        })
        .catch(function(error) {
            alert("Cannot get index User Controllers");
            console.log(error.message);
        });
    }

    renderRegisteredUsers(userInstance, users) {
        let newUsersArray = users.slice()
        let registeredUserSection = document.getElementsByClassName('registered-users-section')[0]
        let registeredUsersContainer = document.createElement('div')
        let listElement = document.createElement('ul')

    
        registeredUserSection.appendChild(listElement)

        
    
        //list of all users that don't include user instance
        let ArrayOfRegisteredUser = newUsersArray.filter(user => {
            return user["attributes"]['username'] != userInstance['username']['data']['attributes']['username']
        })

        
       //create list for each user 
       ArrayOfRegisteredUser.forEach (user => {
        let li = document.createElement('li')
        li.innerText =  user['attributes']['username'] 
        listElement.appendChild(li)
        li.id = user.id
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
        Conversation.grabMessages(senderId, recipient_id)

        

        const chatbox =  document.querySelector("#chatbox")
        chatbox.style.color = "orange" 
        // chatbox.innerHTML = `....starting conversation with ${recipientName}.`
        let result =  this.sendlistener(sender, recipientName, recipientId)

        //on click of a user continually update the chatbox with updated converstions
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
           
    
            //create conversation in database
            const conversationObject =  Message.createConversation(senderId,recipient_id, e)
            
    
        })
       
    }


 



        

            
            //create a conversation instance

            // if (newMessage === "") {
            //     return window.alert("You entered a blank username")
            // } else {


                 //instantiate conversation and create conversation
            //      const newConversation = Conversation.(senderId, recipient_id)
            //      console.log(newConversation)
     
                 
            //     const userURL = "http://localhost:3000/messages";
    
            //     const configurationObject = {
            //         method: "POST",
            //         headers: {
            //             "Content-Type": "application/json",
            //             Accept: "application/json"
            //         },
            //         body: JSON.stringify({
            //             username: newMessage
            //         })
            //     };
        
            //     fetch(userURL, configurationObject)
            //     .then(function(response) {
            //         return response.json();
            //     })
            //     .then(function(message) {
            //         let newUser = new User(user)
            //         console.log(newUser);
            //         newUser.displayUser()
            //         User.fetchUsers(newUser);
            //         // debugger
            //         // let users =  newUser.fetchUsers()
                  
            //     })
            //     .catch(function(error) {
            //         alert("User not added to User Controller");
            //         console.log(error.message);
            //     });
            // }
            





            //get senderID 
            


            

            // const recipientID = Conversation.fetchRecipients(recipient)
            // // const recipientObject = Conversation.returnID(recipientID)



            // console.log(`sender data: ${sender}`)
            // console.log(`recipient data: ${recipient}`)

   
            // const newMessage = e.target.children[0].value
            // console.log(recipientID)

            

            // Conversation.(sender, recipient)



            // let newConversationObjectData = new Conversation(sender, recipient)
            // console.log(newConversationObjectData)
            // let newMessageObjectData = new Message(sender, newConversationObjectData, newMessage)
            // console.log(newMessageObjectData)
            

    
          





    

    


    

    


   

    
}


// function updateDiv(){ 
//     $( "#chatbox > div").load(window.location.href + "#chatbox > div" );
// }






