// URL: https://observablehq.com/@aaronduchateau/zoomable-sunburst
// Title: Zoomable Sunburst
// Author: aaronduchateau (@aaronduchateau)
// Version: 341
// Runtime version: 1

window.myData = {
  "name": "flare",
  "children": [
    {
      "name": "analytics",
      "children": [
        {
          "name": "cluster",
          "children": [
            {
              "name": "AgglomerativeCluster",
              "value": 3938
            },
            {
              "name": "CommunityStructure",
              "value": 3812
            },
            {
              "name": "HierarchicalCluster",
              "value": 6714
            },
            {
              "name": "MergeEdge",
              "value": 743
            }
          ]
        },
        {
          "name": "graph",
          "children": [
            {
              "name": "BetweennessCentrality",
              "value": 3534
            },
            {
              "name": "LinkDistance",
              "value": 5731
            },
            {
              "name": "MaxFlowMinCut",
              "value": 7840
            },
            {
              "name": "ShortestPaths",
              "value": 5914
            },
            {
              "name": "SpanningTree",
              "value": 3416
            }
          ]
        },
        {
          "name": "optimization",
          "children": [
            {
              "name": "AspectRatioBanker",
              "value": 7074
            }
          ]
        }
      ]
    },
    {
      "name": "animate",
      "children": [
            {
              "name": "placeHolder",
              "value": 7074
            }
          ]
    },
    {
      "name": "data",
      "children": [
            {
              "name": "placeHolder",
              "value": 7074
            }
          ]
    },
    {
      "name": "display",
      "children": [
            {
              "name": "placeHolder",
              "value": 7074
            }
          ]
    },
    {
      "name": "flex",
      "children": [
            {
              "name": "placeHolder",
              "value": 7074
            }
          ]
    },
    {
      "name": "query",
      "children": [
            {
              "name": "placeHolder",
              "value": 7074
            }
          ]
    },
    {
      "name": "scale",
      "children": [
            {
              "name": "placeHolder",
              "value": 7074
            }
          ]
    },
    {
      "name": "util",
      "children": [
            {
              "name": "placeHolder",
              "value": 7074
            }
          ]
    },
    
  
  ]
};

