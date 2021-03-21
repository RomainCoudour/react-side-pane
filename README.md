# react-side-pane [![npm][npm-badge]][npm] [![Dependabot badge][dependabot-badge]](https://dependabot.com/)
> First developed and used by [Aitenders](https://www.aitenders.com/)

[![styled with: prettier](https://img.shields.io/badge/styled_with-prettier-ff69b4.svg?style=flat-square)](https://github.com/prettier/prettier)
[![License: MIT](https://img.shields.io/github/license/RomainCoudour/react-side-pane)](https://opensource.org/licenses/MIT)
[![React](https://img.shields.io/npm/dependency-version/react-side-pane/peer/react)](https://www.npmjs.com/package/react)
[![React transition group](https://img.shields.io/npm/dependency-version/react-side-pane/react-transition-group)](https://www.npmjs.com/package/react-transition-group)
[![Stars](https://img.shields.io/github/stars/RomainCoudour/react-side-pane?style=social)](https://github.com/RomainCoudour/react-side-pane)
[![PR](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](https://github.com/RomainCoudour/react-side-pane)
[![Downloads](https://img.shields.io/npm/dw/react-side-pane)](https://github.com/RomainCoudour/react-side-pane)
[![Size](https://img.shields.io/bundlephobia/min/react-side-pane)](https://github.com/RomainCoudour/react-side-pane)

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
```javascript
import SidePane from "react-side-pane";
```

## Usage

react-side-pane is using [React Portals](https://reactjs.org/docs/portals.html) under the hood and [React transition group](https://www.npmjs.com/package/react-transition-group) to handle the transitions. The SidePane should take all the screen and has for now a z-index of 1000. It can accept only one child (either a function or an element/component/dom node).

 The pane only appears from the left.. it is really a react-left-side-pane at the moment. Also, react-side-pane offers only a few props to customize the pane so if you need any additionnal tweaks, feel free to open an issue or to contribute.

### One pane usage
```javascript
<SidePanel open={open} width={50} onClose={handleClose}>
  <SomeComponent /> // or some function {() => <>Hello world!</>}
</SidePanel>
```

### Multi-pane usage
```javascript
<SidePanel open={open} width={50} onClose={handleClose}>
  {({ onActive }) =>
    <SomeComponentWithASidePane onActive={onActive} /> // Assuming SomeComponent calls a SidePane
  }
</SidePanel>
```
```javascript
// SomeComponent.js
export default function SomeComponent({ someComponentProps, onActive }) { // callback received from SidePane
  ... // Handle its SidePane open/close state
  return (
    <>
      {...}
      <SidePanel open={open} width={50} onActive={onActive} onClose={handleClose}>
        <span>Hello world!</span>
      </SidePanel>
    </>
  );
}

// Elsewhere
<SidePanel open={open} width={50} onClose={handleClose}>
  <SomeComponent someComponentProps={...} />
</SidePanel>
```

## Props

| Prop          | Description   | Default   
| ------------- | ------------- |:-----------:
| open          | Whether or not the pane is open | false
| children      | Function or component inside the pane  | (required)
| onClose      | Callback called when pane is closing (backdrop click)     | (required)
| onActive     | Callback between SidePane to translateX when several SidePane are opened      | null
| duration      | Duration of the transition onExit (react-transition-group)    | 250 (ms)
| disableBackdrop      | Hide the backdrop (just its color)      | false
| disableBackdropClick      | Disable the onClose trigger when clicking on the backdrop  | false
| containerId      | DOM Node id in which the SidePane will be contained      | "root"
| offset      | Space (width in %) between parent and child when both are open | 10 (%)
| width      | Width of the pane in percentage. Max: 100; Rest: backdrop      | 0 (%)

## Credit

This project did not appear by magic. It was started at [Aitenders](https://www.aitenders.com/) as a more modern and nicer way to display data and additionnal user actions.
