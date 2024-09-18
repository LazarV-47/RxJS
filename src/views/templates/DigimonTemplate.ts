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