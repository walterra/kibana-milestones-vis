# Development

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

## Release Process

This is the process for producing a release for a new minor version that doesn't include any necessary changes due to changing Kibana APIs.

```bash
# Move to the directory of you Kibana git checkout
cd ~/dev/kibana-6.x-git/kibana

# Fetch the latest releases
git fetch --all --tags

# Check out the release in Kibana
git checkout v6.8.16

# Switch to updated node-js if necessary
nvm use

# Run Kibana's bootstrap
yarn kbn bootstrap

# Create a temporary boilerplate plugin to check dependency updates for plugins
node scripts/generate_plugin plugin_tmp

# Once the plugin was created, you need to compare the two following files and if necessary update the dependencies in your `package.json`
# kibana-extra/kibana-milestones-vis/package.json
# kibana-extra/plugin_tmp/package.json

# Update all files containing the previous version name to the new name
# kibana-extra/kibana-milestones-vis/package.json
# kibana-extra/kibana-milestones-vis/DEVELOPMENT.md
# kibana-extra/kibana-milestones-vis/README.md
# Do not commit the changes yet, we need to test the release first!

# After updating all the files, run bootstrap inside your plugin's directory
cd ../kibana-extra/kibana-milestones-vis
yarn kbn bootstrap

# Create the distribution build file
yarn build

# Next, download and install the corresponding Kibana release to test the build via
# https://www.elastic.co/downloads/past-releases/kibana-6-8-8
mkdir ~/dev/kibana-6.8.16-release
cd ~/dev/kibana-6.8.16-release/
curl -O https://artifacts.elastic.co/downloads/kibana/kibana-6.8.16-darwin-x86_64.tar.gz
gunzip -c kibana-6.8.16-darwin-x86_64.tar.gz | tar xopf -
cd kibana-6.8.16-darwin-x86_64

# Install the built plugin
./bin/kibana-plugin install 'file:///<your-path>/kibana-6.x-git/kibana-extra/kibana-milestones-vis/build/kibana-milestones-vis-6.8.16.zip'

# Start Kibana and test the UI if the plugin works.
# Use Kibana's `flights` sample dataset and create a milestones visualization.
./bin/kibana

# If everything works, finally the time has come to create the release on Github.
cd ~/dev/kibana-6.x-git/kibana-extra/kibana-milestones-vis
git add DEVELOPMENT.md
git add README.md
git add package.json
git commit -m "Bump version to 6.8.16."
git tag v6.8.16
git push origin 6.8
git push --tags

# On Github, edit the new release at
# https://github.com/walterra/kibana-milestones-vis/releases/new?tag=v6.8.16
# Use `Kibana v6.8.16 compatibility release.` as the release text.
# Add the build file `kibana-milestones-vis-6.8.16.zip` to the releases' binaries.

# Almost done! Before the next release, a little cleanup: Just delete the temporary plugin you create so you can create another one for comparison for the next release.
rm -r ~/dev/kibana-6.x-git/kibana-extra/plugin_tmp
```
