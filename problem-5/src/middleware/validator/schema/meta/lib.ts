import Joi from "joi";

const createTextRule = (required = false, allowNull = false, defaultValue: string | undefined = undefined) => {
	let rule = Joi.string();
	if (required) rule = rule.required();
	if (allowNull) rule = rule.allow(null, "");
	if (defaultValue !== undefined) rule = rule.default(defaultValue);
	return rule;
};

const createNumberRule = (required = false, allowNull = false) => {
	let rule = Joi.number();
	if (required) rule = rule.required();
	if (allowNull) rule = rule.allow(null);
	return rule;
};

export const NullableTextRule = createTextRule(false, true);
export const RequiredTextRule = createTextRule(true);

export const RequiredNumberRule = createNumberRule(true);
export const NullableNumberRule = createNumberRule(false, true);

