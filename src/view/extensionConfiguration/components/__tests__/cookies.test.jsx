/*************************************************************************
* ADOBE CONFIDENTIAL
* ___________________
*
*  Copyright 2016 Adobe Systems Incorporated
*  All Rights Reserved.
*
* NOTICE:  All information contained herein is, and remains
* the property of Adobe Systems Incorporated and its suppliers,
* if any.  The intellectual and technical concepts contained
* herein are proprietary to Adobe Systems Incorporated and its
* suppliers and are protected by all applicable intellectual property
* laws, including trade secret and copyright laws.
* Dissemination of this information or reproduction of this material
* is strictly forbidden unless prior written permission is obtained
* from Adobe Systems Incorporated.
**************************************************************************/

import { mount } from 'enzyme';
import Select from '@react/react-spectrum/Select';
import Textfield from '@react/react-spectrum/Textfield';
import { Field } from 'redux-form';

import Cookies, { formConfig } from '../cookies';
import createExtensionBridge from '../../../__tests__/helpers/createExtensionBridge';
import bootstrap from '../../../bootstrap';

const getReactComponents = (wrapper) => {
  const cookieLifetimeSecondsField = wrapper.find(Field)
    .filterWhere(n => n.prop('name').indexOf('cookieLifetimeSeconds') !== -1);
  const visitorIDTextfield =
    wrapper.find(Textfield).filterWhere(n => n.prop('name').indexOf('visitorID') !== -1);
  const visitorNamespaceTextfield = wrapper.find(Textfield)
    .filterWhere(n => n.prop('name').indexOf('visitorNamespace') !== -1);
  const cookieDomainPeriodsTextfield = wrapper.find(Textfield)
    .filterWhere(n => n.prop('name').indexOf('cookieDomainPeriods') !== -1);
  const fpcookieDomainPeriodsTextfield = wrapper.find(Textfield)
    .filterWhere(n => n.prop('name').indexOf('fpCookieDomainPeriods') !== -1);
  const cookieLifetimeSelect = wrapper.find(Select);
  const cookieLifetimeSecondsTextfield = cookieLifetimeSecondsField.find(Textfield);

  return {
    visitorIDTextfield,
    visitorNamespaceTextfield,
    cookieDomainPeriodsTextfield,
    fpcookieDomainPeriodsTextfield,
    cookieLifetimeSelect,
    cookieLifetimeSecondsTextfield
  };
};

describe('cookies', () => {
  let extensionBridge;
  let instance;

  beforeAll(() => {
    extensionBridge = createExtensionBridge();
    instance = mount(bootstrap(Cookies, formConfig, extensionBridge));
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
      fpcookieDomainPeriodsTextfield,
      cookieLifetimeSelect,
      cookieLifetimeSecondsTextfield
    } = getReactComponents(instance);
    expect(visitorIDTextfield.props().value).toBe('visitor id');
    expect(visitorNamespaceTextfield.props().value).toBe('visitor namespace');
    expect(cookieDomainPeriodsTextfield.props().value).toBe('cookie domain periods');
    expect(fpcookieDomainPeriodsTextfield.props().value).toBe('fp cookie domain periods');
    expect(cookieLifetimeSelect.props().value).toBe('SECONDS');
    expect(cookieLifetimeSecondsTextfield.props().value).toBe('10');
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

    expect(cookieLifetimeSelect.props().value).toBe('SESSION');
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

    expect(cookieLifetimeSelect.props().value).toBe('NONE');
  });

  it('sets settings from form values', () => {
    extensionBridge.init();

    const {
      visitorIDTextfield,
      visitorNamespaceTextfield,
      cookieDomainPeriodsTextfield,
      fpcookieDomainPeriodsTextfield,
      cookieLifetimeSelect
    } = getReactComponents(instance);

    visitorIDTextfield.props().onChange('visitor id');
    visitorNamespaceTextfield.props().onChange('visitor namespace');
    cookieDomainPeriodsTextfield.props().onChange('cookie domain periods');
    fpcookieDomainPeriodsTextfield.props().onChange('fp cookie domain periods');
    cookieLifetimeSelect.props().onChange('SECONDS');

    const { cookieLifetimeSecondsTextfield } = getReactComponents(instance);
    cookieLifetimeSecondsTextfield.props().onChange('11');

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

    cookieLifetimeSelect.props().onChange('SESSION');

    const {
      cookieLifetime
    } = extensionBridge.getSettings().trackerProperties;

    expect(cookieLifetime).toBe('SESSION');
  });

  it('sets NONE cookie lifetime settings from form values', () => {
    extensionBridge.init();

    const { cookieLifetimeSelect } = getReactComponents(instance);

    cookieLifetimeSelect.props().onChange('NONE');

    const {
      cookieLifetime
    } = extensionBridge.getSettings().trackerProperties;

    expect(cookieLifetime).toBe('NONE');
  });

  it('sets error if the number of seconds for cookie lifetime is not provided', () => {
    extensionBridge.init();

    const { cookieLifetimeSelect } = getReactComponents(instance);
    cookieLifetimeSelect.props().onChange('SECONDS');

    const {
      cookieLifetimeSecondsTextfield
    } = getReactComponents(instance);

    cookieLifetimeSecondsTextfield.props().onChange('  ');

    expect(extensionBridge.validate()).toBe(false);
    expect(cookieLifetimeSecondsTextfield.props().validationState).toBe('invalid');
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
});