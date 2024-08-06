//elements
const clientsSelectList = document.querySelector("#clients-select-list");
const equipamentsSelectList = document.querySelector("#equipaments-select-list")

//functions 
async function getClientsData(){
    try{
        const response = await fetch("../data/clients_equipaments.json");

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

function createClientsList(){
    getClientsData().then(clients =>{

        let clientsData = [];
    
        clients.forEach(client =>{
            clientsData.push(client.name.toUpperCase());
        });

        clientsData.forEach(clients => {
            let option = document.createElement("option");

            option.text = clients;

            clientsSelectList.add(option);
        })

        return clientsData;

    }).catch(error =>{
        console.error(`An error occured : ${error}`);
    })
}

function testClient(){
    getClientsData().then(clients =>{

        let equipamentsData = [];

        clients.forEach(client =>{
            if(clientsSelectList.value === client.name.toUpperCase()){
                equipamentsData.push(client.equipaments);

                equipamentsData.forEach(equipament =>{
                    let option = document.createElement("option");

                    option.text = equipament;

                    equipamentsSelectList.add(option); 
                })
            }
        })

        

    }).catch(error =>{
        console.error("An error occurred !" + error);
    })
}
//testing

createClientsList();

//event listeners

clientsSelectList.addEventListener("change", function(){
    testClient();
})

