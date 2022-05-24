
// https://share.vidyard.com/watch/xLWD1XRtfmjgZiivQc1ZXT?

class Conversation{
    constructor(sender_id, recipient_id) {
        this.sender_id = sender_id ;
        this.recipient_id = recipient_id;
    }

    static makeConversation(sender_id, recipient_id) {
        var obj = new Conversation(sender_id, recipient_id)
        return obj;
    }

    static createConversation(senderIdString,recipientIdString, e){

        //convert the sender and recipient string data from event Listener input to Integer
        const senderID = parseInt(senderIdString);
        const recipientID = parseInt(recipientIdString);
    
        const newMessage = e.target.children[0].value
        if (newMessage === "") {
            return window.alert("You entered a blank username")
        } else {
            //Post to Conversation Create Controller
            const newConversation =   Conversation.newConversationPush(senderID, recipientID,newMessage )
            console.log(`Conversation Data ${newConversation}`)
            return newConversation
        }
    }

    static fetchConversation(sender_id, recipient_id) {

    
        const userURL = "http://localhost:3000/conversations";
        return fetch(userURL)
        .then(function(response) {
            return response.json();
        })
        .then(function(userJson) {
            const messageList =  document.querySelector("#message-list")

            //Ensure that the mesage li items are refreshed 
            messageList.innerHTML = ""
            
            return Conversation.renderConversation(userJson, sender_id, recipient_id)
            console.log(userJson);   
        })
        .catch(function(error) {
            // alert("Conversation could not be rendered on screen");
            console.log(error.message);
        });

        
    }

    //Post to Create Method in Conversation Controller 
    //Call Post Method in Message Controller to tie Conversation and Message together.
    static newConversationPush(senderId, recipientID, newMessage){

    
        const userURL = "http://localhost:3000/conversations";
        
        const configurationObject = {
            method: "POST",
            headers: {
                       "Content-Type": "application/json",
                        Accept: "application/json"
                      },
            body: JSON.stringify({
                sender_id: senderId,
                recipient_id: recipientID
            })
        };  
        return fetch(userURL, configurationObject)
        .then(function(response) {
            return  response.json();
        })
        .then(function(conversation) {
            console.log(`about to post to message`)
            console.log(`${senderId}`)
            console.log(`${conversation['data']['id']}`)
            console.log(newMessage)
            
            
           const chatbox =  document.querySelector("#chatbox")
           chatbox.className = conversation['data']['id']
            
           //POST Action in Message Controller in Create Method
           //New Message Instance Created in database
            return Message.postMessage(senderId, parseInt(`${conversation['data']['id']}`), newMessage )
            // console.log(newMessageObject)
            // return newMessageObject
        })
        .catch(function(error) {
            alert("Conversation is not created");
            console.log(error.message);
        });
        
    }


    static renderConversation(array, sender_id, recipient_id){
        
        
        const arrayData = array['data']
        let convo 
       
        
        //Related to fetchingConversation. Iterete through array of all conversations.
        //if within array can find sender_id and recipient_id then pass data into convo which will hold messages. 
        //Also look for sender_id and recipient_id interchanged so if UserA was sender or the recipient of conversation.
        //New Message Instance Created in database
        for (let i = 0; i < arrayData.length; i++) {
            if (array['data'][i]['attributes']['sender_id']  === parseInt(`${sender_id}`)  &&  array['data'][i]['attributes']['recipient_id'] === parseInt(`${recipient_id}`)) {
                convo = array['data'][i]['attributes']
            } else if (array['data'][i]['attributes']['sender_id']  === parseInt(`${recipient_id}`)  &&  array['data'][i]['attributes']['recipient_id'] === parseInt(`${sender_id}`)) {
                convo = array['data'][i]['attributes']
            }
          }

          debugger 

          let messages = convo['messages']
          

          //fetch user data 





   
        let chatbot = document.querySelector("#chatbox")

        
        
        let listElement = document.querySelector("#message-list")


          for (let i = 0; i < messages.length; i++) {

            debugger
            console.log(convo.messages[i].content)            
            let li = document.createElement('li')
            li.innerText =  convo.messages[i].content
            listElement.appendChild(li)
            
          }
  
  
    }


    //function to fetchconversation

    static grabMessages(sender_id, recipient_id){
        Conversation.fetchConversation(sender_id, recipient_id)
    }
}



