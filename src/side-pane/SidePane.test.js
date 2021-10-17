import React from "react";
import { render, unmountComponentAtNode } from "react-dom";
import { act } from "react-dom/test-utils";
import { cleanup, fireEvent } from "@testing-library/react";
import SidePane from "./SidePane";

let container = null;
beforeEach(() => {
	container = document.createElement("div");
	container.setAttribute("id", "root");
	document.body.appendChild(container);
});

afterEach(() => {
	unmountComponentAtNode(container);
	container.remove();
	container = null;
	cleanup();
});

describe("Controls", () => {
	it("Click on backdrop", () => {
		const onClose = jest.fn();
		act(() => {
			render(
				<SidePane open={true} width={50} onClose={onClose}>
					<>Hello world</>
				</SidePane>,
				container
			);
		});
		const backdrop = document.querySelector(".sidePane__backdrop");
		act(() => {
			backdrop.dispatchEvent(new MouseEvent("click", { bubbles: true }));
		});
		expect(onClose).toHaveBeenCalledTimes(1);
	});
});
describe("Style & Options", () => {});
describe("Rendering", () => {});
