import React from 'react';
import Radio from '@coralui/react-coral/lib/Radio';
import Button from '@coralui/react-coral/lib/Button';

var LOAD_PHASES = {
  BEFORE_SETTINGS: 'beforeSettings',
  AFTER_SETTINGS: 'afterSettings'
};

const LOAD_PHASE_DEFAULT = LOAD_PHASES.AFTER_SETTINGS;

export default class CustomSetup extends React.Component {
  onOpenEditor = field => {
    window.extensionBridge.openCodeEditor(field.value, field.onChange);
  };

  render() {
    const {
      script,
      loadPhase
    } = this.props.fields.customSetup;

    const {
      showLoadPhase = true,
    } = this.props;

    return (
      <div>
        <Button
          className="u-gapTop"
          icon="code"
          onClick={this.onOpenEditor.bind(this, script)}>
          Open Editor
        </Button>
        { showLoadPhase && script.value ?
            <div>
              <fieldset>
                <legend><span className="Label u-gapTop">Execute custom code</span></legend>
                <div>
                  <Radio
                    {...loadPhase}
                    value={LOAD_PHASES.BEFORE_SETTINGS}
                    checked={loadPhase.value === LOAD_PHASES.BEFORE_SETTINGS}>
                    Before other settings are applied
                  </Radio>
                  <Radio
                    {...loadPhase}
                    value={LOAD_PHASES.AFTER_SETTINGS}
                    checked={loadPhase.value === LOAD_PHASES.AFTER_SETTINGS}>
                    After other settings are applied
                  </Radio>
                </div>
              </fieldset>
            </div> : null
        }
      </div>
    );
  }
}

export const formConfig = {
  fields: [
    'customSetup.script',
    'customSetup.loadPhase'
  ],
  settingsToFormValues(values, options) {
    const {
      script,
      loadPhase
    } = options.settings.customSetup || {};

    return {
      ...values,
      customSetup: {
        script: script,
        loadPhase: loadPhase || LOAD_PHASES.AFTER_SETTINGS
      }
    };
  },
  formValuesToSettings(settings, values) {
    const {
      script,
      loadPhase
    } = values.customSetup;

    if (script) {
      const customSetup = {
        script
      };

      if (loadPhase && loadPhase !== LOAD_PHASE_DEFAULT) {
        customSetup.loadPhase = loadPhase;
      }

      settings = {
        ...settings,
        customSetup
      };
    }

    return settings;
  }
};

