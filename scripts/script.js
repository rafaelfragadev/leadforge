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

      <div class="benefit-card">
  <div class="benefit-icon">
    ${getIcon(aiResult.benefit1Icon || "star")}
  </div>

  <h3>${aiResult.benefit1Title}</h3>
  <p>${aiResult.benefit1Description}</p>
</div>

      <div class="benefit-card">
        <div class="benefit-icon">
          ${getIcon(aiResult.benefit2Icon || "target")}
        </div>

        <h3>${aiResult.benefit2Title}</h3>
        <p>${aiResult.benefit2Description}</p>
      </div>

      <div class="benefit-card">
        <div class="benefit-icon">
          ${getIcon(aiResult.benefit3Icon || "rocket")}
        </div>

        <h3>${aiResult.benefit3Title}</h3>
        <p>${aiResult.benefit3Description}</p>
      </div>
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
      <button id="zipBtn">📦 Baixar Projeto ZIP</button>

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
  const templateType = document.getElementById("templateType");

  const formData = {
    niche: niche.value,
    offer: offer.value,
    tone: tone.value,
    goal: goal.value,
    templateType: templateType.value
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
const zipBtn = document.getElementById("zipBtn");

zipBtn.addEventListener("click", async function() {
  const zip = new JSZip();

  zip.file(
    "index.html",
    generateHTMLWithExternalCSS(aiResult)
  );

  zip.file(
    "style.css",
    generateCSS()
  );

  const content = await zip.generateAsync({
    type: "blob"
  });

  const url = URL.createObjectURL(content);

  const link = document.createElement("a");

  link.href = url;
  link.download = "leadforge-landing.zip";

  link.click();

  URL.revokeObjectURL(url);

  showToast("📦 Projeto ZIP baixado!");
});

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

  display:flex;
  align-items:center;

  background:
    radial-gradient(
      circle at top right,
      rgba(37,99,235,.20),
      transparent 35%
    ),
    radial-gradient(
      circle at top left,
      rgba(124,58,237,.18),
      transparent 35%
    ),
    #050816;
}

.hero-content{
  grid-column:1 / span 6;

  display:flex;
  flex-direction:column;
  justify-content:center;
}

.hero-visual{
  grid-column:8 / span 5;

  display:flex;
  justify-content:center;
  align-items:center;
  pointer-events:none;
}

.hero-badge{

  display:inline-flex;

  align-items:center;

  gap:8px;

  width:max-content;

  padding:10px 16px;

  margin-bottom:28px;

  border-radius:999px;

  background:
    rgba(255,255,255,.05);

  border:
    1px solid rgba(255,255,255,.10);

  color:#93C5FD;

  backdrop-filter:blur(12px);
}

.hero-content h1{

  max-width:700px;

  font-size:clamp(
    42px,
    5vw,
    72px
  );

  line-height:.95;

  letter-spacing:-.05em;

  margin-bottom:24px;
}
.hero-content p{
  font-size:20px;

  color:#CBD5E1;

  max-width:600px;
}

.hero-content a{
  max-width:570px;
  text-align:center;
  display:inline-block;

  margin-top:36px;

  padding:16px 28px;

  border-radius:14px;

  text-decoration:none;

  color:#FFFFFF;

  font-weight:600;

  background:linear-gradient(
    135deg,
    #2563EB,
    #7C3AED
  );

  box-shadow:
    0 20px 50px rgba(37,99,235,.35);

  transition:
    transform .3s ease,
    box-shadow .3s ease,
    opacity .3s ease;
}

.hero-content a:hover{

  transform:
    translateY(-4px)
    scale(1.02);

  box-shadow:
    0 35px 80px rgba(37,99,235,.55);

}

.mockup-card{

  transform:rotate(-4deg);

  box-shadow:
    0 40px 120px rgba(37,99,235,.18);

  transition:.4s ease;
}

.mockup-card:hover{

  transform:
    rotate(-2deg)
    translateY(-8px);
}

.mockup-header{
  height:180px;

  border-radius:18px;

  margin-bottom:20px;

  background:
    linear-gradient(
      135deg,
      #2563EB,
      #7C3AED
    );
}

.mockup-line{
  height:14px;

  border-radius:999px;

  margin-bottom:14px;

  background:
    rgba(255,255,255,.08);
}

.mockup-line.short{
  width:60%;
}

