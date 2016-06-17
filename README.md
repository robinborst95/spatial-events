# spatial-events

Example project for rotatable and triggerable lists.

## Rotatable component
The rotatable component rotates a list of div's and must be used as followed. 

Include the component in HTML like this:
```html
<div transition="expand" v-for="element in elements" class="rotatable">
...
</div>

<rotatable
  rotatable-class="rotatable"
  set-elements-event="elements-found"
  :interval="5000"
  direction="secondToTop">
</rotatable>
```

#### Indicating the rotatable div's
The attribute `rotatable-class` is required and indicates which div's need to be rotated.
These div's must have the `class=[rotatable-class]` property. 
The div's also must be filled dynamically from an array `elements` as in `v-for="element in elements"`. 
Another important attribute that must be set, is `transition="expand"`. This property takes care of firing a transition event, which is used for beginning the rotation.

#### Set elements
The array `elements` can be passed in two ways: 
- Call `setElements(elements)` on the `rotatable` component.
- Set the value of `set-elements-event` to the name of the `$broadcast` event.

#### Set interval
Set the interval that the list is rotated by the attribute `:interval` (adding `:` interprets the value as number).

#### Set direction
The list can rotate in two directions. It can scroll to the top, which means that the second element becomes the first. This can be set with `direction="secondToTop"`. The other direction is scrolling to the bottom, which means that the first element becomes the second and the last element the first. This can be set with `direction="lastToTop"`.

#### Set animation duration
The animation duration for rotating the list can be changed in the `style` part of `rotatable.vue`.


## Triggerable component
The triggerable component triggers a sequence of actions for the first element of a list. It must be used as followed.

Include the component in HTML like this:
```html
<triggerable
  :trigger-events="['rotation-end']"
  set-elements-event="elements-found"></triggerable>
```
and triggerable elements in the `elements` array in JSON like this:
```json
"triggerActions": [
  {
    "name": "setView",
    "value": {
      "lat": 53.2,
      "lon": 5.5,
      "zoom": 9
    }
  },
  {
    "name": "wait",
    "value": 1000
  },
  {
    "name": "setView",
    "value": {
      "lat": 53.4,
      "lon": 5.353,
      "zoom": 11
    }
  }
]
```
This trigger sets the map to a zoomed out view, then waits for 1 second and then zooms in to another center. New actions can be made by defining the values in json and adding a `case` clause in the `getAction` function in `triggerable.vue`. In this function a function `nextActionsFunc` is passed, which must be invoked when the action is finished (e.g. for `setView` the next actions must be invoked once the map is updated correctly).  

#### Set elements
The array `elements` can be passed in two ways: 
- Call `setElements(elements)` on the `triggerable` component.
- Set the value of `set-elements-event` to the name of the `$broadcast` event.

#### Set trigger event
The sequence of actions can be triggered in two ways:
- Call `trigger()` on the `triggerable` component.
- Set the value of `:trigger-events` to the names of the `$broadcast` events. This must be written as an array of Strings.
