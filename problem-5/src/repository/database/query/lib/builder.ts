import { WhereOptions } from "sequelize";
import { listOperators } from "./constants";
import { getBetweenCondition, getCondition } from "./utils";
import { QuerySpecialField } from "@services/database/types";

/** Generate conditions that have multiple values separated by "|"" */
export function generateConditionExtra(params: string, specialFields?: QuerySpecialField[]): WhereOptions[] {
	try {
		const { operator } = listOperators.find(({ operator }) => params.includes(operator)) ?? { operator: "" };
		const [leftOp, rightOp] = params.split(operator).map((data) => data.trim());

		if (!rightOp) return null;

		const rightOps = rightOp.replace(/[\(\)]/g, "").split("|");
		const leftOps = !leftOp.includes("|") ? [leftOp] : getBetweenCondition(leftOp).split("|");

		return leftOps.flatMap((left) =>
			rightOps.map((right) => {
				const field = specialFields?.find(([key]) => left.startsWith(key)) ?? null;
				if (!field) return getCondition([left, right.trim()], operator);
				const [_key, handler] = field;
				return handler(right.trim(), operator);
			}),
		);
	} catch (ex) {
		return null;
	}
}

/** Generate condition normally */
export function generateCondition(params: string, specialFields?: QuerySpecialField[]): WhereOptions<any> {
	try {
		const character = listOperators.find(({ operator }) => params.includes(operator)).operator ?? "";
		const [leftOp, rightOp] = params.split(character).map((data) => data.trim());

		if (!rightOp) return null;

		const field = specialFields?.find(([key]) => leftOp.startsWith(key)) ?? null;

		if (!field) return getCondition([leftOp, rightOp], character);
		const [_key, handler] = field;
		return handler(rightOp, character);
	} catch (ex) {
		return null;
	}
}
