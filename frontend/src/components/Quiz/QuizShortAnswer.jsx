import React from 'react';

import { TextField } from '@mui/material';

const QuizShortAnswer = ({ question, editable, answers, setAnswers, errors }) => {
  return (
    <TextField
      sx={{ mt: 1 }}
      fullWidth
      disabled={editable}
      value={answers[question.question_id]}
      onChange={(e) => setAnswers({ ...answers, [question.question_id]: e.target.value })}
      label="Write your answer here..."
      multiline
      rows={2}
      size="small"
      error={errors[question.question_id] !== ''}
      helperText={errors[question.question_id]}
    />
  )
}

export default QuizShortAnswer;
