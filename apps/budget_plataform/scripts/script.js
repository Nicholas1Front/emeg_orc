
// clients_equipaments.json
async function getClientsData(){
    try{
        const response = await fetch("https://nicholas1front.github.io/emeg_orc/apps/data/clients_equipaments.json");

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

function formatToBrl(value){
    return new Intl.NumberFormat("pt-BR", {
        style : "currency",
        currency : "BRL",
    }).format(value);
};

function currencyToFloatNum(value){
    const number = value.replace(/[^\d,-]/g, '').replace('.', '').replace(',', '.');

    return parseFloat(number);
}

//budget-production

//popup

//event listeners

/*window.addEventListener('beforeunload' , (event)=>{
    event.preventDefault();
    event.returnValue = '';
}); */

//header

//elements
const budgetProduction = document.querySelector("#budget-production");
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
const NextStepContainer = document.querySelector(".next-step-container");
const infosNextStepBtn = document.querySelector("#infos-next-step-btn");

//functions

function createClientsList(){
    getClientsData().then(clients =>{

        let clientsData = [];

        clients.forEach(client =>{
            clientsData.push(client.name.toUpperCase());
        });

        clientsData = clientsData.sort();

        clientsData.forEach(clients => {
            let option = document.createElement("option");

            option.text = clients;

            clientsSelectList.add(option);
        });

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

                    option.text = equipament.toUpperCase();

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

function validateSelectsProcess(){
    if(clientsSelectList.value === ""){
        showPopupMsg("Selecione um cliente !", "errorMsg");
        return;
    }else if(equipamentsSelectList.style.display === "block" && equipamentsSelectList.value === ""){
        showPopupMsg("Selecione um equipamento !", "errorMsg");
        return;
    }else if(clientsSelectList.value === "(NÃO IDENTIFICADO)" && notIdentifiedInput.style.display === "block" && notIdentifiedInput.value === ""){
        showPopupMsg("Digite o modelo do equipamento !", "errorMsg");
        return;
    }else{
        if(dateInput.value === "" || completionDeadlineInput.value === "" || paymentTermsInput.value === "" || guaranteeInput.value === ""){
            showPopupMsg("Alguns campos estão vazios !", "adviceMsg");
        };
        showHtmlElement(partsSection,servicesSection,totalBudgetProdSecion,observationsSection,generateBudgetSection);
        hideHtmlElement(NextStepContainer);
    }
}

function showPopupMsg(message , messageType ){
    msgSpan.innerHTML = "";
    msgSpan.innerText = message;

    if(messageType === "errorMsg"){
        msgControl.style.backgroundColor = "#000";//black color
        msgControl.style.color = "white"; 
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

    setTimeout(() => {
        closePopupMsg();
    }, 4000);

}

function closePopupMsg(){
    msgControl.style.margintTop = "43%";
    msgControl.style.transition = "0.5s";
    msgControl.style.display = "none";
}

function showHtmlElement(...elements){
    elements.forEach(element =>{
        element.style.display = "block";
    })
}

function hideHtmlElement(...elements){
    elements.forEach(element =>{
        element.style.display = "none";
    })
}

//booting

createClientsList();

//event listeners

clientsSelectList.addEventListener("change", ()=>{
    createEquipamentsList();
})

infosNextStepBtn.addEventListener("click", ()=>{
    validateSelectsProcess();
});

closeMsgBtn.addEventListener("click", ()=>{
    closePopupMsg();
})

//parts section

//elements
const partsSection = document.querySelector(".parts-section");
const partsAddedItemsControl = document.querySelector(".parts-added-items-control");
const partQuantInput = document.querySelector("#part-quant-input");
const partDescriptionInput = document.querySelector("#part-description-input");
const partUnitValueInput = document.querySelector("#part-unit-value-input");
const partAddItemBtn = document.querySelector("#part-add-item-btn");

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
        let number = currencyToFloatNum(allSpansHtml[i].innerText);

        totalValue += number;
    }

    const resultSpan = document.querySelector(`.${spanResultHtml}`);

    resultSpan.innerHTML = "";

    let totalValueString = formatToBrl(totalValue);

    if (totalValueString === "R$ NaN"){
        totalValueString = "R$ 0,00";
    }

    resultSpan.innerText = totalValueString;

}

let test = 0;

test = formatToBrl(test);

console.log(test);

test = currencyToFloatNum(test);

console.log(test);

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

    if (partsItemTotalSpan.innerText === ""){
        partsItemTotalSpan.innerText = "R$ 0,00";
    }

    if(servicesItemTotalSpan.innerText === ""){
        servicesItemTotalSpan.innerText = "R$ 0,00"
    }

    let partsItemsValueString = currencyToFloatNum(partsItemTotalSpan.innerText)
    let servicesItemsValueString = currencyToFloatNum(servicesItemTotalSpan.innerText);

    partsItemsValue = partsItemsValueString;
    servicesItemsValue = servicesItemsValueString;

    totalBudgetValue = partsItemsValue + servicesItemsValue;
        
    let totalBudgetValueString = formatToBrl(totalBudgetValue);
    partsItemsValueString = formatToBrl(partsItemsValue);
    servicesItemsValueString = formatToBrl(servicesItemsValue);

    totalPartsDisplaySpan.innerHTML = partsItemsValueString;
    totalServicesDisplaySpan.innerHTML = servicesItemsValueString
    totalBudgetDisplaySpan.innerHTML = totalBudgetValueString;

    return;

}

function createPartItem(quantString, descriptionString, unitValueString){

    let quant = parseInt(quantString);

    let unitValue = parseFloat(unitValueString.replace(",", "."));
    unitValueString = formatToBrl(unitValue);

    let totalValue =  quant * unitValue;

    let totalValueString = formatToBrl(totalValue);    

    const itemString =
    `
    <div class="parts-item">

                                <div class="parts-item-content">
                                    <span class="parts-quant-span">${quantString}</span>

                                    <span class="parts-description-span">${descriptionString.toUpperCase()}</span>

                                    <span class="parts-unit-value-span">${unitValueString}</span>

                                    <span class="parts-total-value-span">${totalValueString}</span>

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

const servicesSection = document.querySelector(".services-section");
const servicesAddedItemsControl = document.querySelector(".services-added-items-control");
const serviceQuantInput = document.querySelector("#service-quant-input");
const serviceDescriptionInput = document.querySelector("#service-description-input");
const serviceUnitValueInput = document.querySelector("#service-unit-value-input");
const serviceAddItemBtn = document.querySelector("#service-add-item-btn");

function createServiceItem(quantString , descriptionString , unitValueString){
    let quant = parseInt(quantString);

    let unitValue = parseFloat(unitValueString.replace(",", "."));
    unitValueString = formatToBrl(unitValue);

    let totalValue =  quant * unitValue;

    let totalValueString = formatToBrl(totalValue);

    const itemString = `
    <div class="services-item">

                                <div class="services-item-content">
                                    <span class="service-quant-span">${quant}</span>

                                    <span class="service-description-span">${descriptionString.toUpperCase()}</span>

                                    <span class="service-unit-value-span">${unitValueString}</span>

                                    <span class="service-total-value-span">${totalValueString}</span>

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
        showPopupMsg("Insira as informações do serviços executados antes de prosseguir !" , "errorMsg");
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

//total-budget-prod-section

//elements
const totalBudgetProdSecion = document.querySelector(".total-budget-prod-section");

//observations-section

//elements

const observationsSection = document.querySelector(".observations-section");
const observationsTextarea = document.querySelector("#observations-textarea");

//generate budget section

//elements
const generateBudgetSection = document.querySelector(".generate-budget-section");
const generateBudgetBtn = document.querySelector("#generate-budget-btn");

//budget finished 

//elements
const budgetFinished = document.querySelector("#budget-finished");
const budgetFinishedContent = document.querySelector(".budget-finished-content-container");

const clientSpanResult = document.querySelector("#client-span-result");
const equipamentSpanResult = document.querySelector("#equipament-span-result");
let budgetCodeValue = "";
let budgetNameArchive = null;
const budgetCodeSpan = document.querySelector("#budget-code-span"); 
const paymentTermsSpanResult = document.querySelector("#payment-terms-span-result");
const completionDeadlineSpanResult = document.querySelector("#completion-deadline-span-result");
const guaranteeSpanResult = document.querySelector("#guarantee-span-result");
const dateSpanResult = document.querySelector("#date-span-result");

const apliedPartsItemsContainer = document.querySelector(".aplied-parts-items-container");
const totalOfPartsApliedItemsSpan = document.querySelector(".total-of-aplied-parts-span");
const servicesPerformedItemsContainer = document.querySelector(".services-performed-items-container");
const totalOfServicesPerformedItemsSpan = document.querySelector(".total-of-services-performed-items-span")

const totalOfPartsSpan = document.querySelector(".total-of-parts-span");
const totalOfServicesSpan = document.querySelector(".total-of-services-span");
const totalOfBudgetSpan = document.querySelector(".total-of-budget-span");

const observationsMadeSpan = document.querySelector(".observations-made-span");

const savePdfBtn = document.querySelector("#save-document-pdf-btn");
const saveHtmlBtn = document.querySelector("#save-document-html-btn");
const backBudgetBtn = document.querySelector("#back-budget-btn");

//functions

function addHeaderFinishedProcess(){
    clientSpanResult.innerHTML = "";
    equipamentSpanResult.innerHTML = "";
    addBudgetCodeFinishedProcess(); // generate and add budget number in html code
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
    dateSpanResult.innerText = reorganizeDateFormat();

    if(paymentTermsSpanResult.innerText === ""){
        paymentTermsSpanResult.innerText = "###"
    }

    if(guaranteeSpanResult.innerText === ""){
        guaranteeSpanResult.innerText = "###"
    }

    if(completionDeadlineSpanResult.innerText === ""){
        completionDeadlineSpanResult.innerText = "###"
    }

    if(dateSpanResult.innerText === "undefined/undefined/"){
        dateSpanResult.innerText = "###"
    }

    let budgetName = createBudgetName();

    document.querySelector("title").textContent = budgetName;
}

function addBudgetCodeFinishedProcess(){
    budgetCodeSpan.innerText = "";

    if(budgetCodeValue.length == 10){
        budgetCodeSpan.innerText = budgetCodeValue;
        return;
    }

    budgetCodeValue = createBudgetCode();
    budgetCodeSpan.innerText = budgetCodeValue;
}

function createBudgetCode(){
    let dateToday = new Date();
    let month = dateToday.getMonth() + 1;
    let year = dateToday.getFullYear();
    dateToday = `${month}${year}`;

    function generateFourAleatoryNumbers(){
        let digits = "";

        for (let i = 1; i <= 4 ; i++){
            let number = Math.floor(Math.random() * 9);

            number = number.toString();

            digits += number;
        }

        return digits; 
    }
    
    budgetCodeValue = `#${dateToday}${generateFourAleatoryNumbers()}`;

    return budgetCodeValue;
}


function createBudgetName(){
    clientName = clientSpanResult.innerText;
    clientName = clientName.split("(");
    clientName = clientName[0].trim();

    equipamentName = equipamentSpanResult.innerText;

    budgetCodeValue = budgetCodeValue.replace("#","");

    clientName = clientName.trim();
    equipamentName = equipamentName.trim();
    budgetCodeValue = budgetCodeValue.trim();

    budgetNameArchive = `ORÇAMENTO ${budgetCodeValue} ${clientName} ${equipamentName} .html`

    return budgetNameArchive;
}


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

function createServiceItemFinished(numberItem, quant , description , unitValue , totalValue){
    const itemString = 
    `
    <div class="services-performed-item">
        <span class="serv-performed-number-item-span">${numberItem}</span>
        <span class="serv-performed-quant-span">${quant}</span>
        <span class="serv-performed-description-span">${description}</span>
        <span class="serv-performed-unit-value-span">${unitValue}</span>
        <span class="serv-performed-total-value-span">${totalValue}</span>
    </div>
    `;

    const parser = new DOMParser();

    const doc = parser.parseFromString(itemString, 'text/html');

    const itemHtml  = doc.body.firstChild;

    servicesPerformedItemsContainer.appendChild(itemHtml);
}

function createNoContentPartsSpan(spanHTML, spanMsg){
    const itemString = 
    `
    <span class="${spanHTML}">${spanMsg}</span>
    `;

    const parser = new DOMParser();

    const doc = parser.parseFromString(itemString, 'text/html');

    const itemHtml  = doc.body.firstChild;

    apliedPartsItemsContainer.appendChild(itemHtml);
}

function createNoContentServicesSpan(spanHTML, spanMsg){
    const itemString = 
    `
    <span class="${spanHTML}">${spanMsg}</span>
    `;

    const parser = new DOMParser();

    const doc = parser.parseFromString(itemString, 'text/html');

    const itemHtml  = doc.body.firstChild;

    servicesPerformedItemsContainer.appendChild(itemHtml);
}

function addServiceItemFinishedProcess(){
   const servicesItem = document.querySelectorAll(".services-item");
   const serviceQuantSpan = document.querySelectorAll(".service-quant-span");
   const serviceDescriptionSpan = document.querySelectorAll(".service-description-span");
   const serviceUnitValueSpan = document.querySelectorAll(".service-unit-value-span");
   const serviceTotalValueSpan = document.querySelectorAll(".service-total-value-span");

   servicesPerformedItemsContainer.innerHTML = "";
   
   if(servicesItem[0] === undefined){
        createNoContentServicesSpan("serv-performed-no-content-span","NÃO FORAM EXECUTADOS SERVIÇOS !");
        return;
   }

   for(let i = 0; i < servicesItem.length ; i++){
        let item = i + 1;
        createServiceItemFinished(
            item,
            serviceQuantSpan[i].innerText,
            serviceDescriptionSpan[i].innerText,
            serviceUnitValueSpan[i].innerText,
            serviceTotalValueSpan[i].innerText,
        )
   }
}

function addPartItemFinishedProcess(){
    const partsItem = document.querySelectorAll(".parts-item");
    const partsQuantSpan = document.querySelectorAll(".parts-quant-span"); 
    const partsDescriptionSpan = document.querySelectorAll(".parts-description-span");
    const partsUnitValueSpan = document.querySelectorAll(".parts-unit-value-span");
    const partsTotalValueSpan = document.querySelectorAll(".parts-total-value-span"); 

    apliedPartsItemsContainer.innerHTML = "";

    if (partsItem[0] === undefined){
        createNoContentPartsSpan("aplied-parts-no-content-span", "NÃO FORAM APLICADAS PEÇAS !");
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

function addAllItemsTotalFinished(){
    const partsItemTotalSpan = document.querySelector(".parts-item-total-span");
    const servicesItemTotalSpan = document.querySelector(".services-item-total-span");
    const totalOfBudgetDisplaySpan = document.querySelector(".total-of-budget-display-span");

    //clear inputs
    totalOfPartsApliedItemsSpan.innerHTML = "";
    totalOfPartsSpan.innerHTML = "";
    totalOfServicesPerformedItemsSpan.innerHTML = "";
    totalOfServicesSpan.innerHTML = "";
    totalOfBudgetSpan.innerHTML = "";

    //display informations

    totalOfPartsApliedItemsSpan.innerText = partsItemTotalSpan.innerText;
    totalOfServicesPerformedItemsSpan.innerText = servicesItemTotalSpan.innerText;
    totalOfPartsSpan.innerText = partsItemTotalSpan.innerText;
    totalOfServicesSpan.innerText = servicesItemTotalSpan.innerText;
    totalOfBudgetSpan.innerText = totalOfBudgetDisplaySpan.innerText;


    if (partsItemTotalSpan.innerText === ""){
        totalOfPartsApliedItemsSpan.innerText = "R$ -";
        totalOfPartsSpan.innerText = "R$ -";
    };
    
    if(servicesItemTotalSpan.innerText === ""){
        totalOfServicesPerformedItemsSpan.innerText = "R$ -";
        totalOfServicesSpan.innerText = "R$ -";
    };

    if (totalOfBudgetDisplaySpan.innerText === ""){
        totalOfBudgetSpan.innerText = "R$ -";
    };
}

function addObservationsFinishedProcess(){
    observationsMadeSpan.innerHTML = "";

    if(observationsTextarea.value === ""){
        observationsMadeSpan.innerText = "SEM OBSERVAÇÕES !";
        return;
    }

    observationsMadeSpan.innerText = observationsTextarea.value;
}

function displayBudgetProcess(){
    //show budget finished and hide budget production
    showHtmlElement(budgetFinished);
    hideHtmlElement(budgetProduction)
    //display header informations
    
    addHeaderFinishedProcess();

    //display parts and services informations

    addPartItemFinishedProcess();
    addServiceItemFinishedProcess();

    //display total informations

    addAllItemsTotalFinished();

    //display observations informations

    addObservationsFinishedProcess();
}

function saveAsHtml(){
    budgetNameArchive = createBudgetName();

    const blob = new Blob([document.documentElement.outerHTML], { type: 'text/html' });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = budgetNameArchive;
    link.click();
}

//event listerner

generateBudgetBtn.addEventListener("click", ()=>{
    displayBudgetProcess();
})

saveHtmlBtn.addEventListener("click", ()=>{
    saveAsHtml();
})   

savePdfBtn.addEventListener("click", ()=>{
    window.print();
})

backBudgetBtn.addEventListener("click", ()=>{
    showHtmlElement(budgetProduction);
    hideHtmlElement(budgetFinished);
    document.querySelector("title").textContent = "Criar orçamento EMEG"
}) 