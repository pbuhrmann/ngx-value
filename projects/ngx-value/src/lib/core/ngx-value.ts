class NgxValue {

    public static defaultPath: string;
    public static paths: { [name: string]: string } = {};

    static Value(property: string, path?: string) { // Decorator factory
        return (target: any, key: string | symbol) => {

            let className = target.constructor.name;
            let val = undefined;

            const getter = () => {
                if (val === undefined)
                    val = JSONLoader.getInstance().get(property, path, className) !== undefined ? JSONLoader.getInstance().get(property, path, className) : null;
                return val;
            };

            const setter = (next) => {
                let value = JSONLoader.getInstance().get(property, path, className) !== undefined ? JSONLoader.getInstance().get(property, path, className) : next;
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

    static Values(...path: string[]) {
        return new Promise((resolve, reject) => {
            let promises = [];
            if (path != null && path.length > 0) {
                NgxValue.defaultPath = NgxValue.defaultPath != null ? NgxValue.defaultPath : path[0];

                path.forEach(result => {
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

    static Get(property: string, path?: string) {
        return JSONLoader.getInstance().get(property, path) !== undefined ? JSONLoader.getInstance().get(property, path) : null;
    }

    static Path(path: string) {
        return (constructor: Function) => {
            let obj = Object.create(constructor);
            console.log(obj.name);
            console.log(path);
            NgxValue.paths[obj.name] = path;
        }
    }
}

export function Value(property: string, path?: string) {
    return NgxValue.Value(property, path);
}

export function Values(...path: string[]) {
    return NgxValue.Values(...path);
}

export function Get(property: string, path?: string) {
    return NgxValue.Get(property, path);
}

export function Path(path: string) {
    return NgxValue.Path(path);
}

class JSONLoader {

    private static instance: JSONLoader;
    private promises: { [path: string]: Promise<any>; } = {};
    private json: { [path: string]: string } = {};

    private constructor() { }

    public get(key: string, path?: string, className?: string) {
        path = path || NgxValue.paths[className] || NgxValue.defaultPath || 'assets/properties.json';

        if (JSONLoader.getInstance().json[path] == null) {
            console.error(`No path was found for @Value("${key}", "${path}").`);
            return;
        }

        if (key === null && JSONLoader.getInstance().json[path] != null && Array.isArray(JSONLoader.getInstance().json[path])) {
            return JSONLoader.getInstance().json[path];
        } else if (key === null) {
            console.error(`No array was found on "${path}".`);
        } else if (JSONLoader.getInstance().json[path] != null && JSONLoader.getInstance().json[path][key] !== undefined) {
            return JSONLoader.getInstance().json[path][key];
        } else {
            console.error(`Property "${key}" not found on "${path}".`);
        }
    }

    public loadJSON(path: string) {
        return new Promise((resolve, reject) => {
            path = path || NgxValue.defaultPath || 'assets/properties.json';

            if (JSONLoader.getInstance().promises[path] != undefined) {
                return JSONLoader.getInstance().promises[path].then((value) => {
                    resolve(value);
                }).catch((reason) => {
                    reject(reason);
                });
            }
            else {
                let xhr = new XMLHttpRequest();
                xhr.overrideMimeType("application/json");
                xhr.open('GET', path, true);
                xhr.onload = function () {
                    if (xhr.readyState == 4 && xhr.status == 200) {
                        try {
                            JSONLoader.getInstance().json[path] = JSON.parse(xhr.responseText);
                            resolve(JSONLoader.getInstance().json[path]);
                        } catch (e) {
                            console.error(`Failed to parse JSON path! Please verify "${path}".`);
                            resolve({});
                        }
                    }
                    else {
                        console.error(`path not found! ("${path}")`);
                        resolve({});
                    }
                };
                xhr.onerror = () => {
                    console.error(`Failed to load "${path}"`);
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

