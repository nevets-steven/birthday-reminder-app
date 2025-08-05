
function getNextBirthday(friend){
    const today = new Date();
    const currentYear = today.getFullYear();
    const [month,day,year] = friend.birthday.split('/');

    const birthDate = new Date(currentYear, month - 1, day);
    if (birthDate < today){
        birthDate.setFullYear(currentYear + 1);
    }
    return birthDate
}

function getJSONData(){
    fetch('birthdays.json')
        .then( Response => {
            if (Response.ok){
                return Response.json(); 
            }
            else{
                throw new Error('Bad Response')
            }
        }
        )
        .then(data => {
            // this is where i place it in HTML
            // console.log(data);
            // document.getElementById('outputDiv').innerText = JSON.stringify(data, null, 2); //raw data

            // const friendBirthday = document.getElementById('friendBirthday');
            // for (const friend of data){
            //     // console.log(friend.name);
            //     // dataContainer.innerHTML +=

            //     // `<ul>
            //     //     <li>Name: ${friend.name}</li>
            //     //     <li>Birthday: ${friend.birthday}</li>
            //     //     <li>Notes: ${friend.notes}</li>
            //     //  </ul>`
            //     // console.log(typeof(friend.birthday))
            //     const birthdayString = friend.birthday;

            //     const today = new Date();
            //     const currentYear = today.getFullYear();
            //     const [month, day, year] = birthdayString.split('/');

            //     const birthDate = new Date(currentYear, month-1, day);
                

            //     if (birthDate < today){
            //         birthDate.setFullYear(currentYear + 1);
            //     }

            //     // console.log(birthDate);

            //     const difference = (birthDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24);

            //     if (difference >= 0 && difference <= 3){
            //         friendBirthday.innerHTML += 
            //         `<ul>
            //             <li>Name: ${friend.name}</li>
            //             <li>Birthday: ${friend.birthday}</li>
            //             <li>Notes: ${friend.notes}</li>
            //         </ul>`;
            //     }
            //     else{
            //         const otherBirthday = document.getElementById('otherBirthdays');

            //         // otherBirthday.innerHTML += 
            //         // `<ul>
            //         //     <li>Name: ${friend.name}</li>
            //         //     <li>Birthday: ${friend.birthday}</li>
            //         //     <li>Notes: ${friend.notes}</li>
            //         // </ul>`;
            //         // console.log(friend);
            //     }
            // }
            
            const friendNextBirthday = data.map(friend => ({
                ...friend,
                friendNextBirthday: getNextBirthday(friend)
            }));

            friendNextBirthday.sort((a, b) => a.friendNextBirthday.getTime() - b.friendNextBirthday.getTime());


            //placing HTML into webpage

            const friendBirthday = document.getElementById('friendBirthday');
            const otherBirthday = document.getElementById('otherBirthdays');

            for (const friend of friendNextBirthday){
                // console.log(friend);
                const today = new Date();
                const difference = (friend.friendNextBirthday.getTime() - today.getTime()) / (1000 * 60 * 60 * 24);
                if (difference >= 0 && difference <= 3) {
                    
                    friendBirthday.innerHTML += 
                    `
                    <ul>
                        <li>Name: ${friend.name}</li>
                        <li>Birthday: ${friend.friendNextBirthday.toDateString()}</li>
                        <li>Notes: Their birthday is in ${Math.ceil(difference)} day(s)!</li>
                    </ul>
                    `;
                }
                else{
                    otherBirthday.innerHTML += 
                    `<ul>
                        <li>Name: ${friend.name}</li>
                        <li>Birthday: ${friend.friendNextBirthday.toDateString()}</li>
                        <li>Notes: Their birthday is in ${Math.ceil(difference)} day(s)!</li>
                    </ul>`;
                }

            }
            return friendNextBirthday;
        })
        .catch(error => console.error('Error with data', error));

}
getJSONData();

