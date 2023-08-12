const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const { getDocumentContent } = require('./controllers/googleAuth');
const { analyzeText, validateSummary, findKeywords } = require('./controllers/chatGPT');

const app = express();
app.use(bodyParser.json());
app.use(cors());

app.post('/document', async (req, res) => {
  try {
    const documentId = req.body.id;
    const options = req.body.options;

    const content = await getDocumentContent(documentId);
    let summary = null;
    let keywords = null;
    let analysis = null;
    
    analysis = await analyzeText(content);

    if (options.validateSummary) {
      summary = await validateSummary(content);
    }

    if (options.findKeywords) {
      keywords = await findKeywords(content);
    }

    const responseObj = {
      analysis: analysis,
      summary: summary,
      keywords: keywords,
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
