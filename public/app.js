$(document).ready(function() {
    $("#crime-filters").toggle();
    $("#city_filters").toggle();

    $('#toggleDivisions').val($(this).is(':checked'));

    $("#cityLevel").click(function() {
        $("#crime-filters:visible").toggle("medium");
        $("#macro-filters").toggle("medium");
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

    $("#toggleDivisions").switchButton({
        on_label: 'Political Ward Data',
        off_label: 'Census Tract Data',
        checked: true,
        width: 100,
        height: 30,
        button_width: 50
    });


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
            name: "OBJECTID",
            shapeDataSource: "./assets/Political_Wards.shp",
            databaseSource: "./assets/Political_Wards.dbf",
            opacity: 0.8,
            outlineThickness: 1,
            showTooltip: true,
            tooltipTemplate: "geoShapeTooltip"
        }]
    })

    $("#toggleDivisions").change(function() {
        if ($("#toggleDivisions").is(":checked")) {
            $("#map").igMap("option", "series", [{
                type: "geographicShape",
                name: "OBJECTID",
                shapeDataSource: "./assets/Political_Wards.shp",
                databaseSource: "./assets/Political_Wards.dbf",
                opacity: 0.8,
                outlineThickness: 1,
                showTooltip: true,
                tooltipTemplate: "geoShapeTooltip"
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

})




function cityToStreet() {
    // The function returns the product of p1 and p2
}