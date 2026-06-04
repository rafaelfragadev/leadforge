import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { GoogleGenerativeAI } from "@google/generative-ai";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

const genAI = new GoogleGenerativeAI(
  process.env.GEMINI_API_KEY
);

app.post("/generate", async function(req, res) {
  try {
    const { niche, offer, tone, goal } = req.body;

   const model = genAI.getGenerativeModel({
  model: "models/gemini-2.5-flash-lite"
});

const prompt = `
As headlines devem seguir a norma da língua portuguesa.

Exemplo correto:
"Conquiste os céus e transforme sua carreira"

Exemplo incorreto:
"Conquiste Os Céus E Transforme Sua Carreira"

A prova social deve parecer realista.

Evite frases genéricas.

Prefira:
- quantidade de alunos
- resultados alcançados
- experiência acumulada
- reconhecimento do mercado

Máximo de 2 frases.

Crie também uma quebra de objeção para o público.

Exemplos:
- Mesmo que você esteja começando do zero...
- Não é necessário ter experiência prévia...
- O curso foi desenvolvido para iniciantes...

Crie também 3 perguntas frequentes com respostas curtas e persuasivas.
As perguntas devem antecipar dúvidas reais do público.

Nicho: ${niche}
Oferta: ${offer}
Tom: ${tone}
Objetivo: ${goal}

Responda SOMENTE em JSON válido.

Formato:

{
  "headline": "",
  "subheadline": "",
  "benefit1": "",
  "benefit2": "",
  "benefit3": "",
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

const result = await model.generateContent(prompt);

const text = result.response.text();

const cleanText = text
  .replace(/```json/g, "")
  .replace(/```/g, "")
  .trim();

const parsed = JSON.parse(cleanText);
res.json(parsed);

  } catch (error) {
  console.log("ERRO GEMINI:", error);

  const isRateLimit =
    error.message &&
    error.message.includes("429");

  res.status(isRateLimit ? 429 : 500).json({
    error: isRateLimit
      ? "Limite temporário da IA atingido. Aguarde alguns segundos."
      : error.message || "Erro ao gerar conteúdo."
  });
}
});

app.listen(3000, function() {
  console.log("Servidor rodando em http://localhost:3000");
});