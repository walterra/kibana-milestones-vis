# Milestones Visualization for Kibana

![Movie Timelines](resources/kibana-milestones-vis.png)

This plugin is a wrapper for the stand-alone library `d3-milestones` (https://github.com/walterra/d3-milestones) to make its functionality available within Kibana.

## Installation

### Compatibility

To get a version of this plugin which is compatible with your version of Kibana, have a look at the releases page on GitHub: https://github.com/walterra/kibana-milestones-vis/releases

The releases of this plugin are synced with Kibana's release cycle. In the "Assets" section of each release you'll find a zipped build of the plugin which you can use. These zip files are named in the following way: `kibana-milestones-vis-<plugin-version>.zip`. The `plugin-version` should match the version of Kibana you're using.

### General Installation Pattern

Run the following from within your Kibana folder:

```
bin/kibana-plugin install https://github.com/walterra/kibana-milestones-vis/releases/download/v6.6.2/kibana-milestones-vis-6.6.2.zip
```

### Installing by first downloading a zipped release

- Head over to https://github.com/walterra/kibana-milestones-vis/releases and download the ZIP of the version you want to use, e.g. https://github.com/walterra/kibana-milestones-vis/releases/download/v6.6.2/kibana-milestones-vis-6.6.2.zip
- Inside your kibana directory, run `bin/kibana-plugin install file:///<path-to-file>/kibana-milestones-vis-6.6.2.zip`, then `npm run start`


## Usage

- Create a Kibana index pattern including a time filter.
- Go to `Visualize > Create New Visualization` and choose the Milestones visualization in the Time Series section.
- In the next view, pick the index pattern you created.
- You should end up on the visualization's page where you can tweak it:
  - Make sure you have the right time span selected (upper right corner)
  - In the "Milestone Labels" configuration, choose a field for "Sort On" which you want to use for the labels. By default it just picks timestamps.
- The visualization works best with sparse data. While there is some optimization going on to distribute labels, you might get irritating results with data which results in too many labels.

## Wishlist/Upcoming

- ~~Automatic Labels for each timeline when there are multiple ones~~
- More intuitive initial setup of the visualization
- Option to switch to a vertical view and/or option to scroll
- ~~Use something more performant than the `top_hits` aggregation~~
- ~~Consolidate aggregation options (X-Axis and Options panel)~~
- Optimize label placement when there are lots of label closer to the boundary of the timeline

## Development

See the [kibana contributing guide](https://github.com/elastic/kibana/blob/master/CONTRIBUTING.md) for instructions setting up your development environment. Once you have completed that, use the following npm tasks.

  - `npm install`

    Fetches and installs the plugins dependencies.

  - `npm start`

    Start kibana and have it include this plugin

  - `npm start -- --config kibana.yml`

    You can pass any argument that you would normally send to `bin/kibana` by putting them after `--` when running `npm start`

  - `npm run build`

    Build a distributable archive

  - `npm run test:browser`

    Run the browser tests in a real web browser

  - `npm run test:server`

    Run the server tests using mocha

For more information about any of these commands run `npm run ${task} -- --help`.
