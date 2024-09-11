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
const GITHUB_TOKEN = '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'; // Substitua pelo seu token de acesso pessoal
const REPO_OWNER = 'Nicholas1Front'; // Dono do repositório
const REPO_NAME = 'test_repo'; // Nome do repositório
const FILE_PATH = 'clients_equipaments.json'; // Caminho do arquivo JSON no repositório
const BRANCH = 'main';

//functions

async function getFileSha() {
    const url = `https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/contents/${FILE_PATH}?ref=${BRANCH}`;
    const response = await fetch(url, {
        headers: {
            Authorization: `token ${GITHUB_TOKEN}`,
            Accept: 'application/vnd.github.v3+json',
        },
    });
    
    if (!response.ok) {
        throw new Error(`Erro ao buscar SHA: ${response.statusText}`);
    }

    const data = await response.json();
    return data.sha;
}

async function updateClientsDataOnGitHub(updatedData) {
    try {
        const fileSha = await getFileSha();

        const url = `https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/contents/${FILE_PATH}`;
        const content = btoa(JSON.stringify(updatedData, null, 2)); // Codifica o JSON atualizado em base64
        
        const response = await fetch(url, {
            method: 'PUT',
            headers: {
                Authorization: `token ${GITHUB_TOKEN}`,
                Accept: 'application/vnd.github.v3+json',
            },
            body: JSON.stringify({
                message: 'Atualização dos dados dos clientes e equipamentos',
                content: content,
                sha: fileSha,
                branch: BRANCH,
            }),
        });

        if (!response.ok) {
            throw new Error(`Erro ao atualizar o arquivo: ${response.statusText}`);
        }

        console.log('Arquivo atualizado com sucesso no GitHub!');
    } catch (error) {
        console.error(`Falha ao atualizar dados no GitHub: ${error}`);
    }
}

async function updateDataOnChange() {
    await updateClientsDataOnGitHub(clients_equipaments_array);
}

//show and hide elements functions

function showHtmlElement([...elements], displayType){
    elements.forEach(element => {
        element.style.display = displayType;
    });
}

function hideHtmlElement(...elements){
    elements.forEach(element => {
        element.style.display="none";
    })
};

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

    setTimeout(closeMessagePopup(),4000);
}

function closeMessagePopup(){
    messagePopupSpan.innerText = "";
    messagePopup.style.display = "none";
}

function backHomeProcess([...elementsToHide],[...elementsToShow]){
    hideHtmlElement([elementsToHide]);
    showHtmlElement([elementsToShow]);
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
const addClientInput = document.querySelector("#add-client-input");
const addClientBtn = document.querySelector("#add-client-btn");

//functions

async function addClientProcess(){
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

addClientBtn.addEventListener("click", async function(){
    await addClientProcess();
    await updateDataOnChange();
    showMessagePopup("sucessMsg","Cliente adicionado com sucesso!")
});

//add-equipament-section

//elements
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

setTimeout(createSelectList_addEquipamentSection,100);

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
