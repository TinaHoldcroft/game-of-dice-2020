const houses = [
    "House Tully of Riverrun",
    "House Stark of Winterfell",
    "House Arryn of the Eyrie",
    "House Lannister of Casterly Rock",
    "House Baratheon of Storm's End",
    "House Bolton of the Dreadfort",
    "House Tyrell of Highgarden",
    "House Goodbrother of Hammerhorn",
    "House Nymeros Martell of Sunspear",
    "House Greyjoy of Pyke"
];

// Fetch house data from the API
async function fetchData() {
    try {
        for (const houseName of houses) {
            const response = await fetch(`https://anapioficeandfire.com/api/houses?name=${encodeURIComponent(houseName)}`);
            const data = await response.json();

            if (data.length > 0) {
                createCards(data[0]);
            } else {
                console.warn(`No data found for ${houseName}`);
            }
        }
    } catch (error) {
        console.error("Error fetching API:", error);
        alert('Error fetching API, see console for more details.');
    }
}

// DOM element where cards will be displayed
const cardContainer = document.querySelector('.character-container');

// Create and append house cards
function createCards(house) {
    if (!house) return;

    const filename = house.name.replace(/\s+/g, '');
    const card = document.createElement('div');
    card.className = 'card-container';

    const cardContent = `
        <div class="cards">
            <div class="card-front">
                <img class="card-image" src="styles/images/icons__${filename}.svg" alt="${house.name}">
            </div>
            <div class="card-back">
                <img id="images__${filename}" src="styles/images/images__${filename}.jpg" alt="${house.name}">
                <h3>${house.name}</h3>
                <p><strong>Coat of Arms: </strong>${house.coatOfArms || "N/A"}</p>
                <p><strong>Region: </strong>${house.region || "N/A"}</p>
                <button class="pick-btn">Pick</button>
            </div>
        </div>`;

    card.innerHTML = cardContent;
    cardContainer.appendChild(card);

    // Add event listener for "Pick" button
    card.querySelector('.pick-btn').addEventListener('click', () => openModal(house.name));
}

// Manage player selection
let playerOne = '';
let playerTwo = '';
let isDuplicate = false;

// Generate confirmation message based on selection
function getConfirmationMessage(selected) {
    if (isDuplicate) {
        return "You cannot pick the same player twice.";
    }
    if (!playerOne) {
        return `You have selected ${selected} as your player. Pick again to choose your opponent and start the game.`;
    }
    return `You have selected ${selected} as your opponent. Click OK to start the game.`;
}

// Handle modal logic for player selection
function openModal(selected) {
    isDuplicate = playerOne && selected === playerOne;

    const message = getConfirmationMessage(selected);
    const confirmBtn = {
        label: isDuplicate ? "Repick" : "OK",
        clickHandler: isDuplicate ? cancelSelection : () => confirmSelection(selected),
    };

    const modal = new Modal(message, confirmBtn);
    modal.answer();
}

// Confirm player selection
function confirmSelection(selected) {
    if (!playerOne || isDuplicate) {
        playerOne = selected;
        playerTwo = `?player=${playerOne}`;
    } else {
        playerTwo += `&autoPlayer=${selected}`;
        window.location.assign(`game.html${playerTwo}`);
    }
}

// Cancel duplicate selection
function cancelSelection() {
    if (isDuplicate) {
        playerOne = '';
    }
}

// Start fetching data
fetchData();
