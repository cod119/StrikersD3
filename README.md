# Watchout

## Learning objectives

As a software engineer, one of the most powerful skills you can learn is how to elegantly and efficiently navigate uncertain terrain.

During your own projects (and on the job), a clear set of steps will rarely be provided. Often, you'll be given a vague goal, and your job will be to discover which tools you need, learn how to use them, and then chart a clear path to an [MVP](http://en.wikipedia.org/wiki/Minimum_viable_product) on your own.

The browser is a huge ecosystem with lots of capabilities that we haven't explored yet. This sprint is an introduction to a few of them. In this repo, you'll build a game called Watchout using [d3](http://d3js.org/).

95% (at least) of the code you write will depend on external modules and libraries, the majority of which are poorly documented. D3's documentation isn't bad, but there's a lot of it. You'll need to sort through the mountains of documentation and examples to learn what you'll need for this sprint. Exposing you to this is one of the main goals of this sprint.

You'll be working with a [reference implementation](http://latentflip.com/LearningD3/collider/). In order to ensure that you actually learn the techniques involved, you'll build several intermediate steps along the way. Don't skip these steps. **Your code will end up with a different structure than the reference material,** but you may be able to refer back to it in order to see how specific features were implemented.

Heads up, don't waste your time trying to reverse engineer the reference code exactly, the game is written in coffeescript and not particularly elegant. If you try to copy it exactly, you're gonna have a bad time. Your goal is to make a game that looks and functions like the reference implementation on the outside. Your code will end up being much more elegant than the code provided on the reference site.

d3's API is very well designed. As you learn it, pay attention to the choices the implementors made. Many similar libraries were written years earlier, but this one achieved a lot of success relatively late in the game because of the design choices made by its implementors. Many such libraries remain to be written. When you write code, pay attention to things that are painful and repetitive, and how you might improve those processes.

Don't resist this non-traditional use of d3. If you make it through the bare minimum requirements you will have an opportunity to use d3 for more traditional data visualization. In the meantime, appreciate that much software can be utilized in creative ways, and refamiliarize yourself if necessary with the learning objectives for this sprint (see above.)

## Getting Started

* Learn about`enter`, `update`, `exit`, and `key` (fundamental aspects of D3) by working through the following tutorials:
  * General Update Patterns [I](http://bl.ocks.org/3808218)
  * General Update Patterns [II](http://bl.ocks.org/3808221)

Skim through the official [D3 API Reference](https://github.com/mbostock/d3/wiki/API-Reference). You'll need to reference it heavily as you work through

## Bare Minimum requirements

* Reimplement [this game](http://latentflip.com/LearningD3/collider/), referring to the source code as needed. You should have commits that refer to each of these steps.
  * Draw the enemies in an [svg element](https://developer.mozilla.org/en-US/docs/SVG).
  * Make it so that the enemies move to a new random location every second.
  * Make a differently-colored dot to represent the player. Make it draggable.
  * Detect when a enemy touches you.
  * Keep track of the user's score, and display it.
* Use [css3 animations](https://developer.mozilla.org/en-US/docs/CSS/Tutorials/Using_CSS_animations) to make the enemies whirling shuriken.

## Example
![Watchout](http://codestates.com/wp-content/uploads/2016/02/4bd77614-876c-11e4-922b-ba7d76536cc8.gif)

## Advanced content
Our advanced content is intended to throw you in over your head, requiring you to solve problems with very little support or oversight, much like you would as a mid or senior level engineer.

### More traditional big data visualization

* Download one of the over 9000 (yes, really) JSON datasets from [data,gov](https://catalog.data.gov/dataset?res_format=JSON)
* Throw the data through D3 and make it pretty! Check out [/r/dataisbeautiful](https://www.reddit.com/r/dataisbeautiful/top/) for some visual inspiration.
  * Don't spend too much time on reddit!
* Reference the following tutorials on [this page](https://github.com/mbostock/d3/wiki/Tutorials) if you get stuck with a specific technique. Some particularly interesting ones:
  * [Using animations and transitions effectively](http://blog.visual.ly/creating-animations-and-transitions-with-d3-js/)
  * [Animated Pie Charts with Text](http://blog.stephenboak.com/2011/08/07/easy-as-a-pie.html)
  
### Subclass Dance Dance Revolution

* Refactor your sub-class dance party to use D3 to control the dancers. Make your dancers SVG objects, just like with watchout, except this time they won't just move randomly. Give them dance moves, or have them interact with each othe

### Web Sockets

* Use [web sockets](https://developer.mozilla.org/en-US/docs/WebSockets) via [socket.io](http://socket.io/docs/#how-to-use) to enable pair mode.
  * Copy and adapt the server from [http://socket.io/#how-to-use](http://socket.io/#how-to-use)
  * When a second player connects, restart the game for the first player. Show their combined scores. When one dies, reset the score for both.

### Particle System

* Tough CS challenge: turn your game into a [particle system](http://en.wikipedia.org/wiki/Particle_system) by making every particle exert force against the other particles.
* Advanced browser optimization: Use web workers to calculate the locations of all enemy particles in a different [thread](http://en.wikipedia.org/wiki/Thread_(computing))

### Browser APIs

* Build something cool using one of the following browser APIs:
  * File
  * Media queries
  * Web audio
  * Geolocation