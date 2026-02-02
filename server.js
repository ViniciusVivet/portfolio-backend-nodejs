// Importa o módulo http, que é nativo do Node.js e permite criar servidores web
const http = require('http'); 
// Importa o módulo url para analisar URLs de requisições
const url = require('url');
// Importa o módulo querystring para analisar strings de consulta (como dados de formulário)
const querystring = require('querystring'); 

// --- VARIÁVEIS DE AMBIENTE ---
// OBRIGATÓRIAS para deploy no Render ou outros serviços:
// - PORT: Porta do servidor (Render define automaticamente)
// - ALLOWED_ORIGINS: Lista de origens permitidas, separadas por vírgula
//   Exemplo: "https://viniciusvivet.github.io,http://localhost:3000"
// - DESTINATION_EMAIL: Email para onde as mensagens serão enviadas (futuro uso com Nodemailer)

const PORT = process.env.PORT || 3000;
const ALLOWED_ORIGINS = process.env.ALLOWED_ORIGINS 
    ? process.env.ALLOWED_ORIGINS.split(',').map(origin => origin.trim())
    : ['https://viniciusvivet.github.io', 'http://localhost:3000', 'http://127.0.0.1:5500'];

console.log('🔧 Configurações da API:');
console.log('📍 Porta:', PORT);
console.log('🌐 Origens permitidas (CORS):', ALLOWED_ORIGINS);
console.log(''); 

// --- Função para parsear multipart/form-data ---
// Como estamos usando Node.js puro, precisamos extrair os dados manualmente
function parseMultipartFormData(body, boundary) {
    const result = {};
    const parts = body.split(boundary);
    
    for (let part of parts) {
        if (part.includes('Content-Disposition: form-data;')) {
            const nameMatch = part.match(/name="([^"]+)"/);
            if (nameMatch) {
                const fieldName = nameMatch[1];
                // Pega o conteúdo após as quebras de linha do cabeçalho
                const valueMatch = part.split('\r\n\r\n')[1];
                if (valueMatch) {
                    result[fieldName] = valueMatch.replace(/\r\n--$/, '').trim();
                }
            }
        }
    }
    return result;
}

// --- Cria o servidor HTTP ---
// A função http.createServer recebe uma função que será executada a cada requisição (req, res)
const server = http.createServer((req, res) => {
    // --- Configuração de CORS (Cross-Origin Resource Sharing) ---
    const origin = req.headers.origin;
    
    // Verifica se a origem da requisição está na lista de permitidas
    if (origin && ALLOWED_ORIGINS.includes(origin)) {
        res.setHeader('Access-Control-Allow-Origin', origin);
    } else if (ALLOWED_ORIGINS.includes('*')) {
        res.setHeader('Access-Control-Allow-Origin', '*');
    }
    
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    // Lida com requisições OPTIONS (pré-voo do CORS)
    // Navegadores fazem uma requisição OPTIONS antes de um POST complexo para verificar permissões
    if (req.method === 'OPTIONS') {
        res.writeHead(204);
        res.end();
        return;
    }

    // Analisa a URL da requisição
    const parsedUrl = url.parse(req.url, true);
    const pathname = parsedUrl.pathname;

    // --- Lógica para a Rota de Envio do Formulário de Contato ---
    // Verifica se a requisição é um POST e se o caminho é /send-message
    if (req.method === 'POST' && pathname === '/send-message') {
        let body = '';
        const contentType = req.headers['content-type'] || '';
        
        // Coleta os dados do corpo da requisição em pedaços (chunks)
        req.on('data', chunk => {
            body += chunk.toString();
        });

        // Quando todos os pedaços do corpo da requisição foram recebidos
        req.on('end', () => {
            let formData = {};
            
            try {
                // Detecta o tipo de encoding e faz o parsing apropriado
                if (contentType.includes('multipart/form-data')) {
                    // Extrai o boundary do Content-Type
                    const boundaryMatch = contentType.match(/boundary=(.+)/);
                    if (boundaryMatch) {
                        const boundary = '--' + boundaryMatch[1];
                        formData = parseMultipartFormData(body, boundary);
                    }
                } else if (contentType.includes('application/x-www-form-urlencoded') || contentType.includes('application/json')) {
                    // Para form-urlencoded tradicional ou JSON
                    if (contentType.includes('application/json')) {
                        formData = JSON.parse(body);
                    } else {
                        formData = querystring.parse(body);
                    }
                } else {
                    // Tentativa de fallback para form-urlencoded
                    formData = querystring.parse(body);
                }

                // Aceita tanto campos em inglês (name, email, message) quanto português (nome, mensagem)
                const name = formData.name || formData.nome || 'Não informado';
                const email = formData.email || 'Não informado';
                const subject = formData.subject || formData.assunto || 'Sem assunto';
                const message = formData.message || formData.mensagem || 'Sem mensagem';

                console.log('--- NOVA MENSAGEM RECEBIDA DO FORMULÁRIO ---');
                console.log('📧 Content-Type:', contentType);
                console.log('👤 Nome:', name);
                console.log('📨 Email:', email);
                console.log('📋 Assunto:', subject);
                console.log('💬 Mensagem:', message);
                console.log('🕐 Horário:', new Date().toLocaleString('pt-BR'));
                console.log('---------------------------------------------\n');

                // Validação básica
                if (!name || name === 'Não informado' || !email || email === 'Não informado') {
                    res.writeHead(400, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({ 
                        success: false,
                        message: 'Nome e email são obrigatórios.' 
                    }));
                    return;
                }

                // Responde com sucesso
                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ 
                    success: true,
                    message: 'Mensagem recebida com sucesso! Em breve entrarei em contato.' 
                }));

                // FUTURAMENTE: Aqui você integraria Nodemailer para enviar e-mail
                // usando process.env.DESTINATION_EMAIL
                
            } catch (error) {
                console.error('❌ Erro ao processar formulário:', error);
                res.writeHead(500, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ 
                    success: false,
                    message: 'Erro ao processar mensagem. Tente novamente.' 
                }));
            }
        });
    } 
    // --- Lógica para a Rota Raiz (apenas um exemplo) ---
    else if (req.method === 'GET' && pathname === '/') {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({
            api: 'Portfolio Backend API',
            version: '1.0.0',
            status: 'online',
            endpoints: {
                contact: {
                    method: 'POST',
                    path: '/send-message',
                    accepts: ['multipart/form-data', 'application/x-www-form-urlencoded', 'application/json'],
                    fields: {
                        required: ['name (ou nome)', 'email'],
                        optional: ['subject (ou assunto)', 'message (ou mensagem)']
                    }
                }
            }
        }));
    }
    // --- Lógica para Rotas Não Encontradas ---
    else {
        res.writeHead(404, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ 
            error: 'Rota não encontrada',
            message: 'Verifique o caminho da requisição. Use POST /send-message para enviar mensagens.' 
        }));
    }
});

// --- Inicia o Servidor e o Faz Escutar Requisições na Porta Definida ---
server.listen(PORT, () => {
    console.log(`✅ Servidor Node.js rodando em: http://localhost:${PORT}`);
    console.log(`📮 Endpoint para o formulário de contato (POST): http://localhost:${PORT}/send-message`);
    console.log(`📖 Documentação da API (GET): http://localhost:${PORT}`);
    console.log('\n🎯 Aguardando requisições...\n');
});