import { DigimonController } from "./controllers/DigimonController";
import { DigimonView } from "./views/DigimonView"

document.addEventListener("DOMContentLoaded", () => {
    const view = new DigimonView(document.body);
    new DigimonController(view);
});