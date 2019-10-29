// ************************************SENATE/HOUSE Congress - SPRINT 1
const currentPage = location.pathname.split("/").pop()

// document.getElementById("senate-data").innerHTML = JSON.stringify(data,null,2);

// get the array of members
let members;


//*************************************************************************Fetching data from Propublica

//get house/senate congress URL
//create function: if location.pathname = house,  apiUrl = "https://api.propublica.org/congress/v1/115/house/members.json"
let apiUrl;

function urlLocation() {

    if (currentPage == "house-starter-page%2010.50.37.html") {
        apiUrl = "https://api.propublica.org/congress/v1/115/house/members.json";

    } else if (currentPage == "senate-data%2010.50.38.html") {
        apiUrl = "https://api.propublica.org/congress/v1/115/senate/members.json";
    }
}

urlLocation();

// let apiUrl = "https://api.propublica.org/congress/v1/115/house/members.json";



//getData(Url)
fetchData(apiUrl)
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


//function w/ all functions used after fetch
function executeAfterFetch() {
    console.log("data received! " + members)

    hiddenLoader();

    createTable("mainTable", members)

    document.getElementById("republican").addEventListener("click", displayFilteredTable);
    document.getElementById("democrat").addEventListener("click", displayFilteredTable);
    document.getElementById("independent").addEventListener("click", displayFilteredTable);

    getFilteredState("filteredState")
    document.getElementById("filteredState").addEventListener("change", displayFilteredTable);

}

function hiddenLoader(){
    let loading = document.getElementById("loader");
    loading.classList.add("hidden");
    let myData = document.getElementById("dynamic-content");
    myData.classList.remove("hidden");
 }


// let members = data.results[0].members.filter(member => member.votes_with_party_pct != null);
var selectedInput = document.getElementById("filteredState");
var checkboxes = document.querySelectorAll("input[type = checkbox]");



// createTable("mainTable", members);
function createTable(tableId, members) {

    //create table and tbody
    let table = document.getElementById(tableId);
    let tbl = document.createElement('tbody');

    // to make the 1st table empty
    table.innerHTML = "";


    //create thead and tr (not coming from HTML anymore)
    //create a thead element (document.createElement... etc.)
    let thead = document.createElement('thead');
    // thead.classList.add("backgroundMickey");
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



// *********Button Read More - Read Less
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


//************************************FILTER - SPRINT 2 EPIC 5

// array with R, D, I
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


// array with result of the R/D/I checked
function getChecked() {
    var checked = [];

    for (var j = 0; j < checkboxes.length; j++) {
        var checkbox = checkboxes[j];
        if (checkbox.checked)
            checked.push(checkbox.value);
    }
    return checked;
}


// create filtered table 
function displayFilteredTable() {

    let newFilteredMembers = getFilteredMembers();
    createTable("mainTable", newFilteredMembers);

}



// *********DROPDOWN LIST - SPRINT 3 EPIC 1
// create an array of all states. get the unique values, ten sort it. Dropdown menu.

// getFilteredState("filteredState");
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
