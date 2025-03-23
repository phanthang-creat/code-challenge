/* eslint-disable @typescript-eslint/no-explicit-any */
import type {
    FindByIdOptions,
    FindManyOptions,
    FindManyReturnModel,
    FindOneOptions,
    FindOrCreateOptions
} from "@interface/IProvider";
import {
    Attributes,
    BulkCreateOptions,
    CreationAttributes,
    FindAndCountOptions,
    Includeable,
    Model,
    ModelStatic,
    Op,
    Transaction,
    Transactionable,
    WhereOptions
} from "sequelize";
import { v7 } from "uuid";

export { BaseProvider };
export default class BaseProvider<ModelInterface extends Model> {
	private db: any;
	protected key: string;
	protected model: ModelStatic<ModelInterface>;
	uniqueFields: string[] = [];

	constructor(key: string, initdb: any) {
		this.key = key;
		this.db = initdb;
		this.model = this.db && this.db[this.key];
	}

	public transformQueryOptions(opts?: FindManyOptions<ModelInterface>) {
		const { page = 1, pageSize, sortField, sortOrder, order, ...baseQuery } = opts || {};
		const payload: FindAndCountOptions = { 
			...baseQuery,
			where: 'where' in baseQuery ? (baseQuery.where === null ? undefined : baseQuery.where) : undefined
		};
		if (order) payload.order = order;
		if (sortField && sortOrder) payload.order = [[sortField, sortOrder]];
		if (pageSize && pageSize > 0) {
			payload.limit = page == 0 ? undefined : pageSize;
			payload.offset = page == 0 ? undefined : (page - 1) * pageSize || 0;
		}
		return payload;
	}

	public async count(opts: Omit<FindManyOptions<ModelInterface>, "attributes">) {
		return this.model.count(opts);
	}

	// UPDATE 20/11/2024: Remove findAndCountAll as it's counting all raw queries
	public async getAll(opts?: FindManyOptions<ModelInterface>): Promise<FindManyReturnModel<ModelInterface>> {
		const { include, attributes, subQuery, ...countOptions } = this.transformQueryOptions(opts);
		const { page, pageSize } = opts || {};
		const [count, rows] = await Promise.all([
			this.model.count(subQuery ? countOptions : { include, ...countOptions }),
			this.model.findAll({ include, attributes, subQuery, ...countOptions }),
		]);

		return { count, rows, page, pageSize: page == 0 ? count : pageSize };
	}

	public async getAndCountAll(opts: FindManyOptions<ModelInterface>) {
		const { include, attributes, ...countOptions } = this.transformQueryOptions(opts);
		const stripIncludeAttributes = (includes: any[] | Includeable | undefined): Includeable[] => {
			if (!includes || !Array.isArray(includes) || includes.length === 0) return [];
			return includes.map((include) => ({
				...include,
				attributes: [],
				include: stripIncludeAttributes(include.include),
			}));
		};
		const primaryKey = this.model.primaryKeyAttributes || [this.model.primaryKeyAttribute] || ["id"];
		const getIdsOptions = {
			...countOptions,
			attributes: [...primaryKey],
			distinct: true,
			include: stripIncludeAttributes(include),
			subQuery: false,
			group: primaryKey.map((key) => this.model.name + "." + key),
		};
		const [count, ids] = await Promise.all([
			this.model.count({
				...countOptions,
				distinct: true,
				include: stripIncludeAttributes(include),
			}),
			this.model.findAll(getIdsOptions),
		]);
		if (count === 0) return { count, rows: [], page: opts.page, pageSize: opts.pageSize };
		const where = (
			primaryKey.length > 1
				? {
						[Op.or]: ids.map((id) => {
							const where = primaryKey.reduce<WhereOptions<Attributes<ModelInterface>> & { [Op.and]: any[] }>((where, key) => {
								where[Op.and].push({ [key]: id.getDataValue(key) });
								return where;
							}, { [Op.and]: [] });

							return where;
						}),
					}
				: {
						[Op.and]: [
							{
								[primaryKey[0]]: {
									[Op.in]: ids.map((id) => id.getDataValue(primaryKey[0])),
								},
							},
						],
					}
		) as WhereOptions<Attributes<ModelInterface>>;
		const rows = await this.model.findAll({
			include,
			attributes,
			subQuery: false,
			where: where,
			raw: false,
			order: countOptions.order,
		});

		return { count, rows, page: opts.page, pageSize: opts.pageSize };
	}

