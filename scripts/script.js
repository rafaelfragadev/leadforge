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

console.log("AI RESULT:", aiResult);
console.log("TIPO:", typeof aiResult);

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
  const theme = getThemeByNiche(document.getElementById("niche").value
);
 console.log("CSS templateType:", templateType);
 console.log("CSS extra:", generateTemplateCSS(templateType, theme));
  return `
*{
  margin:0;
  padding:0;
  box-sizing:border-box;
}
.template-grid{
  grid-column:1 / span 12;
  display:grid;
  grid-template-columns:repeat(3,1fr);
  gap:20px;
}

.template-card{
  padding:32px;
  border-radius:24px;
  background:rgba(255,255,255,.06);
  border:1px solid rgba(255,255,255,.1);
}

.template-card span{
  display:inline-flex;
  margin-bottom:18px;
  font-size:14px;
  font-weight:800;
  opacity:.7;
}

.template-card h3{
  font-size:24px;
  margin-bottom:12px;
}

.template-card p{
  color:#CBD5E1;
}

@media(max-width:768px){
  .template-grid{
    grid-template-columns:1fr;
  }
}

body{
  font-family:Inter,sans-serif;
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
.section-kicker{
  display:inline-block;
  margin-bottom:14px;
  font-size:14px;
  font-weight:700;
  letter-spacing:.08em;
  text-transform:uppercase;
  color:${theme.accent};
}
.section-header{
  grid-column:1 / span 12;
  margin-bottom:26px;
}

.section-header h2{
  font-size:40px;
  line-height:1;
  letter-spacing:-.03em;
}

/* HERO */

.hero{
  min-height:88vh;

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
  .hero-content p{
  color:#CBD5E1;
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

   color:${theme.accent};

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
  ${theme.primary},
  ${theme.accent}
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

.mockup-header{
  height:180px;

  border-radius:18px;

  margin-bottom:20px;

  background:linear-gradient(
    135deg,
    ${theme.primary},
    ${theme.accent}
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
  background:linear-gradient(
    135deg,
    ${theme.primary},
    ${theme.accent}
  );
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

  .hero-content p{
  color:#CBD5E1;
}


  .benefits-grid{
    grid-template-columns:1fr;
  }

}

@media(max-width:768px){

  section{
     padding:56px 20px;
  }

  .hero{
    min-height:auto;
  }
 .dynamic-section,
  .benefits,
  .social-proof,
  .objection,
  .faq{
    padding:56px 20px;
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

  color:#FFFFFF;
}

  .hero-content p{
  color:#CBD5E1;
}

.offer-card{
  background:#FFFFFF;
  border:1px solid #FED7AA;
  box-shadow:0 30px 80px rgba(234,88,12,.12);
}

.offer-label{
  color:#EA580C;
}

.price-box{
  background:#FFF7ED;
  border:1px solid #FED7AA;
}

.price-box strong{
  color:#EA580C;
}

.review-card{
  background:#FFFFFF;
  border:1px solid #FED7AA;
}
.hero-highlights{
  display:flex;
  flex-wrap:wrap;
  gap:10px;
  margin-top:24px;
}

.hero-highlights span{
  padding:10px 14px;
  border-radius:999px;
  font-size:14px;
  font-weight:700;
  background:rgba(255,255,255,.08);
  border:1px solid rgba(255,255,255,.10);
}

/* CURSO HERO */

.course-preview,
.saas-dashboard,
.consulting-card,
.product-card{
  width:100%;
  max-width:520px;
  border-radius:32px;
  padding:28px;
}

.course-preview{
  background:#FFFFFF;
  border:1px solid #E9D5FF;
  box-shadow:0 40px 100px rgba(124,58,237,.18);
  transform:rotate(3deg);
}

.course-cover{
  height:220px;
  border-radius:24px;
  margin-bottom:24px;
  background:linear-gradient(135deg,#7C3AED,#2563EB);
}

.course-info span{
  color:#7C3AED;
  font-weight:800;
}

.course-info strong{
  display:block;
  margin:8px 0;
  font-size:36px;
  color:#111;
}

.course-info p{
  color:#475569;
}

/* SAAS HERO */

.saas-dashboard{
  background:rgba(15,23,42,.78);
  border:1px solid rgba(255,255,255,.12);
  box-shadow:0 40px 120px rgba(37,99,235,.25);
  backdrop-filter:blur(18px);
  transform:rotate(-4deg);
}

.dashboard-topbar{
  height:44px;
  border-radius:16px;
  margin-bottom:20px;
  background:rgba(255,255,255,.08);
}

.dashboard-grid{
  display:grid;
  grid-template-columns:repeat(3,1fr);
  gap:14px;
  margin-bottom:18px;
}

.dashboard-grid div{
  height:92px;
  border-radius:18px;
  background:rgba(255,255,255,.08);
}

.dashboard-chart{
  height:180px;
  border-radius:22px;
  background:linear-gradient(135deg,#2563EB,#7C3AED);
}

/* CONSULTORIA HERO */

.consulting-card{
  background:#151515;
  color:#F6F3EC;
  border:1px solid rgba(255,255,255,.12);
  box-shadow:0 40px 90px rgba(0,0,0,.22);
}

.consulting-card span{
  color:#C8A96A;
  font-weight:800;
  text-transform:uppercase;
  letter-spacing:.08em;
}

.consulting-card strong{
  display:block;
  margin:14px 0;
  font-size:64px;
  line-height:1;
}

.consulting-card p{
  color:#D1D5DB;
}

.consulting-lines{
  margin-top:28px;
  display:grid;
  gap:14px;
}

.consulting-lines div{
  height:16px;
  border-radius:999px;
  background:rgba(255,255,255,.12);
}

.consulting-lines div:nth-child(2){
  width:80%;
}

.consulting-lines div:nth-child(3){
  width:60%;
}

/* ECOMMERCE HERO */

.product-card{
  background:#FFFFFF;
  border:1px solid #FED7AA;
  box-shadow:0 40px 100px rgba(234,88,12,.16);
  transform:rotate(-2deg);
}

.product-image{
  height:280px;
  border-radius:28px;
  background:
    radial-gradient(circle at 50% 45%,#FDBA74 0%,#FB923C 38%,#EA580C 100%);
}

.product-price{
  margin-top:24px;
  padding:20px;
  border-radius:22px;
  background:#FFF7ED;
  text-align:center;
}

.product-price span{
  color:#9A3412;
  font-weight:700;
}

.product-price strong{
  display:block;
  color:#EA580C;
  font-size:48px;
  line-height:1;
  margin-top:6px;
}

@media(max-width:768px){
  .hero-highlights{
    justify-content:center;
  }
}
} ${generateTemplateCSS(templateType, theme)}
`;
}

