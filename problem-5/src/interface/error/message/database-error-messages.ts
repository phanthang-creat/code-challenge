import { ForeignKeyConstraintError, UniqueConstraintError } from "sequelize";
import ValidationError from "sequelize/lib/errors/validation-error";
import { DatabaseErrorAdditionalData } from "../handler/database-error-handler";

export const dataErrorMessagesHandler = (error: unknown, additionalData?: DatabaseErrorAdditionalData) => {
	if (error instanceof ValidationError) {
		if (error instanceof UniqueConstraintError) {
			console.log("🚀 ~ dataErrorMessagesHandler ~ additionalData:", additionalData);
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
		if (additionalData?.errorFields) {
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
