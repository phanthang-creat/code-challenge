import {
	FindAttributeOptions,
	GroupOption,
	IncludeOptions,
	Model,
	ModelStatic,
	Op,
	Order,
	WhereOptions,
} from "sequelize";
import { Operators } from "./query";

export interface SequelizeApiPaginatePayload<T extends Model> {
	attributes?: FindAttributeOptions;
	pageSize?: number;
	page?: number;
	sortField?: string;
	sortOrder?: string;
	where?: { [Op.and]: WhereOptions<T>[] };
	rawFilter?: string;
	dateField?: Array<{ opType: string; indexOp: number }>;
	order?: Order;
	group?: GroupOption;
}

export interface QueryOptions<T extends Model> {
	model: ModelStatic<T>;
	payload?: SequelizeApiPaginatePayload<T>;
	includeModels?: IncludeOptions[];
	isHierarchy?: boolean;
	raw?: boolean;
	nest?: boolean;
	distinct?: boolean;
	subQuery?: boolean;
    group?: GroupOption;
}

export type QuerySpecialField<T> = [string, (right_operand: string, operator: Operators | "") => WhereOptions<T>];
