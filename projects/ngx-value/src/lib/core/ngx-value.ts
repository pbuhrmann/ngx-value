export function Value(property: string, file?: string) {
    return function (target: any, key: string | symbol) {

        let val = undefined;

        const getter = () => {
            if (val === undefined)
                val = JSONLoader.getInstance().get(property, file) !== undefined ? JSONLoader.getInstance().get(property, file) : null;
            return val;
        };

        const setter = (next) => {
            let value = JSONLoader.getInstance().get(property, file) !== undefined ? JSONLoader.getInstance().get(property, file) : next;
            val = value;
        };

        Object.defineProperty(target, key, {
            get: getter,
            set: setter,
            enumerable: true,
            configurable: true
        });
    };
}

export function Values(...configFiles: string[]) {
    return () => {
        return () => {
            return new Promise((resolve, reject) => {
                let promises = [];
                configFiles.forEach(configFile => {
                    promises.push(JSONLoader.getInstance().loadJSON(configFile));
                });
                Promise.all(promises).then(x => {
                    resolve(x);
                }).catch(x => {
                    reject(x);
                });
            });
        }
    }
}

export function Get(property: string, file?: string) {
    return JSONLoader.getInstance().get(property, file) !== undefined ? JSONLoader.getInstance().get(property, file) : null;
}

class JSONLoader {

    private static instance: JSONLoader;
    public promises: { [file: string]: Promise<any>; } = {};
    public json: { [file: string]: string } = {};

    private constructor() { }

    public get(key: string, file?: string) {
        file = file != null ? file : 'assets/properties.json';

        if (JSONLoader.getInstance().json[file] == null) {
            console.error(`No file was found for @Value("${key}", "${file}").`);
            return;
        }

        if (key === null && JSONLoader.getInstance().json[file] != null && Array.isArray(JSONLoader.getInstance().json[file])) {
            return JSONLoader.getInstance().json[file];
        } else if (key === null) {
            console.error(`No array was found on "${file}".`);
        } else if (JSONLoader.getInstance().json[file] != null && JSONLoader.getInstance().json[file][key] !== undefined) {
            return JSONLoader.getInstance().json[file][key];
        } else {
            console.error(`Property "${key}" not found on "${file}".`);
        }
    }

    public loadJSON(file: string) {
        return new Promise((resolve, reject) => {
            file = file != null ? file : 'assets/properties.json';

            if (JSONLoader.getInstance().promises[file] != undefined) {
                return JSONLoader.getInstance().promises[file].then((value) => {
                    resolve(value);
                }).catch((reason) => {
                    reject(reason);
                });
            }
            else {
                let xhr = new XMLHttpRequest();
                xhr.overrideMimeType("application/json");
                xhr.open('GET', file, true);
                xhr.onload = function () {
                    if (xhr.readyState == 4 && xhr.status == 200) {
                        try {
                            JSONLoader.getInstance().json[file] = JSON.parse(xhr.responseText);
                            resolve(JSONLoader.getInstance().json[file]);
                        } catch (e) {
                            console.error(`Failed to parse JSON file! Please verify "${file}".`);
                            resolve({});
                        }
                    }
                    else {
                        console.error(`File not found! ("${file}")`);
                        resolve({});
                    }
                };
                xhr.onerror = () => {
                    console.error(`Failed to load "${file}"`);
                    resolve({});
                }
                xhr.onabort = xhr.onerror;
                xhr.send(null);
            }
        });
    }

    static getInstance(): JSONLoader {
        if (!JSONLoader.instance) {
            JSONLoader.instance = new JSONLoader();
        }

        return JSONLoader.instance;
    }

}

