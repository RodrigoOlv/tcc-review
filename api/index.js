const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const { getDocumentContent } = require('./controllers/googleAuth');
const { sendMessageToChatGPT } = require('./controllers/chatGPT');

const app = express();
app.use(bodyParser.json());
app.use(cors());

app.post('/document', async (req, res) => {
  try {
    const documentId = req.body.id;
    const options = req.body.options;

    // Verifica se options foi fornecido e se pelo menos uma opção é verdadeira
    if (!options || !Object.values(options).some(value => value)) {
      res.status(400).send({ message: 'Você deve selecionar pelo menos uma opção de revisão.' });
      return;
    }

    const content = await getDocumentContent(documentId);
    let generatedText = null;
    let foundKeywords = null;

    if (options.generateSummary) {
      generatedText = await sendMessageToChatGPT(content);
    }

    if (options.findKeywords) {
      // Implemente a lógica para encontrar as palavras-chave no conteúdo aqui.
      // Por exemplo, você pode utilizar alguma biblioteca ou algoritmo para isso.
      foundKeywords = findKeywords(content);
    }

    const responseObj = {
      generatedText: generatedText,
      foundKeywords: foundKeywords,
    };

    res.send(responseObj);
  } catch (err) {
    console.log(`Ocorreu um erro: ${err}`);
    res.status(500).send(err);
  }
});


const port = 3000;
app.listen(port, () => {
  console.log(`API rodando na porta ${port}`);
});
