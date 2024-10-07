// get clients data from github

let clients_equipaments_array = [];

async function getClientsData(){
    try{
        const response = await fetch("https://nicholas1front.github.io/emeg_system/apps/customer_base_plataform/client_control_backend/data/clients_equipaments.json");
        if(!response.ok){
            throw new Error(`HTTP Error ! Status : ${response.status}`);
        }

        let clientsArray_response = await response.json();

        let clientsArray_return = [];

        let clientObject_toPush = null;

        clientsArray_response.forEach((client)=>{
            clientObject_toPush = {
                name : client.name.toUpperCase(),
                equipaments : null, 
            };

            let clientEquipamentsArray = [];

            for(let i= 0 ; i < client.equipaments.length ; i++){
                clientEquipamentsArray.push(client.equipaments[i].toUpperCase());
            }

            clientObject_toPush.equipaments = clientEquipamentsArray;

            clientsArray_return.push(clientObject_toPush);
        });

        clientsArray_return.sort((a,b)=>{
            if(a.name < b.name){
                return -1;
            }
    
            if(a.name > b.name){
                return 1; 
            }
    
            return 0;
        });

        console.log(clientsArray_return);

        return clientsArray_return;
    }
    catch(error){
        console.error(`Failed to load json : ${error}`);
    }
}

//booting
async function Initialize_clients_equipaments_array(){
    clients_equipaments_array = await getClientsData();
    return clients_equipaments_array;
}

Initialize_clients_equipaments_array();

//update json 

//elements

//functions
async function verifyDataBeforeSend(){
    let arrayFetched = await getClientsData();

    let arrayFetched_clientsList = [];
    let clients_equipaments_array_clientsList = [];

    for(let i = 0 ; i < arrayFetched.length ; i++){
        arrayFetched_clientsList.push(arrayFetched[i].name);
    }

    for(let i = 0 ; i < clients_equipaments_array.length ; i++){
        clients_equipaments_array_clientsList.push(clients_equipaments_array[i].name);
    }

    if(clients_equipaments_array_clientsList > arrayFetched_clientsList ||clients_equipaments_array_clientsList < arrayFetched_clientsList ){
        await verifyPasswordProcess(sendToServerProcess);
        return;
    }

    for(let i = 0 ; i < clients_equipaments_array_clientsList ; i++){
        if(arrayFetched_clientsList[i] !== clients_equipaments_array_clientsList){
            await verifyPasswordProcess(sendToServerProcess);
            return;
        }
    }

    let arrayFetched_equipamentsList = [];
    let clients_equipaments_array_equipamentsList = [];

    arrayFetched.forEach((client)=>{
        for(let i = 0 ; i < client.equipaments.length; i++){
            arrayFetched_equipamentsList.push(client.equipaments[i]);
        }
    })

    clients_equipaments_array.forEach((client)=>{
        for(let i = 0 ;i < client.equipaments.length; i++){
            clients_equipaments_array_equipamentsList.push(client.equipaments[i]);
        }
    })
    
    if(clients_equipaments_array_equipamentsList > arrayFetched_equipamentsList || clients_equipaments_array_equipamentsList < arrayFetched_equipamentsList){
        await verifyPasswordProcess(sendToServerProcess);
        return
    }

    for(let i = 0 ; i < clients_equipaments_array_equipamentsList ; i++){
        if(clients_equipaments_array_equipamentsList[i] !== arrayFetched_equipamentsList[i]){
            await verifyPasswordProcess(sendToServerProcess);
            return;   
        }
    }

    showServerMessagePopup("errorMsg","Dados já existentes ! Tente novamente !");
}

async function updateClientsData() {
    try {
        const response = await fetch('https://emeg-orc.onrender.com/update-data', { 
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ clients_equipaments_array }),
        });

        if (!response.ok) {
            await showServerMessagePopup("errorMsg", "Erro ao atualizar dados no servidor!");
            throw new Error('Erro ao atualizar os dados no backend');
        }

        const result = await response.text();

        console.log('Dados atualizados com sucesso no backend e GitHub Pages:', result);

        return true;

    } catch (error) {
        console.error('Erro:', error);
        return false;
    }
}

