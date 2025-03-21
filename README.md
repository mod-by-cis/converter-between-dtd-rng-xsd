# converter-between-dtd-rng-xsd
<br>
## `deno.json`

``` json
{
    "imports": {
        "@mod-by-cis/converter-between-dtd-rng-xsd": "https://raw.githubusercontent.com/mod-by-cis/converter-between-dtd-rng-xsd/refs/tags/v0.0.1/mod.ts"
    }
}
```

## `main.ts`

``` ts
import {
  ConverterBetweenDtdRngXsd,
  Convert
} from "../mod.ts";

const manager = new ConverterBetweenDtdRngXsd({
  dtdinstJar: `${Deno.cwd()}/bin/java/dtdinst.jar`,
  trangJar: `${Deno.cwd()}/bin/java/trang.jar`,
});

manager.initialize().then(() => {
  console.log(" (^_^) ");
  manager.convertBetween([Convert.RNG, Convert.XSD], "example/models", "test__from-DTD");

}).catch(console.error);

await manager.convertBetween([Convert.DTD, Convert.RNG], "example/models", "test");
```

- - -

- - -

<br>
<br>
