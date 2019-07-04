var mysql = require("mysql");
var inquirer = require("inquirer");

var connection = mysql.createConnection({
  host: "localhost",
  port: 3306,
  user: "root",
  password: "password",
  database: "bamazon"
});

connection.connect(function(err) {
  if (err) throw err;
  start();
});

function start(){

    // console.log all the product you have in your db
        connection.query(
            "SELECT * FROM products", function(error,res){
                //console.log(res)
                for(var i=0; i<res.length;i++){
                    console.log (res[i].id, res[i].product_name, res[i].price);
                }

                asking()
            }
        )
}

function asking() {
  inquirer
    .prompt([
    {
      name: "product",
      type: "input",
      message: "What do you want?",
    },
    {
     name: "quantity",
    type: "input",
    message: "how many?",
    }])
    .then(function(answer) {
        console.log(answer)
        if (answer.product === "Q" || answer.quantity == "Q"){
            process.exit()
        }
        connection.query(
            "SELECT * FROM products where id=" + parseInt(answer.product), function(error,res){

            console.log(res)
            if (res[0].quantity >= parseInt(answer.quantity)){
                console.log("we have quantity enough")

                //update the db
                var newQ = res[0].quantity - parseInt(answer.quantity)
                console.log(newQ)
                connection.query(
                    "UPDATE products SET ? WHERE ?",
                    [
                      {
                        quantity: newQ
                      },
                      {
                        id: res[0].id
                      }
                    ],
                    function(error) {
                      if (error) throw error;
                      console.log("we will send the product asap");              start();
                    }
                  );
            }
            else{
                console.log("no this quantity, do you want to change")
                start();
            }
             } )
             

              
        

        // find the product in the db // loof if you have enought stock and if yes you sell and updaate the db // if not you ask the customer for other product / quantity


    });
}
