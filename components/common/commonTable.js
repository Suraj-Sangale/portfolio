import * as React from "react";
import PropTypes from "prop-types";
import { alpha } from "@mui/material/styles";
import Box from "@mui/material/Box";
import TablePagination from "@mui/material/TablePagination";
import TableSortLabel from "@mui/material/TableSortLabel";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
// import IconButton from "@mui/material/IconButton";
// import Tooltip from "@mui/material/Tooltip";
import FormControlLabel from "@mui/material/FormControlLabel";
import Switch from "@mui/material/Switch";
import { visuallyHidden } from "@mui/utils";
import { useState, useMemo, useEffect } from "react";
import { FiEdit } from "react-icons/fi";

import { convertToUpperCase } from "@/utilities/utils";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Checkbox,
  Button,
  Paper,
} from "@mui/material";

// Utility functions for sorting
function descendingComparator(a, b, orderBy) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

function getComparator(order, orderBy) {
  return order === "desc"
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

// EnhancedTableHead Component
function EnhancedTableHead({
  headCells,
  onSelectAllClick,
  order,
  orderBy,
  numSelected,
  rowCount,
  onRequestSort,
}) {
  const createSortHandler = (property) => (event) => {
    onRequestSort(event, property);
  };

  return (
    <TableHead>
      <TableRow>
        <TableCell padding="checkbox">
          <Checkbox
            color="primary"
            indeterminate={numSelected > 0 && numSelected < rowCount}
            checked={rowCount > 0 && numSelected === rowCount}
            onChange={onSelectAllClick}
            inputProps={{
              "aria-label": "select all rows",
            }}
          />
        </TableCell>
        {headCells.map((headCell) => (
          <TableCell
            key={headCell.id}
            align={headCell.numeric ? "right" : "left"}
            // align={headCell.numeric ? "right" : "center"}
            padding={headCell.disablePadding ? "none" : "normal"}
            sortDirection={orderBy === headCell.id ? order : false}
          >
            <TableSortLabel
              active={orderBy === headCell.id}
              direction={orderBy === headCell.id ? order : "asc"}
              onClick={createSortHandler(headCell.id)}
            >
              {headCell.label}
              {orderBy === headCell.id ? (
                <Box
                  component="span"
                  sx={visuallyHidden}
                >
                  {order === "desc" ? "sorted descending" : "sorted ascending"}
                </Box>
              ) : null}
            </TableSortLabel>
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
}

// EnhancedTableHead.propTypes = {
//   headCells: PropTypes.array.isRequired,
//   onSelectAllClick: PropTypes.func.isRequired,
//   order: PropTypes.string.isRequired,
//   orderBy: PropTypes.string.isRequired,
//   selectedItems: PropTypes.array.isRequired,
//   rowCount: PropTypes.number.isRequired,
//   onRequestSort: PropTypes.func.isRequired,
// };

// EnhancedTableToolbar Component
function EnhancedTableToolbar({
  selectedItems,
  title,
  onClickDelete,
  onClickEdit,
}) {
  const numSelected = selectedItems.length;
  return (
    <Toolbar
      sx={[
        {
          pl: { sm: 2 },
          pr: { xs: 1, sm: 1 },
        },
        numSelected > 0 && {
          bgcolor: (theme) =>
            alpha(
              theme.palette.primary.main,
              theme.palette.action.activatedOpacity,
            ),
        },
      ]}
    >
      {numSelected > 0 ? (
        <>
          {/* Selected Count */}
          <Typography
            sx={{ flex: "1 1 100%" }}
            color="inherit"
            variant="subtitle1"
            component="div"
          >
            {numSelected} selected
          </Typography>

          <div
            style={{
              display: "flex",
              justifyContent: "flex-end",
              padding: "10px",
            }}
          >
            {numSelected == 1 && (
              <button
                // className={commonStyle.editButton}
                onClick={() => onClickEdit(selectedItems[0])}
                style={{ marginRight: "10px" }}
              >
                Edit
              </button>
            )}
            <button
              // className={commonStyle.deleteButton}
              onClick={() => onClickDelete(selectedItems[0])}
            >
              Delete
            </button>
          </div>
        </>
      ) : (
        title && (
          // Title Display
          <Typography
            sx={{ flex: "1 1 100%" }}
            variant="h6"
            id="tableTitle"
            component="div"
          >
            {title}
          </Typography>
        )
      )}
    </Toolbar>
  );
}

// EnhancedTableToolbar.propTypes = {
//   numSelected: PropTypes.number.isRequired,
//   title: PropTypes.string.isRequired,
// };

// Main CommonTable Component
export const CommonTable = ({
  rows,
  headCells,
  title = "",
  onClickDelete,
  onClickEdit,
  selected,
  setSelected,
  searchTerm = "",
  rowsPerPageOptions = [],
}) => {
  const defaultRowsPerPage = [5, 10, 25];
  const rowsPerPageOpts =
    rowsPerPageOptions.length > 0 ? rowsPerPageOptions : defaultRowsPerPage;

  const [order, setOrder] = useState("asc");
  const [orderBy, setOrderBy] = useState(headCells[0].id);
  const [page, setPage] = useState(0);
  const [dense, setDense] = useState(false);
  const [rowsPerPage, setRowsPerPage] = useState(rowsPerPageOpts[0]);

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelected = rows.map((n) => n.id);
      setSelected(newSelected);
      return;
    }
    setSelected([]);
  };

  const handleClick = (event, id) => {
    const selectedIndex = selected.indexOf(id);
    let newSelected = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, id);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1),
      );
    }
    setSelected(newSelected);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  useEffect(() => {
    setPage(0);
  }, [searchTerm]);

  const handleChangeDense = (event) => {
    setDense(event.target.checked);
  };

  const emptyRows =
    page > 0 ? Math.max(0, (1 + page) * rowsPerPage - rows.length) : 0;

  const visibleRows = useMemo(
    () =>
      [...rows]
        .sort(getComparator(order, orderBy))
        .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage),
    [order, orderBy, page, rowsPerPage, rows],
  );

  return (
    <Box sx={{ width: "100%" }}>
      <Paper sx={{ width: "100%" }}>
        {selected.length > 0 && (
          <EnhancedTableToolbar
            selectedItems={selected}
            title={title}
            onClickDelete={onClickDelete}
            onClickEdit={onClickEdit}
          />
        )}
        {/* {selected.length > 0 && (
          <div  className="d-flex justify-content-end" style={{}}>
            <div style={{ padding: "10px" }}>
              <Button
                variant="contained"
                color="primary"
                onClick={onClickEdit}
                style={{ marginRight: "10px" }}
              >
                Edit
              </Button>
              <Button
                variant="contained"
                color="secondary"
                onClick={onClickDelete}
              >
                Delete
              </Button>
            </div>
          </div>
        )} */}
        <TableContainer>
          <Table
            sx={{ minWidth: 750 }}
            aria-labelledby="tableTitle"
            size={dense ? "small" : "medium"}
          >
            <EnhancedTableHead
              headCells={headCells}
              numSelected={selected.length}
              order={order}
              orderBy={orderBy}
              onSelectAllClick={handleSelectAllClick}
              onRequestSort={handleRequestSort}
              rowCount={rows.length}
            />
            <TableBody>
              {visibleRows.map((row, index) => {
                const isItemSelected = selected.includes(row.id);
                const labelId = `enhanced-table-checkbox-${index}`;

                return (
                  <TableRow
                    hover
                    onClick={(event) => handleClick(event, row.id)}
                    role="checkbox"
                    aria-checked={isItemSelected}
                    tabIndex={-1}
                    key={row.id}
                    selected={isItemSelected}
                    sx={{ cursor: "pointer" }}
                  >
                    {/* Checkbox Cell */}
                    <TableCell padding="checkbox">
                      <Checkbox
                        color="primary"
                        checked={isItemSelected}
                        inputProps={{ "aria-labelledby": labelId }}
                      />
                    </TableCell>

                    {/* Dynamic Cells Based on headCells */}
                    {headCells.map((headCell) => {
                      let value = row[headCell.id];

                      // Optional formatting logic based on field type
                      if (headCell.upperCase) value = convertToUpperCase(value);
                      if (headCell.stringify) value = JSON.stringify(value);
                      // Handle Action Button
                      if (headCell.id === "action") {
                        return (
                          <TableCell
                            key={headCell.id}
                            align="left"
                          >
                            <button
                              className="mx-2 text-yellow-500 hover:text-yellow-600 text-lg "
                              onClick={(event) => {
                                event.stopPropagation();
                                onClickEdit(row.id);
                              }}
                              title="Edit"
                            >
                              <FiEdit className="inline-block cursor-pointer" />
                            </button>
                          </TableCell>
                        );
                      }

                      return (
                        <TableCell
                          key={headCell.id}
                          align="left"
                          title={row[headCell.id]}
                        >
                          {value || "-"}
                        </TableCell>
                      );
                    })}
                  </TableRow>
                );
              })}
              {emptyRows > 0 && (
                <TableRow style={{ height: (dense ? 33 : 53) * emptyRows }}>
                  <TableCell colSpan={6} />
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={rowsPerPageOpts}
          component="div"
          count={rows.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>
      <FormControlLabel
        control={
          <Switch
            checked={dense}
            onChange={handleChangeDense}
          />
        }
        label="Dense padding"
      />
    </Box>
  );
};

// CommonTable.propTypes = {
//   rows: PropTypes.array.isRequired,
//   headCells: PropTypes.array.isRequired,
//   title: PropTypes.string,
// };
