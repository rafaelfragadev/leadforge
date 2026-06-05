import express from "express";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

app.post("/generate", async function(req, res) {
  try {
    const { niche, offer, tone, goal, templateType } = req.body;

    const prompt = `
As headlines devem seguir a norma da língua portuguesa.

Exemplo correto:
"Conquiste os céus e transforme sua carreira"

Exemplo incorreto:
"Conquiste Os Céus E Transforme Sua Carreira"

Adapte a estrutura conforme o tipo de landing page:

Se for curso:
- foque em transformação, aprendizado, autoridade e resultado.

Se for SaaS:
- foque em problema, solução, automação, produtividade e diferenciais do produto.

Se for consultoria:
- foque em autoridade, método, diagnóstico, clareza e confiança.

Se for e-commerce:
- foque em desejo, diferenciais do produto, benefícios práticos, segurança e compra.

A prova social deve parecer realista.
Evite frases genéricas.
Prefira quantidade de alunos, resultados alcançados, experiência acumulada ou reconhecimento do mercado.
Máximo de 2 frases.

Crie também uma quebra de objeção para o público.

Crie também 3 perguntas frequentes com respostas curtas e persuasivas.
As perguntas devem antecipar dúvidas reais do público.

Para os benefícios, use exatamente estes campos:

benefit1Icon, benefit1Title, benefit1Description
benefit2Icon, benefit2Title, benefit2Description
benefit3Icon, benefit3Title, benefit3Description

Os campos benefit1Icon, benefit2Icon e benefit3Icon devem conter apenas uma destas opções:
rocket, shield, chart, target, star, graduation, globe, airplane, users, lightning

Nicho: ${niche}
Oferta: ${offer}
Tom: ${tone}
Objetivo: ${goal}
Tipo de landing page: ${templateType}

Responda SOMENTE em JSON válido. Sem markdown. Sem texto antes ou depois.

Formato:

{
  "headline": "",
  "subheadline": "",

  "benefit1Icon": "",
  "benefit1Title": "",
  "benefit1Description": "",

  "benefit2Icon": "",
  "benefit2Title": "",
  "benefit2Description": "",

  "benefit3Icon": "",
  "benefit3Title": "",
  "benefit3Description": "",

  "socialProof": "",
  "objection": "",

  "faq1Question": "",
  "faq1Answer": "",
  "faq2Question": "",
  "faq2Answer": "",
  "faq3Question": "",
  "faq3Answer": "",

  "cta": ""
}
`;

    const response = await fetch(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${process.env.OPENROUTER_API_KEY}`,
          "Content-Type": "application/json",
          "HTTP-Referer": "http://localhost:3000",
          "X-OpenRouter-Title": "LeadForge AI"
        },
        body: JSON.stringify({
          model: process.env.OPENROUTER_MODEL,
          messages: [
            {
              role: "user",
              content: prompt
            }
          ]
        })
      }
    );

    const data = await response.json();

    if (!response.ok) {
      console.log("ERRO OPENROUTER:", data);

      return res.status(response.status).json({
        error:
          data.error?.message ||
          "Erro ao gerar conteúdo com OpenRouter."
      });
    }

    const text = data.choices[0].message.content;

    const cleanText = text
      .replace(/```json/g, "")
      .replace(/```/g, "")
      .trim();

    let parsed;

    try {
      parsed = JSON.parse(cleanText);
    } catch (jsonError) {
      console.log("JSON INVÁLIDO DA IA:", cleanText);

      return res.status(500).json({
        error: "A IA retornou um JSON inválido."
      });
    }

    res.json(parsed);

  } catch (error) {
    console.log("ERRO SERVER:", error);

    res.status(500).json({
      error: error.message || "Erro interno no servidor."
    });
  }
});

app.listen(3000, function() {
  console.log("Servidor rodando em http://localhost:3000");
});