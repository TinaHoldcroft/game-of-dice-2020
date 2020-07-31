// https://github.com/joakimskoog/AnApiOfIceAndFire/blob/master/data/characters.json
const houses = [
    "House Tully of Riverrun", //filenames card one: icons__HouseTullyofRiverrun || images__HouseTullyofRiverrun
    "House Stark of Winterfell", //filenames card two: icons__HouseStarkofWinterfell || images__HouseStarkofWinterfell
    "House Arryn of the Eyrie", //filenames card three: icons__HouseArrynoftheEyrie || images__HouseArrynoftheEyrie
    "House Lannister of Casterly Rock", //filenames card four: icons__HouseLannisterofCasterlyRock || images__HouseLannisterofCasterlyRock
    "House Baratheon of Storm's End", //filenames card five: icons__HouseBaratheonofStorm'sEnd || images__HouseBaratheonofStorm'sEnd
    "House Bolton of the Dreadfort", //filenames card six: icons__HouseBoltonoftheDreadfort || images__HouseBoltonoftheDreadfort
    "House Tyrell of Highgarden", //filenames card seven: icons__HouseTyrellofHighgarden || images__HouseTyrellofHighgarden
    "House Goodbrother of Hammerhorn", //filenames card eight: icons__HouseGoodbrotherofHammerhorn || images__HouseGoodbrotherofHammerhorn
    "House Nymeros Martell of Sunspear", //filenames card nine: icons__HouseNymerosMartellofSunspear || images__HouseNymerosMartellofSunspear
    "House Greyjoy of Pyke" //filenames card ten: icons__HouseGreyjoyofPyke || images__HouseGreyjoyofPyke
];

//fetch API house data
async function fetchData() {
    for (const house of houses) {
        await fetch(`https://anapioficeandfire.com/api/houses?name=${house}`)
        .then(response => response.json())
        .then(data => {
            console.log('fetch successful');
            if (house === "") {
                createCards(data[1]);} 
            else {
                createCards(data[0]);}})
        .catch(error => { 
            console.log('fetch failed '+ error);
            alert('Error fetching API, see console for more details');})}}
fetchData();

//create player cards
const cardContainer = document.querySelector('.character-container'); //where to display cards
function createCards(house) {
    if (!house) return;
        const filename = house.name.replace(/\s/g, ''); //remove spaces in name
        const card = document.createElement('div'); // create div
        card.className = 'card-container'; // give div class 
        const cardContent = //card html
        `<div class="cards">
            <div class="card-front">
                <img class="card-image" src="styles/images/icons__${filename}.svg" alt="${house.name}"/>
            </div>

            <div class="card-back">
                <img id="images__${filename}" src="styles/images/images__${filename}.jpg" alt"${house.name}"/>
                <h3>${house.name}</h3>
                <p><strong>Coat of Arms: </strong> ${house.coatOfArms}</p>
                <p><strong>Region: </strong>${house.region}</p>
                <button class="pick-btn">Pick</button>
            </div>
        </div>`;
        card.innerHTML = cardContent;
        cardContainer.appendChild(card);
        card.querySelector('.pick-btn').addEventListener('click', () => openModal(house.name));}

//confirm choice of player
let duplicate = false;
let houseSelection = '';
let playerOne = '';

function confimationMessage(selected) {
    if (duplicate) { return `This card has allready been selected for player one`; } 
    else if (!playerOne) { return `You have selected ${selected} to be player one`; } 
    else { return `You have selected ${selected} to be player two`; }}

function openModal(selected) {
    duplicate = playerOne && selected === playerOne; //mark as duplicate if same card is selected twice
    let modalMessage = confimationMessage(selected);
    let confirmBtn = { label: 'Confirm', clickHandler: () => confirm(selected) }; //confirm choice button
    let cancelBtn = { label: 'Cancel', clickHandler: cancel }; //cancel choice button
        if (duplicate) { //buttons when duplicate selected
            confirmBtn = { label: 'Repick player one', clickHandler: cancel };
            cancelBtn = {
                label: 'Repick player two',
                clickHandler: () => confirm(selected)};}
    const selectionMessage = new Modal(modalMessage, confirmBtn, cancelBtn);
    selectionMessage.answer();
} 
function confirm(selected) { //confirm choice of player
    if (!playerOne || duplicate) {
        playerOne = selected;
        houseSelection = `?player=${playerOne}`;} 
    else {
        houseSelection += `&autoPlayer=${selected}`;
        window.location.assign(`game.html${houseSelection}`);}}

function cancel() { //cancel choice of player
    if (duplicate) { playerOne = ''; } 
    else { return; }}