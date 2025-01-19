import React from 'react'
import axios from 'axios'
import { useNavigate, useParams } from 'react-router-dom'

import {
  Button,
  Link,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@mui/material'
import AuthContext from 'AuthContext';
import config from 'config.json';

import CreateIcon from '@mui/icons-material/Create'
import CoursePage from 'components/Course/CoursePage';

const CourseForum = () => {
  const navigate = useNavigate()
  const [role, setRole] = React.useState('student')
  const { courseid } = useParams()
  const [categories, setCategories] = React.useState([])
  const { token } = React.useContext(AuthContext);

  React.useEffect(() => {
    axios
      .get('/course/categories', {
        params: {
          token,
          course_id: courseid,
        },
      })
      .then((res) => setCategories(res.data.categories))
  }, [])

  return (
    <CoursePage
      page={'forums'}
      title={'Forums'}
      getRole
      setRole={setRole}
      titleEnd={
        config[role].forums.create &&
        <Button sx={{ ml: 1, mb: 1 }} variant='contained' onClick={() =>
          navigate(`/course/${courseid}/forums/create-forum`)
        }>
          Create New Forum
          <CreateIcon sx={{ ml: 1 }} fontSize='small' />
        </Button>
      }
    >
      <TableContainer>
        <Table aria-label='forums table'>
          <TableHead>
            <TableRow sx={{ backgroundColor: 'primary.main' }}>
              <TableCell
                sx={{
                  color: 'white',
                  fontWeight: 'bold',
                  width: 1,
                }}>
                Discussion Forums
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {Array.isArray(categories)
              ? (
            <>
            {categories.map((category, idx) => (
            <TableRow
              key={idx}
              sx={{
                cursor: 'pointer',
                transition: 'background-color 0.1s ease-in-out',
                '&:hover': { backgroundColor: 'primary.light' },
              }}
            >
              <TableCell sx={{ whiteSpace: 'nowrap' }} onClick={() => navigate(`/course/${courseid}/forums/${category}/view-forum`)}>
                <Link>
                  {category}
                </Link>
              </TableCell>
            </TableRow>
            ))}
            </>
                )
              : (
            <p>No categories found.</p>
                )}
          </TableBody>
        </Table>
      </TableContainer>
    </CoursePage>
  )
}

export default CourseForum
