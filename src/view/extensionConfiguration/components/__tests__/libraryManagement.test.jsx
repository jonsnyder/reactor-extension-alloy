import { mount } from 'enzyme';
import Checkbox from '@coralui/react-coral/lib/Checkbox';
import Radio from '@coralui/react-coral/lib/Radio';
import Tag from '@coralui/react-coral/lib/Tag';
import Button from '@coralui/react-coral/lib/Button';
import Textfield from '@coralui/react-coral/lib/Textfield';
import { ValidationWrapper, ErrorTip } from '@reactor/react-components';

import ReportSuite from './../reportSuite';
import extensionViewReduxForm from '../../../extensionViewReduxForm';
import LibraryManagement, { formConfig } from '../libraryManagement';
import { getFormComponent, createExtensionBridge } from '../../../__tests__/helpers/formTestUtils';

const getReactComponents = (wrapper) => {
  const productionReportSuitesAutocompleteWrapper =
    wrapper.find(ReportSuite).filterWhere(n => n.prop('name').includes('production'));
  const stagingReportSuitesAutocompleteWrapper =
    wrapper.find(ReportSuite).filterWhere(n => n.prop('name').includes('staging'));
  const developmentReportSuitesAutocompleteWrapper =
    wrapper.find(ReportSuite).filterWhere(n => n.prop('name').includes('development'));

  const productionReportSuites =
    productionReportSuitesAutocompleteWrapper.find(Tag).nodes.map(n => n.props.children);
  const stagingReportSuites =
    stagingReportSuitesAutocompleteWrapper.find(Tag).nodes.map(n => n.props.children);
  const developmentReportSuites =
    developmentReportSuitesAutocompleteWrapper.find(Tag).nodes.map(n => n.props.children);

  const productionReportSuitesAutocomplete = productionReportSuitesAutocompleteWrapper.node;
  const stagingReportSuitesAutocomplete = stagingReportSuitesAutocompleteWrapper.node;
  const developmentReportSuitesAutocomplete = developmentReportSuitesAutocompleteWrapper.node;

  const pageBottomLoadPhaseRadio =
    wrapper.find(Radio).filterWhere(n => n.prop('value') === 'pageBottom').node;
  const typePreinstalledRadio =
    wrapper.find(Radio).filterWhere(n => n.prop('value') === 'preinstalled').node;
  const typeRemoteRadio =
    wrapper.find(Radio).filterWhere(n => n.prop('value') === 'remote').node;
  const typeCustomRadio =
    wrapper.find(Radio).filterWhere(n => n.prop('value') === 'custom').node;

  const trackerVariableNameTextfield =
    wrapper.find(Textfield).filterWhere(n => n.prop('name').includes('trackerVariableName')).node;
  const httpUrlTextfield =
    wrapper.find(Textfield).filterWhere(n => n.prop('name').includes('httpUrl')).node;
  const httpsUrlTextfield =
    wrapper.find(Textfield).filterWhere(n => n.prop('name').includes('httpsUrl')).node;
  const showReportSuitesCheckbox =
    wrapper.find(Checkbox).filterWhere(n => n.prop('name').includes('showReportSuites')).node;

  const httpUrlWrapper =
    wrapper.find(ValidationWrapper).filterWhere(n => n.prop('type') === 'httpUrl').node;
  const httpsUrlWrapper =
    wrapper.find(ValidationWrapper).filterWhere(n => n.prop('type') === 'httpsUrl').node;

  const openEditorButton = wrapper.find(Button).filterWhere(n => n.prop('icon') === 'code').node;
  const sourceErrorIcon = wrapper.find(ErrorTip).node;

  return {
    productionReportSuitesAutocomplete,
    stagingReportSuitesAutocomplete,
    developmentReportSuitesAutocomplete,
    productionReportSuites,
    stagingReportSuites,
    developmentReportSuites,
    pageBottomLoadPhaseRadio,
    trackerVariableNameTextfield,
    httpUrlTextfield,
    httpsUrlTextfield,
    showReportSuitesCheckbox,
    typePreinstalledRadio,
    typeRemoteRadio,
    typeCustomRadio,
    openEditorButton,
    httpUrlWrapper,
    httpsUrlWrapper,
    sourceErrorIcon
  };
};

