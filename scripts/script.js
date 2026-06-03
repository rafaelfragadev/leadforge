const form = document.querySelector("#generatorForm");

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

const savedResult =
  localStorage.getItem(
    "leadforgeResult"
  );

if (savedResult) {

  resultDiv.innerHTML =
    savedResult;

} else {

  resultDiv.innerHTML = `
    <h4 class="result-label">
      Estrutura Gerada
    </h4>

    <p class="empty-state">
      Preencha os campos acima e clique em
      "Gerar Estrutura".
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
  resultDiv.innerHTML = renderResult(
    formData,
    toneMessage,
    goalMessage,
    cta
  );

  localStorage.setItem(
    "leadforgeResult",
    resultDiv.innerHTML
  );

  const copyBtn = document.getElementById("copyBtn");
  const clearBtn = document.getElementById("clearBtn");

  copyBtn.addEventListener("click", function() {
    navigator.clipboard.writeText(generatedText);

    copyBtn.textContent = "✅ Copiado!";
    setTimeout(function() {
      copyBtn.textContent = "📋 Copiar Estrutura";
    }, 2000);
  });

  clearBtn.addEventListener("click", function() {

 localStorage.removeItem("leadforgeResult");

 resultDiv.innerHTML = `
  <h4 class="result-label">Estrutura Gerada</h4>
  <p class="empty-state">
    Preencha os campos acima e clique em "Gerar Estrutura".
  </p>
`;

});

}, 1000);

});