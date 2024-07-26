
async function importClientsData(){
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

const data = importClientsData();

