import {Application} from "https://deno.land/x/oak@v10.4.0/mod.ts"
import {getArt} from "./utilities.ts"


const app = new Application();
const PORT = 8000; //shouldn't this be an env variable somewhere?

let art: string;

app.use((context, next) => {
  context.response.body = getArt;
});


if (import.meta.main) { //check if running directly or as import
  await app.listen({
    port: PORT
  });
}