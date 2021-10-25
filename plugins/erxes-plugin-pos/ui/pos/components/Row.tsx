import dayjs from 'dayjs';
import { Capitalize } from 'modules/settings/permissions/styles';
import React from 'react';
import { Link } from 'react-router-dom';
import {
  ActionButtons,
  Button,
  FormControl,
  Icon,
  Label,
  Tip,
  __,
  WithPermission,
  Tags
} from 'erxes-ui';
import { IIntegration, IPos } from '../../types';
import { RowTitle } from '../../styles';
import { DateWrapper } from 'erxes-ui/lib/styles/main';
import { PLUGIN_URL } from '../../constants';

type Props = {
  pos: IPos;
  isChecked: boolean;
  toggleBulk: (pos: IPos, checked: boolean) => void;
  remove: (posId: string) => void;
  archive: (posId: string, status: boolean) => void;
  copy: (posId: string) => void;
  showCode?: boolean;
};

class Row extends React.Component<Props> {
  manageAction(pos) {
    return (
      <Link to={`${PLUGIN_URL}/pos/edit/${pos._id}`}>
        <Button btnStyle="link">
          <Tip text={__('Manage')} placement="top">
            <Icon icon="edit-3" />
          </Tip>
        </Button>
      </Link>
    );
  }

  renderRemoveAction() {
    const { pos, remove } = this.props;

    const onClick = () => remove(pos._id);

    return (
      <WithPermission action="integrationsRemove">
        <Tip text={__('Delete')} placement="top">
          <Button
            id="integrationDelete"
            btnStyle="link"
            onClick={onClick}
            icon="times-circle"
          />
        </Tip>
      </WithPermission>
    );
  }

  render() {
    const { pos, isChecked, toggleBulk } = this.props;
    const { integration } = pos;
    const tags = integration.tags || [];

    const createdUser = pos.user || {
      _id: '',
      details: { fullName: '' }
    };

    const onChange = e => {
      if (toggleBulk) {
        toggleBulk(pos, e.target.checked);
      }
    };

    const labelStyle = integration.isActive ? 'success' : 'warning';
    const status = integration.isActive ? __('Active') : __('Archived');

    return (
      <tr>
        <td>
          <FormControl
            checked={isChecked}
            componentClass="checkbox"
            onChange={onChange}
          />
        </td>
        <td>
          <RowTitle>
            <Link to={`${PLUGIN_URL}/pos/edit/${pos._id}`}>{pos.name}</Link>
          </RowTitle>
        </td>
        <td>
          <Label lblStyle={labelStyle}>{status}</Label>
        </td>
        <td>
          <strong>{integration.brand ? integration.brand.name : ''}</strong>
        </td>
        <td>
          <div key={createdUser._id}>
            <Capitalize>
              {createdUser.details && createdUser.details.fullName}
            </Capitalize>
          </div>
        </td>
        <td>
          <Icon icon="calender" />{' '}
          <DateWrapper>{dayjs(new Date()).format('ll')}</DateWrapper>
        </td>

        <td>
          <Tags tags={tags} limit={2} />
        </td>

        <td>
          <ActionButtons>
            {this.manageAction(integration)}
            {this.renderRemoveAction()}
          </ActionButtons>
        </td>
      </tr>
    );
  }
}

export default Row;
