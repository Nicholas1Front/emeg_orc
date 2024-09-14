const express = require('express');
const axios = require('axios');
const cors = require('cors'); // Importando o CORS
const fs = require('fs');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Habilitando CORS para permitir requisições de qualquer origem
app.use(cors()); 

// Middleware para parsear JSON
app.use(express.json());

// Variáveis de ambiente para GitHub
const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
const REPO_OWNER = 'Nicholas1Front';
const REPO_NAME = 'emeg_orc';
const FILE_PATH = 'clients_equipaments.json';
const BRANCH = 'main';

// Endpoint para atualizar o arquivo JSON no GitHub
app.post('/update-data', async (req, res) => {
    try {
        const { clientsData } = req.body; // Recebe os dados do frontend

        // Busca o arquivo atual do GitHub
        const response = await axios.get(`https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/contents/${FILE_PATH}?ref=${BRANCH}`, {
            headers: {
                Authorization: `Bearer ${GITHUB_TOKEN}`,
                Accept: 'application/vnd.github.v3+json',
            },
        });

        const fileSha = response.data.sha;
        const updatedContent = Buffer.from(JSON.stringify(clientsData, null, 2)).toString('base64');

        // Atualiza o arquivo no GitHub
        await axios.put(
            `https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/contents/${FILE_PATH}`,
            {
                message: 'Update clients data',
                content: updatedContent,
                sha: fileSha,
                branch: BRANCH,
            },
            {
                headers: {
                    Authorization: `Bearer ${GITHUB_TOKEN}`,
                    Accept: 'application/vnd.github.v3+json',
                },
            }
        );

        res.send('Dados atualizados com sucesso!');
    } catch (error) {
        console.error('Erro ao atualizar o arquivo:', error);
        res.status(500).send('Erro ao atualizar os dados.');
    }
});

// Roda o servidor
app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});
