<template>
  <div id="chartbounds">
    <div id="windowsize-readout">{{ islandscape }}</div>
    <div id="vis">
    </div>
  </div>
</template>

<script>
import * as d3 from "d3";
export default {
  name: "IntegratedResumeVueAmplifySvgPlayground",

  data() {
    return {
    islandscape: true,
      svg: null,
      dataset: null,
      height: 0,
      width: 0,
      centerpoint: {x:0, y:0}
    };
  },

  mounted() {
        //assign starting height and width based on window size
        this.width = window.innerWidth;
    this.height = window.innerHeight;
    //define constants
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
this.centerpoint = { x: this.width / 2, y: this.height / 2 };

console.log(this.centerpoint)

this.svg = d3
    .select("#chartbounds")
    .append("svg")
    .attr("width", this.width)
    .attr("height", this.height);

    //load data
    const FILEPATH =
      "https://iftechpublicassets.s3.us-west-2.amazonaws.com/resumedata.json";
    d3.json(FILEPATH).then((json) => {
      this.dataset = this.processDataIntoNodes(json);
    });



    //listen for the window to be resized and adjust width and height data variables
    //all behavior related to the resizing of the window is here
    window.addEventListener("resize", () => {
      // Update sizes
      this.width = window.innerWidth;
      this.height = window.innerHeight;

      //change the attribute of the root svg to fit the windowsize
      this.svg.attr("width", window.innerWidth).attr("height", window.innerHeight);
 
      if ((window.innerWidth/window.innerHeight) < 1){
        this.islandscape = false
      }else{this.islandscape = true}
    });

    let bubbles = this.svg.selectAll(".bubble").data(this.dataset, function (d) {
    return d.id;
  });

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

  bubbles
    .transition()
    .duration(2000)
    .attr("r", function (d) {
      return d.radius;
    });

  // Set the simulation's nodes to our newly created nodes array.
  simulation.nodes(this.dataset);

  // Set initial layout to single group.
  groupBubbles();

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
  },

  methods: {

    init(){

    },
    //This method takes in a dataset which has been retrieved and then modifies and appends that data for prep to be used as nodes in a d3 graph
    processDataIntoNodes(data) {
      const maxAmount = 100;

      // Size bubbles based on area.
      const radiusScale = d3
        .scalePow()
        .exponent(0.5)
        .range([2, 85])
        .domain([0, maxAmount]);

      let myNodes = data.map(function (d) {
        return {
          id: d.id,
          radius: radiusScale(+d.size_score),
          value: +d.size_score,
          name: d.tool_name,
          group: d.group,
          year: d.start_year,
          imagelink:
            "https://iftechpublicassets.s3.us-west-2.amazonaws.com/technologylogos/javascript-logo-number-angularjs-node-javascript-logo-11563241338go76tq0nxz.png",
          x: Math.random() * 900,
          y: Math.random() * 800,
        };
      });

      myNodes.sort(function (a, b) {
        return b.value - a.value;
      });
      console.log(myNodes);
      return myNodes;
    },
    drawChart(dataset){
        
    },
    createBubblesFromNodes(nodes){
        this.bubbles = this.svg.selectAll(".bubble").data(nodes, function (d) {
    return d.id;
  }); 
    }


  },
};
</script>

<style lang="scss" scoped>
</style>