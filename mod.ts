// # `./mod.ts`

import { t, PATH } from "./deps.ts";
export class ConverterBetweenDtdRngXsd {
  readonly #jarFiles: Record<string, string | undefined>;
  readonly #jarUrls: Record<string, string> = {
    dtdinstJar: "https://raw.githubusercontent.com/mod-by-cis/converter-between-dtd-rng-xsd/refs/heads/main/bin/java/dtdinst.jar",
    trangJar: "https://raw.githubusercontent.com/mod-by-cis/converter-between-dtd-rng-xsd/refs/heads/main/bin/java/trang.jar",
    jingJar: "https://raw.githubusercontent.com/mod-by-cis/converter-between-dtd-rng-xsd/refs/heads/main/bin/java/jing.jar",
  };

  #jarExists: Record<string, boolean> = {
    dtdinstJar: false,
    trangJar: false,
    jingJar: false,
  };

  constructor(paths: { dtdinstJar?: string; trangJar?: string; jingJar?: string }) {
    this.#jarFiles = {
      dtdinstJar: paths.dtdinstJar ? PATH.normalize(paths.dtdinstJar) : undefined,
      trangJar: paths.trangJar ? PATH.normalize(paths.trangJar) : undefined,
      jingJar: paths.jingJar ? PATH.normalize(paths.jingJar) : undefined,
    };

    this.#validatePaths();
  }

  #validatePaths() {
    for (const [key, path] of Object.entries(this.#jarFiles)) {
      if (path && !path.startsWith(Deno.cwd())) {
        throw new Error(`Ścieżka dla ${key} musi znajdować się wewnątrz katalogu roboczego.`);
      }
    }
  }

  async #checkFileExists(path: string): Promise<boolean> {
    try {
      const stat = await Deno.stat(path);
      return stat.isFile;
    } catch {
      return false;
    }
  }

  async #downloadFile(url: string, destPath: string): Promise<void> {
    console.log(t.t('##> Pobieranie pliku:').s("b").c(0xcfdce6, 0x0d65ae)._);
    console.group();
    console.log(t.t(url).s(["u", "b"]).c(0x0d65ae, 0xcfdce6)._);
    console.log(t.t('-> ' + destPath).s("u").c(0x6eb3e9, 0x002948)._);

    // **Utworzenie katalogu, jeśli nie istnieje**
    const dirPath = PATH.dirname(destPath);
    await Deno.mkdir(dirPath, { recursive: true });

    const response = await fetch(url);
    if (!response.ok) {
      console.groupEnd();
      throw new Error(`Nie udało się pobrać pliku z ${url}`);
    }
    const file = await Deno.open(destPath, { create: true, write: true });
    await response.body?.pipeTo(file.writable);
    console.log(`Plik zapisany: ${destPath}`);
    console.groupEnd();
  }

  async #ensureJarFiles() {
    for (const [key, path] of Object.entries(this.#jarFiles)) {
      if (path) {
        let exists = await this.#checkFileExists(path);
        this.#jarExists[key] = exists; // Ustawiamy status

        if (!exists) {
          console.log(`Plik ${key} nie istnieje. Pobieram...`);
          await this.#downloadFile(this.#jarUrls[key], path);

          // Ponownie sprawdzamy, czy plik został poprawnie pobrany
          exists = await this.#checkFileExists(path);
          this.#jarExists[key] = exists;

          if (!exists) {
            throw new Error(`Błąd: Nie udało się pobrać pliku ${key} z ${this.#jarUrls[key]}`);
          }
        }
      }
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
      if (!status.success) {
        throw new Error("Nie udało się uruchomić Java JDK!");
      }
    } catch {
      throw new Error("Java JDK jest wymagana! Zainstaluj JDK, aby kontynuować.");
    }
  }

  async initialize() {
    await this.#ensureJarFiles();
    await this.#checkJavaInstalled();
    console.log("Java JDK jest dostępna. Wszystkie pliki JAR są gotowe.");
  }

  getFileStatus(): Record<string, boolean> {
    return { ...this.#jarExists };
  }

  async commandJavaDtdinst(): Promise<void> {
    if (this.#jarExists.dtdinstJar){
      await console.log('this.#jarExists.dtdinstJar');
    }
  }

  async commandJavaTrang(): Promise<void> {
    if (this.#jarExists.trangJar) {
      await console.log('this.#jarExists.trangJar');
    }
  }

  async commandJavaJing(): Promise<void> {
    if (this.#jarExists.jingJar) {
      await console.log('this.#jarExists.jingJar');
    }
  }
}