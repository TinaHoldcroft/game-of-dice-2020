const houses = [
    "House Tully of Riverrun", //filenames card one(1): icons__HouseTullyofRiverrun || images__HouseTullyofRiverrun
    "House Stark of Winterfell", //filenames card two(2): icons__HouseStarkofWinterfell || images__HouseStarkofWinterfell
    "House Arryn of the Eyrie", //filenames card three(3): icons__HouseArrynoftheEyrie || images__HouseArrynoftheEyrie
    "House Lannister of Casterly Rock", //filenames card four(4): icons__HouseLannisterofCasterlyRock || images__HouseLannisterofCasterlyRock
    "House Baratheon of Storm's End", //filenames card five(5): icons__HouseBaratheonofStorm'sEnd || images__HouseBaratheonofStorm'sEnd
    "House Bolton of the Dreadfort", //filenames card six(6): icons__HouseBoltonoftheDreadfort || images__HouseBoltonoftheDreadfort
    "House Tyrell of Highgarden", //filenames card seven(7): icons__HouseTyrellofHighgarden || images__HouseTyrellofHighgarden
    "House Goodbrother of Hammerhorn", //filenames card eight(8): icons__HouseGoodbrotherofHammerhorn || images__HouseGoodbrotherofHammerhorn
    "House Nymeros Martell of Sunspear", //filenames card nine(9): icons__HouseNymerosMartellofSunspear || images__HouseNymerosMartellofSunspear
    "House Greyjoy of Pyke"]; //filenames card ten(10): icons__HouseGreyjoyofPyke || images__HouseGreyjoyofPyke

//fetch API house data (https://github.com/joakimskoog/AnApiOfIceAndFire/blob/master/data/characters.json)
async function fetchData() {
    for (const house of houses) {
        await fetch(`https://anapioficeandfire.com/api/houses?name=${house}`)
            .then(response => response.json())
            .then(data => {
                console.log('fetch successful');
                if (house === "") { createCards(data[1]); }
                else { createCards(data[0]); }
            })
            .catch(error => {
                console.log(error);
                alert('Error fetching API, see console for more details');
            })
    }
}
fetchData();

const cardContainer = document.querySelector('.character-container'); //where to display cards

function createCards(house) {
    if (!house) return;
    const filename = house.name.replace(/\s/g, ''); //remove spaces in name
    const card = document.createElement('div'); //create div
    card.className = 'card-container'; //give div a class 
    const cardContent = //card html
        `<div class="cards">
        <div class="card-front">
            <img class="card-image" src="styles/images/icons__${filename}.svg" alt="${house.name}">
        </div>

        <div class="card-back">
            <img id="images__${filename}" src="styles/images/images__${filename}.jpg" alt"${house.name}">
            <h3>${house.name}</h3>
            <p><strong>Coat of Arms: </strong> ${house.coatOfArms}</p>
            <p><strong>Region: </strong>${house.region}</p>
            <button class="pick-btn">Pick</button>
        </div>
    </div>`;
    card.innerHTML = cardContent;
    cardContainer.appendChild(card);
    card.querySelector('.pick-btn').addEventListener('click', () => openModal(house.name));
}

//confirm choice of player
let duplicate = false;
let playerTwo = '';
let playerOne = '';

function confimationMessage(selected) {
    if (duplicate) { return "You can not pick the same player twice"; }
    if (!playerOne) { return `You have selected ${selected} to be your player, pick again to choose your opponent and start the game`; }
    return `You have selected ${selected} to be your opponent, click OK to start the game`;
}

function openModal(selected) {
    duplicate = playerOne && selected === playerOne; //mark as duplicate if same card is selected twice
    const modalMessage = confimationMessage(selected);
    let confirmBtn = { label: 'OK', clickHandler: () => confirm(selected) }; //confirm choice button
    if (duplicate) { //buttons when duplicate selected
        confirmBtn = { label: 'Repick', clickHandler: cancel };
    };
    const selectionMessage = new Modal(modalMessage, confirmBtn);
    selectionMessage.answer();
}

function confirm(selected) { //confirm choice of player
    if (!playerOne || duplicate) {
        playerOne = selected;
        playerTwo = `?player=${playerOne}`;
    }
    else {
        playerTwo += `&autoPlayer=${selected}`;
        window.location.assign(`game.html${playerTwo}`);
    }
}

function cancel() { //cancel choice of player
    if (duplicate) { playerOne = ''; }
    else { return; }
};