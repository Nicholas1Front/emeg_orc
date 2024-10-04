const express = require('express');
const axios = require('axios');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware para parsear JSON
app.use(express.json());

// Habilitar CORS
const cors = require('cors');
app.use(cors());

// Variáveis de ambiente para GitHub
const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
const REPO_OWNER = 'Nicholas1Front';
const REPO_NAME = 'emeg_system';
const FILE_PATH = 'apps/customer_base_plataform/client_control_backend/data/clients_equipaments.json'; // Caminho correto do arquivo no repositório
const BRANCH = 'main';

// Endpoint para atualizar o arquivo JSON no GitHub
app.post('/update-data', async (req, res) => {
    try {
        const { clients_equipaments_array } = req.body; 

        if (!clients_equipaments_array) {
            return res.status(400).send('Nenhum dado recebido.');
        }

        // 1. Busca o arquivo atual do GitHub
        const response = await axios.get(`https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/contents/${FILE_PATH}?ref=${BRANCH}`, {
            headers: {
                Authorization: `Bearer ${GITHUB_TOKEN}`,
                Accept: 'application/vnd.github.v3+json',
            },
        });

        const fileSha = response.data.sha;
        const existingContent = Buffer.from(response.data.content, 'base64').toString('utf8');

        // 2. Atualiza o conteúdo com os novos dados
        const updatedContent = Buffer.from(JSON.stringify(clients_equipaments_array, null, 2)).toString('base64');

        // 3. Atualiza o arquivo no GitHub
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

        // 4. Verifica se o arquivo foi atualizado no GitHub Pages
        let isUpdated = false;
        const maxAttempts = 10;
        let attempts = 0;

        while (!isUpdated && attempts < maxAttempts) {
            await new Promise(r => setTimeout(r, 5000)); // Espera 5 segundos antes de verificar novamente
            const githubPagesResponse = await axios.get(`https://nicholas1front.github.io/emeg_system/${FILE_PATH}`);
            const currentContent = await githubPagesResponse.data;

            if (JSON.stringify(currentContent) === JSON.stringify(clients_equipaments_array)) {
                isUpdated = true; // O arquivo no GitHub Pages foi atualizado
            }
            attempts++;
        }

        if (!isUpdated) {
            return res.status(500).send('Commit realizado, mas o GitHub Pages não foi atualizado a tempo.');
        }

        res.send('Dados atualizados com sucesso no GitHub Pages!');
    } catch (error) {
        console.error('Erro ao atualizar o arquivo:', error.response ? error.response.data : error.message);
        res.status(500).send('Erro ao atualizar os dados.');
    }
});

// Roda o servidor
app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});
