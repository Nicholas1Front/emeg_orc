// get clients data from github

let clients_equipaments_array = [];

async function getClientsData(){
    try{
        const response = await fetch("https://nicholas1front.github.io/emeg_orc/apps/data/clients_equipaments.json");

        if(!response.ok){
            throw new Error(`HTTP Error ! Status : ${response.status}`);
        }

        let clients_equipaments = await response.json();

        let clientToPush = null;

        clients_equipaments.forEach((client)=>{
            clientToPush = {
                name : client.name.toUpperCase(),
                equipaments : client.equipaments, 
            };

            clientToPush.equipaments.forEach((equipament)=>{
                clientToPush.equipaments = equipament.toUpperCase();
            })

            clients_equipaments_array.push(clientToPush);
        })

        console.log(clients_equipaments_array);

        return clients_equipaments_array;
    }
    catch(error){
        console.error(`Failed to load json : ${error}`);
    }
}

getClientsData();

// customer-base-plataform-container

// elements
const customerBasePlataformContainer  = document.querySelector(".customer-base-plataform-container");

// confirmation popup

// elements
const overlay = document.querySelector(".overlay");
const closeConfirmationPopupBtn = document.querySelector("#close-confirmation-popup-btn");
const confirmationPasswordInput = document.querySelector("#confirmation-password-input");
const wrongPasswordSpan = document.querySelector(".wrong-password-span");
const confirmationPopupBtn = document.querySelector("#confirmation-popup-btn");
const confirmationPassword = "88320940";

function showConfirmationPopup(){
    overlay.style.display = "flex";
    customerBasePlataformContainer.style.filter = "blur(9px)";
    wrongPasswordSpan.style.display = "none";
}

function closeConfirmationPopup(){
    overlay.style.display="none";
    customerBasePlataformContainer.style.filter = "blur(0)"
}

function confirmationProcess(...functionToBeExecuted){
    showConfirmationPopup();

    confirmationPopupBtn.addEventListener('click',()=>{
        if(confirmationPasswordInput.value === confirmationPassword){
            functionToBeExecuted.forEach(code =>{
                code();
            })
            
            closeConfirmationPopup();
        }else{
            wrongPasswordSpan.style.display = "block";

            setTimeout(()=>{
                wrongPasswordSpan.style.display = "none";
            },10000);

            confirmationPasswordInput.addEventListener("focus",()=>{
                wrongPasswordSpan.style.display = "none";
            })
        }
    })
}

closeConfirmationPopupBtn.addEventListener("click", ()=>{
    closeConfirmationPopup()
})

//message popup

//elements
const messagePopup = document.querySelector(".message-popup");
const closeMessagePopupBtn= document.querySelector(".close-message-popup-btn");
const messagePopupSpan = document.querySelector(".message-popup-span");

//functions

function showMessagePopup(messageType, messageSpan){
    if(messageType === "errorMsg"){
        messagePopup.style.backgroundColor = "#000";
        messagePopup.style.color = "#fff";
    }

    if(messageType === "sucessMsg"){
        messagePopup.style.backgroundColor = "#42f55a"; //green color
        messagePopup.style.color = "#fff"
    }

    messagePopupSpan.innerText = messageSpan;

    messagePopup.style.display = "block";

    setTimeout(closeConfirmationPopup,4000);
}

function closeMessagePopup(){
    messagePopupSpan.innerText = "";
    messagePopup.style.display = "none";
}

//add-client-section

//elements
const addClientInput = document.querySelector("#add-client-input");
const addClientBtn = document.querySelector("#add-client-btn");
//functions

function addClientProcess(){
    function addClient(){
        console.log(clients_equipaments_array);

            const newClient = {
                name : addClientInput.value,
                equipaments : []
            }

            clients_equipaments_array.push(newClient);

            console.log(clients_equipaments_array);

            showMessagePopup("sucessMsg", "Cliente adicionado com sucesso ! ")
            
            return clients_equipaments_array;
    };

    confirmationProcess(addClient);
}

// event listerner

addClientBtn.addEventListener("click", (event)=>{
    addClientProcess();
});

//testing

let clientNameTest = "AGROPECUÁRIA ANTAS LTDA (presidencia@hospitalsaodomingos.com.br)";

function consultClient(){
    let clientConsult = null;

    console.log(clients_equipaments_array);

    clients_equipaments_array.forEach(client => {
        if (clientNameTest == client.name){
            clientConsult = {
                name : client.name,
                equipaments : client.equipaments,
            }
        }
    })

    console.log(clientConsult);
}
