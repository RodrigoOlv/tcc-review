const { google } = require('googleapis');
require('dotenv').config();

const authClient = new google.auth.JWT({
  email: process.env.GOOGLE_CLIENT_EMAIL,
  key: process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/gm, '\n'),
  scopes: ['https://www.googleapis.com/auth/documents'],
});

const getDocumentContent = async (documentId) => {
  const docs = google.docs({ version: 'v1', auth: authClient });

  try {
    const result = await docs.documents.get({ documentId });
    const document = result.data;
    return (document.body.content ?? [])
      .map((c) => (c.paragraph?.elements ?? [])
        .map((e) => e.textRun?.content ?? '')
        .join(''))
      .join('');
  } catch (err) {
    console.log('Erro ao obter o conteúdo do documento:', err);
    throw err;
  }
};

module.exports = { getDocumentContent };
