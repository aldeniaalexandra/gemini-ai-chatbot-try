const form = document.getElementById('chat-form');
const input = document.getElementById('user-input');
const chatBox = document.getElementById('chat-box');

form.addEventListener('submit', async function (e) {
  e.preventDefault();

  const userMessage = input.value.trim();
  if (!userMessage) return;

  appendMessage('user', userMessage);
  input.value = '';
  appendMessage('bot', 'Gemini is thinking...'); // Placeholder while waiting for response

  try {
    const response = await fetch('/api/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ message: userMessage }),
    });

    // Remove the "thinking..." placeholder
    const thinkingMessage = chatBox.querySelector('.message.bot:last-child');
    if (thinkingMessage && thinkingMessage.textContent.includes('thinking...')) {
      thinkingMessage.remove();
    }

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ reply: 'An error occurred with the API.' }));
      appendMessage('bot', `Error: ${errorData.reply || response.statusText}`);
      return;
    }

    const data = await response.json();
    appendMessage('bot', data.reply);
  } catch (error) {
    appendMessage('bot', 'Failed to connect to the server. Please try again.');
    console.error('Error sending message to backend:', error);
  }
});

function appendMessage(sender, text) {
  const msg = document.createElement('div');
  msg.classList.add('message', sender);
  msg.textContent = text;
  chatBox.appendChild(msg);
  chatBox.scrollTop = chatBox.scrollHeight;
}
