// fonction pour formater la ville
const formatCity = (city) => {
  city = city.toLowerCase()
  city = city.replace(/ /gi, '-' )
  city = city.replace(/st-/gi, 'saint-');
  return city
}

// fonction de suppression de lignes de tableaux HTML
const removeLines = (table) => {
  const tbody = table.getElementsByTagName('tbody')[0];
  tbody.innerHTML = '';
}

// fonction de création d'une ligne de tableaux HTML
const createLine = (table, infoCity) => {
  const tbody = table.getElementsByTagName('tbody')[0];
  const newRow   = tbody.insertRow();
  let counter = 0;
  for (const key in infoCity) {
    const newCell  = newRow.insertCell(counter);
    const newText  = document.createTextNode(infoCity[key]);
    newCell.appendChild(newText);
    counter++
  }
  table.classList.remove('d-none');
}

// fonction de création d'un objet stockant les informations de la commune
const createCity = (data) => {
  const dataCity = new Object();
  dataCity.commune = data.nom;
  dataCity.cp = '';
  let counter = 0;
  data.codesPostaux.forEach(cp => {
    dataCity.cp += counter === 0 ? cp : `, ${cp}`;
    counter++;
  })
  dataCity.population = data.population;
  dataCity.nomDepartement = data.departement.nom;
  dataCity.numDepartement = data.departement.code;
  dataCity.region = data.region.nom;
  dataCity.latitude = data.centre.coordinates[0];
  dataCity.longitude = data.centre.coordinates[1];
  return dataCity
}

const table = document.getElementById('table'); // element table
let cities = [] // stock les commune dans un tableau javascript (optionnel pour l'exercice)

// fonction de recherche
const searchCity = (city) => {
  cities = [];
  city = formatCity(city);
  const xhr = new XMLHttpRequest();
  // on insere notre ville dans l'url
  xhr.open('GET', `https://geo.API.gouv.fr/communes?nom=${city}&fields=code,nom,departement,codeRegion,region,codesPostaux,population,surface,codeDepartement,centre`);
  xhr.addEventListener('readystatechange', () => {
    if(xhr.readyState === 4) {
      if (xhr.status === 200) {
        infoCity = JSON.parse(xhr.response);
        if (infoCity.length > 0) { // On verifie que le tableau des villes n'est pas vide 
          removeLines(table); // on supprime toutes les lignes du tableau
          infoCity.forEach(data => { // Pour chaque commune on ajoute une nouvelle ligne à notre tableau HTML
            const dataCity = createCity(data);
            cities.push(dataCity);
            createLine(table, dataCity);
          })
        } else { // Si le tableau est vide
          alert('La ville que vous recherchez n\'existe pas ou vous avez fait une faute d\'orthographe');
          cities = [];
          removeLines(table); // on supprime les lignes du tableau
          table.classList.add('d-none'); // on ajoute le display-none à notre table
        }
      } else {
        alert('Erreur API')
      }
    }
  });
  xhr.send();
} 