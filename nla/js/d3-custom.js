/************
*************
DATA SOURCES
*************
************/
var NLA12_Condition_Estimates       = "data/NLA12_Condition_Estimates_20141209_KC.csv",
    NLA0712_Change_Estimates        = "data/NLA0712_Change_Estimates__20141205_KC.csv",
    NLA0712_Change_Estimates_TF     = "data/NLA0712_Change_Estimates__20141205_TF_KC.csv",
    Condition_Class_Categories      = "data/Condition_class_categories.csv",
    Metric_Categories_Subcategories = "data/Metric_category_and_subcategory.csv";

/************
*************
ALIASES - NLA12_Condition_Estimates
*************
************/
var nla12_ce_record     = "Record",
    nla12_ce_type       = "Type",
    nla12_ce_subpop     = "Subpopulation",
    nla12_ce_indic      = "Indicator",
    nla12_ce_metcat     = "Metric Category",
    nla12_ce_cat        = "Category",
    nla12_ce_nresp      = "NResp",
    nla12_ce_estp       = "Estimate.P",
    nla12_ce_stderp     = "StdError.P",
    nla12_ce_lcb95pctp  = "LCB95Pct.P",
    nla12_ce_ucb95pctp  = "UCB95Pct.P",
    nla12_ce_estu       = "Estimate.U",
    nla12_ce_stderu     = "StdError.U",
    nla12_ce_lcb95pctu  = "LCB95Pct.U",
    nla12_ce_ucb95pctu  = "UCB95Pct.U";

/************
*************
ALIASES - NLA0712_Change_Estimates
*************
************/
var nla0712_ce_record       = "Record",
    nla0712_ce_type         = "Type",
    nla0712_ce_subpop       = "Subpopulation",
    nla0712_ce_indic        = "Indicator",
    nla0712_ce_cat          = "Category",
    nla0712_ce_diffestp     = "DiffEst.P",
    nla0712_ce_stderp       = "StdError.P",
    nla0712_ce_lcb95pctp    = "LCB95Pct.P",
    nla0712_ce_ucb95pctp    = "UCB95Pct.P",
    nla0712_ce_diffestu     = "DiffEst.U",
    nla0712_ce_stderu       = "StdError.U",
    nla0712_ce_lcb95pctu    = "LCB95Pct.U",
    nla0712_ce_ucb95pctu    = "UCB95Pct.U",
    nla0712_ce_nresp1       = "NResp_1",
    nla0712_ce_estp1        = "Estimate.P_1",
    nla0712_ce_stderp1      = "StdError.P_1",
    nla0712_ce_lcb95pctp1   = "LCB95Pct.P_1",
    nla0712_ce_ucb95pctp1   = "UCB95Pct.P_1",
    nla0712_ce_estu1        = "Estimate.U_1",
    nla0712_ce_stderu1      = "StdError.U_1",
    nla0712_ce_lcb95pctu1   = "LCB95Pct.U_1",
    nla0712_ce_ucb95pctu1   = "UCB95Pct.U_1",
    nla0712_ce_nresp2       = "NResp_2",
    nla0712_ce_estp2        = "Estimate.P_2",
    nla0712_ce_stderp2      = "StdError.P_2",
    nla0712_ce_lcb95pctp2   = "LCB95Pct.P_2",
    nla0712_ce_ucb95pctp2   = "UCB95Pct.P_2",
    nla0712_ce_estu2        = "Estimate.U_2",
    nla0712_ce_stderu2      = "StdError.U_2",
    nla0712_ce_lcb95pctu2   = "LCB95Pct.U_2",
    nla0712_ce_ucb95pctu2   = "UCB95Pct.U_2",
    nla0712_ce_ub2_ub1      = "UB2-UB1",
    nla0712_ce_lb2_lb1      = "LB2-LB1";

/************
*************
ALIASES - Condition Class Categories
*************
************/
var ccc_grp     = "Indicator and Category (group)",
    ccc_ind_cat = "Indicator and Category",
    ccc_cat     = "Condition Class Cateogorization";

/************
*************
ALIASES - Metric Categories and Subcategories
*************
************/
var mcs_cat     = "Metric category (calc)",
    mcs_sub_cat = "Metric subcategory",
    mcs_indic   = "Indicator";

// Used to store class categories object and metric cats object
var cond_class_cats     = {},
    metric_cats         = {};


