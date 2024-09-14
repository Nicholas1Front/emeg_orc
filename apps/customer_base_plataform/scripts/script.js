// get clients data from github

let clients_equipaments_array = [];

async function getClientsData(){
    clients_equipaments_array = [];

    try{
        // const response = await fetch("https://nicholas1front.github.io/emeg_orc/apps/customer_base_plataform/client_control_backend/data/clients_equipaments.json");
        const response = await fetch("../customer_base_plataform/client_control_backend/data/clients_equipaments.json");
        if(!response.ok){
            throw new Error(`HTTP Error ! Status : ${response.status}`);
        }

        let clients_equipaments = await response.json();

        let clientToPush = null;

        clients_equipaments.forEach((client)=>{
            clientToPush = {
                name : client.name.toUpperCase(),
                equipaments : null, 
            };

            let clientEquipamentsArray = [];

            for(let i= 0 ; i < client.equipaments.length ; i++){
                clientEquipamentsArray.push(client.equipaments[i].toUpperCase());
            }

            clientToPush.equipaments = clientEquipamentsArray;

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

//update json 

//elements

//functions

async function updateClientsData() {
    try {
        const response = await fetch('https://emeg-orc.onrender.com/update-data', { // atualize o URL aqui
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ clients_equipaments_array }), // envia os dados atualizados
        });

        if (!response.ok) {
            await showMessagePopup("errorMsg", "Error ao atualizar dados no servidor !");
            throw new Error('Erro ao atualizar os dados no backend');
        }

        console.log('Dados atualizados com sucesso no backend');
    } catch (error) {
        await showMessagePopup("errorMsg", "Erro ! Recarregue a página e tente novamente !");
        console.error('Erro:', error);
    }
}

async function updateClientsDataProcess(){
    showHtmlElement([overlayForLoading],"flex");

    await updateClientsData();

    hideHtmlElement(overlayForLoading);

    await getClientsData();
}


//show and hide elements functions

async function showHtmlElement([...elements], displayType){
    elements.forEach(element => {
        element.style.display = displayType;
    });
}

async function hideHtmlElement([...elements]){
    elements.forEach(element => {
        element.style.display="none";
    })
};

// loading screen

//elements
const overlayForLoading = document.querySelector(".overlay-for-loading");

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

async function showMessagePopup(messageType, messageSpan){
    if(messageType === "errorMsg"){
        messagePopup.style.backgroundColor = "#000";
        messagePopup.style.color = "#fff";
    }

    if(messageType === "sucessMsg"){
        messagePopup.style.backgroundColor = "#42f55a"; //green color
        messagePopup.style.color = "#fff"
    }

    messagePopupSpan.innerText = messageSpan;

    await showHtmlElement([messagePopup],"block");

}

function closeMessagePopup(){
    messagePopupSpan.innerText = "";
    messagePopup.style.display = "none";
}

closeMessagePopupBtn.addEventListener("click", ()=>{
    closeMessagePopup();
})  

// customer-base-plataform-container

// elements
const customerBasePlataformContainer  = document.querySelector(".customer-base-plataform-container");

//main-hub-section

//elements
const mainHubSection = document.querySelector(".main-hub-section");
const addClientLink = document.querySelector("#add-client-link");
const addEquipamentLink = document.querySelector("#add-equipament-link");
const editClientLink = document.querySelector("#edit-client-link");
const editEquipamentLink = document.querySelector("#edit-equipament-link");
const deleteClientLink = document.querySelector("#delete-client-link");
const deleteEquipamentLink = document.querySelector("#delete-equipament-link");
const consultInfosLink = document.querySelector("#consult-infos-link");

//add-client-section

//elements
const addClientSection = document.querySelector(".add-client-section");
const addClientInput = document.querySelector("#add-client-input");
const addClientBtn = document.querySelector("#add-client-btn");
const backHomeBtn = document.querySelectorAll(".back-home-btn");

//functions

async function addClientProcess(){

    clients_equipaments_array.forEach((client)=>{
        if(addClientInput.value === client.name){
            showMessagePopup("errorMsg","Cliente já existente !");
            return;
        }
    });

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

    addClient();

    //confirmationProcess(addClient);
}

// event listerner

addClientLink.addEventListener("click", ()=>{
    showHtmlElement([addClientSection], "flex");

})

addClientBtn.addEventListener("click", async function(){
    await addClientProcess();
    await updateClientsDataProcess();
    await showMessagePopup("sucessMsg","Cliente adicionado com sucesso !");
});



for(let i = 0; i < backHomeBtn.length ; i++){
    backHomeBtn[i].addEventListener("click", ()=>{
        showHtmlElement([mainHubSection],"flex");
        hideHtmlElement([addClientSection,addEquipamentSection]);
    })
}

//add-equipament-section

//elements
const addEquipamentSection = document.querySelector(".add-equipament-section")
const addEquipament_clientSelectList = document.querySelector("#add-equipament_client-select-list")
const addEquipamentInput = document.querySelector("#add-equipament-input");
const addEquipamentBtn = document.querySelector("#add-equipament-btn");
const addEquipamentControl = document.querySelector(".add-equipament-control");

//functions

function createSelectList_addEquipamentSection(){
    let clientsArray = [];
    clients_equipaments_array.forEach((client)=>{
        clientsArray.push(client.name);  
    })

    clientsArray.forEach((client)=>{
        let option = document.createElement("option");

        option.value = client;
        option.textContent = client;

        addEquipament_clientSelectList.add(option);
    })

    console.log("Lista de clientes criada")
}

addEquipament_clientSelectList.addEventListener("change",()=>{
    if(clients_equipaments_array !== ""){
        showHtmlElement([addEquipamentControl],"block")
    }else{
        hideHtmlElement([addEquipamentControl]);
    }
})

function addEquipamentProcess(){
    if(addEquipamentInput.value === ""){
        showMessagePopup("errorMsg","O campo 'Equipamentos' não pode estar vazio !")
        return;
    }

    clients_equipaments_array.forEach((client)=>{
        for(let i = 0 ; i < client.equipaments.length ; i++){
            if(client.equipaments[i] === addEquipamentInput.value){
                showMessagePopup("errorMsg","Este equipamento já existe !");
                return
            }
        }
    });

    function addEquipament(){
        clients_equipaments_array.forEach((client)=>{
            if(client.name === addEquipament_clientSelectList.value){
                client.equipaments.push(addEquipamentInput.value.toUpperCase());
            }
        })
        showMessagePopup("sucessMsg","Equipamento adicionado com sucesso !")
        return clients_equipaments_array;
    };

    confirmationProcess(addEquipament)
}

//event listeners

addEquipamentLink.addEventListener("click", ()=>{
    showHtmlElement([addEquipamentSection],"flex");
    createSelectList_addEquipamentSection();
})

addEquipamentBtn.addEventListener("click",()=>{
    addEquipamentProcess();
})


//to do consult logic

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

//to do edit equipament logic

/*  
edit_clientselect => onchange {
    clients_equipaments_array.forEach((client)=>{
        if (edit_clientselect.value === client.name){
            if(client.equipaments === null array){
                showMessagePopup(errormsg , Cliente não possui equipamentos para editar);
                return;
            }else{
                show the other select list of equipaments
            }
        }
    })
}

depois fazer a logica onde teremos um select do equipamento que o user que alterar e um input para 
alteração do equipamento , logo após um btn para realizar tal função.

Função está que também terá uma validação se o equipamento inputado já existe. Depois da validação pretendo 
tirar remover do array o equipamento original que estará no select e dar um push no equipamento que está no input
*/