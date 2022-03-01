import gql from 'graphql-tag';
import * as compose from 'lodash.flowright';
import { IRouterProps } from '@erxes/ui/src/types';
import { Alert, withProps } from 'modules/common/utils';
import { router } from 'modules/common/utils';
import React from 'react';
import { graphql } from 'react-apollo';
import { withRouter } from 'react-router-dom';
import Properties from '../components/Properties';
import { FIELDS_GROUPS_CONTENT_TYPES } from '@erxes/ui-settings/src/properties/constants';
import { mutations, queries } from '@erxes/ui-settings/src/properties/graphql';
import {
  FieldsGroupsRemoveMutationResponse,
  FieldsGroupsUpdateVisibleMutationResponse,
  FieldsRemoveMutationResponse,
  FieldsUpdateVisibleMutationResponse,
  FieldsUpdateOrderMutationResponse,
  FieldsUpdateOrderMutationVariables,
  GroupsUpdateOrderMutationResponse
} from '../types';
import { FieldsGroupsQueryResponse } from '@erxes/ui-settings/src/properties/types';
import { updateCustomFieldsCache } from '@erxes/ui-settings/src/properties/utils';
import Spinner from 'modules/common/components/Spinner';

type Props = {
  queryParams: any;
};

type FinalProps = {
  fieldsGroupsQuery: FieldsGroupsQueryResponse;
} & Props &
  FieldsGroupsRemoveMutationResponse &
  FieldsRemoveMutationResponse &
  FieldsGroupsUpdateVisibleMutationResponse &
  FieldsUpdateVisibleMutationResponse &
  FieldsUpdateOrderMutationResponse &
  GroupsUpdateOrderMutationResponse &
  IRouterProps;

const PropertiesContainer = (props: FinalProps) => {
  const {
    fieldsGroupsQuery,
    history,
    fieldsGroupsRemove,
    fieldsRemove,
    fieldsGroupsUpdateVisible,
    fieldsUpdateVisible,
    fieldsUpdateOrder,
    groupsUpdateOrder,
    queryParams
  } = props;

  if (fieldsGroupsQuery.loading) {
    return <Spinner objective={true} />;
  }

  if (!router.getParam(history, 'type')) {
    router.setParams(
      history,
      { type: FIELDS_GROUPS_CONTENT_TYPES.CUSTOMER },
      true
    );
  }

  const removePropertyGroup = ({ _id }) => {
    fieldsGroupsRemove({
      variables: { _id }
    })
      .then(() => {
        Alert.success('You successfully deleted a property group');
      })
      .catch(e => {
        Alert.error(e.message);
      });
  };

  const removeProperty = ({ _id }) => {
    fieldsRemove({
      variables: { _id }
    })
      .then(() => {
        updateCustomFieldsCache({ id: _id, type: queryParams.type });

        Alert.success('You successfully deleted a property field');
      })
      .catch(e => {
        Alert.error(e.message);
      });
  };

  const updatePropertyVisible = ({ _id, isVisible }) => {
    fieldsUpdateVisible({
      variables: { _id, isVisible }
    })
      .then(() => {
        Alert.success('You changed a property field visibility');
      })
      .catch(e => {
        Alert.error(e.message);
      });
  };

  const updatePropertyDetailVisible = ({ _id, isVisibleInDetail }) => {
    fieldsUpdateVisible({
      variables: { _id, isVisibleInDetail }
    })
      .then(() => {
        Alert.success('You changed a property field visibility');
      })
      .catch(e => {
        Alert.error(e.message);
      });
  };

  const updatePropertyGroupVisible = ({ _id, isVisible }) => {
    fieldsGroupsUpdateVisible({
      variables: { _id, isVisible }
    })
      .then(() => {
        Alert.success('You changed a property group visibility');
      })
      .catch(e => {
        Alert.error(e.message);
      });
  };

  const updateFieldOrder = fieldOrders => {
    fieldsUpdateOrder({
      variables: {
        orders: fieldOrders.map((field, index) => ({
          _id: field._id,
          order: index + 1
        }))
      }
    }).catch(error => {
      Alert.error(error.message);
    });
  };

  const updateGroupOrder = groupOrders => {
    groupsUpdateOrder({
      variables: {
        orders: groupOrders.map((group, index) => ({
          _id: group._id,
          order: index + 1
        }))
      }
    }).catch(error => {
      Alert.error(error.message);
    });
  };

  const currentType = router.getParam(history, 'type');
  const fieldsGroups = [...(fieldsGroupsQuery.fieldsGroups || [])];

  const updatedProps = {
    ...props,
    fieldsGroups,
    currentType,
    removePropertyGroup,
    removeProperty,
    updatePropertyVisible,
    updatePropertyDetailVisible,
    updatePropertyGroupVisible,
    updateFieldOrder,
    updateGroupOrder
  };

  return <Properties {...updatedProps} />;
};

const options = ({ queryParams }) => ({
  refetchQueries: [
    {
      query: gql`
        ${queries.fieldsGroups}
      `,
      variables: {
        contentType: queryParams.type
      }
    }
  ]
});

export default withProps<Props>(
  compose(
    graphql<Props, FieldsGroupsQueryResponse>(gql(queries.fieldsGroups), {
      name: 'fieldsGroupsQuery',
      options: ({ queryParams }) => ({
        variables: {
          contentType: queryParams.type || ''
        }
      })
    }),
    graphql<Props, FieldsGroupsRemoveMutationResponse, { _id: string }>(
      gql(mutations.fieldsGroupsRemove),
      {
        name: 'fieldsGroupsRemove',
        options
      }
    ),
    graphql<Props, FieldsRemoveMutationResponse, { _id: string }>(
      gql(mutations.fieldsRemove),
      {
        name: 'fieldsRemove',
        options
      }
    ),
    graphql<
      Props,
      FieldsUpdateVisibleMutationResponse,
      { _id: string; isVisible: boolean; isVisibleInDetail: boolean }
    >(gql(mutations.fieldsUpdateVisible), {
      name: 'fieldsUpdateVisible',
      options
    }),
    graphql<
      Props,
      FieldsGroupsUpdateVisibleMutationResponse,
      { _id: string; isVisible: boolean }
    >(gql(mutations.fieldsGroupsUpdateVisible), {
      name: 'fieldsGroupsUpdateVisible',
      options
    }),
    graphql<
      Props,
      FieldsUpdateOrderMutationResponse,
      FieldsUpdateOrderMutationVariables
    >(gql(mutations.fieldsUpdateOrder), {
      name: 'fieldsUpdateOrder',
      options
    }),
    graphql<
      Props,
      GroupsUpdateOrderMutationResponse,
      FieldsUpdateOrderMutationVariables
    >(gql(mutations.groupsUpdateOrder), {
      name: 'groupsUpdateOrder',
      options
    })
  )(withRouter<FinalProps>(PropertiesContainer))
);