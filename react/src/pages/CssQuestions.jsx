import { useState } from 'react'
import CodeBlock from '../components/CodeBlock.jsx'
import LevelSections from '../components/LevelSections.jsx'
import topics from './topics/cssTopics.js'
import TryIt from '../tryit/TryIt.jsx'
import TryItButton from '../tryit/TryItButton.jsx'

// Each question has: a simple answer, example HTML + CSS, and a live preview.

const questions = [
  {
    q: 'What is CSS and how is a CSS rule written?',
    level: 'Basics',
    a: "CSS stands for Cascading Style Sheets, and it controls how HTML looks: colors, fonts, spacing and layout. A rule has a selector that picks the elements, and a block of declarations, each made of a property and a value ending with a semicolon. I keep HTML for structure and CSS for styling, so I can change the design without touching the content.",
    html: `<h1 class="title">Hello CSS</h1>
<p>Plain paragraph</p>`,
    css: `/* selector { property: value; } */
.title {
  color: #6366f1;
  font-size: 28px;
}
p { color: gray; }`,
  },
  {
    q: 'Inline vs internal vs external CSS?',
    level: 'Basics',
    a: "External CSS is a separate .css file linked with a link tag, internal CSS is written in a style tag in the HTML head, and inline CSS goes in the style attribute of an element. Inline styles have the highest priority. In real projects I use external files, because the browser caches them and they keep the HTML clean.",
    html: `<!-- external: <link rel="stylesheet" href="style.css" /> -->
<!-- internal: <style> p { color: red; } </style> -->
<p style="color: green">inline style wins</p>`,
    css: `p { color: red; }   /* loses to the inline style */`,
  },
  {
    q: 'What are the universal, type and group selectors?',
    level: 'Basics',
    a: "The universal selector * matches every element, the type selector like p matches all elements of that tag, and a group selector like h4, button applies one rule to several selectors separated by commas. I mostly use * for resets like box-sizing: border-box, and grouping helps me avoid repeating the same declarations.",
    html: `<h4>Heading</h4>
<p>Paragraph</p>
<button>Button</button>`,
    css: `* { outline: 1px dashed #a5b4fc; }  /* universal */
p { color: #16a34a; }                /* type */
h4, button { color: #6366f1; }       /* group */`,
  },
  {
    q: 'id vs class?',
    level: 'Basics',
    a: "An id must be unique on the page and has higher specificity, while a class can be reused on many elements. I use classes for almost all styling, because they're reusable and easier to override. I keep ids for anchor links, form labels and JavaScript hooks.",
    html: `<p id="intro" class="text">id + class</p>
<p class="text">class only</p>
<p class="text">class only</p>`,
    css: `.text  { color: #6366f1; }      /* reused on many elements */
#intro { font-weight: bold; }   /* only one element */`,
  },
  {
    q: 'Descendant selector vs child selector?',
    level: 'Basics',
    a: "A space between selectors, like .box p, is the descendant selector, and it matches p at any depth inside .box. The greater-than sign, like .box > p, is the child selector, and it matches only the direct children.",
    html: `<div class="box">
  <p>direct child</p>
  <section><p>grandchild</p></section>
</div>`,
    css: `.box p   { color: green; }          /* both p tags */
.box > p { font-weight: bold; }     /* only the direct child */`,
  },
  {
    q: 'What are the + and ~ selectors?',
    level: 'Basics',
    a: "Both are sibling selectors. The plus sign selects only the element that comes immediately after, and the tilde selects all the siblings that come after. For example, h4 + p styles only the first paragraph after the heading.",
    html: `<h4>Title</h4>
<p>first p after h4</p>
<p>second p</p>
<p>third p</p>`,
    css: `h4 { margin: 0 0 4px; }
p { margin: 2px 0; }
h4 ~ p { color: #6366f1; }       /* all p after h4 */
h4 + p { font-weight: bold; }    /* only the first one */`,
  },
  {
    q: 'What is an attribute selector?',
    level: 'Basics',
    a: "Attribute selectors target elements by their attributes. [type=\"email\"] matches an exact value, ^= means starts with, $= means ends with, and *= means contains. I use them for styling form inputs and links.",
    html: `<input type="text" placeholder="text" />
<input type="email" placeholder="email" />
<a href="https://example.com">secure</a>
<a href="http://example.com">not secure</a>`,
    css: `input[type="email"] { border: 2px solid #6366f1; }
a[href^="https"]    { color: green; }
a[href^="http:"]    { color: red; }
input, a { display: block; margin-bottom: 6px; }`,
  },
  {
    q: 'How do you write colors in CSS (hex, rgb, hsl)?',
    level: 'Basics',
    a: "I can use named colors like red, hex codes like #6366f1, rgb() with red, green and blue values, or hsl() with hue, saturation and lightness. rgb and hsl also take an alpha value for transparency. I like hsl for design systems, because making a color lighter or darker just means changing the lightness.",
    html: `<div class="hex">hex</div>
<div class="rgb">rgb</div>
<div class="hsl">hsl</div>
<div class="alpha">rgb, 40% alpha</div>`,
    css: `div { padding: 6px; color: white; }
.hex   { background: #6366f1; }
.rgb   { background: rgb(16 185 129); }
.hsl   { background: hsl(38 92% 50%); }
.alpha { background: rgb(99 102 241 / 0.4); }`,
  },
  {
    q: 'How do you style lists with list-style?',
    level: 'Basics',
    a: "list-style-type changes the marker, like disc, square, decimal or lower-roman, and list-style-position decides if the marker sits inside or outside the text box. For navigation menus I set list-style: none with padding: 0 and lay the items out with flexbox. To color just the bullets I use the ::marker pseudo-element.",
    html: `<ul class="square"><li>Square bullets</li><li>Second item</li></ul>
<ol class="roman"><li>Roman numbers</li><li>Second item</li></ol>
<ul class="nav"><li>Home</li><li>About</li><li>Contact</li></ul>`,
    css: `.square { list-style-type: square; }
.roman  { list-style: lower-roman inside; }
.square li::marker { color: #6366f1; }

.nav { list-style: none; padding: 0; display: flex; gap: 12px; }  /* menu */
.nav li { background: #e0e7ff; padding: 4px 10px; }`,
  },
  {
    q: 'How do you style a table (border-collapse, zebra rows)?',
    level: 'Basics',
    a: "By default every cell has its own border with a gap between them, so I set border-collapse: collapse to merge them into single lines. Then I add padding to th and td, align numbers to the right, and use tr:nth-child(even) for zebra stripes. For wide tables on mobile I wrap the table in a div with overflow-x: auto so it scrolls instead of breaking the page.",
    html: `<table>
  <tr><th>Name</th><th>Score</th></tr>
  <tr><td>Asha</td><td>92</td></tr>
  <tr><td>Ravi</td><td>85</td></tr>
  <tr><td>Meera</td><td>78</td></tr>
</table>`,
    css: `table { border-collapse: collapse; width: 220px; }
th, td { border: 1px solid #c7d2fe; padding: 6px 10px; text-align: left; }
th { background: #6366f1; color: white; }
td:last-child { text-align: right; }       /* numbers */
tr:nth-child(even) td { background: #eef2ff; }  /* zebra rows */`,
  },
  {
    q: 'px vs em vs rem vs %?',
    level: 'Basics',
    a: "px is a fixed size. em is relative to the parent's font size, so it can multiply when elements are nested. rem is relative to the root html font size, which makes it predictable, so I prefer rem for font sizes and spacing. A percentage is relative to the parent element's size.",
    html: `<div class="parent">
  <p class="em">2em</p>
  <p class="rem">2rem</p>
</div>`,
    css: `html    { font-size: 16px; }
.parent { font-size: 10px; }
.em  { font-size: 2em; }  /* 2 × 10px = 20px */
.rem { font-size: 2rem; } /* 2 × 16px = 32px */`,
  },
  {
    q: 'What are ch and ex units?',
    level: 'Basics',
    a: "1ch is the width of the 0 character in the current font, and 1ex is roughly the height of a lowercase x. I use max-width: 60ch on paragraphs to keep lines at a comfortable reading length, and ch is also handy for sizing an input to fit a number of characters, like a 4-digit PIN. ex is rarer; I sometimes use it to line up small icons with lowercase text.",
    html: `<input class="pin" value="1234" />
<p class="short">This paragraph is limited to 25ch, so the lines stay short.</p>`,
    css: `.pin { width: 4ch; font: 20px monospace; }  /* 4 digits wide */
.short {
  max-width: 25ch;   /* about 25 characters per line */
  background: #e0e7ff;
}`,
  },
  {
    q: 'What are vh and vw?',
    level: 'Basics',
    a: "vh and vw are viewport units: 1vh is 1% of the viewport height and 1vw is 1% of the viewport width. I use 100vh for full-screen sections, although on mobile the dvh unit is often better because of the browser's address bar.",
    html: '<div class="box">50vw wide</div>',
    css: `.box {
  width: 50vw;   /* half the viewport width */
  height: 20vh;
  background: #e0e7ff;
}`,
  },
  {
    q: 'Which CSS properties do you use to style text?',
    level: 'Basics',
    a: "I use text-transform for uppercase or capitalize, letter-spacing for the gap between letters, text-align for alignment, and text-decoration for underlines. For fonts I like the font shorthand, which sets style, weight, size, line-height and family in one line. I keep line-height unitless, like 1.5, so it scales with the font size.",
    html: `<h4 class="label">Label</h4>
<p class="body">Centered italic text with a comfortable line height.</p>`,
    css: `.label {
  text-transform: uppercase;
  letter-spacing: 3px;
  text-decoration: underline;
}
.body {
  font: italic 14px/1.6 Georgia, serif; /* style size/line-height family */
  text-align: center;
}`,
  },
  {
    q: 'How do you set fonts and use web fonts?',
    level: 'Basics',
    a: "I set fonts with font-family, giving a list of fallbacks that ends with a generic family like sans-serif, in case the first font isn't available. For custom fonts, I load them with @font-face or a service like Google Fonts. I also use font-display: swap so text shows straight away in a fallback font while the web font loads.",
    html: `<p class="sans">Sans-serif stack</p>
<p class="serif">Serif stack</p>`,
    css: `/* @font-face { font-family: "Inter"; src: url(inter.woff2); font-display: swap; } */
.sans  { font-family: "Inter", system-ui, sans-serif; }
.serif { font-family: Georgia, "Times New Roman", serif; }`,
  },
  {
    q: 'What is the CSS box model?',
    level: 'Basics',
    a: "Every element in CSS is a rectangular box. From the inside out, it has the content, then padding, then border, and finally margin. By default, when I set a width, it only applies to the content area.",
    html: '<div class="box">Content</div>',
    css: `.box {
  width: 120px;
  padding: 20px;          /* space inside the border */
  border: 5px solid #6366f1;
  margin: 20px;           /* space outside the border */
  background: #e0e7ff;
}`,
  },
  {
    q: 'margin vs padding?',
    level: 'Basics',
    a: "Padding is the space inside the element, between the content and the border, so it gets the element's background color. Margin is the space outside the border that pushes other elements away, and it's always transparent. I use padding to give content breathing room and margin to space elements apart.",
    html: `<div class="box">padding is inside (blue area)</div>
<div class="box">margin is the white gap between boxes</div>`,
    css: `.box {
  padding: 20px;          /* inside */
  margin: 16px 0;         /* outside */
  background: #e0e7ff;
  border: 2px solid #6366f1;
}`,
  },
  {
    q: 'How do the margin, padding and border shorthands work?',
    level: 'Basics',
    a: "With four values the order is clockwise from the top: top, right, bottom, left. Two values mean top-bottom and left-right, and three values mean top, left-right, bottom. The border shorthand takes width, style and color, like border: 2px solid red, and the style is required or no border shows. When I only want to change one side I use the longhand, like padding-left, so I don't reset the other sides by accident.",
    html: `<div class="box one">padding: 10px</div>
<div class="box two">padding: 4px 24px</div>
<div class="box four">padding: 2px 8px 16px 40px</div>`,
    css: `.box { background: #c7d2fe; border: 2px solid #6366f1; margin: 0 0 8px; }
.one  { padding: 10px; }               /* all sides */
.two  { padding: 4px 24px; }           /* top-bottom | left-right */
.four { padding: 2px 8px 16px 40px;    /* top right bottom left */
        border-left: 6px dashed #f59e0b; }  /* longhand: one side */`,
  },
  {
    q: 'What does box-sizing: border-box do?',
    level: 'Basics',
    a: "By default, box-sizing is content-box, so padding and border get added on top of the width I set. With border-box, the width includes the padding and border, so the element stays exactly the size I gave it. That's why I usually set border-box on everything in my projects.",
    html: `<div class="a">content-box</div>
<div class="b">border-box</div>`,
    css: `div {
  width: 200px;
  padding: 20px;
  border: 5px solid #6366f1;
  margin-bottom: 8px;
}
.a { box-sizing: content-box; } /* real width = 250px */
.b { box-sizing: border-box; }  /* real width = 200px */`,
  },
  {
    q: 'What is a CSS reset, and how is it different from normalize.css?',
    level: 'Basics',
    a: "Browsers add their own default styles, like margins on headings and padding on lists, so pages look slightly different everywhere. A reset removes most of those defaults so I start from zero, while normalize.css keeps the useful defaults and only fixes the differences between browsers. Today I use a small modern reset: box-sizing: border-box, margin: 0, block images with max-width: 100%, and font: inherit on form controls.",
    html: `<h4>Default margins</h4>
<ul><li>Default padding</li></ul>
<div class="reset">
  <h4>After reset</h4>
  <ul><li>No padding</li></ul>
</div>`,
    css: `h4, ul { background: #e0e7ff; }
/* a small reset, scoped to .reset for this demo */
.reset * { box-sizing: border-box; margin: 0; padding: 0; list-style: none; }`,
  },
  {
    q: 'border vs outline?',
    level: 'Basics',
    a: "A border is part of the box model, so it takes up space and can shift the layout. An outline is drawn outside the element and takes no space. That's why browsers use outline for focus rings, and for accessibility I'm careful not to remove it without giving a replacement.",
    html: `<span class="b">border</span>
<span class="o">outline</span>
<span>neighbour</span>`,
    css: `span { background: #e0e7ff; padding: 6px; }
.b { border: 6px solid #6366f1; }   /* pushes neighbours */
.o { outline: 6px solid #f59e0b; }  /* no extra space */`,
  },
  {
    q: 'Difference between block, inline and inline-block?',
    level: 'Basics',
    a: "A block element starts on a new line and takes the full width, like a div. An inline element sits inside the line of text and ignores width and height, like a span. inline-block stays in the line but still lets me set width and height.",
    html: `<div class="block">block</div>
<span class="inline">inline</span>
<span class="inline">inline</span>
<span class="ib">inline-block</span>`,
    css: `.block  { display: block; background: #fecaca; }
.inline { display: inline; background: #bbf7d0; width: 300px; } /* width ignored */
.ib     { display: inline-block; background: #bfdbfe; width: 120px; }`,
  },
  {
    q: 'display: none vs visibility: hidden?',
    level: 'Basics',
    a: "Both hide the element, but display: none removes it from the layout completely, so the space closes up. visibility: hidden only makes it invisible, and its space is still kept on the page.",
    html: `<span>A</span> <span class="none">B</span> <span>C</span><br />
<span>A</span> <span class="hidden">B</span> <span>C</span>`,
    css: `span { display: inline-block; width: 40px; background: #e0e7ff; text-align: center; }
.none   { display: none; }       /* gap closes */
.hidden { visibility: hidden; }  /* gap stays */`,
  },
  {
    q: 'How does the cascade decide which rule wins? When is !important okay?',
    level: 'Basics',
    a: "The browser checks the origin and importance first, then specificity, and finally source order, so if everything else is equal the rule written later wins. !important jumps ahead of normal declarations, even inline styles, which is why it makes code hard to override. I only accept it in utility classes or when I must override third-party CSS I can't change.",
    html: `<p class="a b">Same specificity: later rule wins</p>
<p class="note" style="color: green">!important beats the inline style</p>`,
    css: `/* same specificity (0-1-0): the later rule wins */
.a { color: red; }
.b { color: #6366f1; }

/* !important beats even the inline style="color: green" */
.note { color: #ea580c !important; }`,
  },
  {
    q: 'What are cascade layers (@layer)?',
    level: 'Advanced',
    a: "@layer puts rules into named layers, and the order I declare the layers decides who wins, before specificity is even compared. So a simple class in a later layer beats an ID selector in an earlier layer, and styles outside any layer beat all layers. I use it to keep resets, a third-party library and my components in a fixed order, so I never need !important to override a library.",
    html: `<div id="main">
  <button class="btn">components layer wins</button>
</div>`,
    css: `@layer base, components;  /* later layer wins */

@layer base {
  #main .btn { background: gray; }  /* ID, but earlier layer */
}
@layer components {
  .btn { background: #6366f1; color: white; }
}
button { padding: 8px 14px; border: 0; }  /* unlayered */`,
  },
  {
    q: 'What is specificity?',
    level: 'Basics',
    a: "Specificity decides which rule wins when several rules target the same element. Inline styles are the strongest, then IDs, then classes, attributes and pseudo-classes, and finally element tags. If the specificity is equal, the rule written later wins. I try to avoid !important because it makes styles hard to override.",
    html: '<p id="title" class="text">Which color am I?</p>',
    css: `p      { color: red; }    /* tag:   0-0-1 */
.text  { color: green; }  /* class: 0-1-0 */
#title { color: blue; }   /* id:    1-0-0  → wins */`,
  },
  {
    q: 'Specificity puzzle: which color wins?',
    level: 'Intermediate',
    a: "I count each selector as three columns: ids, then classes, attributes and pseudo-classes, then elements, and compare them from the left. One id beats any number of classes, so 0-3-0 loses to 1-0-1. :is() takes the specificity of its strongest argument, while :where() always counts as zero, which is why I use :where() for base styles that should be easy to override. Here the :is() rule wins with 1-1-0.",
    html: `<div id="app" class="page">
  <p id="first" class="text intro">Which color am I?</p>
</div>`,
    css: `#app p                 { color: red; }      /* 1-0-1 */
.page .text.intro      { color: green; }    /* 0-3-0: three classes lose to one id */
:is(#app, .page) .text { color: #6366f1; }  /* 1-1-0: wins */
:where(#app) p.text    { color: orange; }   /* 0-1-1: :where counts as 0 */

p { font-size: 18px; font-weight: bold; }`,
  },
  {
    q: 'Which properties are inherited?',
    level: 'Basics',
    a: "Text-related properties like color, font-family and line-height are inherited by child elements. Box properties like margin, padding, border and background are not. If I want a child to take a non-inherited value from its parent, I use the inherit keyword.",
    html: `<div class="parent">
  Parent
  <p>Child gets the color, not the border</p>
  <p class="force">Child with border: inherit</p>
</div>`,
    css: `.parent { color: #6366f1; border: 2px solid #6366f1; padding: 8px; }
.force  { border: inherit; }`,
  },
  {
    q: 'What do inherit, initial, unset and revert do?',
    level: 'Intermediate',
    a: "inherit takes the parent's value, and initial resets to the default from the CSS spec, so color: initial is black and display: initial is inline, even on a div. unset acts like inherit for inherited properties and like initial for the rest, and revert goes back to the browser's own default style. I use all: unset to strip a button's styles completely, and revert when I want an element back to its normal browser look.",
    html: `<div class="parent">
  <h4 class="inherit">inherit: parent's indigo</h4>
  <h4 class="unset">unset: like inherit for color</h4>
  <h4 class="initial">initial: black</h4>
  <h4 class="revert">revert: browser bold is back</h4>
</div>`,
    css: `.parent { color: #6366f1; }
h4 { color: #ef4444; font-weight: 400; margin: 2px 0; }
.inherit { color: inherit; }
.unset   { color: unset; }
.initial { color: initial; }
.revert  { color: inherit; font-weight: revert; }`,
  },
  {
    q: 'Pseudo-class vs pseudo-element?',
    level: 'Basics',
    a: "A pseudo-class, with a single colon, targets an element in a certain state, like :hover, :focus or :first-child. A pseudo-element, with double colons, targets a part of an element or adds content to it, like ::before, ::after or ::first-letter.",
    html: `<button>Hover me</button>
<p class="note">Important</p>`,
    css: `button:hover { background: #6366f1; color: white; } /* pseudo-class */

.note::before {               /* pseudo-element */
  content: "★ ";
  color: orange;
}`,
  },
  {
    q: 'What can you do with ::before and ::after?',
    level: 'Basics',
    a: "::before and ::after add a generated box as the first or last child of an element, and they only show up when I set the content property, even if it's just an empty string. I use them for decoration like quote marks, required-field stars, badges and icons, so the HTML stays clean. Screen readers may not read generated content reliably, so I never put important information there.",
    html: `<p class="quote">CSS is fun</p>
<label class="required">Email</label>`,
    css: `.quote::before { content: "“"; color: #6366f1; }
.quote::after  { content: "”"; color: #6366f1; }
.required::after { content: " *"; color: #ef4444; }`,
  },
  {
    q: 'How do you style ::selection, ::placeholder and ::marker?',
    level: 'Basics',
    a: "::selection styles the text the user highlights with the mouse, but only a few properties work there, like color and background-color. ::placeholder styles the hint text in an input, and I keep its contrast readable because people with low vision still need to see it. ::marker styles the bullet or number of a list item, so I can change its color without using a background image.",
    html: `<p>Select this text to see the custom highlight.</p>
<input placeholder="Search..." />
<ul><li>Colored bullet</li></ul>`,
    css: `::selection { background: #f59e0b; color: white; }
input::placeholder { color: #7c3aed; }
li::marker { color: #6366f1; font-size: 20px; }`,
  },
  {
    q: 'What are :hover, :active, :focus and :focus-visible?',
    level: 'Basics',
    a: ":hover is when the mouse is over the element, :active is while it's being clicked, and :focus is when it has focus. :focus-visible only applies when focus came from the keyboard, so I can show a clear outline for keyboard users without it appearing on every mouse click. For links I keep the order link, visited, hover, active.",
    html: `<a href="#">Hover and click me</a>
<br /><br />
<button>Press Tab to focus me</button>`,
    css: `a:link    { color: #6366f1; }
a:visited { color: purple; }
a:hover   { color: #f59e0b; }
a:active  { color: #ef4444; }

button:focus-visible { outline: 3px solid #6366f1; }`,
  },
  {
    q: 'What are min-width and max-width used for?',
    level: 'Basics',
    a: "max-width sets the largest an element can grow, and min-width sets the smallest it can shrink. I often use width: 100% together with a max-width, so content fills small screens but doesn't get too wide on large ones. It's the simplest way to make a container responsive.",
    html: '<div class="card">I fill the space but never grow past 250px</div>',
    css: `.card {
  width: 100%;
  max-width: 250px;   /* never wider */
  min-width: 120px;   /* never narrower */
  background: #e0e7ff;
  padding: 10px;
}`,
  },
  {
    q: 'Explain position: relative, absolute, fixed and sticky.',
    level: 'Intermediate',
    a: "relative moves the element from its normal position and also becomes the reference point for absolute children. absolute positions the element relative to its nearest positioned parent and takes it out of the normal flow. fixed sticks it to the screen even when I scroll, and sticky behaves normally until I scroll to it, then it sticks.",
    html: `<div class="parent">
  parent (relative)
  <div class="child">absolute</div>
</div>`,
    css: `.parent { position: relative; height: 100px; background: #e0e7ff; }
.child {
  position: absolute;
  bottom: 10px; right: 10px;
  background: #6366f1; color: white;
}`,
  },
  {
    q: 'How do you center a div?',
    level: 'Intermediate',
    a: "The easiest way I use is flexbox. I make the parent display: flex and set justify-content: center for horizontal and align-items: center for vertical. With grid, place-items: center does the same thing in one line.",
    html: `<div class="parent">
  <div class="child">Centered</div>
</div>`,
    css: `.parent {
  display: flex;
  justify-content: center; /* horizontal */
  align-items: center;     /* vertical */
  height: 120px;
  background: #e0e7ff;
}`,
  },
  {
    q: 'What are place-items and place-content?',
    level: 'Intermediate',
    a: "place-items is shorthand for align-items and justify-items, so in grid, place-items: center centers every item inside its own cell. place-content is shorthand for align-content and justify-content, and it moves the whole group of tracks inside the container when there's extra space. I remember it as: items moves things inside their cells, content moves the whole grid.",
    html: `<div class="grid items"><b>1</b><b>2</b><b>3</b><b>4</b></div>
<div class="grid content"><b>1</b><b>2</b><b>3</b><b>4</b></div>`,
    css: `.grid { display: inline-grid; vertical-align: top; width: 120px; height: 120px; background: #e0e7ff; }
b { background: #6366f1; color: white; padding: 2px 8px; }
/* each item centered inside its own cell */
.items { grid-template-columns: 1fr 1fr; place-items: center; }
/* the whole group of tracks centered in the box */
.content { grid-template-columns: 30px 30px; place-content: center; }`,
  },
  {
    q: 'justify-content vs align-items in flexbox?',
    level: 'Intermediate',
    a: "In flexbox, justify-content aligns items along the main axis, which is horizontal for a row. align-items aligns them on the cross axis, which is vertical for a row. If I change flex-direction to column, the two axes swap.",
    html: `<div class="row">
  <b>1</b><b>2</b><b>3</b>
</div>`,
    css: `.row {
  display: flex;
  justify-content: space-between; /* main axis */
  align-items: flex-end;          /* cross axis */
  height: 100px; background: #e0e7ff;
}
b { background: #6366f1; color: white; padding: 8px; }`,
  },
  {
    q: 'What does flex-direction do?',
    level: 'Basics',
    a: "flex-direction sets the main axis of a flex container: row (the default) puts items side by side, and column stacks them top to bottom. row-reverse and column-reverse flip the order visually. The thing I remember is that justify-content always works along this main axis, so in a column it controls vertical spacing.",
    html: `<div class="flex row"><b>1</b><b>2</b><b>3</b></div>
<div class="flex col"><b>1</b><b>2</b><b>3</b></div>
<div class="flex rev"><b>1</b><b>2</b><b>3</b></div>`,
    css: `.flex { display: flex; gap: 4px; margin-bottom: 8px; }
.row { flex-direction: row; }          /* default */
.col { flex-direction: column; width: 40px; }
.rev { flex-direction: row-reverse; justify-content: flex-end; }
b { background: #6366f1; color: white; padding: 6px 10px; }`,
  },
  {
    q: 'What is CSS Grid? How is it different from Flexbox?',
    level: 'Intermediate',
    a: "Flexbox is one-dimensional, so I use it to lay out items in a single row or a single column, like a navbar. Grid is two-dimensional and controls rows and columns together, so I use it for page layouts or card grids. In real projects I often use both together.",
    html: `<div class="grid">
  <div>1</div><div>2</div><div>3</div>
  <div>4</div><div>5</div><div>6</div>
</div>`,
    css: `.grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr); /* 3 equal columns */
  gap: 8px;
}
.grid div { background: #6366f1; color: white; padding: 12px; text-align: center; }`,
  },
  {
    q: 'How do grid-template-columns and the fr unit work?',
    level: 'Basics',
    a: "grid-template-columns lists the width of each column, and grid-template-rows does the same for rows. The fr unit means a fraction of the free space, so 1fr 2fr splits it one third and two thirds after fixed sizes like 100px are taken out. I prefer fr over percentages because it already subtracts the gap, so columns never overflow.",
    html: `<div class="grid">
  <div>100px</div><div>1fr</div><div>2fr</div>
  <div>100px</div><div>1fr</div><div>2fr</div>
</div>`,
    css: `.grid {
  display: grid;
  grid-template-columns: 100px 1fr 2fr;
  gap: 6px; width: 320px;
}
.grid div { background: #6366f1; color: white; padding: 8px; text-align: center; }`,
  },
  {
    q: 'What do repeat() and minmax() do in CSS Grid?',
    level: 'Intermediate',
    a: "repeat(4, 1fr) is just a short way to write 1fr 1fr 1fr 1fr. minmax(100px, 1fr) gives a track a size range: never smaller than 100px, and up to one share of the free space. I combine them as repeat(auto-fit, minmax(150px, 1fr)) to get a card grid that changes its number of columns by itself.",
    html: `<div class="grid four"><div>1</div><div>2</div><div>3</div><div>4</div></div>
<div class="grid mm"><div>min 60px</div><div>1fr</div></div>`,
    css: `.grid { display: grid; gap: 6px; width: 300px; margin-bottom: 8px; }
.four { grid-template-columns: repeat(4, 1fr); }  /* 1fr 1fr 1fr 1fr */
.mm   { grid-template-columns: minmax(60px, 100px) 1fr; }
.grid div { background: #6366f1; color: white; padding: 8px; text-align: center; }`,
  },
  {
    q: 'What is z-index?',
    level: 'Intermediate',
    a: "z-index controls which element appears on top when elements overlap, and a higher value comes to the front. It only works on positioned elements, or on flex and grid children. I also keep in mind that each stacking context has its own z-index order.",
    html: `<div class="a">z-index: 1</div>
<div class="b">z-index: 2</div>`,
    css: `div { position: absolute; width: 120px; height: 60px; color: white; padding: 6px; }
.a { z-index: 1; background: #ef4444; top: 10px; left: 10px; }
.b { z-index: 2; background: #6366f1; top: 40px; left: 60px; }`,
  },
  {
    q: 'What does :nth-child() do?',
    level: 'Intermediate',
    a: ":nth-child() selects elements based on their position among their siblings. I can use keywords like odd and even, a number like 3, or a formula like 3n. A common use is striped table rows.",
    html: `<ul>
  <li>One</li><li>Two</li><li>Three</li><li>Four</li>
</ul>`,
    css: `li:nth-child(odd)  { background: #e0e7ff; }
li:nth-child(even) { background: #fef3c7; }`,
  },
  {
    q: 'What are CSS variables?',
    level: 'Intermediate',
    a: "CSS variables, also called custom properties, let me store a value once and reuse it. I declare them with two dashes, usually in :root so they're global, and use them with var(). They're very useful for themes like dark mode, because I can change one value and everything updates.",
    html: `<button>Primary</button>`,
    css: `:root {
  --primary: #6366f1;
  --radius: 8px;
}
button {
  background: var(--primary);
  border-radius: var(--radius);
  color: white;
}`,
  },
  {
    q: ':root vs html selector?',
    level: 'Intermediate',
    a: ":root and html select the same element in an HTML page, but :root is a pseudo-class, so its specificity is 0-1-0, which beats html at 0-0-1. :root also works in other documents, like SVG. By convention I put global CSS variables on :root, so here its value wins even though the html rule comes later.",
    html: `<div class="box">My color comes from --brand</div>`,
    css: `:root { --brand: #6366f1; }   /* 0-1-0: wins */
html  { --brand: #ef4444; }   /* 0-0-1: loses, even though it's later */

.box {
  padding: 16px;
  background: var(--brand);
  color: white;
  border-radius: 8px;
}`,
  },
  {
    q: 'What is a media query?',
    level: 'Intermediate',
    a: "A media query applies CSS only when a condition is true, usually the screen width. It's the core of responsive design. I usually write mobile-first: base styles for small screens, then min-width media queries for larger ones.",
    html: '<div class="box">Resize the window</div>',
    css: `.box { background: #bbf7d0; padding: 16px; }

/* When the screen is 600px or smaller */
@media (max-width: 600px) {
  .box { background: #fecaca; }
}`,
  },
  {
    q: 'transition vs animation?',
    level: 'Intermediate',
    a: "A transition animates a property change between two states, like on hover, so it needs a trigger. An animation uses @keyframes, can have many steps, and can run on its own, loop, or start when the page loads.",
    html: `<div class="t">Hover me</div>
<div class="a">Spinning</div>`,
    css: `.t { background: #e0e7ff; padding: 10px; transition: transform 0.3s; }
.t:hover { transform: scale(1.1); }

.a {
  width: 80px; margin-top: 16px; background: #6366f1; color: white;
  animation: spin 2s linear infinite;
}
@keyframes spin { to { transform: rotate(360deg); } }`,
  },
  {
    q: 'How do you write a CSS transition (duration, timing function, delay)?',
    level: 'Basics',
    a: "A transition animates a property smoothly when its value changes, like on hover, and I write it as transition: property duration timing-function delay. The timing function sets the speed curve: ease is the default, linear is constant, and ease-in-out starts and ends slowly. I list the exact properties instead of transition: all, so nothing unexpected animates.",
    html: `<div class="track">
  <p>Hover me</p>
  <b class="ease">ease</b>
  <b class="linear">linear</b>
  <b class="late">delay</b>
</div>`,
    css: `b { display: block; width: 60px; margin: 4px 0; padding: 4px;
    background: #6366f1; color: white; white-space: nowrap; }
.ease   { transition: width 1s ease; }
.linear { transition: width 1s linear; }
.late   { transition: width 1s ease-in-out 0.3s; }
.track:hover b { width: 220px; }`,
  },
  {
    q: 'How do you create a CSS animation with @keyframes?',
    level: 'Basics',
    a: "I define the steps with @keyframes and a name, using from/to or percentages, and then attach it with the animation property: name, duration, timing function and how many times to repeat. Unlike a transition, it runs on its own without a hover or class change. I stick to animating transform and opacity so it stays smooth.",
    html: `<div class="spinner"></div>
<div class="pulse">pulse</div>`,
    css: `@keyframes spin { to { transform: rotate(360deg); } }
@keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.3; } }

.spinner { width: 36px; height: 36px; border: 4px solid #c7d2fe;
           border-top-color: #6366f1; border-radius: 50%;
           animation: spin 1s linear infinite; }
.pulse { margin-top: 10px; color: #6366f1; font-weight: bold;
         animation: pulse 1.5s ease-in-out infinite; }`,
  },
  {
    q: 'opacity vs rgba()?',
    level: 'Intermediate',
    a: "opacity applies to the whole element, so the text and children fade too. With rgba, only that specific color is transparent, for example just the background, while the text stays fully visible.",
    html: `<div class="o">opacity: 0.4</div>
<div class="r">rgba background</div>`,
    css: `div { padding: 10px; margin-bottom: 8px; color: black; }
.o { background: #6366f1; opacity: 0.4; }               /* text fades too */
.r { background: rgba(99, 102, 241, 0.4); }             /* text stays */`,
  },
  {
    q: 'What is the difference between visibility: hidden and opacity: 0?',
    level: 'Intermediate',
    a: "Both hide the element and keep its space in the layout. visibility: hidden also stops clicks and hover and removes it from screen readers, while an element with opacity: 0 is still there: it can be clicked, hovered and focused. I use opacity for fade animations, and pair it with visibility: hidden at the end so the invisible element can't be clicked by accident.",
    html: `<p>Hover the empty gaps:</p>
<div><button>A</button> <button class="vis">B</button> <button>C</button> visibility</div>
<div><button>A</button> <button class="op">B</button> <button>C</button> opacity</div>`,
    css: `div { margin-bottom: 8px; }
.vis { visibility: hidden; }  /* space kept, no hover or click */
.op  { opacity: 0; }          /* space kept, still hoverable */
.op:hover  { opacity: 1; }    /* shows up on hover */
.vis:hover { visibility: visible; }  /* never fires */`,
  },
  {
    q: 'What does overflow do?',
    level: 'Intermediate',
    a: "overflow controls what happens when content is bigger than its box. visible lets it spill out, hidden cuts it off, scroll always shows scrollbars, and auto shows scrollbars only when they're needed. I use auto most of the time.",
    html: `<div class="box">
  Long text long text long text long text long text long text
  long text long text long text long text long text long text
</div>`,
    css: `.box {
  width: 200px;
  height: 50px;
  overflow: auto;
  border: 1px solid #6366f1;
}`,
  },
  {
    q: 'What are scroll-behavior and scroll-snap?',
    level: 'Intermediate',
    a: "scroll-behavior: smooth makes anchor links and scrollIntoView scroll smoothly instead of jumping. scroll-snap makes a scroll container stop at clean positions: I set scroll-snap-type on the container, like x mandatory, and scroll-snap-align on the children. That gives me a swipeable carousel with no JavaScript, and in real projects I only turn on smooth scrolling when the user hasn't asked for reduced motion.",
    html: `<div class="carousel">
  <div>Slide 1</div><div>Slide 2</div><div>Slide 3</div>
</div>`,
    css: `html { scroll-behavior: smooth; }  /* smooth anchor jumps */
.carousel {
  display: flex; gap: 8px; width: 240px; overflow-x: auto;
  scroll-snap-type: x mandatory;     /* always stop on a slide */
}
.carousel div {
  flex: 0 0 80%; height: 90px; background: #6366f1; color: white;
  scroll-snap-align: center;         /* snap each slide to the center */
}`,
  },
  {
    q: 'What does overscroll-behavior do?',
    level: 'Advanced',
    a: "When I scroll to the end of an inner scrolling box, the browser normally passes the scroll on to the page behind it, which is called scroll chaining. overscroll-behavior: contain stops that, so scrolling a modal, chat window or sidebar doesn't move the page underneath. overscroll-behavior-y: none on the body also turns off pull-to-refresh and the bounce effect on mobile.",
    html: `<div class="box">Scroll me to the end: the page behind stays still.<br />1<br />2<br />3<br />4<br />5</div>
<p style="height: 400px">Tall page</p>`,
    css: `.box {
  height: 100px;
  overflow-y: auto;
  border: 2px solid #6366f1;
  overscroll-behavior: contain;   /* no scroll chaining */
}`,
  },
  {
    q: 'What is margin collapsing?',
    level: 'Intermediate',
    a: "When two vertical margins touch, for example the bottom margin of one block and the top margin of the next, they collapse into one margin equal to the larger value, not the sum. It only happens with vertical margins on block elements, not inside flex or grid containers.",
    html: `<div class="a">margin-bottom: 30px</div>
<div class="b">margin-top: 20px</div>`,
    css: `div { background: #e0e7ff; padding: 6px; }
.a { margin-bottom: 30px; }
.b { margin-top: 20px; } /* gap is 30px, not 50px */`,
  },
  {
    q: 'How does position: sticky work?',
    level: 'Intermediate',
    a: "Sticky is like a mix of relative and fixed. The element scrolls normally until it reaches the offset I set, like top: 0, and then it sticks there while its parent is still on screen. I use it for table headers and section headers. It needs a top value to work.",
    html: `<div class="list">
  <div class="header">Sticky header</div>
  <p>1</p><p>2</p><p>3</p><p>4</p><p>5</p><p>6</p>
</div>`,
    css: `.list { height: 130px; overflow: auto; }
.header {
  position: sticky;
  top: 0;
  background: #6366f1; color: white;
}`,
  },
  {
    q: "How do you build a fixed header that doesn't cover the content?",
    level: 'Intermediate',
    a: "I give the header position: fixed with top: 0, left: 0 and right: 0, plus a z-index so it stays above the page. Because fixed takes it out of the normal flow, the content slides underneath it, so I add padding-top to the body equal to the header height, and scroll-padding-top on html so anchor links don't land under it. Often position: sticky is simpler, because the header keeps its space in the flow.",
    html: `<header>Fixed header</header>
<p>Scroll: the header stays on top.</p>
<p>2</p><p>3</p><p>4</p><p>5</p><p>6</p>`,
    css: `body { padding-top: 40px; }   /* make room for the header */
header {
  position: fixed;
  top: 0; left: 0; right: 0;
  height: 40px;
  background: #6366f1; color: white;
  z-index: 10;
}`,
  },
  {
    q: 'What does flex-wrap do?',
    level: 'Intermediate',
    a: "By default, flex items stay on one line and shrink to fit. With flex-wrap: wrap, they move onto the next line when there isn't enough space. I use it for things like tag lists or rows of cards.",
    html: `<div class="row">
  <div>1</div><div>2</div><div>3</div><div>4</div><div>5</div><div>6</div>
</div>`,
    css: `.row {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  width: 260px;
}
.row div { width: 70px; background: #6366f1; color: white; padding: 10px; text-align: center; }`,
  },
  {
    q: 'What is the difference between align-items and align-content?',
    level: 'Intermediate',
    a: "align-items aligns the items inside each line on the cross axis. align-content only matters when the items wrap onto several lines, and it moves the lines themselves, like space-between or center. So if align-content seems to do nothing, I check that flex-wrap: wrap is set and the container has spare height.",
    html: `<div class="box items"><b>1</b><b>2</b><b>3</b><b>4</b></div>
<div class="box content"><b>1</b><b>2</b><b>3</b><b>4</b></div>`,
    css: `.box { display: inline-flex; flex-wrap: wrap; width: 110px; height: 120px;
       background: #f1f5f9; margin-right: 12px; vertical-align: top; }
.items   { align-items: center; }    /* centered inside each line */
.content { align-content: center; }  /* lines packed in the middle */
b { background: #6366f1; color: white; width: 40px; margin: 2px; text-align: center; }`,
  },
  {
    q: 'What does the gap property do?',
    level: 'Basics',
    a: "gap sets the space between flex or grid items, but not around the outside edges. Before gap, I had to add margins to the items and then remove the extra margin on the last one. Now I just write gap: 10px, or row-gap and column-gap separately, and it also works nicely when items wrap.",
    html: `<div class="row"><b>1</b><b>2</b><b>3</b><b>4</b><b>5</b></div>`,
    css: `.row {
  display: flex; flex-wrap: wrap;
  width: 170px; border: 2px dashed #6366f1;
  gap: 12px 6px;   /* row-gap column-gap */
}
b { background: #6366f1; color: white; padding: 6px 12px; }`,
  },
  {
    q: 'What does flex: 1 mean?',
    level: 'Intermediate',
    a: "flex: 1 is shorthand for flex-grow: 1, flex-shrink: 1 and flex-basis: 0. It means the item takes up the remaining free space. If several items have flex: 1, they share the space equally.",
    html: `<div class="row">
  <div class="fixed">100px</div>
  <div class="grow">flex: 1 (fills the rest)</div>
</div>`,
    css: `.row { display: flex; gap: 8px; }
.fixed { width: 100px; background: #c7d2fe; padding: 10px; }
.grow  { flex: 1; background: #6366f1; color: white; padding: 10px; }`,
  },
  {
    q: 'What does flex-grow do?',
    level: 'Basics',
    a: "flex-grow decides how the leftover space in a flex container is shared. The default 0 means items keep their size; an item with flex-grow: 1 takes the free space, and one with 2 gets twice as much of it as an item with 1. I use flex-grow: 1 on a search input so it fills the row next to a fixed button.",
    html: `<div class="row"><b class="g0">0</b><b class="g1">1</b><b class="g2">2</b></div>
<div class="row"><input placeholder="Search" /><button>Go</button></div>`,
    css: `.row { display: flex; gap: 4px; width: 300px; margin-bottom: 8px; }
b { background: #6366f1; color: white; padding: 6px; }
.g0 { flex-grow: 0; }  /* keeps its size */
.g1 { flex-grow: 1; }  /* one share */
.g2 { flex-grow: 2; }  /* two shares */
input { flex-grow: 1; }`,
  },
  {
    q: 'What is grid-template-areas?',
    level: 'Intermediate',
    a: "grid-template-areas lets me name parts of the grid and draw the layout as text, like a map. Then I place each item with grid-area. It makes page layouts very readable, and for mobile I can just redefine the areas in a media query.",
    html: `<div class="page">
  <header>Header</header><aside>Side</aside><main>Main</main>
</div>`,
    css: `.page {
  display: grid; grid-template-columns: 80px 1fr;
  grid-template-areas:
    "header header"
    "side   main";
}
header { grid-area: header; background: #c7d2fe; }
aside  { grid-area: side; }
main   { grid-area: main; background: #e0e7ff; }`,
  },
  {
    q: 'How do you build the holy grail layout with grid?',
    level: 'Intermediate',
    a: "The holy grail layout is a header, a footer, and three columns in between: a left nav, the main content and a right sidebar, with the footer at the bottom. With grid I set grid-template-columns: 1fr for main with fixed side columns, rows of auto 1fr auto, and name the areas so the layout is readable. On small screens a media query can change the areas to a single column, without touching the HTML.",
    html: `<div class="page">
  <header>Header</header><nav>Nav</nav><main>Main</main>
  <aside>Side</aside><footer>Footer</footer></div>`,
    css: `.page {
  display: grid; height: 160px; gap: 4px;
  grid-template-columns: 60px 1fr 60px;
  grid-template-rows: auto 1fr auto;
  grid-template-areas: "header header header" "nav main aside" "footer footer footer";
}
header { grid-area: header; } nav { grid-area: nav; } main { grid-area: main; }
aside { grid-area: aside; } footer { grid-area: footer; }
.page > * { background: #c7d2fe; }`,
  },
  {
    q: 'How do you build a sticky footer layout?',
    level: 'Intermediate',
    a: "A sticky footer sits at the bottom of the screen when the content is short, but gets pushed down normally when the content is long. I give the page wrapper min-height: 100dvh with display: grid and grid-template-rows: auto 1fr auto, so the main area takes all the spare space. The flexbox version is a column with flex: 1 on main. It's different from position: fixed, which would cover the content.",
    html: `<div class="page">
  <header>Header</header>
  <main>Short content</main>
  <footer>Footer stays at the bottom</footer>
</div>`,
    css: `.page {
  min-height: 160px;   /* 100dvh on a real page */
  display: grid;
  grid-template-rows: auto 1fr auto;   /* main takes the spare space */
}
header, footer { background: #6366f1; color: white; }`,
  },
  {
    q: 'How do you make equal-height columns?',
    level: 'Intermediate',
    a: "With flexbox it's automatic: align-items defaults to stretch, so every item in a row grows to match the tallest one, and grid does the same for items in a row. So mostly I just make sure I don't set align-items: center or a fixed height, which would break the stretch. To line up buttons at the bottom of each card, I make the card a flex column and give the button margin-top: auto.",
    html: `<div class="row">
  <p>Short</p>
  <p>A much longer text that wraps onto several lines</p>
</div>`,
    css: `.row {
  display: flex;   /* align-items: stretch by default */
  gap: 6px;
}
p { flex: 1; margin: 0; background: #e0e7ff; }`,
  },
  {
    q: 'How do you show "..." when text is too long?',
    level: 'Intermediate',
    a: "I need three properties together: white-space: nowrap to keep the text on one line, overflow: hidden to hide the extra, and text-overflow: ellipsis to show the dots. The element also needs a width. For more than one line, I'd use line-clamp.",
    html: '<p class="short">This is a very long sentence that will not fit in the box</p>',
    css: `.short {
  width: 200px;
  white-space: nowrap;      /* keep on one line */
  overflow: hidden;         /* hide the extra */
  text-overflow: ellipsis;  /* show ... */
  border: 1px solid #6366f1;
  padding: 6px;
}`,
  },
  {
    q: 'How do you center with position and transform?',
    level: 'Intermediate',
    a: "I set the parent to position: relative and the child to position: absolute with top: 50% and left: 50%. That puts the child's top-left corner in the center, so I add transform: translate(-50%, -50%) to pull it back by half its own size. This was the classic method before flexbox.",
    html: `<div class="parent">
  <div class="child">Centered</div>
</div>`,
    css: `.parent { position: relative; height: 120px; background: #e0e7ff; }
.child {
  position: absolute;
  top: 50%; left: 50%;
  transform: translate(-50%, -50%);
  background: #6366f1; color: white;
}`,
  },
  {
    q: 'What are float and clear?',
    level: 'Intermediate',
    a: "float pushes an element to the left or right and lets text wrap around it, like an image in an article. clear makes an element start below any floats instead of wrapping beside them. Today I use flexbox or grid for layout and only use float for wrapping text around images.",
    html: `<div class="box">float</div>
<p>This text wraps around the floated box on the left side.</p>
<p class="clear">clear: both starts below the float.</p>`,
    css: `.box { float: left; width: 70px; height: 50px; background: #6366f1; color: white; margin-right: 8px; }
p { margin: 0 0 6px; }
.clear { clear: both; background: #fef3c7; }`,
  },
  {
    q: 'What is :not()?',
    level: 'Intermediate',
    a: ":not() selects elements that do not match the selector inside it. For example, button:not(.danger) styles every button except the danger one. It saves me from writing an extra override rule.",
    html: `<button>Save</button>
<button class="danger">Delete</button>
<button>Cancel</button>`,
    css: `button:not(.danger) { background: #e0e7ff; }
.danger { background: #ef4444; color: white; }
button { border: none; padding: 6px 12px; border-radius: 6px; }`,
  },
  {
    q: 'What is the difference between :is() and :where()?',
    level: 'Intermediate',
    a: "Both take a list of selectors and match any of them, so :is(h1, h2, h3) span is a short way to write three selectors. The difference is specificity: :is() takes the specificity of its strongest selector, while :where() always counts as zero. I use :where() in resets and library styles so they are easy to override, and :is() just to shorten long selectors.",
    html: `<div id="a"><p>:is(#a) p - stays crimson</p></div>
<div id="b"><p>:where(#b) p - loses to div p</p></div>`,
    css: `div p { color: green; font-weight: bold; }  /* 0-0-2 */

:is(#a) p    { color: crimson; }  /* 1-0-1: wins */
:where(#b) p { color: crimson; }  /* 0-0-1: loses */`,
  },
  {
    q: 'What is clamp()?',
    level: 'Intermediate',
    a: "clamp() takes a minimum, a preferred value and a maximum, and keeps the result inside that range. I use it for fluid font sizes, like clamp(18px, 6vw, 40px), so text scales with the screen without needing media queries.",
    html: '<h1 class="title">Responsive title</h1>',
    css: `.title {
  /* never smaller than 18px, never bigger than 40px */
  font-size: clamp(18px, 6vw, 40px);
  color: #6366f1;
}`,
  },
  {
    q: 'How do you write responsive, fluid typography?',
    level: 'Intermediate',
    a: "I set sizes in rem so they respect the user's browser font setting, and use clamp() with a rem plus vw mix for headings, like clamp(1.25rem, 1rem + 2vw, 2rem), so the text grows smoothly between a sensible minimum and maximum. For components I can use container query units like cqi, so the text scales with the card instead of the screen. I avoid pure vw font sizes, because they don't change when the user zooms, which is an accessibility problem.",
    html: `<h3>Fluid heading</h3>
<p>Resize the window: the heading grows and shrinks.</p>`,
    css: `h3 {
  /* never below 1.25rem, never above 2rem */
  font-size: clamp(1.25rem, 1rem + 2vw, 2rem);
}`,
  },
  {
    q: 'What do text-wrap: balance and text-wrap: pretty do?',
    level: 'Intermediate',
    a: "text-wrap: balance spreads the words evenly across the lines, so a heading doesn't end with one lonely word on the last line. It's meant for short text like headings, because browsers only balance a few lines for performance. For paragraphs I use text-wrap: pretty, which avoids a single orphan word at the end without balancing every line.",
    html: `<h3>Learn modern CSS layout techniques today</h3>
<h3 class="balance">Learn modern CSS layout techniques today</h3>`,
    css: `h3 { width: 220px; border: 1px dashed #94a3b8; }
.balance { text-wrap: balance; color: #4338ca; } /* even lines */
p { text-wrap: pretty; }          /* for body text */`,
  },
  {
    q: 'What is aspect-ratio?',
    level: 'Intermediate',
    a: "aspect-ratio keeps an element at a fixed width-to-height ratio. If I set the width and aspect-ratio: 16 / 9, the browser calculates the height for me. I use it for video embeds, thumbnails and cards.",
    html: '<div class="video">16 / 9</div>',
    css: `.video {
  width: 200px;
  aspect-ratio: 16 / 9;   /* height becomes 112.5px */
  background: #6366f1;
  color: white;
  display: grid;
  place-items: center;
}`,
  },
  {
    q: 'How do you make a triangle with CSS?',
    level: 'Intermediate',
    a: "I give the element zero width and height and use thick borders. Borders meet at diagonal angles, so if I color one border and make the two side borders transparent, I get a triangle. Today I could also use clip-path.",
    html: '<div class="triangle"></div>',
    css: `.triangle {
  width: 0;
  height: 0;
  border-left: 40px solid transparent;
  border-right: 40px solid transparent;
  border-bottom: 60px solid #6366f1;
}`,
  },
  {
    q: 'What is calc()?',
    level: 'Intermediate',
    a: "calc() lets me do math with mixed units, like calc(100% - 100px). It's useful when part of the layout has a fixed size and the rest should fill the remaining space. I have to put spaces around plus and minus, otherwise it doesn't work.",
    html: `<div class="sidebar">100px</div><div class="main">calc(100% - 100px)</div>`,
    css: `div { display: inline-block; box-sizing: border-box; }
.sidebar { width: 100px; background: #c7d2fe; }
.main {
  width: calc(100% - 100px);
  background: #6366f1;
  color: white;
}`,
  },
  {
    q: 'What do min() and max() do in CSS?',
    level: 'Intermediate',
    a: "min() picks the smallest of its values and max() picks the largest, and they work out the result live as the screen size changes. width: min(100%, 600px) means full width on small screens but never wider than 600px, all in one line. I use max() for things like padding that should grow with the viewport but never drop below a minimum.",
    html: `<div class="box">width: min(100%, 300px)</div>
<div class="pad">padding: max(12px, 4vw)</div>`,
    css: `.box {
  width: min(100%, 300px);   /* the smaller one wins */
  background: #c7d2fe; padding: 8px; margin-bottom: 8px;
}
.pad {
  padding: max(12px, 4vw);   /* the larger one wins */
  background: #fde68a;
}`,
  },
  {
    q: 'What is the :has() selector?',
    level: 'Advanced',
    a: ":has() is often called the parent selector. It selects an element based on what it contains, for example a card that contains a checked checkbox. Before :has(), I needed JavaScript to style a parent based on its children.",
    html: `<label class="card"><input type="checkbox" checked /> Checked card</label>
<label class="card"><input type="checkbox" /> Click to check me</label>`,
    css: `.card { display: block; padding: 8px; border: 2px solid #ddd; }
.card:has(input:checked) {   /* parent styled by its child */
  border-color: #6366f1;
  background: #e0e7ff;
}`,
  },
  {
    q: 'What is currentColor?',
    level: 'Intermediate',
    a: "currentColor is a keyword that uses the element's current text color. If I set the border to currentColor, it always matches the text, and when the color changes on hover, the border changes with it. It's also handy for SVG icons with fill: currentColor.",
    html: '<button class="btn">Hover me</button>',
    css: `.btn {
  color: #6366f1;
  border: 2px solid currentColor;   /* same as the text color */
  background: white;
  padding: 6px 12px;
}
.btn:hover { color: #ef4444; }      /* border follows */`,
  },
  {
    q: 'How do you implement dark mode in CSS?',
    level: 'Advanced',
    a: "I define the colors as CSS variables, then override them for dark mode, either with a class like .dark on a parent or with the prefers-color-scheme media query to follow the user's system setting. Because every component uses the variables, switching themes only changes the variables, not every rule.",
    html: `<div class="card">Light theme</div>
<div class="dark">
  <div class="card">Dark theme</div>
</div>`,
    css: `:root { --bg: white; --text: #111827; }
.dark { --bg: #1f2937; --text: #f9fafb; }
/* or follow the system: @media (prefers-color-scheme: dark) { :root { ... } } */
.card { background: var(--bg); color: var(--text); padding: 10px; }`,
  },
  {
    q: 'What is mobile-first design?',
    level: 'Intermediate',
    a: "Mobile-first means I write the base styles for small screens first, then add min-width media queries to improve the layout on bigger screens. Mobile styles are usually simpler, so this keeps the CSS smaller, and phones don't have to load and then override desktop styles.",
    html: `<div class="grid">
  <div>1</div><div>2</div><div>3</div>
</div>`,
    css: `/* Base: mobile, 1 column */
.grid { display: grid; gap: 6px; grid-template-columns: 1fr; }
.grid div { background: #6366f1; color: white; padding: 10px; }
/* Bigger screens: 3 columns */
@media (min-width: 400px) {
  .grid { grid-template-columns: repeat(3, 1fr); }
}`,
  },
  {
    q: 'How do you hide text visually but keep it for screen readers?',
    level: 'Advanced',
    a: "If I use display: none, screen readers ignore the element too. To hide text visually but keep it accessible, I use an sr-only class that shrinks it to 1 pixel and clips it. I use it for icon-only buttons, so a screen reader still announces something like 'Close menu'.",
    html: `<button>
  <span aria-hidden="true">✕</span>
  <span class="sr-only">Close menu</span>
</button>`,
    css: `.sr-only {
  position: absolute; width: 1px; height: 1px;
  padding: 0; margin: -1px; border: 0;
  overflow: hidden; clip: rect(0, 0, 0, 0); white-space: nowrap;
}`,
  },
  {
    q: 'How do you check color contrast and keep styles accessible?',
    level: 'Intermediate',
    a: "WCAG AA needs a contrast ratio of at least 4.5:1 for normal text and 3:1 for large text, and I check it with the contrast picker in Chrome DevTools or Lighthouse. I also never use color alone to show meaning, so errors get an icon or text too, and I keep a visible focus ring with :focus-visible. Light gray placeholder-style text is the most common failure I see in reviews.",
    html: `<p class="bad">Light gray: fails</p>
<p class="good">Dark slate: passes</p>
<p class="error">✕ Email is required</p>
<button>Tab to me</button>`,
    css: `.bad   { color: #b0b0b0; }  /* about 2:1 */
.good  { color: #334155; }  /* over 10:1 */
.error { color: #b91c1c; }  /* icon + text, not color alone */
button:focus-visible { outline: 3px solid #6366f1; }`,
  },
  {
    q: 'What does pointer-events: none do?',
    level: 'Intermediate',
    a: "pointer-events: none makes an element ignore mouse clicks and hovers, so they pass through to whatever is underneath. I use it for overlays and decorative layers. It doesn't stop keyboard focus, so for a real disabled button I use the disabled attribute instead.",
    html: `<button class="off">Can't hover or click me</button>
<button>Normal button</button>`,
    css: `button { padding: 6px 12px; border: 1px solid #6366f1; background: white; }
button:hover { background: #c7d2fe; }
.off { pointer-events: none; opacity: 0.5; }`,
  },
  {
    q: 'What does the cursor property do?',
    level: 'Basics',
    a: "cursor sets the mouse pointer shown when hovering an element, like pointer for clickable things, text, move, wait or not-allowed. Buttons and links don't all get the hand cursor by default, so I add cursor: pointer to custom clickable elements. I use not-allowed on disabled controls so users understand why nothing happens.",
    html: `<p>Hover each one:</p>
<span class="pointer">pointer</span>
<span class="not">not-allowed</span>
<span class="move">move</span>
<span class="help">help</span>
<span class="wait">wait</span>`,
    css: `span { display: inline-block; padding: 6px 10px; margin: 4px;
       border: 1px solid #6366f1; border-radius: 6px; }
.pointer { cursor: pointer; }
.not     { cursor: not-allowed; opacity: 0.5; }
.move    { cursor: move; }
.help    { cursor: help; }
.wait    { cursor: wait; }`,
  },
  {
    q: 'How do you fix a parent that collapses around floated children?',
    level: 'Intermediate',
    a: "When all the children are floated, the parent's height collapses to zero, because floats are taken out of the normal flow. The modern fix is display: flow-root on the parent, which creates a new block formatting context so it wraps its floats. The older fixes were overflow: hidden or a clearfix using ::after.",
    html: `<div class="parent">no fix<div class="float">float</div></div>
<div class="parent fixed">flow-root<div class="float">float</div></div>`,
    css: `.parent { border: 2px solid #6366f1; margin-bottom: 60px; }
.float  { float: left; width: 60px; height: 40px; background: #fca5a5; }
.fixed  { display: flow-root; margin-bottom: 0; }  /* wraps the float */`,
  },
  {
    q: 'What is CSS nesting? Do we still need SASS?',
    level: 'Advanced',
    a: "Nesting lets me write child rules inside the parent rule, which keeps related styles together. It used to need a preprocessor like SASS, but modern browsers now support it natively with the & symbol. SASS still adds mixins, functions and partials, but with CSS variables and native nesting I need it much less.",
    html: `<div class="card">
  <h4>Title</h4>
  <p>Hover the card</p>
</div>`,
    css: `.card {
  padding: 10px;
  border: 1px solid #6366f1;
  & h4 { margin: 0; color: #6366f1; }
  & p { margin: 4px 0 0; }
  &:hover { background: #e0e7ff; }
}`,
  },
  {
    q: 'What is utility-first CSS, like Tailwind?',
    level: 'Advanced',
    a: "Utility-first CSS uses small single-purpose classes like p-4 or bg-indigo, and I build the design by combining them in the HTML instead of writing custom CSS. The benefits are speed, consistent spacing and colors, and small CSS files, because unused classes are removed at build time. The downside is long class lists, which I handle by making reusable components.",
    html: '<div class="p-4 bg-indigo text-white rounded">Built only with utility classes</div>',
    css: `/* Each class does one thing */
.p-4        { padding: 16px; }
.bg-indigo  { background: #6366f1; }
.text-white { color: white; }
.rounded    { border-radius: 8px; }`,
  },
  {
    q: 'background-size: cover vs contain?',
    level: 'Intermediate',
    a: "cover scales the image until it fills the whole box, so part of the image may be cropped. contain scales it until the whole image fits inside, so there may be empty space around it. I use cover for hero banners and contain for logos where nothing should be cut off.",
    html: `<div class="box cover">cover</div>
<div class="box contain">contain</div>`,
    css: `.box {
  display: inline-block; width: 120px; height: 100px; border: 2px solid #6366f1;
  /* a 2:1 image: blue rectangle with a yellow circle */
  background: #fef3c7 no-repeat center url("data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 2 1'><rect width='2' height='1' fill='%236366f1'/><circle cx='1' cy='.5' r='.4' fill='%23fbbf24'/></svg>");
}
.cover   { background-size: cover; }   /* fills, sides cropped */
.contain { background-size: contain; } /* fits, empty space */`,
  },
  {
    q: 'What do background-repeat, background-position and background-attachment do?',
    level: 'Basics',
    a: "A background image repeats to fill the box by default, and background-repeat: no-repeat (or repeat-x / repeat-y) changes that. background-position places it, like center or right top, and background-attachment: fixed keeps it still while the page scrolls. I usually write it all in the shorthand, like background: url(hero.jpg) no-repeat center / cover.",
    html: `<div class="box"><span>repeat (default)</span></div>
<div class="box once"><span>no-repeat + center</span></div>`,
    css: `.box {
  height: 70px; margin-bottom: 8px; border: 1px solid #6366f1;
  background-image: radial-gradient(circle, #6366f1 40%, transparent 42%);
  background-size: 24px 24px;
}
.once { background-repeat: no-repeat; background-position: center; }
span { background: white; padding: 2px 4px; }
/* background-attachment: fixed; keeps it still while the page scrolls */`,
  },
  {
    q: 'What are linear and radial gradients? Can you use multiple backgrounds?',
    level: 'Intermediate',
    a: "A linear gradient blends colors along a straight line in a direction or angle, and a radial gradient spreads out from a center point. Gradients count as background images, so I can stack several backgrounds separated by commas, and the first one is drawn on top. I use this for overlays, like a dark gradient over a photo so the text is readable.",
    html: `<div class="box linear">linear</div>
<div class="box radial">radial</div>
<div class="box multi">multiple</div>`,
    css: `.box { display: inline-block; width: 90px; height: 90px; color: white; }
.linear { background: linear-gradient(135deg, #6366f1, #ec4899); }
.radial { background: radial-gradient(circle, #fbbf24, #ea580c); }
/* two layers: the first one (white dot) is drawn on top */
.multi { background: radial-gradient(circle, white 20%, transparent 21%), linear-gradient(#10b981, #0e7490); }`,
  },
  {
    q: 'box-shadow vs text-shadow vs filter: drop-shadow()?',
    level: 'Intermediate',
    a: "box-shadow draws a shadow around the element's rectangular box, and text-shadow draws it behind the letters only. filter: drop-shadow() follows the actual visible shape, including transparent parts, so it works for icons, PNGs and CSS triangles. On the triangle below, box-shadow still shows a rectangle, but drop-shadow follows the triangle.",
    html: `<div class="card">box-shadow</div>
<p class="text">text-shadow</p>
<div class="tri box"></div><div class="tri drop"></div>`,
    css: `.card { width: 120px; box-shadow: 0 4px 12px rgba(0, 0, 0, 0.25); }
.text { font-size: 20px; text-shadow: 2px 2px 0 #fbbf24; }
.tri {
  display: inline-block; margin-right: 40px;
  border: 30px solid transparent; border-top: 0; border-bottom: 40px solid #6366f1;
}
.box  { box-shadow: 6px 6px 0 #f87171; }         /* rectangle */
.drop { filter: drop-shadow(6px 6px 0 #f87171); } /* follows the shape */`,
  },
  {
    q: 'How do you make a circle with CSS?',
    level: 'Intermediate',
    a: "I give the element the same width and height and set border-radius: 50%. If the width and height are different, the same value gives an oval. For pill-shaped buttons I use a very large radius like 999px, so the ends are always fully round whatever the height.",
    html: `<div class="circle"></div>
<div class="oval"></div>
<button class="pill">Pill button</button>`,
    css: `div { display: inline-block; width: 70px; height: 70px; background: #6366f1; }
.circle { border-radius: 50%; }               /* equal sides */
.oval   { width: 110px; border-radius: 50%; } /* unequal sides */
.pill   { display: block; margin-top: 10px; border-radius: 999px; }`,
  },
  {
    q: 'What do the order and align-self properties do in flexbox?',
    level: 'Intermediate',
    a: "order changes the visual position of a flex item without changing the HTML, and items with lower values come first, the default being 0. align-self overrides the container's align-items for just one item. I'm careful with order because screen readers and the Tab key still follow the HTML order.",
    html: `<div class="row">
  <b>1</b><b>2</b>
  <b class="first">3 (order: -1)</b>
  <b class="bottom">4 (align-self)</b>
</div>`,
    css: `.row { display: flex; align-items: flex-start; gap: 6px; height: 110px; }
b { background: #6366f1; color: white; padding: 8px; }
.first  { order: -1; }            /* moves to the front */
.bottom { align-self: flex-end; } /* only this one at the bottom */`,
  },
  {
    q: 'What are flex-basis and flex-shrink?',
    level: 'Intermediate',
    a: "flex-basis is the starting size of a flex item before free space is shared out, a bit like width in a row. flex-shrink controls how much an item shrinks when there isn't enough room, and the default is 1. I set flex-shrink: 0 on things like avatars or icons so they never get squashed.",
    html: `<div class="row">
  <b>shrinks</b><b>shrinks</b><b class="keep">shrink: 0</b>
</div>`,
    css: `.row { display: flex; width: 300px; border: 2px dashed #6366f1; } /* 3 x 150px won't fit */
b { flex-basis: 150px; background: #c7d2fe; border: 1px solid white; } /* starting size */
.keep { flex-shrink: 0; background: #fbbf24; } /* stays 150px */`,
  },
  {
    q: 'auto-fit vs auto-fill in CSS Grid?',
    level: 'Intermediate',
    a: "With repeat(auto-fill, minmax(70px, 1fr)) the grid creates as many columns as fit, and keeps empty ones even if there aren't enough items. auto-fit collapses the empty columns, so the existing items stretch to fill the row. I use auto-fit with minmax for responsive card grids without any media queries.",
    html: `<p>auto-fill (keeps empty columns)</p>
<div class="grid fill"><div>1</div><div>2</div></div>
<p>auto-fit (items stretch)</p>
<div class="grid fit"><div>1</div><div>2</div></div>`,
    css: `.grid { display: grid; gap: 6px; background: #f1f5f9; }
.fill { grid-template-columns: repeat(auto-fill, minmax(70px, 1fr)); }
.fit  { grid-template-columns: repeat(auto-fit,  minmax(70px, 1fr)); }

.grid div { background: #6366f1; color: white; padding: 8px; text-align: center; }
p { margin: 4px 0; font-size: 12px; }`,
  },
  {
    q: 'How do you make a grid item span multiple columns or rows?',
    level: 'Intermediate',
    a: "I use grid-column: span 2 to make an item take two columns, and grid-row: span 2 for two rows. I can also give exact lines, like grid-column: 1 / -1 to stretch across the full width. This is how I build featured cards or dashboard tiles of different sizes.",
    html: `<div class="grid">
  <b class="wide">span 2 columns</b><b class="tall">span 2 rows</b>
  <b>3</b><b>4</b><b class="full">1 / -1 (full width)</b>
</div>`,
    css: `.grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 6px; }
b { background: #c7d2fe; padding: 8px; }
.wide { grid-column: span 2; }
.tall { grid-row: span 2; background: #fbbf24; }
.full { grid-column: 1 / -1; }`,
  },
  {
    q: 'What is a stacking context? How does isolation: isolate help?',
    level: 'Advanced',
    a: "A stacking context is a group of elements that are layered together, and z-index only competes inside the same group. A parent with position and z-index, opacity below 1, or transform creates one, so a child with z-index: 999 still can't go above something outside its parent. I use isolation: isolate on components to create a clean stacking context on purpose, so their inner z-index values don't leak out.",
    html: `<div class="parent">
  parent z-index: 1
  <div class="child">child z-index: 999</div>
</div>
<div class="other">other z-index: 2</div>`,
    css: `div { position: absolute; padding: 6px; color: white; }
.parent { z-index: 1; width: 180px; height: 90px; background: #94a3b8; }
/* 999 only counts inside the parent's stacking context */
.child { z-index: 999; top: 40px; left: 60px; background: #ef4444; }
.other { z-index: 2; top: 60px; left: 150px; height: 70px; background: #6366f1; }`,
  },
  {
    q: 'What does object-fit do?',
    level: 'Intermediate',
    a: "object-fit controls how an image or video fills its box when the box has a different shape than the image. fill, the default, stretches it, cover fills and crops, and contain shows the whole image with empty space. I use object-fit: cover on avatars and thumbnails so they're never squashed.",
    html: `<img class="fill" alt="fill" src="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' width='200' height='100' viewBox='0 0 2 1' preserveAspectRatio='none'><rect width='2' height='1' fill='%236366f1'/><circle cx='1' cy='.5' r='.4' fill='%23fbbf24'/></svg>" />
<img class="cover" alt="cover" src="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' width='200' height='100' viewBox='0 0 2 1' preserveAspectRatio='none'><rect width='2' height='1' fill='%236366f1'/><circle cx='1' cy='.5' r='.4' fill='%23fbbf24'/></svg>" />
<img class="contain" alt="contain" src="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' width='200' height='100' viewBox='0 0 2 1' preserveAspectRatio='none'><rect width='2' height='1' fill='%236366f1'/><circle cx='1' cy='.5' r='.4' fill='%23fbbf24'/></svg>" />`,
    css: `img { width: 90px; height: 90px; border: 2px solid #94a3b8; } /* 2:1 image, square box */
.fill    { object-fit: fill; }    /* stretched: circle becomes oval */
.cover   { object-fit: cover; }   /* fills the box, sides cropped */
.contain { object-fit: contain; } /* whole image, empty space */`,
  },
  {
    q: 'How do responsive images work with srcset, sizes and picture?',
    level: 'Intermediate',
    a: "srcset with width descriptors lists the same image at several sizes, and sizes tells the browser how wide the image will be shown, so it downloads the smallest file that still looks sharp on that screen. picture with source elements is for art direction or formats: the browser uses the first source whose media or type matches, like a tighter crop on mobile or AVIF with a JPEG fallback. CSS then controls the box with width: 100% and object-fit: cover, so the image is never stretched.",
    html: `<!-- <img srcset="s.jpg 400w, l.jpg 800w" sizes="(min-width: 600px) 50vw, 100vw" alt="" /> -->
<picture>
  <source media="(min-width: 350px)" srcset="data:image/svg+xml,<svg%20xmlns='http://www.w3.org/2000/svg'%20width='300'%20height='120'><rect%20width='300'%20height='120'%20fill='%236366f1'/></svg>" />
  <img alt="demo" src="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' width='120' height='120'><rect width='120' height='120' fill='%23f59e0b'/></svg>" />
</picture>
<p>Wide preview: blue image. Narrow preview: orange image.</p>`,
    css: `img { width: 100%; max-width: 300px; height: 110px; object-fit: cover; }`,
  },
  {
    q: 'What does the filter property do?',
    level: 'Intermediate',
    a: "filter applies visual effects like blur, grayscale, brightness, contrast and drop-shadow to an element and everything inside it. I use grayscale for disabled or inactive logos that turn colored on hover. If I want to blur only what's behind an element, like a frosted glass header, I use backdrop-filter instead.",
    html: `<div class="box">normal</div><div class="box blur">blur</div>
<div class="box gray">grayscale</div><div class="box bright">brightness</div>`,
    css: `.box {
  display: inline-block; width: 70px; height: 70px; margin: 4px; color: white;
  background: linear-gradient(135deg, #f43f5e, #6366f1);
}
.blur   { filter: blur(2px); }
.gray   { filter: grayscale(1); }
.bright { filter: brightness(1.5); }`,
  },
  {
    q: 'What are the transform functions and transform-origin?',
    level: 'Intermediate',
    a: "transform lets me rotate, scale, skew and translate an element without affecting the layout around it, so neighbours don't move. transform-origin sets the point it transforms around, which is the center by default. Transforms are also cheap to animate, because the browser can do them on the GPU, so I prefer them over animating top or left.",
    html: `<div class="rotate">rotate</div><div class="scale">scale</div><div class="skew">skew</div>
<div class="move">translate</div><div class="corner">origin</div>`,
    css: `div { display: inline-block; width: 60px; height: 40px; margin: 20px 10px; background: #6366f1; color: white; }
.rotate { transform: rotate(20deg); }
.scale  { transform: scale(1.3); }
.skew   { transform: skewX(-20deg); }
.move   { transform: translate(10px, 15px); }
.corner { transform: rotate(20deg); transform-origin: top left; background: #f59e0b; }`,
  },
  {
    q: 'Explain animation-iteration-count, direction and fill-mode. What is prefers-reduced-motion?',
    level: 'Advanced',
    a: "iteration-count sets how many times the animation runs, or infinite. direction: alternate plays it forwards and then backwards, and fill-mode: forwards keeps the final keyframe styles after it ends instead of jumping back. For accessibility I always add a prefers-reduced-motion media query, because some users get dizzy from motion and turn it off in their system settings.",
    html: `<div class="ball loop">alternate, infinite</div>
<div class="ball once">once, forwards</div>`,
    css: `.ball { width: 130px; margin-bottom: 10px; background: #6366f1; color: white; animation: slide 1.5s; }
.loop { animation-iteration-count: infinite; animation-direction: alternate; }
.once { animation-fill-mode: forwards; background: #f59e0b; }  /* stays at the end */
@keyframes slide { to { transform: translateX(120px); } }
@media (prefers-reduced-motion: reduce) {
  .ball { animation: none; }
}`,
  },
  {
    q: 'What are container queries?',
    level: 'Advanced',
    a: "Media queries look at the size of the whole viewport, but container queries look at the size of the parent container. I mark a parent with container-type: inline-size, then use @container to change the child's layout. This makes components truly reusable, because the same card can be stacked in a narrow sidebar and side by side in a wide main area.",
    html: `<div class="wrap wide"><div class="card"><b>Img</b><span>Wide: row</span></div></div>
<div class="wrap narrow"><div class="card"><b>Img</b><span>Narrow: column</span></div></div>`,
    css: `.wrap { container-type: inline-size; margin-bottom: 8px; }
.wide { width: 280px; }
.narrow { width: 150px; }
.card { display: flex; flex-direction: column; background: #e0e7ff; }
.card b { background: #6366f1; color: white; padding: 6px; }
@container (min-width: 200px) {   /* the container's width, not the screen */
  .card { flex-direction: row; }
}`,
  },
  {
    q: 'What does display: contents do?',
    level: 'Advanced',
    a: "display: contents makes the element's own box disappear, so its children behave as if they were direct children of its parent. That's useful when a wrapper div, for example one a component forces on me, breaks a flex or grid layout. Here the wrapper's children become grid items and fill the row. I'm careful using it on buttons, lists or headings, because some browsers used to drop their meaning for screen readers.",
    html: `<div class="grid"><div class="wrap"><b>A</b><b>B</b></div><b>C</b></div>
<div class="grid"><div class="wrap contents"><b>A</b><b>B</b></div><b>C</b></div>`,
    css: `.grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 4px; margin-bottom: 12px; }
b { background: #c7d2fe; padding: 8px; }
.wrap { border: 2px dashed #ef4444; }
.contents { display: contents; }  /* box disappears: A and B become grid items */`,
  },
  {
    q: 'What are logical properties like margin-inline and padding-block?',
    level: 'Advanced',
    a: "Logical properties use the text direction instead of physical sides. inline means the direction text flows, so left and right in English, and block means top and bottom. If I write margin-inline-start instead of margin-left, the layout flips automatically for right-to-left languages like Arabic.",
    html: `<p class="note">English (left to right)</p>
<p class="note" dir="rtl">عربي (right to left)</p>`,
    css: `.note {
  padding-block: 8px;                        /* top + bottom */
  padding-inline: 12px;                      /* left + right */
  border-inline-start: 6px solid #6366f1;    /* left in LTR, right in RTL */
  background: #e0e7ff;
  margin-block: 0 8px;
}`,
  },
  {
    q: ':first-child vs :first-of-type?',
    level: 'Intermediate',
    a: ":first-child only matches if the element is the very first child of its parent, whatever the type. :first-of-type matches the first element of that tag among its siblings. So if a card starts with an h4, p:first-child matches nothing, but p:first-of-type matches the first paragraph.",
    html: `<div class="card">
  <h4>Heading comes first</h4>
  <p>First p</p>
  <p>Second p</p>
</div>`,
    css: `h4 { margin: 0 0 6px; }
p  { margin: 4px 0; }

p:first-child   { color: red; }          /* matches nothing here */
p:first-of-type { color: #6366f1; font-weight: bold; } /* first p */`,
  },
  {
    q: 'How do you build a toggle with only CSS using :checked?',
    level: 'Advanced',
    a: "I put a hidden checkbox before the content, connect a label to it, and use :checked together with the sibling selector to show or style the next element. Clicking the label toggles the checkbox, so it works without any JavaScript. It's nice for simple accordions or toggles, but for complex widgets I still use JavaScript and proper ARIA attributes.",
    html: `<input type="checkbox" id="more" />
<label for="more">Show details</label>
<div class="panel">Hidden content, toggled with CSS only.</div>`,
    css: `#more { position: absolute; opacity: 0; }  /* hidden but focusable */
label { padding: 6px 12px; background: #6366f1; color: white; cursor: pointer; }
.panel { display: none; margin-top: 12px; background: #e0e7ff; }
#more:checked ~ .panel { display: block; }  /* when checked, show the panel */`,
  },
  {
    q: 'What are CSS counters?',
    level: 'Advanced',
    a: "CSS counters let me number elements automatically without writing the numbers in the HTML. I start one with counter-reset on the parent, increase it with counter-increment, and show it with counter() inside the content of a ::before. I use them for numbered steps or headings in documentation.",
    html: `<div class="steps">
  <div>Install</div>
  <div>Import</div>
  <div>Run</div>
</div>`,
    css: `.steps { counter-reset: step; }          /* start at 0 */
.steps div { counter-increment: step; }  /* +1 for each div */
.steps div::before { content: "Step " counter(step) ": "; }  /* show it */`,
  },
  {
    q: 'What is BEM naming?',
    level: 'Advanced',
    a: "BEM stands for Block, Element, Modifier. The block is the component, like .card, an element is a part of it, written .card__title, and a modifier is a variation, written .card--featured. I like it because every class has a single, low specificity and the names tell me where the styles belong, so nothing clashes in a big project.",
    html: `<div class="card">
  <h4 class="card__title">Normal</h4>
</div>
<div class="card card--featured">
  <h4 class="card__title">Featured</h4>
</div>`,
    css: `.card { padding: 10px; border: 1px solid #cbd5e1; }              /* block */
.card__title { margin: 0; }                                        /* element */
.card--featured { border-color: #6366f1; background: #eef2ff; }  /* modifier */`,
  },
  {
    q: 'How do you write print styles?',
    level: 'Advanced',
    a: "I add an @media print block to hide things that are useless on paper, like navigation, buttons and ads, switch to black text on white to save ink, and show link URLs with attr(href) in an ::after. I also use break-inside: avoid so cards and tables don't split across two pages. In Chrome DevTools I test it with Rendering, Emulate CSS media type: print. Here I copied the same rules outside the media query so you can see the result.",
    html: `<nav>Home | Blog</nav>
<p>Read the <a href="https://example.com">docs</a>.</p>
<button>Share</button>`,
    css: `@media print {
  nav, button { display: none; }
  a::after { content: " (" attr(href) ")"; }
  .card { break-inside: avoid; }
}
/* the same rules outside @media, to preview the printed page */
nav, button { display: none; }
a::after { content: " (" attr(href) ")"; }`,
  },
  {
    q: '@import vs link, and what is critical CSS?',
    level: 'Advanced',
    a: "With link tags in the HTML, the browser finds every stylesheet straight away and downloads them in parallel. An @import inside a CSS file is only discovered after that file has downloaded, so it creates a chain of requests that delays rendering; imports that a bundler merges at build time are fine. Critical CSS means inlining the few styles needed for the top of the page in a style tag in the head, and loading the rest without blocking, so the first paint happens sooner.",
    html: `<p>link tags: both files download in parallel</p>
<div class="bar">main.css</div><div class="bar">theme.css</div>
<p>@import in main.css: theme.css starts only after main.css</p>
<div class="bar">main.css</div><div class="bar late">theme.css</div>`,
    css: `p { margin: 6px 0 2px; }
.bar { width: 45%; margin-bottom: 2px; background: #6366f1; color: white; }
.late { margin-left: 45%; background: #ef4444; }`,
  },
  {
    q: 'CSS-in-JS vs CSS Modules?',
    level: 'Advanced',
    a: "CSS Modules are normal .css files where the build tool renames every class to a unique hashed name, like Button_primary__x7f2a, so styles are scoped to one component with no runtime cost. CSS-in-JS libraries like styled-components let me write styles in JavaScript, which makes styles based on props easy, but the runtime ones add JavaScript and slow rendering, and they don't fit well with React Server Components. For new projects I'd pick CSS Modules, Tailwind, or a zero-runtime CSS-in-JS tool.",
    html: `<!-- Button.module.css and Card.module.css both have .primary,
     the build renames them so they never clash: -->
<button class="Button_primary__x7f2a">Button.primary</button>
<button class="Card_primary__k21b9">Card.primary</button>`,
    css: `/* compiled output */
.Button_primary__x7f2a { background: #6366f1; color: white; }
.Card_primary__k21b9 { background: white; color: #b45309; }`,
  },
  {
    q: 'What does will-change do, and why are transform and opacity fast to animate?',
    level: 'Advanced',
    a: "The browser renders in three steps: layout, paint and composite. Animating left, width or top forces layout and paint on every frame, but transform and opacity can be done by the compositor on the GPU, so they stay smooth even when the main thread is busy. will-change: transform tells the browser to put the element on its own layer ahead of time; I only add it to elements that will really animate, because every layer uses memory.",
    html: `<div class="slow">left</div>
<div class="fast">transform</div>`,
    css: `div { position: relative; width: 90px; margin-bottom: 8px; color: white; }
/* layout + paint on every frame */
.slow { background: #ef4444; animation: slide-left 1.5s infinite alternate; }
/* compositor only, on its own layer */
.fast { background: #10b981; will-change: transform; animation: slide-x 1.5s infinite alternate; }
@keyframes slide-left { to { left: 150px; } }
@keyframes slide-x { to { transform: translateX(150px); } }`,
  },
  {
    q: 'Reflow vs repaint: what is layout thrashing?',
    level: 'Advanced',
    a: "A reflow, or layout, is when the browser recalculates the size and position of elements, for example after changing width or font size or adding elements, and it can spread to the whole page. A repaint only redraws pixels, like after a color or background change, so it's cheaper, and transform or opacity changes skip both. Layout thrashing is when JavaScript writes a style and then reads a value like offsetHeight in a loop, forcing a reflow every time; I fix it by doing all the reads first, then all the writes, or by using requestAnimationFrame.",
    html: `<div class="layout">Layout: width (hover)</div>
<div class="paint">Paint: background (hover)</div>
<div class="composite">Composite: transform (hover)</div>`,
    css: `div { width: 220px; margin-bottom: 8px; background: #e0e7ff; transition: all 0.3s; }
.layout:hover    { width: 260px; }                /* reflow + repaint */
.paint:hover     { background: #f59e0b; }         /* repaint only */
.composite:hover { transform: translateX(20px); } /* no layout, no paint */`,
  },
]

