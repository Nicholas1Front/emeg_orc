//elements
const clientNameList = document.querySelector("#client-name-list");

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

async function createList(){
    getClientsData().then(clients =>{

        let clientsData = clients;

        for(let i = 0; i < clientsData.lenght ; i++){
            let option = document.createElement("option");

            option.text = clientsData.name[i];

            clientNameList.add(option);
        }
    }).catch(error =>{
        console.error(`An error occured : ${error}`);
    })
}

//testing

createList();

