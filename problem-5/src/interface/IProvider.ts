import type {
	Attributes,
	BindOrReplacements,
	CreationAttributes,
	FindAttributeOptions,
	GroupOption,
	IncludeOptions,
	Model,
	Order,
	Transaction,
	WhereOptions,
} from "sequelize";

export type BaseQueryOptions<ModelInterface extends Model> = {
	where: WhereOptions<ModelInterface> | undefined;
	include?: IncludeOptions[];
	attributes?: FindAttributeOptions;
};

export type PaginationOptions = {
	page?: number;
	pageSize?: number;
	sortField?: string;
	sortOrder?: string;
};

export type ExtraQueryOptions = {
	order?: Order;
	raw?: boolean;
	nest?: boolean;
	distinct?: boolean;
	subQuery?: boolean;
	group?: GroupOption;
	replacements?: BindOrReplacements;
	col?: string; // Use for count
	where?: WhereOptions;
};

// Options
export type FindManyOptions<ModelInterface extends Model> = BaseQueryOptions<ModelInterface> &
	PaginationOptions &
	ExtraQueryOptions;

export type FindByIdOptions<ModelInterface extends Model> = { id: string } & Omit<BaseQueryOptions<ModelInterface>, "where"> & ExtraQueryOptions;

export type FindOneOptions<ModelInterface extends Model> = BaseQueryOptions<ModelInterface> &
	Omit<ExtraQueryOptions, "distinct"> & { order?: Order };

export type FindOrCreateOptions<ModelInterface extends Model> = {
	where: WhereOptions<Attributes<ModelInterface>> | undefined;
	body: CreationAttributes<ModelInterface>;
	transaction?: Transaction;
};

// Return
export type FindManyReturnModel<ModelInterface extends Model> = {
	count: number;
	rows: ModelInterface[];
	page?: number;
	pageSize?: number;
};

export type CheckUniqueOptions<ModelInterface extends Model> = {
	where?: WhereOptions<Attributes<ModelInterface>>;
	attributes?: string[];
	currentData?: ModelInterface;
	additionalWhere?: {
		ignoreAttributes?: string[]; // Use for checking unique without 'where'
	};
};
