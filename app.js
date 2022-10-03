// load data from dino.json file

let dinoData = [];

    fetch("./dino.json")
    .then(response => {return response.json()})
    .then(responseData =>{
        dinoData = responseData.Dinos
        });


// run main fuction to create the grid
function main() {

    // Construct to create obj with data from the Dino
    function NewDino (dinoData){

        //Function to convert lbs to KG
        function weightConverter(value){
            return (value/2.2046).toFixed(0);
        };

        //Function to convert Inch to cm
        function heightConverter(value){
            return (value*2.54).toFixed(0);
        };

        this.name = dinoData.species;
        this.weight = weightConverter(Number(dinoData.weight));
        this.height = heightConverter(Number(dinoData.height));
        this.diet = dinoData.diet;
        this.where = dinoData.where;
        this.when = dinoData.when;
        this.fact = dinoData.fact;
        this.imgsrc = "./images/" +  dinoData.species.toLowerCase() + ".png";
    }

    // Dino Objects as Array
    let dinoObjArray = dinoData.map(function(element){
        return new NewDino(element)
    });
    
    //Shuffel the array
    dinoObjArray = (function() {
        for (let i = dinoObjArray.length - 1; i > 0; i--){
            const j = Math.floor(Math.random() * (i + 1));
            const temp = dinoObjArray[i];
            dinoObjArray[i] = dinoObjArray[j]
            dinoObjArray[j] = temp
        }
        return dinoObjArray
    })();
    
    // Function for Human Object
    function humanData (name , height, weight, diet){
        return{
            name:name,
            height:height,
            weight:weight,
            diet:diet,
            imgsrc: "./images/human.png"
        }
    };

    // Use IIFE to get human data from form
    let humanObj = (function(){
        
        const name = document.getElementById("name").value;
        const height = document.getElementById("height").value;
        const weight = document.getElementById("weight").value;
        const diet = document.getElementById("diet").value.toLowerCase();

        return humanData(name, height, weight, diet)
    })();

    // check if form has the right values in it
    if (humanObj.name.length === 0 || humanObj.height.length === 0 || humanObj.weight.length === 0 ){
        return alert("Please, enter the right values.")
    }
    
    

    // Create Dino Compare Method 1 weight
    NewDino.prototype.createFact1 = function(){
        if (humanObj.weight > this.weight){
            return "I´m heavier then You with my " + this.weight + " KG."
        } else if (humanObj.weight < this.weight){
            return "I´m lighter then You with my " + this.weight + " KG."
        } else {
            return "We both have the same weight."
        }
    };

    
    // Create Dino Compare Method 2 hight
    NewDino.prototype.createFact2 = function(){
        if (humanObj.height < this.height){
            return "I´m " + this.height + " cm tall so I´m taller then you."
        } else if (humanObj.height > this.height){
            return "I´m smaller then You with my " + this.height + "cm."
        } else {
            return "We both have the same height"
        }
    };

    
    // Create Dino Compare Method 3 diet
    NewDino.prototype.createFact3 = function(){
        let answer = "I`m a "+ (this.diet)+ " and you are " + humanObj.diet + ".";
        if (this.diet == humanObj.diet){
            answer += " We both like the same!"
        }
        return answer
    };

    //add human to array
    const humanPostionInArray = 4
    dinoObjArray.splice(humanPostionInArray, 0, humanObj);

    // make Grid for each dino and the human
    let formContainer = document.getElementById("grid");
    formContainer.id = "grid";

    dinoObjArray.forEach(function(element, index){
        const container = document.createElement("div");
        container.classList.add("grid-item");
        const header = document.createElement("h3");
        header.innerText = element.name;
        container.appendChild(header);
        const img = document.createElement("img");
        img.src = element.imgsrc;
        container.appendChild(img);

        // create random Fact runs only if not humanObject is active   
        if (index !== humanPostionInArray) { 
            const factText = document.createElement("p");
            if (element.name === "Pigeon"){
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
                // add random fact from allFactsArray
                factText.innerText = allFactsArray[Math.floor(Math.random()* allFactsArray.length)];
            }
            container.appendChild(factText);
        };       
        formContainer.appendChild(container);
    });

    // Remove form from screen
    const container = document.getElementById("dino-compare");
    container.style.display = "none";
}

// On button click, prepare and display infographic
const btn = document.querySelector("#btn");

btn.addEventListener("click",function(e){
    main();
});