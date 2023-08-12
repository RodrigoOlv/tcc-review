const axios = require('axios');
require('dotenv').config();

const analyzeText = async (message) => {
  try {
    const apiUrl = 'https://api.openai.com/v1/completions';
    const apiKey = process.env.OPENAI_API_KEY;

    const response = await axios.post(apiUrl, {
      model: 'text-davinci-003',
      prompt: `Analise a linguagem, estrutura e conteúdo do seguinte texto: ${message}`,
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
    console.log('Erro ao realizar a análise de texto:', error);
    throw error;
  }
};

const validateSummary = async (message) => {
  try {
    const apiUrl = 'https://api.openai.com/v1/completions';
    const apiKey = process.env.OPENAI_API_KEY;

    const response = await axios.post(apiUrl, {
      model: 'text-davinci-003',
      prompt: `Verifique se a seção resumo foi preenchida e está alinhada com os tópicos discutidos no restante do artigo: ${message}`,
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
    console.log('Erro ao realizar a análise de resumo:', error);
    throw error;
  }
};

const findKeywords = async (message) => {
  try {
    const apiUrl = 'https://api.openai.com/v1/completions';
    const apiKey = process.env.OPENAI_API_KEY;

    const response = await axios.post(apiUrl, {
      model: 'text-davinci-003',
      prompt: `Identifique os seis termos relevantes com maior ocorrência no seguinte texto: ${message}`,
      temperature: 0.5,
      max_tokens: 50,
    }, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
    });

    return response.data.choices[0].text;
  } catch (error) {
    console.log('Erro ao realizar a análise de palavras chave:', error);
    throw error;
  }
};

module.exports = { analyzeText, validateSummary, findKeywords };
