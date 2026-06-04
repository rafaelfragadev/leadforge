let lastGenerateTime = 0;
const cooldownTime = 10000;
let cooldownInterval = null;

const form = document.querySelector("#generatorForm");

const themeBtn =
  document.getElementById("themeBtn");

const savedTheme =
  localStorage.getItem("theme");

/* DARK padrão */

if (savedTheme !== "light") {
  document.body.classList.add("dark");
  
}

themeBtn.addEventListener(
  "click",
  function() {

    document.body.classList.toggle("dark");

    if (
      document.body.classList.contains("dark")
    ) {

      localStorage.setItem(
        "theme",
        "dark"
      );
      showToast("🌙 Tema dark ativado!");
    }

    else {

      localStorage.setItem(
        "theme",
        "light"
      );
     showToast("☀️ Tema light ativado!");
    }

  }
);

const resultDiv = document.getElementById("result");
const savedHistory = localStorage.getItem("leadforgeHistory");
let isGenerating = false;
let history = savedHistory

  ? JSON.parse(savedHistory)
  : [];

const savedResult =
  localStorage.getItem(
    "leadforgeResult"
  );

if (savedResult) {
  resultDiv.innerHTML = savedResult;

  setupClearButton();
  setupHistoryClick();

} else {
  resultDiv.innerHTML = `
    <div class="empty-state">
      <p>⚡ Gere sua primeira estrutura com IA.</p>
    </div>
  `;
}

function renderResult(formData, aiResult) {
  return `
    <div class="result-content">

      <span class="badge">
        Estrutura gerada por IA
      </span>

      <h1>
        ${aiResult.headline}
      </h1>

      <h3 class="subheadline">
        ${aiResult.subheadline}
      </h3>

      <ul class="benefits">

        <li class="benefit">
          ✅ ${aiResult.benefit1}
        </li>

        <li class="benefit">
          ✅ ${aiResult.benefit2}
        </li>

        <li class="benefit">
          ✅ ${aiResult.benefit3}
        </li>

      </ul>
      <div class="social-proof">
      <strong>Prova social</strong>
          <p>${aiResult.socialProof}</p>
       </div>

      <div class="objection">
  <strong>Quebra de objeção</strong>
  <p>
    ${
      aiResult.objection ||
      "Mesmo que você esteja começando do zero, esta formação foi desenvolvida para acompanhar sua evolução passo a passo."
    }
  </p>
</div> 
      <div class="faq">
  <strong>FAQ</strong>

  <div class="faq-item">
    <h4>${aiResult.faq1Question}</h4>
    <p>${aiResult.faq1Answer}</p>
  </div>

  <div class="faq-item">
    <h4>${aiResult.faq2Question}</h4>
    <p>${aiResult.faq2Answer}</p>
  </div>

  <div class="faq-item">
    <h4>${aiResult.faq3Question}</h4>
    <p>${aiResult.faq3Answer}</p>
  </div>
</div>

      <button class="cta-preview">
        ${aiResult.cta}
      </button>

      <button id="copyBtn">
        📋 Copiar Estrutura
      </button>

      <button id="downloadBtn">⬇️ Baixar TXT</button>
      <button id="pdfBtn">📄 Baixar PDF</button>
      <button id="htmlBtn">🧩 Baixar HTML</button>
      <button id="cssBtn">🎨 Baixar CSS</button>

      <button id="clearBtn">
        🗑 Limpar Resultado
      </button>
     
    </div>
  `;
}

