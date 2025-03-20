// ## `./mod/converter.types.ts`

export type JarVariant = "dtdinstJar" | "trangJar" ;//| "jingJar";
export type JarRecord = Record<JarVariant, string>;
export interface JarConfigs {
    jar: JarRecord;
    url: JarRecord;
}
export enum Convert {
    DTD,
    RNG,
    RNC,
    XSD,
}
