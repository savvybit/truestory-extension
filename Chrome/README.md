# TrueStory Chrome Extension

Chrome browser extension powered by Bootstrap and jQuery.


## Installation

Make sure you have installed npm and Node 10 with Gulp 3.9 globally (it won't work with
version 4 of Gulp).

Then clone and install locally all the requirements:

```bash
$ git clone https://gitlab.com/truestory-one/truestory-extension.git
$ cd truestory-extension/Chrome
$ npm install
$ bower install
```

Now build the extension distributable and import it in the browser.

```bash
$ gulp build
```

Within Chrome:

1. Go to `chrome://extensions/` address.
2. Enable *Developer mode* under the top-right corner.
3. Click *Load unpacked* and load your newly generated **dist** folder inside *Chrome*
   directory.

That's all, you're ready to use it now!


## Development

Same prerequisites as before, but now you'll do the following:

```bash
gulp watch
```

This will automatically lint and update any modified JS and reload the extension
immediately when a file is changed, so you don't have to (un)install or reload it
manually each time a modification occurs.

Remember that this time you have to load the **app** folder into your browser (instead
of the previously **dist** one).

#### Notes

- Any dependency should be installed with Bower as the main HTML file will
  automatically get updated in order to include it (`gulp watch` is taking care of
  that).
- Explore the Gulp file for more commands like `build`, `clean`, `package` etc.
- This was achieved with the help of Yeoman, more details here:
  https://github.com/yeoman/generator-chrome-extension
