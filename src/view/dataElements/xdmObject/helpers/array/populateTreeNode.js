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

export default ({
  treeNode,
  formStateNode,
  isAncestorUsingWholePopulationStrategy,
  isUsingWholePopulationStrategy,
  confirmDataPopulatedAtCurrentOrDescendantNode,
  confirmTouchedAtCurrentOrDescendantNode,
  errors,
  touched,
  getTreeNode
}) => {
  const { items } = formStateNode;

  // Arrays using the whole population strategy do not have children visible in the tree
  // Also, arrays with an ancestor using the whole population strategy do not have children visible in the tree.
  if (
    items &&
    items.length &&
    !isUsingWholePopulationStrategy &&
    !isAncestorUsingWholePopulationStrategy
  ) {
    treeNode.children = items.map((itemFormStateNode, index) => {
      const childNode = getTreeNode({
        formStateNode: itemFormStateNode,
        displayName: `Item ${index + 1}`,
        isAncestorUsingWholePopulationStrategy:
          isAncestorUsingWholePopulationStrategy ||
          isUsingWholePopulationStrategy,
        notifyParentOfDataPopulation: confirmDataPopulatedAtCurrentOrDescendantNode,
        notifyParentOfTouched: confirmTouchedAtCurrentOrDescendantNode,
        errors: errors && errors.items ? errors.items[index] : undefined,
        touched: touched && touched.items ? touched.items[index] : undefined
      });
      return childNode;
    });
  }
};
