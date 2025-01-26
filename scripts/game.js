if (!window.location.search) {
    // No player selected, redirect to home
    if (window.confirm('You have not selected a player, please go back.')) {
        window.location.assign('index.html');
    }
}

function diceLog(isOpponent, roll) {
    const logContainer = isOpponent ? opponentLog : playerLog;
    const logId = isOpponent ? `opponent-dice-${roll}` : `player-dice-${roll}`;
    const title = isOpponent
        ? `Your opponent rolled a ${roll}`
        : `You rolled a ${roll}`;
    const paragraph = document.createElement('p');
    paragraph.className = 'dice-paragraph';
    paragraph.id = logId;
    paragraph.title = title;
    logContainer.insertAdjacentElement('afterbegin', paragraph);
    console.log(title);
}

class Avatar {
    constructor(name, id, isComputerControlled = false) {
        this.name = name;
        this.id = id;
        this.tileNumber = 0;
        this.token = this.createToken();
        this.moveTimeOut = 500;
        this.isComputerControlled = isComputerControlled;
        this.hasToWaitTurn = false;
        this.rolledSix = false;
    }

    createToken() {
        const tokenElement = document.createElement('img');
        tokenElement.src = `styles/images/icons__${this.id}.svg`;
        tokenElement.className = 'token';
        return tokenElement;
    }

    placeTokenOnBoard(board, top, left) {
        board.appendChild(this.token);
        this.moveToken(top, left);
    }

    async moveToken(top, left) {
        const offset = this.isComputerControlled ? { top: 35, left: 55 } : { top: 0, left: 0 };
        this.token.style.top = `${top + offset.top}px`;
        this.token.style.left = `${left + offset.left}px`;
    }

    async moveForwards(diceRoll, tiles) {
        const targetTile = Math.min(this.tileNumber + diceRoll, tiles.length - 1);
        for (let i = this.tileNumber + 1; i <= targetTile; i++) {
            const tile = tiles[i];
            await this.wait(this.moveTimeOut).then(() =>
                this.moveToken(tile.offsetTop, tile.offsetLeft)
            );

            // Handle special "throne" tile
            if (tile.classList.contains('tile-throne') && !this.isComputerControlled) {
                const modal = new Modal(tile.dataset.message, { label: 'OK' });
                await modal.answer();
            }
        }
        this.tileNumber = targetTile;
    }

    async moveBackwards(penalty, tiles) {
        const targetTile = Math.max(this.tileNumber - penalty, 0);
        for (let i = this.tileNumber - 1; i >= targetTile; i--) {
            const tile = tiles[i];
            await this.wait(this.moveTimeOut).then(() =>
                this.moveToken(tile.offsetTop, tile.offsetLeft)
            );
        }
        this.tileNumber = targetTile;
    }

    async wait(milliseconds) {
        return new Promise(resolve => setTimeout(resolve, milliseconds));
    }
}

// Game Setup
const board = document.querySelector('.board');
const tiles = Array.from(document.querySelectorAll('div[class^="tile"]'));
const playerLog = document.querySelector('#playerLog');
const opponentLog = document.querySelector('#opponentLog');
const diceBtn = document.querySelector('.dice-btn');
const playerData = fetchCards('player');
const opponentData = fetchCards('autoPlayer');
const player = new Avatar(playerData.name, playerData.id);
const autoPlayer = new Avatar(opponentData.name, opponentData.id, true);
let waitPenalty = 0;

initializeGame();

function initializeGame() {
    setupAvatars();
    setupBoard();
    diceBtn.addEventListener('click', handleDiceRoll);
}

function setupAvatars() {
    addAvatarToOverview(player, 0);
    addAvatarToOverview(autoPlayer, 1);
    const startTile = tiles[0];
    player.placeTokenOnBoard(board, startTile.offsetTop, startTile.offsetLeft);
    autoPlayer.placeTokenOnBoard(board, startTile.offsetTop, startTile.offsetLeft);
}

function addAvatarToOverview(avatar, index) {
    const overview = document.querySelectorAll('.player-wrapper')[index];
    const avatarHtml = `<img title="${avatar.name}" src="styles/images/icons__${avatar.id}.svg">`;
    overview.insertAdjacentHTML('afterbegin', avatarHtml);
}

function setupBoard() {
    tiles.forEach((tile, index) => {
        tile.innerHTML = `<p title="${index}" class="tile-number">${index}</p>`;
    });
}

async function handleDiceRoll() {
    diceBtn.disabled = true;

    // Handle player turn
    if (autoPlayer.hasToWaitTurn && waitPenalty > 0) {
        await executeTurn(player);
        waitPenalty--;
        if (waitPenalty === 0) autoPlayer.hasToWaitTurn = false;
        diceBtn.disabled = false;
        return;
    }

    await executeTurn(player);
    if (player.rolledSix) {
        alert('You rolled a 6! You get another turn.');
        diceBtn.disabled = false;
        return;
    }

    // Handle opponent turn
    if (player.hasToWaitTurn && waitPenalty > 0) {
        while (waitPenalty > 0) {
            await executeTurn(autoPlayer);
            waitPenalty--;
        }
        player.hasToWaitTurn = false;
    } else {
        await executeTurn(autoPlayer);
        while (autoPlayer.rolledSix) {
            await executeTurn(autoPlayer);
        }
    }

    diceBtn.disabled = false;
}

async function executeTurn(avatar) {
    const diceRoll = rollDice();
    avatar.rolledSix = diceRoll === 6;
    diceLog(avatar.isComputerControlled, diceRoll);
    await avatar.moveForwards(diceRoll, tiles);
    await sleep(600);

    if (avatar.tileNumber === tiles.length - 1) {
        return endGame(!avatar.isComputerControlled);
    }

    if (tiles[avatar.tileNumber].classList.contains('tile-trap')) {
        await applyPenalty(avatar);
    }
}

async function applyPenalty(avatar) {
    const trapTile = tiles[avatar.tileNumber];
    const penalty = Number.parseInt(trapTile.dataset.penalty, 10);
    const penaltyType = trapTile.dataset.type;

    const modal = new Modal(trapTile.dataset.message, { label: 'OK' });
    await modal.answer();

    if (penaltyType === 'wait') {
        waitPenalty = penalty + 1;
        avatar.hasToWaitTurn = true;
    } else {
        await avatar.moveBackwards(penalty, tiles);
    }
}

function rollDice() {
    return Math.floor(Math.random() * 6) + 1;
}

async function endGame(isWinner) {
    const destination = isWinner ? 'winner.html' : 'loser.html';
    window.location.assign(destination);
}

function fetchCards(playerType) {
    const searchPattern = new RegExp(`${playerType}=([a-zA-Z\\s']+)`);
    const match = decodeURIComponent(window.location.search).match(searchPattern);
    const name = match ? match[1] : '';
    return { name, id: name.replace(/\s+/g, '') };
}

function sleep(milliseconds) {
    return new Promise(resolve => setTimeout(resolve, milliseconds));
}
