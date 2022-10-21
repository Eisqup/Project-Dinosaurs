// load data from dino.json file
let dinosDataFromJson = [];

fetch("./dino.json")
    .then(response => { return response.json() })
    .then(responseData => {
        dinosDataFromJson = responseData.Dinos
    });

/**
* @description Runs the main Programm to create a 3x3 grid with information from the form and from the dino.json file. It´s shows the species name and a fact about the Dino. Human is always in the center.
*/

function main() {

    /**
     * @description Create a Object with information about the Dino
     */
    function NewDino(dinoData) {

        /**
        * @description Convert lbs to KG
        */
        function weightConverter(value) {
            return Number((value / 2.2046).toFixed(1));
        }

        /**
        * @description Convert inches to meter
        */
        function heightConverter(value) {
            return Number((value * 0.0254).toFixed(2));
        }

        this.name = dinoData.species;
        this.weight = weightConverter(Number(dinoData.weight));
        this.height = heightConverter(Number(dinoData.height));
        this.diet = dinoData.diet;
        this.where = dinoData.where;
        this.when = dinoData.when;
        this.fact = dinoData.fact;
        this.imgsrc = "./images/" + dinoData.species.toLowerCase() + ".png";
    }

    // Create dino Objects and add the each dinoObj to a array
    let dinoObjArray = dinosDataFromJson.map(function (element) {
        return new NewDino(element)
    });

    //Shuffle the array with IIFE
    dinoObjArray = (function () {
        for (let i = dinoObjArray.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            const temp = dinoObjArray[i];
            dinoObjArray[i] = dinoObjArray[j]
            dinoObjArray[j] = temp
        }
        return dinoObjArray
    })();

    /**
    * @description Function to create a human object
    */
    function humanData(name, height, weight, diet) {
        return {
            name: name,
            height: Number((height / 100).toFixed(2)), //convert cm to meter
            weight: Number(weight),
            diet: diet,
            imgsrc: "./images/human.png"
        }
    }

    // Use IIFE to get human data from form
    let humanObj = (function () {

        const name = document.getElementById("name").value;
        const height = document.getElementById("height").value;
        const weight = document.getElementById("weight").value;
        const diet = document.getElementById("diet").value.toLowerCase();

        return humanData(name, height, weight, diet)
    })();

    // check if form has the right values in it
    if (humanObj.name.length === 0 || humanObj.height.length === 0 || humanObj.weight.length === 0) {
        return alert("Please, enter the right values.")
    }

    // Create Dino Compare Method 1 with weight from human and dino
    NewDino.prototype.createFact1 = function () {
        if (humanObj.weight < this.weight) {
            return "I´m heavier then You with my " + this.weight + " KG."
        } else if (humanObj.weight > this.weight) {
            return "I´m lighter then You with my " + this.weight + " KG."
        } else {
            return "We both have the same weight."
        }
    };


    // Create Dino Compare Method 2 with hight from human and dino
    NewDino.prototype.createFact2 = function () {
        if (humanObj.height < this.height) {
            return "I´m " + this.height + " m tall so I´m taller then you."
        } else if (humanObj.height > this.height) {
            return "I´m smaller then You with my " + this.height + " m."
        } else {
            return "We both have the same height"
        }
    };


    // Create Dino Compare Method 3 with the diet from human and dino
    NewDino.prototype.createFact3 = function () {
        let answer = "I`m a " + (this.diet) + " and you are " + humanObj.diet + ".";
        if (this.diet == humanObj.diet) {
            answer += " We both like the same!"
        }
        return answer
    };

    //add human to dinoObjArray
    const humanPostionInArray = 4
    dinoObjArray.splice(humanPostionInArray, 0, humanObj);

    /*  Create the grid with all needed information's
        -Create a Element "div" to add "h3", "img" and "p" elements to it
            -Add Title to "div" element to see specific information's
            about name/species, height and weight on mousehover
        -Create a Element "h3" with spaciest name or human name
        -Create a Element "img" with the species picture from the folder "images"
        -Create a Element "p" with a random fact about the dino
        -Append all Elements to the "grid" container
    */
    let gridContainer = document.getElementById("grid");

    dinoObjArray.forEach(function (element, index) {
        const container = document.createElement("div");
        container.classList.add("grid-item");
        container.title = "Name: " + element.name + "\n\n" +
            "Weight: " + element.weight + " KG\n" +
            "Height: " + element.height + " m"

        const header = document.createElement("h3");
        header.innerText = element.name;
        container.appendChild(header);

        const img = document.createElement("img");
        img.src = element.imgsrc;
        container.appendChild(img);

        // create random facts and runs only if not humanObject is active   
        if (index !== humanPostionInArray) {
            const factText = document.createElement("p");

            // if species = Pigeon display always the fact "all birds are living dinosaurs"
            if (element.name === "Pigeon") {
                factText.innerText = element.fact;
            } else {
                const allFactsArray = [
                    element.createFact1(),
                    element.createFact2(),
                    element.createFact3(),
                    element.fact,
                    "I have lived in " + element.where + ".",
                    "I wandered over the world in the " + element.when + "."
                ];
                // add a random fact to innerText from the allFactsArray
                factText.innerText = allFactsArray[Math.floor(Math.random() * allFactsArray.length)];
            }
            container.appendChild(factText);
        };
        gridContainer.appendChild(container);
    })

    // Remove form from screen
    const container = document.getElementById("dino-compare");
    container.style.display = "none";
}

// On button click, prepare and display infographic
const btn = document.querySelector("#btn");

btn.addEventListener("click", function (e) {
    e.preventDefault();
    main();
});