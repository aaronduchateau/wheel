window.myData = {
  "name": "Main Menu",
  "children": [
    {
      "name": "Start Here",
      "percentageComplete": "025",
      "icon" : "\uf135",
      "blockTransition" : false,
      //"callback": ()=>{alert("Example of callback fired off with no transition executed")},
      "children": [
        {
          "name": "cluster",
          "percentageComplete": "05",
          "children": [
            {
              "name": "Child pie slice 1",
              "icon": "\uf494",
              "value": 100
            },
            {
              "name": "Child pie slice 2",
              "value": 100
            },
            {
              "name": "Child pie slice 3",
              "value": 100
            },
            {
              "name": "Child pie slice 4",
              "value": 200
            }
          ]
        },
        {
          "name": "Starting Up",
          "percentageComplete": "025",
          "icon": "\uf494",
          "children": [
            {
              "name": "BetweennessCentrality",
              "value": 100
            },
            {
              "name": "LinkDistance",
              "value": 100
            },
            {
              "name": "MaxFlowMinCut",
              "value": 100
            },
            {
              "name": "ShortestPaths",
              "value": 100
            },
            {
              "name": "SpanningTree",
              "value": 100
            }
          ]
        },
        {
          "name": "optimization",
          "percentageComplete": "025",
          "children": [
            {
              "name": "AspectRatioBanker",
              "value": 1000,
              "icon": "\uf494",
            }
          ]
        }
      ]
    },
    {
      "name": "Starting Up",
      "percentageComplete": "1",
      "icon": "\uf0e7",
      "children": [
            {
              "name": "placeHolder",
              "value": 2000
            }
          ]
    },
    {
      "name": "Nonprofits",
      "percentageComplete": "1",
      "icon": "\uf200",
      "children": [
            {
              "name": "placeHolder",
              "value": 2000
            }
          ]
    },
    {
      "name": "Trade Secrets",
      "percentageComplete": "1",
      "icon": "\uf21b",
      "children": [
            {
              "name": "placeHolder",
              "value": 2000
            }
          ]
    },
    {
      "name": "Trademarks",
      "percentageComplete": "05",
      "icon": "\uf25c",
      "children": [
            {
              "name": "placeHolder",
              "value": 2000
            }
          ]
    },
    {
      "name": "Patents",
      "icon": "\uf121",
      "children": [
            {
              "name": "placeHolder",
              "value": 2000
            }
          ]
    },
    {
      "name": "Website",
      "icon": "\uf0ac",
      "children": [
            {
              "name": "placeHolder",
              "value": 2000
            }
          ]
    },
    {
      "name": "Hiring Staff",
      "icon": "\uf002",
      "value": 2000
    },
    {
      "name": "Copyrights",
      "icon": "\uf1f9",
      "blockTransition" : true,
      "callback": ()=>{alert("Example of callback fired off with no transition executed")},
      "children": [
            {
              "name": "placeHolder",
              "value": 2000
            }
          ]
    },
    {
      "name": "After Formation",
      "icon": "\uf058",
      "callback": ()=>{ alert('This is an example of a callback to be exectued before transition')}, 
      "children": [
            {
              "name": "placeHolder",
              "value": 2000
            }
          ]
    },
    
  
  ]
};


