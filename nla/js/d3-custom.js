var toggleChartViewStart = function(chartId) {
        $("#chart-header").addClass("hidden").removeClass("in");
        $("#chart-header-map").addClass("hidden").removeClass("in");
        $("#chart-" + chartId).addClass("hidden");
        $(".spinner").addClass("in").removeClass("hidden");
        $(".tab-pane").removeClass("in active");
        $(chartId).addClass("in active").removeClass("hidden"); 

        /*$("#chart-header").addClass("hidden");
        $("#chart-header-map").addClass("hidden");
        $(chartId + " #controls").addClass("hidden");
        */
    }

    var toggleChartViewEnd = function(chartId) {
        $(".spinner").removeClass("in").addClass("hidden");
        $("#chart-" + chartId).removeClass("hidden");
        $("#chart-header").removeClass("hidden").addClass("in");
        $("#chart-header-map").removeClass("hidden").addClass("in");
       /* $(chartId + " #controls").removeClass("hidden");
        $("#chart-" + chartId).removeClass("hidden");*/
    }

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

// Define default chart filters (updateHighestConcern)
var conditionCat = "Highest Concern",
    arr_type_subpop = "National--National"

// Define initial chart filters (size map)
var sizemap_filter_category = "Highest Concern",
    sizemap_filter_subpop = "WSA9_Ecoregions",
    sizemap_filter_indic = ["(All)"];

/************
*************
DIMENSION CONTROLLERS
*************
************/

    //BULLET DIMENISIONS
var bulletmargin        = { top: 0, right: 40, bottom: 0, left: 240 },
    bulletcontainer     = 500,
    bulletwidth         = 500 - bulletmargin.left - bulletmargin.right,
    bulletheight        = 30 - bulletmargin.top - bulletmargin.bottom,
    //SLOPE DIMENISIONS
    slopemargin         = {top: 4, right: 10, bottom: 4, left: 15},
    slopecontainer      = 90,    
    slopewidth          = 90 - slopemargin.left - slopemargin.right,
    slopeheight         = 30 - slopemargin.top - slopemargin.bottom,
    //RANGE DIMENISIONS
    rangemargin         = { top: 0, right: 15, bottom: 0, left: 15 },
    rangecontainer      = 175,
    rangewidth          = 175 - rangemargin.left - rangemargin.right,
    rangeheight         = 30 - rangemargin.top - rangemargin.bottom,
    //SIZE MAP DIMENSIONS
    sizemapmargin       = { top: 0, right: 0, bottom: 0, left: 0 },
    sizemapcontainer    = 765,
    sizemapwidth        = 765 - sizemapmargin.left - sizemapmargin.right,
    sizemapheight       = 30 - sizemapmargin.top - sizemapmargin.bottom;


