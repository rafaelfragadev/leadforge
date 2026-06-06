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
REGRA OBRIGATÓRIA SOBRE TEMPLATE:

O templateType manda mais que o nicho.

Se templateType for "saas", NÃO gere texto de curso, aula, formação, certificado, professor, aluno aprendendo ou jornada educacional.

Mesmo que o nicho mencione aviação, piloto, escola ou curso, trate como um SOFTWARE/PLATAFORMA SaaS para esse mercado.

Para SaaS, use palavras como:
plataforma, software, painel, dashboard, automação, integração, CRM, gestão, dados, operação, produtividade, relatórios, equipe, processos.

Exemplo correto:
"Gerencie sua escola de aviação em um painel inteligente"

Exemplo errado:
"Torne-se piloto profissional"
Adapte a estrutura conforme o tipo de landing page:

    Se templateType = "curso":
    gere copy de curso, formação, aulas, módulos e aprendizado.

    Se templateType = "saas":
    gere copy de software, plataforma, automação, dashboard, dados, integração e produtividade.

    Se templateType = "consultoria":
    gere copy de diagnóstico, estratégia, método e execução.

    Se templateType = "ecommerce":
    gere copy de produto, oferta, compra, garantia e avaliações.

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
socialProof1, socialProof2 e socialProof3 devem representar métricas, resultados ou indicadores relevantes para o segmento.

Curso:
- alunos formados
- taxa de aprovação
- certificados emitidos

SaaS:
- empresas atendidas
- leads processados
- automações executadas

Consultoria:
- projetos executados
- empresas atendidas
- resultados alcançados

Ecommerce:
- avaliações positivas
- pedidos entregues
- clientes satisfeitos

objectionTitle e objectionDescription devem representar a principal objeção do cliente e a resposta para ela.
Os títulos quando forem em duas linhas, deixar no mínimo duas palavras em cada linha.

{
  "socialProof1": "+5.000 alunos",
  "socialProof2": "98% aprovação",
  "socialProof3": "12.000 certificados emitidos",

  "objectionTitle": "E se eu não conseguir acompanhar o curso?",
  "objectionDescription": "O conteúdo foi estruturado para iniciantes e você terá acesso às aulas para estudar no seu ritmo."
}
Se templateType for "saas", as FAQs devem ser sobre uso da plataforma, integração, suporte, demonstração, implantação e personalização.
Não gerar FAQs sobre curso, requisitos, aulas ou certificado.

Para templates de curso:

module1Title
module1Description

module2Title
module2Description

module3Title
module3Description

Devem representar módulos reais do curso.

Para templates de consultoria:

step1Title
step1Description

step2Title
step2Description

step3Title
step3Description

Devem representar as etapas do método.

Para templates de ecommerce:

review1Title
review1Description

review2Title
review2Description

review3Title
review3Description

Devem representar avaliações positivas de clientes.

Preencha todos os campos mesmo quando não forem exibidos.

Dependendo do template escolhido, retorne também:

Para SaaS:
problemTitle
problemDescription

solutionTitle
solutionDescription

Para Consultoria:
methodTitle
methodDescription

resultsTitle
resultsDescription

Para E-commerce:
differentialTitle
differentialDescription

reviewTitle
reviewDescription

Nicho: ${niche}
Oferta: ${offer}
Tom: ${tone}
Objetivo: ${goal}
Tipo de landing page: ${templateType}

Os campos de sectionTitle/sectionDescription devem ser preenchidos de acordo com o templateType.

Se templateType = "curso":
preencha courseSectionTitle e courseSectionDescription com foco em aprendizado, módulos, formação e evolução do aluno.

Se templateType = "saas":
preencha saasSectionTitle e saasSectionDescription com foco em plataforma, automação, dashboard, operação, dados e produtividade.

Se templateType = "consultoria":
preencha consultingSectionTitle e consultingSectionDescription com foco em método, diagnóstico, estratégia e execução.

Se templateType = "ecommerce":
preencha ecommerceSectionTitle e ecommerceSectionDescription com foco em produto, oferta, compra, garantia e diferenciais.

Responda SOMENTE em JSON válido. Sem markdown. Sem texto antes ou depois.

{
  "headline": "",
  "subheadline": "",

  "module1Title": "",
  "module1Description": "",

  "module2Title": "",
  "module2Description": "",

  "module3Title": "",
  "module3Description": "",

  "step1Title": "",
  "step1Description": "",

  "step2Title": "",
  "step2Description": "",

  "step3Title": "",
  "step3Description": "",

  "review1Title": "",
  "review1Description": "",

  "review2Title": "",
  "review2Description": "",

  "review3Title": "",
  "review3Description": ""

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

  "problemTitle": "",
  "problemDescription": "",

  "solutionTitle": "",
  "solutionDescription": "",

  "methodTitle": "",
  "methodDescription": "",

  "resultsTitle": "",
  "resultsDescription": "",
  "differentialTitle": "",
  "differentialDescription": "",
  "reviewTitle": "",
  "reviewDescription": "",

  "socialProof1": "",
  "socialProof2": "",
  "socialProof3": "",

  "objectionTitle": "",
  "objectionDescription": ""

  "courseSectionTitle": "",
  "courseSectionDescription": "",

  "saasSectionTitle": "",
  "saasSectionDescription": "",

  "consultingSectionTitle": "",
  "consultingSectionDescription": "",

  "ecommerceSectionTitle": "",
  "ecommerceSectionDescription": "",

"cta": ""
  "cta": ""
  O campo templateType define o tipo de landing page.


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