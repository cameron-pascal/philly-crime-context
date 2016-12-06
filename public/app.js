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
    });

    function ColorPickerByIndex(crimes) {

        function interpolateColor(min, max, val) {
            var normalizedVal = 0;
            
            if ((max - min) > 0) {
                var normalizedVal = (val - min) / (max - min);
            }

            var h = normalizedVal * 0.4;
            var s = 0.9;
            var v = 0.9;

            var color = hsvToRgb(h, s, v);

            return rgbToHex(color.r, color.g, color.b);
        }

        function componentToHex(c) {
            var hex = c.toString(16);
            return hex.length == 1 ? "0" + hex : hex;
        }

        function rgbToHex(r, g, b) {
            return "#" + componentToHex(r) + componentToHex(g) + componentToHex(b);
        }

        function hsvToRgb(h, s, v) {
            var r, g, b, i, f, p, q, t;
            if (arguments.length === 1) {
                s = h.s, v = h.v, h = h.h;
            }
            i = Math.floor(h * 6);
            f = h * 6 - i;
            p = v * (1 - s);
            q = v * (1 - f * s);
            t = v * (1 - (1 - f) * s);
            switch (i % 6) {
                case 0: r = v, g = t, b = p; break;
                case 1: r = q, g = v, b = p; break;
                case 2: r = p, g = v, b = t; break;
                case 3: r = p, g = q, b = v; break;
                case 4: r = t, g = p, b = v; break;
                case 5: r = v, g = p, b = q; break;
            }
            return {
                r: Math.round(r * 255),
                g: Math.round(g * 255),
                b: Math.round(b * 255)
            };
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

            crimes.forEach(function(crime) {
                var count = counts[crime.tractid];
                var brush = interpolateColor(min, max, count);
                dict[crime.tractid] = brush;
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
        var bounds = $('#date').dateRangeSlider('option', 'bounds');
        $.get('/crimes.json', {
            start: parseInt(bounds.min.getTime() / 1000),
            end: parseInt(bounds.max.getTime() / 1000)
        }).done(function(data) {
            var series = $("#map").igMap('option', 'series');
            var colorPicker = new ColorPickerByIndex(data);
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