// https://github.com/joakimskoog/AnApiOfIceAndFire/blob/master/data/characters.json

fetch('https://anapioficeandfire.com/api/houses')
    .then(response => response.json())
    .then(data => console.log(data));