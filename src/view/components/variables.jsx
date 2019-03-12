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

import React from 'react';
import Select from '@react/react-spectrum/Select';
import Textfield from '@react/react-spectrum/Textfield';
import InfoTip from '../extensionConfiguration/components/infoTip';
import WrappedField from '../extensionConfiguration/components/wrappedField';
import { mergeConfigs } from '../utils/formConfigUtils';
import EvarsPropsEditor, { getFormConfig as getEvarsPropsEditorFormConfig } from './evarsPropsEditor';
import EventsEditor, { formConfig as eventsFormConfig } from './eventsEditor';
import HierarchiesEditor, { formConfig as hierarchiesFormConfig } from './hierarchiesEditor';
import COMPONENT_NAMES from '../enums/componentNames';

import './variables.styl';

const DYNAMIC_VARIABLE_PREFIX_DEFAULT = 'D=';

const campaignTypeOptions = [{
  label: 'Value',
  value: 'value'
}, {
  label: 'Query Parameter',
  value: 'queryParam'
}];

export default ({ showDynamicVariablePrefix = true, showEvents = true }) =>
  <div>
    <span className="Label">eVars</span>
    <EvarsPropsEditor varType="eVar" varTypePlural="eVars" />

    <span className="Label u-gapTop">Props</span>
    <EvarsPropsEditor varType="prop" varTypePlural="props" />

    {
      showEvents ?
        <div>
          <span className="Label u-gapTop">Events</span>
          <InfoTip className="u-fieldLineHeight">
            Events are milestones within a site. By default events are configured as <br />
            <a href="https://marketing.adobe.com/resources/help/en_US/sc/implement/events.html" target="_blank" rel="noopener noreferrer">
              counter events.</a><br />
            Unless specified otherwise a counter event is assigned the value of one. A counter
            event can be assigned a value other than one by specifying it in the value field.<br />
            You can specify a unique event ID to <br />
            <a href="https://marketing.adobe.com/resources/help/en_US/sc/implement/event_serialization_impl.html" target="_blank" rel="noopener noreferrer">
            prevent duplicate events</a> (e.g. during a page reload) from being recorded more than
            once.
          </InfoTip>
          <EventsEditor />
        </div> : null
    }

    <span className="Label u-gapTop">Hierarchy</span>
    <HierarchiesEditor />

    <div className="ColumnGrid">
      <label className="ColumnGrid-cell">
        <span className="Label u-gapTop">Page Name</span>
        <div>
          <WrappedField
            name="trackerProperties.pageName"
            component={ Textfield }
            componentClassName="Field--long"
            supportDataElement
          />
        </div>
      </label>

      <label className="ColumnGrid-cell">
        <span className="Label u-gapTop">Page URL</span>
        <div>
          <WrappedField
            name="trackerProperties.pageURL"
            component={ Textfield }
            componentClassName="Field--long"
            supportDataElement
          />
        </div>
      </label>

      <label className="ColumnGrid-cell">
        <span className="Label u-gapTop">Server</span>
        <div>
          <WrappedField
            name="trackerProperties.server"
            component={ Textfield }
            componentClassName="Field--long"
            supportDataElement
          />
        </div>
      </label>

      <label className="ColumnGrid-cell">
        <span className="Label u-gapTop">Channel</span>
        <div>
          <WrappedField
            name="trackerProperties.channel"
            component={ Textfield }
            componentClassName="Field--long"
            supportDataElement
          />
        </div>
      </label>

      <label className="ColumnGrid-cell">
        <span className="Label u-gapTop">Referrer</span>
        <div>
          <WrappedField
            name="trackerProperties.referrer"
            component={ Textfield }
            componentClassName="Field--long"
            supportDataElement
          />
        </div>
      </label>

      <label className="ColumnGrid-cell" htmlFor="campaignValue">
        <span className="Label u-gapTop">Campaign</span>
        <div>
          <WrappedField
            name="trackerProperties.campaign.type"
            componentClassName="Variables-campaignType"
            component={ Select }
            options={ campaignTypeOptions }
            onBlur={ e => e.preventDefault() }
          />

          <WrappedField
            name="trackerProperties.campaign.value"
            inputClassName="Variables-campaignValue"
            component={ Textfield }
            componentClassName="Variables-campaignValue u-gapLeft"
            supportDataElement
          />
        </div>
      </label>

      <label className="ColumnGrid-cell">
        <span className="Label u-gapTop">State</span>
        <div>
          <WrappedField
            name="trackerProperties.state"
            component={ Textfield }
            componentClassName="Field--long"
            supportDataElement
          />
        </div>
      </label>

      <label className="ColumnGrid-cell">
        <span className="Label u-gapTop">Zip</span>
        <div>
          <WrappedField
            name="trackerProperties.zip"
            component={ Textfield }
            componentClassName="Field--long"
            supportDataElement
          />
        </div>
      </label>

      <label className="ColumnGrid-cell">
        <span className="Label u-gapTop">Transaction ID</span>
        <div>
          <WrappedField
            name="trackerProperties.transactionID"
            component={ Textfield }
            componentClassName="Field--long"
            supportDataElement
          />
        </div>
      </label>

      {
        showDynamicVariablePrefix ?
          <label className="ColumnGrid-cell">
            <span className="Label u-gapTop">Dynamic Variable Prefix</span>
            <div>
              <WrappedField
                name="trackerProperties.dynamicVariablePrefix"
                component={ Textfield }
                componentClassName="Field--long"
                supportDataElement
              />
            </div>
          </label> : null
      }
    </div>
  </div>;