const renderChart = (data) => {

	//definitions below
	const width = 932;
	const radius = width / 6;
	const d3 = window.d3;

	const partition = (d3, data) => {
	  const root = d3.hierarchy(data)
	      .sum(d => d.value)
	      .sort((a, b) => b.value - a.value);
	  return d3.partition()
	      .size([2 * Math.PI, root.height + 1])
	    (root);
	}

	const arc = (c) => {
	   return (
	   	d3.arc()
	    .startAngle(d => d.x0)
	    .endAngle(d => d.x1)
	    .padAngle(d => Math.min((d.x1 - d.x0) / 2, 0.005))
	    .padRadius(radius * 0)
	    .innerRadius(d => d.y0 * radius + 35)
	    .outerRadius(d => Math.max(d.y0 * radius, d.y1 * radius + 40))(c)
	  );
	}

	//Main functionality below
	const root = partition(d3, data);

	root.each(d => d.current = d);

	//this replaces the original observable notebooks 'DOM' functionality
	var svgPre = document.createElementNS("http://www.w3.org/2000/svg", "svg");
	svgPre.setAttribute('width', width);
	svgPre.setAttribute('height', width);
	svgPre.setAttribute('viewBox', "0,0," + width + "," + width);

	const svg = d3.select(svgPre)
	  .style("width", "100%")
	  .style("height", "auto")
	  .style("font", "10px sans-serif")
	  .attr("class", "pie__white_radient_dropshadow");

	const g = svg.append("g")
	  .attr("transform", `translate(${width / 2},${width / 2})`);

	var defs = svg.append("defs");


	function addLinearGradients(i, offset){
	var offsetLabel = offset.toString().replace(".","");
	var anglePI = (i) * (Math.PI / 180);
	var gradient = defs.append("linearGradient")
	 .attr("id", "svgGradient"+ i + "-" + offsetLabel)
	 .attr("gradientUnits", "objectBoundingBox")
	 .attr('x1', Math.round(50 + Math.sin(anglePI) * 50) + '%')
	 .attr('y1', Math.round(50 + Math.cos(anglePI) * 50) + '%')
	 .attr('x2', Math.round(50 + Math.sin(anglePI + Math.PI) * 50) + '%')
	 .attr('y2', Math.round(50 + Math.cos(anglePI + Math.PI) * 50) + '%');


	gradient.append("stop")
	 .attr('class', 'start')
	 .attr("offset", offset)
	 .attr("stop-color", "#74ff69")
	 .attr("stop-opacity", 1);

	gradient.append("stop")
	 .attr('class', 'end')
	 .attr("offset", offset)
	 .attr("stop-opacity", 0);
	}

	var i1 = 0;
	var offset = 0;
	while (offset <= 1) {
	while (i1 < 360) {
	  addLinearGradients(i1, offset);
	  i1++
	}
	offset = offset + .25;
	i1 = 0;
	}


	const path = g.append("g")
	.selectAll("path")
	.data(root.descendants().slice(1))
	.join("path")
	  .attr("fill", d => gradientAssign(d.current))
	  .attr("fill-saved", d => gradientAssign(d.current))
	  .attr("fill-opacity", d => arcVisible(d.current) ? (d.children ? 1 : 1) : 0)
	  //same rules as arcVisible are fine for this. 
	  .attr("stroke-opacity", d => arcVisible(d.current) ? 1 : 0)
	  .attr("d", d => arc(d.current))
	  .attr("stroke-width", 10)
	  .attr("class", "pie__white_radient2")
	  .attr("stroke", "#e0e0e0");

	  

	  function gradientAssign(d){
	    const simX = (d.x0 + d.x1) / 2 * 180 / Math.PI;
	   
	    const levelCompletePostFix = d.data.percentageComplete ?  d.data.percentageComplete : "0";
	    //adds the angle and the amount complete from the json file;
	    return "url(#svgGradient" + parseInt(simX) + "-" + levelCompletePostFix + ")";
	    //return simX;
	  }

	//Initially this fed of children, lets modify it to feed off of 'complete'    
	//path.filter(d => d.children)
	path.filter(d => d.data.percentageComplete != 1)
	  .style("cursor", "pointer")
	  .on("click", clicked).on('mouseover', function(d,i) {
	    d3.select(this).attr('fill', '#0095ff');
	    })
	  .on('mouseout', function(d,i) {
	    var fillStringRef = d3.select(this).attr("fill-saved");
	    d3.select(this).attr('fill', fillStringRef);
	  });



	path.append("title")
	  .text(d => `${d.ancestors().map(d => d.data.name).reverse().join("/")}\n`);

	const label = g.append("g")
	  .attr("pointer-events", "none")
	  .attr("text-anchor", "middle")
	  .style("user-select", "none")
	.selectAll("text")
	.data(root.descendants().slice(1))
	.join("text")
	  .attr("dy", "0.35em")
	  .attr('font-size', "20px" )
	  .attr("fill-opacity", d => +labelVisible(d.current))
	  .attr("transform", d => labelTransform(d.current))
	  .attr("fill","#555555")
	  .attr("style","font-family:FranklinGothic-Heavy, Frankin Gothic, sans-serif;")
	  .text(d => d.data.name);

	// label2 handles the icons  
	const label2 = g.append("g")
	  .attr("pointer-events", "none")
	  .attr("text-anchor", "middle")
	  .style("user-select", "none")
	.selectAll("text")
	.data(root.descendants().slice(1))
	.join("text")
	  .attr("dy", ".65em")
	  .attr('font-size', "60px" )
	  .attr("fill-opacity", d => +labelVisible2(d.current))
	  .attr("transform", d => labelTransform2(d.current))
	  .attr("style","font-family:FontAwesome;")
	  .attr("fill", "#55555")
	  .text(d => d.data.icon || '\uf24e');


	// this is the cirle, which right now, is just a circle. 
	const parent = g.append("circle")
	  .datum(root)
	  .attr("r", radius + 40)
	  .attr("fill", "white")

	// this is the 'BreadCrumnb text' #breadCrumb
	g.append("text")
	.datum(root)
	  .attr("dy", "1.55em")
	  .attr('font-size', "50" )
	  .attr("style","font-family:FranklinGothic-Heavy, Frankin Gothic, sans-serif;")
	  .attr("opacity", "1")
	  .attr("id", "breadCrumb")
	  .attr("fill", "#e5e5e5")
	  .style('text-anchor', 'middle')
	  .text("Main Menu")


	// this is the 'back button' #backButton
	g.append("text")
	.datum(root)
	  .attr("dy", "2.35em")
	  .attr("dx", "-.55em")
	  .attr('font-size', "60px" )
	  .attr("style","font-family:FontAwesome;")
	  .attr("opacity", "0")
	  .attr("id", "backButton")
	  .attr("pointer-events", "all")
	  .attr("fill", "#e5e5e5")
	  .text("\uf04a")
	.style('cursor', 'pointer')
	.on('mouseover', function(d,i) {
	  d3.select(this).transition()
	    //.ease('cubic-out')
	    //.duration('200')
	    .attr('font-size', "61px")
	    .attr('fill', '#0095ff');
	})
	.on('mouseout', function(d,i) {
	  d3.select(this).transition()
	    //.ease('cubic-out')
	    //.duration('200')
	    .attr('font-size', "60px")
	    .attr('fill', '#e5e5e5');
	}).on("click", clicked);



	function clicked(p, e) {

	//exercise the callback associated with the object
	p.data.callback && p.data.callback();
	if(p.data.blockTransition){
	  return false;
	}
	//check for a 'drill down depth of 0' against the object, if so hide the back button
	var breadcrumb = d3.select("#breadCrumb");
	if(p.depth === 0){
	  d3.select("#backButton").transition().attr('opacity', 0);
	  breadcrumb.transition().attr("font-size", 50);
	  breadcrumb.text("Main Menu");
	} else {
	  d3.select("#backButton").transition().attr('opacity', 1);
	  breadcrumb.transition().attr("font-size", 60 / (p.depth + 1));
	  breadcrumb.text(d => `${p.ancestors().map(d => d.data.name).reverse().join("/")}`);
	}

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
	    //only shows nodes with children, option here to toggle visibility if no children i.e. ((d.children ? 1 : 0.4))
	    .attr("fill-opacity", d => arcVisible(d.target) ? (d.children ? 1 : 1) : 0)
	    .attr("stroke-opacity", d => arcVisible(d.target) ? (d.children ? 1 : 1) : 0)
	    .attrTween("d", d => () => arc(d.current));

	label.filter(function(d) {
	    return +this.getAttribute("fill-opacity") || labelVisible(d.target);
	  }).transition(t)
	    .attr("fill-opacity", d => +labelVisible(d.target))
	    .attrTween("transform", d => () => labelTransform(d.current));
	 label2.filter(function(d) {
	    return +this.getAttribute("fill-opacity") || labelVisible2(d.target);
	  }).transition(t)
	    .attr("fill-opacity", d => +labelVisible2(d.target))
	    .attrTween("transform", d => () => labelTransform2(d.current));
	}

	function arcVisible(d) {
		return d.y1 <= 2 && d.y0 >= 1 && d.x1 > d.x0;
	}

	function labelVisible(d) {
		return d.y1 <= 2 && d.y0 >= 1 && (d.y1 - d.y0) * (d.x1 - d.x0) > 0.03;
	}

	function labelVisible2(d) {
		return (d.y1 <= 2 && d.y0 >= 1 && (d.y1 - d.y0) * (d.x1 - d.x0) > 0.03) ? .4 : 0;
	}

	function labelTransform(d) {
		const x = (d.x0 + d.x1) / 2 * 180 / Math.PI;
		const y = ((d.y0 + d.y1) / 2 * radius) + 150;
		return `rotate(${x - 90}) translate(${y},0) rotate(${x < 180 ? 0 : 180}) rotate(${x < 180 ? 90 : 270}) rotate(${x > 90 && x < 270 ? 180 : 0})`;
	}

	function labelTransform2(d) {
		const x = (d.x0 + d.x1) / 2 * 180 / Math.PI;
		const y = ((d.y0 + d.y1) / 2 * radius) + 50;
		return `rotate(${x - 90}) translate(${y},0) rotate(${x < 180 ? 0 : 180}) rotate(${x < 180 ? 90 : 270})`;

	}

	return svg.node();

}