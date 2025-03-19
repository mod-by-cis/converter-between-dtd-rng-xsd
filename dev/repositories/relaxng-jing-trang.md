# @relaxng/jing-trang

## A. add submodule git to workspace

### A-1. Przejdź do głównego katalogu projektu

Upewnij się, że jesteś w głównym katalogu projektu, w którym chcesz dodać submoduł.

``` Bash
cd /ścieżka/do/twojego/projektu
```

### A-2. Dodaj submoduł GIT

Użyj polecenia `git submodule add`, aby dodać repozytorium jako submoduł.

``` Bash
git submodule add https://github.com/relaxng/jing-trang.git ./utils/jing-trang
```

> * `[https://github.com/relaxng/jing-trang.git](https://github.com/relaxng/jing-trang.git)`: URL repozytorium GIT, które chcesz dodać jako submoduł.
> * `./utils/jing-trang`: Ścieżka lokalna, gdzie submoduł ma zostać umieszczony.

### A-3. Zaktualizuj indeks GIT

Po dodaniu submodułu GIT automatycznie zapisuje tę informację w pliku `.gitmodules`.

Aby upewnić się, że wszystko jest poprawnie zaktualizowane w repozytorium, uruchom:

``` Bash
git add .gitmodules ./utils/jing-trang
git commit -m "Dodano submoduł jing-trang w ./utils/jing-trang"
```

### A-4. Zainicjuj submoduł

Jeśli pracujesz na nowo skonfigurowanym repozytorium (np. na innym komputerze), musisz zainicjować submoduły:

``` Bash
git submodule update --init --recursive
```

### A-5. Sprawdź strukturę folderów

Upewnij się, że submoduł został poprawnie sklonowany i znajduje się w ścieżce `./utils/jing-trang`.

``` Bash
ls ./utils/jing-trang
```

### A-6. Synchronizacja z aktualizacjami submodułu

Jeśli repozytorium główne lub submoduły zostały zaktualizowane, możesz zsynchronizować submoduł za pomocą:

``` Bash
git submodule update --remote
```

## B. Kompilacja

Oto kroki, które musisz wykonać w terminalu, aby uzyskać pliki `jing.jar` i `trang.jar` z repozytorium `[https://github.com/relaxng/jing-trang.git](https://github.com/relaxng/jing-trang.git)` po dodaniu go jako submodułu:

### B-1. Przejdź do katalogu submodułu

Upewnij się, że jesteś w folderze, w którym został dodany submoduł:

``` Bash
cd ./utils/jing-trang
```

### B-2. Zainicjuj submoduły (jeśli jeszcze tego nie zrobiłeś)

Jeśli dodano submoduł, ale nie został jeszcze zainicjowany, wykonaj poniższe polecenie, aby go zaktualizować:

``` Bash
git submodule update --init --recursive
```

### B-3. Uruchom komendę build przy użyciu Ant

Repozytorium `jing-trang` używa systemu budowania **Apache Ant**. Upewnij się, że masz zainstalowanego Ant w swoim systemie.

Jeśli Ant nie jest zainstalowany:

#### B-3-LINUX. Ubuntu/Debian

``` Bash
sudo apt-get install ant
```

#### B-3-MAC. MacOS (Homebrew)

``` Bash
brew install ant
```

#### B-3-WIN. Windows

