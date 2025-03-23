import { Context } from "joi";

export const joiMessages = (label: string, type: string, opts?: Context) => {
	// return {
	//   "string.email": {
	//     vi: `${label} không hợp lệ`,
	//     en: `${label} is invalid`,
	//   },
	// //   "string.base": `${req.t("string." + label)} ${req.t("joi.string.base")}`,
	// //   "string.min": `${req.t("string." + label)} ${req.t("joi.string.min")}`,
	// //   "string.max": `${req.t("string." + label)} ${req.t("joi.string.max")}`,
	// //   "string.length": `${req.t("string." + label)} ${req.t("joi.string.length")}`,
	// //   "string.alphanum": `${req.t("string." + label)} ${req.t(
	// //     "joi.string.alphanum"
	// //   )}`,
	// //   "string.pattern": `${req.t("string." + label)} ${req.t(
	// //     "joi.string.pattern"
	// //   )}`,
	//   "any.required": {
	//     vi: `${label} không được để trống`,
	//     en: `${label} is required`,
	//   }
	// //   "any.only": `${req.t("string." + label)} ${req.t("joi.any.only")}`,
	// //   "string.empty": `${req.t("string." + label)} ${req.t("joi.string.empty")}`,
	// //   "string.pattern.base": `${req.t("string." + label)} ${req.t(
	// //     "joi.string.pattern.base"
	// //   )}`,
	// //   "number.base": `${req.t("string." + label)} ${req.t("joi.number.base")}`,
	// //   "number.min": `${req.t("string." + label)} ${req.t("joi.number.min")}`,
	// //   "number.max": `${req.t("string." + label)} ${req.t("joi.number.max")}`,
	// //   "array.base": `${req.t("string." + label)} ${req.t("joi.array.base")}`,
	// //   "array.min": `${req.t("string." + label)} ${req.t("joi.array.min")}`,
	// //   "array.max": `${req.t("string." + label)} ${req.t("joi.array.max")}`,
	// //   "boolean.base": `${req.t("string." + label)} ${req.t("joi.boolean.base")}`,
	// //   "date.base": `${req.t("string." + label)} ${req.t("joi.date.base")}`,
	// //   "date.format": `${req.t("string." + label)} ${req.t("joi.date.format")}`,
	// //   "date.min": `${req.t("string." + label)} ${req.t("joi.date.min")}`,
	// //   "date.max": `${req.t("string." + label)} ${req.t("joi.date.max")}`,
	// //   "object.base": `${req.t("string." + label)} ${req.t("joi.object.base")}`,
	// //   "object.unknown": `${req.t("string." + label)} ${req.t(
	// //     "joi.object.unknown"
	// //   )}`,
	// //   "object.missing": `${req.t("string." + label)} ${req.t(
	// //     "joi.object.missing"
	// //   )}`,
	// // };
	// }

	switch (type) {
		case "string.email":
			return {
				vi: `${label} không hợp lệ`,
				en: `${label} is invalid`,
			};

		case "any.required":
			return {
				vi: `${label} không được để trống`,
				en: `${label} is required`,
			};

		case "string.pattern.base":
			return {
				vi: `${label} không đúng định dạng`,
				en: `${label} is invalid`,
			};

		case "string.isoDate":
			return {
				vi: `${label} không đúng định dạng ngày tháng`,
				en: `${label} is invalid date format`,
			};

		case "string.max":
			return {
				vi: `${label} không được dài quá ${opts?.['limit']} ký tự`,
				en: `${label} length must be less than or equal to ${opts?.['limit']} characters long`,
			};

		case "string.min":
			return {
				vi: `${label} không được ngắn hơn ${opts?.['limit']} ký tự`,
				en: `${label} length must be at least ${opts?.['limit']} characters long`,
			};

		case "string.length":
			return {
				vi: `${label} phải có độ dài ${opts?.['limit']} ký tự`,
				en: `${label} must be ${opts?.['limit']} characters long`,
			};

		case "object.unknown":
			return {
				vi: `${label} không được phép`,
				en: `${label} is not allowed`,
			};

		default:
			return {
				vi: `${label} không hợp lệ`,
				en: `${label} is invalid`,
			};
	}
};
