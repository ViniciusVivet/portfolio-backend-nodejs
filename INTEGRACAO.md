# 📝 Guia de Integração com o Portfólio HTML

## ⚙️ Configuração do Formulário

### Opção 1: Action direto no HTML (sem JavaScript)

```html
<form action="https://SEU-APP.onrender.com/send-message" method="POST">
    <input type="text" name="name" placeholder="Nome" required>
    <input type="email" name="email" placeholder="Email" required>
    <input type="text" name="subject" placeholder="Assunto">
    <textarea name="message" placeholder="Sua mensagem"></textarea>
    <button type="submit">Enviar</button>
</form>
```

**Nota:** Substitua `SEU-APP.onrender.com` pela URL que o Render fornecer após o deploy.

---

### Opção 2: Usando JavaScript (Fetch API) - RECOMENDADO

Esta opção permite feedback visual sem sair da página.

```html
<!-- HTML do Formulário -->
<form id="contactForm">
    <input type="text" name="name" id="name" placeholder="Nome" required>
    <input type="email" name="email" id="email" placeholder="Email" required>
    <input type="text" name="subject" id="subject" placeholder="Assunto">
    <textarea name="message" id="message" placeholder="Sua mensagem"></textarea>
    <button type="submit" id="submitBtn">Enviar</button>
    <div id="formResponse" style="display: none;"></div>
</form>

<script>
const form = document.getElementById('contactForm');
const responseDiv = document.getElementById('formResponse');
const submitBtn = document.getElementById('submitBtn');

form.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    // Desabilita botão durante envio
    submitBtn.disabled = true;
    submitBtn.textContent = 'Enviando...';
    responseDiv.style.display = 'none';
    
    try {
        const formData = new FormData(form);
        
        const response = await fetch('https://SEU-APP.onrender.com/send-message', {
            method: 'POST',
            body: formData
        });
        
        const result = await response.json();
        
        // Mostra resposta
        responseDiv.style.display = 'block';
        
        if (response.ok && result.success) {
            responseDiv.className = 'success-message';
            responseDiv.textContent = result.message;
            form.reset(); // Limpa o formulário
        } else {
            responseDiv.className = 'error-message';
            responseDiv.textContent = result.message || 'Erro ao enviar mensagem.';
        }
    } catch (error) {
        responseDiv.style.display = 'block';
        responseDiv.className = 'error-message';
        responseDiv.textContent = 'Erro de conexão. Tente novamente mais tarde.';
        console.error('Erro:', error);
    } finally {
        // Reabilita botão
        submitBtn.disabled = false;
        submitBtn.textContent = 'Enviar';
    }
});
</script>

<!-- CSS para as mensagens -->
<style>
.success-message {
    padding: 15px;
    margin-top: 15px;
    background-color: #d4edda;
    color: #155724;
    border: 1px solid #c3e6cb;
    border-radius: 5px;
}

.error-message {
    padding: 15px;
    margin-top: 15px;
    background-color: #f8d7da;
    color: #721c24;
    border: 1px solid #f5c6cb;
    border-radius: 5px;
}
</style>
```

---

## 📋 Campos Aceitos pela API

A API aceita os seguintes campos (em inglês ou português):

| Campo HTML | Alternativa PT | Obrigatório | Descrição |
|------------|----------------|-------------|-----------|
| `name` | `nome` | ✅ Sim | Nome do remetente |
| `email` | - | ✅ Sim | Email do remetente |
| `subject` | `assunto` | ❌ Não | Assunto da mensagem |
| `message` | `mensagem` | ❌ Não | Conteúdo da mensagem |

### Exemplo com campos em português:

```html
<form action="https://SEU-APP.onrender.com/send-message" method="POST">
    <input type="text" name="nome" placeholder="Nome" required>
    <input type="email" name="email" placeholder="Email" required>
    <input type="text" name="assunto" placeholder="Assunto">
    <textarea name="mensagem" placeholder="Sua mensagem"></textarea>
    <button type="submit">Enviar</button>
</form>
```

---

## 🔄 Campos Ignorados

A API ignora campos extras como:
- `_subject`
- `_template`
- `_next`
- `_captcha`
- `_autoresponse`

Você pode removê-los ou mantê-los - não afetarão o funcionamento.

---

## 🎨 Exemplo Completo e Estilizado

