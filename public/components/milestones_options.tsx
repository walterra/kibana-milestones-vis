import React from 'react';
import { EuiPanel } from '@elastic/eui';
import { i18n } from '@kbn/i18n';

import { VisOptionsProps } from 'ui/vis/editors/default';
import { NumberInputOption, SelectOption, SwitchOption } from '../../../../src/legacy/core_plugins/kbn_vislib_vis_types/public/components';
import { NONE_SELECTED } from '../constants';
import { MilestonesVisParams } from '../types';

interface KibanaIndexPatternField {
  name: string;
  type: string;
}
function MilestonesOptions({ stateParams, setValue, vis }: VisOptionsProps<MilestonesVisParams>) {
  const fieldOptions = [
    { value: NONE_SELECTED, text: NONE_SELECTED },
    ...vis.indexPattern.fields
    .filter((field: KibanaIndexPatternField) => field.type === 'string' && !['_id', '_index', '_type'].includes(field.name))
    .map((field: KibanaIndexPatternField) => ({ value: field.name, text: field.name }))
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
        label={i18n.translate('visTypeMilestones.visParams.textIntervalLabel', {
          defaultMessage: 'Time interval',
        })}
        options={vis.type.editorConfig.collections.intervals.map((i: string) => ({ value: i, text: i }))}
        paramName="interval"
        value={stateParams.interval}
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
        options={vis.type.editorConfig.collections.distributions.map((i: string) => ({ value: i, text: i }))}
        paramName="distribution"
        value={stateParams.distribution}
        setValue={setValue}
      />

      <SwitchOption
        label={i18n.translate('visTypeMilestones.visParams.renderLabelsToggleLabel', {
          defaultMessage: 'Render labels',
        })}
        paramName="showLabels"
        value={stateParams.showLabels}
        setValue={setValue}
      />
    </EuiPanel>
  );
}

export { MilestonesOptions };
