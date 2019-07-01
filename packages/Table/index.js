import React from "react";
import { Table as DefaultTable } from "antd";
import table from "./table";

const { createColumns } = table;
export default class Table extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  getInitalColumns(fields) {
    const { extraFields = [] } = this.props;
    return createColumns(fields)
      .enhance(extraFields)
      .values();
  }
  render() {
    const {
      fields,
      search = {},
      datas,
      total = 0,
      loading = {},
      actions = {},
      onSearch,
      rowKey = "id",
      footer,
      noPage = false,
      pageName = "pageNum",
      ...others
    } = this.props;

    const columns = this.getInitalColumns(fields);
    const page = search.pageNum ? "pageNum" : pageName;
    const pagination = noPage
      ? false
      : {
          total,
          current: search[page],
          pageSize: search.pageCount || search.pageSize,
          onChange: pn => (onSearch || actions.onSearch)({ [page]: pn }),
          showTotal: t => (footer ? footer({ total, ...search }) : `共 ${t} 条`)
        };

    const tableProps = {
      columns,
      pagination,
      bordered: true,
      dataSource: datas,
      loading: loading.list,
      rowKey,
      ...others
    };

    return <DefaultTable {...tableProps} />;
  }
}
