/*
 * Licensed to Elasticsearch B.V. under one or more contributor
 * license agreements. See the NOTICE file distributed with
 * this work for additional information regarding copyright
 * ownership. Elasticsearch B.V. licenses this file to you under
 * the Apache License, Version 2.0 (the "License"); you may
 * not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */

// TODO Migrate this to a .ts file for v7.6.1 https://github.com/elastic/kibana/pull/55194

import { resolve } from 'path';
import { existsSync } from 'fs';

const milestonesPluginInitializer = ({ Plugin }) =>
  new Plugin({
    id: 'kibana_milestones_vis',
    require: ['kibana', 'elasticsearch', 'data'],
    publicDir: resolve(__dirname, 'public'),
    uiExports: {
      styleSheetPaths: [
        resolve(__dirname, 'public/index.scss'),
        resolve(__dirname, 'public/index.css'),
      ].find(p => existsSync(p)),
      hacks: [resolve(__dirname, 'public/legacy')],
    },
    init: () => ({}),
    config(Joi) {
      return Joi.object({
        enabled: Joi.boolean().default(true),
      }).default();
    },
  });

// eslint-disable-next-line import/no-default-export
export default milestonesPluginInitializer;
