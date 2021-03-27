export function getTranslateValue(parentWidth, childWidth, offset) {
	let value = 0;
	if (!childWidth) {
		value = parentWidth;
	} else if (childWidth >= parentWidth || parentWidth - childWidth < offset) {
		value = childWidth + offset;
	} else {
		value = parentWidth;
	}
	return Math.min(value, 100);
}

export function getOpacityTransition(duration) {
	return {
		WebkitTransition: `opacity ${duration}ms ease-out`,
		OTransition: `opacity ${duration}ms ease-out`,
		transition: `opacity ${duration}ms ease-out`,
	};
}

export function getTransformTransition(duration) {
	return {
		WebkitTransition: `-webkit-transform ${duration}ms ease-out`,
		OTransition: `transform ${duration}ms ease-out`,
		transition: `transform ${duration}ms ease-out, -webkit-transform ${duration}ms ease-out`,
	};
}
