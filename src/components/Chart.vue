<template>
  <div>

    <div id="toolbar">
      <a href="#" id="all" class="button active">All</a>
      <a href="#" id="year" class="button">Timeline</a>
      <a href="#" id="pillars" class="button">Pillars</a>
      <a href="#" id="data" class="button">Data</a>
      <a href="#" id="development" class="button">Development</a>
      <a href="#" id="design" class="button">Design</a></div>
      <div id="vis"></div>

  </div>
</template>

<script>
import * as d3 from "d3";
export default {
  name: "IntegratedResumeVueAmplifyChart",

  data() {
    return {
      data: [],
    };
  },

  mounted() {
        //get size of window, or define it
const width = window.innerWidth;
const height = window.innerHeight;
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
const center = { x: width / 2, y: height / 2 };
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

    const FILEPATH =
      "https://iftechpublicassets.s3.us-west-2.amazonaws.com/resumedata.json";
    d3.json(FILEPATH)
      .then((json) => {
        this.data = json;
        let nodes = createNodes(this.data);
        console.log(nodes);

        let svg = d3
    .select("#vis")
    .append("svg")
    .attr("width", width)
    .attr("height", height);


          //generate bubbles from the list of data nodes
  let bubbles = svg.selectAll(".bubble").data(nodes, function (d) {
    return d.id;
  });

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
    .range(["#ffffff", "#d4d4d4", "#a8a8a8"]);

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
    // .attr("stroke", function (d) {
    //   return d3.rgb(fillColor(d.group)).darker();
    // })
    // .attr("stroke-width", 2);

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
  function createNodes(data) {
      // Use the max size_score in the data as the max in the scale's domain
      // note we have to ensure the size_score is a number.
      const maxAmount = 100;

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

    function groupBubbles() {
    hideYearTitles();
    // Reset the 'x' force to draw the bubbles to the center.
    simulation.force("x", d3.forceX().strength(forceStrength).x(center.x));

    //We can reset the alpha value and restart the simulation
    simulation.alpha(1).restart();
  }

   /*
   * Hides Year title displays.
   */
   function hideYearTitles() {
    svg.selectAll(".year").remove();
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
  function nodePillarPos(d) {
    return groupCenters[d.group].x;
  }

  function nodeYearPos(d) {
    return yearCenters[d.year].x;
  }
    /*
   * Shows Year title displays.
   */
   function showYearTitles() {
    // Another way to do this would be to create
    // the year texts once and then just hide them.
   
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

  setupButtons();
      })
      .catch((error) => {
        console.error(error);
      });

  

  },

  methods: {},
};
</script>

<style lang="scss" scoped>
a, a:visited, a:active {
    color: #444;
  }
  

  
  .button {
    min-width: 130px;
    padding: 4px 5px;
    cursor: pointer;
    text-align: center;
    font-size: 13px;
    border: 1px solid #e0e0e0;
    text-decoration: none;
    right: 50%
  }
  
  .button.active {
    background: #000;
    color: #fff;
  }
  

  #toolbar {
    margin-top: 10px;
    margin-left: 50%
  }
</style>