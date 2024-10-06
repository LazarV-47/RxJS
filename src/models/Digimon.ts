import { from, Observable } from "rxjs";
import { map, switchMap } from "rxjs/operators";

export class Digimon{
    id: number;
    name: string;
    image: string;
    level: string;
    attribute: string;
    type: string;
    prevEvolutions: string[];
    nextEvolutions: string[];

    constructor(data: Partial<Digimon>){
        this.id = data.id || 0;
        this.name = data.name || "";
        this.image = data.image || "";
        this.level = data.level || "";
        this.attribute = data.attribute || "";
        this.type = data.type || "";
        this.prevEvolutions = data.prevEvolutions || [];
        this.nextEvolutions = data.nextEvolutions || [];
    }

    static fetchByName(searchTerm: string = ""): Observable<Digimon[]> {
        return from(fetch("http://localhost:3000/digimons"))
            .pipe(
                switchMap((response: Response) => response.json()),
                map((digimons: Digimon[]) =>
                    digimons
                        .filter((digimon: Digimon) => digimon.name.toLowerCase().includes(searchTerm.toLowerCase()))
                        .map((digimonData: Digimon) => new Digimon(digimonData))
                )
            );
    }

    static fetchById(id: number): Observable<Digimon> {
        return from(fetch(`http://localhost:3000/digimons/${id}`))
            .pipe(
                switchMap((response: Response) => response.json()),
                map((digimonData: Digimon) => new Digimon(digimonData))
            );
    }

    static fetchSingleByName(name: string): Observable<Digimon> {
        return from(fetch("http://localhost:3000/digimons"))
            .pipe(
                switchMap((response: Response) => response.json()),
                map((data: Digimon[]) => {
                    const digimonData:Digimon = data.find(digimon => digimon.name.toLowerCase() === name.toLowerCase());
                    if (!digimonData) {
                        throw new Error('Digimon not found');
                    }
                    return new Digimon(digimonData);
                })
            );
    }

    getPreviousEvolutions(): string[] {
        return this.prevEvolutions;
    }

    getNextEvolutions(): string[] {
        return this.nextEvolutions;
    }
}

