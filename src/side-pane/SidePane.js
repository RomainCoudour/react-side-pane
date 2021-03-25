import React, { useEffect, useState, useMemo, useCallback, useRef } from "react";
import FocusTrap from "focus-trap-react";
import { disableBodyScroll, enableBodyScroll } from "body-scroll-lock";
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

function getAppNode(appNodeId) {
	return document.getElementById(appNodeId);
}

/**
 * Animated left-to-right side pane with a backdrop.
 *
 * @param {boolean} open Whether or not the pane is open
 * @param children One React element or a function that can hold the onActive callback
 * @param {boolean} disableBackdrop Makes the backdrop transparent
 * @param {boolean} disableBackdropClick Does not close the pane when user clicks on the backdrop
 * @param {number} duration Animation dur. (ms). Aniamtions are diabled when reduce-motion is active
 * @param {number} offset Space (width in %) between parent and child when both are open
 * @param {number} width Width of the pane in percentage. Max: 100; Rest: backdrop
 * @callback onClose
 * @callback onActive Callback from child to parent to pass on the child width on open
 */
export default function SidePane({
	appNodeId = "root",
	"aria-describedby": ariaDescribedBy,
	"aria-label": ariaLabel = "side pane",
	"aria-labelledby": ariaLabelledby,
	backdropClassName = "",
	backdropStyle = {},
	children,
	className = "",
	disableBackdropClick = false,
	disableEscapeKeyDown = false, // Shouldn't be disabled as it's part of a11y specs
	disableRestoreFocus = false, // Shouldn't be disabled as it's part of a11y specs
	duration = 250,
	hideBackdrop = false,
	initialFocus = null,
	offset = 10,
	onActive = null,
	onClose,
	open = false,
	style = {},
	width = 0,
}) {
	const ref = useRef(null);
	const previousActiveElementRef = useRef(null);
	const [active, setActive] = useState(false);
	const [activeChildWidth, setActiveChildWidth] = useState(0);
	const translateValue = useMemo(() => getTranslateValue(width, activeChildWidth, offset), [
		width,
		activeChildWidth,
		offset,
	]);

	useEffect(() => {
		const { current } = ref;
		const handleEscape = ({ code, key, keyCode }) => {
			const keyValue = code || key || keyCode;
			const isEscape = ["Escape", "Esc", 27].some((value) => value === keyValue);
			if (isEscape && typeof onClose === "function") {
				onClose();
			}
		};
		if (!disableEscapeKeyDown && open) {
			current?.addEventListener("keydown", handleEscape);
		}
		return () => {
			current?.removeEventListener("keydown", handleEscape);
		};
	}, [open, disableEscapeKeyDown, onClose]);

	useEffect(() => {
		const { current } = ref;
		const handleEscape = ({ code, key, keyCode }) => {
			const keyValue = code || key || keyCode;
			const isEscape = ["Escape", "Esc", 27].some((value) => value === keyValue);
			if (isEscape && typeof onClose === "function") {
				onClose();
			}
		};
		if (open) {
			const { activeElement } = document;
			previousActiveElementRef.current = activeElement;
			activeElement.blur();
			current?.addEventListener("keydown", handleEscape);
			getAppNode(appNodeId)?.setAttribute("aria-hidden", "true");
		} else {
			getAppNode(appNodeId)?.setAttribute("aria-hidden", "false");
			previousActiveElementRef.current?.focus();
		}
		return () => {
			current?.removeEventListener("keydown", handleEscape);
		};
	}, [open, appNodeId, onClose]);

	useEffect(() => {
		const { current } = ref;
		const isActive = open || active;
		if (isActive) {
			disableBodyScroll(current);
		} else {
			enableBodyScroll(current);
		}
	}, [open, active]);

	useEffect(() => {
		const isActive = open || active;
		if (isActive && typeof onActive === "function") {
			onActive(open ? translateValue : 0);
		}
	}, [open, active, translateValue, onActive]);

	const handleActive = useCallback((childWidth) => setActiveChildWidth(childWidth), []);
	const handleEnter = useCallback(() => setActive(true), []);
	const handleExited = useCallback(() => setActive(false), []);

	return createPortal(
		<FocusTrap
			active={open || active}
			focusTrapOptions={{
				fallbackFocus: () => ref.current,
				initialFocus,
				returnFocusOnDeactivate: !disableRestoreFocus,
			}}
		>
			<div
				ref={ref}
				className={styles.sidePane}
				data-disable-backdrop={hideBackdrop}
				open={open || active}
				tabIndex={-1}
			>
				<div className={styles.sidePane__wrapper}>
					<div
						aria-label="backdrop"
						className={`${styles.sidePane__backdrop} ${backdropClassName || ""}`}
						role="presentation"
						style={{ ...getTransition(duration), cursor: "pointer", ...backdropStyle }}
						onClick={(!disableBackdropClick && onClose) || null}
					/>
					<Pane
						ariaDescribedBy={ariaDescribedBy}
						ariaLabel={ariaLabel}
						ariaLabelledby={ariaLabelledby}
						className={className}
						duration={duration}
						open={open}
						style={style}
						tabIndex={0}
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
			</div>
		</FocusTrap>,
		document.body
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
	offset: PropTypes.number,
	width: PropTypes.number,
};
