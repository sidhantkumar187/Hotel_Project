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
            initquery("INSERT INTO users (username,password,useremail) VALUES ( $1 , $2 ,$3 )",[newUser.username,newUser.password,newUser.email], (error,result) => {
                if (error) {
                  console.log(error);
                }
            });
        }
    },
    query : (text,params,callback) => {       // Simplicize it by using An object of Text + Parameters......
          return pool.query(text, params, callback)
    },
    getUserById : function (id , callback ) {
        console.log("getUserById : "+id);
        initquery("SELECT * FROM users WHERE userid =  $1",[id], (error,result) => {    // Kindly change it to retrieve without
            if (error) {                                                                // password bcoz its passing user object to session
                console.log("Error in query getuserbyid"+error);                        // hence all the data will be visible inside template
            }
            var userjson = result.rows[0];
            console.log("Inside getUserByUsername"+userjson);
            callback(null, {username : userjson.username, id: userjson.userid, password :userjson.password, email :userjson.useremail});
        });
    },
    getHotelInfo : function(hotelid,callback){
        initquery("SELECT * from hotels left join facilities on hotels.id = facilities.hotelid where id = $1",[hotelid], (error,result) =>{
            if (error) {
                console.log("Error in query getuserbyid"+error);
            }
            if(result.rows.length > 0) {
                console.log("wifi"+result.rows[0].wifi);
                var hoteljson = result.rows[0];
                callback(null, hoteljson);
            }
        });
    },
    getUserByUsername : function (username, callback){
        initquery("SELECT * FROM users WHERE username =  $1",[username], (error,result) => {
            if (error) {
                console.log("Error in query getuserbyusername"+error);
            }
            if(result.rows.length > 0)
            {
                var userjson = result.rows[0];
                console.log("Inside getUserByUsername"+userjson);
                callback(null, {username : userjson.username, id: userjson.userid, password :userjson.password, email :userjson.useremail});
            }
        });
    },
    comparePassword : function(candidatePassword, hash, callback){
        bcrypt.compare(candidatePassword, hash, function(err, isMatch) {
            if(err) throw err;
            callback(null, isMatch);
        });
    }
    // new function space
  };

  function initquery(text,params,callback) {       // Simplicize it by using An object of Text + Parameters......
    return pool.query(text, params, callback)
};