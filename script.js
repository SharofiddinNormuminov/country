"use strict";

const countriesWrapper = document.querySelector(".countries");
const selectCountry = document.querySelector(".selectCountry");

const allCountriesName = [];

////////////////
///////////Select country
selectCountry.addEventListener("change", () => {
  const country = selectCountry.value;

  if (!country) return;

  countriesWrapper.innerHTML = "";

  getCountry(country);
});

function drawCountryName() {
  let optionDefault = `<option value="">-- Country name --</option>`;

  allCountriesName.forEach((el) => {
    optionDefault += `<option value=${el} ${
      el === "Uzbekistan" && "selected"
    } >${el}</option>`;
  });

  selectCountry.insertAdjacentHTML("beforeend", optionDefault);
}

// AJAX
////////////////
function getAllCountryName() {
  const request = new XMLHttpRequest();
  request.open("GET", "https://restcountries.com/v3.1/all");
  request.send();

  request.addEventListener("load", function () {
    const data = JSON.parse(this.responseText);
    data.forEach((country) => {
      allCountriesName.push(country.name.common);
    });
    drawCountryName();
  });
}

function getCountry(country) {
  const request = new XMLHttpRequest();
  request.open("GET", `https://restcountries.com/v3.1/name/${country}`);
  request.send();

  // Current country

  request.addEventListener("load", function () {
    const [data] = JSON.parse(this.responseText);
    console.log(data);

    renderCountry(data);

    const neighbor = data.borders?.[0];

    if (!neighbor) return;

    // Neighbor country
    const requestNeighbor = new XMLHttpRequest();
    requestNeighbor.open(
      "GET",
      `https://restcountries.com/v3.1/alpha/${neighbor}`
    );
    requestNeighbor.send();

    console.log(requestNeighbor.responseText);

    requestNeighbor.addEventListener("load", function () {
      const [dataNeighbor] = JSON.parse(this.responseText);
      console.log(dataNeighbor);

      renderCountry(dataNeighbor, "neighbor");
    });
  });
}

function renderCountry(data, className = "") {
  const lang = Object.values(data.languages);
  const [currency] = Object.values(data.currencies);

  const countryHTML = `
  <div class="country ${className}">
          <img src="${data.flags.png}" alt="${data.name.official}"/>
          <div class="country-data">
            <h3 class="country-name">${data.name.common}</h3>
            <h4 class="country-region">${data.region}</h4>
            <p class="country-row country-population">Population: <span>${(
              data.population / 1000000
            ).toFixed(1)} mln</span></p>
            <p class="country-row country-language">Language: <span>${lang.join(
              ", "
            )}</span></p>
            <p class="country-row country-currency">Currency: <span>${
              currency.symbol
            }</span></p>
          </div>
        </div>
  `;

  countriesWrapper.insertAdjacentHTML("beforeend", countryHTML);
}

getAllCountryName();
getCountry("uzbekistan");
