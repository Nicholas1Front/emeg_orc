const clientName = document.querySelector("#client-name")

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

getClientsData().then(clients =>{

    let clientSearched = 0;

    clientSearched = clients[81];

    console.log(clientSearched);

    console.log(clientSearched.name.includes("ZORTEA"))
}).catch(error => {
    console.log(error)
})
