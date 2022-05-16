# multiple-csv-merge-to-json

This library reads a given list of CSV files and stores the compilation of data in a JSON file.
The files are merged following a key, which can be one or several columns.
Files should be given in order of retention data. If key was already in previous file, data is merged and replaced by lastest data only once. If key is found several times, a new line is added, merged with previous data.

## How to use

### Get data in Json

## Example

### Three CSV files as input

File 1
|city |region |deliverySchedule |rate|deliveryInstruction |
|-------------|------------|-----------------------|----|---------------------|
|AHUACHAPAN |AHUACHAPAN |LUNES-MIERCOLES-VIERNES|3 |Contacto por telefono|
|APOPA |SAN SALVADOR|DE LUNES A SABADO |3 | |
|AYUTUXTEPEQUE|SAN SALVADOR|DE LUNES A SABADO |3 | |
|MEJICANOS |SAN SALVADOR|DE LUNES A SABADO |3 | |
|SAN SALVADOR |SAN SALVADOR|DE LUNES A SABADO |3 | |

File 2
|city |region |deliverySchedule |rate|
|-------------|------------|-----------------------|----|
|Apopa |San Salvador|Lunes a Sabado |4 |
|Ayutuxtepeque|San Salvador|Lunes a Sabado |4 |
|San Salvador |San Salvador|Lunes a Sabado |4 |

File 3

| locality        | city          | region       | risk         | deliveryInstruction | deliverySchedule        | rate |
| --------------- | ------------- | ------------ | ------------ | ------------------- | ----------------------- | ---- |
| Madre Selva     | Apopa         | San Salvador | Delincuencia | PUNTO DE ENCUENTRO  | DE LUNES A SABADO       | 4    |
| Popotlan        | Apopa         | San Salvador | Delincuencia | PUNTO DE ENCUENTRO  | DE LUNES A SABADO       | 4    |
| EL TIGRE        | AHUACHAPAN    | AHUACHAPAN   | Delincuencia | PUNTO DE ENCUENTRO  | LUNES-MIERCOLES-VIERNES | 3    |
| CTON EL ROSARIO | AHUACHAPAN    | AHUACHAPAN   | Delincuencia | PUNTO DE ENCUENTRO  | LUNES-MIERCOLES-VIERNES | 3    |
|                 | Ayutuxtepeque | San Salvador |              |                     | Lunes a Sabado          | 4    |
|                 | San Salvador  | San Salvador |              |                     | Lunes a Sabado          | 4    |

Expected MERGED file :
| locality | city | region | risk | deliveryInstruction |
| --------------- | ---------- | ------------ | ------------ | ------------------- |
| Madre Selva | Apopa | San Salvador | Delincuencia | PUNTO DE ENCUENTRO |
| Popotlan | Apopa | San Salvador | Delincuencia | PUNTO DE ENCUENTRO |
| EL TIGRE | AHUACHAPAN | AHUACHAPAN | Delincuencia | PUNTO DE ENCUENTRO |
| CTON EL ROSARIO | AHUACHAPAN | AHUACHAPAN | Delincuencia | PUNTO DE ENCUENTRO |

### Output json
