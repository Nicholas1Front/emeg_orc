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

// customer-base-plataform-container

// elements
const customerBasePlataformContainer  = document.querySelector(".customer-base-plataform-container");

// confirmation popup

// elements
const overlay = document.querySelector(".overlay");
const closeConfirmationPopupBtn = document.querySelector("#close-confirmation-popup-btn");
const confirmationPasswordInput = document.querySelector("#confirmation-password-input");
const confirmationPopupBtn = document.querySelector("#confirmation-popup-btn");
const confirmationPassword = "88320940";

function showConfirmationPopup(){
    overlay.style.display = "flex";
    customerBasePlataformContainer.style.filter = "blur(9px)";
}

function closeConfirmationPopup(){
    overlay.style.display="none";
    customerBasePlataformContainer.style.filter = "blur(0)"
}

function confirmationProcess(...functionToBeExecuted){
    confirmationPopupBtn.addEventListener('click',()=>{
        if(confirmationPasswordInput.value === confirmationPassword){
            functionToBeExecuted.forEach(code =>{
                code();
            })
            
            closeConfirmationPopup();
        }else{
            console.log("Senha incorreta tente novamente");
            closeConfirmationPopup();
        }
    })
}

closeConfirmationPopupBtn.addEventListener("click", ()=>{
    closeConfirmationPopup()
})

//add-client-section

//elements
const addClientInput = document.querySelector("#add-client-input");
const addClientBtn = document.querySelector("#add-client-btn");
//functions

function addClientProcess(){

    showConfirmationPopup();

    function addClient(){
        console.log(clients_equipaments_array);

            const newClient = {
                name : addClientInput.value,
                equipaments : []
            }

            clients_equipaments_array.push(newClient);

            console.log(clients_equipaments_array);
            
            return clients_equipaments_array;
    };

    confirmationProcess(addClient);
}

// event listerner

addClientBtn.addEventListener("click", (event)=>{
    addClientProcess();
});
