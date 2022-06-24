// / Q1 print the result 
// npm i request jsdom 
const request = require('request');
const fs = require("fs");
const jsdom = require("jsdom");
let url = "https://www.espncricinfo.com/series/indian-premier-league-2022-1298423/gujarat-titans-vs-rajasthan-royals-final-1312200/full-scorecard";
const path = require("path");
const helperObj = require("./helper");

function ScoreCardExecutor(url) {
    request(url, cb);

}


function cb(error, response, body) {
    if (error) {
        console.log('error:', error.message); // Print the error message
    } else if (response && response.statusCode == 404) {
        console.log("Page not found");
    } else {
        console.log("content recieved");
        // console.log(body);
        extractData(body);
    }
}

function extractData(body) {
    const JSDOM = jsdom.JSDOM;
    // pass to newJSDOM 
    let dom = new JSDOM(body);
    // 2. // no meaning 
    // document represent the whole html page 
    let document = dom.window.document;

    // Result
    let output = document.querySelectorAll(".ds-text-compact-xxs.ds-p-2.ds-px-4 p>span");
    let resultElem = output[0];

    let res = resultElem.textContent;
    console.log("result :", res);

    let Othercontentele = document.querySelector(".ds-text-tight-m.ds-font-regular.ds-text-ui-typo-mid");
    let Othercontent = Othercontentele.textContent;
    // console.log("Chl be", Othercontent);



    let teamBlock = document.querySelectorAll(".ds-flex.ds-items-center.ds-cursor-pointer.ds-px-4");
    let teamStats = document.querySelectorAll(".ReactCollapse--content table");
    // let htmlString = "<table>" + teamStats[0].innerHTML + "</table>";
    // console.log(htmlString);
    // + "<table>" + teamStats[1].innerHTML + "</table>"
    // fs.writeFileSync("FirstTeams.html", htmlString);
    // console.log("File Created")
    let firstTeam = teamStats[0];
    let secondTeam = teamStats[2];

    let FirstTeamsName = teamBlock[0].textContent;
    let SecondTeamsName = teamBlock[1].textContent;

    let firstteamArr = FirstTeamsName.split("INNINGS");
    FirstTeamsName = firstteamArr[0].trim();


    let secondteamArr = SecondTeamsName.split("INNINGS");
    SecondTeamsName = secondteamArr[0].trim();


    processTeam(firstTeam, FirstTeamsName, SecondTeamsName, res, Othercontent);
    processTeam(secondTeam, SecondTeamsName, FirstTeamsName, res, Othercontent);
    console.log("~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~")

}

function processTeam(teamELement, currTeam, opponentTeam, result, otherDetails) {
    let allRowswithextras = teamELement.querySelectorAll("tbody tr.ds-border-b.ds-border-line.ds-text-tight-s");
    for (let i = 0; i < allRowswithextras.length; i++) {
        let cRow = allRowswithextras[i];
        let cols = cRow.querySelectorAll("td");
        if (cols.length == 8) {
            let name = cols[0].textContent;
            let runs = cols[2].textContent;
            let balls = cols[3].textContent;
            let fours = cols[5].textContent;
            let sixes = cols[6].textContent;
            let srs = cols[7].textContent;
            // console.log("Name " + name + " plays for " + currTeam + " against " + opponentTeam + " Runs " + runs + " balls " + balls +
            //     " 4s " + fours + " 6s " + sixes + " srs " + srs +
            //     " result " + result + " other details " + otherDetails
            // );
            let dataObj = {
                name,
                runs,
                balls,
                fours,
                sixes,
                srs,
                opponentTeam,
                result,
                otherDetails
            }
            dataOrganizer(currTeam, name, dataObj);

            // Venue, Result, teamName, Opponent Name
        }
    }
    console.log("``````````````````");

}


function dataOrganizer(teamName, playerName, dataObj) {
    // folder will not be present 
    // folder will be present
    const teamPath = path.join(__dirname, "IPL", teamName);

    helperObj.dirCreator(teamPath);
    // file will not be present
    const playerPath = path.join(teamPath, playerName + ".xlsx");

    helperObj.fileHandler(playerPath, dataObj);
}
module.exports = {
    ScoreCardFn: ScoreCardExecutor
}