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
    <h4 class="result-label">Estrutura Gerada</h4>
    <p class="empty-state">
      Preencha os campos acima e clique em "Gerar Estrutura".
    </p>
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

      <button class="cta-preview">
        ${aiResult.cta}
      </button>

      <button id="copyBtn">
        📋 Copiar Estrutura
      </button>

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
    "leadforgeHistory",
    JSON.stringify(history)
  );
// daqui pra baixo segue generatedText, loading, setTimeout...

  const generatedText = `
${aiResult.headline}

${aiResult.subheadline}

✅ ${aiResult.benefit1}
✅ ${aiResult.benefit2}
✅ ${aiResult.benefit3}

CTA:
${aiResult.cta}
`;

resultDiv.innerHTML = `<p class="loading">⚡ Gerando estrutura...</p>`;

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

setupClearButton();
setupHistoryClick();

}, 1000);

});

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
    showToast("🗑 Histórico limpo!");

    resultDiv.innerHTML = `
      <h4 class="result-label">Estrutura Gerada</h4>
      <p class="empty-state">
        Preencha os campos acima e clique em "Gerar Estrutura".
      </p>
    `;
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
      cta: "Tentar novamente"
    };
  }
  return data;
}