$(document).ready(function(){
    // Scroll text with overflow
    $(document).on('mouseover','.scroll_on_hover',function() {
        $(this).removeClass("ellipsis");
        var maxscroll = $(this).width();
        var speed = maxscroll * 50;
        $(this).animate({
            scrollLeft: maxscroll + 80
        }, speed, "linear");
    });

    $(document).on('mouseout','.scroll_on_hover',function() {
        $(this).stop();
        $(this).addClass("ellipsis");
        $(this).animate({
            scrollLeft: 0
        }, 'slow');
    });

})

/************
*************
OPTION CONTROLLERS
*************
************/
// Highest Concern Controls
$(document).on('click', '#li-hc-2012-ar', function () {
  // console.log("Inside Click Highest Concern")
    // $("#dropdown-super-agg").text($(this).text());
    // var concatAgg = $(this).text();
    d3.selectAll('svg').remove();
    d3.selectAll('.d3-tip').remove();
    $(".spinner").addClass("in").removeClass("hidden");
    //$("#chart-container-hc-2012-sm").addClass("in").removeClass("hidden");
    //$("#container-hc-2012-sm .controls").addClass("in").removeClass("hidden");
    updateHighestConcern(conditionCat,concatAgg);
});

$(document).on('click', '#dropdown-ul-agg li a', function () {
    $("#dropdown-agg").text($(this).text());
    $("#hc-ar-agg").text($(this).text());
    var concatAgg = $(this).text();
    d3.selectAll('svg').remove();
    d3.selectAll('.d3-tip').remove();
    updateHighestConcern(conditionCat,concatAgg);
});

/*// Size Map Controls
$(document).on('click', '#li-hc-2012-sm', function () {
  // console.log("Inside Click Size Map")
    // $("#dropdown-super-agg").text($(this).text());
    // var concatAgg = $(this).text();
    d3.selectAll('svg').remove();
    d3.selectAll('.d3-tip').remove();
    updateSizeMap(sizemapconditionCat,agg);
});

$(document).on('click', '#dropdown-ul-agg li a', function () {
    $("#dropdown-agg").text($(this).text());
    $("#hc-sm-agg").text($(this).text());
    var agg = $(this).text();
    d3.selectAll('svg').remove();
    d3.selectAll('.d3-tip').remove();
    updateSizeMap(sizemapconditionCat,agg);
});*/

/************
*************
PRESENTATION CONTROLLERS
*************
************/

//Toggle bullet label visibility
$("#button-toggle-labels").on("click", function(el){
  var toggleBut = $("#button-toggle-labels"),
      labels = $(".label-ul-bounds text");
  
  if(!toggleBut.hasClass("toggle-on")){
    toggleBut.addClass("toggle-on")
    $(labels).attr("class","active");
  } else if(toggleBut.hasClass("toggle-on")) {
    toggleBut.removeClass("toggle-on")
    $(labels).attr("class","inactive");
  }
})