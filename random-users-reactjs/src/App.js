import * as React from 'react';
import PropTypes from 'prop-types';
import Box from '@mui/material/Box';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import TableSortLabel from '@mui/material/TableSortLabel';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import FormControlLabel from '@mui/material/FormControlLabel';
import Switch from '@mui/material/Switch';
import TextField from '@mui/material/TextField';
import { visuallyHidden } from '@mui/utils';
import Alert from '@mui/material/Alert';

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
  return order === 'desc'
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

function stableSort(array, comparator) {
  const stabilizedThis = array.map((el, index) => [el, index]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) {
      return order;
    }
    return a[1] - b[1];
  });
  return stabilizedThis.map((el) => el[0]);
}

const headCells = [
  {
    id: 'name',
    numeric: false,
    disablePadding: true,
    label: 'Ad',
    background: '#b3ffb3',
    
  },
  {
    id: 'surname',
    numeric: true,
    disablePadding: false,
    label: 'Soyad',
    background: '#b3ffb3',
  },
  {
    id: 'age',
    numeric: true,
    disablePadding: false,
    label: 'Yaş',
    background: '#b3ffb3',
  },
  {
    id: 'gender',
    numeric: true,
    disablePadding: false,
    label: 'Cinsiyet',
    background: '#b3ffb3',
  },
  {
    id: 'country',
    numeric: true,
    disablePadding: false,
    label: 'Ülke',
    background: '#b3ffb3',
  },
  {
    id: 'state',
    numeric: true,
    disablePadding: false,
    label: 'Şehir',
    background: '#b3ffb3',
  },
];

function EnhancedTableHead(props) {
  const { order, orderBy, onRequestSort } = props;
  const createSortHandler = (property) => (event) => {
    onRequestSort(event, property);
  };

  return (
    <TableHead>
      <TableRow>
        {headCells.map((headCell) => (
          <TableCell
            key={headCell.id}
            align={headCell.numeric ? 'right' : 'left'}
            padding={headCell.disablePadding ? 'none' : 'normal'}
            sortDirection={orderBy === headCell.id ? order : false}
            sx={{ background: headCell.background, fontWeight: 'bold',}}
          >
            <TableSortLabel
              active={orderBy === headCell.id}
              direction={orderBy === headCell.id ? order : 'asc'}
              onClick={createSortHandler(headCell.id)}
            >
              {headCell.label}
              {orderBy === headCell.id ? (
                <Box component="span" sx={visuallyHidden}>
                  {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                </Box>
              ) : null}
            </TableSortLabel>
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
}

EnhancedTableHead.propTypes = {
  onRequestSort: PropTypes.func.isRequired,
  order: PropTypes.oneOf(['asc', 'desc']).isRequired,
  orderBy: PropTypes.string.isRequired,
};

function EnhancedTableToolbar(props) {
  return (
    <Toolbar
      sx={{
        pl: { sm: 2 },
        pr: { xs: 1, sm: 1 },
        pb: 2,
      }}
    >
      <Typography
        sx={{ flex: '1 1 100%' }}
        variant="h6"
        id="tableTitle"
        component="div"
      >
      
      </Typography>
    </Toolbar>
  );
}

export default function EnhancedTable() {
  const [order, setOrder] = React.useState('asc');
  const [orderBy, setOrderBy] = React.useState('name');
  const [page, setPage] = React.useState(0);
  const [dense, setDense] = React.useState(false);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);
  const [data, setData] = React.useState([]);
  const [search, setSearch] = React.useState('');
  const [error, setError] = React.useState(null);

  React.useEffect(() => {
    fetch('https://randomuser.me/api/?results=200')
      .then((response) => {
        if (!response.ok) {
          throw new Error('Ağ hatası oluştu');
        }
        return response.json();
      })
      .then((data) => {
        const formattedData = data.results.map((result, index) => ({
          id: index + 1,
          name: result.name.first,
          surname: result.name.last,
          age: result.dob.age,
          gender: result.gender,
          country: result.location.country,
          state: result.location.state,
        }));
        setData(formattedData);
      })
      .catch((error) => {
        console.error('Veri çekme hatası:', error);
        setError('API\'den veri çekerken hata oluştu. Lütfen daha sonra tekrar deneyin.');
      });
  }, []);

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleChangeDense = (event) => {
    setDense(event.target.checked);
  };

  const emptyRows =
    page > 0 ? Math.max(0, (1 + page) * rowsPerPage - data.length) : 0;

  const visibleRows = React.useMemo(
    () =>
      stableSort(
        data.filter((row) => {
          return (
            row.name.toLowerCase().includes(search.toLowerCase()) ||
            row.surname.toLowerCase().includes(search.toLowerCase()) ||
            row.gender.toLowerCase().includes(search.toLowerCase()) ||
            row.country.toLowerCase().includes(search.toLowerCase())
          );
        }),
        getComparator(order, orderBy)
      ).slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage),
    [order, orderBy, page, rowsPerPage, data, search]
  );

  return (
    <Box sx={{ width: '90%', margin: '0 auto' }}>
      <Paper sx={{ width: '100%', mb: 2, }}>
        <EnhancedTableToolbar />
        <Toolbar
          sx={{
            
            pl: { sm: 2 },
            pr: { xs: 1, sm: 1 },
            pb: 2,
            
          }}
        >
          <Typography
            sx={{ flex: '1 1 100%' ,}}
            variant="h6"
            id="tableTitle"
            component="div"
          >
            Users
          </Typography>
          <TextField
       
            label="Search"
            variant="outlined"
            size="small"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            sx={{ borderRadius: '15px', '& .MuiOutlinedInput-root': { borderRadius: '15px' } }}
          />
        </Toolbar>
        {error && <Alert severity="error" onClose={() => setError(null)}>{error}</Alert>}
        <TableContainer>
          <Table 
          
            sx={{ 
              minWidth: 750,
             
            
             }}
            aria-labelledby="tableTitle"
            size={dense ? 'small' : 'medium'}
            
          >
            <EnhancedTableHead
              order={order}
              orderBy={orderBy}
              onRequestSort={handleRequestSort}
            />
            <TableBody sx={{fontWeight: 'bold'}}>
              {visibleRows.map((row, index) => (
                <TableRow
                sx={{fontWeight:"bold"}}
                  hover
                  role="checkbox"
                  tabIndex={-1}
                  key={row.id}          
                >
                  <TableCell  component="th" scope="row">
                    {row.name}
                  </TableCell>
                  <TableCell  align="right">  {row.surname}</TableCell>
                  <TableCell align="right">{row.age}</TableCell>
                  <TableCell align="right">{row.gender}</TableCell>
                  <TableCell align="right">{row.country}</TableCell>
                  <TableCell align="right">{row.state}</TableCell>
                </TableRow>
              ))}
              {emptyRows > 0 && (
                <TableRow
                  style={{
                    height: (dense ? 33 : 53) * emptyRows,
                  }}
                >
                  <TableCell colSpan={5} />
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25, 50, 100, 200]}
          component="div"
          count={data.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>
      <FormControlLabel
        control={<Switch checked={dense} onChange={handleChangeDense} />}
        label="Padding"
      />
    </Box>
  );
}
