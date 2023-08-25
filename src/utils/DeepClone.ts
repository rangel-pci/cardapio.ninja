const DeepClone = (obj: [] | {}) => {
    return JSON.parse(JSON.stringify(obj));
}

export { 
    DeepClone
}