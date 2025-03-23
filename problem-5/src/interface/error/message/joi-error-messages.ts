import { Context } from "joi";

export const joiMessages = (label: string, type: string, opts?: Context) => {
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
