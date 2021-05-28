const mainScreen = document.querySelector(".main-screen")
const pokeName = document.querySelector(".poke-name");
const pokeID = document.querySelector(".poke-id");
const frontImg = document.querySelector(".poke-front-image");
const backImg = document.querySelector(".poke-back-image");
const pokeTypeOne = document.querySelector(".poke-type-one");
const pokeTypeTwo = document.querySelector(".poke-type-two");
const pokeWeight = document.querySelector(".poke-weight");
const pokeHeight = document.querySelector(".poke-height");
const list = document.querySelectorAll(".list-item");
const leftButton = document.querySelector(".left-button");
const rightButton = document.querySelector(".right-button")

//CONSTANTS AND VARIABLES
const Types = [
       "normal", "fighting", "flying",
       "poison", "ground", "electric",
       "fairy", "fire", "rock",
       "bug", "ghost", "steel",
       "water", "grass", "psychic",
       "ice", "dragon", "dark",

  ]

  let prevUrl = null;
  let nextUrl = null;

//FUNCTIONS
//REMOVER LAS CLASES PARA QUE CADA VEZ QUE SE APRETE UN POQUEMON NO SIGA TENIENDO EL COLOR DE FONDO DEL ANTERIOR
const resetScreen = () => {
 Types.forEach(elem => mainScreen.classList.remove(elem))
};

const capitalize = (str) => str[0].toUpperCase() + str.substr(1)


const fetchPokeList = (url) => {
//Obtener la data de la parte derecha de la pantalla.

fetch(url)
.then(res => res.json())
.then(data => {
    // console.log(data)
    const {results, previous, next} = data;
    prevUrl = previous;
    nextUrl = next;
    //  console.log(results)
     
   for (let i = 0; i < list.length; i++) {
      const pokeListItem = list[i];
      const resultData = results[i]

       if(resultData){
      const {name, url} = resultData;
      const UrlArray = url.split("/");//Atrapar las diferentes partes del url que se separan por un / asi conseguimos el id
      const id = UrlArray[6];

      pokeListItem.textContent = id + ". " + capitalize(name);
       } else {
      pokeListItem.textContent = "";
       }
   }
} 
) } 

const fetchPokeData = (id) => {
//Obtener la data de la parte izquierda de la pantalla:
fetch(`https://pokeapi.co/api/v2/pokemon/${id}`)
.then(res => res.json() )
.then(data => {
    // console.log(data)

resetScreen()


    const dataTypes = data["types"];//Acceder a los tipos
    // console.log(dataTypes)
     //PARA QUE SI TIENE UN SOLO TIPO DESAPAREZCA EL SEGUNDO SPAN
           //UNA OPCION:
    // if(dataTypes.length === 1){
    //     pokeTypeTwo.classList.toggle("hide")
    // pokeTypeOne.textContent = dataTypes[0].type.name
    // } else {
    //     pokeTypeOne.textContent = dataTypes[0].type.name
    //     pokeTypeTwo.textContent = dataTypes[1].type.name
    // }
          //OTRA OPCION:
          const dataFirstType = dataTypes[0];
          const dataSecondType = dataTypes[1];
          pokeTypeOne.textContent =capitalize(dataFirstType.type.name)
          if(dataSecondType){
              pokeTypeTwo.classList.remove("hide")
              pokeTypeTwo.textContent = capitalize(dataSecondType.type.name)
          } else{
              pokeTypeTwo.classList.add("hide")
              pokeTypeTwo.textContent =""
          }
    //Ponerle un color de fondo segun el tipo
    mainScreen.classList.add(dataFirstType.type.name)

    mainScreen.classList.remove("hide")
    pokeName.textContent = capitalize(data.name)
    pokeID.textContent= "#" + data.id.toString().padStart(3, "0");//El padStart agregara 3 ceros al id
    pokeWeight.textContent = data.weight
    pokeHeight.textContent = data.height
    frontImg.src = data.sprites.front_default || "";
    backImg.src = data.sprites.back_default || "";//Este o strings vacios es por si no tiene imagen por default

} );

}

const handleLeftButtonClick = () => {
    if(prevUrl){
        fetchPokeList(prevUrl)
    }
}

const handleRightButtonClick = () => {
if(nextUrl){
    fetchPokeList(nextUrl)
}
}

//Cada vez que apretes un pokemon te aparezca en pantalla
function handleListItemCLick (e){
    // console.log(e.target)
    if(!e.target) return;

const listItem = e.target
if(!listItem.textContent)return;

// console.log(listItem.textContent)
const id = listItem.textContent.split(".")[0]
// console.log(id)
fetchPokeData(id)
}


//Adding eventListeners:

leftButton.addEventListener("click", handleLeftButtonClick)
rightButton.addEventListener("click", handleRightButtonClick)

list.forEach(element => {
    element.addEventListener("click", handleListItemCLick)
})


//initialize App
fetchPokeList("https://pokeapi.co/api/v2/pokemon?offset=0&limit=20")