import React, { useRef, useEffect, useState, useMemo, useCallback } from "react";
import { createPortal } from "react-dom";
import PropTypes from "prop-types";
import Pane from "./Pane";
import styles from "./SidePane.css";

function getTranslateValue(parentWidth, childWidth, offset) {
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

function getTransition(duration) {
	return {
		WebkitTransition: `opacity ${duration}ms ease-out`,
		OTransition: `opacity ${duration}ms ease-out`,
		transition: `opacity ${duration}ms ease-out`,
	};
}

/**
 * Animated left-to-right side pane with a backdrop.
 *
 * @param children One React element or a function that can hold the onActive callback
 * @param onActive Callback from child to parent to pass on the child width on open
 * @param containerId DOM element id where to portal SidePane for rendering
 * @param duration Animation duration (ms). Aniamtions are diabled when reduce-motion is active
 * @param disableBackdrop Makes the backdrop transparent
 * @param disableBackdropClick Does not close the pane when user clicks on the backdrop
 * @param offset Space (width in %) between parent and child when both are open
 * @param width Width of the pane in percentage. Max: 100; Rest: backdrop
 */
export default function SidePane({
	open,
	children,
	onClose,
	onActive = null,
	containerId = "root",
	disableBackdrop = false,
	disableBackdropClick = false,
	duration = 250,
	offset = 10,
	width = 0,
}) {
	const [active, setActive] = useState(false);
	const [activeChildWidth, setActiveChildWidth] = useState(0);
	const domNode = useRef(document.getElementById(containerId));
	const translateValue = useMemo(() => getTranslateValue(width, activeChildWidth, offset), [
		width,
		activeChildWidth,
		offset,
	]);
	useEffect(() => {
		const isActive = open || active;
		if (!isActive || typeof onActive !== "function") {
			return;
		}
		onActive(open ? translateValue : 0);
	}, [open, active, translateValue, onActive]);
	const handleActive = useCallback((childWidth) => setActiveChildWidth(childWidth), []);
	const handleEnter = useCallback(() => setActive(true), []);
	const handleExited = useCallback(() => setActive(false), []);
	const handleEscape = ({ code }) => {
		if (code === "Escape" && typeof onClose === "function") {
			onClose();
		}
	};
	return createPortal(
		<div
			className={styles.sidePane}
			data-disable-backdrop={disableBackdrop}
			open={open || active}
		>
			<div className={styles.sidePane__wrapper}>
				<div
					aria-label="backdrop"
					className={styles.sidePane__backdrop}
					role="button"
					style={getTransition(duration)}
					tabIndex={0}
					onClick={(!disableBackdropClick && onClose) || null}
					onKeyDown={handleEscape}
				/>
				<Pane
					duration={duration}
					open={open}
					translateValue={translateValue}
					width={width}
					onEnter={handleEnter}
					onExited={handleExited}
				>
					{active &&
						(typeof children === "function"
							? children({ onActive: handleActive })
							: React.cloneElement(React.Children.only(children), {
									onActive: handleActive,
							  }))}
				</Pane>
			</div>
		</div>,
		domNode.current
	);
}
SidePane.propTypes = {
	open: PropTypes.bool,
	children: PropTypes.oneOfType([PropTypes.func, PropTypes.element]).isRequired,
	onClose: PropTypes.func.isRequired,
	onActive: PropTypes.func,
	duration: PropTypes.number,
	disableBackdrop: PropTypes.bool,
	disableBackdropClick: PropTypes.bool,
	containerId: PropTypes.string,
	offset: PropTypes.number,
	width: PropTypes.number,
};