export const formConfig = mergeConfigs(
  getEvarsPropsEditorFormConfig('eVar', 'eVars'),
  getEvarsPropsEditorFormConfig('prop', 'props'),
  eventsFormConfig,
  hierarchiesFormConfig,
  {
    settingsToFormValues: (values, settings) => {
      const {
        dynamicVariablePrefix,
        pageName,
        pageURL,
        server,
        channel,
        referrer,
        campaign,
        transactionID,
        state,
        zip
      } = settings.trackerProperties || {};

      return {
        ...values,
        trackerProperties: {
          ...values.trackerProperties,
          dynamicVariablePrefix: dynamicVariablePrefix || DYNAMIC_VARIABLE_PREFIX_DEFAULT,
          pageName,
          pageURL,
          server,
          channel,
          referrer,
          campaign: {
            type: campaign && campaign.type ? campaign.type : 'value',
            value: campaign && campaign.value ? campaign.value : ''
          },
          transactionID,
          state,
          zip
        }
      };
    },
    formValuesToSettings: (settings, values) => {
      const {
        dynamicVariablePrefix,
        pageName,
        pageURL,
        server,
        channel,
        referrer,
        campaign,
        transactionID,
        state,
        zip
      } = values.trackerProperties;

      const trackerProperties = {
        ...settings.trackerProperties
      };

      if (pageName) {
        trackerProperties.pageName = pageName;
      }

      if (pageURL) {
        trackerProperties.pageURL = pageURL;
      }

      if (channel) {
        trackerProperties.channel = channel;
      }

      if (server) {
        trackerProperties.server = server;
      }

      if (dynamicVariablePrefix && dynamicVariablePrefix !== DYNAMIC_VARIABLE_PREFIX_DEFAULT) {
        trackerProperties.dynamicVariablePrefix = dynamicVariablePrefix;
      }

      if (referrer) {
        trackerProperties.referrer = referrer;
      }

      if (campaign && campaign.value) {
        trackerProperties.campaign = {
          type: campaign.type,
          value: campaign.value
        };
      }

      if (transactionID) {
        trackerProperties.transactionID = transactionID;
      }

      if (state) {
        trackerProperties.state = state;
      }

      if (zip) {
        trackerProperties.zip = zip;
      }

      return {
        ...settings,
        trackerProperties
      };
    },
    validate(errors) {
      const componentsWithErrors = errors.componentsWithErrors ?
        errors.componentsWithErrors.slice() : [];

      if ([COMPONENT_NAMES.EVARS, COMPONENT_NAMES.PROPS]
          .filter(componentName => componentsWithErrors.indexOf(componentName) !== -1).length) {
        componentsWithErrors.push(COMPONENT_NAMES.VARIABLES);
      }

      return {
        ...errors,
        componentsWithErrors
      };
    }
  }
);
