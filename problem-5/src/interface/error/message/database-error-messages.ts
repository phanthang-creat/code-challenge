import { ForeignKeyConstraintError, UniqueConstraintError } from "sequelize";
import ValidationError from "sequelize/lib/errors/validation-error";
import { DatabaseErrorAdditionalData } from "../handler/database-error-handler";

export const dataErrorMessagesHandler = (error: any, additionalData?: DatabaseErrorAdditionalData) => {
	if (error instanceof ValidationError) {
		if (error instanceof UniqueConstraintError) {
			console.log("🚀 ~ dataErrorMessagesHandler ~ additionalData:", additionalData);
			if (additionalData?.formFields && additionalData?.errorFields) {
				const fieldName = additionalData.errorFields?.map((key) => {
					return additionalData?.formFields?.find((field) => field.code.toUpperCase() === key.toUpperCase())?.name;
				});
				return {
					en: `${fieldName.length > 1 ? "Fields" : "Field"} ${fieldName.map((name) => name["en"]).join(", ")} already exists`,
					vi: `${fieldName.map((name) => name["vi"]).join(", ")} đã tồn tại`,
				};
			}
			if (additionalData?.errorFields) {
				return {
					en: `Field ${additionalData.errorFields.join(", ")} already exists`,
					vi: `Trường ${additionalData.errorFields.join(", ")} đã tồn tại`,
				};
			}

			return {
				en: "Unique constraint error",
				vi: "Lỗi ràng buộc duy nhất",
			};
		}

		return {
			en: "Database validation error",
			vi: "Lỗi kiểm tra cơ sở dữ liệu",
		};
	}

	if (error instanceof ForeignKeyConstraintError) {
		if (additionalData?.formFields && additionalData?.errorFields) {
			const fieldName = additionalData.errorFields.map((key) => {
				return additionalData.formFields.find((field) => field.code.toUpperCase() === key.toUpperCase())?.name;
			});
			return {
				en: `Foreign key constraint error on ${fieldName.length > 1 ? "fields" : "field"} ${fieldName.map((name) => name["en"]).join(", ")}`,
				vi: `Lỗi ràng buộc khóa ngoại trên ${fieldName.map((name) => name["vi"]).join(", ")}`,
			};
		} else if (additionalData?.errorFields) {
			return {
				en: `Foreign key constraint error on ${additionalData.errorFields.length > 1 ? "fields" : "field"} ${additionalData.errorFields.join(", ")}`,
				vi: `Lỗi ràng buộc khóa ngoại trên trường ${additionalData.errorFields.join(", ")}`,
			};
		} else {
			return {
				en: "Foreign key constraint error",
				vi: "Lỗi ràng buộc khóa ngoại",
			};
		}
	}

	return {
		en: "Database error",
		vi: "Lỗi cơ sở dữ liệu",
	};
};