.mockup-stats{
  display:grid;

  grid-template-columns:
    repeat(3,1fr);

  gap:14px;

  margin-top:24px;
}

.mockup-stats div{
  height:90px;

  border-radius:16px;

  background:
    rgba(255,255,255,.06);
}
    @media(max-width:1024px){

  .hero-content{
    grid-column:1 / span 12;
    text-align:center;
    align-items:center;
  }

  .hero-content a{

  transition:
    transform .3s ease,
    box-shadow .3s ease;

  box-shadow:
    0 20px 50px rgba(37,99,235,.35);

}

  .hero-visual{
    grid-column:1 / span 12;
    margin-top:50px;
  }

}

/* BENEFÍCIOS */

.benefits-grid{
  grid-column:1 / span 12;

  display:grid;
  grid-template-columns:repeat(3,1fr);
  gap:20px;
}

.benefit-card{
  margin-bottom:12px;
  font-size:22px;
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

.benefit-icon{
  width:56px;
  height:56px;

  display:flex;
  align-items:center;
  justify-content:center;

  margin-bottom:20px;

  border-radius:14px;

  background:
    linear-gradient(
      135deg,
      #2563EB,
      #7C3AED
    );

  font-size:24px;
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
    font-size: clamp(42px, 5vw, 72px);
    max-width: 700px;
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

      <span class="hero-badge">
        Gerado com LeadForge AI
      </span>

      <h1>${aiResult.headline}</h1>

      <p>
        ${aiResult.subheadline}
      </p>

      <a href="#">
        ${aiResult.cta}
      </a>

    </div>

    <div class="hero-visual">

      <div class="mockup-card">

        <div class="mockup-header"></div>

        <div class="mockup-line"></div>
        <div class="mockup-line short"></div>

        <div class="mockup-stats">

          <div></div>
          <div></div>
          <div></div>

        </div>

      </div>

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
      <div class="benefit-icon">
        ${getIcon(aiResult.benefit1Icon || "star")}
      </div>
      <h3>${aiResult.benefit1Title}</h3>
      <p>${aiResult.benefit1Description}</p></div>

<div class="benefit-card">

<div class="benefit-icon">
${getIcon(aiResult.benefit2Icon || "target")}
  </div>

  <h3>
    ${aiResult.benefit2Title}
  </h3>

  <p>
    ${aiResult.benefit2Description}
  </p>

</div>

<div class="benefit-card">

  <div class="benefit-icon">
    ${getIcon(aiResult.benefit3Icon || "rocket")}
  </div>

      <h3>
        ${aiResult.benefit3Title}
      </h3>

      <p>
        ${aiResult.benefit3Description}
      </p>

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

function generateHTMLWithExternalCSS(aiResult) {
  return `
<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${aiResult.headline}</title>
  <link rel="stylesheet" href="style.css">
</head>
<body>

  ${generateHTML(aiResult)
    .split("<body>")[1]
    .split("</body>")[0]}

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

  benefit1Icon: "star",
  benefit1Title: "Aguarde alguns instantes",
  benefit1Description: "O limite temporário da IA foi atingido.",

  benefit2Icon: "target",
  benefit2Title: "Evite muitas tentativas",
  benefit2Description: "Muitas chamadas em sequência podem gerar bloqueio temporário.",

  benefit3Icon: "rocket",
  benefit3Title: "Tente novamente em breve",
  benefit3Description: "O sistema voltará a responder normalmente em alguns segundos.",

  socialProof: "O sistema está temporariamente indisponível devido ao limite da API.",

  objection: "Mesmo que a IA esteja ocupada agora, você poderá gerar sua estrutura em instantes.",

  faq1Question: "Quando posso tentar novamente?",
  faq1Answer: "Você pode tentar novamente em alguns segundos.",

  faq2Question: "Meus dados foram perdidos?",
  faq2Answer: "Não. Basta gerar novamente quando a IA estiver disponível.",

  faq3Question: "O que aconteceu?",
  faq3Answer: "O limite temporário da API foi atingido.",

  cta: "Tentar novamente"
    };
  }
  return data;
}

function getIcon(iconName){

  const icons = {

    rocket: "🚀",
    shield: "🛡️",
    chart: "📈",
    target: "🎯",
    star: "⭐",
    graduation: "🎓",
    globe: "🌎",
    airplane: "✈️",
    users: "👥",
    lightning: "⚡"

  };

  return icons[iconName] || "✨";
}