function Preview({ html, css }) {
  const doc = `<style>body{margin:12px;font-family:system-ui,sans-serif;font-size:14px}${css}</style>${html}`
  return (
    <iframe
      title="preview"
      srcDoc={doc}
      className="mt-1 min-h-40 w-full flex-1 rounded-lg border border-slate-200 bg-white"
    />
  )
}

function CssCard({ item, number }) {
  const [open, setOpen] = useState(false)

  return (
    <div className="grid gap-4 rounded-xl border border-slate-200 bg-white p-4 shadow-sm md:grid-cols-2">
      <div className="min-w-0">
        <div className="flex items-start justify-between gap-3">
          <h2 className="font-semibold text-indigo-600">
            Q{number}. {item.q}
          </h2>
          <TryItButton open={open} onClick={() => setOpen(!open)} />
        </div>
        <p className="mt-3 text-xs font-semibold text-slate-400 uppercase">Answer</p>
        <p className="mt-1 text-sm leading-relaxed text-slate-700">{item.a}</p>

        <p className="mt-3 text-xs font-semibold text-slate-400 uppercase">HTML</p>
        <CodeBlock code={item.html} language="html" className="mt-1" />

        <p className="mt-3 text-xs font-semibold text-slate-400 uppercase">CSS</p>
        <CodeBlock code={item.css} language="css" className="mt-1" />
      </div>

      <div className="flex min-w-0 flex-col">
        <p className="text-xs font-semibold text-slate-400 uppercase">Output</p>
        <Preview html={item.html} css={item.css} />
      </div>

      {open && (
        <div className="min-w-0 md:col-span-2">
          <TryIt kind="css" html={item.html} css={item.css} />
        </div>
      )}
    </div>
  )
}

function CssQuestions() {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-slate-900">CSS Interview Questions</h1>
      <p className="mt-1 text-sm text-slate-500">
        {questions.length} questions · Click "Try it" to edit the HTML and CSS
      </p>

      <LevelSections
        questions={questions}
        topics={topics}
        renderItem={(item, number) => <CssCard key={item.q} item={item} number={number} />}
      />
    </div>
  )
}

export default CssQuestions
