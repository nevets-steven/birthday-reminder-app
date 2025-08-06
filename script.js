let tokenClient;
let accessToken;
let selectedFriend; // for google event, might change to array to handle multiple birthdays within 3 days
window.onload = () => {
  initGoogleAuth();
};


function getNextBirthday(friend){
    const today = new Date (2026, 3, 10);
    today.setHours(0,0,0,0);
    const currentYear = today.getFullYear();
    const [month,day] = friend.birthday.split('/');

    const birthDate = new Date(currentYear, month - 1, day);
    birthDate.setHours(0,0,0,0); //redundant but in case i change dates later on.
    if (birthDate < today){
        birthDate.setFullYear(currentYear + 1);
    }

    return birthDate;
}
function mapFriend(data){
    const friendNextBirthday = data.map(friend => ({
        ...friend,
        friendNextBirthday: getNextBirthday(friend)
    }));

    friendNextBirthday.sort((a, b) => a.friendNextBirthday.getTime() - b.friendNextBirthday.getTime()); //sorting by closest to fartheest birthday by date.

    return friendNextBirthday;
}
function setHTML(friend){
    //for placing HTML onto page

    const friendBirthday = document.getElementById('friendBirthday');
    const otherBirthday = document.getElementById('otherBirthdays');

    const mappedFriends = mapFriend(friend);

    for (const friend of mappedFriends){
        const today = new Date (2026, 3, 10);
        today.setHours(0,0,0,0);

        const difference = Math.ceil((friend.friendNextBirthday.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));

        if (difference >= 0 && difference <= 3){
            selectedFriend = friend;
            switch (difference){
                case 0:
                    friendBirthday.innerHTML +=
                        `
                        <h2>Today is ${friend.name}'s birthday!</h2>
                        <ul>
                            <li>Name: ${friend.name}</li>
                            <li>Birthday: ${friend.friendNextBirthday.toDateString()}</li>
                            <li>Notes: Their birthday is today! Say Happy Birthday!</li>
                        </ul>
                        `
                        break;
                case 1:
                    friendBirthday.innerHTML +=
                        `
                        <h2>Tomorrow is ${friend.name}'s birthday!</h2>
                        <ul>
                            <li>Name: ${friend.name}</li>
                            <li>Birthday: ${friend.friendNextBirthday.toDateString()}</li>
                            <li>Notes: Their birthday is tomorrow!</li>
                        </ul>
                        `
                        break;
                default:
                    friendBirthday.innerHTML += 
                    `
                    <h2>These birthday(s) are in ${difference} days!</h2>
                    <ul>
                        <li>Name: ${friend.name}</li>
                        <li>Birthday: ${friend.friendNextBirthday.toDateString()}</li>
                        <li>Notes: Their birthday is in ${difference} day(s)!</li>
                    </ul>
                    `;
                    break;
            }
        }
        else{
            otherBirthday.innerHTML += 
                `<ul>
                    <li>Name: ${friend.name}</li>
                    <li>Birthday: ${friend.friendNextBirthday.toDateString()}</li>
                    <li>Notes: Their birthday is in ${difference} day(s)!</li>
                </ul>`;
        }

    }
}




function getJSONData(){
    fetch('birthdays.json')
        .then(Response => {
            if (Response.ok){
                return Response.json(); 
            }
            else{
                throw new Error('Bad Response')
            }
        }
        )
        .then(data => {
            const friendNextBirthday = mapFriend(data);
            setHTML(friendNextBirthday);
            return friendNextBirthday;
        })
        .catch(error => console.error('Error with data', error));

}
getJSONData();


document.getElementById('addToCalendar').addEventListener('click', () => {
    tokenClient.requestAccessToken();
})

//setting up google authentication, sign in window
function initGoogleAuth() {
  tokenClient = google.accounts.oauth2.initTokenClient({
    client_id: '399587837151-1tp4q8uofkl7cr15cuvneue8mo22ga7d.apps.googleusercontent.com',
    scope: 'https://www.googleapis.com/auth/calendar.events',
    callback: (tokenResponse) => {
      accessToken = tokenResponse.access_token;
      console.log('Access token granted:', accessToken);
      // Proceed to send event
      sendToGoogleCalendar(selectedFriend); 
    },
  });
}

function createGoogleEvent(friend){
    const event = {
            summary: `Birthday reminder: ${friend.name}`,
            description: friend.notes || "Don't forget to wish them a happy birthday!",
            start: {
                date: friend.friendNextBirthday.toISOString().split('T')[0],
                timeZone: "America/New_York"
            },
            end: {
                date: getNextDay(friend.friendNextBirthday),
                timeZone: "America/New_York"
        }
    }
    return event;
}
    
function getNextDay(date){
    const nextDay = new Date(date);
    nextDay.setDate(nextDay.getDate() + 1);
    return nextDay.toISOString().split('T')[0];
}
function sendToGoogleCalendar(friend){
    const event = createGoogleEvent(friend);
    console.log(event);

    //add API call here to post into calendar
}

