import React from "react";
import { Transition } from "react-transition-group";
import styles from "./SidePane.css";

function getTransition(duration) {
	return {
		WebkitTransition: `transform ${duration}ms ease-out`,
		OTransition: `transform ${duration}ms ease-out`,
		transition: `transform ${duration}ms ease-out`,
	};
}

const defaultTransitionStyle = {
	transform: "translateX(100%)",
};
const transitionStyles = {
	entering: { transform: "translateX(100%)" },
	entered: { transform: "translateX(0%)" },
	exiting: { transform: "translateX(100%)" },
	exited: { transform: "translateX(100%)" },
};
export default function Pane({
	ariaLabel,
	ariaLabelledby,
	ariaDescribedBy,
	duration,
	children,
	onEnter,
	onExited,
	open,
	translateValue,
	width,
}) {
	const dynamicTransitionStyles = {
		...transitionStyles,
		entered: { transform: `translateX(+100%) translateX(-${translateValue}vw)` },
	};

	return (
		<Transition
			mountOnEnter
			in={open}
			timeout={{ appear: 0, enter: 0, exit: duration }}
			onEnter={onEnter}
			onExited={onExited}
		>
			{(state) => (
				<div
					aria-describedby={ariaDescribedBy}
					aria-label={ariaLabel}
					aria-labelledby={ariaLabelledby}
					aria-modal="true"
					className={styles.sidePane__pane}
					role="dialog"
					style={{
						...defaultTransitionStyle,
						...dynamicTransitionStyles[state],
						...getTransition(duration),
						width: `${Math.min(width, 100)}%`,
					}}
				>
					{children}
				</div>
			)}
		</Transition>
	);
}
