
class Message{
    constructor(userId, conversationId, content) {
        this.user_id = userId ;
        this.conversation_id = conversationId;
        this.content = content;
    }

          //POST Action in Message Controller in Create Method
           //New Message Instance Created in database
    static postMessage(senderId, conversationID, content) {
       
        const messageURL = "http://localhost:3000/messages";

       
            const configurationObject = {
                method: "POST",
                headers: {
                    // #type of content type we are sending 
                    // type of content type we accept
                    "Content-Type": "application/json",
                    Accept: "application/json"
                },
                body: JSON.stringify({
                    user_id: senderId,
                    conversation_id:  conversationID,
                    content:  content,
                })
            };
    
            fetch(messageURL, configurationObject)
            .then(function(response) {
                return response.json();
            })
            .then(function(message) {
                console.log(message);                
                return message
            })
            .catch(function(error) {
                alert("Message not created");
                console.log(error.message);
            });
        



    }


   
  
 


   

}