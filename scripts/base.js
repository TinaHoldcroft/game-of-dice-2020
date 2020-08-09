console.log ('\u00A9 Game of Dice 2020') //display copyright in console log
var displayDate = new Date(); window.localStorage.setItem('Date', displayDate); //display date in local storage

var refreshCounter = localStorage.getItem('Refresh Counter');
    if (refreshCounter === null) {
        refreshCounter = 0; } 
    else { refreshCounter ++; }

localStorage.setItem("Refresh Counter", refreshCounter);
console.log('Refresh Counter: ' + refreshCounter);
//removing from Local Storage: localStorage.removeItem('KEY');
//clear everything: localStorage.clear();

//navigation menu (nav-bar)
$('.unicode').click(function() { //sidepanel toggle
    if($('.panel-container').hasClass("openPanel")) { //close
        $('.panel-container').removeClass('openPanel');
        console.log ('Toggle closed: class removed') }
    else { //open       
        $('.panel-container').addClass('openPanel');   
        console.log ('Toggle opened: class added to panel-container'); } });

$('#dropdown').click(function() { //dropdown menu
    if($('nav').hasClass("showDropdown")) { //close
        $('nav').removeClass('showDropdown');
        console.log ('Dropdown closed: class removed'); }
    else { //open           
        $('nav').addClass('showDropdown');   
        console.log ('Dropdown opened: class added to nav'); } });