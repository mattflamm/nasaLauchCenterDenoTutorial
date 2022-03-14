import {Router} from "https://deno.land/x/oak/router.ts";
import {getArt} from "./utilities.ts";
import {getAllPlanets} from "./models/planets.ts";

const router = new Router();

router.get("/", (context) => {
  context.response.body = getArt;
});

router.get("/planets", (context) => {
  context.response.body = getAllPlanets();
});



export default router;