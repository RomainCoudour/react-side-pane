import React from "react";

interface SidePaneProps {
	/**
	 * DOM node id that contains the application (for aria-hidden)
	 * @default "root"
	 */
	appNodeId?: string;

	"aria-describedby"?: string;

	"aria-label"?: string;

	"aria-labelledby"?: string;

	/**
	 * Will take the width bounding box's width of the SidePane's child instead of width
	 * @default false
	 */
	autoWidth?: boolean;

	/**
	 * Classname to pass to the backdrop
	 * @default ""
	 */
	backdropClassName?: string;

	/**
	 * Style object to pass to the backdrop
	 * @default {}
	 */
	backdropStyle?: object;

	/**
	 * One React element or a function that can hold the onActive callback
	 */
	children: React.ReactNode;

	/**
	 * Classname to pass to the pane
	 * @default ""
	 */
	className?: string;

	/**
	 * You can specify an element ID to receive the side panes (portal). containerId will be passed to document.getElementById.
	 * If not filled, the side panes will portal to document.body.
	 * @default ""
	 */
	containerId?: string;

	/**
	 * Prevents click on backdrop to trigger onClose.
	 * @default false
	 */
	disableBackdropClick?: boolean;

	/**
	 * Prevents Escape key down to trigger onClose. *Recommended*: Should not be true as it is part of a11y specs.
	 * @default false
	 */
	disableEscapeKeyDown?: boolean;

	/**
	 * Prevents restoring focus on previous active element after closing.
	 * *Recommended*: Should not be true as it is part of a11y specs.
	 * @default false
	 */
	disableRestoreFocus?: boolean;

	/**
	 * Animation dur. (ms). Aniamtions are diabled when reduce-motion is on
	 * @default 250
	 */
	duration?: number;

	/**
	 * Makes the backdrop transparent
	 * @default false
	 */
	hideBackdrop?: boolean;

	/**
	 * Space (width in %) between parent and child when both are open
	 * @default 10
	 */
	offset?: number;

	/**
	 * Callback from child to parent to pass on the child width on open
	 * @param translateValue SidePane caller width
	 */
	onActive?(translateValue: number): void;

	onClose(): void;

	open: boolean;

	/**
	 * Style object to pass to the pane
	 * @default {}
	 */
	style?: object;

	/**
	 * Width of the pane in percentage. Max: 100.
	 * @default 0
	 */
	width?: number;
}

export declare const SidePane: React.FC<SidePaneProps>;