describe('libary management', () => {
  let extensionBridge;
  let instance;

  beforeAll(() => {
    const FormComponent = extensionViewReduxForm(formConfig)(LibraryManagement);
    extensionBridge = createExtensionBridge();
    instance = mount(getFormComponent(FormComponent, extensionBridge));
  });

  it('sets form values from managed type settings', () => {
    extensionBridge.init({
      settings: {
        libraryCode: {
          type: 'managed',
          accounts: {
            production: [
              'aaa',
              'bbb'
            ],
            staging: [
              'ccc',
              'ddd'
            ],
            development: [
              'eee',
              'fff'
            ]
          },
          loadPhase: 'pageBottom'
        }
      }
    });

    const {
      productionReportSuites,
      stagingReportSuites,
      developmentReportSuites,
      pageBottomLoadPhaseRadio
    } = getReactComponents(instance);

    expect(productionReportSuites).toEqual(['aaa', 'bbb']);
    expect(stagingReportSuites).toEqual(['ccc', 'ddd']);
    expect(developmentReportSuites).toEqual(['eee', 'fff']);
    expect(pageBottomLoadPhaseRadio.props.checked).toBe(true);
  });

  it('sets form values from already installed type settings', () => {
    extensionBridge.init({
      settings: {
        libraryCode: {
          type: 'preinstalled',
          accounts: {
            production: [
              'aaa',
              'bbb'
            ],
            staging: [
              'ccc',
              'ddd'
            ],
            development: [
              'eee',
              'fff'
            ]
          },
          trackerVariableName: 'd'
        }
      }
    });

    const {
      productionReportSuites,
      stagingReportSuites,
      developmentReportSuites,
      trackerVariableNameTextfield,
      showReportSuitesCheckbox
    } = getReactComponents(instance);

    expect(productionReportSuites).toEqual(['aaa', 'bbb']);
    expect(stagingReportSuites).toEqual(['ccc', 'ddd']);
    expect(developmentReportSuites).toEqual(['eee', 'fff']);
    expect(trackerVariableNameTextfield.props.value).toBe('d');
    expect(showReportSuitesCheckbox.props.value).toBe(true);
  });

  it('sets form values from remote type settings', () => {
    extensionBridge.init({
      settings: {
        libraryCode: {
          type: 'remote',
          accounts: {
            production: [
              'aaa',
              'bbb'
            ],
            staging: [
              'ccc',
              'ddd'
            ],
            development: [
              'eee',
              'fff'
            ]
          },
          trackerVariableName: 'd',
          loadPhase: 'pageBottom',
          httpUrl: 'http://someurl.com',
          httpsUrl: 'http://somehttpsurl.com'
        }
      }
    });

    const {
      productionReportSuites,
      stagingReportSuites,
      developmentReportSuites,
      showReportSuitesCheckbox,
      trackerVariableNameTextfield,
      pageBottomLoadPhaseRadio,
      httpUrlTextfield,
      httpsUrlTextfield
    } = getReactComponents(instance);

    expect(productionReportSuites).toEqual(['aaa', 'bbb']);
    expect(stagingReportSuites).toEqual(['ccc', 'ddd']);
    expect(developmentReportSuites).toEqual(['eee', 'fff']);

    expect(showReportSuitesCheckbox.props.value).toBe(true);
    expect(pageBottomLoadPhaseRadio.props.checked).toBe(true);

    expect(trackerVariableNameTextfield.props.value).toBe('d');
    expect(httpUrlTextfield.props.value).toBe('http://someurl.com');
    expect(httpsUrlTextfield.props.value).toBe('http://somehttpsurl.com');
  });

  it('sets form values from custom type settings', () => {
    extensionBridge.init({
      settings: {
        libraryCode: {
          type: 'custom',
          accounts: {
            production: [
              'aaa',
              'bbb'
            ],
            staging: [
              'ccc',
              'ddd'
            ],
            development: [
              'eee',
              'fff'
            ]
          },
          trackerVariableName: 'd',
          loadPhase: 'pageBottom'
        }
      }
    });

    const {
      productionReportSuites,
      stagingReportSuites,
      developmentReportSuites,
      pageBottomLoadPhaseRadio,
      showReportSuitesCheckbox,
      trackerVariableNameTextfield
    } = getReactComponents(instance);

    expect(productionReportSuites).toEqual(['aaa', 'bbb']);
    expect(stagingReportSuites).toEqual(['ccc', 'ddd']);
    expect(developmentReportSuites).toEqual(['eee', 'fff']);

    expect(showReportSuitesCheckbox.props.value).toBe(true);
    expect(pageBottomLoadPhaseRadio.props.checked).toBe(true);

    expect(trackerVariableNameTextfield.props.value).toBe('d');
  });

  it('sets settings from managed form values', () => {
    extensionBridge.init();

    const {
      productionReportSuitesAutocomplete,
      stagingReportSuitesAutocomplete,
      developmentReportSuitesAutocomplete,
      pageBottomLoadPhaseRadio
    } = getReactComponents(instance);

    productionReportSuitesAutocomplete.props.onChange(['aa', 'bb']);
    stagingReportSuitesAutocomplete.props.onChange(['cc', 'dd']);
    developmentReportSuitesAutocomplete.props.onChange(['ee', 'ff']);
    pageBottomLoadPhaseRadio.props.onChange('pageBottom');

    const {
      accounts: {
        production,
        staging,
        development
      },
      loadPhase
    } = extensionBridge.getSettings().libraryCode;

    expect(production).toEqual(['aa', 'bb']);
    expect(staging).toEqual(['cc', 'dd']);
    expect(development).toEqual(['ee', 'ff']);
    expect(loadPhase).toBe('pageBottom');
  });

  it('sets settings from already installed form values', () => {
    extensionBridge.init();

    const { typePreinstalledRadio } = getReactComponents(instance);
    typePreinstalledRadio.props.onChange('preinstalled');

    const { showReportSuitesCheckbox } = getReactComponents(instance);
    showReportSuitesCheckbox.props.onChange(true);

    const {
      productionReportSuitesAutocomplete,
      stagingReportSuitesAutocomplete,
      developmentReportSuitesAutocomplete,
      trackerVariableNameTextfield
    } = getReactComponents(instance);

    productionReportSuitesAutocomplete.props.onChange(['aa', 'bb']);
    stagingReportSuitesAutocomplete.props.onChange(['cc', 'dd']);
    developmentReportSuitesAutocomplete.props.onChange(['ee', 'ff']);
    trackerVariableNameTextfield.props.onChange('d');

    const {
      accounts: {
        production,
        staging,
        development
      },
      trackerVariableName
    } = extensionBridge.getSettings().libraryCode;

    expect(production).toEqual(['aa', 'bb']);
    expect(staging).toEqual(['cc', 'dd']);
    expect(development).toEqual(['ee', 'ff']);
    expect(trackerVariableName).toBe('d');
  });

  it('sets settings from remote form values', () => {
    extensionBridge.init();

    const { typeRemoteRadio } = getReactComponents(instance);
    typeRemoteRadio.props.onChange('remote');

    const { showReportSuitesCheckbox } = getReactComponents(instance);
    showReportSuitesCheckbox.props.onChange(true);

    const {
      productionReportSuitesAutocomplete,
      stagingReportSuitesAutocomplete,
      developmentReportSuitesAutocomplete,
      trackerVariableNameTextfield,
      httpUrlTextfield,
      httpsUrlTextfield,
      pageBottomLoadPhaseRadio
    } = getReactComponents(instance);

    productionReportSuitesAutocomplete.props.onChange(['aa', 'bb']);
    stagingReportSuitesAutocomplete.props.onChange(['cc', 'dd']);
    developmentReportSuitesAutocomplete.props.onChange(['ee', 'ff']);

    trackerVariableNameTextfield.props.onChange('d');
    httpUrlTextfield.props.onChange('http://someurl.com');
    httpsUrlTextfield.props.onChange('https://someurl.com');
    pageBottomLoadPhaseRadio.props.onChange('pageBottom');

    const {
      accounts: {
        production,
        staging,
        development
      },
      trackerVariableName,
      httpUrl,
      httpsUrl,
      loadPhase
    } = extensionBridge.getSettings().libraryCode;

    expect(production).toEqual(['aa', 'bb']);
    expect(staging).toEqual(['cc', 'dd']);
    expect(development).toEqual(['ee', 'ff']);
    expect(trackerVariableName).toBe('d');
    expect(httpUrl).toBe('http://someurl.com');
    expect(httpsUrl).toBe('https://someurl.com');
    expect(loadPhase).toBe('pageBottom');
  });

  it('sets settings from custom form values', () => {
    extensionBridge.init();

    const { typeCustomRadio } = getReactComponents(instance);
    typeCustomRadio.props.onChange('custom');

    const { showReportSuitesCheckbox } = getReactComponents(instance);
    showReportSuitesCheckbox.props.onChange(true);

    const {
      productionReportSuitesAutocomplete,
      stagingReportSuitesAutocomplete,
      developmentReportSuitesAutocomplete,
      trackerVariableNameTextfield,
      pageBottomLoadPhaseRadio
    } = getReactComponents(instance);

    productionReportSuitesAutocomplete.props.onChange(['aa', 'bb']);
    stagingReportSuitesAutocomplete.props.onChange(['cc', 'dd']);
    developmentReportSuitesAutocomplete.props.onChange(['ee', 'ff']);

    trackerVariableNameTextfield.props.onChange('d');
    pageBottomLoadPhaseRadio.props.onChange('pageBottom');

    const {
      accounts: {
        production,
        staging,
        development
      },
      trackerVariableName,
      loadPhase
    } = extensionBridge.getSettings().libraryCode;

    expect(production).toEqual(['aa', 'bb']);
    expect(staging).toEqual(['cc', 'dd']);
    expect(development).toEqual(['ee', 'ff']);
    expect(trackerVariableName).toBe('d');
    expect(loadPhase).toBe('pageBottom');
  });

  it('opens code editor with source value when button is clicked and stores result', () => {
    extensionBridge.init({
      settings: {
        libraryCode: {
          type: 'custom',
          source: 'foo'
        }
      }
    });

    window.extensionBridge = {
      openCodeEditor: jasmine.createSpy().and.callFake((source, callback) => {
        callback('bar');
      })
    };

    const { openEditorButton } = getReactComponents(instance);
    openEditorButton.props.onClick();

    expect(window.extensionBridge.openCodeEditor)
      .toHaveBeenCalledWith('foo', jasmine.any(Function));
    expect(extensionBridge.validate()).toBe(true);

    const settings = extensionBridge.getSettings();
    expect(settings.libraryCode.source).toEqual('bar');

    delete window.extensionBridge;
  });

  it('sets the http:// prefix if the http url  does not contain it', () => {
    extensionBridge.init();

    const { typeRemoteRadio } = getReactComponents(instance);
    typeRemoteRadio.props.onChange('remote');

    const { httpUrlTextfield } = getReactComponents(instance);
    httpUrlTextfield.props.onChange('someurl.com');

    const {
      httpUrl
    } = extensionBridge.getSettings().libraryCode;

    expect(httpUrl).toBe('http://someurl.com');
  });

  it('sets the https:// prefix if the https url  does not contain it', () => {
    extensionBridge.init();

    const { typeRemoteRadio } = getReactComponents(instance);
    typeRemoteRadio.props.onChange('remote');

    const { httpsUrlTextfield } = getReactComponents(instance);
    httpsUrlTextfield.props.onChange('someurl.com');

    const {
      httpsUrl
    } = extensionBridge.getSettings().libraryCode;

    expect(httpsUrl).toBe('https://someurl.com');
  });

  it('sets error if the http url is not provided', () => {
    extensionBridge.init();

    const { typeRemoteRadio } = getReactComponents(instance);
    typeRemoteRadio.props.onChange('remote');

    const { httpUrlWrapper } = getReactComponents(instance);

    expect(extensionBridge.validate()).toBe(false);
    expect(httpUrlWrapper.props.error).toEqual(jasmine.any(String));
  });

  it('sets error if the https url is not provided', () => {
    extensionBridge.init();

    const { typeRemoteRadio } = getReactComponents(instance);
    typeRemoteRadio.props.onChange('remote');

    const { httpsUrlWrapper } = getReactComponents(instance);

    expect(extensionBridge.validate()).toBe(false);
    expect(httpsUrlWrapper.props.error).toEqual(jasmine.any(String));
  });

  it('sets error if source is empty', () => {
    extensionBridge.init();

    const { typeCustomRadio } = getReactComponents(instance);
    typeCustomRadio.props.onChange('custom');

    expect(extensionBridge.validate()).toBe(false);

    const { sourceErrorIcon } = getReactComponents(instance);
    expect(sourceErrorIcon.props.children).toBeDefined();
  });
});