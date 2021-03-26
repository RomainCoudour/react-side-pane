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

/**
 * Animated left-to-right side pane with a backdrop.
 *
 * @param {string} appNodeId - DOM node id that contains the application (for aria-hidden)
 * @param {string} aria-describedby
 * @param {string} aria-label
 * @param {string} aria-labelledby
 * @param {string} backdropClassName - Classname to pass to the backdrop
 * @param {object} backdropStyle - Style object to pass to the backdrop
 * @param children - One React element or a function that can hold the onActive callback
 * @param {string} className - Classname to pass to the pane
 * @param {boolean} disableBackdropClick - Prevents click on backdrop to trigger onClose
 * @param {boolean} disableEscapeKeyDown - Prevents Escape key down to trigger onClose.
 * Recommended: Should not be disabled as it is part of a11y specs
 * @param {boolean} disableRestoreFocus - Prevents restoring focus on previous active element
 * after pane is closed. Recommended: Should not be disabled as it is part of a11y specs
 * @param {number} duration - Animation dur. (ms). Aniamtions are diabled when reduce-motion is on
 * @param {boolean} hideBackdrop - Makes the backdrop transparent
 * @param {HTMLElement|string|function} initialFocus - Element to focus after pane is opened
 * @param {number} offset - Space (width in %) between parent and child when both are open
 * @param {boolean} open - Whether to display the pane
 * @param {object} style - Style object to pass to the pane
 * @param {number} width - Width of the pane in percentage. Max: 100.
 * @callback onActive - Callback from child to parent to pass on the child width on open
 * @callback onClose - Callback triggered on Escape or click on backdrop
 */
export default function SidePane({
	appNodeId = "root",
	"aria-describedby": ariaDescribedBy = "",
	"aria-label": ariaLabel = "side pane",
	"aria-labelledby": ariaLabelledby = "",
	backdropClassName = "",
	backdropStyle = {},
	children,
	className = "",
	disableBackdropClick = false,
	disableEscapeKeyDown = false,
	disableRestoreFocus = false,
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
		const isActive = open || active;
		if (isActive) {
			disableBodyScroll(current);
		} else {
			enableBodyScroll(current);
		}
	}, [open, active]);

	useEffect(() => {
		const isActive = open || active;
		if (onActive || !isActive) {
			return;
		}
		document.getElementById(appNodeId)?.setAttribute("aria-hidden", (!!open).toString());
	}, [open, active, appNodeId, onActive]);

	useEffect(() => {
		const isActive = open || active;
		if (isActive && typeof onActive === "function") {
			onActive(open ? translateValue : 0);
		}
	}, [open, active, translateValue, onActive]);

	const handleActive = useCallback((childWidth) => {
		setActiveChildWidth(childWidth);
		ref.current?.setAttribute("aria-hidden", (!!childWidth).toString());
	}, []);
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
	appNodeId: PropTypes.string,
	"aria-describedby": PropTypes.string,
	"aria-label": PropTypes.string,
	"aria-labelledby": PropTypes.string,
	backdropClassName: PropTypes.string,
	// eslint-disable-next-line react/forbid-prop-types
	backdropStyle: PropTypes.object,
	children: PropTypes.oneOfType([PropTypes.func, PropTypes.element]).isRequired,
	className: PropTypes.string,
	disableBackdropClick: PropTypes.bool,
	disableEscapeKeyDown: PropTypes.bool,
	disableRestoreFocus: PropTypes.bool,
	duration: PropTypes.number,
	hideBackdrop: PropTypes.bool,
	initialFocus: PropTypes.oneOfType([PropTypes.func, PropTypes.element, PropTypes.string]),
	offset: PropTypes.number,
	onActive: PropTypes.func,
	onClose: PropTypes.func.isRequired,
	open: PropTypes.bool.isRequired,
	// eslint-disable-next-line react/forbid-prop-types
	style: PropTypes.object,
	width: PropTypes.number,
};