// Acquire condition classifications
d3.csv(Condition_Class_Categories, function(error, data) {
    // create an array of unique values from "Indicator and Category (group)"
    var grp =  d3.set(data.map(function(d) { return d[ccc_grp]; })).values();
    
    // for each key in grp array
    for (var k in grp){
            
        if (grp.hasOwnProperty(k)) {
            // create an empty array holder to store each "Indicator and Category" value
            var conditions = [];
            // create and array of objects for each data row that matches "Indicator and Category (group)"
            var match = data.filter(function(d){ 
              return d[ccc_cat] == grp[k]; 
            });

            // for each key in matched set, push the "Indicator and Category" value to the array
            for (key in match){
                if (match.hasOwnProperty(key)){
                    conditions.push(match[key][ccc_ind_cat]);
                }   
            }

            // assign the completed conditions array to the object with the key name as "Indicator and Category (group)"
            cond_class_cats[grp[k]] = conditions;
        }
    }
    // console.log(cond_class_cats["Highest Concern"]);
})

// Acquire metric categories and subcategories
d3.csv(Metric_Categories_Subcategories, function(error, data) {
    // create an array of unique values from "Indicator and Category (group)"
    var metricCat =  d3.set(data.map(function(d) { return d[mcs_cat]; })).values();
    var metricSubcat = d3.set(data.map(function(d) { return d[mcs_sub_cat]; })).values();
    // for each key in metricCat array
    for (var k in metricCat){

        if (metricCat.hasOwnProperty(k)) {

            metric_cats[metricCat[k]] = {};

            var match = data.filter(function(d){ 
              return d[mcs_cat] == metricCat[k]; 
            });

            for (var key in metricSubcat) {
                if (metricSubcat.hasOwnProperty(key)) {
                    // console.log(metricSubcat[key])
                    var indicator = []
                    match.forEach(function(d){
                        if (metricSubcat[key] == d[mcs_sub_cat]) {
                            indicator.push(d[mcs_indic]);
                            metric_cats[metricCat[k]][metricSubcat[key]] = indicator;
                        }
                    })
                }
            }
        }             
    }
    // console.log(metric_cats);
})


// USe jquery lettering to fix header kerning
/*$(document).ready(function() {
  $("#title-nw").lettering();
});*/

//Define default chart filters (updateHighestConcern)
var conditionCat = "Highest Concern",
    arr_type_subpop = "National--National"

//Define initial chart filters (size map)
var sizemapconditionCat = "Poor",
    subpop = "WSA9_Ecoregions"

/************
*************
DIMENSION CONTROLLERS
*************
************/

    //BULLET DIMENISIONS
  var bulletmargin = {top: 0, right: 40, bottom: 0, left: 240},
    bulletcontainer = 500,
    bulletwidth = 500 - bulletmargin.left - bulletmargin.right,
    bulletheight = 30 - bulletmargin.top - bulletmargin.bottom,
    //SLOPE DIMENISIONS
    slopemargin = {top: 10, right: 10, bottom: 10, left: 15},
    slopecontainer = 90,    
    slopewidth = 90 - slopemargin.left - slopemargin.right,
    slopeheight = 50 - slopemargin.top - slopemargin.bottom,
    //RANGE DIMENISIONS
    rangemargin = {top: 0, right: 15, bottom: 0, left: 15},
    rangecontainer = 175,
    rangewidth = 175 - rangemargin.left - rangemargin.right,
    rangeheight = 50 - rangemargin.top - rangemargin.bottom,
    //SIZE MAP DIMENSIONS
    sizemapmargin = {top: 0, right: 0, bottom: 0, left: 0},
    sizemapcontainer = 765,
    sizemapwidth = 765 - sizemapmargin.left - sizemapmargin.right,
    sizemapheight = 30 - sizemapmargin.top - sizemapmargin.bottom;


var bulletchart = d3.bullet()
    .width(bulletwidth)
    .height(bulletheight);

    
