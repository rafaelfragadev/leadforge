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

.mockup-card{
  box-shadow: 0 40px 120px rgba(37,99,235,.18);
  transform:rotate(-4deg);
  width:100%;
  max-width:520px;

  padding:24px;

  border-radius:28px;

  background:
    rgba(255,255,255,.05);

  border:
    1px solid rgba(255,255,255,.08);

  backdrop-filter:blur(20px);
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
    padding:72px 20px;
  }

  .hero{
    min-height:auto;
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

.mockup-card{
  background:#FFFFFF;
  border:1px solid #E9D5FF;
  box-shadow:0 40px 100px rgba(124,58,237,.18);
  transform:rotate(3deg);
}

.mockup-header{
  height:90px;
  background:linear-gradient(135deg,#7C3AED,#2563EB);
}

.mockup-card::before{
  content:"🎓 Curso online";
  display:block;
  margin-bottom:18px;
  font-weight:800;
  color:#111;
}

.mockup-card::after{
  content:"12 módulos • certificado • comunidade";
  display:block;
  margin-top:18px;
  padding:14px 16px;
  border-radius:14px;
  background:#F3E8FF;
  color:#6D28D9;
  font-weight:700;
}

.dynamic-section{
  background:#FFFFFF;
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

.mockup-card{
  background:rgba(15,23,42,.78);
  border:1px solid rgba(255,255,255,.12);
  box-shadow:
    0 40px 120px rgba(37,99,235,.25),
    inset 0 1px 0 rgba(255,255,255,.08);
  transform:rotate(-4deg);
}

.mockup-card::before{
  content:"Dashboard";
  display:flex;
  align-items:center;
  justify-content:space-between;
  margin-bottom:18px;
  color:#CBD5E1;
  font-weight:800;
}

.mockup-header{
  height:150px;
  background:linear-gradient(135deg,#2563EB,#7C3AED);
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

.mockup-card{
  background:#151515;
  border:1px solid rgba(255,255,255,.12);
  box-shadow:0 40px 90px rgba(0,0,0,.22);
  transform:rotate(0deg);
}

.mockup-card::before{
  content:"Estratégia";
  display:block;
  margin-bottom:18px;
  color:#F6F3EC;
  font-weight:800;
  letter-spacing:.08em;
  text-transform:uppercase;
}

.mockup-header{
  height:80px;
  background:#C8A96A;
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

.mockup-card{
  background:#FFFFFF;
  border:1px solid #FED7AA;
  box-shadow:0 40px 100px rgba(234,88,12,.16);
  transform:rotate(-2deg);
}

.mockup-card::before{
  content:"Produto em destaque";
  display:block;
  margin-bottom:18px;
  color:#111827;
  font-weight:900;
}

.mockup-header{
  height:210px;
  background:
    radial-gradient(circle at 50% 45%,#FDBA74 0%,#FB923C 38%,#EA580C 100%);
}

.mockup-card::after{
  content:"★★★★★ 4.9 • Oferta especial";
  display:block;
  margin-top:18px;
  padding:14px 16px;
  border-radius:999px;
  background:#FFEDD5;
  color:#C2410C;
  font-weight:800;
  text-align:center;
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
  console.log("🔥 DYNAMIC RODOU:", templateType);

  const type = String(templateType).toLowerCase().trim();

  switch (type) {

    case "curso":
      return `
<section class="dynamic-section course-section">
  <div class="container">
    <div class="section-header">
      <span class="section-kicker">Conteúdo do curso</span>
      <h2>${safeText(aiResult.differentialTitle, "O que você vai aprender")}</h2>
    </div>

    <div class="content-card">
      <p>${safeText(aiResult.differentialDescription, "Você vai aprender os fundamentos, aplicar na prática e sair com clareza para evoluir com segurança.")}</p>
    </div>
  </div>
</section>

<section class="dynamic-section modules-section">
  <div class="container">
    <div class="section-header">
      <span class="section-kicker">Resultado esperado</span>
      <h2>${safeText(aiResult.resultsTitle, "Módulos pensados para evolução real")}</h2>
    </div>

    <div class="content-card">
      <p>${safeText(aiResult.resultsDescription, "A jornada foi organizada para sair do básico, avançar com exemplos reais e transformar conhecimento em aplicação prática.")}</p>
    </div>
  </div>
</section>
`;

    case "saas":
      return `
<section class="dynamic-section problem-section">
  <div class="container">
    <div class="section-header">
      <span class="section-kicker">Problema</span>
      <h2>${safeText(aiResult.problemTitle, "O gargalo que trava sua operação")}</h2>
    </div>

    <div class="content-card">
      <p>${safeText(aiResult.problemDescription, "Processos manuais, dados espalhados e pouca clareza tornam a tomada de decisão lenta e imprecisa.")}</p>
    </div>
  </div>
</section>

<section class="dynamic-section solution-section">
  <div class="container">
    <div class="section-header">
      <span class="section-kicker">Solução</span>
      <h2>${safeText(aiResult.solutionTitle, "Uma plataforma para centralizar tudo")}</h2>
    </div>

    <div class="content-card">
      <p>${safeText(aiResult.solutionDescription, "Com uma visão centralizada, sua equipe acompanha indicadores, automatiza tarefas e toma decisões com muito mais velocidade.")}</p>
    </div>
  </div>
</section>
`;

    case "consultoria":
      return `
<section class="dynamic-section method-section">
  <div class="container">
    <div class="section-header">
      <span class="section-kicker">Método</span>
      <h2>${safeText(aiResult.methodTitle, "Um método claro para sair do improviso")}</h2>
    </div>

    <div class="content-card">
      <p>${safeText(aiResult.methodDescription, "A consultoria identifica gargalos, define prioridades e constrói um plano prático para gerar evolução real no negócio.")}</p>
    </div>
  </div>
</section>

<section class="dynamic-section results-section">
  <div class="container">
    <div class="section-header">
      <span class="section-kicker">Resultados</span>
      <h2>${safeText(aiResult.resultsTitle, "Como isso se transforma em evolução real")}</h2>
    </div>

    <div class="content-card">
      <p>${safeText(aiResult.resultsDescription, "O processo gera mais clareza, prioridade, direção estratégica e ações práticas para melhorar os resultados do negócio.")}</p>
    </div>
  </div>
</section>
`;

    case "ecommerce":
      return `
<section class="dynamic-section product-section">
  <div class="container">
    <div class="section-header">
      <span class="section-kicker">Diferencial</span>
      <h2>${safeText(aiResult.differentialTitle, "Feito para quem quer comprar com confiança")}</h2>
    </div>

    <div class="content-card">
      <p>${safeText(aiResult.differentialDescription, "Um produto pensado para entregar qualidade, praticidade e uma experiência de compra mais segura.")}</p>
    </div>
  </div>
</section>

<section class="dynamic-section review-section">
  <div class="container">
    <div class="section-header">
      <span class="section-kicker">Avaliações</span>
      <h2>${safeText(aiResult.reviewTitle, "O que dizem sobre o produto")}</h2>
    </div>

    <div class="content-card">
      <p>${safeText(aiResult.reviewDescription, "Clientes destacam a qualidade, a facilidade de uso e a boa experiência de compra.")}</p>
    </div>
  </div>
</section>
`;

    default:
      return "";
  }
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