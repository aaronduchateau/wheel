//tsc buildSVG.ts
var Wheel = /** @class */ (function () {
    function Wheel(data, d3, width) {
        var _this = this;
        if (width === void 0) { width = 932; }
        this.clicked = function (p) {
            //exercise the callback associated with the object
            p.data.callback && p.data.callback();
            if (p.data.blockTransition) {
                return false;
            }
            //check for a 'drill down depth of 0' against the object, if so hide the back button
            var breadcrumb = _this.d3.select("#breadCrumb");
            if (p.depth === 0) {
                _this.d3.select("#backButton").transition().attr('opacity', 0);
                breadcrumb.transition().attr("font-size", 50);
                breadcrumb.text("Main Menu");
            }
            else {
                _this.d3.select("#backButton").transition().attr('opacity', 1);
                breadcrumb.transition().attr("font-size", 40 / (p.depth + 1));
                breadcrumb.text(function (d) { return "" + p.ancestors().map(function (d) { return d.data.name; }).reverse().join("/"); });
            }
            //just a cool animation with our outer circle
            _this.outerCircle.transition().duration(500).attr('opacity', 0).attr('stroke-width', 700).attr('r', 0).attr('stroke', '#74ff69').transition().duration(500).attr('opacity', 1).attr('r', _this.radius + _this.radius + 49).attr('stroke-width', 18).transition().duration(500).attr('stroke', '#e0e0e0').attr('r', _this.radius + _this.radius + 44).attr('stroke-width', 10);
            _this.parent.datum(p.parent || _this.root);
            _this.root.each(function (d) { return d.target = {
                x0: Math.max(0, Math.min(1, (d.x0 - p.x0) / (p.x1 - p.x0))) * 2 * Math.PI,
                x1: Math.max(0, Math.min(1, (d.x1 - p.x0) / (p.x1 - p.x0))) * 2 * Math.PI,
                y0: Math.max(0, d.y0 - p.depth),
                y1: Math.max(0, d.y1 - p.depth)
            }; });
            var t = _this.g.transition().duration(750);
            // Transition the data on all arcs, even the ones that aren’t visible,
            // so that if this transition is interrupted, entering arcs will start
            // the next transition from the desired position.
            //a bunch of bullshit rebindings to avoid this context issues. 
            var arcVisible = _this.arcVisible;
            var arc = _this.arc;
            var labelVisible = _this.labelVisible;
            var labelVisible2 = _this.labelVisible2;
            var labelTransform = _this.labelTransform;
            var labelTransform2 = _this.labelTransform2;
            var radius = _this.radius;
            _this.path.transition(t)
                .tween("data", function (d) {
                var i = _this.d3.interpolate(d.current, d.target);
                return function (t) { return d.current = i(t); };
            })
                .filter(function (d) {
                return +this.getAttribute("fill-opacity") || true;
            })
                //only shows nodes with children, option here to toggle visibility if no children i.e. ((d.children ? 1 : 0.4))
                .attr("fill-opacity", function (d) { return arcVisible(d.target) ? (d.children ? 1 : 1) : 0; })
                .attr("stroke-opacity", function (d) { return arcVisible(d.target) ? (d.children ? 1 : 1) : 0; })
                .attrTween("d", function (d) { return function () { return arc(d.current, radius); }; });
            _this.label.filter(function (d) {
                return +this.getAttribute("fill-opacity") || labelVisible(d.target);
            }).transition(t)
                .attr("fill-opacity", function (d) { return +labelVisible(d.target); })
                .attrTween("transform", function (d) { return function () { return labelTransform(d.current, radius); }; });
            _this.label2.filter(function (d) {
                return +this.getAttribute("fill-opacity") || labelVisible2(d.target);
            }).transition(t)
                .attr("fill-opacity", function (d) { return +labelVisible2(d.target); })
                .attrTween("transform", function (d) { return function () { return labelTransform2(d.current, radius); }; });
        };
        this.width = width;
        this.radius = (this.width / 6);
        this.data = data;
        this.d3 = d3;
    }
    Wheel.prototype.partition = function (d3, data) {
        var root = d3.hierarchy(data)
            .sum(function (d) { return d.value; })
            .sort(function (a, b) { return b.value - a.value; });
        return d3.partition()
            .size([2 * Math.PI, root.height + 1])(root);
    };
    Wheel.prototype.arc = function (c, r) {
        var _this = this;
        return (this.d3.arc()
            .startAngle(function (d) { return d.x0; })
            .endAngle(function (d) { return d.x1; })
            .padAngle(function (d) { return Math.min((d.x1 - d.x0) / 2, 0.005); })
            .padRadius((r || this.radius) * 0)
            .innerRadius(function (d) { return d.y0 * (r || _this.radius) + 35; })
            .outerRadius(function (d) { return Math.max(d.y0 * (r || _this.radius), d.y1 * (r || _this.radius) + 40); })(c));
    };
    Wheel.prototype.arcVisible = function (d) {
        return d.y1 <= 2 && d.y0 >= 1 && d.x1 > d.x0;
    };
    Wheel.prototype.labelVisible = function (d) {
        return (d.y1 <= 2 && d.y0 >= 1 && (d.y1 - d.y0) * (d.x1 - d.x0) > 0.03);
    };
    Wheel.prototype.labelVisible2 = function (d) {
        return (d.y1 <= 2 && d.y0 >= 1 && (d.y1 - d.y0) * (d.x1 - d.x0) > 0.03) ? .4 : 0;
    };
    Wheel.prototype.labelTransform = function (d, r) {
        console.log(d);
        var radius = r || this.radius;
        var x = (d.x0 + d.x1) / 2 * 180 / Math.PI;
        var y = ((d.y0 + d.y1) / 2 * radius) + 150;
        return "rotate(" + (x - 90) + ") translate(" + y + ",0) rotate(" + (x < 180 ? 0 : 180) + ") rotate(" + (x < 180 ? 90 : 270) + ") rotate(" + (x > 90 && x < 270 ? 180 : 0) + ")";
    };
    Wheel.prototype.labelTransform2 = function (d, r) {
        var radius = r || this.radius;
        var x = (d.x0 + d.x1) / 2 * 180 / Math.PI;
        var y = ((d.y0 + d.y1) / 2 * radius) + 50;
        return "rotate(" + (x - 90) + ") translate(" + y + ",0) rotate(" + (x < 180 ? 0 : 180) + ") rotate(" + (x < 180 ? 90 : 270) + ")";
    };
    Wheel.prototype.gradientAssign = function (d) {
        var simX = (d.x0 + d.x1) / 2 * 180 / Math.PI;
        simX = parseInt(simX.toString());
        var levelCompletePostFix = d.data.percentageComplete ? d.data.percentageComplete : "0";
        //adds the angle and the amount complete from the json file;
        return "url(#svgGradient" + simX + "-" + levelCompletePostFix + ")";
        //return simX;
    };
    Wheel.prototype.addLinearGradients = function (i, offset, defs) {
        var offsetLabel = offset.toString().replace(".", "");
        var anglePI = (i) * (Math.PI / 180);
        var gradient = defs.append("linearGradient")
            .attr("id", "svgGradient" + i + "-" + offsetLabel)
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
    };
    //Main functionality below
    Wheel.prototype.renderWheel = function () {
        var _this = this;
        var width = this.width;
        var radius = this.radius;
        var data = this.data;
        var d3 = this.d3;
        this.root = this.partition(d3, data);
        this.root.each(function (d) { return d.current = d; });
        //this replaces the original observable notebooks 'DOM' functionality
        var svgPre = document.createElementNS("http://www.w3.org/2000/svg", "svg");
        svgPre.setAttribute('width', width.toString());
        svgPre.setAttribute('height', width.toString());
        svgPre.setAttribute('viewBox', "0,0," + width + "," + width);
        var svg = d3.select(svgPre)
            .style("width", "100%")
            .style("height", "auto")
            .style("font", "10px sans-serif")
            .attr("class", "pie__white_radient_dropshadow");
        this.g = svg.append("g")
            .attr("transform", "translate(" + width / 2 + "," + width / 2 + ")");
        var defs = svg.append("defs");
        //add definitions for all our possible linear gradients
        var i1 = 0;
        var offset = 0;
        while (offset <= 1) {
            while (i1 < 360) {
                this.addLinearGradients(i1, offset, defs);
                i1++;
            }
            offset = offset + .25;
            i1 = 0;
        }
        //add circle for visual indication of outside stroke
        this.outerCircle = this.g.append("circle")
            .attr("id", "outerCircle")
            .attr("r", 0)
            .attr("stroke-width", 200)
            .attr("fill-opacity", 0)
            .attr("stroke", "#74ff69");
        this.path = this.g.append("g")
            .selectAll("path")
            .data(this.root.descendants().slice(1))
            .join("path")
            .attr("fill", function (d) { return _this.gradientAssign(d.current); })
            .attr("fill-saved", function (d) { return _this.gradientAssign(d.current); })
            .attr("fill-opacity", function (d) { return _this.arcVisible(d.current) ? (d.children ? 1 : 1) : 0; })
            //same rules as arcVisible are fine for this. 
            .attr("stroke-opacity", function (d) { return _this.arcVisible(d.current) ? 1 : 0; })
            .attr("d", function (d) { return _this.arc(d.current); })
            .attr("stroke-width", 1)
            .attr("class", "pie__white_radient2")
            .attr("stroke", "#e0e0e0");
        //Initially this fed of children, lets modify it to feed off of 'complete'    
        //prev: path.filter(d => d.children)
        this.path.filter(function (d) { return d.data.percentageComplete != 1; })
            .style("cursor", "pointer")
            .on("click", this.clicked).on('mouseover', function (d, i) {
            d3.select(this).attr('fill', '#0095ff');
        })
            .on('mouseout', function (d, i) {
            var fillStringRef = d3.select(this).attr("fill-saved");
            d3.select(this).attr('fill', fillStringRef);
        });
        this.path.append("title")
            .text(function (d) { return d.ancestors().map(function (d) { return d.data.name; }).reverse().join("/") + "\n"; });
        this.label = this.g.append("g")
            .attr("pointer-events", "none")
            .attr("text-anchor", "middle")
            .style("user-select", "none")
            .selectAll("text")
            .data(this.root.descendants().slice(1))
            .join("text")
            .attr("font-weight", 100)
            .attr("letter-spacing", "2.5px")
            .attr("dy", "0.35em")
            .attr('font-size', "20px")
            .attr("fill-opacity", function (d) { return +_this.labelVisible(d.current); })
            .attr("transform", function (d) { return _this.labelTransform(d.current); })
            .attr("fill", "#555555")
            .attr("style", "font-family:FranklinGothic-Heavy, Frankin Gothic, sans-serif;")
            .text(function (d) { return d.data.name; });
        // label2 handles the icons  
        this.label2 = this.g.append("g")
            .attr("pointer-events", "none")
            .attr("text-anchor", "middle")
            .style("user-select", "none")
            .selectAll("text")
            .data(this.root.descendants().slice(1))
            .join("text")
            .attr("dy", ".65em")
            .attr('font-size', "60px")
            .attr("fill-opacity", function (d) { return +_this.labelVisible2(d.current); })
            .attr("transform", function (d) { return _this.labelTransform2(d.current); })
            .attr("style", "font-family:FontAwesome;")
            .attr("fill", "#55555")
            .text(function (d) { return d.data.icon || '\uf24e'; });
        // this is the cirle, which right now, is just a circle. 
        this.parent = this.g.append("circle")
            .datum(this.root)
            .attr("r", this.radius + 40)
            .attr("fill", "white");
        // this is the 'BreadCrumnb text' #breadCrumb
        this.g.append("text")
            .datum(this.root)
            .attr("dy", "1.55em")
            .attr('font-size', "50")
            .attr("style", "font-family:FranklinGothic-Heavy, Frankin Gothic, sans-serif;")
            .attr("opacity", ".7")
            .attr("id", "breadCrumb")
            .attr("fill", "#55555")
            .style('text-anchor', 'middle')
            .text("Main Menu");
        // this is the 'back button' #backButton
        this.g.append("text")
            .datum(this.root)
            .attr("dy", "2.35em")
            .attr("dx", "-.55em")
            .attr('font-size', "60px")
            .attr("style", "font-family:FontAwesome;")
            .attr("opacity", "0")
            .attr("id", "backButton")
            .attr("pointer-events", "all")
            .attr("fill", "#e5e5e5")
            .text("\uf04a")
            .style('cursor', 'pointer')
            .on('mouseover', function (d, i) {
            d3.select(this).transition()
                //.ease('cubic-out')
                //.duration('200')
                .attr('font-size', "61px")
                .attr('fill', '#0095ff');
        })
            .on('mouseout', function (d, i) {
            d3.select(this).transition()
                //.ease('cubic-out')
                //.duration('200')
                .attr('font-size', "60px")
                .attr('fill', '#e5e5e5');
        }).on("click", this.clicked);
        this.outerCircle.transition().delay(500).duration(500).attr('r', radius + radius + 54).attr('stroke-width', 30).transition().duration(500).attr('stroke', '#e0e0e0').attr('r', radius + radius + 44).attr('stroke-width', 10);
        return svg.node();
    };
    Wheel.prototype.update = function (data) {
        this.data = data;
        return this.renderWheel();
    };
    return Wheel;
}());
