//sidepanel toggle
$('.unicode').click(function(toogle) {
    toogle.preventDefault();
    $(".panel-container").toggleClass("openPanel"); //add class
    console.log ('class added to panel-container')
});

//dropdown menu
$('#dropdown').click(function(dropdown) {
    dropdown.preventDefault();
    $("nav").toggleClass("showDropdown"); //add class
    console.log ('class added to nav')
});