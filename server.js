// Importa o módulo http, que é nativo do Node.js e permite criar servidores web
const http = require('http'); 
// Importa o módulo url para analisar URLs de requisições
const url = require('url');
// Importa o módulo querystring para analisar strings de consulta (como dados de formulário)
const querystring = require('querystring'); 

// Define a porta em que o servidor irá escutar as requisições
const PORT = 3000; 

// --- Cria o servidor HTTP ---
// A função http.createServer recebe uma função que será executada a cada requisição (req, res)
const server = http.createServer((req, res) => {
    // --- Configuração de CORS (Cross-Origin Resource Sharing) ---
    // Isso é FUNDAMENTAL para que seu site HTML (que está em um "domínio" diferente, mesmo que local)
    // possa enviar requisições para este servidor Node.js sem ser bloqueado pelo navegador.
    res.setHeader('Access-Control-Allow-Origin', '*'); // Permite requisições de qualquer origem
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS'); // Métodos HTTP permitidos
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type'); // Cabeçalhos permitidos

    // Lida com requisições OPTIONS (pré-voo do CORS)
    // Navegadores fazem uma requisição OPTIONS antes de um POST complexo para verificar permissões
    if (req.method === 'OPTIONS') {
        res.writeHead(204); // Responde com sucesso (No Content)
        res.end();
        return; // Termina a função aqui
    }

    // Analisa a URL da requisição
    const parsedUrl = url.parse(req.url, true);
    const pathname = parsedUrl.pathname; // Pega apenas o caminho da URL (ex: /send-message)

    // --- Lógica para a Rota de Envio do Formulário de Contato ---
    // Verifica se a requisição é um POST e se o caminho é /send-message
    if (req.method === 'POST' && pathname === '/send-message') {
        let body = '';
        // Coleta os dados do corpo da requisição em pedaços (chunks)
        req.on('data', chunk => {
            body += chunk.toString(); // Converte cada pedaço (buffer) para string
        });

        // Quando todos os pedaços do corpo da requisição foram recebidos
        req.on('end', () => {
            const formData = querystring.parse(body); // Analisa os dados do formulário (ex: name=Douglas&email=...)

            console.log('--- NOVA MENSAGEM RECEBIDA DO FORMULÁRIO ---');
            console.log('Nome:', formData.name);
            console.log('Email:', formData.email);
            console.log('Assunto:', formData.subject || 'N/A'); // Adiciona N/A se assunto for vazio
            console.log('Mensagem:', formData.message);
            console.log('---------------------------------------------\n');

            // --- Lógica para Responder ao Cliente (Seu Site HTML) ---
            // Define o status HTTP 200 (OK) e o tipo de conteúdo como JSON
            res.writeHead(200, { 'Content-Type': 'application/json' });
            // Envia uma resposta JSON para o navegador
            res.end(JSON.stringify({ message: 'Mensagem recebida com sucesso no servidor!' }));

            // FUTURAMENTE: Aqui você integraria um serviço real de envio de e-mail (ex: Nodemailer)
            // ou salvaria os dados em um banco de dados. Por enquanto, só imprime no terminal.
        });
    } 
    // --- Lógica para a Rota Raiz (apenas um exemplo) ---
    else if (req.method === 'GET' && pathname === '/') {
        res.writeHead(200, { 'Content-Type': 'text/plain' });
        res.end('Servidor Node.js para o portfolio rodando! Acesse /send-message com POST.');
    }
    // --- Lógica para Rotas Não Encontradas ---
    else {
        res.writeHead(404, { 'Content-Type': 'text/plain' });
        res.end('Rota não encontrada. Verifique o caminho da requisição.');
    }
});

// --- Inicia o Servidor e o Faz Escutar Requisições na Porta Definida ---
server.listen(PORT, () => {
    console.log(`Servidor Node.js rodando em: http://localhost:${PORT}`);
    console.log(`Endpoint para o formulário de contato (POST): http://localhost:${PORT}/send-message`);
});