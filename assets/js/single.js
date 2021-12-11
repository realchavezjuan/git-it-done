var issueContainerEl = document.querySelector("#issues-container");
var limitWarningEl = document.querySelector("#limit-warning");
var repoNameEl = document.querySelector("#repo-name");

var getRepoName = function(){
    var queryString = document.location.search;
    var repoName = queryString.split("=")[1];

    
    if(repoName) {
        // calls function to get issues
        getRepoIssue(repoName);
        // adds repo name to the header
        repoNameEl.textContent = repoName;
    }
    else {
        // if no repo is given, redirect to the home page
        document.location.replace("./index.html");
    }
}
var getRepoIssue = function(repo){
    
    console.log(repo);
    var apiUrl = "https://api.github.com/repos/" + repo + "/issues?direction=asc";
    fetch(apiUrl).then(function(response){
        // request was successful
        if (response.ok) {
            response.json().then(function(data) {
                displayIssues(data);

                // check if data has paginated issues
                if (response.headers.get("Link")){
                    displayWarning(repo);
                }
            });
        }
        else {
            // sends user back to home page if request is not successful
            document.location.replace("./index.html");
        }
    });
}

var displayIssues = function(issues){

    if (issues.length === 0) {
        issueContainerEl.textContent = "This repo has no open issues!";
        return;
    }
    for (var i = 0; i < issues.length; i++) {
        // creates a link element to take users to the issue on github
        var issueEl = document.createElement("a");
        /// create a span to hold issue title
        var titleEl = document.createElement("span");
        titleEl.textContent = issues[i].title;

        //append to container
        issueEl.appendChild(titleEl);

        // create a type  element
        var typeEl = document.createElement("span");

        // check if issue is an actual issue or a pull request
        if (issues[i].pull_request) {
            typeEl.textContent = "(Pull Request)";
        }
        else {
            typeEl.textContent = "(Issue)";
        }

        // append to container
        issueEl.appendChild(typeEl);

        issueEl.classList = "list-item flex-row justify-space-between align-center";
        issueEl.setAttribute("href", issues[i].html_url);
        issueEl.setAttribute("target", "_blank");

        issueContainerEl.appendChild(issueEl);
    }
}

var displayWarning = function(repo){
    // add tet to warning container
    limitWarningEl.textContent = "To see more than 30 issues, visit ";

    var linkEl = document.createElement("a");
    linkEl.setAttribute("href", "https://github.com/" + repo + "/issues");
    linkEl.setAttribute("target", "_blank");

    //append to warning container
    limitWarningEl.appendChild(linkEl);
}

getRepoName();