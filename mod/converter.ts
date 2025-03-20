// ## `./mod/converter.ts`
import { PATH } from "../deps.ts";
import { type JarConfigs, type JarRecord, type JarVariant, Convert } from "./converter.types.ts";
import { MESSAGE } from "./messages.ts";

export class ConverterBetweenDtdRngXsd {
    readonly #config: JarConfigs;

    constructor(paths: Partial<JarRecord>) {
        const configURL: JarRecord = {
            dtdinstJar: "https://raw.githubusercontent.com/mod-by-cis/converter-between-dtd-rng-xsd/refs/heads/main/bin/java/dtdinst.jar",
            trangJar: "https://raw.githubusercontent.com/mod-by-cis/converter-between-dtd-rng-xsd/refs/heads/main/bin/java/trang.jar",
            // jingJar: "https://raw.githubusercontent.com/mod-by-cis/converter-between-dtd-rng-xsd/refs/heads/main/bin/java/jing.jar",
        };
        const configJAR: JarRecord = {
            dtdinstJar: paths.dtdinstJar ? this.#parsePath(paths.dtdinstJar) : '',
            trangJar: paths.trangJar ? this.#parsePath(paths.trangJar) : '',
            // jingJar: paths.jingJar ? this.#parsePath(paths.jingJar) : '',
        };
        const config: JarConfigs = {
            jar: configJAR,
            url: configURL
        };
        this.#config = config;
    }
    #parsePath(path: string): string {
        path = PATH.normalize(path);
        path = PATH.isAbsolute(path) ? path : PATH.resolve(Deno.cwd(), path);
        MESSAGE('parsePath_ERROR_THROW', !path.startsWith(PATH.normalize(Deno.cwd())), { path: path, pathCWD: PATH.normalize(Deno.cwd())});
        return path;
    }

    async initialize() {
        await this.#ensureBinJar();
        await this.#checkJavaInstalled();
        MESSAGE('jarBinInitializeFinish_LOG', true);
    }

    async #ensureBinJar() {
        for (const key of Object.keys(this.#config.jar) as JarVariant[]) {
            const path = this.#config.jar[key];
            if (path && !(await this.#checkExistsPath(path))) {
                MESSAGE('jarBinCheckExist_LOG', true, { jarName: key });
                await this.#downloadBinJar(this.#config.url[key], path);
            }
            //this.#jarExists[key] = await this.#checkExistsPath(path ?? "");
        }
    }

    async #downloadBinJar(url: string, destPath: string): Promise<void> {
        MESSAGE('jarBinDownloadStart_LOG', true, { pathURL: url, pathJAR: destPath });
        const dirPath = PATH.dirname(destPath);
        await Deno.mkdir(dirPath, { recursive: true });

        const response = await fetch(url);
        MESSAGE('jarBinDownload_ERROR_THROW', !response.ok || !response.body, { pathURL: url });

        const file = await Deno.open(destPath, { create: true, write: true });
        await response.body?.pipeTo(file.writable);
        MESSAGE('jarBinDownloadSuccess_LOG', true, { pathJAR: destPath });
    }

    async #checkExistsPath(path: string): Promise<boolean> {
        try {
            const stat = await Deno.stat(path);
            return stat.isFile;
        } catch {
            return false;
        }
    }

    async #checkJavaInstalled() {
        try {
            const process = new Deno.Command("java", {
                args: ["-version"],
                stdout: "piped",
                stderr: "piped",
            }).spawn();

            const status = await process.status;
            MESSAGE('jdkNotInstalled1_ERROR_THROW', !status.success);
        } catch {
            MESSAGE('jdkNotInstalled2_ERROR_THROW', true);
        }
    }

    //---------------------------------

    async #runJarCommand(key: JarVariant, inputPath:string, outputPath:string): Promise<void> {
        const command = new Deno.Command("java", {
            args: [ 
                "-jar", 
                this.#config.jar[key], 
                ...((key === "dtdinstJar") ? [inputPath] : [inputPath, outputPath])
            ],
            stdin: "null",
            stdout: "piped", // Przekierowanie wyjścia do pamięci
            stderr: "piped", // Przekierowanie błędów
        });
        const output = await command.output();
        if (output.code === 0) {
            if (key === "dtdinstJar") {
                await Deno.writeFile(outputPath, output.stdout);
            }            
            MESSAGE('fileConvertSuccess_LOG', true, { input: inputPath, output: outputPath });
        } else {
            MESSAGE('fileConvert_ERROR_LOG', true, { input: inputPath, textForDecode: output.stderr });
        }
    }

    async convertBetween(convertFromTo: [Convert, Convert], pathToDIR: string, nameFILE: string): Promise<void>  {
        pathToDIR = this.#parsePath(pathToDIR);
        nameFILE = this.#parseName(nameFILE);
        const F = (extension: string, process?: string): string => process ? PATH.resolve(pathToDIR, nameFILE + '__' + process + extension) : PATH.resolve(pathToDIR, nameFILE + extension);
        const inF = convertFromTo[0] === Convert.DTD 
            ? ['from-DTD', '.dtd.xml']
            : convertFromTo[0] === Convert.RNG
                ? ['from-RNG', '.rng']
                : convertFromTo[0] === Convert.RNC
                    ? ['from-RNC', '.rnc']
                    : convertFromTo[0] === Convert.XSD
                        ? ['from-XSD', '.xsd']
                        : ['',''];
        const exF = convertFromTo[1] === Convert.DTD
            ? '.dtd'
            : convertFromTo[1] === Convert.RNG
                ? '.rng'
                : convertFromTo[1] === Convert.RNC
                    ? '.rnc'
                    : convertFromTo[1] === Convert.XSD
                        ? '.xsd'
                        : '';
        if (convertFromTo[0] === Convert.DTD) {
            await this.#runJarCommand("dtdinstJar", F('.dtd'), F('.dtd.xml'));
            await this.#runJarCommand("trangJar", F(inF[1]), F(exF, inF[0]));
        } else {
            await this.#runJarCommand("trangJar", F(inF[1]), F(exF, inF[0]));     
        }
    }

    //---------------------------------


    #parseName(name: string): string {
        const allowedPattern = /^[a-zA-Z0-9\-_\#@\. \(\)\[\]]+$/;
        const disallowedEndings = [".dtd", ".dtd.xml", ".rng", ".rnc", ".xsd", ".", " "];
        let sanitized = name.match(allowedPattern)?.join("") || "";
        while (disallowedEndings.some(ending => sanitized.endsWith(ending))) {
            disallowedEndings.forEach(ending => {
                if (sanitized.endsWith(ending)) {
                    sanitized = sanitized.slice(0, -ending.length); // Usuwamy niedozwolone zakończenie
                }
            });
            sanitized = sanitized.trim(); // Na wypadek, gdyby pozostały dodatkowe spacje
        }
        MESSAGE('parseName_ERROR_THROW', sanitized.length < 1, {name:name});
        return sanitized;
    }

}