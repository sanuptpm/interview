# New CSS questions: (anchor title in file + topics, topic anchor, entry). Inserted AFTER the anchor.
# Each entry: q, level, a, html, css (html/css must avoid backticks and "${").
CSS = [
  dict(after='How does the cascade decide which rule wins? When is !important okay?',
       topic_after='What do inherit, initial, unset and revert do?',
       q='What are cascade layers (@layer)?', level='Advanced',
       a="@layer puts rules into named layers, and the order I declare the layers decides who wins, before specificity is even compared. So a simple class in a later layer beats an ID selector in an earlier layer, and styles outside any layer beat all layers. I use it to keep resets, a third-party library and my components in a fixed order, so I never need !important to override a library.",
       html='''<div id="main">
  <button class="btn">components layer wins</button>
</div>''',
       css='''@layer base, components;  /* later layer wins */

@layer base {
  #main .btn { background: gray; }  /* ID, but earlier layer */
}
@layer components {
  .btn { background: #6366f1; color: white; }
}
button { padding: 8px 14px; border: 0; }  /* unlayered */'''),
  dict(after='What is :not()?', topic_after='What is :not()?',
       q='What is the difference between :is() and :where()?', level='Intermediate',
       a="Both take a list of selectors and match any of them, so :is(h1, h2, h3) span is a short way to write three selectors. The difference is specificity: :is() takes the specificity of its strongest selector, while :where() always counts as zero. I use :where() in resets and library styles so they are easy to override, and :is() just to shorten long selectors.",
       html='''<div id="a"><p>:is(#a) p - stays crimson</p></div>
<div id="b"><p>:where(#b) p - loses to div p</p></div>''',
       css='''div p { color: green; font-weight: bold; }  /* 0-0-2 */

:is(#a) p    { color: crimson; }  /* 1-0-1: wins */
:where(#b) p { color: crimson; }  /* 0-0-1: loses */'''),
  dict(after='How do you write colors in CSS (hex, rgb, hsl)?', topic_after='What do text-wrap: balance and text-wrap: pretty do?',
       new_topic='Lists & tables',
       q='How do you style lists with list-style?', level='Basics',
       a="list-style-type changes the marker, like disc, square, decimal or lower-roman, and list-style-position decides if the marker sits inside or outside the text box. For navigation menus I set list-style: none with padding: 0 and lay the items out with flexbox. To color just the bullets I use the ::marker pseudo-element.",
       html='''<ul class="square"><li>Square bullets</li><li>Second item</li></ul>
<ol class="roman"><li>Roman numbers</li><li>Second item</li></ol>
<ul class="nav"><li>Home</li><li>About</li><li>Contact</li></ul>''',
       css='''.square { list-style-type: square; }
.roman  { list-style: lower-roman inside; }
.square li::marker { color: #6366f1; }

.nav { list-style: none; padding: 0; display: flex; gap: 12px; }  /* menu */
.nav li { background: #e0e7ff; padding: 4px 10px; }'''),
  dict(after='How do you style lists with list-style?', topic_after='How do you style lists with list-style?',
       q='How do you style a table (border-collapse, zebra rows)?', level='Basics',
       a="By default every cell has its own border with a gap between them, so I set border-collapse: collapse to merge them into single lines. Then I add padding to th and td, align numbers to the right, and use tr:nth-child(even) for zebra stripes. For wide tables on mobile I wrap the table in a div with overflow-x: auto so it scrolls instead of breaking the page.",
       html='''<table>
  <tr><th>Name</th><th>Score</th></tr>
  <tr><td>Asha</td><td>92</td></tr>
  <tr><td>Ravi</td><td>85</td></tr>
  <tr><td>Meera</td><td>78</td></tr>
</table>''',
       css='''table { border-collapse: collapse; width: 220px; }
th, td { border: 1px solid #c7d2fe; padding: 6px 10px; text-align: left; }
th { background: #6366f1; color: white; }
td:last-child { text-align: right; }       /* numbers */
tr:nth-child(even) td { background: #eef2ff; }  /* zebra rows */'''),
  dict(after='What is calc()?', topic_after='What is calc()?',
       q='What do min() and max() do in CSS?', level='Intermediate',
       a="min() picks the smallest of its values and max() picks the largest, and they work out the result live as the screen size changes. width: min(100%, 600px) means full width on small screens but never wider than 600px, all in one line. I use max() for things like padding that should grow with the viewport but never drop below a minimum.",
       html='''<div class="box">width: min(100%, 300px)</div>
<div class="pad">padding: max(12px, 4vw)</div>''',
       css='''.box {
  width: min(100%, 300px);   /* the smaller one wins */
  background: #c7d2fe; padding: 8px; margin-bottom: 8px;
}
.pad {
  padding: max(12px, 4vw);   /* the larger one wins */
  background: #fde68a;
}'''),
  dict(after='margin vs padding?', topic_after='margin vs padding?',
       q='How do the margin, padding and border shorthands work?', level='Basics',
       a="With four values the order is clockwise from the top: top, right, bottom, left. Two values mean top-bottom and left-right, and three values mean top, left-right, bottom. The border shorthand takes width, style and color, like border: 2px solid red, and the style is required or no border shows. When I only want to change one side I use the longhand, like padding-left, so I don't reset the other sides by accident.",
       html='''<div class="box one">padding: 10px</div>
<div class="box two">padding: 4px 24px</div>
<div class="box four">padding: 2px 8px 16px 40px</div>''',
       css='''.box { background: #c7d2fe; border: 2px solid #6366f1; margin: 0 0 8px; }
.one  { padding: 10px; }               /* all sides */
.two  { padding: 4px 24px; }           /* top-bottom | left-right */
.four { padding: 2px 8px 16px 40px;    /* top right bottom left */
        border-left: 6px dashed #f59e0b; }  /* longhand: one side */'''),
  dict(after='opacity vs rgba()?', topic_after='opacity vs rgba()?',
       q='What is the difference between visibility: hidden and opacity: 0?', level='Intermediate',
       a="Both hide the element and keep its space in the layout. visibility: hidden also stops clicks and hover and removes it from screen readers, while an element with opacity: 0 is still there: it can be clicked, hovered and focused. I use opacity for fade animations, and pair it with visibility: hidden at the end so the invisible element can't be clicked by accident.",
       html='''<p>Hover the empty gaps:</p>
<div><button>A</button> <button class="vis">B</button> <button>C</button> visibility</div>
<div><button>A</button> <button class="op">B</button> <button>C</button> opacity</div>''',
       css='''div { margin-bottom: 8px; }
.vis { visibility: hidden; }  /* space kept, no hover or click */
.op  { opacity: 0; }          /* space kept, still hoverable */
.op:hover  { opacity: 1; }    /* shows up on hover */
.vis:hover { visibility: visible; }  /* never fires */'''),
  dict(after='What does pointer-events: none do?', topic_after='What does pointer-events: none do?',
       q='What does the cursor property do?', level='Basics',
       a="cursor sets the mouse pointer shown when hovering an element, like pointer for clickable things, text, move, wait or not-allowed. Buttons and links don't all get the hand cursor by default, so I add cursor: pointer to custom clickable elements. I use not-allowed on disabled controls so users understand why nothing happens.",
       html='''<p>Hover each one:</p>
<span class="pointer">pointer</span>
<span class="not">not-allowed</span>
<span class="move">move</span>
<span class="help">help</span>
<span class="wait">wait</span>''',
       css='''span { display: inline-block; padding: 6px 10px; margin: 4px;
       border: 1px solid #6366f1; border-radius: 6px; }
.pointer { cursor: pointer; }
.not     { cursor: not-allowed; opacity: 0.5; }
.move    { cursor: move; }
.help    { cursor: help; }
.wait    { cursor: wait; }'''),
  dict(after='justify-content vs align-items in flexbox?', topic_before='justify-content vs align-items in flexbox?',
       q='What does flex-direction do?', level='Basics',
       a="flex-direction sets the main axis of a flex container: row (the default) puts items side by side, and column stacks them top to bottom. row-reverse and column-reverse flip the order visually. The thing I remember is that justify-content always works along this main axis, so in a column it controls vertical spacing.",
       html='''<div class="flex row"><b>1</b><b>2</b><b>3</b></div>
<div class="flex col"><b>1</b><b>2</b><b>3</b></div>
<div class="flex rev"><b>1</b><b>2</b><b>3</b></div>''',
       css='''.flex { display: flex; gap: 4px; margin-bottom: 8px; }
.row { flex-direction: row; }          /* default */
.col { flex-direction: column; width: 40px; }
.rev { flex-direction: row-reverse; justify-content: flex-end; }
b { background: #6366f1; color: white; padding: 6px 10px; }'''),
  dict(after='What does flex-wrap do?', topic_after='What does flex-wrap do?',
       q='What does the gap property do?', level='Basics',
       a="gap sets the space between flex or grid items, but not around the outside edges. Before gap, I had to add margins to the items and then remove the extra margin on the last one. Now I just write gap: 10px, or row-gap and column-gap separately, and it also works nicely when items wrap.",
       html='''<div class="row"><b>1</b><b>2</b><b>3</b><b>4</b><b>5</b></div>''',
       css='''.row {
  display: flex; flex-wrap: wrap;
  width: 170px; border: 2px dashed #6366f1;
  gap: 12px 6px;   /* row-gap column-gap */
}
b { background: #6366f1; color: white; padding: 6px 12px; }'''),
  dict(after='What does flex-wrap do?', topic_after='What does the gap property do?',
       q='What is the difference between align-items and align-content?', level='Intermediate',
       a="align-items aligns the items inside each line on the cross axis. align-content only matters when the items wrap onto several lines, and it moves the lines themselves, like space-between or center. So if align-content seems to do nothing, I check that flex-wrap: wrap is set and the container has spare height.",
       html='''<div class="box items"><b>1</b><b>2</b><b>3</b><b>4</b></div>
<div class="box content"><b>1</b><b>2</b><b>3</b><b>4</b></div>''',
       css='''.box { display: inline-flex; flex-wrap: wrap; width: 110px; height: 120px;
       background: #f1f5f9; margin-right: 12px; vertical-align: top; }
.items   { align-items: center; }    /* centered inside each line */
.content { align-content: center; }  /* lines packed in the middle */
b { background: #6366f1; color: white; width: 40px; margin: 2px; text-align: center; }'''),
  dict(after='What does flex: 1 mean?', topic_before='What does flex: 1 mean?',
       q='What does flex-grow do?', level='Basics',
       a="flex-grow decides how the leftover space in a flex container is shared. The default 0 means items keep their size; an item with flex-grow: 1 takes the free space, and one with 2 gets twice as much of it as an item with 1. I use flex-grow: 1 on a search input so it fills the row next to a fixed button.",
       html='''<div class="row"><b class="g0">0</b><b class="g1">1</b><b class="g2">2</b></div>
<div class="row"><input placeholder="Search" /><button>Go</button></div>''',
       css='''.row { display: flex; gap: 4px; width: 300px; margin-bottom: 8px; }
b { background: #6366f1; color: white; padding: 6px; }
.g0 { flex-grow: 0; }  /* keeps its size */
.g1 { flex-grow: 1; }  /* one share */
.g2 { flex-grow: 2; }  /* two shares */
input { flex-grow: 1; }'''),
  dict(after='What is CSS Grid? How is it different from Flexbox?', topic_after='What is CSS Grid? How is it different from Flexbox?',
       q='How do grid-template-columns and the fr unit work?', level='Basics',
       a="grid-template-columns lists the width of each column, and grid-template-rows does the same for rows. The fr unit means a fraction of the free space, so 1fr 2fr splits it one third and two thirds after fixed sizes like 100px are taken out. I prefer fr over percentages because it already subtracts the gap, so columns never overflow.",
       html='''<div class="grid">
  <div>100px</div><div>1fr</div><div>2fr</div>
  <div>100px</div><div>1fr</div><div>2fr</div>
</div>''',
       css='''.grid {
  display: grid;
  grid-template-columns: 100px 1fr 2fr;
  gap: 6px; width: 320px;
}
.grid div { background: #6366f1; color: white; padding: 8px; text-align: center; }'''),
  dict(after='How do grid-template-columns and the fr unit work?', topic_after='How do grid-template-columns and the fr unit work?',
       q='What do repeat() and minmax() do in CSS Grid?', level='Intermediate',
       a="repeat(4, 1fr) is just a short way to write 1fr 1fr 1fr 1fr. minmax(100px, 1fr) gives a track a size range: never smaller than 100px, and up to one share of the free space. I combine them as repeat(auto-fit, minmax(150px, 1fr)) to get a card grid that changes its number of columns by itself.",
       html='''<div class="grid four"><div>1</div><div>2</div><div>3</div><div>4</div></div>
<div class="grid mm"><div>min 60px</div><div>1fr</div></div>''',
       css='''.grid { display: grid; gap: 6px; width: 300px; margin-bottom: 8px; }
.four { grid-template-columns: repeat(4, 1fr); }  /* 1fr 1fr 1fr 1fr */
.mm   { grid-template-columns: minmax(60px, 100px) 1fr; }
.grid div { background: #6366f1; color: white; padding: 8px; text-align: center; }'''),
  dict(after='background-size: cover vs contain?', topic_before='background-size: cover vs contain?',
       q='What do background-repeat, background-position and background-attachment do?', level='Basics',
       a="A background image repeats to fill the box by default, and background-repeat: no-repeat (or repeat-x / repeat-y) changes that. background-position places it, like center or right top, and background-attachment: fixed keeps it still while the page scrolls. I usually write it all in the shorthand, like background: url(hero.jpg) no-repeat center / cover.",
       html='''<div class="box"><span>repeat (default)</span></div>
<div class="box once"><span>no-repeat + center</span></div>''',
       css='''.box {
  height: 70px; margin-bottom: 8px; border: 1px solid #6366f1;
  background-image: radial-gradient(circle, #6366f1 40%, transparent 42%);
  background-size: 24px 24px;
}
.once { background-repeat: no-repeat; background-position: center; }
span { background: white; padding: 2px 4px; }
/* background-attachment: fixed; keeps it still while the page scrolls */'''),
  dict(after='transition vs animation?', topic_before='transition vs animation?',
       q='How do you write a CSS transition (duration, timing function, delay)?', level='Basics',
       a="A transition animates a property smoothly when its value changes, like on hover, and I write it as transition: property duration timing-function delay. The timing function sets the speed curve: ease is the default, linear is constant, and ease-in-out starts and ends slowly. I list the exact properties instead of transition: all, so nothing unexpected animates.",
       html='''<div class="track">
  <p>Hover me</p>
  <b class="ease">ease</b>
  <b class="linear">linear</b>
  <b class="late">delay</b>
</div>''',
       css='''b { display: block; width: 60px; margin: 4px 0; padding: 4px;
    background: #6366f1; color: white; white-space: nowrap; }
.ease   { transition: width 1s ease; }
.linear { transition: width 1s linear; }
.late   { transition: width 1s ease-in-out 0.3s; }
.track:hover b { width: 220px; }'''),
  dict(after='How do you write a CSS transition (duration, timing function, delay)?', topic_after='How do you write a CSS transition (duration, timing function, delay)?',
       q='How do you create a CSS animation with @keyframes?', level='Basics',
       a="I define the steps with @keyframes and a name, using from/to or percentages, and then attach it with the animation property: name, duration, timing function and how many times to repeat. Unlike a transition, it runs on its own without a hover or class change. I stick to animating transform and opacity so it stays smooth.",
       html='''<div class="spinner"></div>
<div class="pulse">pulse</div>''',
       css='''@keyframes spin { to { transform: rotate(360deg); } }
@keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.3; } }

.spinner { width: 36px; height: 36px; border: 4px solid #c7d2fe;
           border-top-color: #6366f1; border-radius: 50%;
           animation: spin 1s linear infinite; }
.pulse { margin-top: 10px; color: #6366f1; font-weight: bold;
         animation: pulse 1.5s ease-in-out infinite; }'''),
]
