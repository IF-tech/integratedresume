<template>
    <div id="chartbounds">
      <div id="datavis"></div>
    </div>
  </template>

<script>
import * as d3 from "d3";
export default {
    name: 'IntegratedResumeVueAmplifyResponsiveChart',

    data() {
        return {
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
        // this.drawPortrait();
        this.alignVerticalCenter()
    
      } else {
        this.islandscape = true;
        // this.drawLandscape();
        this.alignHorizontalCenter()
      
      }
    });

    //load data
    const FILEPATH =
      "https://iftechpublicassets.s3.us-west-2.amazonaws.com/resumedata.json";
    d3.json(FILEPATH).then((json) => {
      this.dataset = this.processDataIntoNodes(json);
      this.draw()
    });


    

   
    },

    methods: {
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

    draw(){
        const forceStrength = 0.03;
        d3.selectAll("datavizualization").remove()
        this.svg = d3
      .select("#datavis")
      .append("svg")
      .classed("datavisualization", true)
      .attr("width", window.innerWidth)
      .attr("height", window.innerHeight);

      if (this.islandscape) {
    //   this.drawLandscape();
    } else {
    //   this.drawPortrait();
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
    alignHorizontalCenter(){
        const forceStrength = .03;
    // Reset the 'x' force to draw the bubbles to the center.
    this.simulation.force("y", d3.forceY().strength(forceStrength).y(this.height/2));
    this.simulation.force("x", d3.forceX().strength(0.01).x(this.width/2))
    //We can reset the alpha value and restart the simulation
    this.simulation.alpha(1).restart();
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

      
    },    alignVerticalCenter(){
        const forceStrength = .04;
    // Reset the 'x' force to draw the bubbles to the center.
    this.simulation.force("x", d3.forceX().strength(forceStrength).x(this.width/2));
    this.simulation.force("y", d3.forceY().strength(0.015).y(this.height/2));
    //We can reset the alpha value and restart the simulation
    this.simulation.alpha(1).restart();
    },


    },
};
</script>

<style lang="scss" scoped>

</style>