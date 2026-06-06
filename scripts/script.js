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
      <button id="previewBtn">👁️ Ver Preview</button>

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
  const templateType = document.getElementById("templateType").value;

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

  window.aiResult = aiResult;
console.log("AI RESULT GLOBAL:", window.aiResult);
} finally {
  isGenerating = false;
}


localStorage.setItem(
  "leadforge_last_aiResult",
  JSON.stringify(aiResult)
);

localStorage.setItem(
  "leadforge_last_templateType",
  templateType
);

//console.log("AI RESULT:", aiResult);
//console.log("TIPO:", typeof aiResult);

  history.push({
   offer: formData.offer,
  niche: formData.niche,
  templateType: formData.templateType,
  result: aiResult
});

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

setTimeout(function() {

resultDiv.innerHTML = `
  ${renderResult(formData, aiResult)}
  ${renderHistory()}

`;
setupPreviewButton(aiResult, templateType);


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

 
const downloadBtn = document.getElementById("downloadBtn");
const pdfBtn = document.getElementById("pdfBtn");
const zipBtn = document.getElementById("zipBtn");

zipBtn.addEventListener("click", async function() {
  const zip = new JSZip();

  zip.file(
    "index.html",
    generateHTMLWithExternalCSS(aiResult, formData.templateType)
  );

  zip.file(
    "style.css",
    generateCSS(aiResult)
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
  const htmlContent = generateHTML(aiResult, templateType);

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
    generateCSS(aiResult);

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

function getThemeByNiche(niche = "") {

  const nicheLower = niche.toLowerCase();

  if (nicheLower.includes("aviação")) {
    return {
      primary: "#2563EB",
      secondary: "#0F172A",
      accent: "#60A5FA"
    };
  }

  if (
    nicheLower.includes("saúde") ||
    nicheLower.includes("medicina") ||
    nicheLower.includes("nutrição")
  ) {
    return {
     primary: "#10B981",
  secondary: "#064E3B",
  accent: "#A7F3D0"
    };
  }

  if (
    nicheLower.includes("advocacia") ||
    nicheLower.includes("advogado")
  ) {
    return {
      primary: "#C9A227",
      secondary: "#111111",
      accent: "#F5E6A8"
    };
  }

  return {
    primary: "#2563EB",
    secondary: "#0B1020",
    accent: "#7C3AED"
  };
}


function generateCSS(aiResult, templateType) {
  const theme = getThemeByNiche(
    document.getElementById("niche").value
  );

  console.log("CSS templateType:", templateType);

  return `
*{
  margin:0;
  padding:0;
  box-sizing:border-box;
}

body{
  font-family:Inter, sans-serif;
  background:#050816;
  color:#FFFFFF;
  line-height:1.6;
}

section{
  padding:80px 24px;
}

.container{
  max-width:1280px;
  margin:0 auto;
  display:grid;
  grid-template-columns:repeat(12,1fr);
  gap:20px;
}

/* HEADERS */

.section-header{
  grid-column:1 / span 12;
  margin-bottom:48px;
}

.section-kicker,
.eyebrow,
.section-header span{
  display:inline-block;
  margin-bottom:14px;
  font-size:14px;
  font-weight:800;
  letter-spacing:.08em;
  text-transform:uppercase;
  color:${theme.accent};
}

.section-header h2{
  max-width:760px;
  font-size:56px;
  font-weight:900;
  line-height:1.05;
  letter-spacing:-.04em;
  margin-bottom:16px;
}

.section-header p{
  max-width:720px;
  font-size:20px;
  line-height:1.55;
  color:rgba(255,255,255,.72);
}

/* GRID BASE */

.template-grid,
.benefits-grid,
.proof-grid,
.steps-grid,
.dashboard-preview{
  grid-column:1 / span 12;
  display:grid;
  grid-template-columns:repeat(3,1fr);
  gap:24px;
}

.template-card,
.benefit-card,
.step-card,
.metric-card,
.content-card{
  border-radius:24px;
  padding:32px;
  background:rgba(255,255,255,.06);
  border:1px solid rgba(255,255,255,.10);
}

.template-card h3,
.benefit-card h3,
.step-card h3{
  font-size:26px;
  line-height:1.15;
  margin-bottom:14px;
}

.template-card p,
.benefit-card p,
.step-card p,
.content-card p{
  color:#CBD5E1;
}

/* HERO BASE */

.hero{
  min-height:88vh;
  display:flex;
  align-items:center;
}

.hero-content{
  grid-column:1 / span 6;
  display:flex;
  flex-direction:column;
  justify-content:center;
}

.hero-badge{
  display:inline-flex;
  align-items:center;
  gap:8px;
  width:max-content;
  padding:10px 16px;
  margin-bottom:28px;
  border-radius:999px;
  background:rgba(255,255,255,.05);
  border:1px solid rgba(255,255,255,.10);
  color:${theme.accent};
  backdrop-filter:blur(12px);
}

.hero-content h1{
  max-width:700px;
  font-size:clamp(42px,5vw,72px);
  line-height:.95;
  letter-spacing:-.05em;
  margin-bottom:24px;
}

.hero-content p{
  max-width:600px;
  font-size:20px;
  color:#CBD5E1;
}

.hero-highlights{
  display:flex;
  flex-wrap:wrap;
  gap:10px;
  margin-top:22px;
}

.hero-highlights span{
  padding:8px 12px;
  border-radius:999px;
  font-size:14px;
  font-weight:700;
  background:rgba(255,255,255,.08);
  border:1px solid rgba(255,255,255,.10);
}

.hero-content a{
  display:inline-block;
  text-align:center;
  margin-top:36px;
  padding:16px 28px;
  border-radius:14px;
  text-decoration:none;
  color:#FFFFFF;
  font-weight:700;
  background:linear-gradient(135deg, ${theme.primary}, ${theme.accent});
  box-shadow:0 20px 50px rgba(37,99,235,.35);
  transition:transform .3s ease, box-shadow .3s ease;
}

.hero-content a:hover{
  transform:translateY(-4px) scale(1.02);
}

.hero-visual{
  grid-column:8 / span 5;
  display:flex;
  justify-content:center;
  align-items:center;
  pointer-events:none;
}

/* STEPS */

.step-number{
  font-size:64px;
  font-weight:900;
  line-height:1;
  margin-bottom:24px;
  background:linear-gradient(90deg,#2563EB,#7C3AED);
  -webkit-background-clip:text;
  -webkit-text-fill-color:transparent;
}

.step-card{
  transition:.3s ease;
}

.step-card:hover{
  transform:translateY(-6px);
  box-shadow:0 20px 60px rgba(0,0,0,.25);
}

/* METRICS */

.metric-card{
  text-align:center;
  padding:40px;
}

.metric-card strong{
  display:block;
  font-size:64px;
  line-height:1;
  margin-bottom:10px;
}

.metric-card span{
  font-size:18px;
  opacity:.8;
}

/* BENEFITS */

.benefit-card{
  transition:.3s ease;
}

.benefit-card:hover{
  transform:translateY(-4px);
}

.benefit-icon{
  width:56px;
  height:56px;
  display:flex;
  align-items:center;
  justify-content:center;
  margin-bottom:20px;
  border-radius:14px;
  background:linear-gradient(135deg,#2563EB,#7C3AED);
  font-size:24px;
}

/* OBJECTION */

.objection-card{
  grid-column:1 / span 12 !important;

  width:100% !important;
  max-width:none !important;

  display:block !important;

  padding:64px 0 !important;

  background:transparent !important;
  border:none !important;
  box-shadow:none !important;
}

.objection-card .section-kicker{
  display:block !important;
  width:max-content !important;
}

.objection-card h2{
  width:100% !important;
  max-width:900px !important;
  font-weight:900 !important;
  font-size: 56px !important;
  line-height: 1.2 !important;
  letter-spacing:-.04em !important;

  margin-bottom:20px !important;

  text-align:left !important;
}

.objection-card p{
  width:100% !important;
  max-width:760px !important;

  font-size:22px !important;
  line-height:1.6 !important;

  text-align:left !important;
}
/* FAQ */

.faq .container{
  display:grid;
  grid-template-columns:repeat(12,1fr);
  gap:20px;
}

.faq .section-header{
  grid-column:1 / span 12;
}

.faq-list{
  grid-column:1 / span 12;
  width:100%;
  display:flex;
  flex-direction:column;
  gap:16px;
}

.faq-list details,
.faq details{
  width:100%;
  grid-column:1 / span 12;
  display:block;
  margin:0 0 16px;
  border-radius:18px;
  overflow:hidden;
  background:rgba(255,255,255,.05);
  border:1px solid rgba(255,255,255,.10);
}

.faq-list summary,
.faq summary{
  width:100%;
  display:block;
  padding:22px 26px;
  cursor:pointer;
  font-size:20px;
  font-weight:700;
  list-style:none;
  white-space:normal;
}

.faq-list details p,
.faq details p{
  width:100%;
  padding:0 26px 24px;
  color:#CBD5E1;
  white-space:normal;
}

/* RESPONSIVE */

@media(max-width:1024px){
  .hero-content{
    grid-column:1 / span 12;
    text-align:center;
    align-items:center;
  }

  .hero-visual{
    grid-column:1 / span 12;
    margin-top:50px;
  }

  .hero-highlights{
    justify-content:center;
  }
}

@media(max-width:768px){
  section{
    padding:56px 20px;
  }

  .hero{
    min-height:auto;
  }

  .section-header h2{
    font-size:42px;
  }

  .template-grid,
  .benefits-grid,
  .proof-grid,
  .steps-grid,
  .dashboard-preview{
    grid-template-columns:1fr;
  }

  .step-number{
    font-size:48px;
  }

  .objection-card{
    grid-column:1 / span 12;
    padding:32px;
  }
}

${generateTemplateCSS(templateType, theme)}
`;
}


function generateTemplateCSS(templateType, theme) {
   const type = String(templateType).toLowerCase().trim();
     console.log("TYPE NORMALIZADO:", type);
    switch (type) {

    case "curso":
      return `
body{
  background:#F7F3FF;
  color:#111;
}

.hero{
  background:
    radial-gradient(circle at 15% 20%, #7C3AED22, transparent 28%),
    radial-gradient(circle at 85% 10%, #2563EB22, transparent 30%),
    linear-gradient(135deg,#FFFFFF,#F4EEFF);
}

.hero-badge{
  background:#FFFFFF;
  color:#7C3AED;
  border:1px solid #E9D5FF;
  box-shadow:0 10px 30px rgba(124,58,237,.10);
}

.hero-content h1{
  color:#111;
  font-size:clamp(52px,5vw,82px);
  font-weight: 900 !important;
  
}

.course-section .section-header p{
  display:block !important;
  max-width:720px !important;
  margin-top:18px !important;

  color:#64748B !important;
  font-size:20px !important;
  line-height:1.55 !important;
}

.hero-content p{
  color:#475569;
}

.hero-content a{
  border-radius:999px;
  background:linear-gradient(135deg,#7C3AED,#2563EB);
  box-shadow:0 24px 60px rgba(124,58,237,.25);
}  

.hero-content a:hover{
  box-shadow:
    0 20px 50px rgba(124,58,237,.25),
    0 40px 90px rgba(37,99,235,.15);
}  
.course-hero-card{
  width:100%;
  max-width:460px;
  padding:34px;
  border-radius:32px;

  background:#FFFFFF;
  border:1px solid #E9D5FF;

  box-shadow:
    0 30px 90px rgba(124,58,237,.16);

  transform:rotate(2deg);
}

.course-card-badge{
  display:inline-flex;
  margin-bottom:28px;
  padding:10px 14px;
  border-radius:999px;

  background:#F3E8FF;
  color:#7C3AED;

  font-size:14px;
  font-weight:900;
}

.course-hero-card h3{
  font-size:42px;
  line-height:1;
  letter-spacing:-.04em;
  margin-bottom:14px;
  color:#111827;
}

.course-hero-card p{
  color:#64748B;
  font-size:18px;
  line-height:1.5;
  margin-bottom:28px;
}

.course-card-list{
  display:grid;
  gap:12px;
}

.course-card-list span{
  padding:14px 16px;
  border-radius:16px;

  background:#F7F3FF;
  border:1px solid #E9D5FF;

  color:#111827;
  font-weight:700;
}

.dynamic-section{
  background:#FFFFFF;
  padding:72px 24px;
}
.dynamic-section h2{
  font-size:56px;
  line-height:1;
  letter-spacing:-.03em;
  margin-bottom:16px;
  max-width:700px;
}
  
.dynamic-section .content-card{
  background:#FFFFFF;
  color:#111;
  border:1px solid #E9D5FF;
  box-shadow:0 20px 50px rgba(124,58,237,.08);
}

.content-card p,
.benefit-card p{
  color:#475569;
}

.benefit-card{
  background:#FFFFFF;
  color:#111;
  border:1px solid #E9D5FF;
  box-shadow:0 18px 50px rgba(124,58,237,.08);
}

.section-header h2{
  color:#111;
  font-size:56px;
  line-height:1;
  letter-spacing:-.03em;
  margin-bottom:16px;
  max-width:700px;
}

.faq{
  background:#F4EEFF !important;
}

.faq details{
  background:#FFFFFF !important;
  color:#111827 !important;
  border:1px solid #E9D5FF !important;
}

.faq summary{
  color:#111827 !important;
}

.faq details p{
  color:#475569 !important;
}

/* COURSE MODULES */

.course-modules{
  grid-column:1 / span 12 !important;

  display:grid !important;
  grid-template-columns:repeat(3,1fr) !important;
  gap:28px !important;

  margin-top:64px !important;
}

.course-modules .template-card{
  min-height:260px !important;

  padding:34px !important;

  border-radius:28px !important;

  background:#FFFFFF !important;

  border:1px solid #E9D5FF !important;

  box-shadow:
    0 20px 60px rgba(124,58,237,.08) !important;
}

.course-modules .template-card span{
  display:block !important;

  margin-bottom:28px !important;

  color:#7C3AED !important;

  font-size:18px !important;
  font-weight:900 !important;
}

.course-modules .template-card h3{
  color:#111827 !important;

  font-size:28px !important;

  line-height:1.1 !important;

  margin-bottom:16px !important;
}

.course-modules .template-card p{
  color:#64748B !important;

  font-size:18px !important;

  line-height:1.55 !important;
}

/* PROOF GRID */

.proof-grid{
  grid-column:1 / span 12 !important;

  display:grid !important;
  grid-template-columns:repeat(3,1fr) !important;

  gap:28px !important;

  margin-top:64px !important;
}

.proof-card{
  padding:40px !important;

  border-radius:28px !important;

  background:#FFFFFF !important;

  border:1px solid #E9D5FF !important;

  box-shadow:
    0 20px 60px rgba(124,58,237,.08) !important;
}

.proof-card strong{
  display:block !important;

  margin-bottom:12px !important;

  color:#111827 !important;

  font-size:clamp(34px,4vw,58px) !important;

  line-height:1 !important;
}

.proof-card span{
  color:#64748B !important;
}

/* RESPONSIVO */

@media(max-width:768px){

  .course-modules,
  .proof-grid{
    grid-template-columns:1fr !important;
  }

}
  
details{
  background:#FFFFFF;
  color:#111;
  border:1px solid #E9D5FF;
}

details p{
  color:#475569;
}
`;

    case "saas":
      return `
body{
  background:#050816;
  color:#FFFFFF;
}
.saas-dashboard{
  display:block !important;
}
.objection-section .container{
  display:grid !important;
  grid-template-columns:repeat(12,1fr) !important;
}

.objection-card{
  grid-column:1 / span 10 !important;

  text-align:left !important;

  padding:56px 0 !important;
}

.objection-card .section-kicker{
  display:block !important;

  margin-bottom:16px !important;

  color: #60A5FA !important;

  font-size:14px !important;
  font-weight:800 !important;

  letter-spacing:.12em !important;
  text-transform:uppercase !important;
}

.objection-card h2{

  color:#FFFFFF !important;

  font-size:clamp(44px,5vw,72px) !important;
  font-weight:900 !important;

  line-height:.98 !important;
  letter-spacing:-.05em !important;

  text-align:left !important;
}

.objection-card p{
  max-width:760px !important;

  margin-top:24px !important;

  color:#CBD5E1 !important;

  font-size:20px !important;
  line-height:1.6 !important;

  text-align:left !important;
}
  
.dashboard-preview .dashboard-metric{
  background:#151A2A;
  border:1px solid rgba(255,255,255,.10);
  box-shadow:0 24px 70px rgba(0,0,0,.28);
  text-align: center;
}

.dashboard-metric{
  box-shadow:
    0 24px 70px rgba(0,0,0,.35);
}

.hero{
  background:
    radial-gradient(circle at 80% 15%, #2563EB55, transparent 32%),
    radial-gradient(circle at 100% 0%, #7C3AED44, transparent 30%),
    linear-gradient(135deg,#050816,#0B1020);
}

.hero-badge{
  background:rgba(255,255,255,.06);
  color: #60A5FA;
  border:1px solid rgba(255,255,255,.12);
}

.hero-content h1{
  font-size:clamp(54px,5vw,84px);
  color:#FFFFFF;
}

.hero-content p{
  color:#CBD5E1;
}

.hero-content a{
  background:linear-gradient(135deg,#2563EB,#7C3AED);
  box-shadow:0 30px 80px rgba(37,99,235,.35);
}
.hero-content a:hover{
   box-shadow:
    0 20px 50px rgba(37,99,235,.25),
    0 40px 90px rgba(37,99,235,.15);
}

.mockup-stats div{
  background:rgba(255,255,255,.08);
}

.dynamic-section{
  background:#080C18;
}

.dynamic-section .content-card{
  background:linear-gradient(180deg,#10172A,#080C18);
  border:1px solid rgba(255,255,255,.08);
  box-shadow:0 24px 70px rgba(0,0,0,.35);
}

.benefit-card{
  background:linear-gradient(180deg,#10172A,#080C18);
  border:1px solid rgba(255,255,255,.08);
  box-shadow:0 24px 70px rgba(0,0,0,.35);
}

.faq{
  background:#050816;
}
  .saas-hero .hero-visual{
  grid-column:8 / span 5 !important;
  display:flex !important;
  justify-content:center !important;
  align-items:center !important;
}

.saas-hero .saas-dashboard{
  width:100% !important;
  max-width:520px !important;
  min-height:420px !important;
  display:block !important;
  padding:28px !important;
  border-radius:32px !important;

  background:rgba(15,23,42,.78) !important;
  border:1px solid rgba(255,255,255,.12) !important;

  box-shadow:
    0 40px 120px rgba(37,99,235,.25),
    inset 0 1px 0 rgba(255,255,255,.08) !important;

  backdrop-filter:blur(18px) !important;
  transform:rotate(-4deg) !important;
}

.saas-hero .dashboard-topbar{
  height:44px !important;
  border-radius:16px !important;
  margin-bottom:20px !important;
  background:rgba(255,255,255,.08) !important;
}

.saas-hero .dashboard-grid{
  display:grid !important;
  grid-template-columns:repeat(3,1fr) !important;
  gap:14px !important;
  margin-bottom:18px !important;
}

.saas-hero .dashboard-grid div{
  height:92px !important;
  border-radius:18px !important;
  background:rgba(255,255,255,.08) !important;
}

.saas-hero .dashboard-chart{
  height:180px !important;
  border-radius:22px !important;
  background:linear-gradient(135deg,#2563EB,#7C3AED) !important;
}

@media(max-width:1024px){
  .saas-hero .hero-visual{
    grid-column:1 / span 12 !important;
    margin-top:50px !important;
  }
}
`;

   case "consultoria":
  return `
body{
  background:#F6F3EC;
  color:#151515;
}

.hero{
  background:
    linear-gradient(90deg,#F6F3EC 0%,#FFFFFF 55%,#ECE7DC 100%);
}

.hero-badge{
  background:#151515;
  border:1px solid #151515;
}

.hero-content h1{
  color:#151515;
  font-size:clamp(54px,5vw,84px);
  letter-spacing:-.06em;
}

.hero-content p{
  color:#4B5563;
}

.hero-content a{
  background:#151515;
  color:#FFFFFF;
  border-radius:6px;
  box-shadow:0 22px 50px rgba(0,0,0,.18);
}

.hero-content a:hover{
   box-shadow:
    0 20px 50px rgba(16,185,129,.25),
    0 40px 90px rgba(16,185,129,.15);
}

.mockup-line,
.mockup-stats div{
  background:rgba(255,255,255,.12);
}

.dynamic-section{
  background:#151515;
  color:#FFFFFF;
}

.dynamic-section .section-kicker{
  color:#C8A96A;
}

.dynamic-section .content-card{
  background:#1F1F1F;
  border:1px solid rgba(255,255,255,.1);
  box-shadow:0 24px 70px rgba(0,0,0,.22);
}

.dynamic-section .content-card p{
  color:#D1D5DB;
}

.benefits{
  background:#F6F3EC;
}

.benefit-card{
  background:#FFFFFF;
  color:#151515;
  border:1px solid #E5E0D5;
  box-shadow:0 18px 45px rgba(0,0,0,.06);
}

.benefit-card p{
  color:#4B5563;
}

.benefit-icon{
  background:#151515;
}

.social-proof,
.objection{
  background:#FFFFFF;
}

.content-card{
  background:#FFFFFF;
  color:#151515;
  border:1px solid #E5E0D5;
}

.content-card p{
  color:#4B5563;
}

.faq{
  background:#F6F3EC;
}

details{
  background:#FFFFFF;
  color:#151515;
  border:1px solid #E5E0D5;
}

details p{
  color:#4B5563;
}
`;

 case "ecommerce":
  return `
body{
  background:#FFF7ED;
  color:#111827;
}

.hero{
  background:
    radial-gradient(circle at 80% 20%, #FB923C33, transparent 30%),
    linear-gradient(135deg,#FFFFFF,#FFF7ED);
}
.ecommerce-hero .hero-highlights span{
  background:#FFFFFF !important;
  border:1px solid #FED7AA !important;
  color:#9A3412 !important;
  box-shadow:0 10px 30px rgba(234,88,12,.08) !important;
  border-radius: 3px;
  padding: 5px 10px;
}
  .ecommerce-hero .product-image{
  position:relative !important;
  overflow:hidden !important;
}

.ecommerce-hero .product-image::after{
  content:"" !important;
  position:absolute !important;
  inset:24px !important;
  border-radius:22px !important;
  background:
    linear-gradient(
      135deg,
      rgba(255,255,255,.32),
      rgba(255,255,255,0)
    ) !important;
}
    .ecommerce-hero .product-image::before{
  content:"✦" !important;
  position:absolute !important;
  top:50% !important;
  left:50% !important;
  transform:translate(-50%,-50%) !important;
  font-size:72px !important;
  color:rgba(255,255,255,.75) !important;
  z-index:2 !important;
}
.hero-badge{
  background:#FFEDD5;
  color:#C2410C;
  border:1px solid #FED7AA;
}

.hero-content h1{
  color:#111827;
  font-size:clamp(52px,5vw,82px);
}

.hero-content p{
  color:#4B5563;
}

.hero-content a{
  background:#EA580C;
  color:#FFFFFF;
  border-radius:999px;
  box-shadow:0 24px 60px rgba(234,88,12,.25);
}

.hero-content a:hover{
  box-shadow:
    0 20px 50px rgba(234,88,12,.25),
    0 40px 90px rgba(234,88,12,.15);
}

/* HERO PRODUTO */

.ecommerce-hero .hero-visual{
  grid-column:8 / span 5 !important;
  display:flex !important;
  justify-content:center !important;
  align-items:center !important;
}

.ecommerce-hero .product-card{
  width:100% !important;
  max-width:460px !important;
  min-height:520px !important;
  padding:28px !important;

  display:flex !important;
  flex-direction:column !important;
  justify-content:space-between !important;

  background:#FFFFFF !important;
  border:1px solid #FED7AA !important;
  border-radius:36px !important;

  box-shadow:0 40px 100px rgba(234,88,12,.18) !important;

  transform:rotate(-2deg) !important;
}

.ecommerce-hero .product-image{
  height:320px !important;
  border-radius:28px !important;

  background:
    radial-gradient(circle at 50% 45%,#FDBA74 0%,#FB923C 38%,#EA580C 100%) !important;
}

.ecommerce-hero .product-info{
  margin-top:24px !important;
  padding:22px !important;

  border-radius:24px !important;
  background:#FFF7ED !important;
  border:1px solid #FED7AA !important;
}

.ecommerce-hero .product-info span{
  display:block !important;
  color:#C2410C !important;
  font-weight:800 !important;
  font-size:14px !important;
  text-transform:uppercase !important;
  letter-spacing:.08em !important;
}

.ecommerce-hero .product-info strong{
  display:block !important;
  margin:8px 0 !important;
  font-size:28px !important;
  line-height:1.1 !important;
  color:#111827 !important;
}

.ecommerce-hero .product-info p{
  color:#4B5563 !important;
  font-size:15px !important;
  line-height:1.5 !important;
}

/* OFERTA */

.ecommerce-offer .offer-card{
  grid-column:1 / span 12 !important;

  display:grid !important;
  grid-template-columns:1.4fr .8fr !important;
  align-items:center !important;
  gap:32px !important;

  width:100% !important;
  padding:40px !important;

  background:#FFFFFF !important;
  border:1px solid #FED7AA !important;
  border-radius:32px !important;

  box-shadow:0 30px 80px rgba(234,88,12,.12) !important;
}

.ecommerce-offer .offer-card h3{
  font-size:36px !important;
  line-height:1.05 !important;
  margin-bottom:16px !important;
}

.ecommerce-offer .offer-card p{
  font-size:18px !important;
  line-height:1.6 !important;
  max-width:640px !important;
}

.ecommerce-offer .price-box{
  width:100% !important;
  min-height:220px !important;

  display:flex !important;
  flex-direction:column !important;
  justify-content:center !important;
  align-items:center !important;

  background:#FFF7ED !important;
  border:1px solid #FED7AA !important;
  border-radius:24px !important;

  text-align:center !important;
}

.ecommerce-offer .price-box strong{
  font-size:56px !important;
  color:#EA580C !important;
}

/* SEÇÕES */

.dynamic-section{
  background:#FFFFFF;
}

.dynamic-section .section-kicker{
  color:#EA580C;
}

.dynamic-section .content-card{
  background:#FFF7ED;
  color:#111827;
  border:1px solid #FED7AA;
  box-shadow:0 20px 50px rgba(234,88,12,.08);
}

.dynamic-section .content-card p{
  color:#4B5563;
}

.benefits{
  background:#FFF7ED;
}

.benefit-card{
  background:#FFFFFF;
  color:#111827;
  border:1px solid #FED7AA;
  box-shadow:0 18px 45px rgba(234,88,12,.08);
}

.benefit-card p{
  color:#4B5563;
}

.benefit-icon{
  background:#EA580C;
}

.social-proof,
.objection{
  background:#FFFFFF;
}

.content-card{
  background:#FFF7ED;
  color:#111827;
  border:1px solid #FED7AA;
}

.content-card p{
  color:#4B5563;
}

.faq{
  background:#FFFFFF;
}

details{
  background:#FFF7ED;
  color:#111827;
  border:1px solid #FED7AA;
}

details p{
  color:#4B5563;
}

@media(max-width:768px){
  .ecommerce-hero .hero-visual{
    grid-column:1 / span 12 !important;
  }

  .ecommerce-offer .offer-card{
    grid-template-columns:1fr !important;
    padding:32px !important;
  }

  .ecommerce-offer .offer-card h3{
    font-size:30px !important;
  }
}
`;

    default:
      return "";
  }
}

function safeText(value, fallback) {
  return value && value.trim() !== "" ? value : fallback;
}

function generateDynamicSection(aiResult, templateType) {
  const type = String(templateType).toLowerCase().trim();

  switch (type) {
    case "curso":
      return generateCourseSection(aiResult);

    case "saas":
      return generateSaasSection(aiResult);

    case "consultoria":
      return generateConsultingSection(aiResult);

    case "ecommerce":
      return generateEcommerceSection(aiResult);

    default:
      return "";
  }
}

function generateCourseSection(aiResult) {
  const sectionData = getSectionData(aiResult, "curso");
  return `
<section class="dynamic-section course-section">
  <div class="container">
    <div class="section-header">
      <span class="section-kicker">Conteúdo do curso</span>

      <h2>${sectionData.title}</h2>

      <p>${sectionData.description}</p>
    </div>

    <div class="template-grid course-modules">
      <div class="template-card">
        <span>01</span>
        <h3>${safeText(aiResult.module1Title, "Fundamentos")}</h3>
        <p>${safeText(aiResult.module1Description, "Entenda a base necessária para começar com clareza e segurança.")}</p>
      </div>

      <div class="template-card">
        <span>02</span>
        <h3>${safeText(aiResult.module2Title, "Prática guiada")}</h3>
        <p>${safeText(aiResult.module2Description, "Aprenda aplicando em exercícios, exemplos reais e situações próximas do mercado.")}</p>
      </div>

      <div class="template-card">
        <span>03</span>
        <h3>${safeText(aiResult.module3Title, "Resultado final")}</h3>
        <p>${safeText(aiResult.module3Description, "Saia com uma visão prática, organizada e pronta para evoluir.")}</p>
      </div>
    </div>
  </div>
</section>
`;
}

function generateSaasSection(aiResult) {
   const sectionData = getSectionData(aiResult, "saas");
  return `
<section class="dynamic-section saas-flow">

  <div class="container">

    <div class="section-header">

      <span>COMO FUNCIONA</span>

      <h2>${sectionData.title}</h2>

      <p>${sectionData.description}</p>

    </div>

    <div class="template-grid">

      <div class="template-card">
        <span>⚠️</span>
        <h3>Problema</h3>
        <p>
          ${safeText(
            aiResult.problemDescription,
            "Processos manuais, retrabalho e falta de visibilidade limitam o crescimento."
          )}
        </p>
      </div>

      <div class="template-card">
        <span>⚙️</span>
        <h3>Automação</h3>
        <p>
          Centralize informações, automatize tarefas e acompanhe tudo em tempo real.
        </p>
      </div>

      <div class="template-card">
        <span>📈</span>
        <h3>Resultado</h3>
        <p>
          ${safeText(
            aiResult.resultsDescription,
            "Mais produtividade, decisões rápidas e crescimento sustentável."
          )}
        </p>
      </div>

    </div>

  </div>

</section>
`;
}

function generateConsultingSection(aiResult) {
  return `
<section class="dynamic-section consulting-process">
  <div class="container">
    <div class="section-header">
      <span class="section-kicker">Método</span>
      <h2>${safeText(aiResult.methodTitle, "Uma metodologia para gerar clareza e crescimento")}</h2>
    </div>

    <div class="template-grid">
      <div class="template-card">
        <span>01</span>
        <h3>${safeText(aiResult.step1Title, "Diagnóstico")}</h3>
        <p>${safeText(aiResult.step1Description, "Entendemos os gargalos, oportunidades e desafios que impedem o crescimento.")}</p>
      </div>

      <div class="template-card">
        <span>02</span>
        <h3>${safeText(aiResult.step2Title, "Estratégia")}</h3>
        <p>${safeText(aiResult.step2Description, "Construímos um plano de ação com prioridades claras e metas objetivas.")}</p>
      </div>

      <div class="template-card">
        <span>03</span>
        <h3>${safeText(aiResult.step3Title, "Execução")}</h3>
        <p>${safeText(aiResult.step3Description, "Acompanhamos a implementação para transformar planejamento em resultado.")}</p>
      </div>
    </div>
  </div>
</section>

<section class="dynamic-section consulting-results">
  <div class="container">
    <div class="section-header">
      <span class="section-kicker">Resultados</span>
      <h2>${safeText(aiResult.resultsTitle, "O impacto esperado")}</h2>
    </div>

    <div class="content-card">
      <p>${safeText(aiResult.resultsDescription, "Mais clareza, foco estratégico e processos organizados para acelerar resultados.")}</p>
    </div>
  </div>
</section>
`;
}

function generateEcommerceSection(aiResult) {
  return `
<section class="dynamic-section ecommerce-offer">
  <div class="container">
    <div class="section-header">
      <span class="section-kicker">Oferta</span>
      <h2>${safeText(aiResult.differentialTitle, "Produto pensado para quem busca qualidade e praticidade")}</h2>
    </div>

    <div class="offer-card">
      <div>
        <span class="offer-label">Oferta especial</span>
        <h3>${safeText(aiResult.solutionTitle, "Condição exclusiva por tempo limitado")}</h3>
        <p>${safeText(aiResult.differentialDescription, "Aproveite uma experiência de compra mais segura, prática e com benefícios exclusivos.")}</p>
      </div>

      <div class="price-box">
        <span>A partir de</span>
        <strong>R$ 97</strong>
        <small>ou 12x sem juros</small>
      </div>
    </div>
  </div>
</section>

<section class="dynamic-section ecommerce-reviews">
  <div class="container">
    <div class="section-header">
      <span class="section-kicker">Avaliações</span>
      <h2>${safeText(aiResult.reviewTitle, "Clientes que já escolheram")}</h2>
    </div>

    <div class="template-grid">
      <div class="template-card review-card">
        <span>★★★★★</span>
        <h3>${safeText(aiResult.review1Title, "Compra excelente")}</h3>
        <p>${safeText(aiResult.review1Description, "Produto de ótima qualidade, entrega rápida e experiência muito acima do esperado.")}</p>
      </div>

      <div class="template-card review-card">
        <span>★★★★★</span>
        <h3>${safeText(aiResult.review2Title, "Valeu muito a pena")}</h3>
        <p>${safeText(aiResult.review2Description, "Atendeu exatamente ao que eu precisava e chegou tudo certinho.")}</p>
      </div>

      <div class="template-card review-card">
        <span>★★★★★</span>
        <h3>${safeText(aiResult.review3Title, "Recomendo demais")}</h3>
        <p>${safeText(aiResult.review3Description, "Experiência simples, segura e com ótimo custo-benefício.")}</p>
      </div>
    </div>
  </div>
</section>
`;
}


function generateHTML(aiResult, templateType) {
   const theme = getThemeByNiche(document.getElementById("niche").value)

 console.log("TEMPLATE:", templateType);
  return `
<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${aiResult.headline}</title>

 <style>
  ${generateCSS(aiResult, templateType)}
</style>
</head>

<body>


${generateHero(aiResult, templateType)}

${generateDynamicSection(aiResult, templateType)}
 
${generateBenefits(aiResult, templateType)}

${generateSocialProof(aiResult, templateType)}

${generateObjection(aiResult, templateType)}

${generateFAQ(aiResult, templateType)}

</body>
</html>
`;
}
function getSectionData(aiResult, templateType) {
  const type = String(templateType).toLowerCase().trim();

  switch (type) {
    case "curso":
      return {
        title: safeText(
          aiResult.courseSectionTitle,
          "O que você vai aprender"
        ),
        description: safeText(
          aiResult.courseSectionDescription,
          "Conheça os módulos que vão acelerar sua evolução."
        )
      };

    case "saas":
      return {
        title: safeText(
          aiResult.saasSectionTitle,
          "Centralize sua operação"
        ),
        description: safeText(
          aiResult.saasSectionDescription,
          "Automatize processos, acompanhe dados e ganhe produtividade."
        )
      };

    case "consultoria":
      return {
        title: safeText(
          aiResult.consultingSectionTitle,
          "Nossa metodologia"
        ),
        description: safeText(
          aiResult.consultingSectionDescription,
          "Um processo estruturado para diagnosticar, planejar e executar."
        )
      };

    case "ecommerce":
      return {
        title: safeText(
          aiResult.ecommerceSectionTitle,
          "Produto pensado para conversão"
        ),
        description: safeText(
          aiResult.ecommerceSectionDescription,
          "Diferenciais, garantia e uma oferta clara para facilitar a compra."
        )
      };

    default:
      return {
        title: "Como funciona",
        description: "Entenda como nossa solução gera resultados."
      };
  }
}

function generateBenefits(aiResult, templateType){

  const type = String(templateType)
    .toLowerCase()
    .trim();

  switch(type){

    case "curso":
      return generateCourseBenefits(aiResult);

    case "saas":
      return generateSaasBenefits(aiResult);

    case "consultoria":
      return generateConsultingBenefits(aiResult);

    case "ecommerce":
      return generateEcommerceBenefits(aiResult);

    default:
      return "";
  }
}

function generateCourseBenefits(aiResult){
  return `
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

    </div>

  </div>

</section>
`;
}
function generateSaasBenefits(aiResult){
  return `
<section class="benefits saas-benefits">

  <div class="container">

    <div class="section-header">
      <span class="section-kicker">Resultados</span>
      <h2>Indicadores que fazem diferença</h2>
    </div>

    <div class="template-grid">

      <div class="template-card metric-card">
        <strong>+127%</strong>
        <span>Conversões</span>
      </div>

      <div class="template-card metric-card">
        <strong>48</strong>
        <span>Automações ativas</span>
      </div>

      <div class="template-card metric-card">
        <strong>32h</strong>
        <span>Economizadas por mês</span>
      </div>

    </div>

  </div>

</section>
`;
}

function generateConsultingBenefits(aiResult){
  return generateCourseBenefits(aiResult);
}

function generateEcommerceBenefits(aiResult){
  return generateCourseBenefits(aiResult);
}

function generateSocialProof(aiResult, templateType) {
  const type = String(templateType).toLowerCase().trim();

  const titleByTemplate = {
    curso: "Resultados dos alunos",
    saas: "Resultados da plataforma",
    consultoria: "Resultados gerados",
    ecommerce: "Clientes satisfeitos"
  };

  return `
<section class="social-proof proof-section">
  <div class="container">
    <div class="section-header">
      <span class="section-kicker">Prova social</span>
      <h2>${titleByTemplate[type] || "Resultados comprovados"}</h2>
    </div>

    <div class="template-grid proof-grid">
      <div class="template-card proof-card">
        <strong>${safeText(aiResult.socialProof1, "+5.000 clientes")}</strong>
      </div>

      <div class="template-card proof-card">
        <strong>${safeText(aiResult.socialProof2, "98% de satisfação")}</strong>
      </div>

      <div class="template-card proof-card">
        <strong>${safeText(aiResult.socialProof3, "Resultados reais")}</strong>
      </div>
    </div>
  </div>
</section>
`;
}

function generateObjection(aiResult, templateType) {
  return `
<section class="objection objection-section">
  <div class="container">
    <div class="objection-card">
      <span class="section-kicker">Ainda em dúvida?</span>

      <h2>${safeText(aiResult.objectionTitle, "E se eu não conseguir começar agora?")}</h2>

      <p>${safeText(aiResult.objectionDescription, "Você pode começar com segurança, no seu ritmo e com uma estrutura pensada para reduzir riscos.")}</p>
    </div>
  </div>
</section>
`;
}

function generateHero(aiResult, templateType) {
  const type = String(templateType).toLowerCase().trim();

  switch (type) {
    case "curso":
      return generateCourseHero(aiResult);

    case "saas":
      return generateSaasHero(aiResult);

    case "consultoria":
      return generateConsultingHero(aiResult);

    case "ecommerce":
      return generateEcommerceHero(aiResult);

    default:
      return generateDefaultHero(aiResult);
  }
}

function generateCourseHero(aiResult) {
  return `
<section class="hero course-hero">
  <div class="container">

    <div class="hero-content">
      <span class="hero-badge">Curso online premium</span>

      <h1>${aiResult.headline}</h1>

      <p>${aiResult.subheadline}</p>

      <div class="hero-highlights">
        <span>🎓 Certificado</span>
        <span>👥 Comunidade</span>
        <span>📚 Acesso vitalício</span>
      </div>

      <a href="#">${aiResult.cta}</a>
    </div>

   <div class="hero-visual">
      <div class="course-hero-card">

        <div class="course-card-badge">
          🎓 Curso premium
        </div>

        <h3>Trilha completa</h3>

        <p>Aulas práticas, materiais e suporte para evoluir com clareza.</p>

        <div class="course-card-list">
          <span>12 módulos</span>
          <span>Certificado</span>
          <span>Acesso vitalício</span>
        </div>

      </div>
    </div>

  </div>
</section>
`;
}

function generateSaasBenefits(aiResult){
  return `
<section class="benefits saas-benefits">

  <div class="container">

    <div class="section-header">
      <span class="section-kicker">Resultados</span>
      <h2>Indicadores que fazem diferença</h2>
    </div>

    <div class="template-grid">

      <div class="template-card metric-card">
        <strong>+127%</strong>
        <span>Conversões</span>
      </div>

      <div class="template-card metric-card">
        <strong>48</strong>
        <span>Automações ativas</span>
      </div>

      <div class="template-card metric-card">
        <strong>32h</strong>
        <span>Economizadas por mês</span>
      </div>

    </div>

  </div>

</section>
`;
}
function generateSaasHero(aiResult) {
  return `
<section class="hero saas-hero">
  <div class="container">

    <div class="hero-content">
      <span class="hero-badge">SaaS para crescimento</span>

      <h1>${aiResult.headline}</h1>

      <p>${aiResult.subheadline}</p>

      <div class="hero-highlights">
        <span>⚡ Automação</span>
        <span>📊 Dashboard</span>
        <span>🔗 Integrações</span>
      </div>

      <a href="#">${aiResult.cta}</a>
    </div>

    <div class="hero-visual">
      <div class="saas-dashboard">
        <div class="dashboard-topbar"></div>

        <div class="dashboard-grid">
          <div></div>
          <div></div>
          <div></div>
        </div>

        <div class="dashboard-chart"></div>
      </div>
    </div>

  </div>
</section>
`;
}
function generateHowItWorks(aiResult) {
  return `
<section class="how-it-works">

  <div class="container">

    <div class="section-header">
      <span>COMO FUNCIONA</span>

      <h2>${safeText(
        aiResult.solutionTitle,
        "Gestão simplificada em 3 etapas"
      )}</h2>

      <p>${safeText(
        aiResult.solutionDescription,
        "Organize sua operação de forma simples."
      )}</p>
    </div>

    <div class="steps-grid">

      <div class="step-card">
        <div class="step-number">01</div>

        <h3>${safeText(
          aiResult.step1Title,
          "Cadastre sua operação"
        )}</h3>

        <p>${safeText(
          aiResult.step1Description,
          "Importe alunos, documentos e informações importantes."
        )}</p>
      </div>

      <div class="step-card">
        <div class="step-number">02</div>

        <h3>${safeText(
          aiResult.step2Title,
          "Automatize processos"
        )}</h3>

        <p>${safeText(
          aiResult.step2Description,
          "Configure automações para reduzir tarefas manuais."
        )}</p>
      </div>

      <div class="step-card">
        <div class="step-number">03</div>

        <h3>${safeText(
          aiResult.step3Title,
          "Acompanhe resultados"
        )}</h3>

        <p>${safeText(
          aiResult.step3Description,
          "Visualize indicadores e tome decisões mais rápidas."
        )}</p>
      </div>

    </div>

  </div>

</section>
`;
}
function generateConsultingHero(aiResult){
  return generateCourseHero(aiResult);
}

function generateEcommerceHero(aiResult){
  return generateCourseHero(aiResult);
}

function generateConsultingHero(aiResult) {
  return `
<section class="hero consulting-hero">
  <div class="container">

    <div class="hero-content">
      <span class="hero-badge">Consultoria estratégica</span>

      <h1>${aiResult.headline}</h1>

      <p>${aiResult.subheadline}</p>

      <div class="hero-highlights">
        aiResult.step1Title
       aiResult.step2Title
       aiResult.step3Title
      </div>

      <a href="#">${aiResult.cta}</a>
    </div>

    <div class="hero-visual">
      <div class="consulting-card">
        <span>Plano estratégico</span>
        <strong>90 dias</strong>
        <p>Clareza, prioridades e execução guiada para acelerar resultados.</p>

        <div class="consulting-lines">
          <div></div>
          <div></div>
          <div></div>
        </div>
      </div>
    </div>

  </div>
</section>
`;
}

function generateEcommerceHero(aiResult) {
  return `
<section class="hero ecommerce-hero">
  <div class="container">

    <div class="hero-content">
      <span class="hero-badge">Oferta especial</span>

      <h1>${aiResult.headline}</h1>

      <p>${aiResult.subheadline}</p>

      <div class="hero-highlights">
        <span>★★★★★ 4.9</span>
        <span>🚚 Envio rápido</span>
        <span>🛡️ Garantia</span>
      </div>

      <a href="#">${aiResult.cta}</a>
    </div>

    <div class="hero-visual">
      <div class="product-card">
        <div class="product-image"></div>

        <div class="product-info">
          <span>Produto premium</span>
          <strong>Oferta exclusiva</strong>
          <p>Qualidade, praticidade e garantia em uma experiência pensada para conversão.</p>
        </div>
      </div>
    </div>

  </div>
</section>
`;
}

function generateDefaultHero(aiResult) {
  return `
<section class="hero">
  <div class="container">

    <div class="hero-content">
      <span class="hero-badge">Gerado com LeadForge AI</span>

      <h1>${aiResult.headline}</h1>

      <p>${aiResult.subheadline}</p>

      <a href="#">${aiResult.cta}</a>
    </div>

  </div>
</section>
`;
}

function generateHTMLWithExternalCSS(aiResult, templateType) {
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

  ${generateHTML(aiResult, formData.templateType)
    .split("<body>")[1]
    .split("</body>")[0]}

</body>
</html>
`;
}
function generateFAQ(aiResult, templateType) {
  return `
<section class="faq">

  <div class="container">

    <div class="section-header">
      <h2>Perguntas frequentes</h2>
    </div>

    <details>
      <summary>${safeText(
        aiResult.faq1Question,
        "Pergunta 1"
      )}</summary>

      <p>${safeText(
        aiResult.faq1Answer,
        "Resposta 1"
      )}</p>
    </details>

    <details>
      <summary>${safeText(
        aiResult.faq2Question,
        "Pergunta 2"
      )}</summary>

      <p>${safeText(
        aiResult.faq2Answer,
        "Resposta 2"
      )}</p>
    </details>

    <details>
      <summary>${safeText(
        aiResult.faq3Question,
        "Pergunta 3"
      )}</summary>

      <p>${safeText(
        aiResult.faq3Answer,
        "Resposta 3"
      )}</p>
    </details>

  </div>

</section>
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

    setupPreviewButton(
      historyItem.result,
      historyItem.templateType
    );

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

  //console.log("Resposta da API:", data);

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

function setupPreviewButton(aiResult, templateType) {
  const previewBtn = document.getElementById("previewBtn");

  if (!previewBtn) return;

  previewBtn.onclick = function() {
    const htmlContent = generateHTML(aiResult, templateType);

    const previewWindow = window.open("", "_blank");

    previewWindow.document.open();
    previewWindow.document.write(htmlContent);
    previewWindow.document.close();

    showToast("👁️ Preview aberto!");
  };
}