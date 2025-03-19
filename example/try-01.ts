import { ConverterBetweenDtdRngXsd } from "../mod.ts";
import { t, ConsoleExtended } from "../deps.ts";
const c = new ConsoleExtended();

c.log(`${t.t(" Hello, World! ").s("b")
  .c(0xE4D5D3, 0x215732)._}`);

c.logWithPrefix(' aaa',`${t.t(" Hello, Moon! ").s(["i","u","b"])
  .c({ r: 25, g: 56, b: 100 }, 45)._}`);


// **Przykładowe użycie**
const manager = new ConverterBetweenDtdRngXsd({
  dtdinstJar: `${Deno.cwd()}/bin/java/dtdinst.jar`,
  trangJar: `${Deno.cwd()}/bin/java/trang.jar`,
  jingJar: `${Deno.cwd()}/bin/java/jing.jar`,
});

manager.initialize().then(() => {
  console.log("Status plików:", manager.getFileStatus());
}).catch(console.error);
