import React from "react";
import { Table, TableCell, TableHead, TableRow } from "@material-ui/core";
const ScrapingThreadStatisticRow = ({ collapsed, showUrl }) => {
  const renderRetryStatusCode = (statusCode) => {
    statusCode = statusCode || 200;
    return (
      <Typography
        variant="overline"
        className={clsx({
          [classes.red]: statusCode >= 400,
          [classes.orange]: statusCode >= 300 && statusCode < 400,
          [classes.green]: statusCode < 300,
        })}
      >
        <code>{statusCode}</code>
      </Typography>
    );
  };
  return (
    <Collapse in={Collapsed} timeout="auto" unmountOnExit>
      <Table>
        <colgroup>
          <col style={{ width: "60%" }} />
          <col style={{ width: "20%" }} />
          <col style={{ width: "10%" }} />
          <col style={{ width: "10%" }} />
        </colgroup>
        <TableHead>
          <TableRow>
            {showUrl && <TableCell>URL</TableCell>}
            <TableCell>Status code</TableCell>
          </TableRow>
        </TableHead>
        <TableBody></TableBody>
      </Table>
    </Collapse>
  );
};

export default ScrapingThreadStatisticRow;
