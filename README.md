[![Published on webcomponents.org](https://img.shields.io/badge/webcomponents.org-published-blue.svg)](https://www.webcomponents.org/element/owner/my-element)

# \<kemet-flipcard\>

A card that has a front and back and flip between the two sides.

<!--
```
<custom-element-demo>
  <template>
    <link rel="import" href="kemet-flipcard.html">
  </template>
</custom-element-demo>
```
-->
```html
<kemet-flipcard>
    <div slot="front">
        <h2>This is the front of the card.</h2>
        <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit</p>
        <a href="#" toggle>Toggle</a>
    </div>
    <div slot="back">
        <h2>This is the back of the card</h2>
        <a href="#" toggle>Toggle</a>
    </div>
</kemet-flipcard>
```