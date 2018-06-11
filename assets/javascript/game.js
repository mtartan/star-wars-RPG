
$(document).ready(function () {
    //Global variables
    let defenderId,
        attackerId,
        attackerHp,
        defenderHp,
        attackPower,
        enemyCount,
        //array of characters
        character = [{
            name: "Luke Skywalker",
            hp: 130,
            attackPower: 16,
            counterAttack: 6,
            img: "luke.jpg"
        },

        {
            name: "Darth Vader",
            hp: 140,
            attackPower: 10,
            counterAttack: 12,
            img: "darth.jpg"
        },

        {
            name: "Obi Wan Kenobi",
            hp: 120,
            attackPower: 6,
            counterAttack: 10,
            img: "obi.jpg"
        },

        {
            name: "Kylo Ren",
            hp: 150,
            attackPower: 4,
            counterAttack: 15,
            img: "kylo.jpg"
        }];

    //This function is called when the game start and every time restart is pressed
    function newGame() {
        //initialize variables
        attackPower = 0;
        defenderId = "";
        attackerId = "";
        attackerHp = 0;
        defenderHp = 0;
        enemyCount = character.length - 1;

        //Clean containers
        $("#yourCharacter").empty();
        $("#characters").empty();
        $("#defender").empty();
        $("#msg").empty();
        $("#topMsg").text("Select your character");

        //Loop through character array and create each character 
        for (let i = 0; i < character.length; i++) {
            //create a new div, add class character and id
            let div = $("<div>").addClass("character").attr("id", i);
            $("#characters").append(div); //append the new div to id=characters

            //inside the new div append a <p> with the character name,




            //character's image and Heath points


            div.append($("<img>").attr("src", "assets/images/" + character[i]["img"]));
            div.append($("<p>").text(character[i]["name"]));
            div.append($("<p>").html("Health Points: <span>" + character[i]["hp"] + "</span>"))
            div.append($("<p>").html("Attack Power: " + character[i]["attackPower"]));
            div.append($("<p>").html("Counter Attack: " + character[i]["counterAttack"]))
        }
        attachOnClick(); //attach onclick event to characters
    }

    //add a progress bar to attacker and defender characters
    function addProgressBar(className) {
        let progressbar = $("<div>").addClass("progress");
        let div = $("<div>").addClass("progress-bar progress-bar-success").text("100%");
        progressbar.append(div);
        $(className).append(progressbar);
    }

    newGame(); //create a new game
    let msg = $("#msg");

    //Restart button click
    //start new game and hidde this button
    $("#restart").on("click", function () {
        newGame();
        $(this).css("display", "none");
    });

    //attach onclick event to characters, this fuction has to be called 
    //after create characters elements
    function attachOnClick() {
        $(".character").on("click", function () {

            let currentCharacter = $(this); //character that has been clicked

            //if there is not a attacker
            if (attackerId == "") {
                attackerId = currentCharacter.attr("id"); //get attacker id
                attackerHp = character[attackerId].hp;    //get attacker heath points
                currentCharacter.addClass("attacker");    //add class attacker
                currentCharacter.off("click"); //remove click event from this character

                //append the character to 'your character'(attacker) zone
                $("#yourCharacter").append(currentCharacter);

                //add progress bar to attacker
                addProgressBar(".attacker");

                $("#topMsg").text("Enemies Available To Attack");

                //if there is not a defender
            } else if (defenderId == "") {
                defenderId = currentCharacter.attr("id"); //get enemy id
                defenderHp = character[defenderId].hp;    //get enemy heath points
                currentCharacter.addClass("defender");    //add class defender
                currentCharacter.off("click"); //remove click event from this character

                //append character to defender zone
                $("#defender").append(currentCharacter);

                //add progress bar to defender
                addProgressBar(".defender");

                $("#attack").css("display", "inline"); //display button attack
                msg.empty(); //clean mesages
            }
        });
    }

    //button attack click
    $("#attack").click(function () {

        //increase attacker's attackPower
        attackPower += character[attackerId]["attackPower"];
        defenderHp -= attackPower; //decrease defender hp

        //if defender hp is less than 1
        if (defenderHp <= 0) {
            $("#" + defenderId).remove(); //remove the defender
            $("#attack").css("display", "none"); //hide button attack

            enemyCount--; //decrease enemies count

            //if there is not more enemies, you won
            if (enemyCount == 0) {
                msg.html("<p>You Won!!!</p>");
                $("#restart").css("display", "block");
            } else { //if still more enemies show a message and clean defenderId variable
                msg.html("<p>You have defeated " + character[defenderId].name + ", you can choose to fight another enemy.</p>");
                defenderId = "";
            }

        } else { //if defender still alive
            $(".defender span").text(defenderHp); //update defender hp on screen

            //update defender progres bar
            var defHpPercent = defenderHp * 100 / character[defenderId].hp;
            $(".defender .progress-bar").width(defHpPercent + "%").text(Math.round(defHpPercent) + "%");


            attackerHp -= character[defenderId].counterAttack; //decrease attacker hp
            $(".attacker span").text(attackerHp); //update attacker hp on screen

            //update attacker progress bar
            var attHpPercent = attackerHp * 100 / character[attackerId].hp;
            $(".attacker .progress-bar").width(attHpPercent + "%").text(Math.round(attHpPercent) + "%");;


            if (attackerHp > 0) { //if attacker still have hp show message
                msg.html("<p>You attacked " + character[defenderId]["name"] + " for " + attackPower + " damage. <br>" +
                    character[defenderId]["name"] + " attacked you back for " + character[defenderId]["counterAttack"] + " damage.</p>");
            } else { //if attacker's hp is less than 1 then game over
                msg.html("<p>You have been defeated...</P>");
                $("#attack").css("display", "none");
                $("#restart").css("display", "block");
            }
        }
    });
});