form.addEventListener("submit", async function(event) {
  event.preventDefault();
const now = Date.now();

if (now - lastGenerateTime < cooldownTime) {
  showToast("⏳ Aguarde 1 minuto antes de gerar novamente.");
  return;
}

  lastGenerateTime = now;
const submitBtn =
  form.querySelector("button[type='submit']");

let timeLeft = 10;

submitBtn.disabled = true;
submitBtn.textContent =
  `⏳ Aguarde ${timeLeft}s`;

cooldownInterval = setInterval(function() {

  timeLeft--;

      submitBtn.textContent =
        `⏳ Aguarde ${timeLeft}s`;

      if (timeLeft <= 0) {

        clearInterval(
          cooldownInterval
        );

        submitBtn.disabled = false;

        submitBtn.textContent =
          "⚡ Gerar Estrutura";

      }

    }, 1000);

  if (isGenerating) {
    showToast("⏳ Aguarde a geração terminar.");
    return;
  }
  

  isGenerating = true;

  const niche = document.getElementById("niche");
  const offer = document.getElementById("offer");
  const tone = document.getElementById("tone");
  const goal = document.getElementById("goal");

  const formData = {
    niche: niche.value,
    offer: offer.value,
    tone: tone.value,
    goal: goal.value
  };

  let aiResult = null;

  try {
    aiResult = await fetchAIContent(formData);
  } finally {
    isGenerating = false;
  }
console.log("AI RESULT:", aiResult);
console.log("TIPO:", typeof aiResult);

  history.push({
  offer: formData.offer,
  niche: formData.niche,
  result: aiResult
});

  localStorage.setItem(
    "leadforgeResult",
    JSON.stringify(history)
  );

// daqui pra baixo segue generatedText, loading, setTimeout...

const generatedText = `
${aiResult.headline}

${aiResult.subheadline}

✅ ${aiResult.benefit1}
✅ ${aiResult.benefit2}
✅ ${aiResult.benefit3}

Prova social:
${aiResult.socialProof}

Objeção:
${aiResult.objection}

FAQ:

${aiResult.faq1Question}
${aiResult.faq1Answer}

${aiResult.faq2Question}
${aiResult.faq2Answer}

${aiResult.faq3Question}
${aiResult.faq3Answer}

CTA:
${aiResult.cta}
`;

resultDiv.innerHTML = `
  <h4 class="result-label">Estrutura Gerada</h4>
  <div class="loading-state">
    <p>🤖 Analisando nicho...</p>
    <p>✍️ Criando headline...</p>
    <p>🚀 Gerando estrutura...</p>
  </div>
`;

localStorage.setItem(
  "leadforgeResult",
  resultDiv.innerHTML
);

setTimeout(function() {

resultDiv.innerHTML = `
  ${renderResult(formData, aiResult)}
  ${renderHistory()}
`;

  localStorage.setItem(
    "leadforgeResult",
    resultDiv.innerHTML
  );

showToast("⚡ Estrutura gerada!");

const copyBtn = document.getElementById("copyBtn");

copyBtn.addEventListener("click", function() {
  navigator.clipboard.writeText(generatedText);

  copyBtn.textContent = "✅ Copiado!";
  showToast("✅ Estrutura copiada!");
  setTimeout(function() {
    copyBtn.textContent = "📋 Copiar Estrutura";
  }, 2000);
});

  const previewBtn = document.getElementById("previewBtn");

  previewBtn.addEventListener("click", function() {
    const htmlContent = generateHTML(aiResult);

    const previewWindow = window.open("", "_blank");

    previewWindow.document.open();
    previewWindow.document.write(htmlContent);
    previewWindow.document.close();

    showToast("👁️ Preview aberto!");
  });

const downloadBtn = document.getElementById("downloadBtn");
const pdfBtn = document.getElementById("pdfBtn");

downloadBtn.addEventListener("click", function() {
  const blob = new Blob(
    [generatedText],
    { type: "text/plain" }
  );

  const url = URL.createObjectURL(blob);

  const link = document.createElement("a");

  link.href = url;
  link.download = "leadforge-estrutura.txt";

  link.click();

  URL.revokeObjectURL(url);

  showToast("⬇️ Arquivo TXT baixado!");
  const pdfBtn = document.getElementById("pdfBtn");
});

pdfBtn.addEventListener("click", function() {
  const { jsPDF } = window.jspdf;

  const doc = new jsPDF();

  doc.setFontSize(18);
  doc.text("LeadForge AI", 20, 20);

  doc.setFontSize(14);
  doc.text(aiResult.headline, 20, 40);

  doc.setFontSize(11);
  doc.text(aiResult.subheadline, 20, 55);

  doc.text("Benefícios:", 20, 75);
  doc.text(`- ${aiResult.benefit1}`, 20, 88);
  doc.text(`- ${aiResult.benefit2}`, 20, 100);
  doc.text(`- ${aiResult.benefit3}`, 20, 112);

  doc.text("Prova social:", 20, 132);
  doc.text(aiResult.socialProof, 20, 145);

  doc.text("Quebra de objeção:", 20, 165);
  doc.text(aiResult.objection, 20, 178);

  doc.text("CTA:", 20, 198);
  doc.text(aiResult.cta, 20, 211);

  doc.addPage();

  doc.setFontSize(16);
  doc.text("FAQ", 20, 20);

  doc.setFontSize(11);

  doc.text(aiResult.faq1Question, 20, 40);
  doc.text(aiResult.faq1Answer, 20, 52);

  doc.text(aiResult.faq2Question, 20, 75);
  doc.text(aiResult.faq2Answer, 20, 87);

  doc.text(aiResult.faq3Question, 20, 110);
  doc.text(aiResult.faq3Answer, 20, 122);

  doc.save("leadforge-estrutura.pdf");

  showToast("📄 PDF baixado!");
});

const htmlBtn = document.getElementById("htmlBtn");

htmlBtn.addEventListener("click", function() {
  const htmlContent = generateHTML(aiResult);

  const blob = new Blob(
    [htmlContent],
    { type: "text/html" }
  );

  const url = URL.createObjectURL(blob);

  const link = document.createElement("a");

  link.href = url;
  link.download = "leadforge-landing-page.html";

  link.click();

  URL.revokeObjectURL(url);

  showToast("🧩 HTML baixado!");
});
const cssBtn =
  document.getElementById("cssBtn");


cssBtn.addEventListener("click", function() {

  const cssContent =
    generateCSS();

  const blob = new Blob(
    [cssContent],
    {
      type:"text/css"
    }
  );

  const url =
    URL.createObjectURL(blob);

  const link =
    document.createElement("a");

  link.href = url;

  link.download =
    "leadforge-style.css";

  link.click();

  URL.revokeObjectURL(url);

  showToast(
    "🎨 CSS baixado!"
  );

});

setupClearButton();
setupHistoryClick();

}, 1000);

});

