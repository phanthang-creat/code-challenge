import { Schema } from "joi";

export const transformSchema = <T extends Record<string, Schema>>(validation: T, transformer: (rule: Schema) => Schema) =>
    Object.entries(validation).reduce(
        (acc, [key, value]) => ({
            ...acc,
            [key]: Array.isArray(value) ? value.map(transformer) : transformer(value),
        }),
        {} as T,
    );