const m0 = {
  id: "9b4aad062597319b@341",
  variables: [
    {
      inputs: ["md"],
      value: (function(md){return(
md`# Zoomable Sunburst

This variant of a [sunburst diagram](/@d3/sunburst) shows only two layers of the hierarchy at a time. Click a node to zoom in, or the center to zoom out. Compare to an [icicle](/@d3/zoomable-icicle).`
)})
    },
    {
      name: "chart",
      inputs: ["partition","data","d3","DOM","width","color","arc","format","radius"],
      value: (function(partition,data,d3,DOM,width,color,arc,format,radius)
{
  const root = partition(data);

  root.each(d => d.current = d);

  const svg = d3.select(DOM.svg(width, width))
      .style("width", "100%")
      .style("height", "auto")
      .style("font", "10px sans-serif");

  const g = svg.append("g")
      .attr("transform", `translate(${width / 2},${width / 2})`);

  var defs = svg.append("defs");


  function addLinearGradients(i){
    //let anglePI = i;
    var anglePI = (i) * (Math.PI / 180);
    var gradient = defs.append("linearGradient")
     .attr("id", "svgGradient"+ i)
     //.attr("gradientTransform", "rotate(" + i + ")")
     //.attr("gradientTransform", "rotate(-30)")
     .attr("gradientUnits", "objectBoundingBox")
     //.attr("x1", "0%")
     //.attr("x2", "100%")
     //.attr("y1", "0%")
     //.attr("y2", "100%");
    //good working below
    //.attr('x1', Math.round(50 + Math.sin(anglePI) * 50) + '%')
    //.attr('y1', Math.round(50 + Math.cos(anglePI) * 50) + '%')
    //.attr('x2', Math.round(50 + Math.sin(anglePI + Math.PI) * 50) + '%')
    //.attr('y2', Math.round(50 + Ma/th.cos(anglePI + Math.PI) * 50) + '%');

//    .attr('x1', Math.round(1 + Math.sin(anglePI) * 1) + '%')
 //   .attr('y1', Math.round(1 + Math.cos(anglePI) * 1) + '%')
  //  .attr('x2', Math.round(1 + Math.sin(anglePI + Math.PI) * 1) + '%')
 //   .attr('y2', Math.round(1 + Math.cos(anglePI + Math.PI) * 1) + '%');
    .attr('x1', Math.round(50 + Math.sin(anglePI) * 50) + '%')
    .attr('y1', Math.round(50 + Math.cos(anglePI) * 50) + '%')
    .attr('x2', Math.round(50 + Math.sin(anglePI + Math.PI) * 50) + '%')
    .attr('y2', Math.round(50 + Math.cos(anglePI + Math.PI) * 50) + '%');


     //'x1': Math.round(50 + Math.sin(anglePI) * 50) + '%',
    //'y1': Math.round(50 + Math.cos(anglePI) * 50) + '%',
    //'x2': Math.round(50 + Math.sin(anglePI + Math.PI) * 50) + '%',
    //'y2': Math.round(50 + Math.cos(anglePI + Math.PI) * 50) + '%',



  gradient.append("stop")
     .attr('class', 'start')
     .attr("offset", ".3")
     .attr("stop-color", "#74ff69")
     .attr("stop-opacity", 1);

  gradient.append("stop")
     .attr('class', 'end')
     .attr("offset", ".3")
   
     .attr("stop-opacity", 0);

  }

  var i = 0;
  while (i < 360) {
    addLinearGradients(i);
    i++
  }
  

  const path = g.append("g")
    .selectAll("path")
    .data(root.descendants().slice(1))
    .join("path")
      //.attr("fill", "url(#svgGradient3)")
      .attr("fill", d => gradientAssign(d.current))
      .attr("fill-opacity", d => arcVisible(d.current) ? (d.children ? 0.6 : 0) : 0)
      .attr("d", d => arc(d.current))
      .attr("stroke-width", 2)
      .attr("class", "pie__white_radient2")
      .attr("stroke", "#e0e0e0");

      

      function gradientAssign(d){
        const simX = (d.x0 + d.x1) / 2 * 180 / Math.PI;
        return "url(#svgGradient" + parseInt(simX) + ")";
        return simX;
        console.log('TEST'); 
        console.log(parseInt(simX));
      }

  path.filter(d => d.children)
      .style("cursor", "pointer")
      .on("click", clicked);

  path.append("title")
      .text(d => `${d.ancestors().map(d => d.data.name).reverse().join("/")}\n${format(d.value)}`);

  const label = g.append("g")
      .attr("pointer-events", "none")
      .attr("text-anchor", "middle")
      .style("user-select", "none")
    .selectAll("text")
    .data(root.descendants().slice(1))
    .join("text")
      .attr("dy", "0.35em")
      .attr("fill-opacity", d => +labelVisible(d.current))
      .attr("transform", d => labelTransform(d.current))
      .attr("fill","#555555")
      .text(d => d.data.name);
//aaron added slop below


   const label2 = g.append("g")
      .attr("pointer-events", "none")
      .attr("text-anchor", "middle")
      .style("user-select", "none")
    .selectAll("text")
    .data(root.descendants().slice(1))
    .join("text")
      .attr("dy", ".65em")
      .attr('font-size', "40px" )
      .attr("fill-opacity", d => +labelVisible(d.current))
      .attr("transform", d => labelTransform2(d.current))
      .attr("style","font-family:FontAwesome;")
      .attr("fill", "#e2e2e2")
      .text('\uf24e');



//end aaron added sloop
  const parent = g.append("circle")
      .datum(root)
      .attr("r", radius)
      .attr("fill", "white")
      .attr("pointer-events", "all")
      .on("click", clicked);

  function clicked(p) {
    parent.datum(p.parent || root);

    root.each(d => d.target = {
      x0: Math.max(0, Math.min(1, (d.x0 - p.x0) / (p.x1 - p.x0))) * 2 * Math.PI,
      x1: Math.max(0, Math.min(1, (d.x1 - p.x0) / (p.x1 - p.x0))) * 2 * Math.PI,
      y0: Math.max(0, d.y0 - p.depth),
      y1: Math.max(0, d.y1 - p.depth)
    });

    const t = g.transition().duration(750);

    // Transition the data on all arcs, even the ones that aren’t visible,
    // so that if this transition is interrupted, entering arcs will start
    // the next transition from the desired position.
    path.transition(t)
        .tween("data", d => {
          const i = d3.interpolate(d.current, d.target);
          return t => d.current = i(t);
        })
      .filter(function(d) {
        return +this.getAttribute("fill-opacity") || arcVisible(d.target);
      })
        .attr("fill-opacity", d => arcVisible(d.target) ? (d.children ? 0.6 : 0.4) : 0)
        .attrTween("d", d => () => arc(d.current));

    label.filter(function(d) {
        return +this.getAttribute("fill-opacity") || labelVisible(d.target);
      }).transition(t)
        .attr("fill-opacity", d => +labelVisible(d.target))
        .attrTween("transform", d => () => labelTransform(d.current));
     label2.filter(function(d) {
        return +this.getAttribute("fill-opacity") || labelVisible(d.target);
      }).transition(t)
        .attr("fill-opacity", d => +labelVisible(d.target))
        .attrTween("transform", d => () => labelTransform2(d.current));
  }
  
  function arcVisible(d) {
    return d.y1 <= 3 && d.y0 >= 1 && d.x1 > d.x0;
  }

  function labelVisible(d) {
    return d.y1 <= 3 && d.y0 >= 1 && (d.y1 - d.y0) * (d.x1 - d.x0) > 0.03;
  }

  function labelTransform(d) {
    //this was original
    //const x = ((d.x0 + d.x1) / 2 * 180 / Math.PI)  + 10;
    //const y = (d.y0 + d.y1) / 2 * radius;
    const y = (d.y0 + d.y1) / 2 * radius;
    const x = ((d.x0 + d.x1) / 2 * 180 / Math.PI)  + 10;
    console.log(`rotate(${x - 90}) translate(${y},0) rotate(${x < 180 ? 0 : 180})`);
    return `rotate(${x - 90}) translate(${y},0) rotate(${x < 180 ? 0 : 180})`;

  }

   function labelTransform2(d) {
    const x = (d.x0 + d.x1) / 2 * 180 / Math.PI;
    const y = ((d.y0 + d.y1) / 2 * radius) + 10;
    console.log(`rotate(${x - 90}) translate(${y},0) rotate(${x < 180 ? 0 : 180})`);
    return `rotate(${x - 90}) translate(${y},0) rotate(${x < 180 ? 0 : 180}) rotate(${x < 180 ? 90 : 270})`;

  }

  return svg.node();
}
)
    },
    {
      name: "data",
      inputs: ["d3"],
      //value: (function(d3){return(
//d3.json("https://raw.githubusercontent.com/d3/d3-hierarchy/v1.1.8/test/data/flare.json")
//)}) 
      value: myData
    },
    {
      name: "partition",
      inputs: ["d3"],
      value: (function(d3){return(
data => {
  const root = d3.hierarchy(data)
      .sum(d => d.value)
      .sort((a, b) => b.value - a.value);
  return d3.partition()
      .size([2 * Math.PI, root.height + 1])
    (root);
}
)})
    },
    {
      name: "color",
      inputs: ["d3","data"],
      value: (function(d3,data){return(
d3.scaleOrdinal(d3.quantize(d3.interpolateRainbow, data.children.length + 1))
)})
    },
    {
      name: "format",
      inputs: ["d3"],
      value: (function(d3){return(
d3.format(",d")
)})
    },
    {
      name: "width",
      value: (function(){return(
932
)})
    },
    {
      name: "radius",
      inputs: ["width"],
      value: (function(width){return(
width / 6
)})
    },
    {
      name: "arc",
      inputs: ["d3","radius"],
      value: (function(d3,radius){return(
//d3.arc()
//    .startAngle(d => d.x0)
//    .endAngle(d => d.x1)
//    .padAngle(d => Math.min((d.x1 - d.x0) / 2, 0.005))
//    .padRadius(radius * 1.5)
//    .innerRadius(d => d.y0 * radius)
//    .outerRadius(d => Math.max(d.y0 * radius, d.y1 * radius - 1))
//)})
d3.arc()
    .startAngle(d => d.x0)
    .endAngle(d => d.x1)
    .padAngle(d => Math.min((d.x1 - d.x0) / 2, 0.005))
    // change pad
    //.padRadius(radius * 1.5)
    .padRadius(radius * 11.8)
    .innerRadius(d => d.y0 * radius + 11)
    .outerRadius(d => Math.max(d.y0 * radius, d.y1 * radius - 1))
)})
    },
    {
      name: "d3",
      inputs: ["require"],
      value: (function(require){return(
require("d3@5")
)})
    }
  ]
};

const notebook = {
  id: "9b4aad062597319b@341",
  modules: [m0]
};



export default notebook;
