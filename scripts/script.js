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

  function getToneMessage(tone) {

  let toneMessage = "";
  if (tone === "premium") {
    toneMessage = "Experiência premium para elevar seus resultados.";
  }

  else if (tone === "direto") {
    toneMessage = "Oferta direta para acelerar sua conversão.";
  }

  else if (tone === "emocional") {
    toneMessage = "Conexão emocional com seu público ideal.";
  }

  else {
    toneMessage = "Tom não identificado.";
  }

  return toneMessage;
}

const toneMessage = getToneMessage(formData.tone);


function getGoalMessage(goal) {
 let goalMessage = "";

  if (goal === "leads") {
    goalMessage = "Capture mais leads qualificados.";
    }

    else if (goal === "vendas") {
    goalMessage = "Converta visitantes em clientes.";
    }

    else if (goal === "autoridade") {
    goalMessage = "Fortaleça sua autoridade digital.";
    }

    else {
    goalMessage = "Objetivo não identificado.";
    }
  return goalMessage;
}


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