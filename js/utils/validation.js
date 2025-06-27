export function isRequired(value) {
    return value.trim() !== '';
}

export function isNumber(value) {
    return !isNaN(value) && Number(value) > 0;
}
