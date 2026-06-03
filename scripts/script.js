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

    }

    else {

      localStorage.setItem(
        "theme",
        "light"
      );

    }

  }
);


const toneMessages = {
   premium:  "Experiência premium para elevar seus resultados.",
   direto:   "Oferta direta para acelerar sua conversão.",
   emocional: "Conexão emocional com seu público ideal."
  };


const goalMessages = {
  leads: "Capture mais leads qualificados.",
  vendas: "Converta visitantes em clientes.",
  autoridade: "Fortaleça sua autoridade digital."
 };  


const resultDiv = document.getElementById("result");
const savedHistory = localStorage.getItem("leadforgeHistory");

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
} else {
  resultDiv.innerHTML = `
    <h4 class="result-label">Estrutura Gerada</h4>
    <p class="empty-state">
      Preencha os campos acima e clique em "Gerar Estrutura".
    </p>
  `;
}

function generateCTA(goal, offer) {

  const ctaMessages = {
  leads: `Receba mais informações sobre o ${offer}.`,
  vendas: `Cadastre-se para receber mais informações sobre o ${offer}.`,
  autoridade: `Descubra por que o ${offer} está se tornando referência no mercado.`
};
  return ctaMessages[goal] || "CTA não identificado.";
}

function renderResult(formData, toneMessage, goalMessage, cta) {
  return `
    <h1>${formData.offer} para ${formData.niche}</h1>
    <h3>${toneMessage}</h3>
    <p>${goalMessage}</p>
    <p class="cta">${cta}</p>
    <button id="copyBtn">📋 Copiar Estrutura</button>
    <button id="clearBtn">🗑 Limpar Resultado</button>
  `; 
}



form.addEventListener("submit", function(event) {

  event.preventDefault();

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

    history.push(formData.offer);
    console.log(history);

      localStorage.setItem(
        "leadforgeHistory",
        JSON.stringify(history));

  const toneMessage = toneMessages[formData.tone] || "Tom não identificado.";
  const goalMessage = goalMessages[formData.goal] || "Objetivo não identificado.";
  const cta = generateCTA(formData.goal, formData.offer);

  const generatedText = `
  ${formData.offer} para ${formData.niche}

  ${toneMessage}

  ${goalMessage}

  ${cta}
`;

resultDiv.innerHTML = `<p class="loading">⚡ Gerando estrutura...</p>`;

setTimeout(function() {
 resultDiv.innerHTML = `
  ${renderResult(
    formData,
    toneMessage,
    goalMessage,
    cta
  )}

  ${renderHistory()}
`;

  localStorage.setItem(
    "leadforgeResult",
    resultDiv.innerHTML
  );

const copyBtn = document.getElementById("copyBtn");

copyBtn.addEventListener("click", function() {
  navigator.clipboard.writeText(generatedText);

  copyBtn.textContent = "✅ Copiado!";

  setTimeout(function() {
    copyBtn.textContent = "📋 Copiar Estrutura";
  }, 2000);
});

setupClearButton();

}, 1000);

});

function renderHistory() {
  if (history.length === 0) {
    return "";
  }

  const historyItems = history.map(function(item) {
    return `<li>${item}</li>`;
  });

  return `
    <div class="history">
      <h4>Últimas gerações</h4>
      <ul>
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
      <h4 class="result-label">Estrutura Gerada</h4>
      <p class="empty-state">
        Preencha os campos acima e clique em "Gerar Estrutura".
      </p>
    `;
  });
}