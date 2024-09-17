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

        clients_equipaments_array.sort();

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

// clear inputs and selects

function clearAllInputs(){
    let All_inputs = document.querySelectorAll("input");
    let All_selects = document.querySelectorAll("select");

    All_inputs.forEach((input)=>{
        input.value = "";
    })

    All_selects.forEach((select)=>{
        select.value = "";
    })
}


// remove element for array

// functions
function removeElementforArray(array,index){
    array.splice(index,1);
    return array;
}

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

async function confirmationProcess(...functionToBeExecuted){
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
const sendToServerBtn = document.querySelector("#send-to-server-btn");

//event listerners

sendToServerBtn.addEventListener("click", ()=>{
    confirmationProcess(updateClientsDataProcess);
})

//add-client-section

//elements
const addClientSection = document.querySelector(".add-client-section");
const addClientInput = document.querySelector("#add-client-input");
const addClientBtn = document.querySelector("#add-client-btn");
const backHomeBtn = document.querySelectorAll(".back-home-btn");

//functions

async function addClientProcess(){

    if(addClientInput.value === ""){
        showMessagePopup("errorMsg", "O campo 'Cliente' não pode estar vazio !");
        return;
    }

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

    await confirmationProcess(addClient);

    showMessagePopup("sucessMsg","Cliente adicionado com sucesso !");
}

// event listerner

addClientLink.addEventListener("click", ()=>{
    showHtmlElement([addClientSection], "flex");

})

addClientBtn.addEventListener("click",()=>{
    addClientProcess();
});

for(let i = 0; i < backHomeBtn.length ; i++){
    backHomeBtn[i].addEventListener("click", ()=>{
        showHtmlElement([mainHubSection],"flex");
        hideHtmlElement([
            addClientSection,
            addEquipamentSection,
            editClientSection,
            editEquipamentSection,
        ]);
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

function createSelectListHtml_clients(targetList){
    let clientsArray = [];
    clients_equipaments_array.forEach((client)=>{
        clientsArray.push(client.name);  
    })

    clientsArray.forEach((client)=>{
        let option = document.createElement("option");

        option.value = client;
        option.textContent = client;

        targetList.add(option);
    })

    console.log(`Lista criada em ${targetList}`);
}

async function addEquipamentProcess(){
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

    await confirmationProcess(addEquipament);

    showMessagePopup("sucessMsg","Equipamento adicionado com sucesso !")
}

//event listeners

addEquipamentLink.addEventListener("click", ()=>{
    showHtmlElement([addEquipamentSection],"flex");
    createSelectListHtml_clients(addEquipament_clientSelectList);
});

addEquipament_clientSelectList.addEventListener("change",()=>{
    if(addEquipament_clientSelectList.value !== ""){
        showHtmlElement([addEquipamentControl],"block")
    }else{
        hideHtmlElement([addEquipamentControl]);
    }
});

addEquipamentBtn.addEventListener("click", ()=>{
    addEquipamentProcess();
});

//edit-client-section

//elements
const editClientSection = document.querySelector(".edit-client-section");
const editClient_clientSelectList = document.querySelector("#edit-client_client-select-list");
const editClientControl = document.querySelector(".edit-client-control");
const editClientInput = document.querySelector("#edit-client-input");
const editClientBtn = document.querySelector("#edit-client-btn");

//functions

async function editClientProcess(){

    if(editClient_clientSelectList.value === ""){
        showMessagePopup("errorMsg","O campo 'Cliente' não pode estar vazio !");
        return;
    }
    
    clients_equipaments_array.forEach((client)=>{
        if(editClientInput.value == client.name){
            showMessagePopup("errorMsg", "Cliente já existente ! Tente novamente !");
            return;
        }
    })

    async function editClient(){
        clients_equipaments_array.forEach((client)=>{
            if(client.name === editClient_clientSelectList.value){
                client.name = editClientInput.value.toUpperCase();
            }
        })
    
        console.log(clients_equipaments_array);
    
        return clients_equipaments_array;
    }

    await confirmationProcess(editClient);

    showMessagePopup("sucessMsg","Cliente editado com sucesso !");
}

//event listeners
editClientLink.addEventListener("click", ()=>{
    createSelectListHtml_clients(editClient_clientSelectList);
    showHtmlElement([editClientSection],"flex");
})

editClient_clientSelectList.addEventListener("change",()=>{
    if(editClient_clientSelectList.value !== ""){
        showHtmlElement([editClientControl],"block");
        editClientInput.value = editClient_clientSelectList.value;
    }else{
        hideHtmlElement([editClientControl]);
    }
})

editClientBtn.addEventListener("click", ()=>{
    editClientProcess();
})

//edit-equipament-section

//elements

const editEquipamentSection = document.querySelector("#edit-equipament-section");
const All_editEquipamentControl = document.querySelectorAll(".edit-equipament-control");
const editEquipament_clientSelectList = document.querySelector("#edit-equipament_client-select-list");
const editEquipament_equipamentSelectList = document.querySelector("#edit-equipament_equipament-select-list");
const editEquipamentInput = document.querySelector("#edit-equipament-input");
const editEquipamentBtn = document.querySelector("#edit-equipament-btn");

// functions

function createSelectListHtml_equipaments(targetList){
    let equipamentsArray = [];

    clients_equipaments_array.forEach((client) => {
        if(client.name === editEquipament_clientSelectList.value){
            client.equipaments.forEach((equipament) => {
                equipamentsArray.push(equipament);
            })
        }
    })

    equipamentsArray.forEach((equipament)=>{
        let option = document.createElement("option");

        option.value = equipament;
        option.textContent = equipament;

        targetList.add(option);
    })

    console.log(targetList);
}

async function editEquipamentProcess(){

    if(editEquipament_equipamentSelectList.value === editEquipamentInput.value){
        showMessagePopup("errorMsg","Equipamento não pode ser igual ao anterior !");
        return;
    }

    function  editEquipament(){
        let editClientObject = null;

        clients_equipaments_array.forEach((client)=>{
            if(client.name === editEquipament_clientSelectList.value){
                editClientObject = client;
                return editClientObject
            }
        })
        console.log(clients_equipaments_array);
        console.log(editClientObject)

        //delete element in clients_equipaments_array
        for(let i = 0; i < clients_equipaments_array.length ; i++){
            if(clients_equipaments_array[i].name  === editClientObject.name){
                removeElementforArray(clients_equipaments_array,i);
            }
        }

        //delete specific equipament in editClientObject
        for(let i = 0; i < editClientObject.equipaments.length ; i++){
            if(editClientObject.equipaments[i]  === editEquipament_equipamentSelectList.value){
                removeElementforArray(editClientObject.equipaments,i);
            }
        }

        let editedEquipament = editEquipamentInput.value.trim();

        editClientObject.equipaments.push(editedEquipament.toUpperCase());

        clients_equipaments_array.push(editClientObject);

        clients_equipaments_array.sort((a,b)=>{
            if(a.name < b.name){
                return -1;
            }

            if(a.name > b.name){
                return 1; 
            }

            return 0;
        });

        console.log(clients_equipaments_array);
        
        return clients_equipaments_array;
    }

    await confirmationProcess(editEquipament);

    showMessagePopup("sucessMsg", "Equipamento editado com sucesso !")
}

// event listerners

editEquipamentLink.addEventListener("click", ()=>{
    showHtmlElement([editEquipamentSection],"flex");
    createSelectListHtml_clients(editEquipament_clientSelectList);
})

editEquipament_clientSelectList.addEventListener("change", ()=>{
    if(editEquipament_clientSelectList.value === ""){
        hideHtmlElement([All_editEquipamentControl]);
    }else{
        showHtmlElement([All_editEquipamentControl],"flex");
        createSelectListHtml_equipaments(editEquipament_equipamentSelectList);
    }
});

editEquipament_equipamentSelectList.addEventListener("change", ()=>{
    if(editEquipament_equipamentSelectList.value!==""){
        editEquipamentInput.value = editEquipament_equipamentSelectList.value;
    }else{
        return;
    }
})

editEquipamentBtn.addEventListener("click", ()=>{
    editEquipamentProcess();
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