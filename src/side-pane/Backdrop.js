import React, { useRef } from "react";
import { getOpacityTransition } from "./utils";
import styles from "./SidePane.css";

export default function Backdrop({
	children,
	className,
	disableBackdropClick,
	duration,
	hideBackdrop,
	onClose,
	style,
}) {
	const backdropRef = useRef(null);
	const handleClick = ({ target }) => {
		const { current } = backdropRef;
		if (disableBackdropClick || target !== current) {
			return;
		}
		onClose();
	};
	return (
		<div
			ref={backdropRef}
			aria-label="backdrop"
			className={`${styles.sidePane__backdrop} ${className}`}
			data-disable-backdrop={disableBackdropClick}
			data-hide-backdrop={hideBackdrop}
			role="presentation"
			style={{
				...getOpacityTransition(duration),
				...style,
			}}
			onClick={handleClick}
		>
			{children}
		</div>
	);
}
