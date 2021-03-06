/*
Copyright 2020 Adobe. All rights reserved.
This file is licensed to you under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License. You may obtain a copy
of the License at http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software distributed under
the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
OF ANY KIND, either express or implied. See the License for the specific language
governing permissions and limitations under the License.
*/

import React from "react";
import PropTypes from "prop-types";
import Alert from "@react/react-spectrum/Alert";
import "./noSelectedNodeView.styl";

/**
 * Shown when no node is selected within the XDM tree.
 */
const NoSelectedNodeView = props => {
  const { schemaMeta, previouslySavedSchemaInfo } = props;

  // The schema used when the data element was last saved is different
  // from the latest configured schema. Either the customer has since
  // changed which dataset is configured in the edge configuration
  // or they have made changes to the schema itself.
  const isSchemaMismatched =
    previouslySavedSchemaInfo &&
    (previouslySavedSchemaInfo.id !== schemaMeta.$id ||
      previouslySavedSchemaInfo.version !== schemaMeta.version);

  return (
    <div>
      {isSchemaMismatched && (
        <Alert variant="warning" header="Schema Changed">
          The XDM schema has changed since the XDM object was last saved. After
          the next save, any fields that no longer exist on the XDM schema will
          also no longer be included on the XDM object.
        </Alert>
      )}
      <div className="NoSelectedNodeView-description">
        Build an object that complies with your configured schema by selecting
        attributes on the left and providing their values.
      </div>
    </div>
  );
};

NoSelectedNodeView.propTypes = {
  schemaMeta: PropTypes.object.isRequired,
  previouslySavedSchemaInfo: PropTypes.shape({
    id: PropTypes.string.isRequired,
    version: PropTypes.string.isRequired
  })
};

export default NoSelectedNodeView;
