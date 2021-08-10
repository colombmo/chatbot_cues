var reaction = "@{reaction}"

let adjList; // adjacency list
let totalWeight; // total weight from the vertex s to vertex d
let vertices; // vertices list in the graph
let finalCues;

const cues = ["quality_c", "task_social_c", "message_intensity_c", "failure_c", "user_c", "humanlike_c", "xxx_c", "character_c"];
const reactions = ["satisfaction_r", "trust_r", "behavior_r", "sales_r", "brand_r"];
const signals = ["utility_s", "emotion_s", "doubt_s", "relationship_s"];

const translate_reactions = {"Satisfaction" : "satisfaction_r",
						"Trust-related" : "trust_r",
						"Behavior-related" : "behavior_r",
						"Sales-related" : "sales_r",
						"(Brand-) connectivity- related" : "brand_r"};
						
const translate_cues = {"quality_c" : "Quality-related cues",
						"task_social_c" : "Task vs. Social-oriented cues",
						"message_intensity_c" : "Cues influencing the message intensity",
						"failure_c" : "Cues dealing with failure",
						"user_c" : "User-centered cues",
						"humanlike_c" : "Human-like cues",
						"character_c" : "Cues influencing the bot's character",
						"xxx_c" : "Cues providing explanations about the chatbot itself"};
    
const edges = '[{"vertex_s":"quality_c", "vertex_d":"utility_s", "weight":5},' +
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
var alledges = JSON.parse(edges)
alledges.forEach(e => {
    addEdge(e.vertex_s, e.vertex_d, e.weight);
});


// Compute result:
var res = compute_cues(reaction);

this.setCustomData({ "cues" : res , "reaction" : reaction });


function compute_cues(reaction){
	finalCues = {};
    var re = translate_reactions[reaction];
    for (const index in cues) {
        // Print all possible paths from cues to reactions
        printAllPaths(cues[index], re);
    }

    var cuesItems = Object.keys(finalCues).map(function(key) {
        return [key, finalCues[key]];
    });
    
    cuesItems.sort(function(a, b) {
        return b[1] - a[1];
    }); 
    
    // Print all cues with scores when users select a reaction
    var ret = "<table><tr><th>Cue</th><th>Score</th></tr>";
    for (const [key, value] of cuesItems) {
    	ret += "<tr><td>" +translate_cues[key]+"</td><td>" + value.toString()+ "</td></tr>";
    }
    ret += "</table>";
  	
  	console.log(ret);
    return ret;
}

// A directed graph using adjacency list representation
function Graph()
{
    // initialise vertices and adjacency list
    vertices = [];
    adjList = {};
}

// add vertex
function addVertex(vertex){
    vertices.push(vertex);
    adjList[vertex] = {};
}

// add edge from u to v and its weight
function addEdge(u,v, weight)
{
    // Add v to u's list.
    adjList[u][v] = weight;
}

// Prints all paths from source 's' to destination 'd'
function printAllPaths(s, d)
{
    let isVisited = new Array(vertices.length);
    totalWeight = 0;
    
    for(let i=0;i<vertices.length;i++)
        isVisited[i]=false;
        let pathList = [];
        let pathWeight = [];

        // add source to path[]
        pathList.push(s);
        pathWeight.push(0);

        // Call recursive utility
        printAllPathsUtil(s, d, isVisited, pathList, pathWeight);

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
        // if match found then no need to traverse more till depth
        return;
    }

    // Mark the current node
    isVisited[u] = true;

    // Recur for all the vertices
    // adjacent to current vertex
    for (const property in adjList[u]) {
        if (!isVisited[property]) {
            // store current node
            // in path[]
            localPathList.push(property);
            localPathWeight.push(adjList[u][property]);
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
