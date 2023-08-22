const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const { getDocumentContent, extractGoogleDocsId } = require('./controllers/google');
const { analyzeText, validateSummary, findKeywords } = require('./controllers/chatGPT');
const { validateReferences } = require('./referenceValidator'); // Importe a função

const app = express();
app.use(bodyParser.json());
app.use(cors());

const MAX_TOKENS_PER_REQUEST = 4000; // Limite máximo de tokens por solicitação

app.post('/document', async (req, res) => {
  try {
    const url = req.body.url;
    const documentId = extractGoogleDocsId(url);
    const options = req.body.options;

    const content = await getDocumentContent(documentId);
    let summary = null;
    let keywords = null;
    let analysis = null;
    let missingReferences = null;

    // Divide o conteúdo em partes menores para não exceder o limite de tokens
    const contentChunks = splitTextIntoChunks(content, MAX_TOKENS_PER_REQUEST);

    for (const chunk of contentChunks) {
      analysis = await analyzeText(chunk);

      if (options.validateSummary) {
        summary = await validateSummary(chunk);
      }

      if (options.findKeywords) {
        keywords = await findKeywords(chunk);
      }

      if (options.checkReferences) {
        missingReferences = validateReferences(chunk); // Use a função do arquivo separado
      }
    }

    const responseObj = {
      analysis: analysis,
      summary: summary,
      keywords: keywords,
      missingReferences: missingReferences,
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

// Função para dividir o texto em partes menores
const splitTextIntoChunks = (text, maxTokens) => {
  const chunks = [];
  const words = text.split(' ');
  let currentChunk = '';

  for (const word of words) {
    const wordTokens = word.split(' ').length;
    if ((currentChunk.length + wordTokens) <= maxTokens) {
      currentChunk += ` ${word}`;
    } else {
      chunks.push(currentChunk.trim());
      currentChunk = `${word}`;
    }
  }

  if (currentChunk.length > 0) {
    chunks.push(currentChunk.trim());
  }

  return chunks;
};