/************
*************
HIGHEST CONCERN (ANY REGION) CONTROLLERS
*************
************/
function updateHighestConcern(filter_result, filter_type_subpop) {  

  d3.csv(NLA12_Condition_Estimates, function(error, data) {  

    // define variables
    var duration = 250;

    /*************
    POPULATE DROPDOWNS
    *************/
    // create empty array to store unique dropdown filter value
    var arr_type_subpop = [];

    // for each concatenate type and subpop and push to empty array
    data.forEach(function(d){
      var newAgg = d[nla12_ce_type] + "--" + d[nla12_ce_subpop];
      arr_type_subpop.push(newAgg);
    })

    // Filter out unique array values
    arr_type_subpop = $.unique(arr_type_subpop);

    // populate the dropdown menu
    d3.select("#dropdown-ul-agg").selectAll("li")
        .data(arr_type_subpop)
      .enter().append("li")
        .attr("role","presentation")
      .insert("a")
        .attr("role","menuitem")
        .attr("tabindex","-1")
        .attr("href","#")
        .html(function(d){ return d; });

    /*************
    FILTER DATA
    *************/
    // split the passed argument filter_type_subpop into separate parts
    var type = filter_type_subpop.substring(0,filter_type_subpop.indexOf("--"));
    var subpop = filter_type_subpop.substring(filter_type_subpop.indexOf("--")+2);

    // filter the data to match the filter arguments
    data = data.filter(function(d) { 
        // create indicator_category by concatinating indicator and category (eg. 'Acidification_Good')
        var indicator_category = d[nla12_ce_indic] + "_" + d[nla12_ce_cat];
        
        // if the ind_cat is in the condition category (eg. 'Acidification_Good' is in 'Lowest Concern')
        // 
        if( $.inArray(indicator_category,cond_class_cats[conditionCat]) > -1 ) {  
            return ( type == d[nla12_ce_type] && subpop == d[nla12_ce_subpop] ); 
        }
    });

    var bulletData = d3.nest()
      .key(function(d) {return d[nla12_ce_metcat];})
      .sortKeys(d3.ascending)
      .sortValues(function(a,b) { return ((a.nla12_ce_indic > b.nla12_ce_indic) ? 1 : -1); } )
      .entries(data);
    // console.log(JSON.stringify(bulletData, null, 2));


    var bulletsvg = d3.select("#d3-bullet").selectAll("svg")
        .data(bulletData/*, function(d){ return d.values; }*/)
      .enter().append("svg")
        .attr("class", "bullet")
        .attr("width", bulletwidth + bulletmargin.left + bulletmargin.right)
        .attr("height", function(d){ return (d.values.length) * (bulletheight + bulletmargin.top + bulletmargin.bottom); })

    var bulletborder = bulletsvg.append("rect")
        .attr("class", "border")
        .attr("width",bulletcontainer)
        .attr("height", bulletheight + bulletmargin.top + bulletmargin.bottom)

    var bulletg = bulletsvg.append("g")
        .attr("class","bullet-container")
        .attr("transform", "translate(" + bulletmargin.left + "," + bulletmargin.top + ")")
        .call(bulletchart);

    var bullettitletype = bulletg.append("g")
        .style("text-anchor", "start")
        .attr("transform", "translate(-225," + bulletheight / 1.5 + ")")

    bullettitletype.append("text")
        .attr("class", "title metric")
        .text(function(d,i) { return d.values[i][nla12_ce_metcat].replace(/_/g," "); });    
    
    /*************/
    /** 
    /** Start CI Range Graphs
    /** 
    /*************/
    /*var rangesvg = d3.select("#d3-range").selectAll("svg")
        .data(data)
      .enter().append("svg")
        .attr("class", "range")
        .attr("width", rangecontainer)
        .attr("height", rangeheight + rangemargin.top + rangemargin.bottom)
      
    var rangeborder = rangesvg.append("rect",":last-child")
        .attr("class", "border")
        .attr("width",rangecontainer)
        .attr("height", rangeheight + rangemargin.top + rangemargin.bottom)
      
    var rangeG = rangesvg.append("g")
        .attr("transform", "translate(" + (rangemargin.left + rangemargin.right) + ",0)")
        .call(range);
        */
    /*************
    **************
    SPINNER HELPER
    **************
    *************/
    $(".spinner").removeClass("in").addClass("hidden");
    // $("#info-container-hc-2012-ar").addClass("in").removeClass("hidden");
    $("#chart-header").addClass("in").removeClass("hidden");
     $("#chart-container-hc-2012-ar").addClass("in").removeClass("hidden");
    
  });
}

/*************
**************
Start Slope Graphs
**************
*************/
function updateDash1Slope(filter_result, filter_type_subpop) {  

    d3.csv(NLA0712_Change_Estimates, function(error, data) {  

        /*************
        FILTER DATA
        *************/
        // split the passed argument filter_type_subpop into separate parts
        var type = filter_type_subpop.substring(0,filter_type_subpop.indexOf("--"));
        var subpop = filter_type_subpop.substring(filter_type_subpop.indexOf("--")+2);

        // filter the data to match the filter arguments
        data = data.filter(function(d) { 
            // create indicator_category by concatinating indicator and category (eg. 'Acidification_Good')
            var indicator_category = d[nla12_ce_indic] + "_" + d[nla12_ce_cat];
            
            // if the ind_cat is in the condition category (eg. 'Acidification_Good' is in 'Lowest Concern')
            // 
            if( $.inArray(indicator_category,cond_class_cats[conditionCat]) > -1 ) {  
                return ( type == d[nla12_ce_type] && subpop == d[nla12_ce_subpop] ); 
            }
        });

        var slopeData = d3.nest()
          .key(function(d) {return d[nla12_ce_metcat];})
          .sortKeys(d3.ascending)
          .sortValues(function(a,b) { return ((a.nla12_ce_indic > b.nla12_ce_indic) ? 1 : -1); } )
          .entries(data);
         
         console.log(JSON.stringify(bulletData, null, 2));


        var slopesvg = d3.select("#d3-slope").selectAll("svg")
            .data(data)
          .enter().append("svg")
            .attr("class", "slope")
            .attr("width", slopecontainer)
            .attr("height", slopeheight + slopemargin.top + slopemargin.bottom)

        var slopeborder = slopesvg.append("rect")
            .attr("class", "border")
            .attr("width",slopecontainer)
            .attr("height", slopeheight + slopemargin.top + slopemargin.bottom)
          
        var slopeG = slopesvg.append("g")
          .attr("transform", "translate(" + slopemargin.left + "," + slopemargin.top + ")")
          .call(slope);
    })
}

