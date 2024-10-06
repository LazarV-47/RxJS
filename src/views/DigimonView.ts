import { Observable, fromEvent, merge, forkJoin} from "rxjs";
import { debounceTime, map, scan, throttleTime } from "rxjs/operators";
import { Digimon } from "../models/Digimon";
import { createDigimonDetail, createDigimonTile, createDigimonCompareTile } from "./templates/DigimonTemplate";

export class DigimonView{
    private digimonList: HTMLDivElement;
    private searchInput: HTMLInputElement;
    private resetBtn: HTMLElement;
    private checkBoxContainer: HTMLDivElement;
    private checkBoxes: HTMLInputElement[] = [];
    private compareBtn: HTMLElement;
    private scrollToTopBtn: HTMLElement;

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

        this.compareBtn = document.createElement("button");
        this.compareBtn.classList.add("compare-btn");
        this.compareBtn.innerHTML = "Compare";
        searchContainer.appendChild(this.compareBtn);


        this.checkBoxContainer = document.createElement("div");
        this.checkBoxContainer.classList.add("checkbox-container");

        
        container.appendChild(searchContainer);
        container.appendChild(this.checkBoxContainer);
        container.appendChild(this.digimonList);

        this.addCheckBoxes();

        this.scrollToTopBtn = document.createElement('button');
        this.scrollToTopBtn.classList.add("scrollTop-btn");
        this.scrollToTopBtn.innerText = '^';
        container.appendChild(this.scrollToTopBtn);
        this.scrollToTopBtn.style.display = "none";
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
                map((event: MouseEvent) => {
                    const target = event.target as HTMLElement;
                    const arrow = target.closest(".navigation-arrow");
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


    bindDigimonSelection(): Observable<number[]> {
        const checkboxes = document.querySelectorAll(".digimon-compare-checkbox");
    
        checkboxes.forEach(checkbox => {
            fromEvent(checkbox, "change").subscribe(() => {
                const selected = this.getSelectedDigimons();
    
                if (selected.length > 4) {
                    alert("You can only select up to 4 Digimon for comparison.");
                    (checkbox as HTMLInputElement).checked = false;
                }
            });
        });

        return fromEvent(checkboxes, "change").pipe(
            map(() => this.getSelectedDigimons().map(Number))
        );
    }

    
    bindCompareClick(): Observable<Event> {
        return fromEvent(this.compareBtn, "click");
    }


    public bindScrollToTopButtonEvents(): void {
        if (!this.scrollToTopBtn) return;

        const scroll$ = fromEvent(window, 'scroll').pipe(
            throttleTime(200),
            map(() => window.scrollY > 300)
        );

        scroll$.subscribe(isVisible => {
            if (this.scrollToTopBtn) {
                this.scrollToTopBtn.style.display = isVisible ? 'block' : 'none';
            }
        });

        const click$ = fromEvent(this.scrollToTopBtn, 'click');
        click$.subscribe(() => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }
    
    //Render block

    renderDigimons(digimons: Digimon[]): void {
        this.digimonList.innerHTML = "";
        digimons.forEach(digimon => {
            const digimonTile = createDigimonTile(digimon);
            this.digimonList.appendChild(digimonTile);
        });
    }

    renderDigimonDetail(digimon: Digimon): void {
        this.digimonList.innerHTML = "";
        this.uncheckAllCheckboxes();
        this.clearSearchBar();
        const digimonDetail = createDigimonDetail(digimon)
        this.digimonList.appendChild(digimonDetail);
    }


    showCompareModal(digimonIds: number[]): void {
        const modalOverlay = document.createElement("div");
        modalOverlay.classList.add("modal-overlay");
    
        const digimonObservables: Observable<Digimon>[] = digimonIds.map(id => Digimon.fetchById(id));
    
        forkJoin(digimonObservables).subscribe((digimons: Digimon[]) => {
            const modalContainer = document.createElement("div");
            modalContainer.classList.add("modal-container");
    
            digimons.forEach((digimon: Digimon) => {
                const digimonCard = createDigimonCompareTile(digimon);
                modalContainer.appendChild(digimonCard);
            });
    
            const closeButton = document.createElement("button");
            closeButton.classList.add("modal-close-button");
            closeButton.textContent = "X";
            modalContainer.appendChild(closeButton);
    
            modalOverlay.appendChild(modalContainer);
            document.body.appendChild(modalOverlay);
            modalOverlay.style.display = "block";
    
            fromEvent(closeButton, "click").subscribe(() => this.closeModal(modalOverlay));
    
            fromEvent(modalOverlay, "click").subscribe((event: Event) => {
                if (event.target === modalOverlay) {
                    this.closeModal(modalOverlay);
                }
            });
        });
    }

    private closeModal(modalOverlay: HTMLElement): void {
        modalOverlay.style.display = "none";
        document.body.removeChild(modalOverlay);

        const checkboxes = document.querySelectorAll(".digimon-compare-checkbox");
        checkboxes.forEach(checkbox => {
            (checkbox as HTMLInputElement).checked = false;
        });
    }


    //Helper function block

    getDigimonList(): HTMLDivElement {
        return this.digimonList;
    }

    addCheckBoxes(): void {
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

    clearSearchBar(): void {
        this.searchInput.value = '';
    }


    

    uncheckAllCheckboxes(): void {
        this.checkBoxes.forEach(checkbox => {
            checkbox.checked = false;
        });
    }

    getSelectedDigimons(): string[] {
        const selectedDigimons: string[] = [];
        const checkboxes = document.querySelectorAll(".digimon-compare-checkbox");

        checkboxes.forEach(checkbox => {
            const inputElement = checkbox as HTMLInputElement;
            if (inputElement.checked) {
                const digimonId = inputElement.getAttribute('data-id');
                if (digimonId) {
                    selectedDigimons.push(digimonId);
                }
            }
        });
        return selectedDigimons;
    }

}