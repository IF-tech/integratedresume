<template>
  <div id="chartbounds">
    <v-container style="position:fixed; top:0px" fluid id="toolbar">
      <v-row >
        <v-col  class="d-flex justify-center align-center">  <v-btn   fab
  icon
  outlined @click="this.groupBubblesOnCenter" color="white"
        >All</v-btn
      ></v-col>
        <v-col class="d-flex justify-center align-center"> <v-btn fab
  icon
  outlined @click="this.groupBubblesByYear" color="white"><v-icon dark>
        mdi-chart-line
      </v-icon></v-btn></v-col>
        <v-col class="d-flex justify-center align-center">      <v-btn fab
  icon
  outlined @click="this.groupBubblesByDomain" color="white"> <v-icon dark>
        mdi-layers
      </v-icon></v-btn></v-col>
      </v-row>
     
    </v-container>
    <div id="datavis"></div>
  </div>
</template>

<script>
import * as d3 from "d3";
export default {
  name: "IntegratedResumeVueAmplifyResponsiveChart",

  data() {
    return {
      domainGroupsAreActive: false,
      timelinesAreActive: false,
      simulation: null,
      islandscape: null,
      svg: null,
      dataset: null,
      height: 0,
      width: 0,
      centerpoint: { x: 0, y: 0 },
      forcepoints: [],
      forceStrength: 0.03,
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
        if(this.timelinesAreActive)
        {this.drawPortrait();}
        this.alignVerticalCenter();
      } else {
        this.islandscape = true;

        if(this.timelinesAreActive)
        {this.drawLandscape();}



        this.groupBubblesOnCenter();
      }

    });

    //load data
    const FILEPATH =
      "https://iftechpublicassets.s3.us-west-2.amazonaws.com/resumedatawithimages.json";
    d3.json(FILEPATH).then((json) => {
      this.dataset = this.processDataIntoNodes(json);
      this.draw();

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
        .range([2, 45])
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
          imagelink: d.imagelink,
          x: Math.random() * window.innerWidth,
          y: Math.random() * window.innerHeight,
        };
      });

      myNodes.sort(function (a, b) {
        return b.value - a.value;
      });
      return myNodes;
    },

    draw() {
      const fillColor = d3
        .scaleOrdinal()
        .domain(["development", "data", "design"])
        .range(["#ffffff", "#d4d4d4", "#a8a8a8"]);


      d3.selectAll("datavizualization").remove();
      this.svg = d3
        .select("#datavis")
        .append("svg")
        .classed("datavisualization", true)
        .attr("width", window.innerWidth)
        .attr("height", window.innerHeight);

  


      //generate bubbles from the list of data nodes
      let bubbles = this.svg
        .selectAll("g").classed("bubbles", true)
        .data(this.dataset, function (d) {
          return d.id;
        });

      let bubblesEnter = bubbles.enter().append("g").attr('class', 'bubblenode')

     .append("circle")
        .classed("bubble", true)
        .attr("r", 0)
        .attr("opacity", 0.9)
        .attr("fill", function (d) {
          return fillColor(d.group);
        })

     

      bubbles = bubbles.merge(bubblesEnter);

      // let text = d3.selectAll(".bubblenode").append("text").attr("dx",function (d) {
      //     return d.x;
      //   }).attr("dy",function (d) {
      //     return d.y;
      //   }).text(function(d){return d.name}).style("fill", "black").style("z-index", "7")

        let image = d3.selectAll(".bubblenode").append("image")
      .attr("xlink:href", function (d) {return d.imagelink})
      .attr("x", function (d) {
          return d.x-25;
        })
      .attr("y", function (d) {
          return d.y;})
      .attr("width", function (d) {
          return (d.radius);})
      .attr("height", function (d) {
          return (d.radius);});

      // Transition to make bubbles appear
      bubbles
        .transition()
        .duration(2000)
        .attr("r", function (d) {
          return d.radius;
        });

      

      function charge(d) {
        return -Math.pow(d.radius, 2.05) * 0.03;
      }

      function ticked() {
        bubbles
          .attr("cx", function (d) {
            return d.x;
          })
          .attr("cy", function (d) {
            return d.y;
          });

          // text
          // .attr("dx", function (d) {
          //   return d.x;
          // })
          // .attr("dy", function (d) {
          //   return d.y;
          // });

          image
          .attr("x", function (d) {
            return d.x-(d.radius/2);
          })
          .attr("y", function (d) {
            return d.y-(d.radius/2);
          });
      }

      //create simulation. velocity decay determines rapidness of animation
      this.simulation = d3
        .forceSimulation()
        .velocityDecay(0.2)
        .force(
          "x",
          d3
            .forceX()
            .strength(0.03)
            .x(window.innerWidth / 2)
        )
        .force(
          "y",
          d3
            .forceY()
            .strength(0.03)
            .y(window.innerHeight / 2)
        )
        .force("charge", d3.forceManyBody().strength(charge))
        //this force ensures bubbles do not overlap. comment out for overlapping effect which allows bubbles to move more freely past each other
        // .force("collide", d3.forceCollide(function(d) {
        //   return d.radius;
        // }))
        .on("tick", ticked);

      //pause simulation before loading nodes
      this.simulation.stop();


      // Create new circle elements each with class `bubble`.
      // There will be one circle.bubble for each object in the nodes array.
      // Initially, their r will be 0 until the tranisition is called to animate them into the scene.



      // Set the simulation's nodes to our newly created nodes array.
      this.simulation.nodes(this.dataset);

      // Set initial layout to group based on window layout.
      if (this.islandscape) {
        this.groupBubblesOnCenter();
      } else {
        this.alignVerticalCenter();
      }
    },
    //below are methods which redraw forces on the graph for different "views"
    alignHorizontalCenter() {
      d3.selectAll(".axislabel").remove()
    d3.selectAll(".labeltext").remove()
    d3.selectAll(".grouplabel").remove()
      this.timelinesAreActive = false;
      // Reset the 'x' force to draw the bubbles to the center.
      this.simulation.force(
        "y",
        d3
          .forceY()
          .strength(this.forceStrength)
          .y(this.height / 2)
      );
      this.simulation.force(
        "x",
        d3
          .forceX()
          .strength(0.01)
          .x(this.width / 2)
      );
      //We can reset the alpha value and restart the simulation
      this.simulation.alpha(1).restart();
    },
    alignVerticalCenter() {
      this.timelinesAreActive = false;
      d3.selectAll(".axislabel").remove()
    d3.selectAll(".labeltext").remove()
    d3.selectAll(".grouplabel").remove()
      // Reset the 'x' force to draw the bubbles to the center.
      this.simulation.force(
        "x",
        d3
          .forceX()
          .strength(this.forceStrength)
          .x(this.width / 2)
      );
      this.simulation.force(
        "y",
        d3
          .forceY()
          .strength(0.015)
          .y(this.height / 2)
      );
      //We can reset the alpha value and restart the simulation
      this.simulation.alpha(1).restart();
    },
    groupBubblesOnCenter() {
      this.timelinesAreActive = false;
      d3.selectAll(".axislabel").remove()
    d3.selectAll(".labeltext").remove()
    d3.selectAll(".grouplabel").remove()
    
      // Reset the 'x' force to draw the bubbles to the center.
      this.simulation.force(
        "x",
        d3
          .forceX()
          .strength(0.03)
          .x(this.width / 2)
      );
      this.simulation.force(
        "y",
        d3
          .forceY()
          .strength(0.03)
          .y(this.height / 2.5)
      );
      //We can reset the alpha value and restart the simulation
      this.simulation.alpha(1).restart();
    },
    groupBubblesByYear() {
      this.timelinesAreActive = true;

     if(this.islandscape){
      this.drawLandscape()
     }else{this.drawPortrait()}


      const width = window.innerWidth;
      const height = window.innerHeight;
if(this.islandscape){
      const yearCenters = {
        2012: { x: 200, y: height / 2 },
        2013: { x: width / 2.8 - 100, y: height / 2 },
        2014: { x: width / 2.6 - 100, y: height / 2 },
        2015: { x: width / 2.4 - 100, y: height / 2 },
        2016: { x: width / 2.2 - 100, y: height / 2 },
        2017: { x: width / 2, y: height / 2 },
        2018: { x: width / 1.8 - 100, y: height / 2 },
        2019: { x: width / 1.7 - 100, y: height / 2 },
        2020: { x: width / 1.6 - 100 / 2 },
        2021: { x: width / 1.4 - 100 / 2 },
        2022: { x: width / 1.2 - 100, y: height / 2 },
        2023: { x: width / 1.1-100, y: height / 2 },
      };
      function nodeYearPos(d) {
        return yearCenters[d.year].x;
      }
      // @v4 Reset the 'x' force to draw the bubbles to their year centers
      this.simulation.force(
        "x",
        d3.forceX().strength(this.forceStrength).x(nodeYearPos)
      );

      // @v4 We can reset the alpha value and restart the simulation
      this.simulation.alpha(1).restart();
    }else{
      const yearCenters = {
        2012: { y: (height / 3)-(height/7), x: width / 2 },
        2013: { y: height / 2.8 - (height/5), x: width / 2 },
        2014: { y: height / 2.6 - (height/5), x: width / 2 },
        2015: { y: height / 2.4 - (height/5), x: width / 2 },
        2016: { y: height / 2.2 - (height/5), x: width / 2 },
        2017: { y: height / 2, x: width / 2 - (height/5)},
        2018: { y: height / 1.8 - (height/5), x: width / 2 },
        2019: { y: height / 1.7 - (height/5), x: width / 2 },
        2020: { y: height / 1.6 - (height/5), x: width / 2 },
        2021: { y: height / 1.4 - (height/5), x: width / 2 },
        2022: { y: height / 1.2 - (height/5), x: width / 2 },
        2023: { y: height / 1.1 -(height/5), x: width / 2 },
      };
      function nodeYearPos(d) {
        return yearCenters[d.year].y;
      }
      // @v4 Reset the 'x' force to draw the bubbles to their year centers
      this.simulation.force(
        "y",
        d3.forceY().strength(this.forceStrength).y(nodeYearPos)
      );

      // @v4 We can reset the alpha value and restart the simulation
      this.simulation.alpha(1).restart();
    }

    },
    groupBubblesByDomain() {
      d3.selectAll(".axislabel").remove()
    d3.selectAll(".labeltext").remove()

    this.drawGroupLables();
      const width = window.innerWidth;
      const height = window.innerHeight;
if(this.islandscape){
  const groupCenters = {
    "data": {x: width / 3, y : height/ 3},
    "development": {x: width / 2, y : height/ 2},
    "design": {x: width/1.5, y : height},
  };
  function nodeDomainPos(d) {
    return groupCenters[d.group].x;
  }
      // @v4 Reset the 'x' force to draw the bubbles to their year centers
      this.simulation.force(
        "x",
        d3.forceX().strength(this.forceStrength).x(nodeDomainPos)
      );

      // @v4 We can reset the alpha value and restart the simulation
      this.simulation.alpha(1).restart();
    }else{
      const groupCenters = {
    "data": {y : (height / 3)-(height/10), x: width/ 3},
    "development": {y : height / 2-(height/10), x: width/ 2},
    "design": {y : height-(height/2.5), x : width/1.5},
  };
  function nodeDomainPos(d) {
    return groupCenters[d.group].y;
  }
      // @v4 Reset the 'x' force to draw the bubbles to their year centers
      this.simulation.force(
        "y",
        d3.forceY().strength(this.forceStrength).y(nodeDomainPos)
      );

      // @v4 We can reset the alpha value and restart the simulation
      this.simulation.alpha(1).restart();
    }

    },

    //methods for drawing timeline and lables
    drawLandscape() {
    d3.selectAll(".axislabel").remove()
    d3.selectAll(".labeltext").remove()
   
      var circle = this.svg
      .append("g")
        .selectAll("circle")
        .data([32, 57, 112, 293, 32, 57, 112, 293, 25]);

      var circleEnter = circle.enter().append("circle").attr("fill", "white")

      circleEnter.attr("cy", "85%");
      circleEnter.attr("cx", function (d, i) {
        return (window.innerWidth / 9) * i + 75;
      });
      circleEnter.attr("r", 5);
     
      circleEnter.classed("axislabel", true);

   
      var axislabel = this.svg
      .append("g")
        .selectAll("text")
        .data(["2014", "2015", "2016", "2017", "2018", "2020", "2021", "2022", "2023"]);

      var axislabelEnter = axislabel.enter().append("text").text(function (d){return d}).attr("fill", "white").attr("x", function (d, i) {
        return (window.innerWidth / 9) * i + 55;
      }).attr("y", "90%").classed("labeltext", true);



      
    },
    drawPortrait() {
      d3.selectAll(".axislabel").remove()
      d3.selectAll(".labeltext").remove()
      var circle = this.svg
      .append("g")
        .selectAll("circle")
        .data([32, 57, 112, 293, 32, 57, 112, 293, 25]);

      var circleEnter = circle.enter().append("circle").attr("fill", "white");

      circleEnter.attr("cy", function (d, i) {
        return (window.innerHeight / 10) * i + 55;
      });
      circleEnter.attr("cx", "15%");
      circleEnter.attr("r", 5);
      circleEnter.classed("axislabel", true);
      var axislabel = this.svg
      .append("g")
        .selectAll("text")
        .data(["2014", "2015", "2016", "2017", "2018", "2020", "2021", "2022", "2023"]);

      var axislabelEnter = axislabel.enter().append("text").text(function (d){return d}).attr("fill", "white").attr("y", function (d, i) {
        return (window.innerHeight / 10) * i + 80;
      }).attr("x", "10%").classed("labeltext", true);




      
    },
    drawGroupLables(){
      this.domainGroupsAreActive = true
      d3.selectAll(".axislabel").remove()
      d3.selectAll(".labeltext").remove()
      d3.selectAll(".grouplabel").remove()

      if(this.islandscape){

      var label = this.svg
      .append("g")
        .selectAll("label")
        .data(["DATA", "DEVELOPMENT", "DESIGN"]);
      
      var labelEnter = label.enter().append("text").text(function (d){ return d}).attr("fill", "white").classed("grouplabel", true)

      labelEnter.attr("y", "65%");
      labelEnter.attr("x", function (d, i) {
        return (window.innerWidth / 3) * i +150;
      })
  
    }else{

      var label = this.svg
      .append("g")
        .selectAll("label")
        .data(["DATA", "DEV", "DESIGN"]);
      
      var labelEnter = label.enter().append("text").text(function (d){ return d}).attr("fill", "white").classed("grouplabel", true)

      labelEnter.attr("x", "10%");
      labelEnter.attr("y", function (d, i) {
        return (window.innerHeight / 3) * i +150;
      })
  


      
    }

    }
  },
};
</script>

<style lang="scss" scoped>

</style>