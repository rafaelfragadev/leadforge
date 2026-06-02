const form = document.querySelector("#generatorForm");

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

  const toneMessages = {
      premium:  "Experiência premium para elevar seus resultados.",
      direto:   "Oferta direta para acelerar sua conversão.",
      emocional: "Conexão emocional com seu público ideal."
    };
  const toneMessage = toneMessages[formData.tone] || "Tom não identificado.";

 const goalMessages = {
  leads: "Capture mais leads qualificados.",
  vendas: "Converta visitantes em clientes.",
  autoridade: "Fortaleça sua autoridade digital."
 };  
 const goalMessage = goalMessages[formData.goal] || "Objetivo não identificado.";


function generateCTA(goal, offer) {

  const ctaMessages = {
    leads: `Receba mais informações sobre o ${offer}.`,
    vendas: `Cadastre-se para receber mais informações sobre o ${offer}`,
    autoridade: `Descubra por que o ${offer} está se tornando referência no mercado.`
  };
  return ctaMessages[goal] || "CTA não identificado.";
}
const cta = generateCTA(formData.goal, formData.offer);


 (formData.goal, 
  formData.offer);

  const resultDiv = document.getElementById("result");

  const generatedText = `
    ${formData.offer} para ${formData.niche}

    ${toneMessage}

    ${goalMessage}

    ${cta}`;

  resultDiv.innerHTML = `<p class="loading">⚡ Gerando estrutura...</p>`; 
  setTimeout(function() {
    resultDiv.innerHTML = `
    <h1>${formData.offer} para ${formData.niche}</h1>
    <h3>${toneMessage}</h3>
    <p>${goalMessage}</p>
    <p class="cta">${cta}</p>
    <button id="copyBtn">📋 Copiar Estrutura</button>
  `;  

  const copyBtn = document.getElementById("copyBtn");
  copyBtn.addEventListener("click", function() {
    navigator.clipboard.writeText(generatedText);
     copyBtn.textContent = "✅ Copiado!";
  });
}, 2000);
  console.log(formData);

});