# 📧 Portfolio Backend API - Formulário de Contato

Backend em **Node.js puro** (sem frameworks) para processar o formulário de contato do portfólio pessoal hospedado no GitHub Pages.

## 🚀 Funcionalidades

- ✅ Aceita requisições POST com **multipart/form-data**, **application/x-www-form-urlencoded** e **application/json**
- ✅ CORS configurado para aceitar requisições do GitHub Pages
- ✅ Suporte a campos em português e inglês
- ✅ Validação básica de dados
- ✅ Logs detalhados no console
- ✅ Configuração via variáveis de ambiente

## 📋 Endpoints

### `GET /`
Retorna informações sobre a API e seus endpoints.

**Resposta:**
```json
{
  "api": "Portfolio Backend API",
  "version": "1.0.0",
  "status": "online",
  "endpoints": { ... }
}
```

### `POST /send-message`
Recebe mensagens do formulário de contato.

**Content-Type aceitos:**
- `multipart/form-data` (FormData)
- `application/x-www-form-urlencoded`
- `application/json`

**Campos aceitos:**
- `name` ou `nome` (obrigatório)
- `email` (obrigatório)
- `subject` ou `assunto` (opcional)
- `message` ou `mensagem` (opcional)

**Resposta de sucesso (200):**
```json
{
  "success": true,
  "message": "Mensagem recebida com sucesso! Em breve entrarei em contato."
}
```

**Resposta de erro (400):**
```json
{
  "success": false,
  "message": "Nome e email são obrigatórios."
}
```

## 🔧 Configuração Local

### 1. Clone o repositório
```bash
git clone [URL_DO_SEU_REPO]
cd portfolio-backend-nodejs
```

### 2. Configure as variáveis de ambiente
Copie o arquivo `.env.example` para `.env` e ajuste os valores:

```bash
cp .env.example .env
```

Edite o arquivo `.env`:
```env
PORT=3000
ALLOWED_ORIGINS=https://viniciusvivet.github.io,http://localhost:3000,http://127.0.0.1:5500
DESTINATION_EMAIL=seu-email@exemplo.com
```

### 3. Instale as dependências (não há dependências externas)
```bash
npm install
```

### 4. Inicie o servidor
```bash
npm start
```

O servidor estará disponível em `http://localhost:3000`

## 🌐 Deploy no Render

### 1. Crie um novo Web Service no Render

1. Acesse [render.com](https://render.com)
2. Clique em "New +" → "Web Service"
3. Conecte seu repositório do GitHub
4. Configure o serviço:

   - **Name:** `portfolio-backend` (ou o nome que preferir)
   - **Environment:** `Node`
   - **Build Command:** (deixe em branco ou `npm install`)
   - **Start Command:** `npm start`

### 2. Configure as variáveis de ambiente no Render

No painel do Render, vá em "Environment" e adicione:

| Key | Value |
|-----|-------|
| `ALLOWED_ORIGINS` | `https://viniciusvivet.github.io` |
| `DESTINATION_EMAIL` | `seu-email@exemplo.com` |

**Observação:** Não configure a variável `PORT` - o Render define automaticamente.

### 3. Deploy

O Render fará o deploy automaticamente. Após concluído, você receberá uma URL como:

```
https://portfolio-backend-xxxx.onrender.com
```

### 4. URL do endpoint

Seu endpoint completo será:
```
https://portfolio-backend-xxxx.onrender.com/send-message
```

## 🔗 Integração com o Frontend

No seu portfólio HTML, ajuste o action do formulário para:

```html
<form action="https://portfolio-backend-xxxx.onrender.com/send-message" method="POST">
    <input type="text" name="name" required>
    <input type="email" name="email" required>
    <input type="text" name="subject">
    <textarea name="message"></textarea>
    <button type="submit">Enviar</button>
</form>
```

Ou com JavaScript (fetch):

```javascript
const form = document.querySelector('form');
form.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const formData = new FormData(form);
    
    const response = await fetch('https://portfolio-backend-xxxx.onrender.com/send-message', {
        method: 'POST',
        body: formData
    });
    
    const result = await response.json();
    console.log(result.message);
});
```

## 📝 Variáveis de Ambiente Obrigatórias

### Para desenvolvimento local:
- `PORT` - Porta do servidor (padrão: 3000)
- `ALLOWED_ORIGINS` - Lista de origens permitidas (separadas por vírgula)

### Para deploy no Render:
- `ALLOWED_ORIGINS` - **Obrigatória** - URL do GitHub Pages
- `DESTINATION_EMAIL` - Opcional (para futuro uso com envio de email)

**Importante:** O Render define a variável `PORT` automaticamente. Não configure manualmente.

## 🔮 Próximos Passos

- [ ] Integrar Nodemailer para envio real de emails
- [ ] Adicionar rate limiting para prevenir spam
- [ ] Implementar banco de dados para persistir mensagens
- [ ] Adicionar testes automatizados

## 📄 Licença

Projeto pessoal - uso livre.
