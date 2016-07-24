# Tube Tracker

This is a simple application to check the predicted arrival times of trains at stations on the London Underground network. It is built using [React][1], [Browserify][3] and [Jasmine][4] with data from [unified TfL API][2]. The application was built in conjunction with my series "Building robust web apps with React":

1. [In-browser prototype][part1] ([Download source code][tag1])
2. [Optimising for the browser][part2] ([Download source code][tag2])
3. [Testing with Jasmine][part3] ([Download source code][tag3])
4. [Server-side rendering][part4] ([Download source code][tag4])

The project was originally built with React 0.12 but has since been updated to 0.13. I have no plans to continue updating the project but there is a separate [ES6, Babel and Webpack port available][preact] for reference.

## Dependencies

- [Node.js and NPM](http://nodejs.org/)

## Installation and usage

1. Clone or download this repository
2. Install dependencies with `npm install`
3. Copy the example config and enter your API credentials `cp config.example.json config.json`
4. Run `npm start` or `node server.js`
5. Open your browser and navigate to `http://localhost:8080`

## Demo

You can test [the demo][demo] in the your browser now. Please note this is running on a free service tier and is not always available.

[1]: http://facebook.github.io/react/
[2]: https://api.tfl.gov.uk
[3]: http://browserify.org
[4]: http://jasmine.github.io
[part1]: http://maketea.co.uk/2014/03/05/building-robust-web-apps-with-react-part-1.html
[part2]: http://maketea.co.uk/2014/04/07/building-robust-web-apps-with-react-part-2.html
[part3]: http://maketea.co.uk/2014/05/22/building-robust-web-apps-with-react-part-3.html
[part4]: http://maketea.co.uk/2014/06/30/building-robust-web-apps-with-react-part-4.html
[tag1]: https://github.com/i-like-robots/react-tube-tracker/releases/tag/prototype
[tag2]: https://github.com/i-like-robots/react-tube-tracker/releases/tag/optimise
[tag3]: https://github.com/i-like-robots/react-tube-tracker/releases/tag/testing
[tag4]: https://github.com/i-like-robots/react-tube-tracker/releases/tag/isomorphic
[demo]: http://react-tube-tracker.herokuapp.com/
[preact]: https://github.com/i-like-robots/preact-tube-tracker
