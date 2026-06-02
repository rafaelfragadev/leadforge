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

  const tones = ["premium", "direto", "emocional"];
      const toneMessages = {
        premium:  "Experiência premium para elevar seus resultados.",
        direto:   "Oferta direta para acelerar sua conversão.",
        emocional: "Conexão emocional com seu público ideal."
      };
  const toneMessage = toneMessages[formData.tone] || "Tom não identificado.";

const goals = ["leads", "vendas", "autoridade"]; 
 const goalMessages = {
  leads: "Capture mais leads qualificados.",
  vendas: "Converta visitantes em clientes.",
  autoridade: "Fortaleça sua autoridade digital."
 };  
 const getGoalMessage = goalMessages[formData.goal] || "Objetivo não identificado.";


  function generateCTA(goal, offer) {

  let cta = "";

  if (goal === "leads") {
     cta = `Receba mais informações sobre ${offer}.`;
  }

  else if (goal === "vendas") {
     cta = `Cadastre-se para receber mais informações sobre ${offer}`;
  }

  else if (goal === "autoridade") {
     cta = `Descubra por que ${offer} está se tornando referência no mercado.`;
  }

  return cta;
}

 const goalMessage = getGoalMessage(formData.goal);
 const cta = generateCTA

 (formData.goal, 
  formData.offer);

  const resultDiv = document.getElementById("result");

  resultDiv.innerHTML = `<p class="loading">⚡ Gerando estrutura...</p>`; setTimeout(function() {
    resultDiv.innerHTML = `
    <h1>${formData.offer} para ${formData.niche}</h1>
    <h3>${toneMessage}</h3>
    <p>${goalMessage}</p>
    <p class="cta">${cta}</p>
  `;
}, 2000);
  console.log(formData);

});