<template>
    <div>
      <v-container>
        <div id="vis"></div>
      </v-container>
    </div>
  </template>
  <script src="https://cdnjs.cloudflare.com/ajax/libs/d3/7.6.1/d3.min.js" integrity="sha512-MefNfAGJ/pEy89xLOFs3V6pYPs6AmUhXJrRlydI/9wZuGrqxmrdQ80zKHUcyadAcpH67teDZcBeS6oMJLPtTqw==" crossorigin="anonymous" referrerpolicy="no-referrer"></script>
  <script>
  import * as d3 from "d3";
  export default {
    name: "IntegratedResumeVueAmplifyd3BubbleTemplate",
  
    data() {
      return {
        data: [],
      };
    },
  
    mounted() {
      //get size of window, or define it
  const width = window.innerWidth;
  const height = window.innerHeight;
  //strength at which to force bubbles to new locations
  const forceStrength = 0.03;
  const center = { x: width / 2, y: height / 2 };
  
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
  
  
  
        })
        .catch((error) => {
          console.error(error);
        });
  
    
  
    },
  
    methods: {},
  };
  </script>
  
  <style lang="scss" scoped>
  </style>