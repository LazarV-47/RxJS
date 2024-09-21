import { Digimon } from "../../models/Digimon";

export const createDigimonTile = (digimon: Digimon): HTMLDivElement => {
    const digimonTile: HTMLDivElement = document.createElement("div");
    digimonTile.classList.add("digimon-tile");
    digimonTile.setAttribute("data-id" , digimon.id.toString());

    const digimonImg: HTMLImageElement = document.createElement("img");
    digimonImg.src = digimon.image;
    digimonImg.alt = digimon.name;
    digimonImg.classList.add("digimonImg-tile");
    digimonTile.appendChild(digimonImg);

    const digimonName: HTMLParagraphElement = document.createElement("p");
    digimonName.classList.add("digimon-name-tile");
    digimonName.textContent = digimon.name;
    digimonTile.appendChild(digimonName);


    const labelWrapper = document.createElement("label");
    labelWrapper.classList.add("digimon-compare-label");

    const checkboxCompare = document.createElement("input");
    checkboxCompare.type = "checkbox";
    checkboxCompare.classList.add("digimon-compare-checkbox");
    checkboxCompare.setAttribute("data-id", digimon.id.toString());

    const compareText = document.createElement("span");
    compareText.textContent = "Compare";
    compareText.classList.add("digimon-compare-text");

    labelWrapper.appendChild(checkboxCompare);
    labelWrapper.appendChild(compareText);
    
    digimonTile.appendChild(labelWrapper);

    labelWrapper.addEventListener("click", (event) => {
        event.stopPropagation();
    });

    return digimonTile;
}

export const createDigimonDetail = (digimon: Digimon): HTMLDivElement => {
    const digimonDetail: HTMLDivElement = document.createElement("div");
    digimonDetail.classList.add("digimon-detail");
    digimonDetail.setAttribute("data-id" , digimon.id.toString());

    const digimonImg: HTMLImageElement = document.createElement("img");
    digimonImg.src = digimon.image;
    digimonImg.alt = digimon.name;
    digimonImg.classList.add("digimonImg-detail");
    digimonDetail.appendChild(digimonImg);

    const digimonName: HTMLHeadingElement = document.createElement("h1");
    digimonName.classList.add("digimon-name-detail");
    digimonName.textContent = digimon.name;
    digimonDetail.appendChild(digimonName);

    const attributesContainer = document.createElement("div");
    attributesContainer.classList.add("attributes-container");

    const attributes = [{label: "Level", value: digimon.level},
                        {label: "Attribute", value: digimon.attribute},
                        {label: "Type", value: digimon.type}
                        ];

    attributes.forEach(a => {
        createAttribute(attributesContainer, a.label, a.value);
    });

    digimonDetail.appendChild(attributesContainer);

    if (digimon.prevEvolutions.length > 0) {
        const prevArrow = document.createElement("button");
        prevArrow.classList.add("navigation-arrow", "navigation-arrow-prev");
        prevArrow.setAttribute("data-direction", "prev");
        prevArrow.textContent = digimon.prevEvolutions[0];
        digimonDetail.appendChild(prevArrow);
    }

    if (digimon.nextEvolutions.length > 0) {
        const nextArrow = document.createElement("button");
        nextArrow.classList.add("navigation-arrow", "navigation-arrow-next");
        nextArrow.setAttribute("data-direction", "next");
        nextArrow.textContent = digimon.nextEvolutions[0];
        digimonDetail.appendChild(nextArrow);
    }

    return digimonDetail;
}

export const createDigimonCompareTile = (digimon: Digimon): HTMLDivElement => {
    const digimonCard: HTMLDivElement = document.createElement("div");
    digimonCard.classList.add("digimon-card");

    const digimonImg: HTMLImageElement = document.createElement("img");
    digimonImg.src = digimon.image;
    digimonImg.alt = digimon.name;
    digimonImg.classList.add("digimonImg-tile");
    digimonCard.appendChild(digimonImg);

    const digimonName: HTMLParagraphElement = document.createElement("p");
    digimonName.classList.add("digimon-name-tile");
    digimonName.innerHTML = `<strong>Name:</strong> ${digimon.name}`;
    digimonCard.appendChild(digimonName);

    const digimonLevel: HTMLParagraphElement = document.createElement("p");
    digimonLevel.classList.add("digimon-level-tile");
    digimonLevel.innerHTML = `<strong>Level:</strong> ${digimon.level}`;
    digimonCard.appendChild(digimonLevel);

    const digimonAttribute: HTMLParagraphElement = document.createElement("p");
    digimonAttribute.classList.add("digimon-attribute-tile");
    digimonAttribute.innerHTML = `<strong>Attribute:</strong> ${digimon.attribute}`;
    digimonCard.appendChild(digimonAttribute);

    const digimonType: HTMLParagraphElement = document.createElement("p");
    digimonType.classList.add("digimon-type-tile");
    digimonType.innerHTML = `<strong>Type:</strong> ${digimon.type}`;
    digimonCard.appendChild(digimonType);

    return digimonCard;
};


function createAttribute(cont: HTMLElement, label: string, value: string){
    let attribute = document.createElement("div");
    attribute.classList.add("attribute");

    let attributeLabel = document.createElement("p");
    attributeLabel.classList.add("attribute-label");
    attributeLabel.textContent = label;

    let attributeValue = document.createElement("p");
    attributeValue.classList.add("attribute-value");
    attributeValue.textContent = value;

    attribute.appendChild(attributeLabel);
    attribute.appendChild(attributeValue);
    cont.appendChild(attribute);
}