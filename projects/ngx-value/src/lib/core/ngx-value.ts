class NgxValue {

    public static defaultPath: string;

    static Value(property: string, data?: string) {
        return (target: any, key: string | symbol) => {

            let val = undefined;

            const getter = () => {
                if (val === undefined)
                    val = JSONLoader.getInstance().get(property, data) !== undefined ? JSONLoader.getInstance().get(property, data) : null;
                return val;
            };

            const setter = (next) => {
                let value = JSONLoader.getInstance().get(property, data) !== undefined ? JSONLoader.getInstance().get(property, data) : next;
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

    static Values(...data: string[]) {
        return new Promise((resolve, reject) => {
            let promises = [];
            if (data != null && data.length > 0) {
                NgxValue.defaultPath = NgxValue.defaultPath != null ? NgxValue.defaultPath : data[0];

                data.forEach(result => {
                    promises.push(JSONLoader.getInstance().loadJSON(result));
                });
            }

            Promise.all(promises).then(x => {
                resolve(x);
            }).catch(x => {
                reject(x);
            });
        });
    }

    static Get(property: string, data?: string) {
        return JSONLoader.getInstance().get(property, data) !== undefined ? JSONLoader.getInstance().get(property, data) : null;
    }
}

export function Value(property: string, data?: string) {
    return NgxValue.Value(property, data);
}

export function Values(...data: string[]) {
    return NgxValue.Values(...data);
}

export function Get(property: string, data?: string) {
    return NgxValue.Get(property, data);
}

class JSONLoader {

    private static instance: JSONLoader;
    public promises: { [data: string]: Promise<any>; } = {};
    public json: { [data: string]: string } = {};

    private constructor() { }

    public get(key: string, data?: string) {
        data = data || NgxValue.defaultPath || 'assets/properties.json';

        if (JSONLoader.getInstance().json[data] == null) {
            console.error(`No data was found for @Value("${key}", "${data}").`);
            return;
        }

        if (key === null && JSONLoader.getInstance().json[data] != null && Array.isArray(JSONLoader.getInstance().json[data])) {
            return JSONLoader.getInstance().json[data];
        } else if (key === null) {
            console.error(`No array was found on "${data}".`);
        } else if (JSONLoader.getInstance().json[data] != null && JSONLoader.getInstance().json[data][key] !== undefined) {
            return JSONLoader.getInstance().json[data][key];
        } else {
            console.error(`Property "${key}" not found on "${data}".`);
        }
    }

    public loadJSON(data: string) {
        return new Promise((resolve, reject) => {
            data = data || NgxValue.defaultPath || 'assets/properties.json';

            if (JSONLoader.getInstance().promises[data] != undefined) {
                return JSONLoader.getInstance().promises[data].then((value) => {
                    resolve(value);
                }).catch((reason) => {
                    reject(reason);
                });
            }
            else {
                let xhr = new XMLHttpRequest();
                xhr.overrideMimeType("application/json");
                xhr.open('GET', data, true);
                xhr.onload = function () {
                    if (xhr.readyState == 4 && xhr.status == 200) {
                        try {
                            JSONLoader.getInstance().json[data] = JSON.parse(xhr.responseText);
                            resolve(JSONLoader.getInstance().json[data]);
                        } catch (e) {
                            console.error(`Failed to parse JSON data! Please verify "${data}".`);
                            resolve({});
                        }
                    }
                    else {
                        console.error(`data not found! ("${data}")`);
                        resolve({});
                    }
                };
                xhr.onerror = () => {
                    console.error(`Failed to load "${data}"`);
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

