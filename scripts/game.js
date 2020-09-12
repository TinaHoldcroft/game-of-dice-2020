if (!window.location.search) { //no player selected 
    if (window.confirm('You have not selected a player, please go back')) { window.open('index.html'); }; }

function diceLog(createLog, number) { //create player log
    const paragraph = document.createElement('p');
    paragraph.className = 'dice-paragraph';
    if (!createLog) {
        playerLog.insertAdjacentElement('afterbegin', paragraph);
        paragraph.id = `player-dice-${number}`;
        paragraph.title = `You rolled a ${number}`;
        console.log(`Player rolled: ${number}`); } 
    else {
        opponentLog.insertAdjacentElement('afterbegin', paragraph);
        paragraph.id = `opponent-dice-${number}`;
        paragraph.title = `Your opponent rolled a ${number}`; 
        console.log(`Opponent rolled: ${number}`); } }

class Avatar {
    constructor(name, id, isComputerControlled = false) {
        this.name = name;
        this.id = id;
        this.tileNumber = 0;
        this.token = '';
        this.moveTimeOut = 500;
        this.isComputerControlled = isComputerControlled;
        this.hasToWaitTurn = false;
        this.rolledSix = false;
        this.createToken(); }

    createToken() {
        const tokenImagePath = `styles/images/icons__${this.id}.svg`;
        const tokenElement = document.createElement('img');
        tokenElement.src = tokenImagePath;
        tokenElement.className = 'token';
        this.token = tokenElement; }

    placeTokenOnBoard(board, top, left) {
        board.appendChild(this.token);
        this.moveToken(top, left); }

    async moveToken(top, left) {
        if (!this.isComputerControlled) {
            this.token.style.top = `${top}px`;
            this.token.style.left = `${left}px`; } 
        else {
            const offsetTop = 70 / 2;
            const offsetLeft = 110 / 2;
            this.token.style.top = `${top + offsetTop}px`;
            this.token.style.left = `${left + offsetLeft}px`; } }

    async moveForwards(diceRoll, tiles) {
        const lastTileToMoveTo = this.tileNumber + diceRoll;
        const lastTile = tiles.length - 1;
        let moveIndex = 1;
        if (lastTileToMoveTo > lastTile) { diceRoll = diceRoll - (lastTileToMoveTo - lastTile);}
        while (moveIndex <= diceRoll) {
            const tileToMoveTo = tiles[moveIndex + this.tileNumber];
            await this.wait(this.moveTimeOut).then(() => this.moveToken(tileToMoveTo.offsetTop, tileToMoveTo.offsetLeft));
                if (tileToMoveTo.className === 'tile-throne' && !this.isComputerControlled) {
                    const messageModal = new Modal(tileToMoveTo.dataset.message, { label: 'OK' }); //throne 
                    await messageModal.answer(); }
            moveIndex++; }
        this.tileNumber = this.tileNumber + diceRoll; }

    async moveBackwards(penalty, tiles) {
        let lastTileToMoveTo = this.tileNumber - penalty;
        let moveIndex = this.tileNumber;
        while (moveIndex !== lastTileToMoveTo) {
            moveIndex--;
            const tileToMoveTo = tiles[moveIndex];
            await this.wait(this.moveTimeOut).then(() => this.moveToken(tileToMoveTo.offsetTop, tileToMoveTo.offsetLeft)); } 
        this.tileNumber = moveIndex; }

    async wait(miliseconds) { return new Promise(resolve => setTimeout(resolve, miliseconds)); } }

const board = document.querySelector('.board');
const tiles = Array.from(document.querySelectorAll('div[class^="tile"]')); //^ = class starting with
const firstTile = tiles[0];
const lastTileNumber = tiles.length - 1;
const lastTile = tiles[lastTileNumber];
const overview = document.querySelectorAll('.player-wrapper');
const diceBtn = document.querySelector('.dice-btn');
const playerLog = document.querySelector('#playerLog');
const opponentLog = document.querySelector('#opponentLog');
const playerData = fetchCards('player');
const opponentData = fetchCards('autoPlayer');
const player = new Avatar(playerData.name, playerData.id);
const autoPlayer = new Avatar(opponentData.name, opponentData.id, true);
let waitPenalty = 0;

