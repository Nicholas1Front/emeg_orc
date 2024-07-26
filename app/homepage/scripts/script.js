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
    const data = clients;

    console.log(data);

    data.forEach(client => {
        if (client.name == "ZORTEA"){
            console.log(client.name)
        }
    });
}).catch(error => {
    console.log(error)
})
