// Функция concatenate - склеивает массив строк с разделителем
export function concatenate(strings, separator) {
    if (!Array.isArray(strings) || strings.length === 0) {
        return '';
    }

    let result = '';
    for (let i = 0; i < strings.length; i++) {
        result += strings[i];
        if (i < strings.length - 1) {
            result += separator;
        }
    }
    return result.charAt(0).toUpperCase() + result.slice(1);
}

export function getCatFullName(catNames, separator) {
    return concatenate(catNames, separator);
}


// Функция erase - очищает массив от ложных значений
export function erase(arr) {
    if (!Array.isArray(arr)) return [];

    const result = [];
    for (let i = 0; i < arr.length; i++) {
        if (arr[i] !== false &&
            arr[i] !== undefined &&
            arr[i] !== '' &&
            arr[i] !== 0 &&
            arr[i] !== null) {
            result.push(arr[i]);
        }
    }
    return result;
}

export function getValidCatAges(ages) {
    return erase(ages);
}


// Функция sumUnique - возвращает сумму всех уникальных элементов массива
export function sumUnique(arr) {
    if (!Array.isArray(arr) || arr.length === 0) return 0;
    const countMap = {};

    for (let i = 0; i < arr.length; i++) {
        const num = arr[i];
        if (countMap[num] === undefined) {
            countMap[num] = 1;
        } else {
            countMap[num]++;
        }
    }

    let sum = 0;
    for (let key in countMap) {
        if (countMap[key] === 1) {
            sum += Number(key);
        }
    }

    return sum;
}

export function getUniqueChipSum(chipNumbers) {
    return sumUnique(chipNumbers);
}


// Функция merge - объединяет несколько объектов с приоритетом первого вхождения
export function merge(...objects) {
    if (objects.length === 0) return {};

    const result = {};

    let i = 0;
    while (i < objects.length) {
        const obj = objects[i];
        for (let key in obj) {
            if (result[key] === undefined) {
                result[key] = obj[key];
            }
        }
        i++;
    }
    return result;
}

export function getCatProfile(...catDataObjects) {
    return merge(...catDataObjects);
}


export function findFirstActiveCat(cats) {

    if (!cats || cats.length === 0) return null;

    let index = 0;
    let foundCat = null;

    do {
        const cat = cats[index];
        if (cat && cat.isAvailable !== false) {
            foundCat = cat;
            break;
        }
        index++;
    } while (index < cats.length);

    return foundCat;
}

export function getAvailableCatAfterTime(cats, currentHour) {

    let availableCat = null;
    let attempts = 0;
    do {
        const randomIndex = Math.floor(Math.random() * cats.length);
        if (cats[randomIndex] && cats[randomIndex].isAvailable !== false) {
            availableCat = cats[randomIndex];
            break;
        }
        attempts++;
    } while (attempts < cats.length);

    return availableCat;
}