async function sendToServerProcess(){

    await showHtmlElement([overlayForLoading], "flex");

    let result = await updateClientsData();

    if(!result){
        await hideHtmlElement([overlayForLoading]);
        await showServerMessagePopup("errorMsg", "Erro ao enviar dados ! Tente novamente !")
        return;
    }

    await hideHtmlElement([overlayForLoading]);
    await showServerMessagePopup("sucessMsg", "Dados enviados com sucesso !");

    await showMessagePopup("sucessMsg", "Dados atualizados com sucesso !");

    setTimeout(async () => {
        clients_equipaments_array = await getClientsData();
        window.location.reload();
    },1000);
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

async function backHomeProcess(){
    clearAllInputs();

    const All_sections = document.querySelectorAll("section");

    for (let i = 0;i < All_sections.length;i++){
        hideHtmlElement([All_sections[i]]);
    }

    showHtmlElement([mainHubSection],"flex");
}    

// clear inputs and selects

async function clearAllInputs(){
    let All_inputs = document.querySelectorAll("input");
    let All_selects = document.querySelectorAll("select");

    All_inputs.forEach((input)=>{
        input.value = "";
    })

    All_selects.forEach((select)=>{
        select.value = "";
    })
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

let functionToBeExecutedGlobal;
let msgPopupContentGlobal;

function showConfirmationPopup(){
    overlay.style.display = "flex";
    customerBasePlataformContainer.style.filter = "blur(9px)";
    wrongPasswordSpan.style.display = "none";
}

function closeConfirmationPopup(){
    overlay.style.display="none";
    customerBasePlataformContainer.style.filter = "blur(0)"
}

async function clickHandleListener(){
    if(confirmationPasswordInput.value === confirmationPassword){
        await callFunction(functionToBeExecutedGlobal, msgPopupContentGlobal);

        await backHomeProcess();

        await clearAllInputs();
    }else{
        wrongPasswordSpan.style.display = "block";
        
        setTimeout(()=>{
            wrongPasswordSpan.style.display = "none";
        },10000);

        confirmationPasswordInput.addEventListener("focus",()=>{
            wrongPasswordSpan.style.display = "none";
        })

        return;
    };
}

async function keyPressHandleListener(event){
    if(event.key === "Enter"){
        if(confirmationPasswordInput.value === confirmationPassword){            
            await callFunction(functionToBeExecutedGlobal, msgPopupContentGlobal);

            await backHomeProcess();

            await clearAllInputs();
        }else{
            wrongPasswordSpan.style.display = "block";
            
            setTimeout(()=>{
                wrongPasswordSpan.style.display = "none";
            },10000);

            confirmationPasswordInput.addEventListener("focus",()=>{
                wrongPasswordSpan.style.display = "none";
            })

            return;
        };  
    }
}

async function verifyPasswordProcess(functionToBeExecuted, msgPopupContent){

    functionToBeExecutedGlobal = functionToBeExecuted;
    msgPopupContentGlobal = msgPopupContent;

    showConfirmationPopup();

    confirmationPopupBtn.removeEventListener("click", clickHandleListener);
    confirmationPasswordInput.removeEventListener("keypress",keyPressHandleListener);

    confirmationPopupBtn.addEventListener("click", clickHandleListener);
    confirmationPasswordInput.addEventListener("keypress",keyPressHandleListener);
};

async function callFunction(functionToBeExecuted, msgPopupContent){
    
    closeConfirmationPopup();

    await functionToBeExecuted();

    clients_equipaments_array.sort((a,b)=>{
        if(a.name < b.name){
            return -1;
        }
    
        if(a.name > b.name){
            return 1; 
        }
    
        return 0;
    });

    if(msgPopupContent !== undefined){
        showMessagePopup("sucessMsg", msgPopupContent);
    }
}

closeConfirmationPopupBtn.addEventListener("click", ()=>{
    closeConfirmationPopup();
})

// server message popup

// elements
const serverMessagePopup = document.querySelector(".server-message-popup");
const closeServerMessagePopupBtn = document.querySelector(".close-server-message-popup-btn")
const serverMessageSymbol = document.querySelector(".server-message-control i");
const serverMessageSpan = document.querySelector(".server-message-span");

// functions

async function showServerMessagePopup(messageType, messageSpan){
    serverMessageSymbol.className = "";

    if(messageType === "errorMsg"){
        serverMessagePopup.style.backgroundColor = "#d61e1e"; //red color
        serverMessagePopup.style.color = "#fff";
        serverMessageSymbol.className = `fa-solid fa-triangle-exclamation`;
    }

    if(messageType === "sucessMsg"){
        serverMessagePopup.style.backgroundColor = "#42f55a"; //green color
        serverMessagePopup.style.color = "#fff"
        serverMessageSymbol.className = `fa-solid fa-circle-check`;
    }

    serverMessageSpan.innerText = messageSpan ;

    await showHtmlElement([serverMessagePopup], "block");

    setTimeout(()=>{
        hideHtmlElement([serverMessagePopup]);
    },5000);
}

//event listeners

closeServerMessagePopupBtn.addEventListener("click",()=>{
    hideHtmlElement([serverMessagePopup]);
})

//message popup

//elements
const messagePopup = document.querySelector(".message-popup");
const closeMessagePopupBtn= document.querySelector(".close-message-popup-btn");
const messagePopupSymbol = document.querySelector(".message-popup-control i");
const messagePopupSpan = document.querySelector(".message-popup-span");

//functions

async function showMessagePopup(messageType, messageSpan){
    messagePopupSymbol.className = "";

    if(messageType === "errorMsg"){
        messagePopup.style.backgroundColor = "#d61e1e";
        messagePopup.style.color = "#fff";
        messagePopupSymbol.className = `fa-solid fa-triangle-exclamation` ;
    }

    if(messageType === "sucessMsg"){
        messagePopup.style.backgroundColor = "#42f55a"; //green color
        messagePopup.style.color = "#fff"
        messagePopupSymbol.className = `fa-solid fa-circle-check`;
    }

    messagePopupSpan.innerText = messageSpan;

    await showHtmlElement([messagePopup],"block");

    setTimeout(()=>{
        hideHtmlElement([messagePopup]);
    },5000)

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
const consultClientLink = document.querySelector("#consult-client-link");
const sendToServerBtn = document.querySelector("#send-to-server-btn");

//event listerners

sendToServerBtn.addEventListener("click", async ()=>{
    await verifyDataBeforeSend();
})

//add-client-section

//elements
const addClientSection = document.querySelector(".add-client-section");
const addClientInput = document.querySelector("#add-client-input");
const addClientBtn = document.querySelector("#add-client-btn");
const backHomeBtn = document.querySelectorAll(".back-home-btn");

//functions

async function addClientLogic(){
    let clientName = addClientInput.value.toUpperCase();
    clientName.trim();

    const newClient = {
        name : clientName,
        equipaments : []
    }

    clients_equipaments_array.push(newClient);

    console.log(newClient);
    console.log(clients_equipaments_array);
};

async function addClientProcess(){

    let clientName = addClientInput.value.toUpperCase();
    clientName.trim();

    if(addClientInput.value === ""){
        showMessagePopup("errorMsg", "O campo 'Cliente' não pode estar vazio !");
        return;
    }

    let clientsList = [];

    clients_equipaments_array.forEach((client)=>{
        clientsList.push(client);
    })

    let includesInArray = clientsList.includes(clientName);

    if(includesInArray){
        showMessagePopup("errorMsg", "Cliente já existente ! Tente novamente !");
        return;
    }else{
        await verifyPasswordProcess(addClientLogic , "Cliente adicionado com sucesso !");
    }
}

// event listerner

addClientLink.addEventListener("click", ()=>{
    backHomeProcess();
    showHtmlElement([addClientSection], "flex");
})

addClientBtn.addEventListener("click",async ()=>{
    addClientProcess();
});

//back home buttons through the document
for(let i = 0; i < backHomeBtn.length ; i++){
    backHomeBtn[i].addEventListener("click", ()=>{
        backHomeProcess();
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

    targetList.innerHTML = "";

    let noValueOption = document.createElement("option");
    noValueOption.value = "";
    targetList.add(noValueOption);

    clientsArray.forEach((client)=>{
        let option = document.createElement("option");

        option.value = client;
        option.textContent = client;

        targetList.add(option);
    })

    console.log(`Lista criada em ${targetList}`);
}

async function addEquipamentLogic(){

    let equipamentName = addEquipamentInput.value.toUpperCase();

    equipamentName.trim();

    clients_equipaments_array.forEach((client)=>{
        if(client.name === addEquipament_clientSelectList.value){
            client.equipaments.push(equipamentName);
        }
    });

    console.log(equipamentName);
    console.log(clients_equipaments_array);

};

async function addEquipamentProcess(){
    if(addEquipamentInput.value === ""){
        showMessagePopup("errorMsg","O campo 'Equipamentos' não pode estar vazio !")
        return;
    }

    let equipamentName = addEquipamentInput.value.toUpperCase();
    equipamentName.trim();

    let equipamentsArray = [];

    clients_equipaments_array.forEach((client)=>{
        if(client.name === addEquipament_clientSelectList.value){
            client.equipaments.forEach((equipament)=>{
                equipamentsArray.push(equipament);
            })
        }
    });

    let includesInArray = equipamentsArray.includes(equipamentName);

    if(includesInArray){
        showMessagePopup("errorMsg","Equipamento já existente ! Tente novamente !");
        return;
    }else{
        await verifyPasswordProcess(addEquipamentLogic,"Equipamento adicionado com sucesso !");
    }
        
}

//event listeners

addEquipamentLink.addEventListener("click", ()=>{
    backHomeProcess();
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

async function editClientLogic(){
    clients_equipaments_array.forEach((client)=>{
        if(client.name === editClient_clientSelectList.value){
            client.name = editClientInput.value.toUpperCase();
        }
    })

    console.log(clients_equipaments_array);
};

async function editClientProcess(){

    let clientName = editClientInput.value.toUpperCase();
    clientName.trim();

    if(editClient_clientSelectList.value === ""){
        showMessagePopup("errorMsg","O campo 'Cliente' não pode estar vazio !");
        return;
    }

    if(clientName === editClient_clientSelectList.value){
        showMessagePopup("errorMsg","Cliente não pode ser igual a anterior !");
        return;
    }

    let clientsList = [];

    clients_equipaments_array.forEach((client)=>{
        clientsList.push(client.name);
    })   
    
    let includesInArray = clientsList.includes(clientName);

    if(includesInArray){
        showMessagePopup("errorMsg","Cliente já existente ! Tente novamente !");
        return;
    }else{
        await verifyPasswordProcess(editClientLogic,"Cliente editado com sucesso !");
    }
        

};

//event listeners
editClientLink.addEventListener("click", ()=>{
    backHomeProcess();
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

const editEquipamentSection = document.querySelector(".edit-equipament-section");
const All_editEquipamentControl = document.querySelectorAll(".edit-equipament-control");
const editEquipament_clientSelectList = document.querySelector("#edit-equipament_client-select-list");
const editEquipament_equipamentSelectList = document.querySelector("#edit-equipament_equipament-select-list");
const editEquipamentInput = document.querySelector("#edit-equipament-input");
const editEquipamentBtn = document.querySelector("#edit-equipament-btn");

// functions

function createSelectListHtml_equipaments(targetList, targetClientList){
    let equipamentsArray = [];

    clients_equipaments_array.forEach((client) => {
        if(client.name === targetClientList.value){
            client.equipaments.forEach((equipament) => {
                equipamentsArray.push(equipament);
            })
        }
    });

    targetList.innerHTML = "";

    let noValueOption = document.createElement("option");
    noValueOption.value = "";
    targetList.add(noValueOption);

    equipamentsArray.forEach((equipament)=>{
        let option = document.createElement("option");

        option.value = equipament;
        option.textContent = equipament;

        targetList.add(option);
    })

    console.log(targetList);
}

async function  editEquipamentLogic(){
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
            clients_equipaments_array.splice(i, 1);
        }
    }

    //delete specific equipament in editClientObject
    for(let i = 0; i < editClientObject.equipaments.length ; i++){
        if(editClientObject.equipaments[i]  === editEquipament_equipamentSelectList.value){
            editClientObject.splice(i,1);
        }
    }

    //push edited equipament in editClientObject
    let editedEquipament = editEquipamentInput.value.trim();

    editClientObject.equipaments.push(editedEquipament.toUpperCase());

    //push editClientObject in clients_equipaments_array and sort
    clients_equipaments_array.push(editClientObject);

    console.log(clients_equipaments_array);
    
};

async function editEquipamentProcess(){

    let equipamentName = editEquipamentInput.value.toUpperCase();
    equipamentName.trim()

    if(editEquipament_equipamentSelectList.value === equipamentName){
        showMessagePopup("errorMsg","Equipamento não pode ser igual ao anterior !");
        return;
    }

    let equipamentsArray = [];

    clients_equipaments_array.forEach((client)=>{
        if(client.name === editEquipament_clientSelectList.value){
            client.equipaments.forEach((equipament)=>{
                equipamentsArray.push(equipament);
            })
        }
    });

    let includesInArray = equipamentsArray.includes(equipamentName);

    if(includesInArray){
        showMessagePopup("errorMsg","Equipamento já existente ! Tente novamente !");
        return;
    }else{
        await verifyPasswordProcess(editEquipamentLogic,"Equipamento editado com sucesso !");
    }

}

// event listerners

editEquipamentLink.addEventListener("click", ()=>{
    backHomeProcess();
    showHtmlElement([editEquipamentSection],"flex");
    createSelectListHtml_clients(editEquipament_clientSelectList);
})

editEquipament_clientSelectList.addEventListener("change", ()=>{
    if(editEquipament_clientSelectList.value === ""){
        hideHtmlElement([All_editEquipamentControl]);
    }else{
        All_editEquipamentControl.forEach((div)=>{
            showHtmlElement([div],"flex");
        })
        createSelectListHtml_equipaments(editEquipament_equipamentSelectList,editEquipament_clientSelectList);
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

// delete-client-section

// elements
const deleteClientSection = document.querySelector(".delete-client-section");
const deleteClient_clientSelectList = document.querySelector("#delete-client_client-select-list");
const deleteClientBtn = document.querySelector("#delete-client-btn");

// functions

async function deleteClientLogic(){
    console.log(clients_equipaments_array);

    for(let i = 0 ; i < clients_equipaments_array.length ; i++){
        if(clients_equipaments_array[i].name === deleteClient_clientSelectList.value){
            clients_equipaments_array.splice(i,1);
        }
    };

    console.log(clients_equipaments_array);

}

async function deleteClientProcess(){
    if(deleteClient_clientSelectList.value === ""){
        showMessagePopup("errorMsg","Um cliente precisa ser selecionado !");
        return;
    }
    
    await verifyPasswordProcess(deleteClientLogic,"Cliente excluído com sucesso !");
}

// event listerners

deleteClientLink.addEventListener("click", ()=>{
    backHomeProcess();
    showHtmlElement([deleteClientSection],"flex");
    createSelectListHtml_clients(deleteClient_clientSelectList);
})

deleteClientBtn.addEventListener("click", ()=>{
    deleteClientProcess();
})

// delete-equipament-section

// elements
const deleteElementSection = document.querySelector(".delete-equipament-section");
const deleteEquipament_clientSelectList = document.querySelector("#delete-equipament_client-select-list");
const deleteEquipamentControl = document.querySelector(".delete-equipament-control");
const deleteEquipament_equipamentSelectList = document.querySelector("#delete-equipament_equipament-select-list");
const deleteEquipamentBtn = document.querySelector("#delete-equipament-btn");

// functions

async function deleteEquipamentLogic(){

    console.log(clients_equipaments_array);

    clients_equipaments_array.forEach((client)=>{
        if(client.name === deleteEquipament_clientSelectList.value){
            for(let i = 0 ; i < client.equipaments.length ; i++){
                if(client.equipaments[i] === deleteEquipament_equipamentSelectList.value){
                    client.equipaments.splice(i, 1);
                }
            }
        }
    })

    console.log(clients_equipaments_array);
}

async function deleteEquipamentProcess(){
    if(deleteEquipament_equipamentSelectList.value === ""){
        showMessagePopup("errorMsg","Selecione o equipamento que deseja excluir !");
        return
    };

    await verifyPasswordProcess(deleteEquipamentLogic,"Equipamento deletado com sucesso !");
}

// event listeners

deleteEquipamentLink.addEventListener("click", ()=>{
    backHomeProcess();
    showHtmlElement([deleteElementSection],"flex");
    createSelectListHtml_clients(deleteEquipament_clientSelectList)
})

deleteEquipament_clientSelectList.addEventListener("change", ()=>{
    if(deleteEquipament_clientSelectList.value !== ""){
        createSelectListHtml_equipaments(deleteEquipament_equipamentSelectList,deleteEquipament_clientSelectList);
        showHtmlElement([deleteEquipamentControl],"flex");
    }else{
        hideHtmlElement([deleteEquipamentControl]);
        return;
    }
});

deleteEquipamentBtn.addEventListener("click", ()=>{
    deleteEquipamentProcess();
})

// consult-client-section

// elements 
const consultClientSection = document.querySelector(".consult-client-section");
const consultClient_clientSelecList = document.querySelector("#consult-client_client-select-list");
const consultClientBtn = document.querySelector("#consult-client-btn");
const resultConsultContainer = document.querySelector(".result-consult-container");
const clientNameTitle_resultConsult = document.querySelector(".client-name-title_result-consult");
const equipamentsItemsControl_resultConsult = document.querySelector(".equipaments-items-control_result-consult");

// functions

async function displayConsultResultHtml(clientObject){
    clientNameTitle_resultConsult.innerHTML = "";

    clientNameTitle_resultConsult.innerHTML = clientObject.name;

    equipamentsItemsControl_resultConsult.innerHTML = "";

    if(clientObject.equipaments.length === 0){
        let span = document.createElement("span");

        span.textContent = "EQUIPAMENTOS AINDA NÃO ADICIONADOS !";

        equipamentsItemsControl_resultConsult.appendChild(span);
    }else{
        for(let i = 0 ; i < clientObject.equipaments.length ; i++){
            let span = document.createElement("span");
    
            span.textContent = clientObject.equipaments[i];
    
            equipamentsItemsControl_resultConsult.appendChild(span);
        }
    }

    let allSpans = document.querySelectorAll(".equipaments-items-control_result-consult span");

    if(allSpans.length === 1){
        allSpans[0].style.width = "99%";
    }else if(allSpans.length === 2){
        for(let i = 0;i < allSpans.length ; i++){
            allSpans[i].style.width = "49%"
        }
    }else if(allSpans.length === 3){
        for(let i = 0;i < allSpans.length ; i++){
            allSpans[i].style.width = "32%"
        }
    }else if(allSpans.length >= 4){
        for(let i = 0;i < allSpans.length ; i++){
            allSpans[i].style.width = "23%"
        }
    };
}

async function consultClientProcess(){
    if(consultClient_clientSelecList.value === ""){
        showMessagePopup("errorMsg", "Selecione um cliente para consulta !");
        return;
    }

    let clientObject = {
        name : null,
        equipaments : null
    }

    clients_equipaments_array.forEach((client)=>{
        if(client.name === consultClient_clientSelecList.value){
            clientObject.name = client.name;
            clientObject.equipaments = client.equipaments;
        }
    });

    showHtmlElement([resultConsultContainer],"flex");

    await displayConsultResultHtml(clientObject);
}

// event listeners

consultClientLink.addEventListener("click", ()=>{
    backHomeProcess();
    createSelectListHtml_clients(consultClient_clientSelecList);
    hideHtmlElement([resultConsultContainer]);
    showHtmlElement([consultClientSection], "flex");
}) 

consultClientBtn.addEventListener("click", ()=>{
    consultClientProcess();
})