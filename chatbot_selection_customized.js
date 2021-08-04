let adjList; // adjacency list
let totalWeight; // total weight from the vertex s to vertex d
let vertices; // vertices list in the graph
let finalCues;
$(document).ready(function() {
    $(".welcome").append("!!!");
    cues = ["quality_c", "task_social_c", "message_intensity_c", "failure_c", "user_c", "humanlike_c", "xxx_c", "character_c"];
    reactions = ["satisfaction_r", "trust_r", "behavior_r", "sales_r", "brand_r"];
    signals = ["utility_s", "emotion_s", "doubt_s", "relationship_s"];
    
    edges = '[{"vertex_s":"quality_c", "vertex_d":"utility_s", "weight":5},' +
    '{"vertex_s":"quality_c", "vertex_d":"emotion_s", "weight":2},' +
    '{"vertex_s":"quality_c", "vertex_d":"relationship_s", "weight":1}, ' +
    '{"vertex_s":"quality_c", "vertex_d":"doubt_s", "weight":2}, ' +
    '{"vertex_s":"task_social_c", "vertex_d":"utility_s", "weight":3}, ' +
    '{"vertex_s":"task_social_c", "vertex_d":"emotion_s", "weight":1}, ' +
    '{"vertex_s":"message_intensity_c", "vertex_d":"utility_s", "weight":2}, ' +
    '{"vertex_s":"message_intensity_c", "vertex_d":"emotion_s", "weight":2}, ' +
    '{"vertex_s":"message_intensity_c", "vertex_d":"relationship_s", "weight":1}, ' +
    '{"vertex_s":"xxx_c", "vertex_d":"utility_s", "weight":1}, ' +
    '{"vertex_s":"humanlike_c", "vertex_d":"utility_s", "weight":1}, ' +
    '{"vertex_s":"humanlike_c", "vertex_d":"emotion_s", "weight":4}, ' +
    '{"vertex_s":"humanlike_c", "vertex_d":"relationship_s", "weight":2}, ' +
    '{"vertex_s":"user_c", "vertex_d":"utility_s", "weight":2}, ' +
    '{"vertex_s":"user_c", "vertex_d":"emotion_s", "weight":3}, ' +
    '{"vertex_s":"user_c", "vertex_d":"relationship_s", "weight":2}, ' +
    '{"vertex_s":"failure_c", "vertex_d":"emotion_s", "weight":1}, ' +
    '{"vertex_s":"character_c", "vertex_d":"relationship_s", "weight":1}, ' +
    '{"vertex_s":"utility_s", "vertex_d":"satisfaction_r", "weight":2}, ' +
    '{"vertex_s":"utility_s", "vertex_d":"trust_r", "weight":4}, ' +
    '{"vertex_s":"utility_s", "vertex_d":"behavior_r", "weight":5}, ' +
    '{"vertex_s":"utility_s", "vertex_d":"sales_r", "weight":3}, ' +
    '{"vertex_s":"doubt_s", "vertex_d":"trust_r", "weight":2}, ' +
    '{"vertex_s":"doubt_s", "vertex_d":"behavior_r", "weight":2}, ' +
    '{"vertex_s":"emotion_s", "vertex_d":"satisfaction_r", "weight":4}, ' +
    '{"vertex_s":"emotion_s", "vertex_d":"trust_r", "weight":3}, ' +
    '{"vertex_s":"emotion_s", "vertex_d":"behavior_r", "weight":2}, ' +
    '{"vertex_s":"emotion_s", "vertex_d":"sales_r", "weight":1}, ' +
    '{"vertex_s":"emotion_s", "vertex_d":"brand_r", "weight":2}, ' +
    '{"vertex_s":"relationship_s", "vertex_d":"satisfaction_r", "weight":2},' +
    '{"vertex_s":"relationship_s", "vertex_d":"trust_r", "weight":2}, ' +
    '{"vertex_s":"relationship_s", "vertex_d":"behavior_r", "weight":2}, ' +
    '{"vertex_s":"relationship_s", "vertex_d":"sales_r", "weight":2}, ' +
    '{"vertex_s":"relationship_s", "vertex_d":"brand_r", "weight":1}]';

    // Create a sample graph
    Graph();

    // Create vertices
    cues.forEach(e => {
        addVertex(e);
    });
    reactions.forEach(e => {
        addVertex(e);
    });
    signals.forEach(e => {
        addVertex(e);
    });

    // Create egdes with weight
    alledges = JSON.parse(edges)
    alledges.forEach(e => {
        addEdge(e.vertex_s, e.vertex_d, e.weight);
    });

    for (var index = 0; index <= reactions.length; index++) {
        $('#reactions').append('<option value="' + reactions[index] + '">' + reactions[index] + '</option>');
    }

    $('#reactselected').html("Selecting best cues to obtain <b>" + $('#reactions').val() + "</b> as a reaction...")
    
    $('#reactions').change(function() {
        $('#reactselected').html("Selecting best cues to obtain <b>" + $(this).val() + "</b> as a reaction...")
        $('#reactselectedText').html("");
        $('#container').html("");
        finalCues = {};
        for (const index in cues) {
            // Print all possible paths from cues to reactions
            printAllPaths(cues[index], $(this).val());
        }

        var cuesItems = Object.keys(finalCues).map(function(key) {
            return [key, finalCues[key]];
        });
    
        cuesItems.sort(function(a, b) {
            return b[1] - a[1];
          }); 
        
        // Print all cues with scores when users select a reaction
        $('#reactselectedText').append("<pre>Cue".padEnd(25) + "Score".padEnd(5) + "</pre>")
        $('#reactselectedText').append("-----------------------------------<br/>")
        for (const [key, value] of cuesItems) {
            console.log(key, value);
            $('#reactselectedText').append("<pre>" +key.padEnd(25) + value.toString().padEnd(5) + "</pre>")
        }
        $('#reactselectedText').append("-----------------------------------<br/>")
    });

    $('#reactions').trigger('change');
});

