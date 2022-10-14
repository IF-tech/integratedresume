<template>
    <div>
        <svg id="chart"></svg>
    </div>
</template>

<script>
import * as d3 from 'd3'
export default {
    name: 'IntegratedResumeVueAmplifyDataViz',

    data() {
        return {
            dataset: [
  {
    "tool_name": "JAVASCRIPT",
    "id": 1,
    "size_score": 85,
    "group": "development",
    "start_year": 2017
  },
  {
    "tool_name": "HTML",
    "id": 2,
    "size_score": 30,
    "group": "design",
    "start_year": 2015
  },
  {
    "tool_name": "CSS",
    "id": 3,
    "size_score": 20,
    "group": "design",
    "start_year": 2015
  },
  {
    "tool_name": "PYTHON",
    "id": 4,
    "size_score": 50,
    "group": "data",
    "start_year": 2020
  },
  {
    "tool_name": "RUST",
    "id": 5,
    "size_score": 5,
    "group": "data",
    "start_year": 2021
  },
  {
    "tool_name": "THREEJS",
    "id": 6,
    "size_score": 22,
    "group": "design",
    "start_year": 2022
  },
  {
    "tool_name": "GSAP",
    "id": 7,
    "size_score": 8,
    "group": "design",
    "start_year": 2022
  },
  {
    "tool_name": "D3",
    "id": 8,
    "size_score": 17,
    "group": "design",
    "start_year": 2022
  },
  {
    "tool_name": "NODE",
    "id": 9,
    "size_score": 60,
    "group": "development",
    "start_year": 2018
  },
  {
    "tool_name": "AXIOS",
    "id": 10,
    "size_score": 21,
    "group": "development",
    "start_year": 2018
  },
  {
    "tool_name": "EXPRESS",
    "id": 11,
    "size_score": 23,
    "group": "development",
    "start_year": 2018
  },
  {
    "tool_name": "VUE",
    "id": 12,
    "size_score": 100,
    "group": "development",
    "start_year": 2021
  },
  {
    "tool_name": "VUETIFY",
    "id": 13,
    "size_score": 66,
    "group": "design",
    "start_year": 2021
  },
  {
    "tool_name": "VUEX",
    "id": 14,
    "size_score": 55,
    "group": "development",
    "start_year": 2021
  },
  {
    "tool_name": "LARAVEL",
    "id": 15,
    "size_score": 5,
    "group": "development",
    "start_year": 2023
  },
  {
    "tool_name": "REACT",
    "id": 16,
    "size_score": 9,
    "group": "development",
    "start_year": 2019
  },
  {
    "tool_name": "NUXT",
    "id": 17,
    "size_score": 9,
    "group": "development",
    "start_year": 2019
  },
  {
    "tool_name": "APOLLO",
    "id": 18,
    "size_score": 12,
    "group": "development",
    "start_year": 2022
  },
  {
    "tool_name": "PANDAS",
    "id": 19,
    "size_score": 35,
    "group": "data",
    "start_year": 2021
  },
  {
    "tool_name": "SCIKIT",
    "id": 20,
    "size_score": 13,
    "group": "data",
    "start_year": 2020
  },
  {
    "tool_name": "GIT",
    "id": 21,
    "size_score": 42,
    "group": "development",
    "start_year": 2017
  },
  {
    "tool_name": "GITHUB",
    "id": 22,
    "size_score": 42,
    "group": "development",
    "start_year": 2017
  },
  {
    "tool_name": "GITLAB",
    "id": 23,
    "size_score": 10,
    "group": "development",
    "start_year": 2021
  },
  {
    "tool_name": "DOCKER",
    "id": 24,
    "size_score": 10,
    "group": "development",
    "start_year": 2021
  },
  {
    "tool_name": "POSTMAN",
    "id": 25,
    "size_score": 21,
    "group": "development",
    "start_year": 2021
  },
  {
    "tool_name": "RLTK",
    "id": 26,
    "size_score": 3,
    "group": "development",
    "start_year": 2021
  },
  {
    "tool_name": "ROCKET",
    "id": 27,
    "size_score": 7,
    "group": "data",
    "start_year": 2021
  },
  {
    "tool_name": "YEW",
    "id": 28,
    "size_score": 7,
    "group": "design",
    "start_year": 2021
  },
  {
    "tool_name": "GRAPHQL",
    "id": 29,
    "size_score": 42,
    "group": "data",
    "start_year": 2020
  },
  {
    "tool_name": "REST",
    "id": 30,
    "size_score": 58,
    "group": "data",
    "start_year": 2020
  },
  {
    "tool_name": "AWS",
    "id": 31,
    "size_score": 58,
    "group": "development",
    "start_year": 2021
  },
  {
    "tool_name": "APPSYNC",
    "id": 32,
    "size_score": 19,
    "group": "development",
    "start_year": 2021
  },
  {
    "tool_name": "AMPLIFY",
    "id": 33,
    "size_score": 19,
    "group": "development",
    "start_year": 2021
  },
  {
    "tool_name": "AZURE",
    "id": 34,
    "size_score": 4,
    "group": "development",
    "start_year": 2021
  },
  {
    "tool_name": "WORDPRESS",
    "id": 35,
    "size_score": 33,
    "group": "development",
    "start_year": 2016
  },
  {
    "tool_name": "MONGODB",
    "id": 36,
    "size_score": 40,
    "group": "data",
    "start_year": 2020
  },
  {
    "tool_name": "DYNAMODB",
    "id": 37,
    "size_score": 40,
    "group": "data",
    "start_year": 2021
  },
  {
    "tool_name": "POSTGRESQL",
    "id": 38,
    "size_score": 45,
    "group": "data",
    "start_year": 2021
  },
  {
    "tool_name": "REDIS",
    "id": 39,
    "size_score": 2,
    "group": "data",
    "start_year": 2023
  },
  {
    "tool_name": "ILLUSTRATOR",
    "id": 40,
    "size_score": 29,
    "group": "design",
    "start_year": 2012
  },
  {
    "tool_name": "FLSTUDIO",
    "id": 41,
    "size_score": 27,
    "group": "design",
    "start_year": 2012
  },
  {
    "tool_name": "BLENDER",
    "id": 42,
    "size_score": 24,
    "group": "design",
    "start_year": 2022
  },
  {
    "tool_name": "VSCODE",
    "id": 43,
    "size_score": 25,
    "group": "development",
    "start_year": 2014
  },
  {
    "tool_name": "VISUALSTUDIO",
    "id": 44,
    "size_score": 25,
    "group": "development",
    "start_year": 2014
  },
  {
    "tool_name": "GODOT",
    "id": 45,
    "size_score": 62,
    "group": "development",
    "start_year": 2021
  },
  {
    "tool_name": "UNITY",
    "id": 46,
    "size_score": 22,
    "group": "development",
    "start_year": 2017
  },
  {
    "tool_name": "UNREAL",
    "id": 47,
    "size_score": 8,
    "group": "development",
    "start_year": 2017
  },
  {
    "tool_name": "SSIS",
    "id": 48,
    "size_score": 23,
    "group": "data",
    "start_year": 2021
  },
  {
    "tool_name": "BOOTSTRAP",
    "id": 49,
    "size_score": 12,
    "group": "design",
    "start_year": 2021
  },
  {
    "tool_name": "PHOTOSHOP",
    "id": 50,
    "size_score": 75,
    "group": "design",
    "start_year": 2012
  }
                  ],

            
        };
    },

    mounted() {

        //get size of window, or define it
const width = window.innerWidth;
const height = window.innerHeight-100;
//const width = 1300;


// Locations to move bubbles towards, depending
// on which view mode is selected.
var center = { x: width / 2, y: height / 2 };

const yearCenters = {
  2012: { x: 300, y: height / 2 },
  2013: { x: (width/2.8)-300, y: height / 2 },
  2014: { x: (width/2.6)-300, y: height / 2 },
  2015: { x: (width/2.4)-300, y: height / 2 },
  2016: { x: (width/2.2)-300, y: height / 2 },
  2017: { x: width / 2, y: height / 2 },
  2018: { x: (width/1.8)-300, y: height / 2 },
  2019: { x: (width/1.7)-300, y: height / 2 },
  2020: { x: (width/1.6)-300 / 2 },
  2021: { x: (width/1.4)-300 / 2 },
  2022: { x: (width/1.2)-300, y: height / 2 },
  2023: { x: (width/1.1)-300, y: height / 2 },
};

const groupCenters = {
    "data": {x: width / 3, y : height/ 3},
    "development": {x: width / 2, y : height/ 2},
    "design": {x: width/1.5, y : height},
  };

// X locations of the year titles.
const yearsTitleX = {
  12: 150,
  13: (width/4)-150,
  14: (width/3.5)-150,
  15: (width/3)-150,
  16: (width/2.5)-150,
  17: width/2-150,
  18: (width/1.8)-150,
  19: (width/1.7)-150,
  20: (width/1.6)-150,
  21: (width/1.4)-150,
  22: (width/1.2)-150,
  23: width-150
};

//strength at which to force bubbles to new locations
const forceStrength = 0.03;
        
const generateChart = data => {
    //generate nodes from data

  nodes = createNodes(data);

//create a new svg canvas by appending it to the vis element
let svg = d3
  .select("#vis")
  .append("svg")
  .attr("width", width)
  .attr("height", height);

//generate bubbles from the list of data nodes
let bubbles = svg.selectAll(".bubble").data(nodes, function (d) {
  return d.id;
});

//create simulation. velocity decay determines rapidness of animation
const simulation = d3
  .forceSimulation()
  .velocityDecay(0.2)
  .force("x", d3.forceX().strength(forceStrength).x(center.x))
  .force("y", d3.forceY().strength(forceStrength).y(center.y))
  .force("charge", d3.forceManyBody().strength(charge))
  //this force ensures bubbles do not overlap. comment out for overlapping effect which allows bubbles to move more freely past each other
  // .force("collide", d3.forceCollide(function(d) {
  //   return d.radius;
  // }))
  .on("tick", ticked);

//pause simulation before loading nodes
simulation.stop();

const fillColor = d3
  .scaleOrdinal()
  .domain(["development", "data", "design"])
  .range(["#F16529", "#1C88C7", "#FCC700"]);

// Create new circle elements each with class `bubble`.
// There will be one circle.bubble for each object in the nodes array.
// Initially, their radius (r attribute) will be 0.
// @v4 Selections are immutable, so lets capture the
//  enter selection to apply our transtition to below.
let bubblesE = bubbles
  .enter()
  .append("circle")
  .classed("bubble", true)
  .attr("r", 0)
  .attr("fill", function (d) {
    return fillColor(d.group);
  })
  .attr("stroke", function (d) {
    return d3.rgb(fillColor(d.group)).darker();
  })
  .attr("stroke-width", 2);

//Merge the original empty selection and the enter selection
bubbles = bubbles.merge(bubblesE);

// Transition to make bubbles appear
bubbles
  .transition()
  .duration(2000)
  .attr("r", function (d) {
    return d.radius;
  });

// Set the simulation's nodes to our newly created nodes array.
simulation.nodes(nodes);

// Set initial layout to single group.
groupBubbles();

function charge(d) {
  return -Math.pow(d.radius, 2.05) * forceStrength;
}

function ticked() {
  bubbles
    .attr("cx", function (d) {
      return d.x;
    })
    .attr("cy", function (d) {
      return d.y;
    });
}


function createNodes(data) {
  // Use the max size_score in the data as the max in the scale's domain
  // note we have to ensure the size_score is a number.
  const maxAmount = d3.max(data, function (d) {
    return +d.size_score;
  });

  // Size bubbles based on area.
  const radiusScale = d3
    .scalePow()
    .exponent(0.5)
    .range([2, 85])
    .domain([0, maxAmount]);

  // Use map() to convert raw data into node data.
  var myNodes = data.map(function (d) {
    return {
      id: d.id,
      radius: radiusScale(+d.size_score),
      value: +d.size_score,
      name: d.tool_name,
      group: d.group,
      year: d.start_year,
      x: Math.random() * 900,
      y: Math.random() * 800,
    };
  });

  // sort them to prevent occlusion of smaller nodes.
  myNodes.sort(function (a, b) {
    return b.value - a.value;
  });

  return myNodes;
}


//functions to group bubbles in different arrangements. groupbubbles is default all to center

function groupBubbles() {
  hideYearTitles();
  // Reset the 'x' force to draw the bubbles to the center.
  simulation.force("x", d3.forceX().strength(forceStrength).x(center.x));

  //We can reset the alpha value and restart the simulation
  simulation.alpha(1).restart();
}

//splits bubbles based on the start_year datapoint
function splitBubblesOnYear() {
  showYearTitles();

  // @v4 Reset the 'x' force to draw the bubbles to their year centers
  simulation.force("x", d3.forceX().strength(forceStrength).x(nodeYearPos));

  // @v4 We can reset the alpha value and restart the simulation
  simulation.alpha(1).restart();
}

function splitBubblesOnPillar() {
  hideYearTitles()

  // @v4 Reset the 'x' force to draw the bubbles to their year centers
  simulation.force("x", d3.forceX().strength(forceStrength).x(nodePillarPos));

  // @v4 We can reset the alpha value and restart the simulation
  simulation.alpha(1).restart();
}


function toggleDisplay(displayName) {
  if (displayName === "year") {
    splitBubblesOnYear();
  } else if (displayName === "pillars") {
      splitBubblesOnPillar();
  }else {
    groupBubbles();
  }
}

/*
 * Hides Year title displays.
 */
function hideYearTitles() {
  svg.selectAll(".year").remove();
}

/*
 * Shows Year title displays.
 */
function showYearTitles() {
  // Another way to do this would be to create
  // the year texts once and then just hide them.
  var yearsData = d3.keys(yearsTitleX);
  var years = svg.selectAll(".year").data(yearsData);

  years
    .enter()
    .append("text")
    .attr("class", "year")
    .attr("x", function (d) {
      return yearsTitleX[d];
    })
    .attr("y", 40)
    .attr("text-anchor", "middle")
    .text(function (d) {
      return d;
    });
}

function setupButtons() {
  d3.select("#toolbar")
    .selectAll(".button")
    .on("click", function () {
      // Remove active class from all buttons
      d3.selectAll(".button").classed("active", false);
      // Find the button just clicked
      var button = d3.select(this);

      // Set it as the active button
      button.classed("active", true);

      // Get the id of the button
      var buttonId = button.attr("id");

      // Toggle the bubble chart based on
      // the currently clicked button.
      toggleDisplay(buttonId);
    });
}

function nodeYearPos(d) {
  return yearCenters[d.year].x;
}

function nodePillarPos(d) {
  return groupCenters[d.group].x;
}

setupButtons();
 };


    let data =  d3.json(this.data).then(data => data);
    generateChart(data);

    },

    methods: {
        
    },
};
</script>

<style lang="scss" scoped>

</style>