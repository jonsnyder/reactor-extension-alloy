import React from 'react';
import Coral from '@coralui/coralui-support-reduxform';
import createFormConfig from '../utils/createFormConfig';
import { ValidationWrapper, ErrorTip } from '@reactor/react-components';

const libTypes = {
  MANAGED: 'managed',
  PREINSTALLED: 'preinstalled',
  REMOTE: 'remote',
  CUSTOM: 'custom'
};

const loadPhases = {
  PAGETOP: 'pagetop',
  PAGEBOTTOM: 'pagebottom'
};

class LoadPhase extends React.Component {
  render() {
    const { loadPhase } = this.props.fields.libraryCode;

    return (
      <div className={this.props.className}>
        <span className="u-label">Load library at:</span>
        <Coral.Radio
          {...loadPhase}
          value={loadPhases.PAGETOP}
          checked={loadPhase.value === loadPhases.PAGETOP}>Page Top</Coral.Radio>
        <Coral.Radio
          {...loadPhase}
          value={loadPhases.PAGEBOTTOM}
          checked={loadPhase.value === loadPhases.PAGEBOTTOM}>Page Bottom</Coral.Radio>
      </div>
    );
  }
}

class TrackerVariableName extends React.Component {
  render() {
    const { trackerVariableName } = this.props.fields.libraryCode;

    return (
      <ValidationWrapper
        className={this.props.className}
        error={trackerVariableName.touched && trackerVariableName.error}>
        <label>
          <span className="u-label">Tracker is accessible on the global variable named:</span>
          <Coral.Textfield {...trackerVariableName}/>
        </label>
      </ValidationWrapper>
    );
  }
}

class SkipSetAccount extends React.Component {
  render() {
    const { skipSetAccount } = this.props.fields.libraryCode;

    return (
      <Coral.Checkbox
        {...skipSetAccount}
        className={this.props.className}>
        Use report suites that have been set within the code
      </Coral.Checkbox>
    );
  }
}

export default class LibraryManagement extends React.Component {
  onOpenEditor = () => {
    let scriptField = this.props.fields.libraryCode.script;
    window.extensionBridge.openCodeEditor(scriptField.value, scriptField.onChange);
  };

  render() {
    const {
      type,
      httpUrl,
      httpsUrl,
      script
    } = this.props.fields.libraryCode;

    return (
      <div>
        <Coral.Radio
          {...type}
          value={libTypes.MANAGED}
          checked={type.value === libTypes.MANAGED}
          className="u-block">
          Manage the library for me
        </Coral.Radio>
        {
          type.value === libTypes.MANAGED ?
            <div className="LibraryManagement-optionSubset">
              <LoadPhase fields={this.props.fields}/>
            </div>: null
        }

        <Coral.Radio
          {...type}
          value={libTypes.PREINSTALLED}
          checked={type.value === libTypes.PREINSTALLED}
          className="u-block">
          Use the library already installed on the page
        </Coral.Radio>
        {
          type.value === libTypes.PREINSTALLED ?
            <div className="LibraryManagement-optionSubset">
              <TrackerVariableName fields={this.props.fields}/>
            </div> : null
        }

        <Coral.Radio
          {...type}
          value={libTypes.REMOTE}
          checked={type.value === libTypes.REMOTE}
          className="u-block">
          Load the library from a custom URL
        </Coral.Radio>
        {
          type.value === libTypes.REMOTE ?
            <div className="LibraryManagement-optionSubset">
              <div className="u-gapBottom">
                <ValidationWrapper
                  error={httpUrl.touched && httpUrl.error}
                  className="u-gapRight">
                  <label>
                    <span className="u-label">HTTP URL:</span>
                    <Coral.Textfield {...httpUrl} placeholder="http://"/>
                  </label>
                </ValidationWrapper>
                <ValidationWrapper
                  error={httpsUrl.touched && httpsUrl.error}>
                  <label>
                    <span className="u-label">HTTPS URL:</span>
                    <Coral.Textfield {...httpsUrl} placeholder="https://"/>
                  </label>
                 </ValidationWrapper>
              </div>
              <SkipSetAccount
                fields={this.props.fields}
                className="u-block u-gapBottom"/>
              <TrackerVariableName
                fields={this.props.fields}
                className="u-block u-gapBottom"/>
              <LoadPhase fields={this.props.fields}/>
            </div> : null
        }

        <Coral.Radio
          {...type}
          value={libTypes.CUSTOM}
          checked={type.value === libTypes.CUSTOM}
          className="u-block">
          Let me provide custom library code
        </Coral.Radio>
        {
          type.value === libTypes.CUSTOM ?
            <div className="LibraryManagement-optionSubset">
              <div className="u-gapBottom">
                <Coral.Button ref="openEditorButton" icon="code" onClick={this.onOpenEditor}>
                  Open Editor
                </Coral.Button>
                {
                  script.touched && script.error ?
                    <ErrorTip ref="scriptErrorIcon" message={script.error}/> : null
                }
              </div>
              <SkipSetAccount
                fields={this.props.fields}
                className="u-block u-gapBottom"/>
              <TrackerVariableName
                fields={this.props.fields}
                className="u-block u-gapBottom"/>
              <LoadPhase fields={this.props.fields}/>
            </div> : null
        }
      </div>
    );
  }
}