var chart = d3.charts.chart();

    
/************
*************
HIGHEST CONCERN (ANY REGION) CONTROLLERS
*************
************/
function updateHighestConcern(filter_category, filter_subpop) {

    toggleChartViewStart("#container-hc-2012-ar");

    d3.csv(NLA12_Condition_Estimates, function(error, data) {  

        var cond_est_data = data,
            duration = 250;

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
        // split the passed argument filter_subpop into separate parts
        var type = filter_subpop.substring(0,filter_subpop.indexOf("--"));
        var subpop = filter_subpop.substring(filter_subpop.indexOf("--")+2);

        // filter the data to match the filter arguments
        cond_est_data = cond_est_data.filter(function(d) { 
            // create indicator_category by concatinating indicator and category (eg. 'Acidification_Good')
            var indicator_category = d[nla12_ce_indic] + "_" + d[nla12_ce_cat];
            
            // if the ind_cat is in the condition category (eg. 'Acidification_Good' is in 'Lowest Concern')
            // 
            if( $.inArray(indicator_category,cond_class_cats[conditionCat]) > -1 ) {  
                return ( type == d[nla12_ce_type] && subpop == d[nla12_ce_subpop] ); 
            }
        });

        // Select the correct map to display
        $("#map-image").attr("src","img/map-" + type + ".png")

        /*************
        ADD CHANGE ESTIMATE DATA
        *************/
        // create global to store change estimate data
        var ce_data;
        var final_data;

        // pull in change estimate data
        d3.csv(NLA0712_Change_Estimates, function(error, data) {  
            // assign locally to global variable
            change_est_data = data;

            cond_est_data.forEach(function(d,i){
                cond_d = d;
                // console.log(cond_d)
                // set variable to match
                var cond_type    = d.Type,
                    cond_subpop  = d.Subpopulation,
                    cond_indic   = d.Indicator,
                    cond_cat     = d.Category;

                // for each of the change element data object
                change_est_data.forEach(function(d,k){
                    ce_d = d;
                    // console.log(ce_d.Type, cond_type)

                    if (ce_d.Type == cond_type && ce_d.Subpopulation == cond_subpop && ce_d.Indicator == cond_indic && ce_d.Category == cond_cat) {
                        // console.log(ce_d)
                        var estp1           = ce_d[nla0712_ce_estp1],
                            estp2           = ce_d[nla0712_ce_estp2],
                            difestp         = ce_d[nla0712_ce_diffestp],
                            ucb95pctp2      = ce_d[nla0712_ce_ucb95pctp2],
                            ucb95pctp1      = ce_d[nla0712_ce_ucb95pctp1],
                            lcb95pctp2      = ce_d[nla0712_ce_lcb95pctp2],
                            lcb95pctp1      = ce_d[nla0712_ce_lcb95pctp1],
                            lcb95pctu2      = ce_d[nla0712_ce_lcb95pctu2];

                            cond_d[nla0712_ce_estp1]        = estp1;
                            cond_d[nla0712_ce_estp2]        = estp2;
                            cond_d[nla0712_ce_diffestp]     = difestp;
                            cond_d[nla0712_ce_ucb95pctp2]   = ucb95pctp2;
                            cond_d[nla0712_ce_ucb95pctp1]   = ucb95pctp1;
                            cond_d[nla0712_ce_lcb95pctp2]   = lcb95pctp2;
                            cond_d[nla0712_ce_lcb95pctp1]   = lcb95pctp1;
                            cond_d[nla0712_ce_lcb95pctu2]   = lcb95pctu2;
                    }
                
                })

            }) // End cond_est_data.forEach

            /*************
            CREATE NESTED DATA STRUCTURE
            *************/
            var final_data = d3.nest()
                  .key(function(d) {return d[nla12_ce_metcat];})
                  .sortKeys(d3.ascending)
                  .sortValues(function(a,b) { return ((a.nla12_ce_indic > b.nla12_ce_indic) ? 1 : -1); } )
                  .entries(cond_est_data);
                // console.log(JSON.stringify(final_data,null,2));
            
            /*************
            BEGIN TO BULID SVG FRAMEWORK
            *************/
            // Draw the bullet chart containers
            var bulletsvg = d3.select("#d3-bullet").selectAll("svg")
                    .data(final_data)
                .enter().append("svg")
                    .attr("class","bullet")
                    .attr("data-loc",function(d,i){ return i; })
                    .attr("width", bulletwidth + bulletmargin.left + bulletmargin.right)
                    .attr("height", function(d){ return (d.values.length) * (bulletheight + bulletmargin.top + bulletmargin.bottom); })

            var bulletg = bulletsvg.append("g")
                    .attr("class","bullet-container")
                    .attr("transform", "translate(" + bulletmargin.left + "," + bulletmargin.top + ")")
                    .call(chart);

            var bullettitletype = bulletg.append("g")
                    .style("text-anchor", "start")
                    .attr("transform", "translate(-225," + bulletheight / 1.5 + ")")

            bullettitletype.append("text")
                    .attr("class", "title metric")
                    .text(function(d,i) { return d.values[i][nla12_ce_metcat].replace(/_/g," "); });  

            // Draw the slope chart containers
            var slopesvg = d3.select("#d3-slope").selectAll("svg")
                    .data(final_data)
                .enter().append("svg")
                    .attr("class", "slope")
                    .attr("data-loc",function(d,i){ return i; })
                    .attr("width", slopecontainer)
                    .attr("height", function(d){ return (d.values.length) * (slopeheight + slopemargin.top + slopemargin.bottom); })
              
            var slopeG = slopesvg.append("g")
                    .attr("transform", "translate(" + slopemargin.left + "," + slopemargin.top + ")")
                    .call(slope); 

            var rangesvg = d3.select("#d3-range").selectAll("svg")
                    .data(final_data)
                  .enter().append("svg")
                    .attr("class", "range")
                    .attr("data-loc",function(d,i){ return i; })
                    .attr("width", rangecontainer)
                    .attr("height", function(d){ return (d.values.length) * (rangeheight + rangemargin.top + rangemargin.bottom); })
                  
            var rangeborder = rangesvg.append("rect",":last-child")
                    .attr("class", "border")
                    .attr("width",rangecontainer)
                    .attr("height", rangeheight + rangemargin.top + rangemargin.bottom)
                  
            var rangeG = rangesvg.append("g")
                    .attr("transform", "translate(" + (rangemargin.left + rangemargin.right) + ",0)")
                    .call(range); 

        }) // End d3.csv(NLA0712_Change_Estimates, function(error, data)

        toggleChartViewEnd("#container-hc-2012-ar");
    
    });
}

