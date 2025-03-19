import { ConverterBetweenDtdRngXsd } from "../mod.ts";



// **Przykładowe użycie**
const manager = new ConverterBetweenDtdRngXsd({
  dtdinstJar: `${Deno.cwd()}/bin2/dtdinst.jar`,
  trangJar: `${Deno.cwd()}/bin2/trang.jar`,
  jingJar: `${Deno.cwd()}/bin2/jing.jar`,
});

manager.initialize().then(() => {
  console.log("Status plików:", manager.getFileStatus());
}).catch(console.error);
