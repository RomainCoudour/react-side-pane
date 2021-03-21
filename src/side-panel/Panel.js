import React from "react";
import { Transition } from "react-transition-group";
import styles from "./SidePanel.css";

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
export default function Panel({
	open,
	width,
	duration,
	translateValue,
	onEnter,
	onExited,
	children,
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
					className={styles.sidePanel__panel}
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
