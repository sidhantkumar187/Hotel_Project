var { Pool } = require("pg");
var bcrypt = require("bcryptjs");

var pool = new Pool ({
    user:"Hoteladmin",
    host:"localhost",
    database:"HotelBooking",
    password:"hoteladmin123",
    port:"5432",
  });
  
  module.exports = {
    createUser : function(newUser, callback){
        var password = newUser.password;
        console.log("Password inside index.js db :");
        console.log(password);
        bcrypt.genSalt(10, function(err, salt) {
            bcrypt.hash(newUser.password, salt, function(err, hash) {
                newUser.password = hash;
                save(); // Executing this task by INVOKING method bcoz Query must be synchronously Executed after Hashing or try to implement sync technique
            });
        });


    // NEVER USE UPPERCASE(i.e Users ) IN POSTGRESQL QUERY IF NECESSARY THEN use (i.e "Users")
        console.log(newUser.password);
        function save() {
            initquery("INSERT INTO users (password,useremail) VALUES ( $1 , $2 )",[newUser.password,newUser.email], (error,result) => {
                if (error) {
                  console.log(error);
                }
            });
        }
    },
      query : (text,params,callback) => {       // Simplicize it by using An object of Text + Parameters......
          return pool.query(text, params, callback)
      }
  };

  function initquery(text,params,callback) {       // Simplicize it by using An object of Text + Parameters......
    return pool.query(text, params, callback)
};