createBoardGame();

function createBoardGame() {
    createAvatar(player);
    createAvatar(autoPlayer);
    diceBtn.addEventListener('click', onDiceRollClick);
    tiles.forEach((tile, index) => (tile.innerHTML = `
        <p title="${index}" class="tile-number">${index}</p>`));
    const firstTileTop = firstTile.offsetTop;
    const firstTileLeft = firstTile.offsetLeft;
    player.placeTokenOnBoard(board, firstTileTop, firstTileLeft);
    autoPlayer.placeTokenOnBoard(board, firstTileTop, firstTileLeft); }

function createAvatar(house) { 
    const htmlString = `
        <img title="${house.name}" src="styles/images/icons__${house.id}.svg">`;
    if (!house.isComputerControlled) { overview[0].insertAdjacentHTML('afterbegin', htmlString); } 
    else { overview[1].insertAdjacentHTML('afterbegin', htmlString); } }

function fetchCards(player) {
    const pattern = new RegExp(`${player}\\=[a-zA-z\\s']+`, 'g');
    const decodedUri = decodeURIComponent(window.location.search);
    const houseName = decodedUri.match(pattern)[0].split('=')[1];
    const houseFilename = houseName.replace(/\s/g, '');
    return { name: houseName, id: houseFilename }; }

function rollDice() {
    const randomNumber = Math.floor(Math.random() * 6 + 1);
    return randomNumber; }

async function onDiceRollClick() {
    diceBtn.disabled = true;
    if (autoPlayer.hasToWaitTurn && waitPenalty > 0) {
        await runTurn(player);
        diceBtn.disabled = false;
        waitPenalty--;
        if (!player.hasToWaitTurn) { return; }
        autoPlayer.hasToWaitTurn = false;
        diceBtn.disabled = true; } 
    else { await runTurn(player); }
    if (player.rolledSix && !player.hasToWaitTurn) {
        alert('You rolled a 6! You get another turn');
        console.log('6 rolled: bonus roll alert');
        diceBtn.disabled = false;
        return; }
    if (player.hasToWaitTurn && waitPenalty > 0) {
        while (waitPenalty > 0) {
            await runTurn(autoPlayer);
            waitPenalty--;
            if (autoPlayer.hasToWaitTurn) {
                player.hasToWaitTurn = false;
                break; } }
        player.hasToWaitTurn = false; }
    else { await runTurn(autoPlayer); }
    if (autoPlayer.rolledSix && !autoPlayer.hasToWaitTurn) {
        while (autoPlayer.rolledSix) { await runTurn(autoPlayer); } }
    diceBtn.disabled = false; }

async function runTurn(house) {
    const number = rollDice();
    house.rolledSix = number === 6;
    diceLog(house.isComputerControlled, number);
    await house.moveForwards(number, tiles);
    await sleep(600);
    if (house.tileNumber === lastTileNumber) { return sleep(500).then(() => endGame(!house.isComputerControlled)); }
    const didLandOntrapTile = tiles[house.tileNumber].className === 'tile-trap';
    if (didLandOntrapTile) { await applyPenalty(house); } }

async function applyPenalty(house) {
    const trapTile = tiles[house.tileNumber];
    let tileMessage = trapTile.dataset.message;
    let confirmBtn = { label: 'OK' };
    if (house.isComputerControlled) { confirmBtn.label = 'OK'; }
    const messageModal = new Modal(tileMessage, confirmBtn);
    const penaltyType = trapTile.dataset.type;
    const penalty = parseInt(trapTile.dataset.penalty);
    await messageModal.answer();
    if (penaltyType === 'wait') {
        waitPenalty = penalty + 1;
        house.hasToWaitTurn = true; } 
    else { await house.moveBackwards(penalty, tiles); } }

function sleep(miliseconds) { return new Promise(resolve => setTimeout(resolve, miliseconds)); }

async function endGame(final) { //move to winner/loser screen
    if (final) { window.location.assign('winner.html'); } 
    else { window.location.assign('loser.html'); } }