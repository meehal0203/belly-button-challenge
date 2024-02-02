// let url = https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json
//d3.json("url").then(function(data) {}

// Use D3 to fetch and parse the JSON file
d3.json("samples.json").then(function(data) {
    let sampleValues = data.samples[0].sample_values.slice(0, 10).reverse();
    console.log(sampleValues);
    let otuIds = data.samples[0].otu_ids;
    console.log(otuIds);
    let otuLabels = data.samples[0].otu_labels.slice(0, 10);
    console.log(otuLabels);

  // Create a dropdown menu
    let dropdown = d3.select("#selDataset");
    dropdown.selectAll("option")
      .data(data.names)
      .enter()
      .append("option")
      .text(function(d) {
          return d;
      });

  // Initial plot
    plotBarChart(sampleValues, otuIds, otuLabels);

  // Update plot when dropdown selection changes
    dropdown.on("change", function() {
    let selectedSample = dropdown.property("value");
    let selectedData = data.samples.find(sample => sample.id === selectedSample);

      // Update the bar chart with the selected data
      plotBarChart(selectedData.sample_values.slice(0, 10).reverse(),
          selectedData.otu_ids.slice(0, 10),
          selectedData.otu_labels.slice(0, 10));
    });
});

// Function to create/update the horizontal bar chart
function plotBarChart(sampleValues, otuIds, otuLabels) {
  // Clear existing chart
    d3.select("#bar").html("");

  // Create horizontal bar chart
    let trace = {
        x: sampleValues,
        y: otuIds.map(id => `OTU ${id}`),
        text: otuLabels,
        type: "bar",
        orientation: "h"
        };

    let layout = {
        title: "Top 10 OTUs",
        xaxis: { title: "Sample Values" },
        yaxis: { title: "OTU IDs" }
    };

    let data = [trace];

Plotly.newPlot("bar", data, layout);
};
// 3.create a bubble chart that displays each sample

function plotBubbleChart(otuIds, sampleValues, otuLabels) {
  // Create bubble chart
    let trace = {
    //x: data.samples[0].otuIds,
    //y: data.samples[0].sampleValues,
        x: otuIds,
        y: sampleValues,
        mode: 'markers',
        marker: {
        size: sampleValues,
        color: otuIds,
        },
        text: data.samples[0].otuLabels
    };

    let layout = {
        title: 'Bubble Chart - Sample Values vs OTU IDs',
        xaxis: { title: 'OTU IDs' },
        yaxis: { title: 'Sample Values' }
    };

    let data = [trace];

Plotly.newPlot('bubble', data, layout);
}

// 4.Display the sample metadata, i.e., an individual's demographic information.

 function getMetaData(metadata) {
    let metaDataPanel = d3.select("#sample-metadata");
    
 }