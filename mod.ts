import {Application, send} from "https://deno.land/x/oak@v10.4.0/mod.ts";
import * as log from "https://deno.land/std@0.129.0/log/mod.ts";
import { join } from "https://deno.land/std@0.128.0/path/mod.ts";
import api from "./api.ts"


const app = new Application();
const PORT = 8000; //shouldn't this be an env variable somewhere?

//error handling and metrics
app.use(async (context, next) => {
  const start = Date.now();
  log.info(`request received ${context.request.method}  ${context.request.url}`);
  try {  //wrapping everyting in a try catch means errors will bubble up to here
    await next();
    const delta = Date.now() - start;
    log.info(`request completed in ${delta}ms`);
    context.response.headers.set("X-Response-Time", `${delta}ms`);
  } catch (e) {
    log.error(e);
    context.response.body ="An internal error occured";
    throw e;
  }

});

app.use(  api.routes() );

app.use(async (context) => {
  const filePath = context.request.url.pathname ? context.request.url.pathname : "/index.html";
  const fileWhiteList = [
    "/index.html",
    "/javascripts/script.js",
    "/stylesheets/style.css",
    "/images/favicon.png"
  ];
  
  if (fileWhiteList.includes(filePath)) {
    await send(context, filePath, {
      root: join(Deno.cwd(), "public")
    });
  } else {
    context.throw(404, "resource not found");
  }
  
});


if (import.meta.main) { //check if running directly or as import
  log.info("starting the app");
  await app.listen({
    port: PORT
  });
}