//************************************1st table - ATTENDANCE/PARTY LOYALTY at glance
const currentPage = location.pathname.split("/").pop()
// console.log(currentPage)

//get members of house
let membersHouse;
let myArrAtt; // to be able to use my function in the table
let myArrLoyalty;


//*************************Fetching data from Propublica
//get house URL - Attendance
let houseUrl = "https://api.propublica.org/congress/v1/115/house/members.json";

//getData(houseUrl)
getData(houseUrl);
async function getData(url){

    propublicaData = await fetch(url, {
            method: "GET",
            dataType: "jsonp",
            headers: {
                "X-API-Key": "3mqBYZOTjeWy2GIUrILiAvYm7SJ5zALJVSnuzItH"
            }
        })

        .then(data => data.json())
        .then(data => data.results[0].members)
        .catch(err => console.log(err))
    membersHouse = await (propublicaData.filter(member => member.votes_with_party_pct !== null))
    await (executeAfterFetch())

}

//function w/ all functions used after fetch
function executeAfterFetch(){
    //insert function that manages visibilty of tables/loader
    hiddenLoader();

    getPartyMembers();
    myArrAtt = getArray(membersHouse);
    myArrLoyalty = getArray(membersHouse);
    someName();

}
//function() hides loader (applying hidden class) and removes hidden class from div containing tables
function hiddenLoader(){
    let loading = document.getElementById("loader");
    loading.classList.add("hidden");
    let myData = document.getElementById("dynamic-content");
    myData.classList.remove("hidden");
 }



// let membersHouse = data.results[0].members.filter(member => member.votes_with_party_pct != null);
// console.log(membersHouse);


// get the number of members in each party

function getPartyMembers() {
    let democrats = [];
    let republicans = [];
    let independents = [];
    let total = [];

    let democratsVotes = [];
    let republicansVotes = [];
    let independentsVotes = [];
    let totalVotes = [];

    for (var i = 0; i < membersHouse.length; i++) {
        if (membersHouse[i].votes_with_party_pct != null) {
        if (membersHouse[i].party.includes("D")) {
            democrats.push(membersHouse[i].party) //***Number of Resp - 1st table - PARTY LOYALTY
            democratsVotes.push(membersHouse[i].votes_with_party_pct) //***% Voted w/ Party - 1st table - PARTY LOYALTY

        } else if (membersHouse[i].party.includes("R")) {
            republicans.push(membersHouse[i].party) //***Number of Resp - 1st table - PARTY LOYALTY
            republicansVotes.push(membersHouse[i].votes_with_party_pct) //***% Voted w/ Party - 1st table - PARTY LOYALTY

        } else if (membersHouse[i].party.includes("I")) {
            independents.push(membersHouse[i].party) //***Number of Resp - 1st table - PARTY LOYALTY
            independentsVotes.push(membersHouse[i].votes_with_party_pct) //***% Voted w/ Party - 1st table - PARTY LOYALTY
        }
        total.push(membersHouse[i].party) //***Number of Resp - 1st table - PARTY LOYALTY
        totalVotes.push(membersHouse[i].votes_with_party_pct) //***% Voted w/ Party - 1st table - PARTY LOYALTY
    }
    }
    // console.log(democrats,republicans,independents)
    document.getElementById("democrats").innerHTML = democrats.length;
    document.getElementById("republicans").innerHTML = republicans.length;
    document.getElementById("independents").innerHTML = independents.length;
    document.getElementById("total").innerHTML = democrats.length + republicans.length + independents.length;


    // console.log(democratsVotes,republicansVotes,independentsVotes)

    let democratsVotesPct = (democratsVotes.reduce((a,b) => a+b) / democrats.length);
    let republicansVotesPct = (republicansVotes.reduce((a,b) => a+b)/ republicans.length);

    if (independentsVotes.length != 0) {
     independentsVotesPct = (independentsVotes.reduce((a,b) => a+b) / independents.length);
    } else {
     independentsVotesPct = 0;
    }
    let totalVotesPct = (totalVotes.reduce((a,b) => a+b) / total.length);

    document.getElementById("democratsVotes").innerHTML = democratsVotesPct.toFixed(2) + "%";

    document.getElementById("republicansVotes").innerHTML = republicansVotesPct.toFixed(2) + "%";

    document.getElementById("independentsVotes").innerHTML = independentsVotesPct.toFixed(2) + "%"

    document.getElementById("totalVotes").innerHTML = totalVotesPct.toFixed(2) + "%";
}



//************************************2st table - ATTENDANCE most/least engaged // HOUSE

//NOTE:::
////// criar function outside === array. then inside the function faço o sort. then dentro da function createtable fazer for lop to display rows.
///create a function that receives the data; that function should loop through the data and create an array that it will return, sorted


