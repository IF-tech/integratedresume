<template>
  <div>
    <div id="overlay">

<div style="visibility:hidden" id="closedatawindow" @click="shrinkObject()">
  <span style=" position: fixed; z-index: 3;
  
  top: 0;
  left: 0;
  width: 100px;
  margin-top: 0;
  padding: 10px;" class="material-symbols-outlined">
X   </span>
</div></div>

<div id="chartoverlay" style="visibility:hidden">
<v-container>
  <div id="vis"></div>
</v-container>
</div>


<svg @click="growObject()" id="datablob" class="shape-blob" ref="blob" viewBox="0 0 200 200">
    </svg>
   
  </div>
</template>



<script>
import gsap from "gsap";
import * as d3 from "d3";

export default {
  name: "IntegratedResumeVueAmplifyBlob",

  data() {
    return {
        datapath: "https://iftechpublicassets.s3.us-west-2.amazonaws.com/resumedata.json",
        width: 900,
        height: 300
    };
  },

  mounted() {
        //get size of window, or define it
    this.init()

  

  },

  methods: {
    init(){

        this.width = window.innerWidth;
        this.height = window.innerheight;
        
        let width = 2000;
        let height = 1000;

    // X locations of the year titles.
const yearsTitleX = {
  12: 150,
  13: (this.width/4)-150,
  14: (this.width/3.5)-150,
  15: (this.width/3)-150,
  16: (this.width/2.5)-150,
  17: this.width/2-150,
  18: (this.width/1.8)-150,
  19: (this.width/1.7)-150,
  20: (this.width/1.6)-150,
  21: (this.width/1.4)-150,
  22: (this.width/1.2)-150,
  23: this.width-150
};


//strength at which to force bubbles to new locations
const forceStrength = 0.03;
let center = { x: width / 2, y: (height / 2)-100 };
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

    d3.json(this.datapath)
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

  console.log(bubbles)

  function charge(d) {
    return -Math.pow(d.radius, 2.05) * forceStrength;
  }

  function ticked() {

   const current_width = window.innerWidth;
   const  current_height = window.innerHeight;
   const current_ratio = current_width / current_height;

   if(current_ratio != (width/height)){
    let newwidth = current_width;
    let newheight = current_height;
    console.log("ratio changed")
    svg = d3
    .select("#vis")
    .append("svg")
    .attr("width", newwidth)
    .attr("height", newheight);
    center = { x: current_width / 2, y: current_height / 2 }
    regroupOnNewCenter(center)
   }

   height = current_height;
   width = current_width;


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
    .attr("opacity", .9)
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
          imagelink: "https://iftechpublicassets.s3.us-west-2.amazonaws.com/technologylogos/javascript-logo-number-angularjs-node-javascript-logo-11563241338go76tq0nxz.png",
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

  function regroupOnNewCenter(center) {
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
    var yearsData = ["'12"]
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

    growObject(){
    console.log("grow function called")
        

    gsap.to(".shape-blob", { height: 5000, width: 5000, left: -2000, top: -1100, duration: 1 });
    document.getElementById("closedatawindow").style.visibility = 'visible';
    document.getElementById("chartoverlay").style.visibility = 'visible';
    document.getElementById("datablob").style.zIndex = -4;
    document.getElementById("chartoverlay").style.zIndex = 4;
    console.log("grow function finished")
  },
  shrinkObject(){
    console.log("grow function called")
   

    gsap.to(".shape-blob", { height: 200, width: 200, left: "45vw", top: 50, duration: .3 });
    document.getElementById("closedatawindow").style.visibility = 'hidden';
    document.getElementById("chartoverlay").style.visibility = 'hidden';
    document.getElementById("datablob").style.zIndex = 4;
    console.log("grow function finished")
  }
  },
};
</script>

<style lang="scss" scoped>
:root {

  }

body {
  margin: 0;
  padding: 0;
}

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
    margin-left: 46vw;
  }

// .container {
//   background: #0a2463;
//   min-height: 100vh;
//   display: flex;
//   flex-direction: row;
//   align-items: center;
//   justify-content: center;
//   overflow: hidden;
//   position: relative;
// }

.shape-blob {
  background-image: linear-gradient(150deg, rgb(65, 255, 239), rgb(6, 184, 216));
  height: 200px;
  width: 200px;
  border-radius: 30% 50% 20% 40%;
  animation: transform 5s ease-in-out infinite both alternate,
    movement_one 10s ease-in-out infinite both;
  opacity: 1.0;
  position: absolute;
  left: 45vw;
  top: 50px;
}


@keyframes transform {
  0%,
  100% {
    border-radius: 33% 67% 70% 30% / 30% 30% 70% 70%;
  }
  20% {
    border-radius: 37% 63% 51% 49% / 37% 65% 35% 63%;
  }
  40% {
    border-radius: 36% 64% 64% 36% / 64% 48% 52% 36%;
  }
  60% {
    border-radius: 37% 63% 51% 49% / 30% 30% 70% 70%;
  }
  80% {
    border-radius: 40% 60% 42% 58% / 41% 51% 49% 59%;
  }
}

@keyframes movement_one {
  0%,
  100% {
    transform: none;
  }
  50% {
    transform: translate(10%, 10%) rotateY(10deg) scale(1.2);
  }
}
</style>