function generateTemplateCSS(templateType, theme) {
   const type = String(templateType).toLowerCase().trim();
     console.log("TYPE NORMALIZADO:", type);
    switch (templateType) {

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
}

.hero-content p{
  color:#475569;
}

.hero-content a{
  border-radius:999px;
  background:linear-gradient(135deg,#7C3AED,#2563EB);
  box-shadow:0 24px 60px rgba(124,58,237,.25);
}  
.dynamic-section{
  background:#FFFFFF;
  padding:72px 24px;
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
}

.faq{
  background:#F4EEFF;
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
  color:#A78BFA;
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
  color:#F6F3EC;
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

.benefits,
.social-proof,
.objection,
.faq{
  padding:72px 24px;
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

.mockup-line{
  background:#FED7AA;
}

.mockup-stats div{
  background:#FFF7ED;
  border:1px solid #FED7AA;
}

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
  return `
<section class="dynamic-section course-section">
  <div class="container">
    <div class="section-header">
      <span class="section-kicker">Conteúdo do curso</span>
      <h2>${safeText(aiResult.differentialTitle, "O que você vai aprender")}</h2>
    </div>

    <div class="template-grid course-modules">
      <div class="template-card">
        <span>01</span>
        <h3>Fundamentos</h3>
        <p>${safeText(aiResult.differentialDescription, "Entenda a base necessária para começar com clareza e segurança.")}</p>
      </div>

      <div class="template-card">
        <span>02</span>
        <h3>Prática guiada</h3>
        <p>Aprenda aplicando em exercícios, exemplos reais e situações próximas do mercado.</p>
      </div>

      <div class="template-card">
        <span>03</span>
        <h3>Resultado final</h3>
        <p>${safeText(aiResult.resultsDescription, "Saia com uma visão prática, organizada e pronta para evoluir.")}</p>
      </div>
    </div>
  </div>
</section>
`;
}

function generateSaasSection(aiResult) {
  return `
<section class="dynamic-section saas-flow">

  <div class="container">

    <div class="section-header">
      <span class="section-kicker">Como funciona</span>
      <h2>${safeText(
        aiResult.solutionTitle,
        "Transforme dados em crescimento"
      )}</h2>
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

<section class="dynamic-section dashboard-section">

  <div class="container">

    <div class="section-header">
      <span class="section-kicker">Dashboard</span>
      <h2>Indicadores em um único lugar</h2>
    </div>

    <div class="dashboard-preview">

      <div class="dashboard-metric">
        <span>Conversões</span>
        <strong>+127%</strong>
      </div>

      <div class="dashboard-metric">
        <span>Automações</span>
        <strong>48</strong>
      </div>

      <div class="dashboard-metric">
        <span>Tempo economizado</span>
        <strong>32h</strong>
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
      <h2>${safeText(
        aiResult.methodTitle,
        "Uma metodologia para gerar clareza e crescimento"
      )}</h2>
    </div>

    <div class="template-grid">

      <div class="template-card">
        <span>01</span>
        <h3>Diagnóstico</h3>
        <p>
          Entendemos os gargalos, oportunidades e desafios que impedem o crescimento.
        </p>
      </div>

      <div class="template-card">
        <span>02</span>
        <h3>Estratégia</h3>
        <p>
          Construímos um plano de ação com prioridades claras e metas objetivas.
        </p>
      </div>

      <div class="template-card">
        <span>03</span>
        <h3>Execução</h3>
        <p>
          Acompanhamos a implementação para transformar planejamento em resultado.
        </p>
      </div>

    </div>

  </div>

</section>

<section class="dynamic-section consulting-results">

  <div class="container">

    <div class="section-header">
      <span class="section-kicker">Resultados</span>
      <h2>${safeText(
        aiResult.resultsTitle,
        "O impacto esperado"
      )}</h2>
    </div>

    <div class="content-card">
      <p>
        ${safeText(
          aiResult.resultsDescription,
          "Mais clareza, foco estratégico e processos organizados para acelerar resultados."
        )}
      </p>
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
      <h2>${safeText(
        aiResult.differentialTitle,
        "Produto pensado para quem busca qualidade e praticidade"
      )}</h2>
    </div>

    <div class="offer-card">

      <div>
        <span class="offer-label">Oferta especial</span>
        <h3>${safeText(
          aiResult.solutionTitle,
          "Condição exclusiva por tempo limitado"
        )}</h3>
        <p>
          ${safeText(
            aiResult.differentialDescription,
            "Aproveite uma experiência de compra mais segura, prática e com benefícios exclusivos."
          )}
        </p>
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
      <h2>${safeText(
        aiResult.reviewTitle,
        "Clientes que já escolheram"
      )}</h2>
    </div>

    <div class="template-grid">

      <div class="template-card review-card">
        <span>★★★★★</span>
        <h3>Compra excelente</h3>
        <p>${safeText(
          aiResult.reviewDescription,
          "Produto de ótima qualidade, entrega rápida e experiência muito acima do esperado."
        )}</p>
      </div>

      <div class="template-card review-card">
        <span>★★★★★</span>
        <h3>Valeu muito a pena</h3>
        <p>Atendeu exatamente ao que eu precisava e chegou tudo certinho.</p>
      </div>

      <div class="template-card review-card">
        <span>★★★★★</span>
        <h3>Recomendo demais</h3>
        <p>Experiência simples, segura e com ótimo custo-benefício.</p>
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
      <div class="course-preview">
        <div class="course-cover"></div>

        <div class="course-info">
          <span>Trilha completa</span>
          <strong>12 módulos</strong>
          <p>Aulas práticas, materiais e suporte para evoluir com clareza.</p>
        </div>
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

function generateConsultingHero(aiResult) {
  return `
<section class="hero consulting-hero">
  <div class="container">

    <div class="hero-content">
      <span class="hero-badge">Consultoria estratégica</span>

      <h1>${aiResult.headline}</h1>

      <p>${aiResult.subheadline}</p>

      <div class="hero-highlights">
        <span>01 Diagnóstico</span>
        <span>02 Estratégia</span>
        <span>03 Execução</span>
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

        <div class="product-price">
          <span>A partir de</span>
          <strong>R$ 97</strong>
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