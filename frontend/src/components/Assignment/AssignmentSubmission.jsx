import React from 'react';

import axios from 'axios';
import { triggerBase64Download } from 'common-base64-downloader-react';

import { Box, Button, Typography } from '@mui/material';
import dayjs from 'dayjs';

const AssignmentSubmission = ({ submission, token, courseId }) => {
  const handleDownload = () => {
    axios.get('/course/download_submission', {
      params: {
        token,
        course_id: courseId,
        submission_id: submission.submission_id
      }
    })
      .then(res => triggerBase64Download(res.data.submission.file, res.data.submission.name))
  }

  return (
    <Box>
      <Typography>
        Submitted at {dayjs(submission.submission_time).format('DD/MM/YYYY h:mm A')}
      </Typography>
      {submission.assignment_grade !== null
        ? <Box>
            <Typography fontWeight='bold'>
              Marked
            </Typography>
            <Typography fontWeight='bold'>
              Mark: {submission.assignment_grade} / {submission.assignment_max_grade}
            </Typography>
            <Typography fontWeight='bold'>
              Feedback: {submission.submission_note}
            </Typography>
          </Box>
        : <Typography fontWeight='bold'>
            Unmarked
          </Typography>
      }
      <Button onClick={handleDownload} label="download submission button" variant="contained">
        Download Latest Submission
      </Button>
    </Box>
  )
};

export default AssignmentSubmission;
