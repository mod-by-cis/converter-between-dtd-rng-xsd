import { ConverterBetweenDtdRngXsd } from "../mod.ts";


// **Przykładowe użycie**
const manager = new ConverterBetweenDtdRngXsd({
  dtdinstJar: `${Deno.cwd()}/bin2/java/dtdinst.jar`,
  trangJar: `${Deno.cwd()}/bin2/java/trang.jar`,
});

manager.initialize().then(() => {
  console.log("Status plików:");
}).catch(console.error);