	/**
	 *
	 * @param opts
	 * @returns
	 * @description
	 * This function is used to get all data with pagination and count all data
	 * Support for sorting with nested fields
	 */
	public async getAndCountAllPaginated(opts: FindManyOptions<ModelInterface>) {
		const { include, attributes, order, where, ...countOptions } = this.transformQueryOptions(opts);
		const stripIncludeAttributes = (includes: any[] | Includeable | undefined): Includeable[] => {
			if (!includes || !Array.isArray(includes) || includes.length === 0) return [];
			return includes.map((include) => ({
				...include,
				attributes: [],
				include: stripIncludeAttributes(include.include),
			}));
		};
		const primaryKey = this.model.primaryKeyAttributes || [this.model.primaryKeyAttribute] || ["id"];
		const stripedInclude = stripIncludeAttributes(include);
		const getIdsOptions = {
			...countOptions,
			where,
			order,
			attributes: [...primaryKey],
			distinct: true,
			include: stripedInclude,
			subQuery: false,
            group: primaryKey.map((key) => this.model.name + "." + key),
		};
		const [count, ids] = await Promise.all([
			this.model.count({
				...countOptions,
				where,
				distinct: true,
				include: stripedInclude,
			}),
			this.model.findAll(getIdsOptions),
		]);
		if (count === 0) return { count, rows: [], page: opts.page, pageSize: opts.pageSize };

		const whereIds = getWhereIds();
		const rows = await this.model.findAll({
			include,
			attributes,
			subQuery: false,
			where: whereIds,
			raw: false,
			order,
		});
		return { count, rows, page: opts.page, pageSize: opts.pageSize };

		function getWhereIds(): WhereOptions {
			if (primaryKey.length <= 1)
				return { [Op.and]: [{ [primaryKey[0]]: { [Op.in]: ids.map((id) => id.getDataValue(primaryKey[0])) } }] };

			return {
				[Op.or]: ids.map((id) => {
                    const where = primaryKey.reduce<WhereOptions<Attributes<ModelInterface>> & { [Op.and]: any[] }>((where, key) => {
                        where[Op.and].push({ [key]: id.getDataValue(key) });
                        return where;
                    }, { [Op.and]: [] });

                    return where;
                }),
			};
		}
	}

	public async getMany(opts: FindManyOptions<ModelInterface>): Promise<ModelInterface[]> {
		const { include, attributes, subQuery, ...countOptions } = this.transformQueryOptions(opts);
		return await this.model.findAll({ include, attributes, subQuery, ...countOptions });
	}

	async getById(opts: FindByIdOptions<Model>): Promise<ModelInterface | null> {
		const { id, attributes = Object.keys(this.model.getAttributes()), include = [], ...extra } = opts;
		return await this.model.findByPk(id, {
			include,
			attributes,
			...extra,
		});
	}

	async getOne(opts: FindOneOptions<ModelInterface>): Promise<ModelInterface | null> {
		const {
			where,
			attributes = Object.keys(this.model.getAttributes()),
			include = [],
			raw = false,
			nest = false,
			order,
			subQuery,
		} = opts;

		return await this.model.findOne({
			where,
			include,
			attributes,
			raw,
			nest,
			order,
			subQuery,
		});
	}

	async getOneOrCreate({ where, body, transaction }: FindOrCreateOptions<ModelInterface>) {
		return await this.model.findOrCreate({ where, order: [["created_at", "DESC"]], defaults: body, transaction });
	}

	async post(
		body: CreationAttributes<ModelInterface>,
		options?: BulkCreateOptions<Attributes<Model>>,
	): Promise<ModelInterface> {
		if (this.model.primaryKeyAttribute === "id") {
			body = {
				...body,
				[this.model.primaryKeyAttribute]: v7({
					msecs: body["created_at"] ? new Date(body['created_at']).getTime() : new Date().getTime(),
				}),
			};
		}
		return await this.model.create(body, options).catch((err: Error) => {
			throw err;
		});
	}

	async bulkCreate(
		body: Array<CreationAttributes<ModelInterface>>,
		options?: BulkCreateOptions<Attributes<Model>>,
	): Promise<ModelInterface[]> {
		if (this.model.primaryKeyAttribute === "id") {
			body = body.map((item) => ({
				...item,
				[this.model.primaryKeyAttribute]: v7({
					msecs: item['created_at'] ? new Date(item['created_at']).getTime() : new Date().getTime(),
				}),
			}));
		}
		return await this.model.bulkCreate(body, options);
	}

	async put(
		id: string,
		body: CreationAttributes<ModelInterface>,
		transaction?: Transaction | Transactionable,
	): Promise<ModelInterface | null> {
		const toUpdate = await this.model.findByPk(id);
		return await toUpdate?.update({ ...body, updated_at: new Date() }, { ...transaction }) || null;
	}

	async bulkUpdate(
		where: any,
		body: CreationAttributes<ModelInterface>,
		transaction?: Transaction | Transactionable,
	): Promise<[affectedCount: number]> {
		return await this.model.update(body, { where, ...transaction });
	}

	async delete(id: string): Promise<string> {
		const toDelete = await this.model.findByPk(id);
		if (!toDelete) {
			throw new Error(`Item with id ${id} not found`);
		}
		return await toDelete.destroy().then(() => "Successfully delete item");
	}

	async bulkDelete(
		where: WhereOptions<Attributes<ModelInterface>>,
		cascade: boolean = false,
		options?: BulkCreateOptions<Attributes<Model>>,
	): Promise<number> {
		return await this.model.destroy({ where: where, cascade, ...options });
	}
}