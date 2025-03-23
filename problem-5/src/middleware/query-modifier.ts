import { Model, Op, WhereOptions } from "sequelize";
import { Response, NextFunction } from "express";
import { Req } from "@interface/IApi";
import { generateCondition, generateConditionExtra } from "@repository/database/query";
import { QuerySpecialField, SequelizeApiPaginatePayload } from "@repository/database/type";
export default queryModifier;

export function queryModifier<T extends Model>(opts?: QueryModifierOptions<T>) {
	return (req: Req<T>, _res: Response, next: NextFunction) => {
		const payload: SequelizeApiPaginatePayload<T> = {
			pageSize: parseInt(req.query['pageSize']?.toString() ?? "-1"),
			page: parseInt(req.query['page']?.toString() ?? "-1"),
			sortField: req.query['sortField']?.toString(),
			sortOrder: req.query['sortOrder']?.toString().toUpperCase() === "DESC" ? "DESC" : "ASC",
			rawFilter: req.query['filters']?.toString() ?? "",
			dateField: [],
		};

		const arrFilters = payload.rawFilter?.split(",") ?? [];
		payload.where = {
			[Op.and]: [...(req.payload?.where?.[Op.and] ?? []), ...arrFilters.map(transformFilter)].filter(Boolean) as WhereOptions<T>[],
		};

		if (payload.page && payload.page < 0) payload.page = 1;
		if (payload.pageSize && payload.pageSize <= 0) payload.pageSize = 10;
		// if (!payload.sortField) payload.sortField = undefined;
		// if (!payload.sortOrder) payload.sortOrder = undefined;

		req.payload = payload;
		next();
	};

	function transformFilter(element: string) {
		if (opts?.ignoreFields?.includes(element)) return null;
		if (!element.includes("|")) return generateCondition(element, opts?.specialFields);
		const objCondition = generateConditionExtra(element, opts?.specialFields);
		if (!objCondition) return null;
		return { [Op.or]: objCondition };
	}
}

type QueryModifierOptions<T> = {
	specialFields?: QuerySpecialField<T>[];
	ignoreFields?: string[];
};
