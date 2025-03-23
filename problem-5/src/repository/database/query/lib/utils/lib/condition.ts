import { fn, literal, where, WhereLeftOperand, WhereOptions } from "sequelize";
import { SpecialCases, Operators } from "../../constants";
import { handleSpecialCases, getWhereReturn, getRightOperator } from "./operator";

//================================= CONDITION HANDLER =================================
export const getBetweenCondition = (str: string) => str.replace(/[\(\)]/g, "").trim();

export function getCondition(arrLeftRight: string[], character: Operators | ""): WhereOptions<any> {
	const [rawLeft, rawRight] = arrLeftRight;
	// Special cases trigger
	if (rawLeft.includes("::")) {
		const [specialCase, left_op] = rawLeft.split("::") as [SpecialCases | "", string];
		return handleSpecialCases([left_op, rawRight], character, specialCase);
	}

	const conditionLeft = rawLeft.includes(".") ? `$${rawLeft}$` : rawLeft;
	const conditionRight = rawRight == "null" ? null : rawRight;

	return getWhereReturn(conditionLeft, conditionRight, character);
}

export function getUnaccentQueryCondition(leftOp: WhereLeftOperand, rightOp: string, character: Operators | "") {
	const unaccentLeftOp = fn("unaccent", leftOp);
	const noUnaccentRightOp = getRightOperator(rightOp, character);
	if (typeof noUnaccentRightOp === "string") return where(unaccentLeftOp, fn("unaccent", noUnaccentRightOp));

	const opSymbol = Object.getOwnPropertySymbols(noUnaccentRightOp)[0];
	return where(unaccentLeftOp, { [opSymbol]: fn("unaccent", noUnaccentRightOp[opSymbol]) });
}

export function getJsonQueryCondition(
	fieldPath: string[],
	jsonKey: string,
	rightOp: string,
	character: Operators | "",
) {
	const jsonLeftOp = buildJsonLeftOp(fieldPath, jsonKey);
	const noJsonRightOp = getRightOperator(rightOp, character);

	if (typeof noJsonRightOp === "string") {
		return where(jsonLeftOp, noJsonRightOp);
	}

	return where(jsonLeftOp, {
		[Object.getOwnPropertySymbols(noJsonRightOp)[0]]: noJsonRightOp[Object.getOwnPropertySymbols(noJsonRightOp)[0]],
	});
}

export function buildJsonLeftOp(fieldPath: string[], jsonKey: string) {
	const quotedFieldPath = fieldPath.map((part) => `"${part}"`).join(".");
	return literal(`${quotedFieldPath}#>>'{${jsonKey}}'`);
}

//================================= CONDITION HANDLER =================================