function getArray(members) {
    let arrAtt = [];
    let arrLoyalty = [];

    for (var i = 0; i < members.length; i++) {

        if (members[i].missed_votes_pct != null) {

        if (members[i].middle_name == null) {
            members[i].middle_name = "";
        }
        let fullName = members[i].first_name + " " + members[i].middle_name + " " + members[i].last_name;
        let missed_votes = members[i].missed_votes;
        let missed_votes_pct = members[i].missed_votes_pct;

        // let total_votes = members[i].total_votes;
        let votes_with_party_pct = members[i].votes_with_party_pct;
        let partyVotes = (members[i].votes_with_party_pct / 100) * members[i].total_votes;

        arrAtt.push({fullName, missed_votes, missed_votes_pct})

        arrLoyalty.push({fullName, partyVotes, votes_with_party_pct})

        }
    }

    // console.log(arrAtt);
    // console.log(arrLoyalty);

    if (currentPage == "house-attendance-starter-page.html") {
        return arrAtt.sort(function (a, b) {
            return a.missed_votes - b.missed_votes
        });
    } else if (currentPage == "house-party-loyalty-starter-page.html"){
        return arrLoyalty.sort(function (a, b) {
            return a.partyVotes - b.partyVotes    
        });

}
}


function leastMost(myArrAtt, myArrLoyalty) {
    console.log('inside leastMost house')
    let attendanceArray = [];
    let loyaltyArray = [];

    for (let i = 0; i < myArrAtt.length; i++) {
        if (i < (myArrAtt.length * 0.1)) {
            attendanceArray.push(myArrAtt[i])
            loyaltyArray.push(myArrLoyalty[i])

        } else if (attendanceArray[attendanceArray.length - 1].missed_votes == myArrAtt[i].missed_votes || loyaltyArray[loyaltyArray.length - 1].partyVotes == myArrLoyalty[i].partyVotes) {
            attendanceArray.push(myArrAtt[i])
            loyaltyArray.push(myArrLoyalty[i])
        } else {
            break;
        }
    }

        if (currentPage == "house-attendance-starter-page.html") {
            // console.log('about to return attendance array')
            return attendanceArray;
        } else if (currentPage == "house-party-loyalty-starter-page.html"){
            console.log("loyaltyArray agora: ", loyaltyArray)
            return loyaltyArray;
        }

}

//************************************2st and 3rd table - PARTY LOYALTY most/least engaged // SENATE

function createTableAtt(tableId, members) {

    // console.log("inside table attendance!")

    let table = document.getElementById(tableId);
    console.log('table id: ', tableId)
    console.log(table)

    // to make the 1st table empty
    // table.innerHTML = "";

    if (table){

    for (var i = 0; i < members.length; i++) {

        if (members[i].middle_name == null) {
            members[i].middle_name = "";
        }

        let fullName = members[i].fullName;
        let missed_votes = members[i].missed_votes;
        let missed_votes_pct = members[i].missed_votes_pct;

        console.log("attendence house aqui", fullName, missed_votes, missed_votes_pct);

        let row = document.createElement('tr');
        row.insertCell().innerHTML = fullName;
        row.insertCell().innerHTML = missed_votes;
        row.insertCell().innerHTML = missed_votes_pct.toFixed(2) + "%";
        table.append(row)
    }
}

}

function createTableLoyalty(tableId, members) {

    console.log("inside create table loyalty function");
    let table = document.getElementById(tableId);
    // console.log('table id: ', tableId)
    // console.log(table)

    // to make the 1st table empty
    // table.innerHTML = "";


    for (var i = 0; i < members.length; i++) {

        if (members[i].middle_name == null) {
            members[i].middle_name = "";
        }

        let fullName = members[i].fullName;
        let partyVotes = members[i].partyVotes;
        let votes_with_party_pct = members[i].votes_with_party_pct;

        //error::::
        // let total_votes = members[i].total_votes;
        // let partyVotes = Math.round(members[i].votes_with_party_pct / 100 * 100) / 100 * total_votes;

        // Math.round(num * 100) / 100

        console.log("loyal aqui", fullName, partyVotes, votes_with_party_pct);

        let row = document.createElement('tr');
        row.insertCell().innerHTML = fullName;
        row.insertCell().innerHTML = partyVotes.toFixed();
        row.insertCell().innerHTML = votes_with_party_pct.toFixed(2) + "%";
        table.append(row)
    }


}

function someName() {
if (currentPage == "house-attendance-starter-page.html") {

    let topTenPercentArrayAtt = leastMost(myArrAtt, myArrLoyalty);
    let bottomTenPercentArrayAtt = leastMost(myArrAtt.reverse(), myArrLoyalty.reverse());
    createTableAtt("leastHouseAtt", bottomTenPercentArrayAtt);
    createTableAtt("mostHouseAtt", topTenPercentArrayAtt);

} else if (currentPage == "house-party-loyalty-starter-page.html") {
    console.log('we are inside here')

    let topTenPercentArrayLoyalty = leastMost(myArrAtt, myArrLoyalty);
    let bottomTenPercentArrayLoyalty = leastMost(myArrAtt.reverse(), myArrLoyalty.reverse());
    createTableLoyalty("leastHouseLoyalty", bottomTenPercentArrayLoyalty);
    createTableLoyalty("mostHouseLoyalty", topTenPercentArrayLoyalty);
}
}
