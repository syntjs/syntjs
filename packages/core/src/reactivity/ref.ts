// Простейший ref - никаких подписок!
export function ref<T>(value: T) {
    let _value = value;

    return {
        get value(): T {
            return _value;
        },
        set value(newValue: T) {
            _value = newValue;
        }
    };
}

export function isRef(value: any): boolean {
    return value && typeof value === 'object' && 'value' in value;
}