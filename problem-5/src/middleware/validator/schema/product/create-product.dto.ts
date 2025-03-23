import Joi from "joi";
import { NullableTextRule, RequiredNumberRule, RequiredTextRule } from "../meta/lib";

const createProductSchema = {
    name: RequiredTextRule,
    code: RequiredTextRule,
    price: RequiredNumberRule,
    quantity: RequiredNumberRule,
    avatar: NullableTextRule,
    description: NullableTextRule,
};

export default Joi.object(createProductSchema);