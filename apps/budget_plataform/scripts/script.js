//elements
const clientsSelectList = document.querySelector("#clients-select-list");
const equipamentsSelectList = document.querySelector("#equipaments-select-list");
const notIdentifiedInput = document.querySelector("#not-identified-input");

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

function createEquipamentsList(){
    getClientsData().then(clients =>{

        let equipamentsData = [];

        clients.forEach(client =>{
            if(clientsSelectList.value === "(NÃO IDENTIFICADO)" || clientsSelectList.value === ""){
                equipamentsSelectList.style.display = "none";
                notIdentifiedInput.style.display = "block";

                return notIdentifiedInput.value;
            }
            else if(clientsSelectList.value === client.name.toUpperCase()){
                equipamentsData = equipamentsData.concat(client.equipaments);

                equipamentsSelectList.style.display = "block";
                notIdentifiedInput.style.display = "none";

                equipamentsSelectList.innerHTML = "";

                equipamentsData.forEach(equipament =>{
                    let option = document.createElement("option");

                    option.text = equipament;

                    equipamentsSelectList.add(option); 

                })

                return equipamentsSelectList.value;
            }
        })
    }).catch(error =>{
        console.error("An error occurred !" + error);
    })
}

function popupErrorMsg(message){
    
}

//testing

createClientsList();

//event listeners

clientsSelectList.addEventListener("change", function(){
    createEquipamentsList();
})

