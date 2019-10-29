const currentPage = location.pathname.split("/").pop()

let members;
let myArrAtt;
let myArrLoyalty;


//***************************************Fetching Data

//*********URL location
function urlLocation() {

    if (currentPage == "house-starter-page%2010.50.37.html") {
        apiUrl = "https://api.propublica.org/congress/v1/115/house/members.json";

    } else if (currentPage == "senate-data%2010.50.38.html") {
        apiUrl = "https://api.propublica.org/congress/v1/115/senate/members.json";

    } else if (currentPage == "senate-attendance-starter-page.html" || "senate-party-loyalty-starter-page.html") {
        apiUrl = "https://api.propublica.org/congress/v1/115/senate/members.json";

    } else if (currentPage == "house-attendance-starter-page.html" || "house-party-loyalty-starter-page.html") {
        apiUrl = "https://api.propublica.org/congress/v1/115/house/members.json";
    }
}

// urlLocation();


//*********async function
// fetchData(apiUrl)
async function fetchData(apiUrl) {

    propublicaData = await fetch(apiUrl, {
            method: "GET",
            dataType: "jsonp",
            headers: {
                "X-API-Key": "3mqBYZOTjeWy2GIUrILiAvYm7SJ5zALJVSnuzItH"
            }
        })
        .then(data => data.json())
        .then(data => data.results[0].members)
        .catch(error => console.log(error))
    members = await (propublicaData.filter(member => member.votes_with_party_pct !== undefined))
    await (executeAfterFetch())
}


//*********function w/ all functions used after fetch
function executeAfterFetch() {
    console.log("data received! " + members)

    hiddenLoader();

    createTable("mainTable", members)

    document.getElementById("republican").addEventListener("click", displayFilteredTable);
    document.getElementById("democrat").addEventListener("click", displayFilteredTable);
    document.getElementById("independent").addEventListener("click", displayFilteredTable);

    getFilteredState("filteredState")
    document.getElementById("filteredState").addEventListener("change", displayFilteredTable);


    getPartyMembers();
    myArrAtt = getArray(members);
    myArrLoyalty = getArray(members);
    someName();


}

//*********function to hide loader after fecth
function hiddenLoader() {
    let loading = document.getElementById("loader");
    loading.classList.add("hidden");
    let myData = document.getElementById("dynamic-content");
    myData.classList.remove("hidden");
}



/////////////////***********************CONGRESS Senate & House
// var selectedInput = document.getElementById("filteredState");
// var checkboxes = document.querySelectorAll("input[type = checkbox]");

function createTable(tableId, members) {

    //create table and tbody
    let table = document.getElementById(tableId);
    let tbl = document.createElement('tbody');

    // to make the 1st table empty
    table.innerHTML = "";

    let thead = document.createElement('thead');
    let row = document.createElement('tr');

    row.insertCell().innerHTML = "Name";
    row.insertCell().innerHTML = "Party";
    row.insertCell().innerHTML = "State";
    row.insertCell().innerHTML = "Years in Office";
    row.insertCell().innerHTML = "% Votes w/ Party";

    //append rows 'tr' to the thead
    thead.appendChild(row)


    // new row of tbody (w/ data)
    for (var i = 0; i < members.length; i++) {
        let newrow = document.createElement('tr');

        if (members[i].middle_name == null) {
            members[i].middle_name = "";
        }

        let fullName = members[i].first_name + " " + members[i].middle_name + " " + members[i].last_name;
        let party = members[i].party;
        let state = members[i].state;
        let seniority = members[i].seniority;
        let votes = members[i].votes_with_party_pct;


        newrow.insertCell().innerHTML = fullName;
        newrow.insertCell().innerHTML = party;
        newrow.insertCell().innerHTML = state;
        newrow.insertCell().innerHTML = seniority;
        newrow.insertCell().innerHTML = votes + "%";
        tbl.appendChild(newrow);

    }

    table.appendChild(tbl); //append body to the table
    table.appendChild(thead); //append thead to the table
}


//*********button Read More - Read Less
function readButton() {
    var dots = document.getElementById("dots");
    var moreText = document.getElementById("more");
    var btnText = document.getElementById("myBtn");

    if (dots.style.display === 'none') {
        dots.style.display = "inline";
        btnText.innerHTML = "Read More";
        moreText.style.display = "none";
    } else {
        dots.style.display = "none";
        btnText.innerHTML = "Read Less";
        moreText.style.display = "inline";
    }
}

//***************************************Filter data