/************
*************
HIGHEST CONCERN (ANY REGION) CONTROLLERS
*************
************/

function updateSizeMap(filter_result, filterAgg) {  

  d3.selectAll('.sizemap-hr-title').remove();

  subpop = filterAgg;
  conditionCat = filter_result;

  d3.csv("data/2007_2012_Condition_Data.csv", function(error, data) {  

    // Define Super Aggregation Levels prior to filtering data - Used to populated Controls
    var supAggLevel =  d3.set(data.map(function(d) { return d[nla12_ce_type]; })).values();
    /*************
    **************
    DATA FILTER
    **************
    *************/
    data = data.filter(function(d){ 
      return ( d["Result Category"] == conditionCat && subpop == d[nla12_ce_type] ); 
    });

    var aggLevel =  d3.set(data.map(function(d) { return d[nla12_ce_subpop]; })).values();
    var metric = d3.set(data.map(function(d) { return d["Metric"]; })).values();

    // console.log(metric);

    // Populate Filters 
    d3.select("#dropdown-ul-agg").selectAll("li")
        .data(supAggLevel)
      .enter().append("li")
        .attr("role","presentation")
      .insert("a")
        .attr("role","menuitem")
        .attr("tabindex","-1")
        .attr("href","#")
        .html(function(d){ return d; });


    /*************
    **************
    START SIZE MAPS 
    **************
    *************/

    metric.forEach(function(d,i){
      metric = d;
      console.log(i)
      filterdata = data.filter(function(d,i){ return d["Metric"] == metric; })
       //console.log(filterdata);

        var sizemapHeader = d3.select("#d3-sizemap-hr").selectAll("div")
            .data(filterdata)
          .enter().append("div")
            .attr("class", "sizemap-hr-title ellipsis scroll_on_hover")
            // .html(function(d){ 
              // console.log(d[nla12_ce_subpop]); 
            // });
            .html(function(d){ console.log(d[nla12_ce_subpop]); return d[nla12_ce_subpop]; });

        var sizemapsvg = d3.select("#d3-sizemap")
            .append("svg")
            .attr("class", "sizemap")
            .attr("width", sizemapcontainer)
            .attr("height", sizemapheight + sizemapmargin.top + sizemapmargin.bottom)

        var sizemapborder = sizemapsvg.append("rect")
            .attr("class", "border")
            .attr("width",sizemapcontainer)
            .attr("height", sizemapheight + sizemapmargin.top + sizemapmargin.bottom)

        
        var sizemapg = sizemapsvg.selectAll(".sizemap-row")
              .data(filterdata)
            .enter().append("g")
              .attr("transform", function(d,i) { return "translate(" + ( 200 + ((sizemapheight+10) * i)) + ",0)"; })
              .attr("class","sizemap-row")
              .call(sizemap);

        var sizemaptitle = sizemapsvg.selectAll("g .sizemap-title")
                .data(filterdata)
              .enter().append("g")
                .style("text-anchor", "end")
                .attr("transform", "translate(190," + sizemapheight / 2 + ")")
                .attr("class","sizemap-title")

            sizemaptitle.append("text")
                .attr("class", "title")
                .text(function(d,i) { if (i==0){ return d["Metric"]; } } );

            sizemaptitle.append("text")
                .attr("class", "subtitle")
                .attr("dy", "1em")
                .text()
                .exit;
    })
  })
    /*************
    **************
    SPINNER HELPER
    **************
    *************/
    $(".spinner").removeClass("in").addClass("hidden");
    $("#chart-header").addClass("in").removeClass("hidden");
    // $("#container-hc-2012-sm .controls").addClass("in").removeClass("hidden");
};


updateHighestConcern(conditionCat,arr_type_subpop);
// updateDash1Slope(conditionCat,arr_type_subpop);
// updateSizeMap(sizemapconditionCat,agg);
