export function validImage(url: string, timeoutT?: number) {
    return new Promise(function (resolve, reject) {
        const timeout = timeoutT || 5000;
        let timer: any = 0;
        const img = new Image();
        img.onerror = img.onabort = function () {
            clearTimeout(timer);
            reject(false);
        };
        img.onload = function () {
            clearTimeout(timer);
            resolve(true);
        };
        timer = setTimeout(function () {
            img.src = '//!!!!/test.jpg';
            reject(false);
        }, timeout);
        img.src = url;
    });
}
