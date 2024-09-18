import { from, Observable } from "rxjs";
import { map } from "rxjs/operators";

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
    static fetchByName(searchTerm:string = ""): Observable<Digimon[]>{
        return from(fetch("http://localhost:3000/digimons").then(response => response.json()))
        .pipe(
            map(digimons => digimons
                .filter((digimon: any) => digimon.name.toLowerCase().includes(searchTerm.toLowerCase()))
                .map((digimonData: any) => new Digimon(digimonData))
            )
        );
    }

    static fetchById(id: number): Observable<Digimon>{
        return from(fetch(`http://localhost:3000/digimons/${id}`).then(response => response.json()))
        .pipe(
            map(digimonData => new Digimon(digimonData))
        );
    }

    static fetchSingleByName(name: string): Observable<Digimon> {
        return from(fetch(`http://localhost:3000/digimons`)
            .then(response => response.json()))
            .pipe(map(data => {
                const digimonData = data.find((digimon: any) => digimon.name.toLowerCase() === name.toLowerCase());
                return new Digimon(digimonData);
            }));
    }

    getPreviousEvolutions(): string[] {
        return this.prevEvolutions;
    }

    getNextEvolutions(): string[] {
        return this.nextEvolutions;
    }
}

