//sidepanel toggle
$('.unicode').click(function() {
    if($('.panel-container').hasClass("openPanel")) { //close
        $('.panel-container').removeClass('openPanel');
        console.log ('Toggle closed: class removed')
    }
    else { //open       
        $('.panel-container').addClass('openPanel');   
        console.log ('Toggle opened: class added to panel-container');          
}});

//dropdown menu
$('#dropdown').click(function() {
    if($('nav').hasClass("showDropdown")) { //close
        $('nav').removeClass('showDropdown');
        console.log ('Dropdown closed: class removed');
    }
    else { //open           
        $('nav').addClass('showDropdown');   
        console.log ('Dropdown opened: class added to nav');          
}});

//play again
const playAgainButton = document.querySelector('#play-again-button');
playAgainButton.addEventListener('click', () => history.back()); //remember players and go back to game