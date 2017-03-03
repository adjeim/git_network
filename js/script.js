// Hello there! This is the refactored version of my code challenge. To see what I had originally written, scroll down to the commented-out section beginning with *****.

// Next steps I would take in refactoring:

// 1- Create a loop or a recursive function that will call getNetwork for each user in the user's network. 
// 2- Push that data to an array. 
// 3- Use that array to update the dataset for the network graph, creating a new node for each connected user.


const submitButton = document.querySelector('button.m-1');

submitButton.addEventListener('click', getApiData);


function getApiData(event) {
    event.preventDefault();

    const network = document.querySelector('div.network');
    const username = document.querySelector('input.m-1').value;

    let user;
    const userNetwork = [];

    getUser(username, function(user) {
        getNetwork(user, function(user, network) {
            makeDisplay(user, network);
        } );
    });

}

function getUser(username, userCallback) {

    const usersApi = 'https://api.github.com/users/' + username;
    const results = document.querySelector('div.results');
    results.innerHTML = "Loading...";

    let thisUser;

    const userRequest = new XMLHttpRequest();

    userRequest.onreadystatechange = () => {
        if (userRequest.readyState === 4 && userRequest.status === 200) {

            thisUser = JSON.parse(userRequest.responseText);

            const login = thisUser.login;
            const avatar = thisUser.avatar_url;

            console.log(thisUser);
            userCallback.apply(this, [thisUser]);

        } else if (userRequest.status === 404) {
            results.innerHTML = '<p>The user does not exist.</p>';

        };
    }

    userRequest.open('GET', usersApi);
    userRequest.send();

}

function getNetwork(user, networkCallback) {

    const userNetwork = [];
    const usersApi = 'https://api.github.com/users/' + user.login;
    const followingApi = usersApi + '/following';
    const followingRequest = new XMLHttpRequest();

    followingRequest.onreadystatechange = () => {
        if (followingRequest.readyState === 4 && followingRequest.status === 200) {

            const following = JSON.parse(followingRequest.responseText);
            console.log(following);

        
            userNetwork.unshift({
                id: 1,
                label: user.login,
                shape: 'circularImage',
                image: user.avatar_url
            })

            if (following.length > 1) {
                for (let i = 1; i < 6; i++) {
                    let user = {
                        id: (i + 1),
                        label: following[i].login,
                        shape: 'circularImage',
                        image: following[i].avatar_url
                    }
                    // console.log(user);
                    userNetwork.push(user);
                }

                console.log(userNetwork);
            } 

            networkCallback.apply(this, [user, userNetwork]);


        };
    }
    followingRequest.open('GET', followingApi);
    followingRequest.send();
    
}


function makeDisplay(user, network) {

    console.log("Network:", network)

    const nodes = new vis.DataSet(network);

    const edges = new vis.DataSet([
                { from: 1, to: 2 },
                { from: 1, to: 3 },
                { from: 1, to: 4 },
                { from: 1, to: 5 },
                { from: 1, to: 6 }
            ]);

    const data = {
        nodes: nodes,
        edges: edges
    };

    const options = {
        edges: {
            arrows: 'to'
        }
    };

    const container = document.querySelector('div.network');

    const networkShow = new vis.Network(container, data, options);
    console.log(networkShow);
}





// ***** Code as it existed before refactoring:

/* jshint esversion: 6, asi: true */
/* globals vis */
/**
 * Instructions/Notes:
 * - Fork this pen!
 * - vis.js has already been sourced.
 * - Click the gear to add other dependencies.
 * - Codepen will automatically run new changes. This may not be the best
 *   idea for this exercise. You can turn this functionality off in
 *   Settings → Behavior → Auto-Updating Preview.
 */

// function getApiPath(path) {
//   // Feel free to change me!
//   const accessToken = 'Fill me!'
//   return `https://api.github.com/${path}?access_token=${accessToken}`
// }

// const submitButton = document.querySelector('button.m-1');
// const hiddenDiv = document.querySelector('div.hidden');

// submitButton.addEventListener('click', getApiData);
// // submitButton.addEventListener('click', hiddenDiv.style.display = "block");

// function getApiData(event) {
//   event.preventDefault();

//   // I wrote some code in here to test to make sure I was calling the Github API correctly and could display usernames and avatars. Most of it is commented out now, as it is not relevant to the instructions in the exercise.

//   // const results = document.querySelector('div.results');
//   const network = document.querySelector('div.network');

//   // results.innerHTML = "Loading...";

//   // Get the username from the input.
//   const username = document.querySelector('input.m-1').value;

//   let user;

//   const usersApi = 'https://api.github.com/users/' + username;
//   const followingApi = usersApi + '/following';

//   // Create XMLHttpRequest.
//   const userRequest = new XMLHttpRequest();

//   // When the response is ready, get data about the user. If the user does not exist, display a message about that. Show a loading message if the response is not ready.
//   userRequest.onreadystatechange = () => {
//     if (userRequest.readyState === 4 && userRequest.status === 200) {

//       user = JSON.parse(userRequest.responseText);

//       const login = user.login;
//       const avatar = user.avatar_url;

//       // const resultText = '<div><p>' + login + '</p><img src=' + avatar + ' alt=""></div>';
//       // console.log(resultText);
//       // results.innerHTML = resultText;
//     } else if (userRequest.status === 404) {
//       network.innerHTML = '<p>The user does not exist.</p>';
//     } else {
//       network.innerHTML = '<p>Loading...</p>';
//     };
//   };
//   // Open and send the request to the server.
//   userRequest.open('GET', usersApi);
//   userRequest.send();

//   // Create a new request to data about the people that the user is following.
//   const followingRequest = new XMLHttpRequest();
//   followingRequest.onreadystatechange = () => {
//     if (followingRequest.readyState === 4 && followingRequest.status === 200) {

//       console.log(user);
//       console.log(user.following);

//       const following = JSON.parse(followingRequest.responseText);
//       console.log(following);

//       // Create an empty array that stores what the nodes for the network graph will be.
//       const followedUsers = [];

//       // Create the root node for the entered user.
//       followedUsers.push({
//         id: 1,
//         label: user.login,
//         image: user.avatar_url
//       });

//       // Create nodes for up to 5 of the people the entered user is following.
//       if (user.following >= 5) {
//         for (let i = 1; i < 6; i++) {
//           let user = {
//             id: (i + 1),
//             label: following[i].login,
//             image: following[i].avatar_url
//           }
//           followedUsers.push(user);
//         }
//       } else if (user.following > 0 && user.following < 5) {
//         for (let i = 1; i < user.following; i++) {
//           let user = {
//             id: (i + 1),
//             label: following[i].login,
//             image: following[i].avatar_url,

//           };
//           followedUsers.push(user);
//         }
//       } else {
//         console.log("Not following anyone.");
//       }

//       // Create the network graph that shows between 0 and 5 people connected to the entered user.
//       const nodes = new vis.DataSet(followedUsers);

//       const edges = new vis.DataSet([
//         { from: 1, to: 2 }, 
//         { from: 1, to: 3 }, 
//         { from: 1, to: 4 }, 
//         { from: 1, to: 5 }, 
//         { from: 1, to: 6 }
//       ]);

//       const data = {
//         nodes: nodes,
//         edges: edges
//       };

//       const options = {
//         edges: {
//           arrows: 'to'
//         }
//       };

//       const container = document.querySelector('div.network');

//       const network = new vis.Network(container, data, options);

//     }
//   };
//   followingRequest.open('GET', followingApi);
//   followingRequest.send();

// }