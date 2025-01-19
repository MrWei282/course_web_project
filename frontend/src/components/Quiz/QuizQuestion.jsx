import React from 'react';

import { Box, Checkbox, Divider, FormControl, FormControlLabel, FormGroup, FormHelperText, TextField, Typography } from '@mui/material';
import config from 'config.json';

const questionTypes = {
  multiple_choice: 'Multiple Choice',
  short_answer: 'Short Answer'
};

const QuizQuestion = ({ question, editable, answers, setAnswers, errors }) => {
  return (
    <Box>
      <Divider sx={{ my: 2 }} />
      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
        <Box>
          <Typography fontWeight='bold'>
            Q{question.question_id}: {question.question}
          </Typography>
          {question.file_base64 && (<Box component="img" src={question.file_base64} maxHeight={150}/>)}
        </Box>
        <Box>
          <Typography>
            Worth {question.max_mark} mark{question.max_mark === 1 ? '' : 's'}
          </Typography>
          <Typography fontSize='small' align='right'>
            {questionTypes[question.type]}
          </Typography>
        </Box>
      </Box>

      {
      (question.type === 'multiple_choice' &&
      <FormControl
        error={errors[question.question_id] !== ''}
        component="fieldset"
      >
        <FormGroup>
          {config.quizzes.mc_answers.map((answer, idx) =>
            <FormControlLabel key={idx} label={question[`choice_${answer}`]} control={
              <Checkbox disabled={editable} checked={answers[question.question_id] === answer} onChange={() => setAnswers({ ...answers, [question.question_id]: answer })} />
            }/>
          )}
        </FormGroup>
        <FormHelperText>{errors[question.question_id]}</FormHelperText>
        </FormControl>
      ) ||
      (question.type === 'short_answer' &&
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
    </Box>
  )
}

export default QuizQuestion;
