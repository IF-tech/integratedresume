<template>
 <div>
    <div id="overlay">

<div style="visibility:hidden" id="closedatawindow" @click="shrinkObject()">
  <span style=" position: fixed; z-index: 5;
  
  top: 0;
  left: 0;
  width: 100px;
  margin-top: 0;
  padding: 10px;" class="material-symbols-outlined">
X   </span>
</div></div>

<div id="chartoverlay" style="visibility:hidden">
<v-container>
  <div id="chartvis"></div>
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
    name: 'IntegratedResumeVueAmplifyResponsiveChartBlob',

    data() {
        return {
      forceStrength: 0.03,
      simulation:null,
      islandscape: null,
      svg: null,
      dataset: null,
      height: 0,
      width: 0,
      centerpoint: { x: 0, y: 0 },
      forcepoints: [],
        };
    },

    mounted() {
         //assign starting height and width based on window size
    this.width = window.innerWidth;
    this.height = window.innerHeight;
    //define constants

    if (this.width / this.height < 1) {
      this.islandscape = false;
    } else {
      this.islandscape = true;
    }
    //strength at which to force bubbles to new locations
    const forceStrength = 0.03;
    this.centerpoint = { x: this.width / 2, y: this.height / 2 };

    console.log(this.centerpoint);

    //load data
    const FILEPATH =
      "https://iftechpublicassets.s3.us-west-2.amazonaws.com/resumedata.json";
    d3.json(FILEPATH).then((json) => {
      this.dataset = this.processDataIntoNodes(json);
      this.draw()
    });

    //listen for the window to be resized and adjust width and height data variables
    //all behavior related to the resizing of the window is here
    window.addEventListener("resize", () => {
      // Update sizes
      this.width = window.innerWidth;
      this.height = window.innerHeight;

      //change the attribute of the root svg to fit the windowsize
      this.svg
        .attr("width", window.innerWidth)
        .attr("height", window.innerHeight);

      if (window.innerWidth / window.innerHeight < 1) {
        this.islandscape = false;
        this.drawPortrait();
        this.alignVerticalCenter()
    
      } else {
        this.islandscape = true;
        this.drawLandscape();
        this.alignHorizontalCenter()
      
      }
    });

    },

    methods: {
        draw(){
        const forceStrength = 0.03;
        d3.selectAll("svg").remove()
        this.svg = d3
      .select("#chartvis")
      .append("svg")
      .attr("width", window.innerWidth)
      .attr("height", window.innerHeight);

      if (this.islandscape) {
      this.drawLandscape();
    } else {
      this.drawPortrait();
    }

              //generate bubbles from the list of data nodes
  let bubbles = this.svg.selectAll(".bubble").data(this.dataset, function (d) {
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
    this.simulation = d3
      .forceSimulation()
      .velocityDecay(0.2)
      .force("x", d3.forceX().strength(forceStrength).x(window.innerWidth/2))
      .force("y", d3.forceY().strength(forceStrength).y(window.innerHeight/2))
      .force("charge", d3.forceManyBody().strength(charge))
      //this force ensures bubbles do not overlap. comment out for overlapping effect which allows bubbles to move more freely past each other
      // .force("collide", d3.forceCollide(function(d) {
      //   return d.radius;
      // }))
      .on("tick", ticked);

    //pause simulation before loading nodes
    this.simulation.stop();

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
  this.simulation.nodes(this.dataset);

  // Set initial layout to single group.
  if (this.islandscape) {
      this.alignHorizontalCenter();
    } else {
        this.alignVerticalCenter();
    }
    },
    alignVerticalCenter(){
        const forceStrength = .04;
    // Reset the 'x' force to draw the bubbles to the center.
    this.simulation.force("x", d3.forceX().strength(forceStrength).x(this.width/2));
    this.simulation.force("y", d3.forceY().strength(0.015).y(this.height/2));
    //We can reset the alpha value and restart the simulation
    this.simulation.alpha(1).restart();
    },

    alignHorizontalCenter(){
        const forceStrength = .03;
    // Reset the 'x' force to draw the bubbles to the center.
    this.simulation.force("y", d3.forceY().strength(forceStrength).y(this.height/2));
    this.simulation.force("x", d3.forceX().strength(0.01).x(this.width/2))
    //We can reset the alpha value and restart the simulation
    this.simulation.alpha(1).restart();
    },

    //This method takes in a dataset which has been retrieved and then modifies and appends that data for prep to be used as nodes in a d3 graph
    processDataIntoNodes(data) {
      // Use the max size_score in the data as the max in the scale's domain
      // note we have to ensure the size_score is a number.
      const maxAmount = 100;

      // Size bubbles based on area.
      const radiusScale = d3
        .scalePow()
        .exponent(0.5)
        .range([2, 40])
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
          x: Math.random() * window.innerWidth,
          y: Math.random() * window.innerHeight,
        };
      });

      myNodes.sort(function (a, b) {
        return b.value - a.value;
      });
      console.log(myNodes);
      return myNodes;
    },

    drawPortrait() {
     d3.selectAll(".forceMarker").remove()
      this.svg;
      var circle = this.svg
      .append("g")
        .selectAll("circle")
        .data([32, 57, 112, 293, 32, 57, 112, 293, 25]);

      var circleEnter = circle.enter().append("circle");

      circleEnter.attr("cy", function (d, i) {
        return (window.innerHeight / 9) * i + 25;
      });
      circleEnter.attr("cx", "50%");
      circleEnter.attr("r", 5);
      circleEnter.classed("forceMarker", true);

      
    },
    drawLandscape() {
    d3.selectAll(".forceMarker").remove()
   
      var circle = this.svg
      .append("g")
        .selectAll("circle")
        .data([32, 57, 112, 293, 32, 57, 112, 293, 25]);

      var circleEnter = circle.enter().append("circle");

      circleEnter.attr("cy", "50%");
      circleEnter.attr("cx", function (d, i) {
        return (window.innerWidth / 9) * i + 75;
      });
      circleEnter.attr("r", 5);
      circleEnter.classed("forceMarker", true);

      
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