/* eslint-disable */

import * as d3 from "d3";

export function force(dom, _id, data) {
  
  var graph = dataToD3Data(data)
  var nodes = graph.nodes
  var relationships = graph.relationships

  var container = d3.select(dom)

  var svg = container.append('svg')
      .attr('width', document.getElementById(_id).offsetWidth)
      .attr('height', document.getElementById(_id).offsetHeight)


  var width = svg.attr("width"),
      height = svg.attr("height");

  var simulation = d3
    .forceSimulation()
    .force("link", d3.forceLink().id(function(d) {
        return d.node
      })
    )
    .force("charge", d3.forceManyBody())
    .force("center", d3.forceCenter(width / 2, height / 2))
    
  var marker= svg.append("marker")
    .attr("id", "resolved")
    .attr("markerUnits", "userSpaceOnUse")
    .attr("viewBox", "0 -5 10 10")
    .attr("refX", 37) // 38
    .attr("refY", 0)  // -1
    .attr("markerWidth", 10)
    .attr("markerHeight", 10)
    .attr("orient", "auto")
    .attr("stroke-width", 2)
    .append("path")
    .attr("d", "M0,-5L10,0L0,5")
    .attr('fill', '#aaa')

  var link = svg
    .append("g")
    .attr("class", "links")
    .selectAll("path")
    .data(relationships)
    .enter()
    .append("path")
    .attr('id', function(d, i) { return 'link' + i })
    .style("stroke",function(d) {
      return "#BBB"
    })
    .attr('fill', function(node){
      return "#FFFFFF"
    })
    .style("pointer-events", "none")
    .style("stroke-width", 0.5)
    .attr("marker-end", "url(#resolved)" )
  
    var line_text =  svg
    .append("g")
    .attr("class", "line_text")
    .selectAll("text")
    .data(relationships)
    .enter()
    .append("text")
    .attr("class", "linetext")
    .attr("dx", 80)
    .attr("dy", -5)
    .style("pointer-events", "none")
    .style("font-size", 14)
    .attr("text-anchor", "middle")
    .attr('fill', function(node){
      return "#000"
    })
    line_text.append('textPath')
    .attr('xlink:href', function(d,i) { return '#link' + i })
    .style("pointer-events", "none")
    .text(function(d) { return d.relationshipProperty })


  var node = svg
    .append("g")
    .attr("class", "nodes-layer")
    .selectAll(".nodes")
    .data(nodes)
    .enter()
    .append("g")
    .attr("class", "nodes")
    .on("click", function(node) {
      console.log(node)
    })
    .call(
      d3
        .drag()
        .on("start", dragstarted)
        .on("drag", dragged)
        .on("end", dragended)
    )
  
  node.append("circle")
  .attr("class", "ring")
  .attr('cx', 0)
  .attr('cy', 0)
  .style("fill", function(node) {
    return 'none'
  })
  .style("stroke", "#6ac6ff80")
  .style("stroke-width", 8)
  .attr("r", 35)

  node.append("circle")
  .attr("class", "outline")
  .attr('cx', 0)
  .attr('cy', 0)
  .style("fill", function(node) {
    return node.group === 1 ? "#ff9800" : '#68BDF6'
  })
  .style("stroke", "#6ac6ff80")
  .style("stroke-width", 2)
  .attr("r", 30)

  node.append("text")
  .attr('y', 5)
  .attr("text-anchor", "middle")
  .style("pointer-events", "none")
  .style("font-size", 16)
  .style('fill',function(node){
      return "#FFFFFF"
  })
  .text(function(d){ return d.node })


  simulation.nodes(nodes).on("tick", ticked)

  simulation.force("link").links(relationships).distance(function() {
    return 200 + Math.floor(Math.random() * (100 - 1) + 1)
  })

  function ticked() {

    node.attr("transform", transform1)


    link.attr('d', function(d) { 
      var path='M '+ d.source.x + ' ' + d.source.y + ' L '+ d.target.x +' '+ d.target.y
      return path
    })


    line_text.attr("transform", function(d, i) {
      if (d.target.x < d.source.x) {
        var bbox = this.getBBox()
        var rx = bbox.x + bbox.width / 2
        var ry = bbox.y + bbox.height / 2
        return 'rotate(180 ' + rx + ' ' + ry +')'
      }
      else {
          return 'rotate(0)'
      }
    })

    
  }

  function dragstarted(d) {
    if (!d3.event.active) simulation.alphaTarget(0.3).restart()
    d.fx = d.x
    d.fy = d.y
  }

  function dragged(d) {
    d.fx = d3.event.x
    d.fy = d3.event.y
  }

  function dragended(d) {
    if (!d3.event.active) simulation.alphaTarget(0)
    d.fx = null
    d.fy = null
  }

  function transform1(d) {
    return "translate(" + d.x + "," + d.y + ")";
  }

  function dataToD3Data (data) {
    var graph = {
      nodes: [],
      relationships: []
    }
    var nodeArr = []
    data.forEach(function(item) {
      nodeArr.push(item.node2)
      nodeArr.push(item.node1)
      graph.relationships.push({
        source: item.node2,
        target: item.node1,
        relationshipProperty: item.relationshipProperty
      })
    })
    
    nodeArr = Array.from(new Set(nodeArr))
    nodeArr.forEach(function(item) {
      graph.nodes.push({node: item})
    })

    return graph
  }
}
