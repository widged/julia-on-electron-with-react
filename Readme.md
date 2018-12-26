# Instructions

1. Install node.

2. Install electron, locally or globally

```
# locally
npm install electron --save-dev
# globally
npm install electron -g
```

3. Run the electron app

I have a little setup that let me rapidly write electron app without duplicating the required packages across all projects. It is captured in electron-dev. It is meant to be used for personal projects running on my laptop. I have never attempted to rely on it for developing apps meant to be compiled.

For mac users, you can simply doubleclick on the `electron.command` file. You might have to `chmod u+x electron.command` first. For other user `cd path/to/react-app; electron ../electron-dev`
