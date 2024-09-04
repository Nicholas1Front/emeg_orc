// get clients data from github

let clients_equipaments_array = [];

async function getClientsData(){
    try{
        const response = await fetch("https://nicholas1front.github.io/emeg_orc/apps/data/clients_equipaments.json");

        if(!response.ok){
            throw new Error(`HTTP Error ! Status : ${response.status}`);
        }

        clients_equipaments_array = await response.json();

        console.log(clients_equipaments_array);

        return clients_equipaments_array;
    }
    catch(error){
        console.error(`Failed to load json : ${error}`);
    }
}

getClientsData();

//add-client-section

//elements
const addClientInput = document.querySelector("#add-client-input");
const addClientBtn = document.querySelector("#add-client-btn");
//functions

function addClientProcess(){

    console.log(clients_equipaments_array);

    const newClient = {
        name : addClientInput.value,
        equipaments : []
    }

    clients_equipaments_array.push(newClient);

    console.log(clients_equipaments_array);
    
    return clients_equipaments_array;
}

// event listerner

addClientBtn.addEventListener("click", (event)=>{
    addClientProcess();
});