```html
<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Contato</title>
    <style>
        .contact-section {
            max-width: 600px;
            margin: 0 auto;
            padding: 40px 20px;
        }
        
        .contact-form {
            display: flex;
            flex-direction: column;
            gap: 20px;
        }
        
        .form-group {
            display: flex;
            flex-direction: column;
        }
        
        .form-group label {
            margin-bottom: 8px;
            font-weight: 600;
            color: #333;
        }
        
        .form-group input,
        .form-group textarea {
            padding: 12px;
            border: 2px solid #e0e0e0;
            border-radius: 5px;
            font-size: 16px;
            transition: border-color 0.3s;
        }
        
        .form-group input:focus,
        .form-group textarea:focus {
            outline: none;
            border-color: #667eea;
        }
        
        .form-group textarea {
            min-height: 150px;
            resize: vertical;
        }
        
        .submit-btn {
            padding: 15px 30px;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            border: none;
            border-radius: 5px;
            font-size: 16px;
            font-weight: 600;
            cursor: pointer;
            transition: transform 0.2s;
        }
        
        .submit-btn:hover {
            transform: translateY(-2px);
        }
        
        .submit-btn:disabled {
            background: #ccc;
            cursor: not-allowed;
            transform: none;
        }
        
        .form-response {
            padding: 15px;
            border-radius: 5px;
            margin-top: 20px;
            display: none;
        }
        
        .form-response.success {
            background: #d4edda;
            color: #155724;
            border: 1px solid #c3e6cb;
        }
        
        .form-response.error {
            background: #f8d7da;
            color: #721c24;
            border: 1px solid #f5c6cb;
        }
    </style>
</head>
<body>
    <section class="contact-section">
        <h2>Entre em Contato</h2>
        
        <form id="contactForm" class="contact-form">
            <div class="form-group">
                <label for="name">Nome *</label>
                <input type="text" id="name" name="name" required>
            </div>
            
            <div class="form-group">
                <label for="email">Email *</label>
                <input type="email" id="email" name="email" required>
            </div>
            
            <div class="form-group">
                <label for="subject">Assunto</label>
                <input type="text" id="subject" name="subject">
            </div>
            
            <div class="form-group">
                <label for="message">Mensagem</label>
                <textarea id="message" name="message"></textarea>
            </div>
            
            <button type="submit" class="submit-btn" id="submitBtn">
                Enviar Mensagem
            </button>
            
            <div id="formResponse" class="form-response"></div>
        </form>
    </section>
    
    <script>
        const API_URL = 'https://SEU-APP.onrender.com/send-message';
        
        const form = document.getElementById('contactForm');
        const responseDiv = document.getElementById('formResponse');
        const submitBtn = document.getElementById('submitBtn');
        
        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            submitBtn.disabled = true;
            submitBtn.textContent = 'Enviando...';
            responseDiv.style.display = 'none';
            
            try {
                const formData = new FormData(form);
                
                const response = await fetch(API_URL, {
                    method: 'POST',
                    body: formData
                });
                
                const result = await response.json();
                
                responseDiv.style.display = 'block';
                
                if (response.ok && result.success) {
                    responseDiv.className = 'form-response success';
                    responseDiv.textContent = '✅ ' + result.message;
                    form.reset();
                } else {
                    responseDiv.className = 'form-response error';
                    responseDiv.textContent = '❌ ' + (result.message || 'Erro ao enviar mensagem.');
                }
            } catch (error) {
                responseDiv.style.display = 'block';
                responseDiv.className = 'form-response error';
                responseDiv.textContent = '❌ Erro de conexão. Tente novamente mais tarde.';
                console.error('Erro:', error);
            } finally {
                submitBtn.disabled = false;
                submitBtn.textContent = 'Enviar Mensagem';
            }
        });
    </script>
</body>
</html>
```

---

## ✅ Checklist de Integração

- [ ] Fazer deploy da API no Render
- [ ] Copiar a URL fornecida pelo Render
- [ ] Substituir `SEU-APP.onrender.com` no código do formulário
- [ ] Testar o formulário localmente (abrindo o HTML no navegador)
- [ ] Fazer commit e push do portfólio atualizado para o GitHub
- [ ] Testar no GitHub Pages: https://viniciusvivet.github.io/portfolio-pessoal-dev/

---

## 🐛 Troubleshooting

### Erro de CORS
Se aparecer erro de CORS no console do navegador:
- Verifique se a variável `ALLOWED_ORIGINS` está configurada no Render
- Deve conter: `https://viniciusvivet.github.io`

### Requisição demora muito
No plano gratuito do Render, o servidor "dorme" após 15 minutos de inatividade:
- A primeira requisição pode levar até 30 segundos
- Considere adicionar um loading spinner durante o envio

### Formulário não funciona localmente
Se testar abrindo o arquivo HTML diretamente (`file://`):
- Pode haver problemas com CORS
- Solução: use um servidor local simples (Live Server no VS Code)
