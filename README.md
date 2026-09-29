# Backpanel  
Hobby project in alternative to Pterodactyl, AMP and similar homehosted gamepanels.  
  
AMP, for a CA$30 (thankfully lifetime) product feels super unpolished, broken and weird in places.  
Pterodactyl is a bit of a nightmare to install (in my experience), and is unnecessarily complex by default (I am of the philosophy of, "easy with extras", i.e. without touching any options, the app works, but basically. Add additional options that will allow the app to become less "basic", but the options do not need to be touched for basic functionality.).
  
This will be the best of both worlds, a nice, functional, easy to install Gamepanel system.  

## Current State
No Main branch, I am still messing around with things to see what I can figure out on my own.  
I am trying to personally use as little AI as possible through this project, I'm bored and want to try and figure out how the above services function as well as I can.  
  
Basically, there is nothing here yet, and likely won't be for a while.  
A main branch will be created once the topic becomes more focused, but right now I'm just playing around with some concepts trying to get some ball to start rolling.  
Even once a main branch is created, there will likely still be little there in the way of functional gamepanel.

## Design Goals
* Web panel is detachable, allowing for "plug and play" alternatives.
* Allow for core to be setup on any device using a one-liner install script, option for web panel or not.
* Nodes will have a "child-parent" relationship, a node can declare children and parents allowing for nested nodes (likely not necessary)
* Nodes with web panels that are listed as "children" will not lose access to instance creation/management (unlike AMP).
* The out-of-box web panel packaged with the core will prioritize function over form (without casting form to the side). The goal is to keep the panel as responsive as possible.

## Personal Notes
Remove names of competitors on main branch. Do not want to advertise a competitor, as well, don't really want to bash them by name... 😅
