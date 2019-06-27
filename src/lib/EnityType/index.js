import _ from "lodash";
import React, { Component } from "react";
import CheckItem from "../CheckItem";
import styles from "./index.less";
import MenuContainer from "./MenuContainer";

class EnityType extends Component {
  state = {
    checkedAll: false,
    indeterminate: false,
    value: []
  };

  componentDidMount() {
    const { value, options = [] } = this.props;
    this.renewOptions(options, value);
  }

  renewOptions = (options, value) => {
    const newOptions = this.extendOptions(options);
    this.setState({ options: newOptions }, () => {
      this.setCheckState(value);
    });
  };

  extendOptions = options => {
    const newOptions = options?.map(e => {
      Object.defineProperty(e, "subCodes", {
        emberable: false,
        get() {
          return this.children?.map(e => e.code);
        }
      });

      return e;
    });

    Object.defineProperty(newOptions, "subCodes", {
      emberable: false,
      get() {
        return this.map(e => e.subCodes).reduce(
          (hash, e) => hash.concat(e),
          []
        );
      }
    });

    return newOptions;
  };

  componentWillReceiveProps(nextProps) {
    const { value: newValue, options } = nextProps;
    const { value } = this.state;
    if (!_.isEqual(value, newValue)) {
      this.renewOptions(options, newValue);
    }
  }

  handleClickAll = callback => {
    const { options } = this.state;
    this.setState(({ checkedAll }) => {
      const newCheckAll = !checkedAll;
      const newChecks = newCheckAll ? options.subCodes : [];

      if (callback) {
        callback(newChecks);
      }

      return {
        indeterminate: false,
        checkedAll: newCheckAll,
        value: newChecks
      };
    });
  };

  setCheckState = newChecks => {
    this.setState(({ options }) => {
      let checkedAll = false;
      let indeterminate = false;

      // 如果没有选择任何项目
      if (!newChecks || newChecks.length === 0) {
        checkedAll = false;
        indeterminate = false;
      } else if (newChecks && newChecks.length === options.subCodes.length) {
        // 如果全选
        checkedAll = true;
        indeterminate = false;
      } else {
        // 部分选择
        checkedAll = false;
        indeterminate = true;
      }

      return { value: newChecks, checkedAll, indeterminate };
    });
  };

  render() {
    const { onChange } = this.props;
    const { options, checkedAll, indeterminate, value } = this.state;

    if (!options || options.length === 0) {
      return null;
    }

    return (
      <div className={styles.container}>
        <CheckItem
          checked={checkedAll}
          indeterminate={indeterminate}
          onClick={() =>
            this.handleClickAll(newChecks => {
              if (onChange) {
                onChange(newChecks);
              }
            })
          }
        >
          <i style={{ fontStyle: "normal" }}>全选</i>
        </CheckItem>
        {options?.map((option, key) => {
          const filterValue = _.intersection(value, option.subCodes);

          return (
            <MenuContainer
              key={key}
              data={option}
              value={filterValue}
              onChange={vals => {
                const otherSubCodes = _.difference(value, option.subCodes);
                const newChecks = otherSubCodes.concat(vals);
                if (onChange) {
                  onChange(newChecks);
                }

                this.setCheckState(newChecks);
              }}
            />
          );
        })}
      </div>
    );
  }
}

export default EnityType;
