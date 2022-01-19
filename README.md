# react-side-pane [![npm][npm-badge]][npm] [![Dependabot badge][dependabot-badge]](https://dependabot.com/)

> First developed and used by [Aitenders](https://www.aitenders.com/)

[![License: MIT](https://img.shields.io/github/license/RomainCoudour/react-side-pane)](https://opensource.org/licenses/MIT)
[![Stars](https://img.shields.io/github/stars/RomainCoudour/react-side-pane?style=social)](https://github.com/RomainCoudour/react-side-pane)
[![React](https://img.shields.io/npm/dependency-version/react-side-pane/peer/react)](https://www.npmjs.com/package/react)
[![React transition group](https://img.shields.io/npm/dependency-version/react-side-pane/react-transition-group)](https://www.npmjs.com/package/react-transition-group)
[![Size](https://img.shields.io/bundlephobia/min/react-side-pane)](https://github.com/RomainCoudour/react-side-pane)
[![Downloads](https://img.shields.io/npm/dw/react-side-pane)](https://github.com/RomainCoudour/react-side-pane)
[![PR](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](https://github.com/RomainCoudour/react-side-pane)
[![styled with: prettier](https://img.shields.io/badge/styled_with-prettier-ff69b4.svg)](https://github.com/prettier/prettier)

[dependabot-badge]: https://camo.githubusercontent.com/7f4aec020ec1dccb8ae5c9479116a9a403ce460ee1674a4379dea2cbc11962ff/68747470733a2f2f696d672e736869656c64732e696f2f62616467652f446570656e6461626f742d656e61626c65642d626c75652e737667
[npm-badge]: https://img.shields.io/npm/v/react-side-pane.svg
[npm]: https://www.npmjs.org/package/react-side-pane

## [Live Demo](https://codesandbox.io/s/react-side-pane-giu40)

## Getting started

Install react-side-pane

```
npm i react-side-pane
yarn add react-side-pane
```

And import it inside your components via
> :warning: **Breaking change**: <br/>
> As of v2.0.0, you can import SidePane only via its named export (as below). <br/> Prior to v2.0.0, please use its default export `import SidePane from "react-side-pane";`

```javascript
import { SidePane } from "react-side-pane";
```

## Usage

react-side-pane is using [React Portals](https://reactjs.org/docs/portals.html) under the hood and [React transition group](https://www.npmjs.com/package/react-transition-group) to handle the transitions. The SidePane should take all the screen. It can accept only one child (either a function or an element/component/dom node).

The pane only appears from the right.. it is really a react-right-side-pane at the moment. Also, react-side-pane offers only a few props to customize the pane so if you need any additionnal tweaks, feel free to open an issue or to contribute.

### One pane usage

```javascript
<SidePane open={open} width={50} onClose={handleClose}>
	<SomeComponent /> // or some function {() => <>Hello world!</>}
</SidePane>
```

### Multi-pane usage

```javascript
<SidePane open={open} width={50} onClose={handleClose}>
	{/* Assuming SomeComponent calls a SidePane */}
	{({ onActive }) => <SomeComponentWithASidePane onActive={onActive} />}
</SidePane>
```

or

```javascript
// SomeComponent.js
export default function SomeComponent({ someComponentProps, onActive }) {
  // onActive --> callback received from SidePane
  ... // Handle its SidePane open/close state
  return (
    <>
      {...}
      <SidePane open={open} width={50} onActive={onActive} onClose={handleClose}>
        <span>Hello world!</span>
      </SidePane>
    </>
  );
}

// Elsewhere
<SidePane open={open} width={50} onClose={handleClose}>
  <SomeComponent someComponentProps={...} />
</SidePane>
```

### Autowidth

The `autoWidth` prop will override `width` by taking the width of the SidePane's content via ref. This ref is passed down from SidePane to its content via forwarding:

```javascript
const SidePaneContent = React.forwardRef(({ onActive }, ref) => {
  // onActive callback to pass to an inner SidePane (see example above)
  return (
    <div ref={ref} style={{ width: "250px" }}>
    {...}
    </div>
  );
});
```

## Props

| Prop                 | Description                                                          |     Default      |
| -------------------- | -------------------------------------------------------------------- | :--------------: |
| appNodeId            | DOM node id that contains the application (for aria-hidden)          |      "root"      |
| aria-describedby     | aria-describedby                                                     |        ""        |
| aria-label           | aria-label                                                           |   "side pane"    |
| aria-labelledby      | aria-labelledby                                                      |        ""        |
| autoWidth      | Will take the width bounding box's width of the SidePane's child instead of `width` |    false        |
| backdropClassName    | Classname to pass to the backdrop                                    |        ""        |
| backdropStyle        | Style object to pass to the backdrop                                 |        {}        |
| `children`           | One React element or a function that can hold the onActive callback  |    (required)    |
| className            | Classname to pass to the pane                                        |        ""        |
| containerId          | You can specify an element ID to receive the side panes (portal). containerId will be passed to document.getElementById. If not filled, the side panes will portal to document.body. See usage below    |       ""       |
| disableBackdropClick | Prevents click on backdrop to trigger onClose                        |      false       |
| disableEscapeKeyDown | Prevents Escape key down to trigger onClose. *Recommended*: Should not be true as it is part of a11y specs.                       |      false       |
| disableRestoreFocus  | Prevents restoring focus on previous active element after closing. *Recommended*: Should not be true as it is part of a11y specs.   |      false       |
| duration             | Animation dur. (ms). Aniamtions are diabled when reduce-motion is on |     250 (ms)     |
| hideBackdrop         | Makes the backdrop transparent                                       |      false       |
| offset               | Space (width in %) between parent and child when both are open       |      10 (%)      |
| onActive             | Callback from child to parent to pass on the child width on open     |       null       |
| `onClose`            | Callback triggered on Escape or click on backdrop                    |    (required)    |
| `open`               | Whether to display the pane                                          | false (required) |
| style                | Style object to pass to the pane                                     |        {}        |
| width                | Width of the pane in percentage. Max: 100.                           |      0 (%)       |

## Known issues

### Focus fighting
> **Notes**: Noticed while using MUI dialog with SidePane

MUI Dialog and SidePane are rendering by default in document.body using Portals. But using both at the same time triggered `Maximum call stack size exceeded. at tryFocus` from one of our old dependency. We removed said dependency to use [react-focus-lock](https://github.com/theKashey/react-focus-lock) instead which resolved the issue but popped a [new one](https://github.com/theKashey/focus-lock/#focus-fighting): 

```
FocusLock: focus-fighting detected. Only one focus management system could be active.
```

To fix this, we are using `shards` and `whiteList` props from [react-focus-lock](https://github.com/theKashey/react-focus-lock). If you stumble upon this one in your console, consider the fix below and if it does not work, open an issue.

```html
<body>
  <div id="root"></div> <!-- your react app container -->
  <div id="container"></div> <!-- the SidePane container (instead of document.body) -->
  <!-- other stuff ... -->
  <!-- other Modals/Dialogs etc... -->
</body>
```
```javascript
function App() {
  const [open, dispatchOpen] = useReducer((prev) => !prev, false);
  return (
    <div>
      <button onClick={dispatchOpen}>Open</button>
      <SidePane open={open} onClose={dispatchOpen} width={50} containerId="container">
        <Component />
      </SidePane>
    </div>
	);
}
```

## Credits

This project did not appear by magic. It was started at [Aitenders](https://www.aitenders.com/) as a more modern and nicer way to display data and additionnal user actions.