> * [Pobierz Ant: Apache Ant Downloads](https://ant.apache.org/bindownload.cgi)
> * Dodaj go do zmiennej środowiskowej `PATH`.

##### B-3-WIN-1: Upewnij się, że masz zainstalowany Chocolatey

Jeśli nie masz jeszcze zainstalowanego Chocolatey, możesz to zrobić, wykonując poniższe polecenie w PowerShell (uruchomionym jako administrator):

``` Powershell
Set-ExecutionPolicy Bypass -Scope Process -Force; [System.Net.ServicePointManager]::SecurityProtocol = [System.Net.ServicePointManager]::SecurityProtocol -bor 3072; iex ((New-Object System.Net.WebClient).DownloadString('https://community.chocolatey.org/install.ps1'))
```

Po instalacji zamknij i ponownie otwórz terminal.

##### B-3-WIN-2: Zainstaluj Apache Ant za pomocą Chocolatey

Wykonaj poniższe polecenie w terminalu:

``` Powershell
choco install ant
```

##### B-3-WIN-3: Potwierdź instalację

Po zakończeniu instalacji możesz sprawdzić, czy Apache Ant został poprawnie zainstalowany, wpisując:

``` Powershell
ant -version
```

##### B-3-WIN-4: Opcjonalne ustawienia

Jeśli chcesz, aby Apache Ant działał poprawnie, upewnij się, że masz zainstalowaną Javę (JDK). Możesz również zainstalować JDK za pomocą Chocolatey:

``` Powershell
choco install openjdk
```

##### B-3-WIN-5: Potwierdź instalację

Po zakończeniu instalacji możesz sprawdzić, czy OpenJDK został poprawnie zainstalowany, wpisując:

``` Bash
java -version
javac -version
```

### B-4. Uruchom proces budowania

> Wykonaj poniższe polecenie, aby uruchomić proces budowania i wygenerować pliki `jing.jar` oraz `trang.jar`:
> 
> 
> ``` Bash
> ant
> ```

Jeśli chcesz wskazać określoną lokalizację dla build-u, możesz użyć następującego polecenia:

``` Bash
ant -Dbuild.dir=/ścieżka/do/docelowego/folderu
```

#### B-4-a. Wyjaśnienie

1. **`-Dbuild.dir=/ścieżka/do/docelowego/folderu`:**
    * Flaga `-D` definiuje właściwość o nazwie `build.dir` i przypisuje jej wartość. Ta właściwość może być używana w pliku `build.xml` jako zmienna.
2. **Zastosowanie w pliku `build.xml`:**
W swoim pliku `build.xml` musisz uwzględnić tę właściwość i jej wartość. Na przykład:

``` xml
<property name="build.dir" value="default/build/location" />
<target name="init">
    <mkdir dir="${build.dir}" />
</target>

<target name="build" depends="init">
    <copy todir="${build.dir}">
        <fileset dir="src" />
    </copy>
</target>
```

* Jeśli nie podasz `-Dbuild.dir`, Ant użyje wartości domyślnej: `default/build/location`.
    * Jeśli podasz `-Dbuild.dir` w linii poleceń, wartość ta nadpisze wartość domyślną.

#### B-4-b. Przykład działania

1. Uruchomienie z domyślną lokalizacją:

``` bash
ant
```

Wynik: Build zostanie wykonany w `default/build/location`.
2. Uruchomienie z własną lokalizacją:

``` bash
ant -Dbuild.dir=/custom/build/location
```

Wynik: Build zostanie wykonany w `/custom/build/location`.

#### B-4-c. Wskazówka

Możesz także używać innych właściwości, takich jak `src.dir` (dla katalogu źródłowego) lub `output.dir` (dla katalogu wyjściowego), aby mieć większą kontrolę nad procesem build-u.

### B-5. Sprawdź wygenerowane pliki

Po pomyślnym zakończeniu procesu budowania, pliki `jing.jar` i `trang.jar` będą dostępne w katalogu `build` w repozytorium. Możesz sprawdzić ich obecność, wpisując:

``` Bash
ls build
```

Powinieneś zobaczyć coś takiego:

``` Plaintext
dtdinst.jar
jing.jar
trang.jar
```

### B-6. Gotowe

Teraz masz pliki `dtdinst.jar`, `jing.jar` i `trang.jar`. Możesz je przenieść, używać w swoim projekcie lub zaimportować tam, gdzie są potrzebne.

#### Do czego służy folder `mod`?

1. **Elementy pomocnicze podczas budowy:**
    * Folder ten może zawierać **rozpakowane moduły**, które są scalane i kompilowane w końcowe pliki JAR.
    * Często zawiera również zbudowane klasy i struktury modułowe projektu.
2. **Wykorzystywane w czasie developmentu:**
    * Jeśli zamierzasz wprowadzać zmiany w projekcie lub pracować nad jego rozwojem, folder `mod` będzie przydatny, ponieważ jest częścią pełnego środowiska build.

#### Czy można go usunąć?

* **Tak, jeśli nie zamierzasz rozwijać projektu:**
    * Folder `mod` można bezpiecznie usunąć, jeśli pliki `jing.jar`, `trang.jar` i `dtdinst.jar` działają poprawnie.
* **Zachowaj, jeśli planujesz rozwijać projekt:**
    * W przypadku potrzeby pracy nad kodem źródłowym projektu, folder `mod` jest potrzebny, ponieważ zawiera kluczowe komponenty.

- - -

## C. Instrukcja

1. **`dtdinst.jar`:**
    * **Zakres funkcjonalności**
        * To narzędzie wyspecjalizowane w **przekształcaniu DTD na XSD**. Jest bardziej dopracowane pod kątem dokładnego odwzorowania szczegółowej struktury DTD w formacie XML Schema, w tym bardziej zaawansowanych funkcji, takich jak obsługa atrybutów, encji czy typów danych.
    * **Dokładność i zaawansowana konwersja**
        * Konwersja jest bardziej szczegółowa i precyzyjna. Narzędzie zostało zaprojektowane, aby lepiej odwzorować specyfikę DTD, co sprawia, że wyniki są bardziej zgodne z oryginalnym schematem.
        * Przykładowo, lepiej przekształca złożone struktury takie jak deklaracje elementów i atrybutów w XSD.
    * **Użyteczność i specjalizacja**
        * Jeśli celem jest precyzyjna i poprawna konwersja **tylko DTD na XSD**, to `dtdinst.jar` jest bardziej odpowiednim wyborem.
        * Przydatne w projektach, gdzie wymagana jest ścisła kompatybilność z DTD i dbałość o szczegóły.
    * Narzędzie przekształcające schematy DTD do nowocześniejszego formatu XSD.
    * Wynik to plik `.xsd`.
2. **`trang.jar`:**
    * **Zakres funkcjonalności**
        * Jest uniwersalnym narzędziem do konwersji między różnymi formatami schematów XML, takimi jak RELAX NG (RNG, RNC), DTD i XSD.
        * Jego podejście do DTD jest ogólne – potrafi zamienić DTD na XSD lub RELAX NG, ale głównym celem jest wsparcie dla wielu formatów, a nie pełne odwzorowanie DTD.
    * **Dokładność i zaawansowana konwersja**
        * Konwersja DTD na XSD (lub inny format) jest podstawowa i skupia się na ogólnych strukturach. Może nie obsługiwać wszystkich zaawansowanych funkcji DTD.
        * Dobrze nadaje się do szybkiej i prostej migracji schematów między różnymi formatami.
    * **Użyteczność i specjalizacja**
        * Jest użyteczne, jeśli potrzebujesz wszechstronnego narzędzia obsługującego wiele formatów schematów.
        * Idealne do prac, które wymagają częstych konwersji między RELAX NG, DTD i XSD.
    * Wszechstronne narzędzie pozwalające na konwersję między różnymi formatami schematów.
    * Obsługuje wiele kombinacji wejścia i wyjścia.
3. **`jing.jar`:**
    * Służy jedynie do walidacji plików XML względem RELAX NG.
    * Wynikiem walidacji są komunikaty o poprawności lub błędach dokumentu.

- - -

| Narzędzie | Funkcjonalność | Główne przeznaczenie |
| --------- | -------------- | -------------------- |
| **`trang.jar`** | Uniwersalna konwersja schematów XML (RELAX NG, DTD, XSD) | Migracja schematów między różnymi formatami. |
| **`dtdinst.jar`** | Dedykowana konwersja z DTD na XSD | Precyzyjne odwzorowanie DTD w formacie XSD. |

- - -

| **Kategoria** | **dtdinst.jar** | **trang.jar** | **jing.jar** |
| --------- | ----------- | --------- | -------- |
| **Główne Funkcje** | Konwersja schematów DTD na XML Schema (XSD). | Konwersja między różnymi formatami schematów XML (RELAX NG, DTD, XSD). | Walidacja dokumentów XML względem schematów RELAX NG. |
| **Formaty Wejściowe** | DTD | RELAX NG (RNG, RNC), DTD, XSD | RELAX NG (RNG, RNC) |
| **Formaty Wyjściowe** | XSD | RELAX NG (RNG, RNC), DTD, XSD | Brak (wynik to walidacja) |
| **Przykładowe Zastosowanie** | Przekształcanie starszych schematów DTD na XSD. | Zamiana schematu RELAX NG na DTD/XSD, automatyczne generowanie schematów. | Sprawdzanie poprawności dokumentów XML. |

- - -

- - -

### C-DTDINST. Instrukcja: `dtdinst.jar`

### C-DTDINST-a. Opis

`dtdinst.jar` to narzędzie służące do **konwersji DTD (Document Type Definition) na XML Schema (XSD)**. Jest szczególnie przydatne, gdy masz starsze schematy w formacie DTD i chcesz przekształcić je w nowocześniejszy format XSD, używany powszechnie w aplikacjach XML.

### C-DTDINST-b. Wymagania

1. **Java** – Zainstalowane środowisko JDK lub JRE.
2. **dtdinst.jar** – Plik `dtdinst.jar` musi być dostępny na Twoim dysku.
3. **Plik DTD** – Plik `.dtd`, który chcesz przekonwertować.
4. **Folder Wyjściowy** – Miejsce, gdzie pliki XSD zostaną zapisane.

### C-DTDINST-c. Podstawowe polecenie

``` bash
java -jar dtdinst.jar [ścieżka_do_pliku.dtd]
```

### C-DTDINST-d. Przykłady użycia

1. **Konwersja pliku DTD na XML Schema (XSD):**

``` bash
java -jar dtdinst.jar schema.dtd
```

Wynikowa struktura XSD zostanie zapisana w tym samym katalogu, co plik DTD, z nazwą odpowiadającą plikowi DTD.
2. **Konwersja z określeniem katalogu wyjściowego:**
Możesz podać inny katalog wyjściowy za pomocą przekierowania:

``` bash
java -jar dtdinst.jar schema.dtd -d ./output
```

Schemat XSD zostanie zapisany w folderze `./output`.

### C-DTDINST-e. Wyniki

* Konwersja wygeneruje schemat XML Schema (`.xsd`) odpowiadający strukturze wejściowego pliku DTD.
* W przypadku błędów konwersji narzędzie wyświetli szczegółowy komunikat w terminalu.

### C-DTDINST-f. Wskazówki

* **Obsługa wielu plików:** Jeśli chcesz przetworzyć wiele plików `.dtd`, możesz skorzystać z pętli w terminalu (np. w bash):

``` bash
for file in *.dtd; do java -jar dtdinst.jar $file; done
```

* **Walidacja wyniku:** Po konwersji zaleca się użycie walidatora XML (np. `jing.jar`) do sprawdzenia poprawności wygenerowanego schematu XSD.

- - -

- - -

### C-TRANG. Instrukcja: `trang.jar`

#### C-TRANG-a. Opis

`trang.jar` to narzędzie służące do **konwersji między różnymi formatami schematów XML**, takimi jak RELAX NG, DTD i XSD. Pozwala na łatwe przekształcanie schematów między tymi formatami.

#### C-TRANG-b. Wymagania

1. **Java** – Zainstalowane środowisko JDK lub JRE.
2. **trang.jar** – Plik `trang.jar` musi być dostępny na Twoim dysku.
3. **Schemat źródłowy** – Plik `.rng`, `.rnc`, `.dtd` lub `.xsd`.
4. **Schemat docelowy** – Format, do którego chcesz przekonwertować schemat (np. `.rng`, `.xsd`).

#### C-TRANG-c. Podstawowe polecenie

``` bash
java -jar trang.jar [plik_wejściowy] [plik_wyjściowy]
```

#### C-TRANG-d. Przykłady użycia

1. **Konwersja RELAX NG (XML) na XSD:**

``` bash
java -jar trang.jar schema.rng schema.xsd
```

2. **Konwersja RELAX NG (Compact Syntax) na DTD:**

``` bash
java -jar trang.jar schema.rnc schema.dtd
```

3. **Konwersja XSD na RELAX NG (XML):**

``` bash
java -jar trang.jar schema.xsd schema.rng
```

4. **Konwersja DTD na RELAX NG (XML):**

``` bash
java -jar trang.jar schema.dtd schema.rng
```

#### C-TRANG-e. Obsługiwane formaty

* RELAX NG (XML i Compact Syntax)
* DTD
* XSD

#### C-TRANG-f. Wyniki

* Wygenerowany schemat zapisany w pliku wyjściowym, w wybranym formacie.
* W przypadku błędu w konwersji pojawia się komunikat o błędzie w terminalu.

- - -

- - -

### C-JING. Instrukcja: `jing.jar`

#### C-JING-a. Opis

`jing.jar` służy do **walidacji dokumentów XML** względem schematów RELAX NG w formacie XML i Compact Syntax. Pozwala na szybkie sprawdzenie, czy dokument XML jest zgodny ze schematem.

#### C-JING-b. Wymagania

1. **Java** – Zainstalowane środowisko JDK lub JRE.
2. **jing.jar** – Plik `jing.jar` musi być dostępny na Twoim dysku.
3. **Schemat RELAX NG** – Plik `.rng` lub `.rnc`.
4. **Dokument XML** – Plik `.xml`, który chcesz zweryfikować.

#### C-JING-c. Podstawowe polecenie

``` bash
java -jar jing.jar [ścieżka_do_schematu] [ścieżka_do_pliku_xml]
```

#### C-JING-d. Przykłady użycia

1. **Walidacja pliku XML z użyciem schematu RELAX NG (XML):**

``` bash
java -jar jing.jar schema.rng document.xml
```

Waliduje `document.xml` względem schematu `schema.rng`.
2. **Walidacja pliku XML z użyciem schematu RELAX NG (Compact Syntax):**

``` bash
java -jar jing.jar schema.rnc document.xml
```

#### C-JING-e. Wyniki

* Jeśli dokument XML jest poprawny względem schematu:

``` plaintext
(brak komunikatu) – plik jest poprawny
```

* Jeśli dokument XML zawiera błędy:

``` plaintext
Błąd: [opis błędu]
Linia: [numer_linii]
```

- - -

- - -

- - -

<br>
<br>
