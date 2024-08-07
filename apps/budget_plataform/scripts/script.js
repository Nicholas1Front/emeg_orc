// clients_equipaments.json
async function getClientsData(){
    try{
        const response = await fetch("../data/clients_equipaments.json");

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


//budget-production

// header

//elements
const MsgControl = document.querySelector(".msg-control");
const closeMsgBtn = document.querySelector("#close-msg-btn");
const MsgSpan = document.querySelector(".-msg-span");

const clientsSelectList = document.querySelector("#clients-select-list");
const equipamentsSelectList = document.querySelector("#equipaments-select-list");
const notIdentifiedInput = document.querySelector("#not-identified-input");
const dateInput = document.querySelector("#date-input");
const completionDeadlineInput = document.querySelector("#completion-deadline-input");
const paymentTermsInput = document.querySelector("#payment-terms-input");
const guaranteeInput = document.querySelector("#guarantee-input");
const infosNextStepBtn = document.querySelector("#infos-next-step-btn");

const partsSection = document.querySelector(".parts-section");
const servicesSection = document.querySelector(".services-section");
const observationsSection = document.querySelector(".observations-section");
const generateBudgetSection = document.querySelector(".generate-budget-section");

// todo : fazer function para pegar a data no formato BR , adendo : função com parametros para que seja reutilizada várias vezes

/*dateInput.addEventListener("change", ()=>{
    let date = dateInput.value;

    let dateArray = date.split("-");

    let newDate = `${dateArray[2]}/${dateArray[1]}/${dateArray[0]}`;

    console.log(newDate);
}) */

//functions

function createClientsList(){
    getClientsData().then(clients =>{

        let clientsData = [];

        clients.forEach(client =>{
            clientsData.push(client.name.toUpperCase());
        });

        clientsData.forEach(clients => {
            let option = document.createElement("option");

            option.text = clients;

            clientsSelectList.add(option);
        })

        return clientsData;

    }).catch(error =>{
        console.error(`An error occured : ${error}`);
    })
}

function createEquipamentsList(){
    getClientsData().then(clients =>{

        let equipamentsData = [];

        clients.forEach(client =>{
            if(clientsSelectList.value === "(NÃO IDENTIFICADO)"){
                equipamentsSelectList.style.display = "none";
                notIdentifiedInput.style.display = "block";

                return notIdentifiedInput.value;
            }
            else if(clientsSelectList.value === client.name.toUpperCase()){
                equipamentsData = equipamentsData.concat(client.equipaments);

                equipamentsSelectList.style.display = "block";
                notIdentifiedInput.style.display = "none";

                equipamentsSelectList.innerHTML = "";

                equipamentsData.forEach(equipament =>{
                    let option = document.createElement("option");

                    option.text = equipament;

                    equipamentsSelectList.add(option);

                })

                return equipamentsSelectList.value;
            }
        })
    }).catch(error =>{
        console.error("An error occurred !" + error);
    })
}

function validateSelects(){
    if(clientsSelectList.value === ""){
        showPopupMsg("Selecione um cliente !", "errorMsg");
        return;
    }else if(equipamentsSelectList.value === ""){
        showPopupMsg("Selecione um equipamento !", "errorMsg");
        return;
    }else if(clientsSelectList.value === "(NÃO IDENTIFICADO)" && notIdentifiedInput.value === ""){
        showPopupMsg("Digite o modelo do equipamento !", "errorMsg");
        return;
    }else{
        if(dateInput.value === "" || completionDeadlineInput.value === "" || paymentTermsInput.value === "" || guaranteeInput.value === ""){
            showPopupMsg("Alguns campos estão vazios !", "adviceMsg");
        }
        showOtherSections();
    }
}

function showPopupMsg(message , messageType){
    MsgSpan.innerHTML = "";
    MsgSpan.innerText = message;

    if(messageType === "errorMsg"){
        MsgControl.style.backgroundColor = "#000";
        MsgSpan.style.color = "white"; //black color
    }else if (messageType === "adviceMsg"){
        MsgControl.style.backgroundColor = "#d6ca1e";  //yellow color
        MsgControl.style.color = "black";
    }

    MsgControl.style.display = "block";
    MsgControl.style.transition = "0.5s";
    MsgControl.style.marginTop = "40%";
}

function closePopupErrorMsg(){
    MsgControl.style.margintTop = "43%";
    MsgControl.style.transition = "0.5s";
    MsgControl.style.display = "none";
}

function showOtherSections(){
    partsSection.style.display = "block";
    servicesSection.style.display = "block";
    observationsSection.style.display = "block";
    generateBudgetSection.style.display = "block";
}

//testing

createClientsList();

//event listeners

clientsSelectList.addEventListener("change", ()=>{
    createEquipamentsList();
})

infosNextStepBtn.addEventListener("click", ()=>{
    validateSelects();
});

closeMsgBtn.addEventListener("click", ()=>{
    closePopupErrorMsg();
})



//parts section

//elements

const partsAddedItemsControl = document.querySelector(".parts-added-items-control");
const partQuantInput = document.querySelector("#part-quant-input");
const partDescriptionInput = document.querySelector("#part-description-input");
const partUnitValueInput = document.querySelector("#part-unit-value-input");
const partAddItemBtn = document.querySelector("#part-add-item-btn");

const partsItemTotalSpan = document.querySelector(".parts-item-total-span")

//init
showOtherSections();

//testing

const totalValueSpan = document.querySelectorAll(".total-value-span");

let totalNumber = parseInt(totalValueSpan);

console.log(totalNumber);

//functions

function createPartItem(quant, description, unitvalue){
    const itemString =
    `
    <div class="parts-item">

                                <div class="parts-item-content">
                                    <span class="quant-span">${quant}</span>

                                    <span class="description-span">${description.toUpperCase()}</span>

                                    <span class="unit-value-span">R$ ${unitvalue}</span>

                                    <span class="total-value-span">R$ ${quant * unitvalue}</span>

                                    <div class="edit-btn-control">
                                        <button class="edit-btn-of-parts">
                                            <i class="fa-solid fa-pen"></i>
                                        </button>
                                    </div>

                                    <div class="delete-btn-control">
                                        <button class="delete-btn-of-parts">
                                            <i class="fa-solid fa-trash"></i>
                                        </button>
                                    </div>
                                </div>

    </div>
    `;

    const parser = new DOMParser();

    const doc = parser.parseFromString(itemString, 'text/html');

    const itemHtml  = doc.body.firstChild;

    partsAddedItemsControl.appendChild(itemHtml);
};

function updatePartsTotal(){
    const totalValueSpan = document.querySelectorAll(".total-value-span");
}

function addPartItemProcess(){
    //input validation
    if (partQuantInput.value ===""){
        showPopupMsg("Insira a quantidade de peças !", "errorMsg");
        return;
    }else if(partDescriptionInput.value ===""){
        showPopupMsg("Insira a descrição da peça !", "errorMsg");
        return;
    }else if(partUnitValueInput.value ===""){
        showPopupMsg("Insira um valor unitário !" , "errorMsg");
        return;
    }else{
        createPartItem(partQuantInput.value, partDescriptionInput.value, partUnitValueInput.value)
    }
}

// event listerers

partAddItemBtn.addEventListener("click", ()=>{
    addPartItemProcess();
});