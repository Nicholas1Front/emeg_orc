//elements
const clientSelectList = document.querySelector("#client-select-list");

async function getClientsData(){
    try{
        const response = await fetch("data/clients_equipaments.json");

        if (!response.ok){
            throw new Error(`HTTP Error ! Status : ${response.status}`);
        }

        const clients = await response.json();

        return clients;
    }

    catch(error){
        console.log(`Failed to load json : ${error}`);
    }
}

function createList(){
    getClientsData().then(clients =>{

        let clientsData = [];
    
        clients.forEach(client =>{
            clientsData.push(client.name);
        })

        console.log(clientsData);

        clientsData.forEach(clients => {
            let option = document.createElement("option");

            option.text = clients;

            clientSelectList.add(option);
        })

    }).catch(error =>{
        console.error(`An error occured : ${error}`);
    })
}

//testing

createList();

