import React from "react";
import { Transition } from "react-transition-group";
import { getTransformTransition } from "./utils";
import styles from "./SidePane.css";

const defaultTransitionStyle = {
	transform: "translateX(100%)",
};
const transitionStyles = {
	entering: { transform: "translateX(100%)" },
	entered: { transform: "translateX(0%)" },
	exiting: { transform: "translateX(100%)" },
	exited: { transform: "translateX(100%)" },
};
const Pane = React.forwardRef(
	(
		{
			ariaLabel,
			ariaLabelledby,
			ariaDescribedBy,
			children,
			className,
			duration,
			onEnter,
			onExited,
			open,
			style,
			translateValue,
			width,
		},
		ref
	) => {
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
						ref={ref}
						aria-describedby={ariaDescribedBy || null}
						aria-label={ariaLabel || "side pane"}
						aria-labelledby={ariaLabelledby || null}
						aria-modal="true"
						className={`${styles.sidePane__pane} ${className}`}
						role="dialog"
						style={{
							...defaultTransitionStyle,
							...dynamicTransitionStyles[state],
							...getTransformTransition(duration),
							...style,
							width: `${Math.min(width, 100)}%`,
						}}
					>
						{children}
					</div>
				)}
			</Transition>
		);
	}
);
export default Pane;