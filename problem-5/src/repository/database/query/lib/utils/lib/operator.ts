//================================= OPERATOR HANDLER =================================
import { col, Op } from "sequelize";
import { SpecialCases, Operators } from "../../constants";
import { getBetweenCondition, getUnaccentQueryCondition } from "./condition";
import { Fn } from "sequelize/lib/utils";

export function handleSpecialCases(
	[conditionLeft, conditionRight]: string[],
	character: Operators | "",
	specialCase: SpecialCases | "",
) {
	if (specialCase == SpecialCases.JSON) return getWhereReturn(conditionLeft, conditionRight, character);

	if (specialCase == SpecialCases.UNACCENT)
		return getUnaccentQueryCondition(col(conditionLeft), conditionRight, character);

	throw new Error("Invalid method");
}

export function getWhereReturn(conditionLeft: string, conditionRight: string, character: string) {
	if (character == Operators.Equal) return { [conditionLeft]: conditionRight };
	if (character == Operators.NotEqual) return { [conditionLeft]: { [Op.not]: conditionRight } };
	if (character == Operators.GreaterOrEqual) return { [conditionLeft]: { [Op.gte]: conditionRight } };
	if (character == Operators.LessOrEqual) return { [conditionLeft]: { [Op.lte]: conditionRight } };
	if (character == Operators.Greater) return { [conditionLeft]: { [Op.gt]: conditionRight } };
	if (character == Operators.Less) return { [conditionLeft]: { [Op.lt]: conditionRight } };
	if (character == Operators.Contains)
		return {
			[conditionLeft]: {
				[Op.iLike]: "%" + conditionRight + "%",
			},
		};
	if (character == Operators.StartsWith)
		return {
			[conditionLeft]: {
				[Op.startsWith]: conditionRight,
			},
		};
	if (character == Operators.DoesNotContain)
		return {
			[conditionLeft]: {
				[Op.notLike]: "%" + conditionRight + "%",
			},
		};
	if (character == Operators.DoesNotStartWith)
		return {
			[conditionLeft]: {
				[Op.notILike]: "%" + conditionRight,
			},
		};
	if (character == Operators.DateBetween) {
		const valSearch = getBetweenCondition(conditionRight);
		const [start, end] = valSearch.split("-").map((data) => new Date(data));

		return {
			[conditionLeft]: {
				[Op.between]: [start, end],
			},
		};
	}
}

export function getRightOperator(conditionRight: string | Fn, character: Operators | "") {
	// if (character == Operators.Equal) return conditionRight;
	if (character == Operators.NotEqual) return { [Op.not]: conditionRight };
	if (character == Operators.GreaterOrEqual) return { [Op.gte]: conditionRight };
	if (character == Operators.LessOrEqual) return { [Op.lte]: conditionRight };
	if (character == Operators.Greater) return { [Op.gt]: conditionRight };
	if (character == Operators.Less) return { [Op.lt]: conditionRight };
	if (character == Operators.Contains)
		return {
			[Op.iLike]: "%" + conditionRight + "%",
		};
	if (character == Operators.StartsWith)
		return {
			[Op.startsWith]: conditionRight,
		};
	if (character == Operators.DoesNotContain)
		return {
			[Op.notLike]: "%" + conditionRight + "%",
		};
	if (character == Operators.DoesNotStartWith)
		return {
			[Op.notILike]: "%" + conditionRight,
		};

	if (character == Operators.DateBetween && typeof conditionRight == "string") {
		const valSearch = getBetweenCondition(conditionRight);
		const [start, end] = valSearch.split("-").map((data) => new Date(data));

		return {
			[Op.between]: [start, end],
		};
	}
	return conditionRight;
}
