document.addEventListener('DOMContentLoaded', function () {
    const sendBtn = document.getElementById('send-btn');
    const voiceBtn = document.getElementById('voice-btn');
    const input = document.getElementById('user-input');
    const chatbox = document.getElementById('chatbox');

    sendBtn.addEventListener('click', sendMessage);
    input.addEventListener('keypress', function (e) {
        if (e.key === 'Enter') sendMessage();
    });
    voiceBtn.addEventListener('click', startVoiceInput);

    function appendMessage(sender, text) {
        const msg = document.createElement('div');
        msg.className = sender === 'user' ? 'text-right' : 'text-left';
        msg.innerHTML = `<span class="inline-block bg-${sender === 'user' ? 'blue' : 'gray'}-200 p-2 rounded">${text}</span>`;
        chatbox.appendChild(msg);
        chatbox.scrollTop = chatbox.scrollHeight;
    }

    function sendMessage() {
        const message = input.value.trim();
        if (!message) return;

        appendMessage('user', message);
        input.value = '';

        fetch('/chat', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ message })
        })
        .then(res => res.json())
        .then(data => {
            appendMessage('bot', data.response);
            speak(data.response);
        });
    }

    function startVoiceInput() {
        const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
        recognition.lang = 'en-US';
        recognition.start();

        recognition.onresult = function (event) {
            const transcript = event.results[0][0].transcript;
            input.value = transcript;
            sendMessage();
        };

        recognition.onerror = function (event) {
            alert('Voice recognition error: ' + event.error);
        };
    }

    function speak(text) {
        const utterance = new SpeechSynthesisUtterance(text);
        window.speechSynthesis.speak(utterance);
    }
});
