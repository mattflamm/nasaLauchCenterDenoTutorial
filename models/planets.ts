import { join } from "https://deno.land/std/path/mod.ts";
import { BufReader } from "https://deno.land/std@0.128.0/io/buffer.ts";
import { parse } from "https://deno.land/std/encoding/csv.ts";
import * as _ from "https://deno.land/x/lodash@4.17.15-es/lodash.js";


type Planet = Record<string, string>

let planets: Array<Planet>;

const loadPlanetData =async (path: string) => {
  
  const file = await Deno.open(path);
  const bufReader = new BufReader(file);

  let result = await parse(bufReader, {
    skipFirstRow: true, 
    comment: "#"
  })

  Deno.close(file.rid);

  const planets = (result as Array<Planet>).filter(planet => {
    const extantPlanet = (planet["koi_disposition"] = "CONFIRMED")? true: false;
    const planetRadius = Number(planet["koi_prad"]);
    const starMass = Number(planet["koi_smass"]);
    const starRadius = Number(planet["koi_srad"]);


    return extantPlanet && planetRadius > 0.5 && planetRadius < 1.5 && starMass > 0.78 && starMass < 1.04 && starRadius > 0.99 && starRadius < 1.01;
  });
  
  return planets.map((planet) => {
    return _.pick(planet, [
      "koi_prad",
      "koi_smass",
      "koi_srad",
      "kepler_name",
      "koi_count",
      "koi_steff"
    ])
  });

}

let path: string = join("data", "cumulative_2022.03.08_19.09.51.csv");

planets = await loadPlanetData(path);

console.log("number of planets: " + planets.length);

// for (let planet of planets) {
//   console.log(planet);
// }

export function getAllPlanets () {
  return planets;
}
