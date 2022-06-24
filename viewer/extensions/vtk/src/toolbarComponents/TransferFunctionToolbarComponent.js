import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import { OldSelect } from '@ohif/ui';

const ToolbarLabel = props => {
  const { label } = props;
  return <div className="toolbar-button-label">{label}</div>;
};

ToolbarLabel.propTypes = {
  label: PropTypes.string.isRequired,
};

const _getSelectOptions = button => {
  return button.operationButtons.map(button => {
    return {
      key: button.label,
      value: button.id,
    };
  });
};

const _getClassNames = (isActive, className) => {
  return classnames('toolbar-button', 'slab-thickness', className, {
    active: isActive,
  });
};

function SlabThicknessToolbarComponent({ button, isActive, className }) {
  const _className = _getClassNames(isActive, className);
  const selectOptions = _getSelectOptions(button);

  return (
    <div className={_className}>
      <div className="controller">
        <p
          style={{
            fontSize: 10,
            paddingTop: 10,
            position: 'absolute',
            top: 0,
            left: '175px',
            width: '100px',
          }}
        >
          Transfer Function
        </p>
        <OldSelect key="toolbar-select" options={selectOptions}></OldSelect>
      </div>
    </div>
  );
}

SlabThicknessToolbarComponent.propTypes = {
  parentContext: PropTypes.object.isRequired,
  toolbarClickCallback: PropTypes.func.isRequired,
  button: PropTypes.object.isRequired,
  activeButtons: PropTypes.array.isRequired,
  isActive: PropTypes.bool,
  className: PropTypes.string,
};

export default SlabThicknessToolbarComponent;
