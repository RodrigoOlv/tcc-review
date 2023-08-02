const axios = require('axios');
require('dotenv').config();

const sendMessageToChatGPT = async (message) => {
  try {
    const apiUrl = 'https://api.openai.com/v1/completions';
    const apiKey = process.env.OPENAI_API_KEY;

    const response = await axios.post(apiUrl, {
      model: 'text-davinci-003',
      prompt: `Faça um resumo deste texto: ${message}`,
      temperature: 0.5,
      max_tokens: 400,
    }, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
    });

    return response.data.choices[0].text;
  } catch (error) {
    console.log('Erro ao enviar a mensagem para o ChatGPT:', error);
    throw error;
  }
};

module.exports = { sendMessageToChatGPT };
