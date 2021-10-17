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

	// it("Key down Escape to close the panel", () => {
	// 	const onClose = jest.fn();
	// 	const testId = "pane-content";
	// 	act(() => {
	// 		render(
	// 			<SidePane open={true} width={50} onClose={onClose} duration={0}>
	// 				{({ onActive }) => {
	// 					return (
	// 						<div className="toto" data-testid={testId}>
	// 							Hello world
	// 							{() => {
	// 								const [state, setState] = useState(0);
	// 								return (
	// 									<SidePane
	// 										open={true}
	// 										width={50}
	// 										onClose={onClose}
	// 										duration={0}
	// 										onActive={onActive}
	// 									>
	// 										<div className="toto">
	// 											Hello world
	// 											<button onClick={() => setState((p) => p + 1)}>
	// 												{state}
	// 											</button>
	// 										</div>
	// 									</SidePane>
	// 								);
	// 							}}
	// 						</div>
	// 					);
	// 				}}
	// 			</SidePane>,
	// 			container
	// 		);
	// 	});
	// 	fireEvent.keyDown(document.querySelector(`[data-testid="${testId}"]`), {
	// 		key: "Escape",
	// 		code: "Escape",
	// 		keyCode: 27,
	// 		charCode: 27,
	// 	});
	// 	expect(onClose).toHaveBeenCalledTimes(1);
	// });

	// it("Key down Escape to close the panel when disableEscapeKeyDown", () => {
	// 	const onClose = jest.fn();
	// 	act(() => {
	// 		render(
	// 			<SidePane open={true} width={50} onClose={onClose} disableEscapeKeyDown={true}>
	// 				<>Hello world</>
	// 			</SidePane>,
	// 			container
	// 		);
	// 	});
	// 	act(() => {
	// 		fireEvent.keyDown(document, { key: "Escape", code: 27, charCode: 27 });
	// 	});
	// 	expect(onClose).toHaveBeenCalledTimes(0);
	// });
});
describe("Style & Options", () => {});
describe("Rendering", () => {});
