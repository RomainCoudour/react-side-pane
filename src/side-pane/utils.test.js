import { getTranslateValue, getOpacityTransition, getTransformTransition } from "./utils";

describe("Testing utils functions", () => {
	describe("getTranslateValue", () => {
		const offset = 10;
		const parentWidth = 50;

		it("with no childWidth", () => {
			const childWidth = 0;
			const actual = getTranslateValue(parentWidth, childWidth, offset);
			expect(actual).toBe(parentWidth);
		});

		it("with value never greater than 100", () => {
			const actual = getTranslateValue(101, undefined, offset);
			expect(actual).toBe(100);
		});

		it("with childWidth gte parentWidth", () => {
			const childWidth = parentWidth + 1;
			const actual = getTranslateValue(parentWidth, childWidth, offset);
			expect(actual).toBe(childWidth + offset);
		});

		it("with childWidth lt parentWidth and width difference gte offset", () => {
			const childWidth = parentWidth - 1 - offset;
			const actual = getTranslateValue(parentWidth, childWidth, offset);
			expect(actual).toBe(parentWidth);
		});

		it("with childWidth lt parentWidth and width difference lt offset", () => {
			const childWidth = parentWidth + 1 - offset;
			const actual = getTranslateValue(parentWidth, childWidth, offset);
			expect(actual).toBe(childWidth + offset);
		});
	});

	it("getOpacityTransition", () => {
		const keys = ["WebkitTransition", "OTransition", "transition"];
		const actual = getOpacityTransition(100);
		expect(actual).toBeInstanceOf(Object);
		expect(Object.keys(actual)).toEqual(keys);
		expect(Object.keys(actual).length).toBe(3);
	});

	it("getTransformTransition", () => {
		const keys = ["WebkitTransition", "OTransition", "transition"];
		const actual = getTransformTransition(100);
		expect(actual).toBeInstanceOf(Object);
		expect(Object.keys(actual)).toEqual(keys);
		expect(Object.keys(actual).length).toBe(3);
	});
});
