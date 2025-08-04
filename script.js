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
            console.log(data);
            document.getElementById('outputDiv').innerText = JSON.stringify(data, null, 2); //raw data

            const dataContainer = document.getElementById('dataContainer');
            for (const friend of data){
                console.log(friend.name);
                dataContainer.innerHTML +=

                `<ul>
                    <li>Name: ${friend.name}</li>
                    <li>Birthday: ${friend.birthday}</li>
                    <li>Notes: ${friend.notes}</li>
                 </ul>`
            }
             
        })
}
getJSONData();