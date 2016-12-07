$(document).ready(function() {
    $("#crime-filters").toggle();
    $("#city_filters").toggle();
    $("#city_summary").toggle();

    $('#toggleDivisions').val($(this).is(':checked'));

    $("#cityLevel").click(function() {
        $("#crime-filters:visible").toggle("medium");
        $("#macro-filters").toggle("medium");
    });
    


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

    $("#streetLevel").click(function() {
        $("#macro-filters:visible").toggle("medium");
        $("#crime-filters").toggle("medium");
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
        /*useTiledZooming: true,*/
        // defaultInteraction: "none",
        // zoomable: "0.5",
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
            name: "politicalWards",
            shapeDataSource: "./assets/Political_Wards.shp",
            databaseSource: "./assets/wards.dbf",
            opacity: 0.8,
            outlineThickness: 1,
            showTooltip: false,
            tooltipTemplate: "geoShapeTooltip"
            // shapeStyleSelector: {
            //     selectStyle: function (s, o) {
            //         return {
            //             fill: "blue",
            //             stroke: "gray"
            //         };
            //     }
            // }
        }]
    });

    function ColorPickerByIndex(crimes) {

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

        this.getColorByIndex = function (val) {
            return brushes[val];
        }
    }

    function createStyleSelector(colorPicker) {
        return {
            selectStyle: function(shape) {
                var tract = shape.fields.item("OBJECTID");
                var brush = colorPicker.getColorByIndex(tract);
                return {
                    fill: brush
                }
            }
        }
    }

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
            
            var series = $("#map").igMap('option', 'series');
            var colorPicker = new ColorPickerByIndex(data.points.rows);
            var styleSelector = createStyleSelector(colorPicker);
            $("#map").igMap('option', 'series', [{
                name:"OBJECTID",
                shapeStyleSelector: styleSelector
            }]);
        });
    })

    $("#toggleDivisions").switchButton({
        on_label: 'Political Ward Data',
        off_label: 'Census Tract Data',
        checked: true,
        width: 100,
        height: 30,
        button_width: 50
    });

    $("#toggleDivisions").change(function() {
        if ($("#toggleDivisions").is(":checked")) {
            $("#map").igMap("option", "series", [{
                type: "geographicShape",
                name: "OBJECTID",
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
                name: "OBJECTID",
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
    });

    $("#center-map").click(function() {
        $("#map").igMap("option", "windowRect", {
            height: 0.001009303876507106,
            left: 0.3504394459623032,
            top: 0.378069403305556,
            width: 0.001009303876507106
        });
    });

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
            console.log(data);
        });
    });

    $("#micro-go").click(function(){
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
            console.log(data);
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

})


