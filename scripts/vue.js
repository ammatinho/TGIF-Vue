const app = new Vue({
    el: "#app",
    data: {
        members: [],
        loading: true,
        checkedParties: ["R", "D", "I"],
        selectedState: "all",
        selected: "",
        message: "Sorry, there are no results for that match.",
        currentPage: "",
    },
    created() {

        this.urlLocation();
        this.fetchData(apiUrl);
        // this.reduceMethod();
    },
    methods: {

        urlLocation() {
            this.currentPage = location.pathname.split("/").pop();

            if (this.currentPage == "house-starter-page%2010.50.37.html") {
                apiUrl = "https://api.propublica.org/congress/v1/115/house/members.json";

            } else if (this.currentPage == "senate-data%2010.50.38.html") {
                apiUrl = "https://api.propublica.org/congress/v1/115/senate/members.json";

            } else if (this.currentPage == "senate-attendance-starter-page.html") {
                apiUrl = "https://api.propublica.org/congress/v1/115/senate/members.json";

            } else if (this.currentPage == "house-attendance-starter-page.html") {
                apiUrl = "https://api.propublica.org/congress/v1/115/house/members.json";

            } else if (this.currentPage == "senate-party-loyalty-starter-page.html") {
                apiUrl = "https://api.propublica.org/congress/v1/115/senate/members.json";

            } else if (this.currentPage == "house-party-loyalty-starter-page.html") {
                apiUrl = "https://api.propublica.org/congress/v1/115/house/members.json";
            }
        },

        async fetchData(apiUrl) {
            this.members = await fetch(apiUrl, {
                    method: "GET",
                    dataType: "jsonp",
                    headers: {
                        "X-API-Key": "3mqBYZOTjeWy2GIUrILiAvYm7SJ5zALJVSnuzItH"
                    }
                })
                .then(data => data.json())
                .then(data => data.results[0].members.filter(member => member.votes_with_party_pct !== undefined))
                .catch(error => console.log(error))
            this.loading = false;
        },

        createCustomMembersArray(members, keys) {
            let newArray = [];
            for (let i = 0; i < members.length; i++) {
                let fullName = "";
                if (members[i].middle_name == null) {
                    fullName = members[i].first_name + " " + members[i].last_name;
                } else {
                    fullName = members[i].first_name + " " + members[i].middle_name + " " + members[i].last_name;
                }


                newArray.push({
                    name: fullName,
                    votes: members[i][keys[0]],
                    percentage: members[i][keys[1]] + "%"
                })
            }

            return newArray;
        },

        tenPercentArrayCalculator(array, key) {
            let newArray = []
            for (let i = 0; i < array.length; i++) {
                if (i < array.length * 0.1) {
                    newArray.push(array[i])
                } else if (newArray[newArray.length - 1][key] == array[i][key]) {
                    newArray.push(array[i])
                } else {
                    break;
                }
            }
            return newArray;
        },

        reduceMethod(array) {
            let sum = 0;
            for (let i = 0; i < array.length; i++) {
                sum += array[i];
            }
            return sum;
        }


    },
    computed: {
        //get the filtered members of the checkbox = Party => this function go to HTML to v-for
        getFilteredMembers() {
            let members = this.members;
            let filteredMembers = [];

            for (var i = 0; i < members.length; i++) {
                let party = members[i].party;
                let state = members[i].state;

                if ((this.checkedParties.includes(party)) && (this.selectedState == state || this.selectedState == 'all')) {
                    filteredMembers.push(members[i]);
                }
            }

            return filteredMembers;
        },

        //get the filtered members of the filter = State => this function go to HTML to v-for
        stateMembers() {
            let stateNewArray = [];
            let members = this.members;

            for (var i = 0; i < members.length; i++) {

                if (!stateNewArray.includes(members[i].state)) {
                    stateNewArray.push(members[i].state);
                }
            }

            stateNewArray.sort();

            return stateNewArray;
        },

        //*********ATTENDANCE & LOYALTY *** SENATE & HOUSE
        //get the party members 
        getPartyMembers() {
            let members = this.members;

            let democrats = [];
            let republicans = [];
            let independents = [];
            let total = [];

            let democratsVotes = [];
            let republicansVotes = [];
            let independentsVotes = [];
            let totalVotes = [];

            for (var i = 0; i < members.length; i++) {
                console.log(democrats)
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


            if (democratsVotes.length != 0) {
                democratsVotesPct = (this.reduceMethod(democratsVotes) / democrats.length);
            } else {
                democratsVotesPct = 0;
            }
            if (republicansVotes.length != 0) {
                republicansVotesPct = (this.reduceMethod(republicansVotes) / republicans.length);
            } else {
                republicansVotesPct = 0;
            }
            if (independentsVotes.length != 0) {
                independentsVotesPct = (this.reduceMethod(independentsVotes) / independents.length);
            } else {
                independentsVotesPct = 0;
            }
            if (totalVotes.length != 0) {
                totalVotesPct = (this.reduceMethod(totalVotes) / total.length);
            } else {
                totalVotesPct = 0;
            }


            return {
                democratsNumber: democrats.length,
                democratsVotes: democratsVotesPct.toFixed(2) + "%",

                republicansNumber: republicans.length,
                republicansVotes: republicansVotesPct.toFixed(2) + "%",

                independentNumber: independents.length,
                independentVotes: independentsVotesPct.toFixed(2) + "%",

                totalNumber: total.length,
                totalVotes: totalVotesPct.toFixed(2) + "%",
            }

        },

        getArray() {
            let members = this.members;

            let arrAtt = this.createCustomMembersArray(members, ["missed_votes", "missed_votes_pct"]);
            let arrLoyalty = this.createCustomMembersArray(members, ["total_votes", "votes_with_party_pct"]);

            if (this.currentPage == "senate-attendance-starter-page.html") {
                arrAtt = arrAtt.sort(function (a, b) {
                    return a.votes - b.votes
                });

            } else if (this.currentPage == "house-attendance-starter-page.html") {
                arrAtt = arrAtt.sort(function (a, b) {
                    return a.votes - b.votes
                });

            } else if (this.currentPage == "senate-party-loyalty-starter-page.html") {
                arrLoyalty = arrLoyalty.sort(function (a, b) {
                    return a.votes - b.votes
                });

            } else if (this.currentPage == "house-party-loyalty-starter-page.html") {
                arrLoyalty = arrLoyalty.sort(function (a, b) {
                    return a.votes - b.votes
                });
            }

            return {
                arrAtt,
                arrLoyalty,
            }

        },

        leastMost() {
            return {
                leastLoyal: this.tenPercentArrayCalculator(this.getArray.arrLoyalty, "total_votes"),
                mostLoyal: this.tenPercentArrayCalculator(this.getArray.arrLoyalty.reverse(), "total_votes"),
                leastEngaged: this.tenPercentArrayCalculator(this.getArray.arrAtt, "missed_votes"),
                mostEngaged: this.tenPercentArrayCalculator(this.getArray.arrAtt.reverse(), "missed_votes")
            }
        }
    }


})