// A directed graph using adjacency list representation
function Graph()
{
    // initialise vertices and adjacency list
    this.vertices = [];
    this.adjList = {};
}

// add vertex
function addVertex(vertex){
    this.vertices.push(vertex);
    this.adjList[vertex] = {};
}

// add edge from u to v and its weight
function addEdge(u,v, weight)
{
    // Add v to u's list.
    this.adjList[u][v] = weight;
}

// Prints all paths from source 's' to destination 'd'
function printAllPaths(s, d)
{
    let isVisited = new Array(this.vertices.length);
    totalWeight = 0;
    $('#container').append(("<br/><br/><pre>Paths from <b>"+ s + "</b> to <b>" + d+"</b>").padEnd(125) + "Score".padEnd(5) + "</pre>")
    $('#container').append("----------------------------------------------------<br/>")
    for(let i=0;i<this.vertices.length;i++)
        isVisited[i]=false;
        let pathList = [];
        let pathWeight = [];

        // add source to path[]
        pathList.push(s);
        pathWeight.push(0);

        // Call recursive utility
        printAllPathsUtil(s, d, isVisited, pathList, pathWeight);

        $("#container").append("<b>Total weight: " + totalWeight +"</b><br>");
        $('#container').append("----------------------------------------------------<br/>")

    //all total weight to the cue
    finalCues[s] = totalWeight;
    // reset the total weight for the next calculation
    totalWeight = 0;
}

// A recursive function to print all paths from the current vertex 'u' to destination vertex 'd'.
// isVisited[] keeps track of vertices in current path.
// localPathList<> stores actual vertices in the current path
// localPathWeight<> stores actual weights in the current path
function printAllPathsUtil(u, d, isVisited, localPathList, localPathWeight)
{
    if (u == (d)) {
        totalWeight += localPathWeight.reduce((a, b) => a + b, 0)
        $("#container").append("<pre>" + localPathList.join(' ').padEnd(100) + localPathWeight.reduce((a, b) => a + b, 0).toString().padEnd(10) +"</pre>");
        // if match found then no need to traverse more till depth
        return;
    }

    // Mark the current node
    isVisited[u] = true;

    // Recur for all the vertices
    // adjacent to current vertex
    for (const property in this.adjList[u]) {
        if (!isVisited[property]) {
            // store current node
            // in path[]
            localPathList.push(property);
            localPathWeight.push(this.adjList[u][property]);
            printAllPathsUtil(property, d,
            isVisited, localPathList, localPathWeight);

            // remove current node
            // in path[]
            localPathList.splice(localPathList.indexOf
            (property),1);
            localPathWeight.splice(localPathList.indexOf
                (property),1);
        }
    }

    // Mark the current node
    isVisited[u] = false;
}