/*function updateSizeMapFilterIndic(indicator) {

    var sizemap_filter_subpop = $("#dropdown-type-sizemap").text().trim(),
        sizemap_filter_category = "Highest Concern",
        sizemap_filter_indic = indicator;

        console.log(sizemap_filter_category, sizemap_filter_subpop, sizemap_filter_indic);

    $("#dropdown-indic-sizemap").text($(this).text());
    $("#hc-ar-agg").text($(this).text());

    d3.selectAll('svg').remove();
    d3.selectAll('.d3-tip').remove();
    
    updateSizeMap( sizemap_filter_category, sizemap_filter_subpop, sizemap_filter_indic);

};*/

/************
*************
SIZE MAP
*************
************/
function updateSizeMap(sizemap_filter_category, sizemap_filter_subpop, sizemap_filter_indic) {

console.log(sizemap_filter_category,"  ||  ", sizemap_filter_subpop,"  ||  ", sizemap_filter_indic);    

    toggleChartViewStart("#container-hc-2012-sm");

    d3.csv(NLA12_Condition_Estimates, function(error, data) {  

        var cond_est_data = data,
            duration = 250;

        /*************
        POPULATE DROPDOWNS
        *************/

        // Define Super Aggregation Levels prior to filtering data - Used to populated Controls
        var arr_type =  d3.set(data.map(function(d) { return d[nla12_ce_type]; })).values();
        var arr_indic =  d3.set(data.map(function(d) { return d[nla12_ce_indic]; })).values();
        arr_indic.unshift("(All)");
        // console.log(arr_indic);
        
        // populate the type dropdown menu
        d3.select("#dropdown-ul-type-sizemap").selectAll("li")
            .data(arr_type)
          .enter().append("li")
            .attr("role","presentation")
          .insert("a")
            .attr("role","menuitem")
            .attr("tabindex","-1")
            .attr("href","#")
            .html(function(d){ return d; });

        // populate the type dropdown menu
        sizemap_indic_select = d3.select("#dropdown-indic-sizemap").selectAll("option")
                .data(arr_indic, function(d){ return d; })

        sizemap_indic_select.enter()
                .append("option")

        sizemap_indic_select
            .attr("value",function(d){ return d; })
            .html(function(d){ return d; });

        // SIZE MAP MULTI-SELECT INDICATOR FILTER 
        $('#dropdown-indic-sizemap').multiselect({
            onChange: function(option, checked, select) {
                var indicator = $(option).val();
                updateSizeMapFilterIndic(indicator);
            },
            buttonText: function(options, select) {
                console.log(options.length);
                if (options.length === 0) {
                    return 'None Selected';
                }
                else if (options.length > 1) {
                    return 'Multiple Selected';
                } else {
                    var labels = [];
                    options.each(function() {
                    if ($(this).attr('label') !== undefined) {
                        labels.push($(this).attr('label'));
                    } else {
                        labels.push($(this).html());
                    }
                });
                    return labels.join(', ') + '';
                }
            }
        });

        /*************
        **************
        DATA FILTER
        **************
        *************/
        // split the passed argument filter_subpop into separate parts
        var type    = sizemap_filter_subpop.substring(0,sizemap_filter_subpop.indexOf("--")),
            subpop  = sizemap_filter_subpop.substring(sizemap_filter_subpop.indexOf("--")+2);

        // filter the data to match the filter arguments
        cond_est_data = cond_est_data.filter(function(d) { 
            // create indicator_category by concatinating indicator and category (eg. 'Acidification_Good')
            var indicator_category = d[nla12_ce_indic] + "_" + d[nla12_ce_cat];

            // if the ind_cat is in the condition category (eg. 'Acidification_Good' is in 'Lowest Concern')
            if( $.inArray(indicator_category,cond_class_cats[conditionCat]) > -1 ) {  
                if ( sizemap_filter_indic == "(All)" ) {
                    return ( sizemap_filter_subpop == d[nla12_ce_type] ); 
                } else if ( sizemap_filter_indic !== "(All)" ) {
                    return sizemap_filter_subpop == d[nla12_ce_type]  && sizemap_filter_indic == d[nla12_ce_indic] ; 
                }
            }
        });

        // Nest the data
        var final_data = d3.nest()
                  .key(function(d) {return d[nla12_ce_metcat];})
                  .sortKeys(d3.ascending)
                  .key(function(d) {return d[nla12_ce_indic];})
                  .sortValues(function(a,b) { return ((a.nla12_ce_subpop > b.nla12_ce_subpop) ? 1 : -1); } )
                  .entries(cond_est_data);
                // console.log(JSON.stringify(final_data,null,2));
                // console.log("Final Data:",final_data);


        var arr_subpop_unique = [],
            arr_indic_unique = [];

        var subpopUnique =  d3.set(final_data.map(function(d) { 
            d.values.forEach(function(d,i){
                d.values.forEach(function(d,i){
                    arr_subpop_unique.push(d[nla12_ce_subpop]);
                })
            })
        })).values();

        arr_subpop_unique = $.unique(arr_subpop_unique);
        
        /*************
        **************
        START SIZE MAPS 
        **************
        *************/
        var sizemapHeader = d3.select("#d3-sizemap-hr").selectAll("div")
          .data(arr_subpop_unique)

        sizemapHeader
            .enter()
          .append("div")
            .attr("class", "sizemap-hr-title ellipsis scroll_on_hover")

        sizemapHeader
            .html(function(d,i){ return d; });

        sizemapHeader
            .exit().remove();

        var sizemapsvg = d3.select("#d3-sizemap").selectAll("svg")
                .data(final_data)
            
        sizemapsvg.enter().append("svg")
                .attr("class", "sizemap")
                .attr("data-loc",function(d,i){ return i; })

        sizemapsvg
                .attr("width", sizemapcontainer)
                .attr("height", function(d,i){ return sizemapheight * (d.values.length) })
        
        var sizemapg = sizemapsvg.append("g")
              .attr("transform", function(d,i) { return "translate(200,0)"; })
              .attr("class","sizemap-row")
              .call(sizemap);

        var sizemaptitle = sizemapg.append("g")
                .style("text-anchor", "end")
                .attr("transform", "translate(-125," + sizemapheight / 1.5 + ")")
                .attr("class","sizemap-title")

        sizemaptitle.append("text")
                .attr("class", "title metric")
                .text(function(d,i) { return d["key"]; } );
        })

    toggleChartViewEnd("#container-hc-2012-sm");
};


// updateHighestConcern(conditionCat,arr_type_subpop);
updateSizeMap(sizemap_filter_category, sizemap_filter_subpop, sizemap_filter_indic);
