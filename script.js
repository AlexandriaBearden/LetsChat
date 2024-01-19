const chatInput = document.querySelector('.chat-input textarea');
const sendChatBtn = document.querySelector('.chat-input span');
const chatbox = document.querySelector(".chatbox");
const chatbotToggler = document.querySelector('.chatbot-toggler');
const chatbotCloseBtn = document.querySelector('.close-btn');


let userMessage;
const API_KEY = "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";
const inputInitHeight = chatInput.scrollHeight;

const createChatLi = (message, className) => {
// creates chat li element with passed message/className 
    const chatLi = document.createElement("li");
    chatLi.classList.add("chat", className);
    let chatContent = className === "outgoing" ? `<p></p>` : `<span class="material-icons">mood</span><p></p>`;
    chatLi.innerHTML = chatContent;
    chatLi.querySelector("p").textContent = message;
    return chatLi;
}

const generateResponse = (incomingChatLi) => {
    const API_URL = "https://api.openai.com/v1/chat/completions";
    const messageElement = incomingChatLi.querySelector("p");

    const requestOptions = {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${API_KEY}`
        },
        body: JSON.stringify({
            model: "gpt-3.5-turbo",
            messages: [{role: "user", content: userMessage}]
        })
    }
    // sends POST request to API for response
    fetch(API_URL, requestOptions).then(res => res.json()).then(data => {
        messageElement.textContent = data.choices[0].message.content;
    }).catch((error) => {
        messageElement.classList.add("error");
        messageElement.textContent = "Oh no! Something went wrong. Let's try again!";
    }).finally(() => chatbox.scrollTo(0, chatbox.scrollHeight));
}

const handleChat = () => {
     userMessage = chatInput.value.trim();
     console.log(userMessage);
     if(!userMessage) return;
     chatInput.value = "";
     chatInput.style.height = `${inputInitHeight}px`;

// appends user message to chatbox
     chatbox.appendChild(createChatLi(userMessage, "outgoing"));
     chatbox.scrollTo(0, chatbox.scrollHeight);

     setTimeout(() => {
        //displays "give me a second" while user waits for response
        const incomingChatLi = createChatLi("Give me a second...", "incoming")
        chatbox.appendChild(incomingChatLi);
        chatbox.scrollTo(0, chatbox.scrollHeight);
        generateResponse(incomingChatLi); 
     }, 600);
}

chatInput.addEventListener("input", () => {
    // adjusts the height of textarea
    chatInput.style.height = `${inputInitHeight}px`;
    chatInput.style.height = `${chatInput.scrollHeight}px`;
});

chatInput.addEventListener("keydown", (e) => {

   if(e.key === "Enter" && !e.shiftkey && window.innerWidth > 800) {
       e.preventDefault();
       handleChat();
   }
});

sendChatBtn.addEventListener('click', handleChat);
chatbotToggler.addEventListener("click", () => document.body.classList.toggle("show-chatbot"));