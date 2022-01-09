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

import React from 'react';
import { EuiPanel } from '@elastic/eui';
import { i18n } from '@kbn/i18n';

import { VisEditorOptionsProps } from '../../../../src/plugins/visualizations/public';
import {
  NumberInputOption,
  SelectOption,
  SwitchOption,
} from '../../../../src/plugins/vis_default_editor/public';
import { NONE_SELECTED, SCORE_FIELD } from '../../common';
import { MilestonesVisParams } from '../types';

interface KibanaIndexPatternField {
  name: string;
  type: string;
}
function MilestonesOptions({
  stateParams,
  setValue,
  vis,
}: VisEditorOptionsProps<MilestonesVisParams>) {
  if (typeof vis.data.indexPattern === 'undefined') {
    return null;
  }

  const fieldOptions = [
    { value: NONE_SELECTED, text: NONE_SELECTED },
    ...vis.data.indexPattern.fields
      .filter(
        (field: KibanaIndexPatternField) =>
          field.type === 'string' && !['_id', '_index', '_type'].includes(field.name)
      )
      .map((field: KibanaIndexPatternField) => ({ value: field.name, text: field.name })),
  ];

  const sortFieldOptions = [
    { value: SCORE_FIELD, text: SCORE_FIELD },
    ...vis.data.indexPattern.fields
      .filter(
        (field: KibanaIndexPatternField) =>
          !['_id', '_index', '_score', '_source', '_type'].includes(field.name)
      )
      .map((field: KibanaIndexPatternField) => ({ value: field.name, text: field.name })),
  ];

  const sortOrderOptions = [
    {
      value: 'asc' as MilestonesVisParams['sortOrder'],
      text: i18n.translate('visTypeMilestones.visParams.textSortOrderAscending', {
        defaultMessage: 'Ascending',
      }),
    },
    {
      value: 'desc' as MilestonesVisParams['sortOrder'],
      text: i18n.translate('visTypeMilestones.visParams.textSortOrderDescending', {
        defaultMessage: 'Descending',
      }),
    },
  ];

  return (
    <EuiPanel paddingSize="s">
      <SelectOption
        label={i18n.translate('visTypeMilestones.visParams.textLabelFieldLabel', {
          defaultMessage: 'Label field',
        })}
        options={fieldOptions}
        paramName="labelField"
        value={stateParams.labelField}
        setValue={setValue}
      />

      <SelectOption
        label={i18n.translate('visTypeMilestones.visParams.textCategoryFieldLabel', {
          defaultMessage: 'Category field',
        })}
        options={fieldOptions}
        paramName="categoryField"
        value={stateParams.categoryField}
        setValue={setValue}
      />

      <SelectOption
        label={i18n.translate('visTypeMilestones.visParams.textSortFieldLabel', {
          defaultMessage: 'Sort field',
        })}
        options={sortFieldOptions}
        paramName="sortField"
        value={stateParams.sortField}
        setValue={setValue}
      />

      <SelectOption
        label={i18n.translate('visTypeMilestones.visParams.textSortOrderLabel', {
          defaultMessage: 'Sort order',
        })}
        options={sortOrderOptions}
        paramName="sortOrder"
        value={stateParams.sortOrder}
        setValue={setValue}
      />

      <SelectOption
        label={i18n.translate('visTypeMilestones.visParams.textAggregateByLabel', {
          defaultMessage: 'Time interval',
        })}
        options={vis.type.editorConfig.collections.aggregateBy}
        paramName="aggregateBy"
        value={stateParams.aggregateBy}
        setValue={setValue}
      />

      <NumberInputOption
        label={i18n.translate('visTypeMilestones.visParams.textMaxDocumentsLabel', {
          defaultMessage: 'Max documents',
        })}
        paramName="maxDocuments"
        value={stateParams.maxDocuments}
        setValue={(paramName, value) => {
          setValue(paramName, value || 0);
        }}
      />

      <SelectOption
        label={i18n.translate('visTypeMilestones.visParams.textLabelArrangementLabel', {
          defaultMessage: 'Label arrangement',
        })}
        options={vis.type.editorConfig.collections.distributions}
        paramName="distribution"
        value={stateParams.distribution}
        setValue={setValue}
      />

      <SelectOption
        label={i18n.translate('visTypeMilestones.visParams.textOrientationLabel', {
          defaultMessage: 'Orientation',
        })}
        options={vis.type.editorConfig.collections.orientation}
        paramName="orientation"
        value={stateParams.orientation}
        setValue={setValue}
      />

      <SwitchOption
        label={i18n.translate('visTypeMilestones.visParams.renderLabelsToggleLabel', {
          defaultMessage: 'Render labels',
        })}
        paramName="useLabels"
        value={stateParams.useLabels}
        setValue={setValue}
      />
    </EuiPanel>
  );
}

export { MilestonesOptions };
