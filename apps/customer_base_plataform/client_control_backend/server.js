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
const REPO_NAME = 'emeg_orc';
const FILE_PATH = 'apps/customer_base_plataform/client_control_backend/data/clients_equipaments.json'; // Caminho correto do arquivo no repositório
const BRANCH = 'main';

// Endpoint para atualizar o arquivo JSON no GitHub
app.post('/update-data', async (req, res) => {
    try {
        const { clients_equipaments_array } = req.body; // Recebe os dados do frontend

        if (!clients_equipaments_array) {
            return res.status(400).send('Nenhum dado recebido.');
        }

        // Busca o arquivo atual do GitHub
        const response = await axios.get(`https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/contents/${FILE_PATH}?ref=${BRANCH}`, {
            headers: {
                Authorization: `Bearer ${GITHUB_TOKEN}`,
                Accept: 'application/vnd.github.v3+json',
            },
        });

        const fileSha = response.data.sha; // Obtém o SHA atual do arquivo
        const existingContent = Buffer.from(response.data.content, 'base64').toString('utf8'); // Decodifica o conteúdo existente

        // Atualiza o conteúdo com os novos dados
        const updatedContent = Buffer.from(JSON.stringify(clients_equipaments_array, null, 2)).toString('base64');

        // Atualiza o arquivo no GitHub
        await axios.put(
            `https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/contents/${FILE_PATH}`,
            {
                message: 'Update clients data', // Mensagem de commit
                content: updatedContent, // Novo conteúdo codificado em base64
                sha: fileSha, // SHA do arquivo anterior
                branch: BRANCH, // Branch alvo
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
        console.error('Erro ao atualizar o arquivo:', error.response ? error.response.data : error.message);
        res.status(500).send('Erro ao atualizar os dados.');
    }
});

// Roda o servidor
app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});
