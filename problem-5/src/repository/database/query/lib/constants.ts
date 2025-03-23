export enum Operators {
	Equal = "==",
	NotEqual = "!=",
	GreaterOrEqual = ">=",
	LessOrEqual = "<=",
	Greater = ">",
	Less = "<",
	Contains = "@=",
	StartsWith = "_=",
	DoesNotContain = "!@=",
	DoesNotStartWith = "!_=",
}

export const listOperators = [
	{ operator: Operators.Equal, meaning: "Equals" },
	{ operator: Operators.NotEqual, meaning: "Not equals" },
	{ operator: Operators.GreaterOrEqual, meaning: "Greater than or equal to" },
	{ operator: Operators.LessOrEqual, meaning: "Less than or equal to" },
	{ operator: Operators.Greater, meaning: "Greater than" },
	{ operator: Operators.Less, meaning: "Less than" },
	{ operator: Operators.Contains, meaning: "Contains" },
	{ operator: Operators.StartsWith, meaning: "Starts with" },
	{ operator: Operators.DoesNotContain, meaning: "Does not Contains" },
	{ operator: Operators.DoesNotStartWith, meaning: "Does not Starts with" },
];

export const AUTHENTICATION_ERROR_MESSAGES = {
	NOT_AUTHORIZED: "Not authorized",
	PERMISSION_DENIED: {
		VI: "Không có quyền truy cập",
		EN: "Permission denied",
	},
	INVALID_TOKEN: {
		VI: "Khoá không hợp lệ",
		EN: "Invalid token",
	},
} as const;

export enum SpecialCases {
	UNACCENT = "unaccent",
	JSON = "json",
}
