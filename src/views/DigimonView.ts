import { Observable, fromEvent, merge} from "rxjs";
import { debounceTime, map } from "rxjs/operators";
import { Digimon } from "../models/Digimon";
import { createDigimonDetail, createDigimonTile } from "./templates/DigimonTemplate";

export class DigimonView{
    private digimonList: HTMLDivElement;
    private searchInput: HTMLInputElement;
    private resetBtn: HTMLElement;
    private checkBoxContainer: HTMLDivElement;
    private checkBoxes: HTMLInputElement[] = [];

    constructor(container: HTMLElement){
        this.digimonList = document.createElement("div");
        this.digimonList.classList.add("digimon-list");

        const searchContainer = document.createElement("div");
        searchContainer.classList.add("search-container");

        const resetIcon = document.createElement("btn");
        resetIcon.classList.add("reset-btn");
        this.resetBtn = resetIcon;
        searchContainer.appendChild(resetIcon);

        this.searchInput = document.createElement("input");
        this.searchInput.type = "text";
        this.searchInput.classList.add("digimon-search");
        this.searchInput.name = "digimon-search";
        this.searchInput.placeholder = "Search Digimon";
        searchContainer.appendChild(this.searchInput);

        this.checkBoxContainer = document.createElement("div");
        this.checkBoxContainer.classList.add("checkbox-container");

        
        container.appendChild(searchContainer);
        container.appendChild(this.checkBoxContainer);
        container.appendChild(this.digimonList);

        this.addCheckBoxes();
    }

    //Binder block

    bindSearch(): Observable<string> {
        return fromEvent<Event>(this.searchInput, 'input').pipe(
            map(event => {
                this.uncheckAllCheckboxes();
                debounceTime(200);
                return (event.target as HTMLInputElement).value;
            })
        );
    }

    bindDigimonClick(): Observable<number>{
        return fromEvent(this.digimonList, "click")
        .pipe(
            map((event: MouseEvent) => {
                const target = event.target as HTMLElement;
                const tile = target.closest(".digimon-tile");
                if(tile){
                    return parseInt(tile.getAttribute("data-id") || '0', 10);
                }
                return 0;
            })
        );
    }

    bindResetClick(): Observable<void> {
        return fromEvent<Event>(this.resetBtn, 'click').pipe(
            map(() => {
                this.clearSearchBar();
                this.uncheckAllCheckboxes();
            })
        );
    }

    bindNavigationClick(): Observable<string> {
        return fromEvent(document.body, "click")
            .pipe(
                map((event: any) => {
                    const arrow = event.target.closest(".navigation-arrow");
                    return arrow ? arrow.getAttribute("data-direction") : "";
                })
            );
    }

    bindCheckboxes(): Observable<string[]> {
        const checkboxChanges: Observable<string[]>[] = this.checkBoxes.map(checkbox =>
            fromEvent<Event>(checkbox, 'change').pipe(
                map(() => {
                    this.clearSearchBar();
                    return this.getSelectedTypes();
                })
            )
        );
        return merge(...checkboxChanges) as Observable<string[]>;
    }


    //Render block

    renderDigimons(digimons: Digimon[]): void {
        this.digimonList.innerHTML = "";
        digimons.forEach(digimon => {
            const digimonTile = createDigimonTile(digimon);
            this.digimonList.appendChild(digimonTile);
        });
    }

    renderDigimonDetail(digimon: Digimon):void {
        this.digimonList.innerHTML = "";
        this.uncheckAllCheckboxes();
        this.clearSearchBar();
        const digimonDetail = createDigimonDetail(digimon)
        this.digimonList.appendChild(digimonDetail);
    }


    //Helper function block

    getDigimonList(): HTMLDivElement {
        return this.digimonList;
    }

    addCheckBoxes() {
        const types = [
            'Slime', 'Lesser', 'Reptile', 'Dinosaur', 'Cyborg',
            'Dragon Man', 'Bird', 'Beast', 'Fairy', 'Plant', 'Insect',
            'Sea Animal', 'Mammal', 'Angel', 'Holy Beast', 'Holy Dragon', 'Seraph'
        ];

        types.forEach(type => {
            const label = document.createElement("label");
            const checkbox = document.createElement("input");
            checkbox.type = "checkbox";
            checkbox.value = type;
            checkbox.name = type;
            label.appendChild(checkbox);
            label.appendChild(document.createTextNode(type));
            this.checkBoxContainer.appendChild(label);
            this.checkBoxes.push(checkbox);
        });
    }

    getSelectedTypes(): string[] {
        return this.checkBoxes
            .filter(checkBox => checkBox.checked)
            .map(checkBox => checkBox.value);
    }

    clearSearchBar() {
        this.searchInput.value = '';
    }

    uncheckAllCheckboxes() {
        this.checkBoxes.forEach(checkbox => {
            checkbox.checked = false;
        });
    }

}