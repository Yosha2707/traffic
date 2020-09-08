var fs = require('fs');

var carObject = {
    speed: 20, //this is max speed of car in megamiles/hour
    cross_single_carter_speed: 3, //crosses one carter in this much min
}

var bikeObject = {
    speed: 10, //this is max speed of car in megamiles/hour
    cross_single_carter_speed: 2, //crosses one carter in this much min
}

var tuktukObject = {
    speed: 12, //this is max speed of car in megamiles/hour
    cross_single_carter_speed: 1, //crosses one carter in this much min
}


//these are the traffic speed of orbit1 and orbit2 which ll be updated when input is provided
var orbitSpeed = { 
    orbit_one_speed: 0,
    orbit_two_speed: 0
}

//distance of Hallitharam from Silkdorb through orbit 1 and toalt craters in between 
var orbit_one = {
    distance: 18,
    total_craters: 20
}

//distance of Hallitharam from Silkdorb through orbit 2 and toalt craters in between 
var orbit_two = {
    distance: 20,
    total_craters: 10
}


/*
This function reads the input data and call functions according to WEATHER mentioned in input file and call the declareResults function to print results. This function is invoked on page load.
*/
async function readInputFile(){
    try {  

        //reading input file by name request.txt 
        var data = fs.readFileSync('request.txt', 'utf8');
        data = data.toString();

        //create input string into array
        var input_values = data.split(" ");


        if(input_values.length == 3){
            var weather = input_values[0]; //get input weather and call functions with related information.

            //update orbit traffic speed
            orbitSpeed.orbit_one_speed = parseFloat(input_values[1]);
            orbitSpeed.orbit_two_speed = parseFloat(input_values[2]);


            if(weather.toLowerCase() == "sunny"){
                tuktukObject.carter = bikeObject.carter = carObject.carter = -10 //craters reduces by 10% in sunny weather
                
                var finalValue = await Promise.all([car(), tuktuk(), bike()]); //sunny weather supports car, bike & tuktuk. Calling these function asynchronously and getting data in a variable once all of them are resolved or rejected

                declareResults(finalValue)

            }else if(weather.toLowerCase() == "rainy"){
                tuktukObject.carter = carObject.carter = 20 //craters increase by 20% in rainy weather
                
                var finalValue = await Promise.all([car(), tuktuk()]); //sunny weather supports car & tuktuk. Calling these function asynchronously and getting data in a variable once all of them are resolved or rejected

                declareResults(finalValue)
            }else if(weather.toLowerCase() == "windy"){
                bikeObject.carter = carObject.carter = 0 //no changes in craters
                
                var finalValue = await Promise.all([car(), bike()]); //sunny weather supports car & bike. Calling these function asynchronously and getting data in a variable once all of them are resolved or rejected

                declareResults(finalValue)
            }
        }else{
            console.log("Wrong Data")
        }
    } catch(e) {
        console.log('Error:', e.stack);
    }
}

/*
This function calls orbitOne and orbitTwo function with carObject as argument to determine if king shan travels with car in provided weather in input file which route will be faster.
*/
async function car(){
    return new Promise(async (resolve, rejects) => {
        try {
            var [orbit1, orbit2] = await Promise.all([orbitOne(carObject), orbitTwo(carObject)])

            var orbit_to_choose = "ORBIT1"
            var minimumTime = orbit1
            if(orbit1 > orbit2){ //if time taken in orbit2 is less then its the preferable one 
                minimumTime = orbit2
                orbit_to_choose = "ORBIT2"
            }
            resolve({
                "vehicle": "car",
                "time": minimumTime,
                "orbit": orbit_to_choose
            });    
        } catch (error) {
            console.log(error)
        } 
    })
}


/*
This function calls orbitOne and orbitTwo function with bikeObject as argument to determine if king shan travels with bike in provided weather in input file which route will be faster.
*/
async function bike(){
    return new Promise(async (resolve, rejects) => {
        try {
            var [orbit1, orbit2] = await Promise.all([orbitOne(bikeObject), orbitTwo(bikeObject)])
            var orbit_to_choose = "ORBIT1"
            var minimumTime = orbit1
            if(orbit1 > orbit2){ //if time taken in orbit2 is less then its the preferable one
                minimumTime = orbit2
                orbit_to_choose = "ORBIT2"
            }
            resolve({
                "vehicle": "bike",
                "time": minimumTime,
                "orbit": orbit_to_choose
            });  
        } catch (error) {
            console.log(error)
        }
    })
}


