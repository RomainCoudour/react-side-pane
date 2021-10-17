import { cleanup } from "@testing-library/react";
import React from "react";
import { render, unmountComponentAtNode } from "react-dom";
import { act } from "react-dom/test-utils";
import Backdrop from "./Backdrop";

let container = null;
beforeEach(() => {
	container = document.createElement("div");
	document.body.appendChild(container);
});

afterEach(() => {
	unmountComponentAtNode(container);
	container.remove();
	container = null;
	cleanup();
});

describe("Testing of Backdrop", () => {
	it("Click on backdrop", () => {
		const onClose = jest.fn();
		act(() => {
			render(
				<Backdrop
					className=""
					disableBackdropClick={false}
					duration={100}
					hideBackdrop={false}
					onClose={onClose}
					style={{}}
				/>,
				container
			);
		});
		const node = container.querySelector("div");
		act(() => {
			node.dispatchEvent(new MouseEvent("click", { bubbles: true }));
		});
		expect(onClose).toHaveBeenCalledTimes(1);
	});

	it("Click on backdrop when hidden", () => {
		const onClose = jest.fn();
		act(() => {
			render(
				<Backdrop
					className=""
					disableBackdropClick={false}
					duration={100}
					hideBackdrop={true}
					onClose={onClose}
					style={{}}
				/>,
				container
			);
		});
		const node = container.querySelector("div");
		act(() => {
			node.dispatchEvent(new MouseEvent("click", { bubbles: true }));
		});
		expect(container.querySelector("[data-hide-backdrop]").dataset["hideBackdrop"]).toBe(
			"true"
		);
		expect(onClose).toHaveBeenCalledTimes(1);
	});

	it("Click on backdrop when disabled", () => {
		const onClose = jest.fn();
		act(() => {
			render(
				<Backdrop
					className=""
					disableBackdropClick={true}
					duration={100}
					hideBackdrop={false}
					onClose={onClose}
					style={{}}
				/>,
				container
			);
		});
		const node = container.querySelector("div");
		act(() => {
			node.dispatchEvent(new MouseEvent("click", { bubbles: true }));
		});
		expect(onClose).toHaveBeenCalledTimes(0);
	});

	it("With styling", () => {
		const jestTestClassName = "jest-test";
		const jestTestColor = "pink";
		act(() => {
			render(
				<Backdrop
					className={jestTestClassName}
					disableBackdropClick={false}
					duration={100}
					hideBackdrop={false}
					onClose={null}
					style={{ color: jestTestColor }}
				/>,
				container
			);
		});
		const node = container.querySelector("div");
		expect(node.className.includes(jestTestClassName)).toBe(true);
		expect(node.style.color).toBe(jestTestColor);
	});
});
