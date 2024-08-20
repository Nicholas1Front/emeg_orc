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
const msgControl = document.querySelector(".msg-control");
const closeMsgBtn = document.querySelector("#close-msg-btn");
const msgSpan = document.querySelector(".msg-span");

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
            } else if(clientsSelectList.value === client.name.toUpperCase()){
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
};

function reorganizeDateFormat(){
    let date = dateInput.value;

    let dateArray = date.split("-");

    let newDate = `${dateArray[2]}/${dateArray[1]}/${dateArray[0]}`;

    return newDate;    
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

function showPopupMsg(message , messageType ){
    msgSpan.innerHTML = "";
    msgSpan.innerText = message;

    if(messageType === "errorMsg"){
        msgControl.style.backgroundColor = "#000";//black color
        msgSpan.style.color = "white"; 
        closeMsgBtn.style.color = "white";
    }else if (messageType === "adviceMsg"){
        msgControl.style.backgroundColor = "#fcba03";  //yellow color
        msgControl.style.color = "black";
        closeMsgBtn.style.color = "black";
    }else if(messageType === "successMsg"){
        msgControl.style.backgroundColor = "#42f55a" //green color
        msgControl.style.color = "white";
        closeMsgBtn.style.color = "white";
    }

    msgControl.style.display = "block";
    msgControl.style.transition = "0.5s";
    msgControl.style.marginTop = "37%";
}

function closePopupErrorMsg(){
    msgControl.style.margintTop = "43%";
    msgControl.style.transition = "0.5s";
    msgControl.style.display = "none";
}

function showOtherSections(){
    partsSection.style.display = "block";
    servicesSection.style.display = "block";
    observationsSection.style.display = "block";
    generateBudgetSection.style.display = "block";
}

//booting

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

//init
showOtherSections();

//functions

function validateOnlyNumbers(param){
    return param.replace(/[^0-9,]/g,"")
}

function clearPartsInputs(){
    partQuantInput.value = "";
    partDescriptionInput.value = "";
    partUnitValueInput.value = "";
}

function updateTotalSpan(spanGroupHtml, spanResultHtml){
    const allSpansHtml = document.querySelectorAll(`.${spanGroupHtml}`);

    let totalValue = null;

    for(let i = 0 ; i < allSpansHtml.length ; i++){
        let string = allSpansHtml[i].innerText.slice(2);
        string = string.replace(",", ".");

        let number = parseFloat(string);

        totalValue += number;
    }

    const resultSpan = document.querySelector(`.${spanResultHtml}`);

    resultSpan.innerHTML = "";

    if(totalValue === null || totalValue === NaN){
        return;
    }

    resultSpan.innerText = `R$ ${totalValue.replace(".",",")}`;

}

function updateTotalSpans_BudgetProdSection(){
    const partsItemTotalSpan = document.querySelector(".parts-item-total-span");
    const servicesItemTotalSpan = document.querySelector(".services-item-total-span");
    let partsItemsValue = 0;
    let servicesItemsValue = 0;
    let totalBudgetValue = 0;

    const totalPartsDisplaySpan = document.querySelector(".total-of-parts-display-span");
    const totalServicesDisplaySpan = document.querySelector(".total-of-services-display-span");
    const totalBudgetDisplaySpan = document.querySelector(".total-of-budget-display-span");

    //clear inputs
    totalPartsDisplaySpan.innerHTML = "";
    totalServicesDisplaySpan.innerHTML = "";
    totalBudgetDisplaySpan.innerHTML = "";

    if(partsItemTotalSpan.innerText !== "" && servicesItemTotalSpan.innerText !== ""){
        servicesItemsValue = servicesItemTotalSpan.innerText.slice(2);
        servicesItemsValue = parseFloat(servicesItemsValue.replace(",", "."));
        partsItemsValue = partsItemTotalSpan.innerText.slice(2);
        partsItemsValue = parseFloat(partsItemsValue.replace(",", "."));
        
        totalBudgetValue = partsItemsValue + servicesItemsValue;

        totalPartsDisplaySpan.innerText = `R$ ${partsItemsValue.replace(".", ",")}`;
        totalServicesDisplaySpan.innerText = `R$ ${servicesItemsValue.replace(".", ",")}`;
        totalBudgetDisplaySpan.innerText = `R$ ${totalBudgetValue.replace(".", ",")}`;

        return;

    }else if(partsItemTotalSpan.innerText === "" && servicesItemTotalSpan.innerText !== ""){
        servicesItemsValue = servicesItemTotalSpan.innerText.slice(2);
        servicesItemsValue = parseFloat(servicesItemsValue.replace(",", "."));
        partsItemsValue = 0;

        totalBudgetValue = partsItemsValue + servicesItemsValue;

        totalPartsDisplaySpan.innerText = `R$ ${partsItemsValue.replace(".", ",")}`;
        totalServicesDisplaySpan.innerText = `R$ ${servicesItemsValue.replace(".", ",")}`;
        totalBudgetDisplaySpan.innerText = `R$ ${totalBudgetValue.replace(".", ",")}`;

        return;
    }else if(servicesItemTotalSpan.innerText === "" && partsItemTotalSpan.innerText !== ""){
        servicesItemsValue = 0;
        partsItemsValue = partsItemTotalSpan.innerText.slice(2);
        partsItemsValue = parseFloat(partsItemsValue.replace(",", "."));

        totalBudgetValue = partsItemsValue + servicesItemsValue;

        totalPartsDisplaySpan.innerText = `R$ ${partsItemsValue.replace(".", ",")}`;
        totalServicesDisplaySpan.innerText = `R$ ${servicesItemsValue.replace(".", ",")}`;
        totalBudgetDisplaySpan.innerText = `R$ ${totalBudgetValue.replace(".", ",")}`;

        return;
    }

}

function createPartItem(quant, description, unitvalue){

    quant = parseInt(quant);

    let totalValue =  quant * unitvalue.replace(",", ".");

    const itemString =
    `
    <div class="parts-item">

                                <div class="parts-item-content">
                                    <span class="parts-quant-span">${quant}</span>

                                    <span class="parts-description-span">${description.toUpperCase()}</span>

                                    <span class="parts-unit-value-span">R$ ${unitvalue.replace(".",",")}</span>

                                    <span class="parts-total-value-span">R$ ${totalValue.replace(".",",")}</span>

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


function addPartItemProcess(){
    //input validation
    if(partQuantInput.value === "" && partDescriptionInput.value === "" && partUnitValueInput.value === ""){
        showPopupMsg("Insira as informações das peças aplicadas antes de prosseguir !" , "errorMsg")
    }
    else if(partQuantInput.value ===""){
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
        updateTotalSpan("parts-total-value-span", "parts-item-total-span");
        clearPartsInputs();

        /*get itens all time this function is called*/

        let partsItem = document.querySelectorAll(".parts-item");
        let editBtnOfParts = document.querySelectorAll(".edit-btn-of-parts");
        let deleteBtnOfParts = document.querySelectorAll('.delete-btn-of-parts');
    
        //event listeners to delete itens
        for(let i = 0 ; i < partsItem.length ; i++){
            deleteBtnOfParts[i].addEventListener("click", ()=>{
                partsItem[i].remove();
                updateTotalSpan("parts-total-value-span", "parts-item-total-span");
                updateTotalSpans_BudgetProdSection();
            })   
        };

        //event listeners to edit itens

        for(let i = 0 ; i < partsItem.length ; i++){
           editBtnOfParts[i].addEventListener("click", ()=>{
                let partsQuantSpan = document.querySelectorAll(".parts-quant-span");
                let partsDescriptionSpan = document.querySelectorAll(".parts-description-span");
                let partsUnitValueSpan = document.querySelectorAll(".parts-unit-value-span");

                partQuantInput.value = partsQuantSpan[i].innerText;
                partDescriptionInput.value = partsDescriptionSpan[i].innerText;
                
                let unitValueUpdated = partsUnitValueSpan[i].innerText.slice(2); // took off the R$

                partUnitValueInput.value = unitValueUpdated;

                partsItem[i].remove();

                updateTotalSpan("parts-total-value-span", "parts-item-total-span");
                updateTotalSpans_BudgetProdSection();
           })   
        };


    }
}

// event listerers

partAddItemBtn.addEventListener("click", ()=>{
    addPartItemProcess();
    updateTotalSpans_BudgetProdSection();
});

partUnitValueInput.addEventListener('input', (event)=>{
    const updateValue = validateOnlyNumbers(event.target.value);

    event.target.value = updateValue;
})

//services section 

//elements

const servicesAddedItemsControl = document.querySelector(".services-added-items-control");
const serviceQuantInput = document.querySelector("#service-quant-input");
const serviceDescriptionInput = document.querySelector("#service-description-input");
const serviceUnitValueInput = document.querySelector("#service-unit-value-input");
const serviceAddItemBtn = document.querySelector("#service-add-item-btn");

function createServiceItem(quant , description , unitValue){
    const itemString = `
    <div class="services-item">

                                <div class="services-item-content">
                                    <span class="service-quant-span">${quant}</span>

                                    <span class="service-description-span">${description.toUpperCase()}</span>

                                    <span class="service-unit-value-span">R$ ${unitValue}</span>

                                    <span class="service-total-value-span">R$ ${quant * unitValue}</span>

                                    <div class="edit-btn-control">
                                        <button class="edit-btn-of-services">
                                            <i class="fa-solid fa-pen"></i>
                                        </button>
                                    </div>

                                    <div class="delete-btn-control">
                                        <button class="delete-btn-of-services">
                                            <i class="fa-solid fa-trash"></i>
                                        </button>
                                    </div>
                                </div>
                                
                            </div>
    `;

    const parser = new DOMParser();

    const doc = parser.parseFromString(itemString, 'text/html');

    const itemHtml  = doc.body.firstChild;

    servicesAddedItemsControl.appendChild(itemHtml);
}

function addServiceItemProcess(){
    //validation inputs

    if(serviceQuantInput.value === "" && serviceDescriptionInput.value === "" && serviceUnitValueInput.value === ""){
        showPopupMsg("Insira as informações do serviços executados antes de prosseguir !" , "errorMsg")
        return;
    }else if(serviceQuantInput.value === ""){
        showPopupMsg("Insira a quantidade de serviços executados !", "errorMsg");
        return;
    }else if(serviceDescriptionInput.value === ""){
        showPopupMsg("Insira a descrição dos serviços executados !", "errorMsg");
        return;
    }else if(serviceUnitValueInput.value === ""){
        showPopupMsg("Insira o valor unitário do serviço executado !", "errorMsg");
        return
    }else{
        createServiceItem(serviceQuantInput.value, serviceDescriptionInput.value , serviceUnitValueInput.value);
        updateTotalSpan("service-total-value-span", "services-item-total-span");
        clearServicesInputs();

        let servicesItem = document.querySelectorAll(".services-item");
        let editBtnOfServices = document.querySelectorAll(".edit-btn-of-services");
        let deleteBtnOfServices = document.querySelectorAll(".delete-btn-of-services");

        for(let i = 0 ; i < servicesItem.length ; i++){
            deleteBtnOfServices[i].addEventListener('click', ()=>{
                servicesItem[i].remove();
                updateTotalSpan("service-total-value-span", "services-item-total-span");
                updateTotalSpans_BudgetProdSection();
            });
        }

        for(let i = 0 ; i < servicesItem.length ; i++){
            editBtnOfServices[i].addEventListener("click", ()=>{
                let serviceQuantSpan = document.querySelectorAll(".service-quant-span");
                let serviceDescriptionSpan = document.querySelectorAll(".service-description-span");
                let serviceUnitValueSpan = document.querySelectorAll(".service-unit-value-span");

                let unitValue = serviceUnitValueSpan[i].innerText.slice(2);

                serviceQuantInput.value = serviceQuantSpan[i].innerText;
                serviceDescriptionInput.value = serviceDescriptionSpan[i].innerText;
                serviceUnitValueInput.value = unitValue;

                servicesItem[i].remove();

                updateTotalSpan("service-total-value-span", "services-item-total-span");
                updateTotalSpans_BudgetProdSection();
            })
        }
    }
}

function clearServicesInputs(){
    serviceQuantInput.value = "";
    serviceDescriptionInput.value = "";
    serviceUnitValueInput.value = "";
}

// event listeners

serviceAddItemBtn.addEventListener("click", ()=>{
    addServiceItemProcess();
    updateTotalSpans_BudgetProdSection();
})

serviceUnitValueInput.addEventListener('input', (event)=>{
    const updateValue = validateOnlyNumbers(event.target.value);

    event.target.value = updateValue;
})

//observations-section

//elements

const observationsTextarea = document.querySelector("#observations-textarea");

//generate budget and display budget

//elements
const generateBudgetBtn = document.querySelector("#generate-budget-btn");
const budgetProduction = document.querySelector("#budget-production");
const budgetFinished = document.querySelector("#budget-finished");

const clientSpanResult = document.querySelector("#client-span-result");
const equipamentSpanResult = document.querySelector("#equipament-span-result");
const paymentTermsSpanResult = document.querySelector("#payment-terms-span-result");
const completionDeadlineSpanResult = document.querySelector("#completion-deadline-span-result");
const guaranteeSpanResult = document.querySelector("#guarantee-span-result");
const dateSpanResult = document.querySelector("#date-span-result");

const apliedPartsItemsContainer = document.querySelector(".aplied-parts-items-container");

//functions

function createPartItemFinished(numberItem, quant , description , unitValue , totalValue){
    const itemString = 
    `
        <div class="aplied-parts-item">
            <span class ="aplied-part-number-item-span">${numberItem}</span>
            <span class="aplied-part-quant-span">${quant}</span>
            <span class="aplied-part-description-span">${description}</span>
            <span class="aplied-part-unit-value-span">${unitValue}</span>
            <span class="aplied-part-total-value-span">${totalValue}</span>
        </div>
    `;

    const parser = new DOMParser();

    const doc = parser.parseFromString(itemString, 'text/html');

    const itemHtml  = doc.body.firstChild;

    apliedPartsItemsContainer.appendChild(itemHtml);
}

function createNoContentSpan(spanHTML, spanMsg){
    const itemString = 
    `
    <span class="${spanHTML}">${spanMsg}</span>
    `;

    const parser = new DOMParser();

    const doc = parser.parseFromString(itemString, 'text/html');

    const itemHtml  = doc.body.firstChild;

    apliedPartsItemsContainer.appendChild(itemHtml);
}

function addPartItemFinishedProcess(){
    const partsItem = document.querySelectorAll("#parts-item");
    const partsQuantSpan = document.querySelectorAll(".parts-quant-span"); 
    const partsDescriptionSpan = document.querySelectorAll("#parts-description-span");
    const partsUnitValueSpan = document.querySelectorAll("#parts-unit-value-span");
    const partsTotalValueSpan = document.querySelectorAll("#parts-total-value-span"); 

    apliedPartsItemsContainer.innerHTML = "";

    if (partsItem[0] === undefined){
        createNoContentSpan("aplied-parts-no-content-span", "NÃO FORAM APLICADAS PEÇAS !");
        return;
    }

    for(let i = 0 ; i < partsItem.length ; i++){
        let item = i+1;
        createPartItemFinished(
            item,
            partsQuantSpan[i].innerText,
            partsDescriptionSpan[i].innerText,
            partsUnitValueSpan[i].innerText,
            partsTotalValueSpan[i].innerText,
        )
    }
}

function displayBudgetProcess(){
    //display header informations
    /*clientSpanResult.innerHTML = "";
    equipamentSpanResult.innerHTML = "";
    paymentTermsSpanResult.innerHTML = "";
    guaranteeSpanResult.innerHTML = "";
    dateSpanResult.innerHTML = "";
    completionDeadlineSpanResult.innerHTML = "";    

    clientSpanResult.innerText = clientsSelectList.value;

    if(notIdentifiedInput.value === ""){
        equipamentSpanResult.innerText = equipamentsSelectList.value;
    }else{
        equipamentSpanResult.innerText = notIdentifiedInput.value;
    }

    paymentTermsSpanResult.innerText = paymentTermsInput.value;
    completionDeadlineSpanResult.innerText = completionDeadlineInput.value;
    guaranteeSpanResult.innerText = guaranteeInput.value;
    dateSpanResult.innerText = reorganizeDateFormat(); */

    //display parts informations

    addPartItemFinishedProcess();
}

generateBudgetBtn.addEventListener("click", ()=>{
    displayBudgetProcess();
}) 