/*
This function calls orbitOne and orbitTwo function with tuktukObject as argument to determine if king shan travels with tuktuk in provided weather in input file which route will be faster.
*/
async function tuktuk(){
    return new Promise(async (resolve, rejects) => {
        try {
            var [orbit1, orbit2] = await Promise.all([orbitOne(tuktukObject), orbitTwo(tuktukObject)])
            var orbit_to_choose = "ORBIT1"
            var minimumTime = orbit1
            if(orbit1 > orbit2){ //if time taken in orbit2 is less then its the preferable one
                minimumTime = orbit2
                orbit_to_choose = "ORBIT2"
            }
            resolve({
                "vehicle": "tuktuk",
                "time": minimumTime,
                "orbit": orbit_to_choose
            }); 
        } catch (error) {
            console.log(error)
        } 
    })
}


/*
This function calls calculateCraters function to get the final number of craters king shan will come accros and choosenSpeed function to get the maximum speed with which his vehicle will travel. On basis of these parameters we determine total time he will take if he opts for orbit 1 route.
*/
function orbitOne(vehicleObject){
    return new Promise(async (resolve, rejects) => {
        try {
            var actual_crater = orbit_one.total_craters;

            var final_craters = await calculateCraters(actual_crater, vehicleObject.carter)

            var choosen_speed = await choosenSpeed(orbitSpeed.orbit_one_speed, vehicleObject.speed)

            var carter_time = (final_craters * vehicleObject.cross_single_carter_speed) / 60 //calculate total time to travel craters in hours for orbit 1
            
            var regular_time = orbit_one.distance / choosen_speed;

            resolve(carter_time + regular_time)   
        } catch (error) {
            console.log(error)
        }
    })
}


/*
This function calls calculateCraters function to get the final number of craters king shan will come accros and choosenSpeed function to get the maximum speed with which his vehicle will travel. On basis of these parameters we determine total time he will take if he opts for orbit 2 route.
*/
function orbitTwo(vehicleObject){
    return new Promise(async (resolve, rejects) => {
        try {
            var actual_crater = orbit_two.total_craters;
           
            var final_craters = await calculateCraters(actual_crater, vehicleObject.carter)
           
            var choosen_speed = await choosenSpeed(orbitSpeed.orbit_two_speed, vehicleObject.speed)
           
            var carter_time = (final_craters * vehicleObject.cross_single_carter_speed) / 60 //calculate total time to travel craters in hours for orbit 1
           
            var regular_time = orbit_two.distance / choosen_speed;

            resolve(carter_time + regular_time)
        } catch (error) {
            console.log(error)
        }
    })
}

/*
This function returns the final speed with which vehicle will travel by comparing it with orbit traffic speed.
*/
function choosenSpeed(trafficSpeed, vehicleSpeed){
    return new Promise((resolve, rejects) => {
        if(trafficSpeed < vehicleSpeed){
            resolve(trafficSpeed);
        }else{
            resolve(vehicleSpeed)
        }
    })
}


/*
This function detrmines the total craters king shan will face in his route which depends on the weather.
*/
function calculateCraters(actual, toChange){
    return new Promise((resolve, rejects) => {
        var sign = Math.sign(toChange);

        if(sign == -1){
            var positive_carter = toChange * -1
            resolve(actual - (actual * positive_carter) / 100)
        }else if(sign == 1){
            resolve(actual + (actual * toChange) / 100)
        }else if(sign == 0){
            resolve(actual);
        }
    })
}


/*
This function prints the final result in console my comparing the time each type of vehicle takes.
*/
function declareResults(results){
    //get the object with minimum time 
    var minimum = results.reduce((prev, curr) => prev.time < curr.time ? prev : curr);
    if(minimum){
        console.log((minimum.vehicle).toUpperCase() + " " + minimum.orbit);
    }else{
        console.log("NONE")
    }
}

readInputFile();