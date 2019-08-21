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

import Variables, { formConfig } from '../variables';
import createExtensionBridge from '../../__tests__/helpers/createExtensionBridge';
import bootstrap from '../../bootstrap';


const getReactComponents = (wrapper) => {
  const nameContains = (name) => {
    return n => n.prop('name') && n.prop('name').indexOf(name) !== -1;
  };
  const dynamicVariablePrefixTextField =
    wrapper.find(Textfield).filterWhere(nameContains('dynamicVariablePrefix'));
  const pageNameTextField =
    wrapper.find(Textfield).filterWhere(nameContains('pageName'));
  const pageURLTextField =
    wrapper.find(Textfield).filterWhere(nameContains('pageURL'));
  const serverTextField =
    wrapper.find(Textfield).filterWhere(nameContains('server'));
  const channelTextField =
    wrapper.find(Textfield).filterWhere(nameContains('channel'));
  const referrerTextField =
    wrapper.find(Textfield).filterWhere(nameContains('referrer'));
  const campaignSelect =
    wrapper.find(Select).filterWhere(nameContains('campaign.type'));
  const campaignTextField =
    wrapper.find(Textfield).filterWhere(nameContains('campaign.value'));
  const transactionIDTextField =
    wrapper.find(Textfield).filterWhere(nameContains('transactionID'));
  const stateTextField =
    wrapper.find(Textfield).filterWhere(nameContains('state'));
  const zipTextField =
    wrapper.find(Textfield).filterWhere(nameContains('zip'));

  return {
    dynamicVariablePrefixTextField,
    pageNameTextField,
    pageURLTextField,
    serverTextField,
    channelTextField,
    referrerTextField,
    campaignSelect,
    campaignTextField,
    transactionIDTextField,
    stateTextField,
    zipTextField
  };
};

describe('variables', () => {
  let extensionBridge;
  let instance;

  beforeAll(() => {
    extensionBridge = createExtensionBridge();
    instance = mount(bootstrap(Variables, formConfig, extensionBridge));
  });

  it('sets form values from settings', () => {
    extensionBridge.init({
      settings: {
        trackerProperties: {
          dynamicVariablePrefix: 'D=dynamicVariable_value',
          pageName: 'pageName_value',
          pageURL: 'pageURL_value',
          server: 'server_value',
          channel: 'channel_value',
          referrer: 'referrer_value',
          campaign: {
            type: 'value',
            value: 'campaign_value'
          },
          transactionID: 'transactionID_value',
          state: 'state_value',
          zip: 'zip_value'
        }
      }
    });

    const {
      dynamicVariablePrefixTextField,
      pageNameTextField,
      pageURLTextField,
      serverTextField,
      channelTextField,
      referrerTextField,
      campaignSelect,
      campaignTextField,
      transactionIDTextField,
      stateTextField,
      zipTextField
    } = getReactComponents(instance);

    expect(dynamicVariablePrefixTextField.props().value).toBe('D=dynamicVariable_value');
    expect(pageNameTextField.props().value).toBe('pageName_value');
    expect(pageURLTextField.props().value).toBe('pageURL_value');
    expect(serverTextField.props().value).toBe('server_value');
    expect(channelTextField.props().value).toBe('channel_value');
    expect(referrerTextField.props().value).toBe('referrer_value');
    expect(campaignSelect.props().value).toBe('value');
    expect(campaignTextField.props().value).toBe('campaign_value');
    expect(transactionIDTextField.props().value).toBe('transactionID_value');
    expect(stateTextField.props().value).toBe('state_value');
    expect(zipTextField.props().value).toBe('zip_value');
  });

  it('sets settings from form values', () => {
    extensionBridge.init();

    const {
      dynamicVariablePrefixTextField,
      pageNameTextField,
      pageURLTextField,
      serverTextField,
      channelTextField,
      referrerTextField,
      campaignSelect,
      campaignTextField,
      transactionIDTextField,
      stateTextField,
      zipTextField
    } = getReactComponents(instance);

    dynamicVariablePrefixTextField.props().onChange('D=dynamicVariable_value');
    pageNameTextField.props().onChange('pageName_value');
    pageURLTextField.props().onChange('pageURL_value');
    serverTextField.props().onChange('server_value');
    channelTextField.props().onChange('channel_value');
    referrerTextField.props().onChange('referrer_value');
    campaignSelect.props().onChange('value');
    campaignTextField.props().onChange('campaign_value');
    transactionIDTextField.props().onChange('transactionID_value');
    stateTextField.props().onChange('state_value');
    zipTextField.props().onChange('zip_value');

    const {
      trackerProperties
    } = extensionBridge.getSettings();

    expect(trackerProperties.dynamicVariablePrefix).toBe('D=dynamicVariable_value');
    expect(trackerProperties.pageName).toBe('pageName_value');
    expect(trackerProperties.pageURL).toBe('pageURL_value');
    expect(trackerProperties.server).toBe('server_value');
    expect(trackerProperties.channel).toBe('channel_value');
    expect(trackerProperties.referrer).toBe('referrer_value');
    expect(trackerProperties.campaign).toEqual({ type: 'value', value: 'campaign_value' });
    expect(trackerProperties.transactionID).toBe('transactionID_value');
    expect(trackerProperties.state).toBe('state_value');
    expect(trackerProperties.zip).toBe('zip_value');
  });
});