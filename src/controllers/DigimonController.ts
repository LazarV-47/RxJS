import { switchMap, map } from "rxjs/operators";
import { DigimonView } from "../views/DigimonView";
import { Digimon } from "../models/Digimon";
import { Observable, of } from "rxjs";

export class DigimonController {
    private view: DigimonView;

    constructor(view: DigimonView) {
        this.view = view;
        
        this.view.bindSearch()
            .pipe(
                switchMap(searchTerm => Digimon.fetchByName(searchTerm))
            )
            .subscribe(digimons => this.view.renderDigimons(digimons));

            
        this.view.bindResetClick()
        .pipe(
            switchMap( () => Digimon.fetchByName())
        )
        .subscribe(digimons => this.view.renderDigimons(digimons));
        
        
        this.view.bindCheckboxes().pipe(
            switchMap((types: string[]) => types.length ? this.fetchByTypes(types) : this.fetchAllDigimons())
        ).subscribe(digimons => view.renderDigimons(digimons));
            
            
        this.view.bindDigimonClick()
            .pipe(
                switchMap(id => id ? Digimon.fetchById(id) : of(null))
            )
            .subscribe(digimon => {
                if(digimon){
                    this.view.renderDigimonDetail(digimon);
                };
        });
            

        this.view.bindNavigationClick()
        .pipe(
            switchMap((direction: string) => 
                this.getCurrentDigimon(direction).pipe(
                    map(digimon => ({digimon, direction}))
                )
            ),
            switchMap(({digimon, direction}) => this.getEvolutionDigimon(digimon, direction))
        )
        .subscribe(digimon => {
            if (digimon) {
                this.view.renderDigimonDetail(digimon);
            }
        });


        Digimon.fetchByName().subscribe(digimons => this.view.renderDigimons(digimons));
    }

    //Helper functions
    fetchByTypes(types: string[]): Observable<Digimon[]> {
        return Digimon.fetchByName().pipe(
            map(digimons => digimons.filter(digimon => types.includes(digimon.type)))
        );
    }

    fetchAllDigimons(): Observable<Digimon[]> {
        return Digimon.fetchByName();
    }

    private getCurrentDigimon(direction: string): Observable<Digimon | null> {
        if (!direction) return of(null);

        const detailElement = this.view.getDigimonList().querySelector(".digimon-detail");
        if (detailElement) {
            const currentDigimonId = parseInt(detailElement.getAttribute("data-id") || "0");
            return Digimon.fetchById(currentDigimonId);
        }

        return of(null);
    }

    private getEvolutionDigimon(digimon: Digimon | null, direction: string): Observable<Digimon | null> {
        if (!digimon) return of(null);

        const evolutionNames = direction === "prev" ? digimon.getPreviousEvolutions() : digimon.getNextEvolutions();
        if (evolutionNames.length > 0) {
            const evolutionName = evolutionNames[0];
            return Digimon.fetchSingleByName(evolutionName);
        }

        return of(null);
    }

}