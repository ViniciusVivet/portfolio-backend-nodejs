# 🚀 Guia Rápido de Deploy no Render

## Passo a Passo

### 1. Preparar o Repositório

```bash
# Inicialize o git (se ainda não foi feito)
git init

# Adicione todos os arquivos
git add .

# Faça o commit inicial
git commit -m "Initial commit: Portfolio backend API"

# Conecte ao repositório remoto do GitHub
git remote add origin https://github.com/seu-usuario/portfolio-backend-nodejs.git

# Faça o push
git push -u origin main
```

### 2. Deploy no Render

1. **Acesse:** https://render.com
2. **Faça login** com sua conta GitHub
3. **Clique em:** "New +" → "Web Service"
4. **Conecte seu repositório:** `portfolio-backend-nodejs`
5. **Configure:**
   - **Name:** `portfolio-backend`
   - **Environment:** `Node`
   - **Build Command:** deixe em branco
   - **Start Command:** `npm start`
   - **Instance Type:** Free

### 3. Variáveis de Ambiente

No painel do Render, vá em **Environment** e adicione:

```
ALLOWED_ORIGINS=https://viniciusvivet.github.io
```

**Importante:** NÃO configure a variável `PORT` - o Render define automaticamente.

### 4. Deploy

Clique em **Create Web Service**. O Render fará o deploy automaticamente.

Após alguns minutos, você receberá uma URL:
```
https://portfolio-backend-xxxx.onrender.com
```

### 5. Testar a API

Acesse no navegador:
```
https://portfolio-backend-xxxx.onrender.com
```

Você verá a documentação da API em JSON.

### 6. URL do Endpoint

Use esta URL no seu formulário HTML:
```
https://portfolio-backend-xxxx.onrender.com/send-message
```

## Exemplo de Formulário HTML

```html
<form action="https://portfolio-backend-xxxx.onrender.com/send-message" method="POST">
    <input type="text" name="name" placeholder="Nome" required>
    <input type="email" name="email" placeholder="Email" required>
    <input type="text" name="subject" placeholder="Assunto">
    <textarea name="message" placeholder="Mensagem"></textarea>
    <button type="submit">Enviar</button>
</form>
```

## Exemplo com JavaScript (Fetch)

```javascript
const form = document.querySelector('form');

form.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const formData = new FormData(form);
    
    try {
        const response = await fetch('https://portfolio-backend-xxxx.onrender.com/send-message', {
            method: 'POST',
            body: formData
        });
        
        const result = await response.json();
        
        if (result.success) {
            alert(result.message);
            form.reset();
        } else {
            alert('Erro: ' + result.message);
        }
    } catch (error) {
        alert('Erro ao enviar mensagem: ' + error.message);
    }
});
```

## Observações Importantes

### ⚠️ Plano Free do Render

O plano gratuito do Render tem algumas limitações:
- O servidor "dorme" após 15 minutos de inatividade
- A primeira requisição após o "sono" pode levar até 30 segundos
- Após ativado, funciona normalmente

### 💡 Solução para o "Sono"

Você pode usar serviços como **UptimeRobot** ou **Cron-Job.org** para fazer ping na API a cada 14 minutos:

**URL para ping:** `https://portfolio-backend-xxxx.onrender.com`

### 🔄 Atualizações Automáticas

O Render faz deploy automático toda vez que você faz push para o branch `main` no GitHub.

## Troubleshooting

### API não responde
- Verifique se o deploy foi concluído com sucesso no painel do Render
- Verifique os logs no painel "Logs" do Render

### CORS Error
- Verifique se a variável `ALLOWED_ORIGINS` está configurada corretamente
- A URL deve ser exatamente igual (com https:// e sem barra no final)

### 404 Not Found
- Verifique se a URL do endpoint está correta: `/send-message`
- Verifique se o método é POST
