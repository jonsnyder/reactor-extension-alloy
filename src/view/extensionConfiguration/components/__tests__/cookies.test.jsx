import { mount } from 'enzyme';
import Select from '@coralui/react-coral/lib/Select';
import Textfield from '@coralui/react-coral/lib/Textfield';
import { ValidationWrapper } from '@reactor/react-components';

import extensionViewReduxForm from '../../../extensionViewReduxForm';
import Cookies, { formConfig } from '../cookies';
import { getFormComponent, createExtensionBridge } from '../../../__tests__/helpers/formTestUtils';

const getReactComponents = (wrapper) => {
  const visitorIDTextfield =
    wrapper.find(Textfield).filterWhere(n => n.prop('name').includes('visitorID')).node;
  const visitorNamespaceTextfield =
    wrapper.find(Textfield).filterWhere(n => n.prop('name').includes('visitorNamespace')).node;
  const cookieDomainPeriodsTextfield =
    wrapper.find(Textfield).filterWhere(n => n.prop('name').includes('cookieDomainPeriods')).node;
  const fpCookieDomainPeriodsTextfield =
    wrapper.find(Textfield).filterWhere(n => n.prop('name').includes('fpCookieDomainPeriods')).node;
  const cookieLifetimeSelect =
    wrapper.find(Select).node;
  const cookieLifetimeSecondsTextfield =
    wrapper.find(Textfield).filterWhere(n => n.prop('name').includes('cookieLifetimeSeconds')).node;
  const cookieLifetimeSecondsWrapper = wrapper.find(ValidationWrapper).node;

  return {
    visitorIDTextfield,
    visitorNamespaceTextfield,
    cookieDomainPeriodsTextfield,
    fpCookieDomainPeriodsTextfield,
    cookieLifetimeSelect,
    cookieLifetimeSecondsTextfield,
    cookieLifetimeSecondsWrapper
  };
};

