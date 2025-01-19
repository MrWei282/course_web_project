import React from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import { triggerBase64Download } from 'common-base64-downloader-react';

import { Box, Button, Tab, Tabs, TextField } from '@mui/material';

import config from 'config.json';
import AuthContext from 'AuthContext';
import CoursePage from 'components/Course/CoursePage';
import ResourceDisplay from 'components/Resource/ResourceDisplay';

const CourseResources = () => {
  const navigate = useNavigate();
  const { courseid } = useParams();
  const [search, setSearch] = React.useState('');
  const [role, setRole] = React.useState('student');
  const [resources, setResources] = React.useState([]);
  const [resourcesSearch, setResourcesSearch] = React.useState([]);

  const { token } = React.useContext(AuthContext);

  const [userClasses, setUserClasses] = React.useState([]);
  const [value, setValue] = React.useState(0);

  const handleDownload = (resource) => {
    axios.get('/course/download_resource', {
      params: {
        token,
        course_id: courseid,
        resource_id: resource.resource_id
      }
    })
      .then(res => triggerBase64Download(res.data.resource.file, res.data.resource.name))
  }

  React.useEffect(() => {
    axios.get('/course/get_resources', {
      params: {
        token,
        course_id: courseid
      }
    })
      .then(res => {
        console.log(res.data)
        setResources(res.data.all_resource_info)
      })
      .catch(() => navigate('/logout'))

    axios.get('/course/get_user_classes', {
      params: {
        token,
        course_id: courseid,
      }
    })
      .then(res => setUserClasses(res.data.class_ids))
  }, []);

  React.useEffect(() => {
    if (search !== '') {
      axios.get('/search_resources', {
        params: {
          token,
          search_term: search,
          course_id: courseid
        }
      })
        .then(res => setResourcesSearch([res.data.resource_info]))
    }
  }, [search])

  return (
    <CoursePage
      page={'resources'}
      title={'Resources'}
      getRole
      setRole={setRole}
    >
      <TextField fullWidth={!config[role].resources.create} sx={{ mb: 2 }} label="Search resources" variant="outlined" size="small" onChange={(e) => setSearch(e.target.value)} />
      {(config[role].resources.create &&
        <Button sx={{ ml: 2, mb: 2 }} onClick={() => navigate(`/course/${courseid}/resources/create-resource`)} label="create resource" variant="contained">
          Create Resource
        </Button>
      )}

      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 1 }}>
        <Tabs value={value} onChange={(_, newValue) => setValue(newValue)}>
          <Tab label="Course" />
          <Tab label="Class" />
        </Tabs>
      </Box>

      <Box display={value === 0 ? 'block' : 'none'}>
        <ResourceDisplay handleDownload={handleDownload} resources={
          (search === '' ? resources : resourcesSearch)
            .filter(resource => resource.class_id === null)
          }
        />
      </Box>

      <Box display={value === 1 ? 'block' : 'none'}>
        <ResourceDisplay
          handleDownload={handleDownload}
          showClass
          resources={
            config[role].resources.view_all
              ? (search === '' ? resources : resourcesSearch)
                  .filter(resource => resource.class_id !== null)
              : (search === '' ? resources : resourcesSearch)
                  .filter(resource => userClasses.includes(resource.class_id))
          }
        />
      </Box>

    </CoursePage>
  )
};

export default CourseResources;
