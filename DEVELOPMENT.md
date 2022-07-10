# Development

See the [kibana contributing guide](https://github.com/elastic/kibana/blob/master/CONTRIBUTING.md) for instructions setting up your development environment. Once you have completed that, use the following npm tasks.

See the [kibana contributing guide](https://github.com/elastic/kibana/blob/master/CONTRIBUTING.md) for instructions setting up your development environment.

## Scripts

<dl>
  <dt><code>yarn kbn bootstrap</code></dt>
  <dd>Execute this to install node_modules and setup the dependencies in your plugin and in Kibana</dd>

  <dt><code>yarn plugin-helpers build</code></dt>
  <dd>Execute this to create a distributable version of this plugin that can be installed in Kibana</dd>
</dl>

## Release Process

This is the process for producing a release for a new minor version that doesn't include any necessary changes due to changing Kibana APIs.

```bash
# Move to the directory of your Kibana git checkout
cd ~/dev/kibana-7.x-git/kibana

# Fetch the latest releases
git fetch --all --tags

# Check out the release in Kibana
git checkout v7.16.3

# Switch to updated node-js if necessary
nvm use

# Run Kibana's bootstrap
yarn kbn bootstrap

# Create a temporary boilerplate plugin to check dependency updates for plugins
node scripts/generate_plugin plugin_tmp

# Once the plugin was created, you need to compare the two following files and if necessary update the dependencies in your `package.json`
# plugins/kibana_milestones_vis/package.json
# plugins/plugin_tmp/package.json

# After checking/updating `package.json`, run bootstrap inside your plugin's directory
cd plugins/kibana_milestones_vis
yarn kbn bootstrap

# Update all files containing the previous version name to the new name
# kibana-extra/kibana-milestones-vis/package.json
# kibana-extra/kibana-milestones-vis/DEVELOPMENT.md
# kibana-extra/kibana-milestones-vis/README.md
# Do not commit the changes yet, we need to test the release first!

# Create the distribution build file
yarn build

# Next, download, install and run the corresponding Elasticsearch
mkdir ~/dev/elasticsearch-7.16.3-release
cd ~/dev/elasticsearch-7.16.3-release
curl -O https://artifacts.elastic.co/downloads/elasticsearch/elasticsearch-7.16.3-darwin-x86_64.tar.gz
gunzip -c elasticsearch-7.16.3-darwin-x86_64.tar.gz | tar xopf -
cd elasticsearch-7.16.3
./bin/elasticsearch

# Next, in another terminal tab, download and install the corresponding Kibana release to test the build
mkdir ~/dev/kibana-7.16.3-release
cd ~/dev/kibana-7.16.3-release/
curl -O https://artifacts.elastic.co/downloads/kibana/kibana-7.16.3-darwin-x86_64.tar.gz
gunzip -c kibana-7.16.3-darwin-x86_64.tar.gz | tar xopf -
cd kibana-7.16.3-darwin-x86_64

# Install the built plugin
./bin/kibana-plugin install 'file:///<your-path>/kibana-7.x-git/kibana/plugins/kibana_milestones_vis/build/kibanaMilestonesVis-7.16.3.zip'

# Start Kibana and test the UI if the plugin works.
# Use Kibana's `flights` sample dataset and create a milestones visualization.
./bin/kibana

# If everything works, finally the time has come to create the release on Github.
cd ~/dev/kibana-7.x-git/kibana/plugins/kibana_milestones_vis
git add DEVELOPMENT.md
git add README.md
git add package.json
git commit -m "Bump version to 7.16.3."
git tag v7.16.3
git push origin 7.16
git push --tags

# On Github, edit the new release at
# https://github.com/walterra/kibana-milestones-vis/releases/new?tag=v7.16.3
# Use `Kibana v7.16.3 compatibility release.` as the release text.
# Add the build file `kibanaMilestonesVis-7.16.3.zip` to the releases' binaries.

# Almost done! Before the next release, a little cleanup: Just delete the temporary plugin you create so you can create another one for comparison for the next release.
rm -r ~/dev/kibana-7.x-git/kibana/plugins/plugin_tmp
```
