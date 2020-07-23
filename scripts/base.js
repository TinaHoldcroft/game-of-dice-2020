//display copyright in console log
console.log ('\u00A9 Game of Dice 2020')

//display date in local storage
var displayDate = new Date(); window.localStorage.setItem('Date', displayDate);

//log number of times page is refeshed in console and local storage
var refreshCounter = localStorage.getItem('Refresh Counter');
    if (refreshCounter === null) {
        refreshCounter = 0;
    } 
    else {
        refreshCounter ++;
    }

localStorage.setItem("Refresh Counter", refreshCounter);
console.log('Refresh Counter: ' + refreshCounter);

// removing from Local Storage:
//localStorage.removeItem('KEY');

// clear everything:
//localStorage.clear();