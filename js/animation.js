class Node {
    constructor(value) {
      this.value = value;
      this.adjacents = []; // adjacency list
    }
  
    addAdjacent(node) {
      this.adjacents.push(node);
    }
  
    removeAdjacent(node) {
      const index = this.adjacents.indexOf(node);
      if(index > -1) {
        this.adjacents.splice(index, 1);
        return node;
      }
    }
  
    getAdjacents() {
      return this.adjacents;
    }
  
    isAdjacent(node) {
      return this.adjacents.indexOf(node) > -1;
    }
  }
  
  function getNeighbors(gridData){
    nodes = []
    gridData.forEach(row => row.forEach(node => {nodes.push(new Node([node.x, node.y, node.click])); }));
  
    for(var i = 0; i < nodes.length; i++){
      if( (i+1)%10 != 0 && nodes[i].value[2] != 3 && nodes[i+1].value[2] != 3){
        // Has a neighbor to the right
        nodes[i].addAdjacent([nodes[i+1], i+1]);
        nodes[i+1].addAdjacent([nodes[i], i]);
      }
  
      if( i < 90 && nodes[i].value[2] != 3 && nodes[i+10].value[2] != 3){
        // Has a neighbor below
        nodes[i].addAdjacent([nodes[i+10], i+10]);
        nodes[i+10].addAdjacent([nodes[i], i]);
      }
  
  
    }
  
   // console.log(nodes);
  
   return nodes;
  
  }
  
  function updateGrid(gridData){
      var grid = d3.select("#grid")
  
      d3.selectAll('.square')
         .transition()
          .style('fill', function(d){ var c = gridData[(d.y-1)/50][(d.x-1)/50]['click']; 
            if (c == 7) { return "#67a9cf";}
            if (c == 4) { return "#90ee90";}
            if (c == 0 ) { return "#d1e5f0"; }
            if (c == 1 ) { return "#2166ac"; }
            if (c == 2 ) { return "#b2182b"; }
            if (c == 3 ) { return"#838690"; }});
  }
  
  function resetGrid(gridData) {
    var grid = d3.select("#grid")

  
    d3.selectAll('.square')
        .transition()
        .style('fill', function(d){ 
            var c = gridData[(d.y-1)/50][(d.x-1)/50]['click']; 
            if (c == 4 || c == 7) { 
                gridData[(d.y-1)/50][(d.x-1)/50]['click'] = 0;
                return "#d1e5f0";
            }
            if (c == 0 ) { return "#d1e5f0"; }
            if (c == 1 ) { return "#2166ac"; }
            if (c == 2 ) { return "#b2182b"; }
            if (c == 3 ) { return"#838690"; }
        });
    
  }
  
  function updatePath(gridData, path){
  nodes = getNeighbors(gridData);
  for(var i = 1; i < path.length-1; i++){
    var currNode = nodes[path[i]];
    var xIndex = (currNode.value[0]-1)/50;
    var yIndex = (currNode.value[1]-1)/50;
    gridData[yIndex][xIndex]['click'] = 4;
  }
  
    updateGrid(gridData);
  
  }
  
  
  
  
  function gridData() {
      var data = new Array();
      var xpos = 1; //starting xpos and ypos at 1 so the stroke will show when we make the grid below
      var ypos = 1;
      var width = 50;
      var height = 50;
      var click = 0;
  
      // iterate for rows 
      for (var row = 0; row < 10; row++) {
          data.push( new Array() );
  
          // iterate for cells/columns inside rows
          for (var column = 0; column < 10; column++) {
              data[row].push({
                  x: xpos,
                  y: ypos,
                  width: width,
                  height: height,
                  click: click
              })
              // increment the x position. I.e. move it over by 50 (width variable)
              xpos += width;
          }
          // reset the x position after a row is complete
          xpos = 1;
          // increment the y position for the next row. Move it down 50 (height variable)
          ypos += height; 
      }
      return data;
  }
  
  var gridData = gridData();
  gridData[3][0]['click'] = 1;
  gridData[9][9]['click'] = 2;
  for(var i = 0; i < 7; i++){
    gridData[5][i]['click'] = 3;
  }
  
  for(var i = 2; i < 6; i++ ){
    gridData[i][6]['click'] = 3;
  }
  for(var i = 0; i < 4; i++){
    gridData[1][i]['click'] = 3;
  }
  
  
  
  console.log(gridData);
  
  var grid = d3.select("#grid")
      .append("svg")
      .attr("width","510px")
      .attr("height","510px");
  
  var row = grid.selectAll(".row")
      .data(gridData)
      .enter().append("g")
      .attr("class", "row");
  
  function removeDuplicates(x, y, gridData, isStart){
    // Not working super well for UI/UX purposes atm
    return null;
    console.log("remove dupe");
    console.log(isStart);
    console.log(x);
    console.log(y);

    var ix = (x-1)/50;
    var iy = (y-1)/50;
    for(var i =0; i < gridData.length; i++){
      for( var j = 0; j < gridData[0].length; j++){
        if(isStart){
          if(gridData[i][j]["click"] == 1 && (j != ix || i != iy)){
            console.log(i + " " +  j + ": " + ix + " " + iy);            
            gridData[i][j]["click"] = 0;
          }
        }else{
          if(gridData[i][j]["click"] == 2 && (j != ix || i != iy)){
            gridData[i][j]["click"] = 0;
          }
        }
          }
      }

      updateGrid(gridData);

    }


  var column = row.selectAll(".square")
      .data(function(d) { return d; })
      .enter().append("rect")
      .attr("class","square")
      .attr("x", function(d) { return d.x; })
      .attr("y", function(d) { return d.y; })
      .attr("width", function(d) { return d.width; })
      .attr("height", function(d) { return d.height; })
      .style("fill", function(d) {    if ((d.click)%4 == 0 ) { return "#d1e5f0"; }
      if ((d.click)%4 == 1 ) { return "#2166ac"; }
      if ((d.click)%4 == 2 ) { return "#b2182b"; }
      if ((d.click)%4 == 3 ) { return"#838690"; }})
      .style("stroke", "#222")
      .on('click', function(d) {

        var callRemove = false;
      d.click = (d.click + 1) % 4;
      if ((d.click)%4 == 0 ) { 
        d3.select(this).style("fill","#d1e5f0");  }
      // Start
      if ((d.click)%4 == 1 ) { 
        d3.select(this).style("fill","#2166ac");         
        removeDuplicates(d.x, d.y, gridData, true); }
      // End
      if ((d.click)%4 == 2 ) {
        d3.select(this).style("fill","#b2182b"); 
        removeDuplicates(d.x, d.y, gridData, false);  
        }
      if ((d.click)%4 == 3 ) { d3.select(this).style("fill","#838690"); }
  
      console.log(gridData);
      });
  
  nodes = getNeighbors(gridData);
  
  
  
  
  
  // Queue class 
  class Queue 
  { 
      // Array is used to implement a Queue 
      constructor() 
      { 
          this.items = []; 
      } 
                    
      // Functions to be implemented 
      add(element) {     
          // adding element to the queue 
          this.items.push(element); 
      } 
      remove() { 
          // removing element from the queue 
          // returns underflow when called  
          // on empty queue 
          if(this.isEmpty()) 
              return "Underflow"; 
          return this.items.shift(); 
      } 
      front() { 
          // returns the Front element of  
          // the queue without removing it. 
          if(this.isEmpty()) 
              return "No elements in Queue"; 
          return this.items[0]; 
      } 
      isEmpty() { 
          // return true if the queue is empty. 
          return this.items.length == 0; 
      } 
      printQueue() { 
          var str = ""; 
          for(var i = 0; i < this.items.length; i++) 
              str += this.items[i] +" "; 
          return str; 
      } 
  } 
  
  class Graph {
      constructor(edgeDirection = Graph.DIRECTED) {
        this.nodes = new Map();
        this.edgeDirection = edgeDirection;
      }
  
      addEdge(source, destination) {
          const sourceNode = this.addVertex(source);
          const destinationNode = this.addVertex(destination);
        
          sourceNode.addAdjacent(destinationNode);
        
          if(this.edgeDirection === Graph.UNDIRECTED) {
            destinationNode.addAdjacent(sourceNode);
          }
        
          return [sourceNode, destinationNode];
      }
      
      addVertex(value) {
          if(this.nodes.has(value)) {
            return this.nodes.get(value);
          } else {
            const vertex = new Node(value);
            this.nodes.set(value, vertex);
            return vertex;
          }
      }
  
      removeVertex(value) {
          const current = this.nodes.get(value);
          if(current) {
            for (const node of this.nodes.values()) {
              node.removeAdjacent(current);
            }
          }
          return this.nodes.delete(value);
      }
  
      removeEdge(source, destination) {
          const sourceNode = this.nodes.get(source);
          const destinationNode = this.nodes.get(destination);
        
          if(sourceNode && destinationNode) {
            sourceNode.removeAdjacent(destinationNode);
        
            if(this.edgeDirection === Graph.UNDIRECTED) {
              destinationNode.removeAdjacent(sourceNode);
            }
          }
        
          return [sourceNode, destinationNode];
      }
  
      *bfs(first) {
          const visited = new Map();
          const visitList = new Queue();
        
          visitList.add(first);
        
          while(!visitList.isEmpty()) {
            const node = visitList.remove();
            if(node && !visited.has(node)) {
              yield node;
              visited.set(node);
              node.getAdjacents().forEach(adj => visitList.add(adj));
            }
          }
        }
    
  
    }
  
  
  function distance(v, u){
    // Currently just using Euclidean distance
    var x1 = v.value[0];
    var x2 = u.value[0];
    var y1 = v.value[1];
    var y2 = u.value[1];
  
    return Math.sqrt( Math.pow((x1-x2), 2) + Math.pow((y1-y2), 2) );
  }
  
  function dijkstra(gridData){
    console.log("DIJKSTRA");
    nodes = getNeighbors(gridData);
    console.log(nodes);
    edges = []
    source = null;
    target = null;
  
      for(var i = 0; i < nodes.length; i++){
        if(nodes[i].value[2] == 2){
          target = parseInt(i);
        }
  
        if(nodes[i].value[2] == 1){
          source = parseInt(i);
        }
  
        for(var numNeighbors = 0; numNeighbors < nodes[i].adjacents.length; numNeighbors++){
          edges.push([parseInt(i), parseInt(nodes[i].adjacents[numNeighbors][1]), distance(nodes[i], nodes[i].adjacents[numNeighbors][0])]);
        }
      }
  
      if(source == null || target == null){
        return null;
      }
      console.log("INITIAL CALL");
      console.log(edges);
      console.log(source);
      console.log(target);
  
  
      const Q = new Set(),
            prev = {},
            dist = {},
            adj = {}
   
      const vertex_with_min_dist = (Q,dist) => {
          let min_distance = Infinity,
              u = null
   
          for (let v of Q) {
              if (dist[v] < min_distance) {
                  min_distance = dist[v]
                  u = v
              }
          }
          return u
      }
   
      for (let i=0;i<edges.length;i++) {
          let v1 = edges[i][0], 
              v2 = edges[i][1],
              len = edges[i][2]
   
          Q.add(v1)
          Q.add(v2)
   
          dist[v1] = Infinity
          dist[v2] = Infinity
   
          if (adj[v1] === undefined) adj[v1] = {}
          if (adj[v2] === undefined) adj[v2] = {}
   
          adj[v1][v2] = len
          adj[v2][v1] = len
      }
      // console.log(adj);
      // console.log(dist);
   
      dist[source] = 0
   
  
      while (Q.size) {
        // console.log("LOOP");  
  
        u = vertex_with_min_dist(Q,dist);
  
  
        neighbors = Object.keys(adj[u]).filter(v=>Q.has(parseInt(v))); //Neighbor still in Q 
       // console.log(Object.keys(adj[u]));
       //console.log(Q);
        //console.log(Q.has(30));
        // console.log(neighbors);
          Q.delete(u)
   
          if (u===target) break //Break when the target has been found
          for (let v of neighbors) {
            neighborNode = nodes[v]
            targetNode = nodes[target]
  
            if(neighborNode.value[0] != targetNode.value[0] || neighborNode.value[1] != targetNode.value[1]){
              gridData[(neighborNode.value[1]-1)/50][(neighborNode.value[0]-1)/50]['click'] = 7
            }
  
              let alt = dist[u] + adj[u][v]
              if (alt < dist[v]) {
                  dist[v] = alt
                  prev[v] = u
              }
          }
      }
   
      {
          let u = target,
          S = [u],
          len = 0
          while (prev[u] !== undefined) {
              S.unshift(prev[u])
              len += adj[u][prev[u]]
              u = prev[u]
          }
          return [S,len]
      }   
    }
  
  
  function distance(v, u){
    // Currently just using Euclidean distance
    var x1 = v.value[0];
    var x2 = u.value[0];
    var y1 = v.value[1];
    var y2 = u.value[1];
  
    return Math.sqrt( Math.pow((x1-x2), 2) + Math.pow((y1-y2), 2) ); //+ (Math.pow((x1-x2), 2)) + (Math.pow((y1-y2), 2)) ;
  }
  
  function A_star(gridData){
    console.log("A*");
    nodes = getNeighbors(gridData);
    console.log(nodes);
    edges = []
    source = null;
    target = null;
  
      for(var i = 0; i < nodes.length; i++){
        if(nodes[i].value[2] == 2){
          target = parseInt(i);
        }
  
        if(nodes[i].value[2] == 1){
          source = parseInt(i);
        }
  
        for(var numNeighbors = 0; numNeighbors < nodes[i].adjacents.length; numNeighbors++){
          edges.push([parseInt(i), parseInt(nodes[i].adjacents[numNeighbors][1]), distance(nodes[i], nodes[i].adjacents[numNeighbors][0])]);
        }
      }
  
      if(source == null || target == null){
        return null;
      }
      console.log("INITIAL CALL");
      console.log(edges);
      console.log(source);
      console.log(target);
  
  
      const Q = new Set(),
            prev = {},
            dist = {},
            est = {},
            adj = {}
   
      const vertex_with_min_dist = (Q,dist) => {
          let min_distance = Infinity,
              u = null
   
          for (let v of Q) {
              if (est[v] < min_distance) {
                  min_distance = est[v]
                  u = v
              }
          }
          return u
      }
   
      for (let i=0;i<edges.length;i++) {
          let v1 = edges[i][0], 
              v2 = edges[i][1],
              len = edges[i][2]
   
          Q.add(v1)
          Q.add(v2)
   
          dist[v1] = Infinity
          dist[v2] = Infinity
          est[v1] = Infinity
          est[v2] = Infinity
   
          if (adj[v1] === undefined) adj[v1] = {}
          if (adj[v2] === undefined) adj[v2] = {}
   
          adj[v1][v2] = len
          adj[v2][v1] = len
      }
      // console.log(adj);
      // console.log(dist);
   
      dist[source] = 0
      est[source] = distance(nodes[source], nodes[target])
   
  
      while (Q.size) {
        // console.log("LOOP");  
  
        u = vertex_with_min_dist(Q,dist);
  
  
        neighbors = Object.keys(adj[u]).filter(v=>Q.has(parseInt(v))); //Neighbor still in Q 
       // console.log(Object.keys(adj[u]));
       //console.log(Q);
        //console.log(Q.has(30));
        // console.log(neighbors);
          Q.delete(u)
   
          if (u===target) break //Break when the target has been found
          for (let v of neighbors) {
              neighborNode = nodes[v]
              targetNode = nodes[target]
  
            if(neighborNode.value[0] != targetNode.value[0] || neighborNode.value[1] != targetNode.value[1]){
              gridData[(neighborNode.value[1]-1)/50][(neighborNode.value[0]-1)/50]['click'] = 7
            }
  
  
              let tentativeG = dist[u] + adj[u][v]
              if (tentativeG < dist[v]) {
                  dist[v] = tentativeG
                  prev[v] = u
                  est[v] = dist[v] + distance(nodes[v], nodes[target])
              }
          }
      }
   
      {
          let u = target,
          S = [u],
          len = 0
          while (prev[u] !== undefined) {
              S.unshift(prev[u])
              len += adj[u][prev[u]]
              u = prev[u]
          }
          return [S,len]
      }   
    }   
  
  
    Graph.UNDIRECTED = Symbol('directed graph'); // one-way edges
    Graph.DIRECTED = Symbol('undirected graph'); // two-ways edges
  
  
  
  const graph = new Graph(Graph.UNDIRECTED);
  const [first] = graph.addEdge(1, 2);
  graph.addEdge(1, 3);
  graph.addEdge(1, 4);
  graph.addEdge(5, 2);
  graph.addEdge(6, 3);
  graph.addEdge(7, 3);
  graph.addEdge(8, 4);
  graph.addEdge(9, 5);
  graph.addEdge(10, 6);
  
  bfsFromFirst = graph.bfs(first);
  console.log(bfsFromFirst);
  console.log(bfsFromFirst.next());
  //console.log(bfsFromFirst.next().value.value)
  
  
  function runDijkstra() {
    resetGrid(gridData);
    var res = dijkstra(gridData);
    console.log(res[0]);
    updatePath(gridData, res[0]);
  }
  
  function runA_star(){
    resetGrid(gridData);
    var res = A_star(gridData);
    console.log(res[0]);
    updatePath(gridData, res[0]);  
  }
  
  // d3.select("#runButton").on("click", runDijkstra );
  d3.select("#runDijkstra").on("click", runDijkstra );
  d3.select("#runAStar").on("click", runA_star );
  d3.select("#resetButton").on("click", function() {resetGrid(gridData)} );
  
  

$(function () {
    $('.dijkstra-mini img:gt(0)').hide();
    setInterval(function () {
        $('.dijkstra-mini :first-child').fadeOut().next('img').fadeIn().end().appendTo('.dijkstra-mini');
    }, 2000);
  });

  $(function () {
    $('.astar-mini img:gt(0)').hide();
    setInterval(function () {
        $('.astar-mini :first-child').fadeOut().next('img').fadeIn().end().appendTo('.astar-mini');
    }, 2000);
  });