//*********array with R, D, I
function getFilteredMembers() {

    let filteredMembers = [];
    for (var i = 0; i < members.length; i++) {
        let party = members[i].party;
        let state = members[i].state;

        if (getChecked().includes(party) && (selectedInput.value == state || selectedInput.value == 'all')) {
            filteredMembers.push(members[i]);

            return filteredMembers;
        }
    }
}


//*********array with result of the R/D/I checked
function getChecked() {
    var checked = [];

    for (var j = 0; j < checkboxes.length; j++) {
        var checkbox = checkboxes[j];
        if (checkbox.checked)
            checked.push(checkbox.value);
    }
    return checked;
}


//*********create filtered table 
function displayFilteredTable() {

    let newFilteredMembers = getFilteredMembers();
    createTable("mainTable", newFilteredMembers);

}

//***************************************Dropdown list

//*********create an array of all states
function getFilteredState(selectId) {
    let select = document.getElementById(selectId);
    // select.innerHTML = ""; //its deleting the --ALL--

    //get a new array to get an array with unique values
    let stateNewArray = [];

    for (var i = 0; i < members.length; i++) {
        if (!stateNewArray.includes(members[i].state)) { //this is a denial. so if stateNewArray -that its empty- doesnt include state => push it
            stateNewArray.push(members[i].state)
        }
    }

    stateNewArray.sort();

    for (let i = 0; i < stateNewArray.length; i++) { // the members array has been replaced by the new array with the unique values
        // let state = members[i].state; // its not working anymore because we created the new array
        let option = document.createElement('option');
        option.value = stateNewArray[i];
        option.innerHTML = stateNewArray[i];
        select.appendChild(option);
    }
}

/////////////////*********************** ATTENDANCE & LOYALTY **** Senate & House

//*********get array of party members
function getPartyMembers() {
    let democrats = [];
    let republicans = [];
    let independents = [];
    let total = [];

    let democratsVotes = [];
    let republicansVotes = [];
    let independentsVotes = [];
    let totalVotes = [];

    for (var i = 0; i < members.length; i++) {
        if (members[i].votes_with_party_pct != null) {
            if (members[i].party.includes("D")) {
                democrats.push(members[i].party) //***Number of Resp - 1st table - PARTY LOYALTY
                democratsVotes.push(members[i].votes_with_party_pct) //***% Voted w/ Party - 1st table - PARTY LOYALTY

            } else if (members[i].party.includes("R")) {
                republicans.push(members[i].party) //***Number of Resp - 1st table - PARTY LOYALTY
                republicansVotes.push(members[i].votes_with_party_pct) //***% Voted w/ Party - 1st table - PARTY LOYALTY

            } else if (members[i].party.includes("I")) {
                independents.push(members[i].party) //***Number of Resp - 1st table - PARTY LOYALTY
                independentsVotes.push(members[i].votes_with_party_pct) //***% Voted w/ Party - 1st table - PARTY LOYALTY
            }
            total.push(members[i].party) //***Number of Resp - 1st table - PARTY LOYALTY
            totalVotes.push(members[i].votes_with_party_pct) //***% Voted w/ Party - 1st table - PARTY LOYALTY
        }
    }

    document.getElementById("democrats").innerHTML = democrats.length;
    document.getElementById("republicans").innerHTML = republicans.length;
    document.getElementById("independents").innerHTML = independents.length;
    document.getElementById("total").innerHTML = democrats.length + republicans.length + independents.length;


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

// getPartyMembers();


//*********get the array for the most/least engaged SENATE
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

            arrAtt.push({
                fullName,
                missed_votes,
                missed_votes_pct
            })

            arrLoyalty.push({
                fullName,
                partyVotes,
                votes_with_party_pct
            })

        }
    }

    if (currentPage == "senate-attendance-starter-page.html") {
        return arrAtt.sort(function (a, b) {
            return a.missed_votes - b.missed_votes
        });
    } else if (currentPage == "senate-party-loyalty-starter-page.html") {
        return arrLoyalty.sort(function (a, b) {
            return a.partyVotes - b.partyVotes
        });

    }
}

//*********function least/most - SENATE
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
    } else if (currentPage == "senate-party-loyalty-starter-page.html") {
        console.log("loyaltyArray primeiro: ", loyaltyArray)
        return loyaltyArray;
    }

}

//*********display table ATTENDANCE
function createTableAtt(tableId, members) {

    // console.log("inside table attendance!")

    let table = document.getElementById(tableId);
    console.log('table id: ', tableId)
    console.log(table)

    // to make the 1st table empty
    // table.innerHTML = "";

    if (table) {

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

//*********display table LOYALTY
function createTableLoyalty(tableId, members) {

    let table = document.getElementById(tableId);

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

//*********display according w/ current page 
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

