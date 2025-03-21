import type { MessageKey, MessageVal } from "./messages.types.ts";
import type { JarVariant } from "./converter.types.ts";
import { t } from "../deps.ts";

export function MESSAGE(key: MessageKey, whenTRUE: boolean, args?: Record<string, any>): MessageVal {
    const message = new Map<MessageKey, MessageVal>([
        ["parsePath_ERROR_THROW", (whenTRUE: boolean, args: { path: string; pathCWD: string; } ) => {
            if (whenTRUE) {
                throw new Error(`Ścieżka ${args.path} musi znajdować się wewnątrz katalogu ${args.pathCWD}.`);
            }
        }],
        ["jarBinInitializeFinish_LOG", (whenTRUE: boolean) => {
            if (whenTRUE) {
                console.log(`${t.t('Java JDK jest dostępna.').c("-", 0x8f7c3f).s("b")._} ${t.t('Wszystkie pliki JAR są gotowe.').c("-", 0x002948)._}`);
            }
        }],
        ["jarBinCheckExist_LOG", (whenTRUE: boolean, args: { jarName: JarVariant; }) => {
            if (whenTRUE) {
                console.log(`Plik ${args.jarName} nie istnieje. Pobieram...`);
            }
        }],
        ["jarBinDownloadStart_LOG", (whenTRUE: boolean, args: { pathURL: string; pathJAR: string; }) => {
            if (whenTRUE) {
                console.log(t.t('##> Pobieranie pliku:').s("b").c(0xcfdce6, 0x0d65ae)._);
                console.group();
                console.log(t.t(args.pathURL).s(["u", "b"]).c(0x0d65ae, 0xcfdce6)._);
                console.log(t.t('-> ' + args.pathJAR).s("u").c(0x6eb3e9, 0x002948)._);
                console.groupEnd();
            }
        }],
        ["jarBinDownload_ERROR_THROW", (whenTRUE: boolean, args: { pathURL: string;}) => {
            if (whenTRUE) {
                throw new Error(`Nie udało się pobrać pliku z ${args.pathURL}`);
            }
        }],
        ["jarBinDownloadSuccess_LOG", (whenTRUE: boolean, args: { pathJAR: string; }) => {
            if (whenTRUE) {
                console.log(`Plik zapisany: ${args.pathJAR}`);
            }
        }],
        ["jdkNotInstalled1_ERROR_THROW", (whenTRUE: boolean) => {
            if (whenTRUE) {
                throw new Error("Nie udało się uruchomić Java JDK!");
            }
        }],
        ["jdkNotInstalled2_ERROR_THROW", (whenTRUE: boolean) => {
            if (whenTRUE) {
                throw new Error("Java JDK jest wymagana! Zainstaluj JDK, aby kontynuować.");
            }
        }],
        ["fileConvertSuccess_LOG", (whenTRUE: boolean, args: { input: string; output: string; }) => {
            if (whenTRUE) {
                console.error(`${t.t(' KONWERTOWANIE POWIODŁO SIĘ ').s("b").c(0x121111,0x87ad6d)._}`);
                console.group();
                console.error(`${args.input}:`);
                console.error(`${args.output}:`);
                console.groupEnd();
            }
        }],        
        ["fileConvert_ERROR_LOG", (whenTRUE: boolean, args: { input: string; output: string; textForDecode: Uint8Array<ArrayBuffer>; }) => {
            if (whenTRUE) {
                console.error(`${t.t(' KONWERTOWANIE NIE POWIODŁO SIĘ ').s("b").c(0x121111,0xc06b6e)._}`);
                console.group();
                console.error(`${args.input}:`);
                console.error(`${args.output}:`);
                console.error(new TextDecoder().decode(args.textForDecode));
                console.groupEnd();
            }
        }],
        ["parseName_ERROR_THROW", (whenTRUE: boolean, args: { name: string; }) => {
            if (whenTRUE) {
                throw new Error(`Nazwa ${args.name} jest niedozwolona!`);
            }
        }],
    ]);
    return message.get(key)?.(whenTRUE, args); 
}