describe('cookies', () => {
  let extensionBridge;
  let instance;

  beforeAll(() => {
    const FormComponent = extensionViewReduxForm(formConfig)(Cookies);
    extensionBridge = createExtensionBridge();
    instance = mount(getFormComponent(FormComponent, extensionBridge));
  });

  it('sets form values from settings', () => {
    extensionBridge.init({
      settings: {
        trackerProperties: {
          visitorID: 'visitor id',
          visitorNamespace: 'visitor namespace',
          cookieDomainPeriods: 'cookie domain periods',
          fpCookieDomainPeriods: 'fp cookie domain periods',
          cookieLifetime: '10'
        }
      }
    });

    const {
      visitorIDTextfield,
      visitorNamespaceTextfield,
      cookieDomainPeriodsTextfield,
      fpCookieDomainPeriodsTextfield,
      cookieLifetimeSelect,
      cookieLifetimeSecondsTextfield
    } = getReactComponents(instance);

    expect(visitorIDTextfield.props.value).toBe('visitor id');
    expect(visitorNamespaceTextfield.props.value).toBe('visitor namespace');
    expect(cookieDomainPeriodsTextfield.props.value).toBe('cookie domain periods');
    expect(fpCookieDomainPeriodsTextfield.props.value).toBe('fp cookie domain periods');
    expect(cookieLifetimeSelect.props.value).toBe('SECONDS');
    expect(cookieLifetimeSecondsTextfield.props.value).toBe('10');
  });

  it('sets SESSION cookie lifetime form values from settings', () => {
    extensionBridge.init({
      settings: {
        trackerProperties: {
          cookieLifetime: 'SESSION'
        }
      }
    });

    const {
      cookieLifetimeSelect
    } = getReactComponents(instance);

    expect(cookieLifetimeSelect.props.value).toBe('SESSION');
  });

  it('sets NONE cookie lifetime form values from settings', () => {
    extensionBridge.init({
      settings: {
        trackerProperties: {
          cookieLifetime: 'NONE'
        }
      }
    });

    const {
      cookieLifetimeSelect
    } = getReactComponents(instance);

    expect(cookieLifetimeSelect.props.value).toBe('NONE');
  });

  it('sets settings from form values', () => {
    extensionBridge.init();

    const {
      visitorIDTextfield,
      visitorNamespaceTextfield,
      cookieDomainPeriodsTextfield,
      fpCookieDomainPeriodsTextfield,
      cookieLifetimeSelect
    } = getReactComponents(instance);

    visitorIDTextfield.props.onChange('visitor id');
    visitorNamespaceTextfield.props.onChange('visitor namespace');
    cookieDomainPeriodsTextfield.props.onChange('cookie domain periods');
    fpCookieDomainPeriodsTextfield.props.onChange('fp cookie domain periods');
    cookieLifetimeSelect.props.onChange('SECONDS');

    const { cookieLifetimeSecondsTextfield } = getReactComponents(instance);
    cookieLifetimeSecondsTextfield.props.onChange('11');

    const {
      visitorID,
      visitorNamespace,
      cookieDomainPeriods,
      fpCookieDomainPeriods,
      cookieLifetime
    } = extensionBridge.getSettings().trackerProperties;

    expect(visitorID).toBe('visitor id');
    expect(visitorNamespace).toBe('visitor namespace');
    expect(cookieDomainPeriods).toBe('cookie domain periods');
    expect(fpCookieDomainPeriods).toBe('fp cookie domain periods');
    expect(cookieLifetime).toBe('11');
  });

  it('sets SESSION cookie lifetime settings from form values', () => {
    extensionBridge.init();

    const { cookieLifetimeSelect } = getReactComponents(instance);

    cookieLifetimeSelect.props.onChange('SESSION');

    const {
      cookieLifetime
    } = extensionBridge.getSettings().trackerProperties;

    expect(cookieLifetime).toBe('SESSION');
  });

  it('sets NONE cookie lifetime settings from form values', () => {
    extensionBridge.init();

    const { cookieLifetimeSelect } = getReactComponents(instance);

    cookieLifetimeSelect.props.onChange('NONE');

    const {
      cookieLifetime
    } = extensionBridge.getSettings().trackerProperties;

    expect(cookieLifetime).toBe('NONE');
  });

  it('sets error if the number of seconds for cookie lifetime is not provided', () => {
    extensionBridge.init();

    const { cookieLifetimeSelect } = getReactComponents(instance);
    cookieLifetimeSelect.props.onChange('SECONDS');

    const {
      cookieLifetimeSecondsTextfield,
      cookieLifetimeSecondsWrapper
    } = getReactComponents(instance);
    cookieLifetimeSecondsTextfield.props.onChange('  ');

    expect(extensionBridge.validate()).toBe(false);
    expect(cookieLifetimeSecondsWrapper.props.error).toEqual(jasmine.any(String));
  });

  it('does not set settings for fields that are not completed', () => {
    extensionBridge.init();
    const {
      visitorID,
      visitorNamespace,
      cookieDomainPeriods,
      fpCookieDomainPeriods,
      cookieLifetime
    } = extensionBridge.getSettings().trackerProperties;

    expect(visitorID).toBeUndefined();
    expect(visitorNamespace).toBeUndefined();
    expect(cookieDomainPeriods).toBeUndefined();
    expect(fpCookieDomainPeriods).toBeUndefined();
    expect(cookieLifetime).toBeUndefined();
  });

  it('does not set cookieLifetime settings when form contains only spaces', () => {
    extensionBridge.init();

    const { cookieLifetimeSelect } = getReactComponents(instance);
    cookieLifetimeSelect.props.onChange('SECONDS');

    const { cookieLifetimeSecondsTextfield } = getReactComponents(instance);
    cookieLifetimeSecondsTextfield.props.onChange('  ');

    const {
      cookieLifetime
    } = extensionBridge.getSettings().trackerProperties;

    expect(cookieLifetime).toBeUndefined();
  });
});