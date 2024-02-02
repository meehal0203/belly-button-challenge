// let url = "https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json"
// d3.json(url).then(function(data) {}

// Use D3 to fetch and parse the JSON file
d3.json("samples.json").then(function (data) {
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
        .text(function (d) {
            return d;
        });

    // Initial plot
    // Display bar chart for the first sample
    plotBarChart(sampleValues, otuIds, otuLabels);
    // Display bubble chart for the first sample
    plotBubbleChart(otuIds, sampleValues, otuLabels);
    // Display metadata for the first sample
    displaySampleMetadata(data.metadata[0]);
    // plot gauge for first sample
    plotGaugeChart(data.metadata[0]);
    // Update plot when dropdown selection changes
    dropdown.on("change", function () {
        let selectedSample = dropdown.property("value");
        let selectedData = data.samples.find(sample => sample.id === selectedSample);
        let selectedMetadata = data.metadata.find(metadata => metadata.id === parseInt(selectedSample));

        // Update  with the selected data
        plotBarChart(selectedData.sample_values.slice(0, 10).reverse(),
            selectedData.otu_ids.slice(0, 10),
            selectedData.otu_labels.slice(0, 10));
        plotBubbleChart(selectedData.otu_ids, selectedData.sample_values, selectedData.otu_labels)
        // Display metadata for the selected sample
        displaySampleMetadata(selectedMetadata)
        plotGaugeChart(selectedMetadata.wfreq);
        ;
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
        text: otuLabels
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

function displaySampleMetadata(metadata) {
    // Select the metadata panel
    var metadataPanel = d3.select("#sample-metadata");

    // Clear existing metadata
    metadataPanel.html("");

    // Display metadata key-value pairs
    Object.entries(metadata).forEach(([key, value]) => {
        metadataPanel.append("p").text(`${key}: ${value}`);
    });
}

// Function to create/update the gauge chart
function plotGaugeChart(washingFrequency) {
    // Clear existing chart
    d3.select("#gauge").html("");

    // Create gauge chart
    let trace = {
        type: "indicator",
        mode: "gauge+number",
        value: washingFrequency,
        title: { text: "Weekly Washing Frequency" },
        gauge: {
            axis: { range: [0, 9] },
            steps: [
                { range: [0, 1], color: "#FFD700" },
                { range: [1, 2], color: "#FFD700" },
                { range: [2, 3], color: "#FFD700" },
                { range: [3, 4], color: "#FFD700" },
                { range: [4, 5], color: "#FFD700" },
                { range: [5, 6], color: "#FFD700" },
                { range: [6, 7], color: "#FF8C00" },
                { range: [7, 8], color: "#FF4500" },
                { range: [8, 9], color: "#FF0000" }
            ],
            threshold: {
                line: { color: "red", width: 4 },
                thickness: 0.75,
                value: washingFrequency
            }
        }
    };

    let layout = { width: 400, height: 300, margin: { t: 0, b: 0 } };
    let data = [trace];

    Plotly.newPlot('gauge', data, layout);
}

