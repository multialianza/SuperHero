// Lógica captura información del formulario
let form = document.getElementById("formulario");
form.addEventListener("submit", function (event) {
  event.preventDefault();
  limpiarErrores();
  let superHeroNumber = document.querySelector("#superHeroNumber").value;
  console.log(superHeroNumber);
  let resultado = validar(superHeroNumber);
  if (resultado == true) {
    apiConection(superHeroNumber);
  }
});

// Lógica de limpieza de info de error
function limpiarErrores() {
  document.querySelector(".errorNumero").innerHTML = "";
}

// Lógica de validación de info ingresada al formulario
function validar(numero) {
  let pasamosLaValidacion = true;
  let validacion = /\d/gim;

  if (validacion.test(numero) == false) {
    document.querySelector(".errorNumero").innerHTML =
      "Ingrese un dato válido (sólo números).";
    pasamosLaValidacion = false;
  }

  return pasamosLaValidacion;
}

// Lógica de conexión a la api de superheros mediante ajax
function apiConection(id) {
  let superHeroId = id;
  $(document).ready(function () {
    $.ajax({
      type: "GET",

      url: `https://www.superheroapi.com/api.php/4905856019427443/${superHeroId}`,
      dataType: "json",
      success: function (datos) {
        let datosApi = datos;
        console.log(datosApi);
        if (datosApi.error) {
          return alert(
            "Se produjo un error en la búsqueda. Pruebe con un número mayor a 0 y menor a 733"
          );
        } else {
          graficoRender(datosApi);
        }
      },
      error: function (error) {
        console.log(error);
        return alert(
          "Se produjo un error en la búsqueda. Pruebe con un número mayor a 0 y menor a 733"
        );
      },
    });
  });
}

// Lógica de renderización de Card y gráfico 'Canvas'
function graficoRender(datos) {
  const chart = new CanvasJS.Chart("chartContainer", {
    animationEnabled: true,
    title: {
      text: `Estadísticas de poder para ${datos.name}`,
    },
    data: [
      {
        type: "pie",
        startAngle: 240,
        yValueFormatString: "##0",
        indexLabel: "{label} {y}",
        dataPoints: [
          { y: datos.powerstats.intelligence, label: "Inteligencia" },
          { y: datos.powerstats.strength, label: "Fuerza" },
          { y: datos.powerstats.speed, label: "Velocidad" },
          { y: datos.powerstats.durability, label: "Resistencia" },
          { y: datos.powerstats.power, label: "Poder" },
          { y: datos.powerstats.combat, label: "Combate" },
        ],
      },
    ],
  });
  let cardRender = `
  <div class="card mb-3">
    <div class="row g-0">
      <div class="col-md-4">
        <img src="${datos.image.url}" class="img-fluid rounded-start" alt="..." />
      </div>
      <div class="col-md-8">
        <div class="card-body">
          <h5 class="card-title">${datos.name}</h5>
          <ul class="list-group list-group-flush">
            <li class="list-group-item">Conexiones Familiares: ${datos.connections.relatives}</li>
            <li class="list-group-item">Publicado: ${datos.biography.publisher}</li>
            <li class="list-group-item">Ocupación: ${datos.work.occupation}</li>
            <li class="list-group-item">Altura: ${datos.appearance.height}</li>
            <li class="list-group-item">Peso: ${datos.appearance.weight}</li>
          </ul>
        </div>
      </div>
    </div>
  </div>
`;
  let contenedores = document.querySelectorAll(".resultados");
  contenedores.forEach((element) => {
    element.classList.remove("d-none");
  });

  let infoDiv = document.getElementById("info");
  infoDiv.innerHTML = cardRender;
  chart.render();

  document.getElementById("move").focus();
  location.href = "#found";
}