function generateCSS() {
  return `
*{
  margin:0;
  padding:0;
  box-sizing:border-box;
}

body{
  font-family:Inter,sans-serif;
  background:#050816;
  color:#FFFFFF;
  line-height:1.6;
}

section{
  padding:100px 24px;
}

.container{
  max-width:1280px;
  margin:0 auto;

  display:grid;
  grid-template-columns:repeat(12,1fr);
  gap:20px;
}

.section-header{
  grid-column:1 / span 12;
  margin-bottom:40px;
}

.section-header h2{
  font-size:40px;
  line-height:1;
  letter-spacing:-.03em;
}

/* HERO */

.hero{
  min-height:100vh;

  background:
    radial-gradient(
      circle at top,
      rgba(37,99,235,.28),
      transparent 40%
    ),
    linear-gradient(
      180deg,
      #050816 0%,
      #0B1020 100%
    );
}

.hero-content{
  grid-column:3 / span 8;

  text-align:center;

  display:flex;
  flex-direction:column;
  align-items:center;
  justify-content:center;
}

.hero-content span{
  display:inline-flex;

  padding:8px 14px;

  border-radius:999px;

  background:rgba(255,255,255,.06);

  border:1px solid rgba(255,255,255,.10);

  color:#93C5FD;

  margin-bottom:24px;
}

.hero-content h1{
  font-size:clamp(42px,6vw,76px);

  line-height:1;

  letter-spacing:-.04em;

  margin-bottom:24px;
}

.hero-content p{
  font-size:20px;

  color:#CBD5E1;

  max-width:700px;
}

.hero-content a{
  margin-top:36px;

  display:inline-flex;

  align-items:center;
  justify-content:center;

  padding:16px 28px;

  border-radius:14px;

  text-decoration:none;

  color:#FFFFFF;

  font-weight:700;

  background:
    linear-gradient(
      135deg,
      #2563EB,
      #7C3AED
    );

  box-shadow:
    0 20px 50px rgba(37,99,235,.35);
}

/* BENEFÍCIOS */

.benefits-grid{
  grid-column:1 / span 12;

  display:grid;
  grid-template-columns:repeat(3,1fr);
  gap:20px;
}

.benefit-card{
  padding:32px;

  border-radius:24px;

  background:
    rgba(255,255,255,.05);

  border:
    1px solid rgba(255,255,255,.10);

  transition:.3s;
}

.benefit-card:hover{
  transform:translateY(-4px);

  border-color:
    rgba(37,99,235,.45);
}

.benefit-card p{
  color:#CBD5E1;
}

/* SOCIAL + OBJECTION */

.content-card{
  grid-column:1 / span 12;

  padding:32px;

  border-radius:24px;

  background:
    rgba(255,255,255,.05);

  border:
    1px solid rgba(255,255,255,.10);
}

.content-card p{
  color:#CBD5E1;
}

/* FAQ */

.faq-list{
  grid-column:1 / span 12;
}

details{
  margin-bottom:16px;

  border-radius:18px;

  overflow:hidden;

  background:
    rgba(255,255,255,.05);

  border:
    1px solid rgba(255,255,255,.10);
}

summary{
  cursor:pointer;

  padding:22px;

  font-weight:700;

  list-style:none;
}

details p{
  padding:0 22px 22px;

  color:#CBD5E1;
}

/* MOBILE */

@media(max-width:1024px){

  .hero-content{
    grid-column:1 / span 12;
  }

  .benefits-grid{
    grid-template-columns:1fr;
  }

}

@media(max-width:768px){

  section{
    padding:72px 20px;
  }

  .hero{
    min-height:auto;
  }

  .hero-content h1{
    font-size:42px;
  }

  .hero-content p{
    font-size:18px;
  }

}
`;
}


