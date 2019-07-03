var mysql = require("mysql");
var inquirer = require("inquirer");

var connection = mysql.createConnection({
  host: "localhost",
  port: 1111,
  user: "root",
  password: "password",
  database: "bamazon"
});

connection.connect(function(err) {
  if (err) throw err;
  start();
});

function start() {
  inquirer
    .prompt({
      name: "postOrBid",
      type: "list",
      message: "Would you like to [POST] an auction or [BID] on an auction?",
      choices: ["POST", "BID", "EXIT"]
    })
    .then(function(answer) {
      if (answer.postOrBid === "POST") {
        postAuction();
      }
      else if(answer.postOrBid === "BID") {
        bidAuction();
      } else{
        connection.end();
      }
    });
}

function postAuction() {
  inquirer
    .prompt([
      {
        name: "item",
        type: "input",
        message: "What do you have to sell?"
      },
      {
        name: "category",
        type: "input",
        message: "What type of item would you like to buy?"
      },
      {
        name: "startingBid",
        type: "input",
        message: "Where would you like to start your bidding?",
        validate: function(value) {
          if (isNaN(value) === false) {
            return true;
          }
          return false;
        }
      }
    ])
    .then(function(answer) {
      connection.query(
        "INSERT INTO auctions SET ?",
        {
          item_name: answer.item,
          category: answer.category,
          starting_bid: answer.startingBid || 0,
          highest_bid: answer.startingBid || 0
        },
        function(err) {
          if (err) throw err;
          console.log("you created a thing");
          start();
        }
      );
    });
}

function bidAuction() {
  connection.query("SELECT * FROM auctions", function(err, results) {
    if (err) throw err;
    inquirer
      .prompt([
        {
          name: "choice",
          type: "rawlist",
          choices: function() {
            var choiceArray = [];
            for (var i = 0; i < results.length; i++) {
              choiceArray.push(results[i].item_name);
            }
            return choiceArray;
          },
          message: "What would you like to get?"
        },
        {
          name: "bid",
          type: "input",
          message: "How much do you want to pay?"
        }
      ])
      .then(function(answer) {
        var chosenItem;
        for (var i = 0; i < results.length; i++) {
          if (results[i].item_name === answer.choice) {
            chosenItem = results[i];
          }
        }

        if (chosenItem.highest_bid < parseInt(answer.bid)) {
          connection.query(
            "UPDATE auctions SET ? WHERE ?",
            [
              {
                highest_bid: answer.bid
              },
              {
                id: chosenItem.id
              }
            ],
            function(error) {
              if (error) throw err;
              console.log("You bid!");
              start();
            }
          );
        }
        else {
          console.log("Not enough to get what you want. Would you like to throw more money at it?");
          start();
        }
      });
  });
}
