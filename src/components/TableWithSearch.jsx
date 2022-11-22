/* eslint-disable react/jsx-props-no-spreading */
import React from 'react';
import {
  Input,
  Button,
  Icon,
  Table,
} from 'antd';
import { StyleSheet, css } from 'aphrodite';
import Highlighter from 'react-highlight-words';

const styles = StyleSheet.create({
  column: {
    padding: 8,
  },
  input: {
    width: 188,
    marginBottom: 8,
    display: 'block',
  },
  searchButton: {
    width: 90,
    marginRight: 8,
  },
  resetButton: {
    width: 90,
  },
  searchIcon: {
    color: '#1890ff',
  },
});
/**
 * HOC for Table component that returns a table with search
 * @param {*} WrappedTable should be Table component from 'antd'
 * NOTE: columns with customized render function, or those with 'disableSearch' set to true,
 *  won't be able to be searched on. Also, to avoid some quirky bugs you should always set
 *  a 'rowKey' corresponding to distinct key field of each item.
 */
const withSearch = (WrappedTable) => class extends React.Component {
  constructor() {
    super();
    this.state = {
      searchText: '',
      searchedColumn: '',
    };
  }

  getColumnSearchProps = (dataIndex, title) => ({
    filterDropdown: ({
      setSelectedKeys,
      selectedKeys,
      confirm,
      clearFilters,
    }) => (
      <div className={css(styles.column)}>
        <Input
          ref={(node) => {
            this.searchInput = node;
          }}
          placeholder={`搜索 ${title}`}
          value={selectedKeys[0]}
          onChange={(e) => setSelectedKeys(e.target.value ? [e.target.value] : [])}
          onPressEnter={() => this.handleSearch(selectedKeys, confirm)}
          className={css(styles.input)}
        />
        <Button
          type="primary"
          onClick={() => this.handleSearch(selectedKeys, confirm, dataIndex)}
          icon="search"
          size="small"
          className={css(styles.searchButton)}
        >
          搜索
        </Button>
        <Button
          onClick={() => this.handleReset(clearFilters)}
          size="small"
          className={css(styles.resetButton)}
        >
          重置
        </Button>
      </div>
    ),
    filterIcon: (filtered) => {
      const className = css(filtered && styles.searchIcon);
      return (<Icon type="search" className={className} />);
    },
    onFilter: (value, record) => {
      if (value == null || record[dataIndex] == null) {
        return false;
      }
      return record[dataIndex]
        .toString()
        .toLowerCase()
        .includes(value.toLowerCase());
    },
    onFilterDropdownVisibleChange: (visible) => {
      if (visible) {
        setTimeout(() => this.searchInput.select());
      }
    },
    render: (text) => {
      if (text == null) return null;
      const { searchText, searchedColumn } = this.state;
      if (searchedColumn === dataIndex) {
        return (
          <Highlighter
            highlightStyle={{ backgroundColor: '#ffc069', padding: 0 }}
            searchWords={[searchText]}
            autoEscape
            textToHighlight={text.toString()}
          />
        );
      }
      return text;
    },
  });

  handleSearch = (selectedKeys, confirm, dataIndex) => {
    confirm();
    this.setState({
      searchText: selectedKeys[0],
      searchedColumn: dataIndex,
    });
  };

  handleReset = (clearFilters) => {
    clearFilters();
    this.setState({
      searchText: '',
      searchedColumn: '',
    });
  };

  render() {
    const { columns } = this.props;
    const newColumns = columns.map((item) => {
      if (item.render || item.disableSearch) {
        return item;
      }
      return { ...item, ...this.getColumnSearchProps(item.dataIndex, item.title) };
    });
    const newProps = {
      ...this.props,
      columns: newColumns,
    };
    return <WrappedTable {...newProps} />;
  }
};

export default withSearch(Table);
