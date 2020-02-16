import React from 'react';
import * as am4core from "@amcharts/amcharts4/core";
import * as am4maps from "@amcharts/amcharts4/maps";
import am4geodata_bulgariaHigh from "@amcharts/amcharts4-geodata/bulgariaHigh";
import am4themes_animated from "@amcharts/amcharts4/themes/animated";
import locations from './locations';
import areas from './areas';

/* Chart code */
// Themes begin
am4core.useTheme(am4themes_animated);
// Themes end

class Index extends React.Component {
    componentDidMount() {
        /**
         * Define SVG path for target icon
         */
        const targetSVG = "M9,0C4.029,0,0,4.029,0,9s4.029,9,9,9s9-4.029,9-9S13.971,0,9,0z M9,15.93 c-3.83," +
            "0-6.93-3.1-6.93-6.93S5.17,2.07,9,2.07s6.93,3.1,6.93,6.93S12.83,15.93,9,15.93 M12.5,9c0,1.933-1.567," +
            "3.5-3.5,3.5S5.5,10.933,5.5,9S7.067,5.5,9,5.5 S12.5,7.067,12.5,9z";

// Create map instance
        const chart = am4core.create("chartdiv", am4maps.MapChart);

// Set map definition
        chart.geodata = am4geodata_bulgariaHigh;

// Set projection
        chart.projection = new am4maps.projections.Miller();

// Disabling pan
        chart.seriesContainer.draggable = false;
        chart.seriesContainer.resizable = false;

// Disabling zoom
        chart.maxZoomLevel = 1;

// Create map polygon series
        let polygonSeries = chart.series.push(new am4maps.MapPolygonSeries());

// Exclude Antarctica
        polygonSeries.exclude = ["AQ"];

// Make map load polygon (like country names) data from GeoJSON
        polygonSeries.useGeodata = true;
        polygonSeries.data = areas;

// Configure series
        let polygonTemplate = polygonSeries.mapPolygons.template;
        polygonTemplate.strokeOpacity = 0.5;
        polygonTemplate.nonScalingStroke = true;
        polygonTemplate.tooltipText = "{name}";

// load url
        polygonTemplate.propertyFields.url = "url";
        polygonTemplate.url = "/go/cities?region_id={id.urlEncode()}";

// Hover state of regions
        var hs = polygonTemplate.states.create("hover");
        hs.properties.fill = am4core.color("#367B25");
        hs.properties.stroke = am4core.color("#FFDE00");
        hs.properties.strokeWidth = 3;

// create locations markers
        let imageSeries = chart.series.push(new am4maps.MapImageSeries());

// define template
        let imageSeriesTemplate = imageSeries.mapImages.template;
        let circle = imageSeriesTemplate.createChild(am4core.Sprite);
        circle.scale = 0.6;
        circle.fill = new am4core.InterfaceColorSet().getFor("alternativeBackground");
        circle.path = targetSVG;
// what about scale...

// set property fields
        imageSeriesTemplate.propertyFields.latitude = "latitude";
        imageSeriesTemplate.propertyFields.longitude = "longitude";

        imageSeriesTemplate.horizontalCenter = "middle";
        imageSeriesTemplate.verticalCenter = "middle";
        imageSeriesTemplate.align = "center";
        imageSeriesTemplate.valign = "middle";
        imageSeriesTemplate.width = 12;
        imageSeriesTemplate.height = 12;
        imageSeriesTemplate.nonScaling = true;
        imageSeriesTemplate.tooltipText = "{title}";
        imageSeriesTemplate.fill = am4core.color("#00b4a9");
        imageSeriesTemplate.background.fillOpacity = 0.1;
        imageSeriesTemplate.background.fill = am4core.color("#ffffff");
        imageSeriesTemplate.setStateOnChildren = true;
        imageSeriesTemplate.states.create("hover");

// clickable event
        imageSeriesTemplate.events.on("hit", function(ev) {
            var data = ev.target.dataItem.dataContext;
            var info = document.getElementById("info");
            info.innerHTML = "<h3>" + data.title + " (" + data.latitude + ", " + data.longitude + ")</h3>";
            if (data.description) {
                info.innerHTML += data.description;
            }
            else {
                info.innerHTML += "<i>No description provided.</i>"
            }
        });

        imageSeries.data = locations;

        this.chart = chart;
    }

    componentWillUnmount() {
        if (this.chart) {
            this.chart.dispose();
        }
    }

    render() {
        return (
            <div>
                <div id="chartdiv" style={{width: "100%", height: "60vh"}}/>
                <div id="info" style={{width: "100%", height: "10vh"}}/>
            </div>
        );
    }
}

export default Index;