function generateHTML(aiResult) {
  return `
<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${aiResult.headline}</title>

  <style>
    ${generateCSS()}
  </style>
</head>

<body>

  <section class="hero">
    <div class="container">
      <div class="hero-content">
        <span>Gerado com LeadForge AI</span>

        <h1>${aiResult.headline}</h1>

        <p>${aiResult.subheadline}</p>

        <a href="#">
          ${aiResult.cta}
        </a>
      </div>
    </div>
  </section>

  <section class="benefits">
    <div class="container">
      <div class="section-header">
        <h2>Benefícios</h2>
      </div>

      <div class="benefits-grid">
        <div class="benefit-card">
          <p>${aiResult.benefit1}</p>
        </div>

        <div class="benefit-card">
          <p>${aiResult.benefit2}</p>
        </div>

        <div class="benefit-card">
          <p>${aiResult.benefit3}</p>
        </div>
      </div>
    </div>
  </section>

  <section class="social-proof">
    <div class="container">
      <div class="section-header">
        <h2>Prova social</h2>
      </div>

      <div class="content-card">
        <p>${aiResult.socialProof}</p>
      </div>
    </div>
  </section>

  <section class="objection">
    <div class="container">
      <div class="section-header">
        <h2>Quebra de objeção</h2>
      </div>

      <div class="content-card">
        <p>${aiResult.objection}</p>
      </div>
    </div>
  </section>

  <section class="faq">
    <div class="container">
      <div class="section-header">
        <h2>Perguntas frequentes</h2>
      </div>

      <div class="faq-list">
        <details>
          <summary>${aiResult.faq1Question}</summary>
          <p>${aiResult.faq1Answer}</p>
        </details>

        <details>
          <summary>${aiResult.faq2Question}</summary>
          <p>${aiResult.faq2Answer}</p>
        </details>

        <details>
          <summary>${aiResult.faq3Question}</summary>
          <p>${aiResult.faq3Answer}</p>
        </details>
      </div>
    </div>
  </section>

</body>
</html>
`;
}

function renderHistory() {
  if (history.length === 0) {
    return "";
  }

  const historyItems = history.map(function(item, index) {
    return `
      <li data-index="${index}">
        ${item.offer} para ${item.niche}
      </li>
    `;
  });

  return `
    <div class="history">
      <h4>Últimas gerações</h4>
      <ul id="historyList">
        ${historyItems.join("")}
      </ul>
    </div>
  `;
}


function setupClearButton() {
  const clearBtn = document.getElementById("clearBtn");

  if (!clearBtn) return;

  clearBtn.addEventListener("click", function() {

    localStorage.removeItem("leadforgeResult");
    localStorage.removeItem("leadforgeHistory");

    history = [];

    resultDiv.innerHTML = `
      <div class="empty-state">
        <p>⚡ Gere sua primeira estrutura com IA.</p>
      </div>
    `;

    showToast("🗑 Histórico limpo!");

  });
}

function setupHistoryClick() {
  const historyList = document.getElementById("historyList");

  if (!historyList) return;

  historyList.addEventListener("click", function(event) {
    const clickedItem = event.target;

    const index = clickedItem.dataset.index;

    if (index === undefined) return;

    const historyItem = history[index];

    resultDiv.innerHTML = `
      ${renderResult(
        {
          offer: historyItem.offer,
          niche: historyItem.niche
        },
        historyItem.result
      )}

      ${renderHistory()}
    `;

    setupClearButton();
    setupHistoryClick();

    showToast("📂 Geração restaurada!");
  });
}


function showToast(message) {

  const toast =
    document.createElement("div");

  toast.classList.add(
    "toast"
    
  );

  toast.textContent =
    message;

  document.body.appendChild(
    toast
  );
  
  setTimeout(function() {

    toast.remove();

  }, 3000);

}

async function fetchAIContent(formData) {
  const response = await fetch("http://localhost:3000/generate", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(formData)
  });

  const data = await response.json();

  console.log("Resposta da API:", data);

 if (!response.ok) {
  showToast("⏳ Limite da IA atingido. Tente novamente em alguns segundos.");

   return {
      headline: "Não foi possível gerar agora.",
      subheadline: "A IA está temporariamente ocupada. Tente novamente em alguns segundos.",

      benefit1: "Aguarde alguns instantes.",
      benefit2: "Evite muitas tentativas seguidas.",
      benefit3: "O sistema voltará a responder em breve.",

      socialProof: "O sistema está temporariamente indisponível devido ao limite da API.",

      objection: "Mesmo que a IA esteja ocupada agora, você poderá gerar sua estrutura em instantes.",

      faq1Question: "Quando posso tentar novamente?",
      faq1Answer: "Você pode tentar novamente em alguns segundos, quando o limite da IA for liberado.",

      faq2Question: "Meus dados foram perdidos?",
      faq2Answer: "Não. Você pode gerar uma nova estrutura assim que a IA estiver disponível.",

      faq3Question: "O que causou esse erro?",
      faq3Answer: "O limite temporário da API foi atingido por muitas chamadas em pouco tempo.",

      cta: "Tentar novamente"
    };
  }
  return data;
}