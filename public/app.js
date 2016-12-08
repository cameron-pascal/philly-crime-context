$(document).ready(function() {
    $("#crime-filters").toggle();
    $("#city_filters").toggle();
    $("#city_summary").toggle();
    $("#excelDataTable").hide();
   // $('#toggleDivisions').val($(this).is(':checked'));

    $("#cityLevel").click(function() {
        $("#crime-filters:visible").toggle("medium");
        $("#macro-filters").toggle("medium");
        $(".container").show();


    });
    
    $("#streetLevel").click(function() {
        $("#macro-filters:visible").toggle("medium");
        $(".container:visible").toggle();
        $("#crime-filters").toggle("medium");
    });

    
    // var mymap = L.map('mapid').setView([0.001009303876507106, -0.09], 13);
    
    // L.tileLayer('https://api.mapbox.com/styles/v1/mapbox/light-v9/tiles/256/{z}/{x}/{y}?access_token=pk.eyJ1IjoiZGVhbmtlaW5hbiIsImEiOiJjaXdlcHg4azkwOW10Mnpsazdpd3EyNGxjIn0.x_w9VUhJiUmtCbANfWxf-w', {
    //         attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://mapbox.com">Mapbox</a>',
    //         maxZoom: 18,
    //         accessToken: 'pk.eyJ1IjoiZGVhbmtlaW5hbiIsImEiOiJjaXdlcHg4azkwOW10Mnpsazdpd3EyNGxjIn0.x_w9VUhJiUmtCbANfWxf-w'
    // }).addTo(mymap);

    // var geojsonLayer = new L.GeoJSON.AJAX("./assets/Census_Tracts_2010.geojson");       
    // geojsonLayer.addTo(mymap);



    $( document ).ajaxStart(function() {
        $.blockUI({
            message:$('#domMessage'),
            css: { 
                border: 'none', 
                padding: '15px', 
                backgroundColor: '#000', 
                '-webkit-border-radius': '10px', 
                '-moz-border-radius': '10px', 
                opacity: .5, 
                color: '#fff',
                'font-size':'20px'
            } 
        })
    });
    
    $( document ).ajaxStop(function() {
        $.unblockUI();
    });



    $("#date").dateRangeSlider({
        bounds: {
            min: new Date(2006, 1, 1),
            max: new Date(2016, 1, 1)
        },

        formatter: function(val) {
            var days = val.getDate(),
                month = val.getMonth() + 1,
                year = val.getFullYear();
            return days + "/" + month + "/" + year;
        },
        range: {
            min: {
                days: 180
            },
            max: {
                days: 365
            }
        },
        step: {
            days: 1
        }
    });


    //Infragistics Map Control Initialization
    $("#map").igMap({
        width: "700px",
        height: "500px",
        windowRect: {
            height: 0.001009303876507106,
            left: 0.3504394459623032,
            top: 0.378069403305556,
            width: 0.001009303876507106
        },
        backgroundContent: {
            type: "bing",
            key: "AqgP6R7EV2h517KjgcNZp2WCZdZNPDITuGzatXHznPWNZkepsZT4iTrEPLTlf0Br",
            imagerySet: "Road"
        },
        series: [{
            type: "geographicShape",
            name: "censusTracts",
            shapeDataSource: "./assets/Census_Tracts_2010.shp",
            databaseSource: "./assets/Census_Tracts_2010.dbf",
            opacity: 0.8,
            outlineThickness: 1,
            showTooltip: true,
            tooltipTemplate: "geoShapeTooltip"
        }]
    });

    function ColorPickerByIndex(crimes, seriesName, mapSelector) {

        var _seriesName = seriesName;
        var _mapSelector = mapSelector;

        function interpolateColor(val) {
            var h = 100;

            if(val<39){
                 h=100;
            }
            else if(val<39){
                 h=90;
            }
            else if(val<78){
                 h=75;
            }
            else if(val<117){
                 h=70;
            }
            else if(val<156){
                 h=60;
            }
            else if(val<195){
                 h=55;
            }
            else if(val<234){
                 h=50;
            }
            else if(val<273){
                 h=40;
            }
            else if(val<312){
                 h=10;
            }
            else if(val<351){
                 h=5;
            }
            else if(val<390){
                 h=0;
            }

            var s = 82;
            var v = 92;

            var color = hsvToRgb(h, s, v);

            return rgbToHex(color[0], color[1], color[2]);
        }

                /**
        * HSV to RGB color conversion
        *
        * H runs from 0 to 360 degrees
        * S and V run from 0 to 100
        *
        * Ported from the excellent java algorithm by Eugene Vishnevsky at:
        * http://www.cs.rit.edu/~ncs/color/t_convert.html
        */
        function hsvToRgb(h, s, v) {
            var r, g, b;
            var i;
            var f, p, q, t;
            
            // Make sure our arguments stay in-range
            h = Math.max(0, Math.min(360, h));
            s = Math.max(0, Math.min(100, s));
            v = Math.max(0, Math.min(100, v));
            
            // We accept saturation and value arguments from 0 to 100 because that's
            // how Photoshop represents those values. Internally, however, the
            // saturation and value are calculated from a range of 0 to 1. We make
            // That conversion here.
            s /= 100;
            v /= 100;
            
            if(s == 0) {
                // Achromatic (grey)
                r = g = b = v;
                return [
                    Math.round(r * 255), 
                    Math.round(g * 255), 
                    Math.round(b * 255)
                ];
            }
            
            h /= 60; // sector 0 to 5
            i = Math.floor(h);
            f = h - i; // factorial part of h
            p = v * (1 - s);
            q = v * (1 - s * f);
            t = v * (1 - s * (1 - f));
            
            switch(i) {
                case 0:
                    r = v;
                    g = t;
                    b = p;
                    break;
            
                case 1:
                    r = q;
                    g = v;
                    b = p;
                    break;
            
                case 2:
                    r = p;
                    g = v;
                    b = t;
                    break;
            
                case 3:
                    r = p;
                    g = q;
                    b = v;
                    break;
            
                case 4:
                    r = t;
                    g = p;
                    b = v;
                    break;
            
                default: // case 5:
                    r = v;
                    g = p;
                    b = q;
            }
            
            return [
                Math.round(r * 255), 
                Math.round(g * 255), 
                Math.round(b * 255)
            ];
        }
        
        function rgbToHex(r, g, b) {
            return "#" + componentToHex(r) + componentToHex(g) + componentToHex(b);
        }

        function componentToHex(c) {
            var hex = c.toString(16);
            return hex.length == 1 ? "0" + hex : hex;
        }

        function getBrushDict(crimes) {
            var counts = {};
            var max = 1;
            var min = 1;
            var tracts = [];
            crimes.forEach(function(crime) {
                if (counts[crime.tractid]) {
                    counts[crime.tractid] = counts[crime.tractid] + 1
                } else {
                    counts[crime.tractid] = 1;
                }
                if (counts[crime.tractid] > max) {
                    max = counts[crime.tractid];
                } else if (counts[crime.tractid] < min) {
                    min = counts[crime.tractid];
                }
            });

            var dict = {};
            console.log(counts);
            keysSorted = Object.keys(counts).sort(function(a,b){return counts[a]-counts[b]});
            console.log(keysSorted);

            Object.keys(keysSorted).forEach(function(key) {
                    var brush = interpolateColor(key);
                    dict[keysSorted[key]] = brush;
            });

            return dict;
        }

        var brushes = getBrushDict(crimes);
        
        var noDataTracts = [ 
                { gid: 127 },
                { gid: 299 },
                { gid: 324 },
                { gid: 253 },
                { gid: 77 },
                { gid: 134 },
                { gid: 304 },
                { gid: 188 },
                { gid: 368 },
                { gid: 306 },
                { gid: 46 },
                { gid: 181 },
                { gid: 14 },
                { gid: 344 },
                { gid: 331 } 
            ];
        var noDataDict = {};
        noDataTracts.forEach(function(item) {
            noDataDict[item.gid] = true;
        });

        function initVisibleTracts() {
            var visibleDict = {};

            return visibleDict;
        }

        var visibleTracts = initVisibleTracts();
        var shouldShowAll = true;

        this.hasNoData = function(tractId) {
            return noDataDict[tractId] === true;
        }

        this.hideAllTracts = function() {
            visibleTracts = initVisibleTracts();
            shouldShowAll = false;
            $(_mapSelector).igMap("renderSeries", _seriesName, true);
        }

        this.showGivenTractsOnly = function(tractIds) {
            visibleTracts = initVisibleTracts();
            shouldShowAll = false;
            tractIds.forEach(function(tractId) {
                visibleTracts[tractId] = true;
            });
            $(_mapSelector).igMap("renderSeries", _seriesName, true);
        }

        this.showAllTracts = function() {
            shouldShowAll = true;
            $(_mapSelector).igMap("renderSeries", _seriesName, true);
        }

        this.getColorByIndex = function (val) {
            
            if (shouldShowAll === true || visibleTracts[val] === true) {
                    return brushes[val];
            }

            if (noDataDict[val]) {
                return 'black';
            }

            return "#ffffff";;
        }
    }

    function createStyleSelector(colorPicker) {
        return {
            selectStyle: function(shape) {
                var tract = shape.fields.item("OBJECTID");
                var brush = colorPicker.getColorByIndex(tract);

                return {
                    fill: brush
                };
            }
        }
    }

    var censusColorPickerByIndex;

    $('#commit-range').click(function() {
        if ($("#toggleDivisions").is(":checked")) {
            $("#toggleDivisions").switchButton("toggle");
        }
        var max = $("#date").dateRangeSlider("max");
        var min = $('#date').dateRangeSlider('min');
        $.get('/api/crimes', {
            start: parseInt(min.getTime() / 1000),
            end: parseInt(max.getTime() / 1000)
        }).done(function(data) {

            var cData = data.totalCrimes.rows[0];
            showSummary(parseInt(cData.nonviolent),parseInt(cData.violent),parseInt(cData.property),parseInt(cData.sexualcrimes),parseInt(cData.homicide));
            censusColorPickerByIndex = new ColorPickerByIndex(data.points.rows, 'censusTracts', '#map');
            var styleSelector = createStyleSelector(censusColorPickerByIndex);
            $("#map").igMap('option', 'series', [{
                name:"censusTracts",
                shapeStyleSelector: styleSelector
            }]);
        });
    })

    // REMOVE THIS CODE AND REENABLE POLITICAL WARDS.
    $("#political_filters:visible").toggle("medium");
    $("#city_filters").toggle("medium");
    /* REENABLE THIS CODE TO GET WARDS BACK
    $("#toggleDivisions").change(function() {
        if ($("#toggleDivisions").is(":checked")) {
            $("#map").igMap("option", "series", [{
                type: "geographicShape",
                name: "censusTracts",
                shapeDataSource: "./assets/wards.shp",
                databaseSource: "./assets/wards.dbf",
                opacity: 0.8,
                outlineThickness: 1,
                showTooltip: false
            }]);
            $("#city_filters:visible").toggle("medium");
            $("#political_filters").toggle("medium");

        } else {
            $("#map").igMap("option", "series", [{
                type: "geographicShape",
                name: "censusTracts",
                shapeDataSource: "./assets/Census_Tracts_2010.shp",
                databaseSource: "./assets/Census_Tracts_2010.dbf",
                opacity: 0.8,
                outlineThickness: 1,
                showTooltip: true,
                tooltipTemplate: "geoShapeTooltip"
            }]);
            $("#political_filters:visible").toggle("medium");
            $("#city_filters").toggle("medium");
        }
    });*/

    $("#center-map").click(function() {
        $("#map").igMap("option", "windowRect", {
            height: 0.001009303876507106,
            left: 0.3504394459623032,
            top: 0.378069403305556,
            width: 0.001009303876507106
        });
    });

    $("#macro-reset").click(function() {
        if(censusColorPickerByIndex) {
            censusColorPickerByIndex.showAllTracts();
        }

        $("input[name=age][value=0]").prop('checked', true); 
        $("input[name=ue][value=0]").prop('checked', true); 
        $("input[name=inc][value=0]").prop('checked', true);
        $("input[name=vac][value=0]").prop('checked', true);
        $("input[name=pov][value=0]").prop('checked', true);
    })

    $("#macro-go").click(function(){
        var age = $("input[name=age]:checked").val(); 
        var ue = $("input[name=ue]:checked").val(); 
        var inc = $("input[name=inc]:checked").val(); 
        var vac = $("input[name=vac]:checked").val(); 
        var pov = $("input[name=pov]:checked").val(); 
        $.get('/api/filter', {
             medianAge:age,
             unemployment:ue,
             medianIncome:inc,
             vacancyRate:vac,
             povertyRate:pov
        }).done(function(data){
            console.log(data.length);
            if(censusColorPickerByIndex) {
                var tracts = [];
                data.forEach(function(item) {
                    tracts.push(item.gid);
                });
                censusColorPickerByIndex.showGivenTractsOnly(tracts);
            }
        });
    });

    $("#micro-go").click(function(){
        var s1 = "";
        var s2 = "";
        var s3 = "";
        $('input:checkbox.ct').each(function(){
            var sThisVal = (this.checked ? "1" : "0");
            s1+=sThisVal;
            s1+="-";
        })
        if(!s1.includes("1")){
            s1 = "1-1-1-1-1"
        }
        
        $('input:checkbox.w').each(function(){
            var sThisVal = (this.checked ? "1" : "0");
            s2+=sThisVal;
            s2+="-";
        })
        if(!s2.includes("1")){
            s2 = "1-1-1-1"
        }
        
        $('input:checkbox.t').each(function(){
            var sThisVal = (this.checked ? "1" : "0");
            s3+=sThisVal;
            s3+="-";
        })
        if(!s3.includes("1")){
            s3 = "1-1"
        }
        console.log(s1,s2,s3);
        var max = $("#date").dateRangeSlider("max");
        var min = $('#date').dateRangeSlider('min');

        $.get('/api/getalldata', {
             startTime: parseInt(min.getTime() / 1000),
             endTime: parseInt(max.getTime() / 1000),
             GID:"1-2-3-4",
             crimeTypes:s1,
             crimeWeather:s2,
             crimeTime:s3
        }).done(function(data){
            if ($.fn.DataTable.isDataTable( '#excelDataTable' ) ) {
                    var table = $('#excelDataTable').DataTable();
                    table.destroy();
            }

            $('#excelDataTable').show();
            $('#excelDataTable').DataTable( {
            data: data,
            columns: [
                { data: 'dcnum' },
                { data: 'censusref' },
                { data: 'timeofcrime' },
                { data: 'crime' },
                { data: 'maxtemp' },
                { data: 'mintemp' }
            ],
            "order": [[ 1, "desc" ]],
                paging: true,
                destroy: true
            } );
        
            console.log(data);
            // buildHtmlTable(data);
        });
    });


    function numberWithCommas(x) {
        return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    }
    
    function showSummary(nonv, violent, propcrime, sexcrime, homicide){
        var sDate = new Date($("#date").dateRangeSlider("min"));
        var eDate = new Date($("#date").dateRangeSlider("max"));


        var crimes = nonv+violent+propcrime+sexcrime+homicide;
        console.log(crimes);
        // var crimeData = [
        //     { "CrimeType": "Homicide", "Incidents": homicide}, 
        //     { "CrimeType": "Sex Crime", "Incidents": sexcrime}, 
        //     { "CrimeType": "Non-Violent / Other", "Incidents": nonv},
        //     { "CrimeType": "Property Crime", "Incidents": propcrime}, 
        //     { "CrimeType": "Violent Crime", "Incidents": violent }
        // ];
        document.getElementById("start-date").innerHTML = sDate.toLocaleDateString();
        document.getElementById("end-date").innerHTML = eDate.toLocaleDateString();

        document.getElementById("total-city-crimes").innerHTML = numberWithCommas(crimes);
        document.getElementById("sum-hom").innerHTML = numberWithCommas(homicide);
        document.getElementById("sum-sex").innerHTML = numberWithCommas(sexcrime);
        document.getElementById("sum-vio").innerHTML = numberWithCommas(violent);
        document.getElementById("sum-nvi").innerHTML = numberWithCommas(nonv);
        document.getElementById("sum-pro").innerHTML = numberWithCommas(propcrime);
        $("#city_summary").show();
}

function getAgeVal() {
    var x = $("input[name=radio-choice-1]:checked").val(); 
    console.log(x);
}

function buildHtmlTable(myList) {
     var columns = addAllColumnHeaders(myList);
 
     for (var i = 0 ; i < myList.length ; i++) {
         var row$ = $('<tr/>');
         for (var colIndex = 0 ; colIndex < columns.length ; colIndex++) {
             var cellValue = myList[i][columns[colIndex]];
 
             if (cellValue == null) { cellValue = ""; }
 
             row$.append($('<td/>').html(cellValue));
         }
         $("#excelDataTable").append(row$);
     }
 }
 
 // Adds a header row to the table and returns the set of columns.
 // Need to do union of keys from all records as some records may not contain
 // all records
 function addAllColumnHeaders(myList)
 {
     var columnSet = [];
     var headerTr$ = $('<tr/>');
 
     for (var i = 0 ; i < myList.length ; i++) {
         var rowHash = myList[i];
         for (var key in rowHash) {
             if ($.inArray(key, columnSet) == -1){
                 columnSet.push(key);
                 headerTr$.append($('<th/>').html(key));
             }
         }
     }
     $("#excelDataTable").append(headerTr$);
 
     return columnSet;
 }

});