const forcePrefix = (str, prefix) => {
  return str.indexOf(prefix) === 0 ? str : prefix + str;
};

export const formConfig = createFormConfig({
  fields: [
    'libraryCode.type',
    'libraryCode.trackerVariableName',
    'libraryCode.loadPhase',
    'libraryCode.skipSetAccount',
    'libraryCode.httpUrl',
    'libraryCode.httpsUrl',
    'libraryCode.script'
  ],
  settingsToFormValues(values, options) {
    const {
      type,
      trackerVariableName,
      loadPhase,
      skipSetAccount,
      httpUrl,
      httpsUrl,
      script
    } = options.settings.libraryCode || {};

    return {
      ...values,
      libraryCode: {
        type: type || libTypes.MANAGED,
        trackerVariableName: trackerVariableName || 's',
        loadPhase: loadPhase || loadPhases.PAGEBOTTOM,
        skipSetAccount,
        httpUrl,
        httpsUrl,
        script
      }
    };
  },
  formValuesToSettings(settings, values) {
    const {
      type,
      trackerVariableName,
      loadPhase,
      skipSetAccount,
      httpUrl,
      httpsUrl,
      script
    } = values.libraryCode || {};

    const libraryCodeSettings = {
      type
    };

    if (type !== libTypes.PREINSTALLED) {
      libraryCodeSettings.loadPhase = loadPhase;
    }

    if (type !== libTypes.MANAGED) {
      libraryCodeSettings.trackerVariableName = trackerVariableName;
    }

    if (type === libTypes.REMOTE) {
      libraryCodeSettings.httpUrl = forcePrefix(httpUrl || '', 'http://');
      libraryCodeSettings.httpsUrl = forcePrefix(httpsUrl || '', 'https://');
      libraryCodeSettings.skipSetAccount = skipSetAccount;
    }

    if (type === libTypes.CUSTOM) {
      libraryCodeSettings.script = script;
      libraryCodeSettings.skipSetAccount = skipSetAccount;
    }

    return {
      ...settings,
      libraryCode: libraryCodeSettings
    };
  },
  validate(errors, values) {
    const {
      type,
      trackerVariableName,
      httpUrl,
      httpsUrl,
      script
    } = values.libraryCode;

    const libraryCodeErrors = {};

    if (type !== libTypes.MANAGED && !trackerVariableName) {
      libraryCodeErrors.trackerVariableName = 'Please specify a variable name';
    }

    if (type === libTypes.REMOTE) {
      if (!httpUrl) {
        libraryCodeErrors.httpUrl = 'Please specify an HTTP URL';
      }

      if (!httpsUrl) {
        libraryCodeErrors.httpsUrl = 'Please specify an HTTPS URL';
      }
    }

    if (type === libTypes.CUSTOM && !script) {
      libraryCodeErrors.script = 'Please provide custom code';
    }

    return {
      ...errors,
      libraryCode: libraryCodeErrors
    };
  }
});
