import dayjs from "dayjs";

export function getCorrectFormatTime(value: string | number | Date | dayjs.Dayjs) {
	const arrayFormat = ["DD/MM/YYYY", "DD-MM-YYYY"];

	for (let index = 0; index < arrayFormat.length; index++) {
		const element = arrayFormat[index];
		if (dayjs(value, element, true).isValid()) return element;
	}

	return null;
}
