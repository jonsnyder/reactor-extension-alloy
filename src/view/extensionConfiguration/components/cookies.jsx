import React from 'react';
import Coral from '@coralui/coralui-support-reduxform';
import { ValidationWrapper, DataElementSelectorButton } from '@reactor/react-components';
import openDataElementSelector from '../../utils/openDataElementSelector';

const cookieLifetimePeriod = {
  DEFAULT: 'DEFAULT',
  NONE: 'NONE',
  SESSION: 'SESSION',
  SECONDS: 'SECONDS'
};

export default class Cookies extends React.Component {
  render() {
    const {
      visitorID,
      visitorNamespace,
      cookieDomainPeriods,
      fpCookieDomainPeriods,
      transactionID,
      cookieLifetime,
      cookieLifetimeSeconds
    } = this.props.fields.trackerProperties;

    return (
      <div className="Cookies">
        <label className="Cookies-field">
          <span className="Label">Visitor ID</span>
          <div>
            <Coral.Textfield className="Field--long" {...visitorID}/>
            <DataElementSelectorButton
              onClick={openDataElementSelector.bind(this, visitorID)}/>
          </div>
        </label>
        <label className="Cookies-field">
          <span className="Label">Visitor Namespace</span>
          <div>
            <Coral.Textfield className="Field--long" {...visitorNamespace}/>
            <DataElementSelectorButton
              onClick={openDataElementSelector.bind(this, visitorNamespace)}/>
          </div>
        </label>
        <label className="Cookies-field">
          <span className="Label">Domain Periods</span>
          <div>
            <Coral.Textfield className="Field--long" {...cookieDomainPeriods}/>
            <DataElementSelectorButton
              onClick={openDataElementSelector.bind(this, cookieDomainPeriods)}/>
          </div>
        </label>
        <label className="Cookies-field">
          <span className="Label">First-party Domain Periods</span>
          <div>
            <Coral.Textfield className="Field--long" {...fpCookieDomainPeriods}/>
            <DataElementSelectorButton
              onClick={openDataElementSelector.bind(this, fpCookieDomainPeriods)}/>
          </div>
        </label>
        <label className="Cookies-field">
          <span className="Label">Transaction ID</span>
          <div>
            <Coral.Textfield className="Field--long" {...transactionID}/>
            <DataElementSelectorButton
              onClick={openDataElementSelector.bind(this, transactionID)}/>
          </div>
        </label>
        <div className="Cookies-field">
          <label className="Label" htmlFor="cookieLifetimeField">Cookie Lifetime</label>
          <div>
            <Coral.Select id="cookieLifetimeField"
              className="Cookies-cookieLifetime u-gapRight"
              {...cookieLifetime}>
              <Coral.Select.Item value={cookieLifetimePeriod.DEFAULT}>Default</Coral.Select.Item>
              <Coral.Select.Item value={cookieLifetimePeriod.NONE}>None</Coral.Select.Item>
              <Coral.Select.Item value={cookieLifetimePeriod.SESSION}>Session</Coral.Select.Item>
              <Coral.Select.Item value={cookieLifetimePeriod.SECONDS}>Seconds</Coral.Select.Item>
            </Coral.Select>
            {
              cookieLifetime.value === cookieLifetimePeriod.SECONDS ?
                <ValidationWrapper
                    error={cookieLifetimeSeconds.touched && cookieLifetimeSeconds.error}>
                  <Coral.Textfield className="Cookies-cookieLifetimeSeconds"
                    {...cookieLifetimeSeconds}/>
                  <DataElementSelectorButton
                    onClick={openDataElementSelector.bind(this, cookieLifetimeSeconds)}/>
                </ValidationWrapper> : null
            }
           </div>
        </div>
      </div>
    );
  }
}

export const formConfig = {
  fields: [
    'trackerProperties.visitorID',
    'trackerProperties.visitorNamespace',
    'trackerProperties.cookieDomainPeriods',
    'trackerProperties.fpCookieDomainPeriods',
    'trackerProperties.transactionID',
    'trackerProperties.cookieLifetime',
    'trackerProperties.cookieLifetimeSeconds'
  ],
  settingsToFormValues(values, options) {
    const {
      visitorID,
      visitorNamespace,
      cookieDomainPeriods,
      fpCookieDomainPeriods,
      transactionID,
      cookieLifetime
    } = options.settings.trackerProperties || {};

    const trackerProperties = {
      ...values.trackerProperties,
      visitorID,
      visitorNamespace,
      cookieDomainPeriods,
      fpCookieDomainPeriods,
      transactionID
    };

    if (cookieLifetime) {
      switch (cookieLifetime) {
        case cookieLifetimePeriod.NONE:
        case cookieLifetimePeriod.SESSION:
          trackerProperties.cookieLifetime = cookieLifetime;
          break;
        default:
          trackerProperties.cookieLifetimeSeconds = cookieLifetime;
          trackerProperties.cookieLifetime = cookieLifetimePeriod.SECONDS;
      }
    }

    return {
      ...values,
      trackerProperties
    };
  },
  formValuesToSettings(settings, values) {
    const {
      visitorID,
      visitorNamespace,
      cookieDomainPeriods,
      fpCookieDomainPeriods,
      transactionID,
      cookieLifetime,
      cookieLifetimeSeconds
    } = values.trackerProperties;

    const trackerProperties = {
      ...settings.trackerProperties
    };

    if (visitorID) {
      trackerProperties.visitorID = visitorID;
    }

    if (visitorNamespace) {
      trackerProperties.visitorNamespace = visitorNamespace;
    }

    if (cookieDomainPeriods) {
      trackerProperties.cookieDomainPeriods = cookieDomainPeriods;
    }

    if (fpCookieDomainPeriods) {
      trackerProperties.fpCookieDomainPeriods = fpCookieDomainPeriods;
    }

    if (transactionID) {
      trackerProperties.transactionID = transactionID;
    }

    switch (cookieLifetime) {
      case cookieLifetimePeriod.NONE:
      case cookieLifetimePeriod.SESSION:
        trackerProperties.cookieLifetime = cookieLifetime;
        break;
      case cookieLifetimePeriod.SECONDS:
        if (cookieLifetimeSeconds && cookieLifetimeSeconds.trim().length > 0) {
          trackerProperties.cookieLifetime = cookieLifetimeSeconds.trim();
        }
        break;
    }

    return {
      ...settings,
      trackerProperties
    };
  }
};
