//************************************1st table - ATTENDANCE/PARTY LOYALTY at glance
const currentPage = location.pathname.split("/").pop()
// console.log(currentPage)

//get members of senate
let membersSenate;
let myArrAtt; //to be able to use my function in the table
let myArrLoyalty;


//*************************Fetching data from Propublica
//get senate URL
let senateUrl = "https://api.propublica.org/congress/v1/115/senate/members.json";

//getData(senateUrl)
getData(senateUrl);
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
    membersSenate = await (propublicaData.filter(member => member.votes_with_party_pct !== null))
    await (executeAfterFetch())

}

//*after this the api data is available in 'members'*

//function w/ all functions used after fetch
function executeAfterFetch(){

    hiddenLoader();
    getPartyMembers();
    myArrAtt = getArray(membersSenate);
    myArrLoyalty = getArray(membersSenate);
    someName();

}

function hiddenLoader(){
    let loading = document.getElementById("loader");
    loading.classList.add("hidden");
    let myData = document.getElementById("dynamic-content");
    myData.classList.remove("hidden");
 }



// let membersSenate = data.results[0].members.filter(member => member.votes_with_party_pct != null);
// console.log(membersSenate);

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

    for (var i = 0; i < membersSenate.length; i++) {
        if (membersSenate[i].votes_with_party_pct != null) {
            if (membersSenate[i].party.includes("D")) {
                democrats.push(membersSenate[i].party) //***Number of Resp - 1st table - PARTY LOYALTY
                democratsVotes.push(membersSenate[i].votes_with_party_pct) //***% Voted w/ Party - 1st table - PARTY LOYALTY

            } else if (membersSenate[i].party.includes("R")) {
                republicans.push(membersSenate[i].party) //***Number of Resp - 1st table - PARTY LOYALTY
                republicansVotes.push(membersSenate[i].votes_with_party_pct) //***% Voted w/ Party - 1st table - PARTY LOYALTY

            } else if (membersSenate[i].party.includes("I")) {
                independents.push(membersSenate[i].party) //***Number of Resp - 1st table - PARTY LOYALTY
                independentsVotes.push(membersSenate[i].votes_with_party_pct) //***% Voted w/ Party - 1st table - PARTY LOYALTY
            }
            total.push(membersSenate[i].party) //***Number of Resp - 1st table - PARTY LOYALTY
            totalVotes.push(membersSenate[i].votes_with_party_pct) //***% Voted w/ Party - 1st table - PARTY LOYALTY
        }
    }
    // console.log(democrats,republicans,independents)
    document.getElementById("democrats").innerHTML = democrats.length;
    document.getElementById("republicans").innerHTML = republicans.length;
    document.getElementById("independents").innerHTML = independents.length;
    document.getElementById("total").innerHTML = democrats.length + republicans.length + independents.length;


    // console.log(democratsVotes,republicansVotes,independentsVotes)

    let democratsVotesPct = (democratsVotes.reduce((a, b) => a + b) / democrats.length);
    let republicansVotesPct = (republicansVotes.reduce((a, b) => a + b) / republicans.length);
    if (independentsVotes.length != 0) {
        independentsVotesPct = (independentsVotes.reduce((a, b) => a + b) / independents.length);
    } else {
        independentsVotesPct = 0;
    }
    let totalVotesPct = (totalVotes.reduce((a, b) => a + b) / total.length);
    document.getElementById("democratsVotes").innerHTML = democratsVotesPct.toFixed(2) + "%";
    document.getElementById("republicansVotes").innerHTML = republicansVotesPct.toFixed(2) + "%";
    document.getElementById("independentsVotes").innerHTML = independentsVotesPct.toFixed(2) + "%"
    document.getElementById("totalVotes").innerHTML = totalVotesPct.toFixed(2) + "%";
}

getPartyMembers();



//************************************2st and 3rd table - ATTENDANCE most/least engaged // SENATE

//NOTE:::
////// criar function outside === array. then inside the function faço o sort. then dentro da function createtable fazer for lop to display rows.
///create a function that receives the data; that function should loop through the data and create an array that it will return, sorted

// const members = data.results[0].members;
// console.log(members);


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

    if (currentPage == "senate-attendance-starter-page.html") {
        return arrAtt.sort(function (a, b) {
            return a.missed_votes - b.missed_votes
        });
    } else if (currentPage == "senate-party-loyalty-starter-page.html"){
        return arrLoyalty.sort(function (a, b) {
            return a.partyVotes - b.partyVotes    
        });

}
}


function leastMost(myArrAtt, myArrLoyalty) {
    console.log('inside leastMost senate')
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

        if (currentPage == "senate-attendance-starter-page.html") {
            // console.log('about to return attendance array')
            return attendanceArray;
        } else if (currentPage == "senate-party-loyalty-starter-page.html"){
            console.log("loyaltyArray primeiro: ", loyaltyArray)
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

        console.log(fullName, missed_votes, missed_votes_pct)

        let row = document.createElement('tr');
        row.insertCell().innerHTML = fullName;
        row.insertCell().innerHTML = missed_votes;
        row.insertCell().innerHTML = missed_votes_pct.toFixed(2) + "%";
        table.append(row)
    }
}

}


function createTableLoyalty(tableId, members) {

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
        // let partyVotes = Math.round(members[i].votes_with_party_pct / 100 * 100) / 100 * total_votes;

        // Math.round(num * 100) / 100

        console.log("ve aqi", fullName, partyVotes, votes_with_party_pct);

        let row = document.createElement('tr');
        row.insertCell().innerHTML = fullName;
        row.insertCell().innerHTML = partyVotes.toFixed();
        row.insertCell().innerHTML = votes_with_party_pct.toFixed(2) + "%";
        table.append(row)
    }
    

}


function someName() {
if (currentPage == "senate-attendance-starter-page.html") {

    let topTenPercentArrayAtt = leastMost(myArrAtt, myArrLoyalty);
    let bottomTenPercentArrayAtt = leastMost(myArrAtt.reverse(), myArrLoyalty.reverse());

    createTableAtt("leastSenateAtt", bottomTenPercentArrayAtt);
    createTableAtt("mostSenateAtt", topTenPercentArrayAtt);

} else if (currentPage == "senate-party-loyalty-starter-page.html") {
    console.log('we are inside here')

    let topTenPercentArrayLoyalty = leastMost(myArrAtt, myArrLoyalty);
    let bottomTenPercentArrayLoyalty = leastMost(myArrAtt.reverse(), myArrLoyalty.reverse());

    createTableLoyalty("leastSenateLoyalty", bottomTenPercentArrayLoyalty);
    createTableLoyalty("mostSenateLoyalty", topTenPercentArrayLoyalty);
}
}
