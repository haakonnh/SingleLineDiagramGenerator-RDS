let treeObj = {};
let relationObj = {};
let diagramObj = {};

async function fetchAndProcessData() {
    const apiURLtree = 'http://localhost:8000/tree_data';
   /*  const apiURLtopo = 'http://localhost:8000/relation_data'; */
/*     const apiURLgen = 'http://localhost:8000/diagram_data'; */

    try {
        const response = await fetch(apiURLtree);
        const data = await response.json();

        /* const response2 = await fetch(apiURLtopo);
        const data2 = await response2.json(); */

/*         const response3 = await fetch(apiURLgen);
        const data3 = await response3.json(); */

        /* relationObj = data2; */
        treeObj = data;
        /* diagramObj = data3; */
        console.log("Tree data:", treeObj);
        console.log("Relation data:", relationObj);
    } catch (error) {
        console.error("Error fetching data:", error);
    }
}

async function saveToJson() { 
    const saveURL = 'http://localhost:8000/save_data';

    try {
        const response = await fetch(saveURL);
        if (response.ok) {
            console.log("Data saved successfully");
        } else {
            console.error("Error saving data");
        }
    } catch (error) {
        console.error("Error during save:", error);
    }
}

function preload() {
    fetchAndProcessData()
        .then(() => {
            console.log("Data fetched, you can now save if needed"); 
            // Optionally call saveToJson() here if you still want an initial save
        }); 
}

function setup() {
    createCanvas(500, 500);
}

// Example - Saving based on a button click
function mouseClicked() {  
    saveToJson();
} 
