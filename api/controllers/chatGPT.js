const axios = require('axios');
require('dotenv').config();

const analyzeText = async (message) => {
  try {
    const apiUrl = 'https://api.openai.com/v1/chat/completions';
    const apiKey = process.env.OPENAI_API_KEY;

    const response = await axios.post(apiUrl, {
      messages: [
        { role: 'system', content: 'You are a helpful assistant that analyzes text.' },
        { role: 'user', content: `Analise a linguagem, estrutura e conteúdo do seguinte texto: ${message}` }
      ],
      model: 'gpt-3.5-turbo',
      temperature: 0.5,
      max_tokens: 400,
    }, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
    });

    return response.data.choices[0].message.content;
  } catch (error) {
    console.log('Erro ao realizar a análise de texto:', error);
    throw error;
  }
};

const validateSummary = async (message) => {
  try {
    const apiUrl = 'https://api.openai.com/v1/chat/completions';
    const apiKey = process.env.OPENAI_API_KEY;

    const response = await axios.post(apiUrl, {
      messages: [
        { role: 'system', content: 'You are a helpful assistant that validates summaries.' },
        { role: 'user', content: `Verifique se a seção resumo foi preenchida e está alinhada com os tópicos discutidos no restante do artigo: ${message}` }
      ],
      model: 'gpt-3.5-turbo',
      temperature: 0.5,
      max_tokens: 400,
    }, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
    });

    return response.data.choices[0].message.content;
  } catch (error) {
    console.log('Erro ao realizar a análise de resumo:', error);
    throw error;
  }
};

const findKeywords = async (message) => {
  try {
    const apiUrl = 'https://api.openai.com/v1/chat/completions';
    const apiKey = process.env.OPENAI_API_KEY;

    const response = await axios.post(apiUrl, {
      messages: [
        { role: 'system', content: 'You are a helpful assistant that identifies keywords.' },
        { role: 'user', content: `Identifique os seis termos relevantes com maior ocorrência no seguinte texto: ${message}` }
      ],
      model: 'gpt-3.5-turbo',
      temperature: 0.5,
      max_tokens: 50,
    }, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
    });

    return response.data.choices[0].message.content;
  } catch (error) {
    console.log('Erro ao realizar a análise de palavras chave:', error);
    throw error;
  }
};

module.exports = { analyzeText, validateSummary, findKeywords };
